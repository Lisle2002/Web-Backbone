/* Web Backbone shared core (optional). One file instead of per-component copies.
   Include once: <script src="wb-all.js" defer></script>. Needs wb-all.css. */
/* ---- wb core 1.1: identical in every component; safe to include more than once ---- */
(function () {
  var VERSION = '1.1';
  var W = (window.WB = window.WB || {});
  if (W.core) {
    if (W.core !== VERSION) {
      console.warn('[wb] Two versions of the wb core are on this page (' + W.core + ' and ' + VERSION + '). The first one loaded is used.');
    }
    return;
  }
  W.core = VERSION;
  W.parts = {};
  W.flags = {};
  var counter = 0;
  var starting = [];

  /* Unique id for generated markup, for example "wb-faq-3". An id that is already on the page
     (for example one your own site uses) is skipped. */
  W.uid = function (prefix) {
    var id;
    do {
      counter += 1;
      id = 'wb-' + prefix + '-' + counter;
    } while (document.getElementById(id));
    return id;
  };

  /* Reads data-wb-<key> from an element. Returns fallback when missing or empty. */
  W.opt = function (el, key, fallback) {
    var value = el.getAttribute('data-wb-' + key);
    value = value === null ? '' : value.trim();
    return value === '' ? fallback : value;
  };

  /* True when a setting is empty or still contains a YOUR_... placeholder. */
  W.todo = function (value) {
    return !value || /YOUR_[A-Z0-9_]+/.test(value);
  };

  /* Runs fn one time per page for a given key. */
  W.once = function (key, fn) {
    if (!W.flags[key]) { W.flags[key] = true; fn(); }
  };

  /* Dispatches a bubbling "wb:<name>" event from el. */
  W.emit = function (el, name, detail) {
    el.dispatchEvent(new CustomEvent('wb:' + name, { bubbles: true, detail: detail || {} }));
  };

  W.ready = function (fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  };

  /* Starts every [data-wb="<name>"] inside root (root included) that has not started yet.
     data-wb-ready is set only after the component's start-up finished without an error.
     If it failed, the element gets data-wb-error (holding the message) and can be started again by
     fixing the markup and calling WB.init(container). Call WB.init(container) after you insert new
     markup with JavaScript. */
  W.init = function (root, only) {
    root = root || document;
    Object.keys(W.parts).forEach(function (name) {
      if (only && only !== name) { return; }
      var selector = '[data-wb="' + name + '"]';
      var found = Array.prototype.slice.call(root.querySelectorAll(selector));
      if (root.nodeType === 1 && root.matches(selector)) { found.unshift(root); }
      found.forEach(function (el) {
        if (el.hasAttribute('data-wb-ready') || starting.indexOf(el) >= 0) { return; }
        starting.push(el);
        try {
          W.parts[name](el);
          el.setAttribute('data-wb-ready', '');
          el.removeAttribute('data-wb-error');
        } catch (err) {
          var message = String((err && err.message) || err);
          if (el.getAttribute('data-wb-error') !== message) {
            console.error('[wb ' + name + ']', err);
          }
          el.setAttribute('data-wb-error', message);
        } finally {
          starting.splice(starting.indexOf(el), 1);
        }
      });
    });
  };

  /* Registers a component. The first copy of a component on the page wins. */
  W.define = function (name, init) {
    if (!W.parts[name]) { W.parts[name] = init; }
    W.ready(function () { W.init(document, name); });
  };
})();

/* directions-links */
(function () {
  var LATLNG = /^-?\d{1,3}(\.\d+)?,\s*-?\d{1,3}(\.\d+)?$/;

  var providers = {
    google: {
      label: 'Directions in Google Maps',
      url: function (destination, mode) {
        var ok = { driving: 1, walking: 1, bicycling: 1, transit: 1 };
        return 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(destination) +
          (ok[mode] ? '&travelmode=' + mode : '');
      }
    },
    apple: {
      label: 'Directions in Apple Maps',
      url: function (destination, mode) {
        var flags = { driving: 'd', walking: 'w', transit: 'r' };
        return 'https://maps.apple.com/?daddr=' + encodeURIComponent(destination) +
          (flags[mode] ? '&dirflg=' + flags[mode] : '');
      }
    }
  };

  WB.define('directions-links', function (el) {
    var list = el.querySelector('[data-wb-links]');
    var addressEl = el.querySelector('[data-wb-address]');
    var latlng = WB.opt(el, 'latlng', '');
    var text = addressEl ? addressEl.textContent.replace(/\s+/g, ' ').trim() : '';
    var destination = latlng || text;

    if (!list || WB.todo(destination)) {
      el.setAttribute('data-wb-state', 'unconfigured');
      console.warn('[wb directions-links] Put your address in the data-wb-address element.');
      return;
    }
    if (latlng && !LATLNG.test(latlng)) {
      el.setAttribute('data-wb-state', 'invalid');
      console.warn('[wb directions-links] data-wb-latlng must look like 12.3456,-65.4321');
      return;
    }

    var mode = WB.opt(el, 'travelmode', 'driving');
    var names = WB.opt(el, 'providers', 'google,apple').split(',');
    names.forEach(function (raw) {
      var name = raw.trim().toLowerCase();
      var provider = providers[name];
      if (!provider) { console.warn('[wb directions-links] Unknown provider: ' + name); return; }

      var link = document.createElement('a');
      link.href = provider.url(destination, mode);
      link.target = '_blank';
      link.rel = 'noopener';
      link.appendChild(document.createTextNode(WB.opt(el, 'label-' + name, provider.label)));
      var hint = document.createElement('span');
      hint.className = 'wb-directions__sr';
      hint.textContent = ' (opens in a new tab)';
      link.appendChild(hint);

      var item = document.createElement('li');
      item.appendChild(link);
      list.appendChild(item);
    });
    el.setAttribute('data-wb-state', 'ready');
  });
})();

/* calendly */
(function () {
  var SCRIPT = 'https://assets.calendly.com/assets/external/widget.js';
  var STYLE = 'https://assets.calendly.com/assets/external/widget.css';
  var ORIGIN = 'https://calendly.com';
  var LOAD_MS = 10000; /* the longest we wait for Calendly's script, in milliseconds */
  var activePopup = null;

  function validUrl(value) {
    if (WB.todo(value)) { return null; }
    try {
      var u = new URL(value, location.href);
      var host = u.hostname.toLowerCase();
      var ok = u.protocol === 'https:' && (host === 'calendly.com' || /\.calendly\.com$/.test(host));
      return ok ? u.href : null;
    } catch (err) { return null; }
  }

  function waitFor(test, ms) {
    return new Promise(function (resolve, reject) {
      var started = Date.now();
      (function poll() {
        if (test()) { resolve(); } else if (Date.now() - started > ms) { reject(new Error('timeout')); } else { setTimeout(poll, 100); }
      })();
    });
  }

  /* Gives up on a promise that neither finishes nor fails (for example a request that stalls). */
  function withTimeout(promise, ms) {
    return new Promise(function (resolve, reject) {
      var timer = setTimeout(function () { reject(new Error('timeout')); }, ms);
      promise.then(function (value) { clearTimeout(timer); resolve(value); }, function (err) { clearTimeout(timer); reject(err); });
    });
  }

  /* Loads Calendly's files one time per page, even if several components ask.
     Waits at most LOAD_MS in total; after that the caller uses its fallback. */
  function loadCalendly() {
    if (window.Calendly) { return Promise.resolve(window.Calendly); }
    if (WB.calendlyLoading) { return WB.calendlyLoading; }
    if (!document.querySelector('link[href^="' + STYLE + '"]')) {
      var css = document.createElement('link');
      css.rel = 'stylesheet';
      css.href = STYLE;
      document.head.appendChild(css);
    }
    var existing = document.querySelector('script[src^="' + SCRIPT + '"]');
    var wait;
    if (existing) {
      wait = waitFor(function () { return !!window.Calendly; }, LOAD_MS);
    } else {
      wait = new Promise(function (resolve, reject) {
        var s = document.createElement('script');
        s.src = SCRIPT;
        s.async = true;
        s.onload = resolve;
        s.onerror = function () { s.remove(); reject(new Error('blocked or unreachable')); };
        document.head.appendChild(s);
      }).then(function () { return waitFor(function () { return !!window.Calendly; }, LOAD_MS); });
    }
    /* A script tag that is still loading is left in place when we give up: if it arrives later,
       window.Calendly exists and the next attempt works at once. */
    WB.calendlyLoading = withTimeout(wait, LOAD_MS).then(function () { return window.Calendly; });
    WB.calendlyLoading.catch(function () { WB.calendlyLoading = null; });
    return WB.calendlyLoading;
  }

  /* Calendly tells the page when a booking is made. Only messages from Calendly itself are used,
     and no booking details are passed on. */
  function listenForBookings() {
    window.addEventListener('message', function (event) {
      if (event.origin !== ORIGIN || !event.data || event.data.event !== 'calendly.event_scheduled') { return; }
      var roots = document.querySelectorAll('[data-wb="calendly"]');
      var target = null;
      Array.prototype.forEach.call(roots, function (root) {
        var frame = root.querySelector('iframe');
        if (frame && frame.contentWindow === event.source) { target = root; }
      });
      WB.emit(target || activePopup || document.documentElement, 'calendly-scheduled', {});
    });
  }

  function setup(el) {
    var mode = WB.opt(el, 'mode', 'inline');
    var link = el.tagName === 'A' ? el : el.querySelector('a[href]');
    var url = validUrl(WB.opt(el, 'url', link ? link.getAttribute('href') : ''));
    if (!url) {
      el.setAttribute('data-wb-state', 'unconfigured');
      console.warn('[wb calendly] Set the link to your https://calendly.com/... scheduling page.');
      return;
    }
    WB.once('calendly-message', listenForBookings);

    if (mode === 'popup') {
      var waiting = false;
      el.addEventListener('click', function (event) {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) { return; }
        event.preventDefault();
        if (waiting) { return; }
        waiting = true;
        activePopup = el;
        el.setAttribute('data-wb-state', 'loading');
        el.setAttribute('aria-busy', 'true');
        function finished() {
          waiting = false;
          el.setAttribute('data-wb-state', 'ready');
          el.removeAttribute('aria-busy');
        }
        loadCalendly().then(function (Calendly) {
          finished();
          Calendly.initPopupWidget({ url: url });
        }).catch(function () {
          finished();
          window.location.assign(url);
        });
      });
      el.setAttribute('data-wb-state', 'ready');
      return;
    }

    /* inline */
    var frame = document.createElement('div');
    frame.className = 'wb-calendly__frame';
    var height = parseInt(WB.opt(el, 'height', '700'), 10);
    frame.style.height = (height >= 300 && height <= 2400 ? height : 700) + 'px';
    var status = document.createElement('p');
    status.className = 'wb-calendly__status';
    status.setAttribute('role', 'status');
    el.insertBefore(frame, el.firstChild);
    el.insertBefore(status, frame);
    var started = false;

    function start() {
      if (started) { return; }
      started = true;
      status.textContent = 'Loading the booking calendar…';
      loadCalendly().then(function (Calendly) {
        status.textContent = '';
        Calendly.initInlineWidget({ url: url, parentElement: frame });
        el.setAttribute('data-wb-state', 'ready');
      }).catch(function () {
        started = false;
        frame.hidden = true;
        status.textContent = 'The booking calendar could not load. Use the link below to book on Calendly.';
        el.setAttribute('data-wb-state', 'failed');
      });
    }

    var when = WB.opt(el, 'load', 'visible');
    if (when === 'click') {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'wb-calendly__button';
      button.textContent = 'Show booking calendar';
      button.addEventListener('click', function () { button.remove(); start(); });
      el.insertBefore(button, el.firstChild);
    } else if (when === 'visible' && 'IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        if (entries.some(function (entry) { return entry.isIntersecting; })) { observer.disconnect(); start(); }
      }, { rootMargin: '200px' });
      observer.observe(el);
    } else {
      start();
    }
  }

  WB.define('calendly', setup);
})();

/* contact-form */
(function () {
  function providerMessage(json) {
    if (!json || typeof json !== 'object') { return ''; }
    var text = json.error || (json.errors && json.errors[0] && json.errors[0].message) || json.message;
    return typeof text === 'string' ? text.slice(0, 200) : '';
  }

  WB.define('contact-form', function (form) {
    var provider = WB.opt(form, 'provider', 'formspree');
    var endpoint = form.getAttribute('action') || '';
    var status = form.querySelector('[data-wb-status]');
    var button = form.querySelector('button[type="submit"], input[type="submit"]');
    var timeout = parseInt(WB.opt(form, 'timeout', '15000'), 10) || 15000;
    var successText = WB.opt(form, 'success', 'Thank you. Your message was submitted.');
    var failureText = WB.opt(form, 'failure', 'Your message could not be sent.');
    var busy = false;

    if (!status || !button) { throw new Error('contact-form needs a [data-wb-status] element and a submit button'); }

    if (WB.todo(endpoint) || !/^https:\/\//i.test(endpoint)) {
      form.setAttribute('data-wb-state', 'unconfigured');
      console.warn('[wb contact-form] Set the form action to your https:// form-service endpoint.');
    }

    function show(kind, text, withRetry) {
      status.textContent = '';
      var p = document.createElement('p');
      p.setAttribute('data-wb-kind', kind);
      p.textContent = text;
      status.appendChild(p);
      if (withRetry) {
        var retry = document.createElement('button');
        retry.type = 'button';
        retry.className = 'wb-form__retry';
        retry.textContent = 'Try again';
        retry.addEventListener('click', function () {
          if (typeof form.requestSubmit === 'function') { form.requestSubmit(button); } else { button.click(); }
        });
        status.appendChild(retry);
      }
    }

    function finish() {
      busy = false;
      button.removeAttribute('aria-disabled');
      form.removeAttribute('aria-busy');
    }

    function send() {
      busy = true;
      button.setAttribute('aria-disabled', 'true');
      form.setAttribute('aria-busy', 'true');
      show('info', 'Sending…', false);

      var controller = new AbortController();
      var timer = setTimeout(function () { controller.abort(); }, timeout);

      fetch(endpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
        credentials: 'omit',
        signal: controller.signal
      }).then(function (response) {
        return response.text().then(function (text) {
          var json = null;
          try { json = JSON.parse(text); } catch (err) { json = null; }
          return { ok: response.ok, json: json };
        });
      }).then(function (result) {
        var accepted = result.ok && (provider !== 'web3forms' || (result.json && result.json.success === true));
        if (!accepted) {
          var detail = providerMessage(result.json);
          throw new Error(detail || 'The form service did not accept the message.');
        }
        form.reset();
        show('success', successText, false);
        WB.emit(form, 'form-sent', { provider: provider });
      }).catch(function (err) {
        var timedOut = err && err.name === 'AbortError';
        var why = timedOut ? 'The request took too long.' : (err && err.message ? err.message : 'Check your connection.');
        show('error', failureText + ' ' + why, true);
        WB.emit(form, 'form-error', { provider: provider });
      }).then(function () {
        clearTimeout(timer);
        finish();
      });
    }

    form.addEventListener('submit', function (event) {
      var canEnhance = window.fetch && window.FormData && window.AbortController;
      if (!canEnhance) { return; }      /* the browser submits the form normally */
      event.preventDefault();
      if (busy) { return; }
      if (WB.todo(endpoint) || !/^https:\/\//i.test(endpoint)) {
        show('error', 'This form is not connected to a form service yet.', false);
        return;
      }
      if (provider === 'web3forms') {
        var key = form.querySelector('input[name="access_key"]');
        if (!key || WB.todo(key.value)) {
          show('error', 'This form is missing its Web3Forms access key.', false);
          return;
        }
      }
      if (!form.checkValidity()) { form.reportValidity(); return; }
      send();
    });
  });
})();

/* newsletter */
(function () {
  WB.define('newsletter', function (el) {
    var form = el.querySelector('form');
    var status = el.querySelector('[data-wb-status]');
    var button = el.querySelector('button[type="submit"]');
    if (!form || !status || !button) { throw new Error('newsletter needs a form, a submit button and a [data-wb-status] element'); }

    var bot = form.querySelector('input[name^="YOUR_"]');
    if (bot) {
      bot.parentNode.removeChild(bot);
      console.warn('[wb newsletter] Bot field placeholder removed; copy the real b_... field name from Mailchimp to keep it.');
    }

    var firstAction = form.getAttribute('action') || '';
    if (WB.todo(firstAction) || !/^https:\/\//i.test(firstAction)) {
      el.setAttribute('data-wb-state', 'unconfigured');
      console.warn('[wb newsletter] Set the form action to the URL from your Mailchimp embed code.');
    }

    form.addEventListener('submit', function (event) {
      var action = form.getAttribute('action') || '';
      if (WB.todo(action) || !/^https:\/\//i.test(action)) {
        event.preventDefault();
        status.textContent = 'This sign-up form is not connected to Mailchimp yet.';
        return;
      }
      if (button.getAttribute('aria-disabled') === 'true') {
        event.preventDefault();
        return;
      }
      /* The browser now posts the form to Mailchimp in a new tab. */
      button.setAttribute('aria-disabled', 'true');
      status.textContent = WB.opt(el, 'sent', 'Your sign-up was sent to Mailchimp. Finish any confirmation step shown there.');
      WB.emit(el, 'newsletter-submitted', {});
      setTimeout(function () { button.removeAttribute('aria-disabled'); }, 4000);
    });
  });
})();

/* add-to-calendar */
(function () {
  var PAD = function (n, size) { var s = String(n); while (s.length < (size || 2)) { s = '0' + s; } return s; };

  function daysInMonth(y, m) { return new Date(Date.UTC(y, m, 0)).getUTCDate(); }

  /* "2027-06-01" -> {y, m, d} or null (checks the calendar date really exists). */
  function parseDate(text) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
    if (!m) { return null; }
    var y = +m[1], mo = +m[2], d = +m[3];
    if (mo < 1 || mo > 12 || d < 1 || d > daysInMonth(y, mo)) { return null; }
    return { y: y, m: mo, d: d };
  }
  function dayStamp(p, plusDays) {
    var t = new Date(Date.UTC(p.y, p.m - 1, p.d + (plusDays || 0)));
    return PAD(t.getUTCFullYear(), 4) + PAD(t.getUTCMonth() + 1) + PAD(t.getUTCDate());
  }

  /* "2027-06-01T18:00:00-04:00" -> Date, only when a time zone is written. */
  function parseInstant(text) {
    var m = /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?(Z|[+-]\d{2}:\d{2})$/.exec(text);
    if (!m || !parseDate(m[1]) || +m[2] > 23 || +m[3] > 59 || (m[4] && +m[4] > 59)) { return null; }
    var date = new Date(text);
    return isNaN(date.getTime()) ? null : date;
  }
  function utcStamp(date) {
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  }

  /* Returns {allDay, start, end} where start/end are calendar stamps, or null when invalid. */
  function readWhen(el) {
    var startText = WB.opt(el, 'start', '');
    var endText = WB.opt(el, 'end', '');
    var day = parseDate(startText);
    if (day) {
      var last = endText ? parseDate(endText) : day;
      if (!last || dayStamp(last) < dayStamp(day)) { return null; }
      return { allDay: true, start: dayStamp(day), end: dayStamp(last, 1) };
    }
    var from = parseInstant(startText);
    if (!from) { return null; }
    var to;
    if (endText) {
      to = parseInstant(endText);
    } else {
      var minutes = parseInt(WB.opt(el, 'duration', '60'), 10);
      to = new Date(from.getTime() + (minutes > 0 ? minutes : 60) * 60000);
    }
    if (!to || to.getTime() <= from.getTime()) { return null; }
    return { allDay: false, start: utcStamp(from), end: utcStamp(to) };
  }

  function icsEscape(text) {
    return String(text).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '')
      .replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r\n|\r|\n/g, '\\n');
  }
  function byteLength(ch) {
    return window.TextEncoder ? new TextEncoder().encode(ch).length : ch.length;
  }
  /* Lines in .ics files may not be longer than 75 bytes; continue them on the next line after a space. */
  function fold(line) {
    var out = '', used = 0;
    Array.from(line).forEach(function (ch) {
      var size = byteLength(ch);
      if (used + size > 75) { out += '\r\n '; used = 1; }
      out += ch;
      used += size;
    });
    return out;
  }
  function hash(text) {
    var h = 5381;
    for (var i = 0; i < text.length; i++) { h = ((h << 5) + h + text.charCodeAt(i)) >>> 0; }
    return h.toString(16);
  }
  function slug(text) {
    var s = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    return s.slice(0, 40) || 'event';
  }

  function buildIcs(event, when) {
    var now = utcStamp(new Date());
    var lines = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Web Backbone//Add to calendar//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      'UID:wb-' + hash(event.title + when.start) + '@' + (location.hostname || 'local'),
      'DTSTAMP:' + now,
      when.allDay ? 'DTSTART;VALUE=DATE:' + when.start : 'DTSTART:' + when.start,
      when.allDay ? 'DTEND;VALUE=DATE:' + when.end : 'DTEND:' + when.end,
      'SUMMARY:' + icsEscape(event.title)
    ];
    if (event.description) { lines.push('DESCRIPTION:' + icsEscape(event.description)); }
    if (event.location) { lines.push('LOCATION:' + icsEscape(event.location)); }
    if (event.url) { lines.push('URL:' + event.url); }
    lines.push('END:VEVENT', 'END:VCALENDAR');
    return lines.map(fold).join('\r\n') + '\r\n';
  }

  function googleLink(event, when) {
    var details = event.description;
    if (event.url) { details = (details ? details + '\n\n' : '') + event.url; }
    var parts = [
      'action=TEMPLATE',
      'text=' + encodeURIComponent(event.title),
      'dates=' + when.start + '/' + when.end
    ];
    if (details) { parts.push('details=' + encodeURIComponent(details)); }
    if (event.location) { parts.push('location=' + encodeURIComponent(event.location)); }
    return 'https://calendar.google.com/calendar/render?' + parts.join('&');
  }

  WB.define('add-to-calendar', function (el) {
    var list = el.querySelector('[data-wb-list]');
    var status = el.querySelector('[data-wb-status]');
    var title = WB.opt(el, 'title', '');
    var when = readWhen(el);
    if (!list || WB.todo(title) || !when) {
      el.setAttribute('data-wb-state', WB.todo(title) ? 'unconfigured' : 'invalid');
      console.warn('[wb add-to-calendar] Needs data-wb-title and a valid data-wb-start with a time zone, e.g. 2027-06-01T18:00:00-04:00');
      return;
    }
    var url = WB.opt(el, 'url', '');
    var event = {
      title: title,
      description: WB.todo(WB.opt(el, 'description', '')) ? '' : WB.opt(el, 'description', ''),
      location: WB.todo(WB.opt(el, 'location', '')) ? '' : WB.opt(el, 'location', ''),
      url: /^https:\/\//i.test(url) && !WB.todo(url) ? url : ''
    };

    var item = document.createElement('li');
    var link = document.createElement('a');
    link.className = 'wb-cal__link';
    link.href = googleLink(event, when);
    link.target = '_blank';
    link.rel = 'noopener';
    link.appendChild(document.createTextNode(WB.opt(el, 'label-google', 'Add to Google Calendar')));
    var hint = document.createElement('span');
    hint.className = 'wb-cal__sr';
    hint.textContent = ' (opens in a new tab)';
    link.appendChild(hint);
    item.appendChild(link);
    list.appendChild(item);

    if (window.Blob && window.URL && URL.createObjectURL) {
      var item2 = document.createElement('li');
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'wb-cal__button';
      button.textContent = WB.opt(el, 'label-ics', 'Download .ics file');
      button.addEventListener('click', function () {
        var blob = new Blob([buildIcs(event, when)], { type: 'text/calendar;charset=utf-8' });
        var href = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = href;
        a.download = slug(event.title) + '.ics';
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(function () { URL.revokeObjectURL(href); }, 1000);
        if (status) { status.textContent = 'Calendar file created. Open it from your downloads to add the event.'; }
      });
      item2.appendChild(button);
      list.appendChild(item2);
    }
    el.setAttribute('data-wb-state', 'ready');
  });

  /* Exposed so the file builder can be reused or tested; it changes nothing on the page. */
  WB.calendarIcs = WB.calendarIcs || { build: buildIcs, read: readWhen };
})();

/* mobile-menu */
(function () {
  WB.define('mobile-menu', function (nav) {
    var toggle = nav.querySelector('[data-wb-toggle]');
    var list = nav.querySelector('[data-wb-list]');
    if (!toggle || !list) { throw new Error('mobile-menu needs [data-wb-toggle] and [data-wb-list]'); }

    var breakpoint = parseInt(WB.opt(nav, 'breakpoint', '768'), 10) || 768;
    var query = window.matchMedia('(max-width: ' + (breakpoint - 1) + 'px)');
    var open = false;

    if (!list.id) { list.id = WB.uid('menu'); }
    toggle.setAttribute('aria-controls', list.id);

    function render() {
      var narrow = query.matches;
      nav.classList.toggle('wb-menu--collapsible', narrow);
      list.hidden = narrow && !open;
      toggle.setAttribute('aria-expanded', narrow && open ? 'true' : 'false');
    }

    function onKey(event) {
      if (event.key !== 'Escape') { return; }
      var hadFocus = nav.contains(document.activeElement);
      setOpen(false);
      if (hadFocus) { toggle.focus(); }
    }
    function onOutside(event) {
      if (!nav.contains(event.target)) { setOpen(false); }
    }

    function setOpen(next) {
      if (!nav.isConnected) { next = false; }
      if (next === open) { return; }
      open = next;
      render();
      if (open) {
        document.addEventListener('keydown', onKey);
        document.addEventListener('click', onOutside);
      } else {
        document.removeEventListener('keydown', onKey);
        document.removeEventListener('click', onOutside);
      }
      WB.emit(nav, open ? 'menu-open' : 'menu-close', {});
    }

    toggle.addEventListener('click', function () { setOpen(!open); });
    list.addEventListener('click', function (event) {
      if (event.target.closest && event.target.closest('a')) { setOpen(false); }
    });

    function onChange() {
      if (!nav.isConnected) {
        if (query.removeEventListener) { query.removeEventListener('change', onChange); } else { query.removeListener(onChange); }
        return;
      }
      if (!query.matches) { setOpen(false); }
      render();
    }
    if (query.addEventListener) { query.addEventListener('change', onChange); } else { query.addListener(onChange); }

    render();
  });
})();

/* faq */
(function () {
  WB.define('faq', function (root) {
    /* A <details> inside another FAQ block belongs to that block, not to this one. */
    function ownItem(node) {
      for (var up = node.parentNode; up && up !== root; up = up.parentNode) {
        if (up.nodeType === 1 && up.getAttribute('data-wb') === 'faq') { return false; }
      }
      return true;
    }
    /* The item this one sits inside, if it is nested in an answer. */
    function outerItem(node) {
      for (var up = node.parentNode; up && up !== root; up = up.parentNode) {
        if (up.nodeType === 1 && up.tagName === 'DETAILS') { return up; }
      }
      return null;
    }
    var items = Array.prototype.filter.call(root.querySelectorAll('details'), ownItem);
    var exclusive = WB.opt(root, 'exclusive', 'false') === 'true';

    /* "One open at a time" applies among items on the same level, so opening a question inside an answer
       does not close the answer it sits in. */
    if (exclusive) {
      items.forEach(function (item) {
        item.addEventListener('toggle', function () {
          if (!item.open) { return; }
          items.forEach(function (other) {
            if (other !== item && other.open && outerItem(other) === outerItem(item)) { other.open = false; }
          });
        });
      });
    }

    function openFromHash() {
      if (!root.isConnected) { window.removeEventListener('hashchange', openFromHash); return; }
      var id = '';
      try { id = decodeURIComponent(location.hash.slice(1)); } catch (err) { return; }
      if (!id) { return; }
      var target = document.getElementById(id);
      if (!target || !root.contains(target)) { return; }
      var item = target.closest('details');
      if (item) {
        item.open = true;
        target.scrollIntoView();
      }
    }
    window.addEventListener('hashchange', openFromHash);
    openFromHash();
  });
})();

/* tabs */
(function () {
  WB.define('tabs', function (root) {
    var panels = Array.prototype.filter.call(root.children, function (child) { return child.hasAttribute('data-wb-panel'); });
    if (!panels.length) { throw new Error('tabs needs at least one child with data-wb-panel'); }

    var manual = WB.opt(root, 'activation', 'auto') === 'manual';
    var list = document.createElement('div');
    list.className = 'wb-tabs__list';
    list.setAttribute('role', 'tablist');
    var label = WB.opt(root, 'label', '');
    if (label && !WB.todo(label)) { list.setAttribute('aria-label', label); }

    var tabs = panels.map(function (panel, index) {
      var heading = panel.querySelector('h1, h2, h3, h4, h5, h6');
      var name = WB.opt(panel, 'tab', heading ? heading.textContent.trim() : 'Tab ' + (index + 1));
      var tab = document.createElement('button');
      tab.type = 'button';
      tab.className = 'wb-tabs__tab';
      tab.id = WB.uid('tab');
      tab.setAttribute('role', 'tab');
      tab.textContent = name;
      if (!panel.id) { panel.id = WB.uid('panel'); }
      tab.setAttribute('aria-controls', panel.id);
      panel.classList.add('wb-tabs__panel');
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', tab.id);
      panel.tabIndex = 0;
      if (heading) { heading.hidden = true; }
      list.appendChild(tab);
      return tab;
    });
    root.insertBefore(list, root.firstChild);

    function select(index, moveFocus) {
      tabs.forEach(function (tab, i) {
        var on = i === index;
        tab.setAttribute('aria-selected', on ? 'true' : 'false');
        tab.tabIndex = on ? 0 : -1;
        panels[i].hidden = !on;
      });
      if (moveFocus) { tabs[index].focus(); }
      WB.emit(root, 'tab-change', { index: index });
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener('click', function () { select(index, false); });
      tab.addEventListener('keydown', function (event) {
        var next = -1;
        if (event.key === 'ArrowRight') { next = (index + 1) % tabs.length; }
        else if (event.key === 'ArrowLeft') { next = (index - 1 + tabs.length) % tabs.length; }
        else if (event.key === 'Home') { next = 0; }
        else if (event.key === 'End') { next = tabs.length - 1; }
        else { return; }
        event.preventDefault();
        if (manual) {
          tabs.forEach(function (t, i) { t.tabIndex = i === next ? 0 : -1; });
          tabs[next].focus();
        } else {
          select(next, true);
        }
      });
    });

    var start = (parseInt(WB.opt(root, 'active', '1'), 10) || 1) - 1;
    panels.forEach(function (panel, i) { if (location.hash && location.hash === '#' + panel.id) { start = i; } });
    select(Math.min(Math.max(start, 0), tabs.length - 1), false);
  });
})();

/* modal */
(function () {
  WB.define('modal', function (root) {
    /* The elements inside this component that belong to it. A dialog can sit inside another dialog's content;
       an element that has another modal component between it and this root belongs to that one, not to this one. */
    function own(selector, within) {
      return Array.prototype.filter.call(within.querySelectorAll(selector), function (node) {
        for (var up = node.parentNode; up && up !== root; up = up.parentNode) {
          if (up.nodeType === 1 && up.getAttribute('data-wb') === 'modal') { return false; }
        }
        return true;
      });
    }
    var dialog = own('dialog', root)[0];
    if (!dialog) { throw new Error('modal needs a <dialog> element'); }
    if (typeof dialog.showModal !== 'function') {
      console.warn('[wb modal] This browser has no <dialog> support; links keep their normal behavior.');
      return;
    }
    var title = own('[data-wb-title]', dialog)[0];
    if (title) {
      if (!title.id) { title.id = WB.uid('modal-title'); }
      dialog.setAttribute('aria-labelledby', title.id);
    }
    var backdropClose = WB.opt(root, 'backdrop-close', 'true') !== 'false';
    var opener = null;

    own('[data-wb-open]', root).forEach(function (button) {
      var isLink = button.tagName === 'A' && button.hasAttribute('href');
      button.addEventListener('click', function (event) {
        if (event.defaultPrevented) { return; }
        /* On a link, Ctrl, Cmd, Shift or Alt with the click, or any button but the main one, belongs to the browser
           (open in a new tab or window, download): leave the link alone. */
        if (isLink && (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)) { return; }
        event.preventDefault();
        opener = button;
        if (!dialog.open) { dialog.showModal(); WB.emit(root, 'modal-open', {}); }
      });
    });
    own('[data-wb-close]', dialog).forEach(function (button) {
      button.addEventListener('click', function () { dialog.close(); });
    });
    dialog.addEventListener('click', function (event) {
      if (backdropClose && event.target === dialog) { dialog.close(); }
    });
    dialog.addEventListener('close', function () {
      if (opener && opener.isConnected) { opener.focus(); }
      WB.emit(root, 'modal-close', {});
    });
  });
})();

/* announcement-banner */
(function () {
  var memory = {};
  var store = {
    get: function (key) {
      try { return window.localStorage.getItem(key); } catch (err) { return memory[key] === undefined ? null : memory[key]; }
    },
    set: function (key, value) {
      try { window.localStorage.setItem(key, value); } catch (err) { memory[key] = value; }
    }
  };

  function parseTime(text) {
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?(Z|[+-]\d{2}:\d{2})$/.test(text)) { return NaN; }
    return new Date(text).getTime();
  }

  function hashText(text) {
    var h = 5381;
    for (var i = 0; i < text.length; i++) { h = ((h << 5) + h + text.charCodeAt(i)) >>> 0; }
    return h.toString(16);
  }

  /* First focusable element that comes after `from` in the page, or the first one in the page. */
  function nextFocusable(from) {
    var all = document.querySelectorAll('a[href], button:not([disabled]), input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])');
    var first = null;
    for (var i = 0; i < all.length; i++) {
      if (from.contains(all[i]) || all[i].getClientRects().length === 0) { continue; }
      if (!first) { first = all[i]; }
      if (from.compareDocumentPosition(all[i]) & Node.DOCUMENT_POSITION_FOLLOWING) { return all[i]; }
    }
    return first;
  }

  WB.define('announcement-banner', function (el) {
    var id = WB.opt(el, 'id', '');
    var text = el.textContent.replace(/\s+/g, ' ').trim();
    if (/YOUR_[A-Z0-9_]+/.test(text)) {
      el.setAttribute('data-wb-state', 'unconfigured');
      console.warn('[wb announcement-banner] Replace the YOUR_... placeholders in the banner text.');
      return;
    }
    var key = 'wb-banner:' + (WB.todo(id) ? hashText(text) : id);
    var days = parseFloat(WB.opt(el, 'remember-days', '30'));
    if (!(days >= 0)) { days = 30; }

    var now = Date.now();
    var start = parseTime(WB.opt(el, 'start', ''));
    var end = parseTime(WB.opt(el, 'end', ''));
    if (!isNaN(start) && now < start) { return; }
    if (!isNaN(end) && now > end) { return; }

    var dismissedAt = parseInt(store.get(key), 10);
    if (dismissedAt && now - dismissedAt < days * 86400000) { return; }

    var button = el.querySelector('[data-wb-dismiss]');
    if (!button) { throw new Error('announcement-banner needs a [data-wb-dismiss] button'); }
    button.addEventListener('click', function () {
      var hadFocus = el.contains(document.activeElement);
      store.set(key, String(Date.now()));
      var target = hadFocus ? nextFocusable(el) : null;
      el.hidden = true;
      if (target) { target.focus(); }
      WB.emit(el, 'banner-dismiss', { id: id });
    });
    el.hidden = false;
  });
})();

/* back-to-top */
(function () {
  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function focusTarget(button) {
    var custom = WB.opt(button, 'focus', '');
    if (custom) {
      try { var chosen = document.querySelector(custom); if (chosen) { return chosen; } } catch (err) { /* invalid selector: use the default */ }
    }
    var all = document.querySelectorAll(FOCUSABLE);
    for (var i = 0; i < all.length; i++) {
      if (all[i] !== button && all[i].getClientRects().length > 0) { return all[i]; }
    }
    return null;
  }

  WB.define('back-to-top', function (button) {
    var offset = parseInt(WB.opt(button, 'offset', '400'), 10);
    if (!(offset >= 0)) { offset = 400; }
    var waiting = false;

    function update() {
      waiting = false;
      if (!button.isConnected) { window.removeEventListener('scroll', onScroll); return; }
      var show = (window.pageYOffset || document.documentElement.scrollTop) > offset;
      if (button.hidden === show) { button.hidden = !show; }
    }
    function onScroll() {
      if (waiting) { return; }
      waiting = true;
      window.requestAnimationFrame(update);
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    button.addEventListener('click', function () {
      var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      var target = focusTarget(button);
      window.scrollTo({ top: 0, left: 0, behavior: reduce ? 'auto' : 'smooth' });
      if (target) { target.focus({ preventScroll: true }); }
    });
    update();
  });
})();

/* anchor-scroll */
(function () {
  WB.define('anchor-scroll', function (marker) {
    WB.once('anchor-scroll', function () {
      var selector = WB.opt(marker, 'header', 'header');
      var gap = parseInt(WB.opt(marker, 'gap', '8'), 10);
      if (!(gap >= 0)) { gap = 8; }
      var root = document.documentElement;
      var header = null;
      try { header = document.querySelector(selector); } catch (err) { console.warn('[wb anchor-scroll] Invalid data-wb-header selector: ' + selector); }

      function measure() {
        var offset = 0;
        if (header) {
          var position = window.getComputedStyle(header).position;
          if (position === 'fixed' || position === 'sticky') {
            offset = Math.ceil(header.getBoundingClientRect().height) + gap;
          }
        }
        root.style.setProperty('--wb-anchor-offset', offset + 'px');
      }

      function targetFromHash() {
        var id = '';
        try { id = decodeURIComponent(location.hash.slice(1)); } catch (err) { return null; }
        return id ? document.getElementById(id) : null;
      }

      function focusTarget(target) {
        if (!target.hasAttribute('tabindex') && !/^(A|BUTTON|INPUT|SELECT|TEXTAREA|SUMMARY)$/.test(target.tagName)) {
          target.setAttribute('tabindex', '-1');
          target.addEventListener('blur', function () { target.removeAttribute('tabindex'); }, { once: true });
        }
        target.focus({ preventScroll: true });
      }

      measure();
      window.addEventListener('resize', measure);
      if (header && window.ResizeObserver) { new ResizeObserver(measure).observe(header); }

      window.addEventListener('hashchange', function () {
        var target = targetFromHash();
        if (target) { focusTarget(target); }
      });

      /* A link opened with #section in the address: the browser scrolled before the offset existed, so scroll again. */
      var first = targetFromHash();
      if (first) {
        window.requestAnimationFrame(function () {
          first.scrollIntoView();
          focusTarget(first);
        });
      }
    });
  });
})();

/* copy-button */
(function () {
  /* Old-browser fallback: copy through a temporary text box. Returns true/false. */
  function legacyCopy(text) {
    var box = document.createElement('textarea');
    box.value = text;
    box.setAttribute('readonly', '');
    box.style.position = 'fixed';
    box.style.top = '0';
    box.style.opacity = '0';
    document.body.appendChild(box);
    box.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
    document.body.removeChild(box);
    return ok;
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(function () { return true; }, function () { return legacyCopy(text); });
    }
    return Promise.resolve(legacyCopy(text));
  }

  WB.define('copy-button', function (el) {
    var button = el.querySelector('[data-wb-button]');
    var status = el.querySelector('[data-wb-status]');
    var source = el.querySelector('[data-wb-source]');
    if (!button) { throw new Error('copy-button needs a [data-wb-button] element'); }
    var timer = null;
    var field = null;

    /* Takes away the manual-copy box, if one is showing. */
    function closeField(returnFocus) {
      if (!field) { return; }
      var box = field;
      field = null;
      if (box.parentNode) { box.parentNode.removeChild(box); }
      if (status) { status.textContent = ''; }
      if (returnFocus) { button.focus(); }
    }

    /* When the browser refuses to copy, show the exact text in a read-only box, selected and focused,
       so the visitor's own Ctrl+C or Cmd+C copies the right thing (the visible label may differ from data-wb-text). */
    function showField(text) {
      closeField(false);
      var box = document.createElement('textarea');
      box.className = 'wb-copy__field';
      box.readOnly = true;
      box.value = text;
      box.rows = Math.min(6, text.split(/\r\n|\r|\n/).length);
      box.setAttribute('aria-label', WB.opt(el, 'field-label', 'Text to copy'));
      box.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); closeField(true); }
      });
      box.addEventListener('blur', function () {
        if (field === box && document.hasFocus()) { closeField(false); }
      });
      el.appendChild(box);
      field = box;
      box.focus();
      box.select();
      try { box.setSelectionRange(0, box.value.length); } catch (err) { box.select(); }
    }

    button.addEventListener('click', function () {
      closeField(false);
      var text = el.getAttribute('data-wb-text');
      if (text === null) { text = source ? source.textContent : ''; }
      if (!text || WB.todo(text)) {
        if (status) { status.textContent = 'Nothing to copy yet.'; }
        console.warn('[wb copy-button] Replace YOUR_TEXT_TO_COPY or set data-wb-text.');
        return;
      }
      copyText(text).then(function (ok) {
        if (!ok) { showField(text); }
        if (status) {
          status.textContent = ok ? WB.opt(el, 'done', 'Copied') : WB.opt(el, 'failed', 'Press Ctrl+C or Cmd+C to copy');
        }
        WB.emit(el, ok ? 'copied' : 'copy-failed', {});
        clearTimeout(timer);
        timer = setTimeout(function () { if (!field && status && el.isConnected) { status.textContent = ''; } }, 4000);
      });
    });
  });
})();

/* share-button */
(function () {
  function legacyCopy(text) {
    var box = document.createElement('textarea');
    box.value = text;
    box.setAttribute('readonly', '');
    box.style.position = 'fixed';
    box.style.top = '0';
    box.style.opacity = '0';
    document.body.appendChild(box);
    box.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
    document.body.removeChild(box);
    return ok;
  }
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(function () { return true; }, function () { return legacyCopy(text); });
    }
    return Promise.resolve(legacyCopy(text));
  }

  function pageUrl(el) {
    var chosen = WB.opt(el, 'url', '');
    if (chosen) { return new URL(chosen, location.href).href; }
    var canonical = document.querySelector('link[rel="canonical"]');
    return canonical && canonical.href ? canonical.href : location.href;
  }

  WB.define('share-button', function (el) {
    var button = el.querySelector('[data-wb-button]');
    var status = el.querySelector('[data-wb-status]');
    if (!button) { throw new Error('share-button needs a [data-wb-button] element'); }
    var timer = null;

    function say(text) {
      if (!status) { return; }
      status.textContent = text;
      clearTimeout(timer);
      if (text) { timer = setTimeout(function () { if (el.isConnected) { status.textContent = ''; } }, 6000); }
    }

    button.addEventListener('click', function () {
      var url;
      try { url = pageUrl(el); } catch (err) { say('The link to share is not valid.'); return; }
      var data = { title: WB.opt(el, 'title', document.title), url: url };
      var text = WB.opt(el, 'text', '');
      if (text) { data.text = text; }

      if (typeof navigator.share === 'function') {
        navigator.share(data).then(function () {
          WB.emit(el, 'shared', { method: 'share-sheet' });
        }, function (err) {
          if (err && err.name === 'AbortError') { return; }   /* the visitor closed the share sheet */
          say('Sharing failed. Copy this link instead: ' + url);
        });
        return;
      }
      copyText(url).then(function (ok) {
        if (ok) {
          say(WB.opt(el, 'copied', 'Link copied'));
          WB.emit(el, 'shared', { method: 'copy' });
        } else {
          say(WB.opt(el, 'failed', 'Copy this link:') + ' ' + url);
        }
      });
    });
  });
})();

/* theme-toggle */
(function () {
  var LABELS = { system: 'Theme: System', light: 'Theme: Light', dark: 'Theme: Dark' };
  var ORDER = ['system', 'light', 'dark'];
  var root = document.documentElement;

  function current() {
    var value = root.getAttribute('data-wb-theme');
    return value === 'light' || value === 'dark' ? value : 'system';
  }

  WB.define('theme-toggle', function (button) {
    var key = WB.opt(button, 'storage-key', 'wb-theme');
    var note = document.createElement('span');
    note.className = 'wb-theme__sr';
    note.setAttribute('role', 'status');
    button.insertAdjacentElement('afterend', note);

    function render(announce) {
      var mode = current();
      button.textContent = LABELS[mode];
      button.setAttribute('aria-label', LABELS[mode] + '. Press to change.');
      if (announce) { note.textContent = LABELS[mode]; }
    }

    function onChange() {
      if (!button.isConnected) { document.removeEventListener('wb:theme-change', onChange); return; }
      render(false);
    }
    document.addEventListener('wb:theme-change', onChange);

    button.addEventListener('click', function () {
      var next = ORDER[(ORDER.indexOf(current()) + 1) % ORDER.length];
      if (next === 'system') { root.removeAttribute('data-wb-theme'); } else { root.setAttribute('data-wb-theme', next); }
      try {
        if (next === 'system') { localStorage.removeItem(key); } else { localStorage.setItem(key, next); }
      } catch (err) { /* storage blocked: the choice lasts until the page is reloaded */ }
      render(true);
      document.dispatchEvent(new CustomEvent('wb:theme-change', { detail: { theme: next } }));
    });

    render(false);
  });
})();

/* footer-year */
(function () {
  WB.define('footer-year', function (el) {
    var year = new Date().getFullYear();
    var start = parseInt(WB.opt(el, 'start', ''), 10);
    el.textContent = start && start < year ? start + '–' + year : String(year);
  });
})();

/* skip-link */
(function () {
  WB.define('skip-link', function (link) {
    link.addEventListener('click', function () {
      var id = (link.getAttribute('href') || '').slice(1);
      var target = id ? document.getElementById(id) : null;
      if (!target) { console.warn('[wb skip-link] No element with id "' + id + '" was found.'); return; }
      if (!target.hasAttribute('tabindex')) { target.setAttribute('tabindex', '-1'); }
      target.focus();
    });
  });
})();

/* gallery */
(function () {
  function safeHref(link) {
    try {
      var u = new URL(link.getAttribute('href'), location.href);
      /* Only web addresses are allowed. A page opened from disk may also use files on disk. */
      var allowed = u.protocol === 'https:' || u.protocol === 'http:' || (u.protocol === 'file:' && location.protocol === 'file:');
      return allowed ? u.href : '';
    } catch (err) { return ''; }
  }

  WB.define('gallery', function (root) {
    var links = Array.prototype.filter.call(root.querySelectorAll('a[href]'), function (a) { return safeHref(a); });
    var testDialog = document.createElement('dialog');
    if (!links.length || typeof testDialog.showModal !== 'function') { return; }

    var loop = WB.opt(root, 'loop', 'true') !== 'false';
    var index = 0;
    var opener = null;
    var dialog = null, image, caption, counter, prev, next, status, startX = null;

    function build() {
      dialog = document.createElement('dialog');
      dialog.className = 'wb-gallery__dialog';
      var label = WB.opt(root, 'label', 'Photo viewer');
      dialog.setAttribute('aria-label', WB.todo(label) ? 'Photo viewer' : label);

      var close = button('Close', 'Close photo viewer');
      var stage = document.createElement('figure');
      stage.className = 'wb-gallery__stage';
      image = document.createElement('img');
      image.alt = '';
      caption = document.createElement('figcaption');
      caption.className = 'wb-gallery__caption';
      stage.appendChild(image);
      stage.appendChild(caption);

      var bar = document.createElement('div');
      bar.className = 'wb-gallery__bar';
      prev = button('‹ Previous', 'Previous photo');
      next = button('Next ›', 'Next photo');
      counter = document.createElement('span');
      status = document.createElement('span');
      status.setAttribute('role', 'status');
      status.setAttribute('aria-live', 'polite');
      status.className = 'wb-gallery__status';
      counter.setAttribute('aria-hidden', 'true');
      bar.appendChild(prev);
      bar.appendChild(counter);
      bar.appendChild(next);

      dialog.appendChild(close);
      dialog.appendChild(stage);
      dialog.appendChild(bar);
      dialog.appendChild(status);
      root.appendChild(dialog);

      close.addEventListener('click', function () { dialog.close(); });
      prev.addEventListener('click', function () { step(-1); });
      next.addEventListener('click', function () { step(1); });
      dialog.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowLeft') { event.preventDefault(); step(-1); }
        else if (event.key === 'ArrowRight') { event.preventDefault(); step(1); }
        else if (event.key === 'Home') { event.preventDefault(); show(0); }
        else if (event.key === 'End') { event.preventDefault(); show(links.length - 1); }
      });
      dialog.addEventListener('pointerdown', function (event) { startX = event.pointerType === 'mouse' ? null : event.clientX; });
      dialog.addEventListener('pointercancel', function () { startX = null; });
      dialog.addEventListener('pointerup', function (event) {
        if (startX === null) { return; }
        var dx = event.clientX - startX;
        startX = null;
        if (Math.abs(dx) > 50) { step(dx < 0 ? 1 : -1); }
      });
      dialog.addEventListener('click', function (event) { if (event.target === dialog) { dialog.close(); } });
      dialog.addEventListener('close', function () {
        if (opener && opener.isConnected) { opener.focus(); }
        WB.emit(root, 'gallery-close', {});
      });
    }

    function button(text, label) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'wb-gallery__btn';
      b.textContent = text;
      b.setAttribute('aria-label', label);
      return b;
    }

    function step(delta) {
      var n = index + delta;
      if (n < 0) { n = loop ? links.length - 1 : 0; }
      if (n >= links.length) { n = loop ? 0 : links.length - 1; }
      show(n);
    }

    function preload(i) {
      if (i < 0 || i >= links.length) { return; }
      var pre = new Image();
      pre.src = safeHref(links[i]);
    }

    function show(i) {
      index = i;
      var link = links[i];
      var thumb = link.querySelector('img');
      var text = link.getAttribute('data-wb-caption') || '';
      image.onerror = function () {
        image.removeAttribute('src');
        caption.textContent = 'This photo could not be loaded.';
        status.textContent = 'This photo could not be loaded.';
      };
      image.alt = thumb ? thumb.alt : '';
      image.src = safeHref(link);
      caption.textContent = text;
      counter.textContent = (i + 1) + ' / ' + links.length;
      status.textContent = 'Photo ' + (i + 1) + ' of ' + links.length + (text ? ': ' + text : '');
      var many = links.length > 1;
      prev.hidden = next.hidden = !many;
      if (!loop) { prev.disabled = i === 0; next.disabled = i === links.length - 1; }
      preload(i + 1);
      preload(i - 1);
    }

    root.addEventListener('click', function (event) {
      var link = event.target.closest ? event.target.closest('a[href]') : null;
      if (!link || links.indexOf(link) < 0) { return; }
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) { return; }
      event.preventDefault();
      if (!dialog) { build(); }
      opener = link;
      show(links.indexOf(link));
      dialog.showModal();
      WB.emit(root, 'gallery-open', { index: index });
    });
  });
})();

/* click-to-load */
(function () {
  var BUILT_IN = ['www.youtube-nocookie.com', 'www.youtube.com', 'player.vimeo.com', 'www.google.com'];

  function allowed(el, src) {
    if (WB.todo(src)) { return null; }
    var url;
    try { url = new URL(src); } catch (err) { return null; }
    if (url.protocol !== 'https:') { return null; }
    var extra = WB.opt(el, 'allow-hosts', '').split(',').map(function (h) { return h.trim().toLowerCase(); }).filter(Boolean);
    var host = url.hostname.toLowerCase();
    if (extra.indexOf(host) >= 0) { return url.href; }
    if (BUILT_IN.indexOf(host) < 0) { return null; }
    if (host === 'www.google.com' && url.pathname.indexOf('/maps/embed') !== 0) { return null; }
    return url.href;
  }

  WB.define('click-to-load', function (el) {
    var holder = el.querySelector('[data-wb-placeholder]');
    var button = el.querySelector('[data-wb-load]');
    if (!holder || !button) { throw new Error('click-to-load needs [data-wb-placeholder] and [data-wb-load]'); }

    var src = allowed(el, WB.opt(el, 'src', ''));
    var title = WB.opt(el, 'title', '');
    if (!src || WB.todo(title)) {
      button.disabled = true;
      el.setAttribute('data-wb-state', 'unconfigured');
      console.warn('[wb click-to-load] Needs an https data-wb-src from an allowed host and a data-wb-title.');
      return;
    }

    button.addEventListener('click', function () {
      var frame = document.createElement('div');
      frame.className = 'wb-embed__frame';
      var ratio = WB.opt(el, 'ratio', '16 / 9');
      frame.style.aspectRatio = /^\d+(\.\d+)?\s*\/\s*\d+(\.\d+)?$/.test(ratio) ? ratio : '16 / 9';

      var iframe = document.createElement('iframe');
      iframe.src = src;
      iframe.title = title;
      iframe.allow = WB.opt(el, 'permissions', 'fullscreen; picture-in-picture; encrypted-media');
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
      frame.appendChild(iframe);

      holder.replaceWith(frame);
      el.setAttribute('data-wb-state', 'loaded');
      iframe.focus();
      WB.emit(el, 'embed-loaded', {});
    });
  });
})();

/* search-filter */
(function () {
  function normalize(text) {
    return String(text).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim();
  }

  WB.define('search-filter', function (root) {
    var controls = root.querySelector('[data-wb-controls]');
    var input = root.querySelector('[data-wb-search]');
    var select = root.querySelector('[data-wb-tag-select]');
    var clear = root.querySelector('[data-wb-clear]');
    var count = root.querySelector('[data-wb-count]');
    var empty = root.querySelector('[data-wb-empty]');
    var items = Array.prototype.slice.call(root.querySelectorAll('[data-wb-item]'));
    if (!input || !items.length) { throw new Error('search-filter needs [data-wb-search] and at least one [data-wb-item]'); }
    var minLength = parseInt(WB.opt(root, 'min', '1'), 10);
    if (!(minLength >= 0)) { minLength = 1; }
    var timer = null;

    var records = items.map(function (item) {
      var tags = (item.getAttribute('data-wb-tags') || '').split(',').map(function (t) { return t.trim(); }).filter(Boolean);
      var text = item.textContent + ' ' + (item.getAttribute('data-wb-keywords') || '') + ' ' + tags.join(' ');
      return { el: item, haystack: normalize(text), tags: tags.map(normalize) };
    });

    if (select && select.options.length <= 1) {
      var seen = {};
      items.forEach(function (item) {
        (item.getAttribute('data-wb-tags') || '').split(',').forEach(function (t) {
          t = t.trim();
          if (t && !seen[normalize(t)]) { seen[normalize(t)] = t; }
        });
      });
      Object.keys(seen).sort().forEach(function (key) {
        var option = document.createElement('option');
        option.value = key;
        option.textContent = seen[key];
        select.appendChild(option);
      });
      if (select.options.length <= 1) { select.parentNode.hidden = true; }
    }

    function apply(announce) {
      var query = normalize(input.value);
      var words = query.length >= minLength ? query.split(' ').filter(Boolean) : [];
      var tag = select ? select.value : '';
      var shown = 0;
      records.forEach(function (record) {
        var ok = words.every(function (w) { return record.haystack.indexOf(w) >= 0; }) && (!tag || record.tags.indexOf(tag) >= 0);
        record.el.hidden = !ok;
        if (ok) { shown++; }
      });
      if (empty) { empty.hidden = shown !== 0; }
      if (count) {
        var text = shown === records.length ? 'Showing all ' + shown + ' items' : 'Showing ' + shown + ' of ' + records.length + ' items';
        if (announce) {
          clearTimeout(timer);
          timer = setTimeout(function () { count.textContent = text; }, 250);
        } else {
          count.textContent = text;
        }
      }
      WB.emit(root, 'filter-change', { shown: shown, total: records.length });
    }

    input.addEventListener('input', function () { apply(true); });
    if (select) { select.addEventListener('change', function () { apply(true); }); }
    if (clear) {
      clear.addEventListener('click', function () {
        input.value = '';
        if (select) { select.value = ''; }
        apply(true);
        input.focus();
      });
    }
    input.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && input.value) { input.value = ''; apply(true); }
    });

    if (controls) { controls.hidden = false; }
    apply(false);
  });
})();

/* hours-status */
(function () {
  var NAMES = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

  /* "09:30" -> minutes since midnight. "24:00" is allowed as the end of a range. */
  function minutes(text) {
    var m = /^(\d{1,2}):(\d{2})$/.exec(text);
    if (!m) { return NaN; }
    var h = +m[1], min = +m[2];
    if (min > 59 || h > 24 || (h === 24 && min !== 0)) { return NaN; }
    return h * 60 + min;
  }

  /* "09:00-12:00,13:00-17:00" | "closed" | "24h" -> [[start,end],...] (end may pass 1440 for overnight) */
  function parseRanges(text) {
    var t = text.replace(/\s*([,\-])\s*/g, '$1').trim().toLowerCase();
    if (t === 'closed') { return []; }
    if (t === '24h') { return [[0, 1440]]; }
    var out = [];
    t.split(',').forEach(function (part) {
      var bits = part.split('-');
      var a = minutes(bits[0]), b = minutes(bits[1]);
      if (bits.length !== 2 || isNaN(a) || isNaN(b) || a === b || a === 1440) { throw new Error('Bad time range: ' + part); }
      out.push([a, b > a ? b : b + 1440]);
    });
    return out;
  }

  function dayIndex(name) {
    var i = NAMES.indexOf(name.slice(0, 3).toLowerCase());
    if (i < 0) { throw new Error('Unknown day: ' + name); }
    return i;
  }
  function parseDays(spec) {
    var days = [];
    spec.split(',').forEach(function (part) {
      var bits = part.split('-');
      var a = dayIndex(bits[0]);
      var b = bits.length > 1 ? dayIndex(bits[1]) : a;
      for (var i = a; ; i = (i + 1) % 7) { days.push(i); if (i === b) { break; } }
    });
    return days;
  }

  function parseWeek(text) {
    var week = [[], [], [], [], [], [], []];
    text.split(';').forEach(function (group) {
      group = group.trim();
      if (!group) { return; }
      var space = group.search(/\s/);
      if (space < 0) { throw new Error('Bad group: ' + group); }
      var days = parseDays(group.slice(0, space).replace(/\s+/g, ''));
      var ranges = parseRanges(group.slice(space));
      days.forEach(function (d) { week[d] = ranges.slice(); });
    });
    return week;
  }

  function parseSpecial(text) {
    var out = {};
    text.split(';').forEach(function (group) {
      group = group.trim();
      if (!group) { return; }
      var m = /^(\d{4}-\d{2}-\d{2})\s+(.+)$/.exec(group);
      if (!m) { throw new Error('Bad special day: ' + group); }
      out[m[1]] = parseRanges(m[2]);
    });
    return out;
  }

  /* The date, weekday and minute of day as seen in the business's time zone. */
  function zoneNow(zone, ms) {
    var parts = new Intl.DateTimeFormat('en-US', {
      timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short',
      hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
    }).formatToParts(new Date(ms));
    var o = {};
    parts.forEach(function (p) { o[p.type] = p.value; });
    return { y: +o.year, m: +o.month, d: +o.day, dow: NAMES.indexOf(o.weekday.slice(0, 3).toLowerCase()), min: (+o.hour % 24) * 60 + (+o.minute) };
  }

  function iso(date) {
    return date.toISOString().slice(0, 10);
  }

  /* All opening intervals from yesterday to a week ahead, as minutes counted from today 00:00 in the zone. */
  function intervals(config, now) {
    var list = [];
    for (var off = -1; off <= 8; off++) {
      var date = new Date(Date.UTC(now.y, now.m - 1, now.d + off));
      var key = iso(date);
      var ranges = config.special[key] || (config.closed[key] ? [] : config.week[date.getUTCDay()]);
      ranges.forEach(function (r) { list.push([off * 1440 + r[0], off * 1440 + r[1]]); });
    }
    list.sort(function (a, b) { return a[0] - b[0]; });
    var merged = [];
    list.forEach(function (r) {
      var last = merged[merged.length - 1];
      if (last && r[0] <= last[1]) { last[1] = Math.max(last[1], r[1]); } else { merged.push([r[0], r[1]]); }
    });
    return merged;
  }

  WB.define('hours-status', function (el) {
    var out = el.querySelector('[data-wb-output]');
    var listEl = el.querySelector('[data-wb-list]');
    var zoneEl = el.querySelector('[data-wb-zone]');
    var zone = WB.opt(el, 'timezone', '');
    var config;
    try {
      if (WB.todo(zone)) { throw new Error('Set data-wb-timezone to an IANA name such as Europe/Berlin.'); }
      new Intl.DateTimeFormat('en-US', { timeZone: zone });
      var closed = {};
      WB.opt(el, 'closed', '').split(',').forEach(function (d) {
        d = d.trim();
        if (d) {
          if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) { throw new Error('Bad closed date: ' + d); }
          closed[d] = true;
        }
      });
      config = { week: parseWeek(WB.opt(el, 'hours', '')), special: parseSpecial(WB.opt(el, 'special', '')), closed: closed };
    } catch (err) {
      el.setAttribute('data-wb-state', WB.todo(zone) ? 'unconfigured' : 'invalid');
      console.warn('[wb hours-status] ' + err.message);
      return;
    }
    if (!out) { throw new Error('hours-status needs a [data-wb-output] element'); }

    var locale = WB.opt(el, 'locale', document.documentElement.lang || 'en-US');
    var twelve = WB.opt(el, 'clock', '12') !== '24';
    var showZone = WB.opt(el, 'show-zone', 'true') !== 'false';
    var timeFormat, dayFormat, relative, zoneShort;
    try {
      timeFormat = new Intl.DateTimeFormat(locale, { hour: 'numeric', minute: '2-digit', hour12: twelve, timeZone: 'UTC' });
      dayFormat = new Intl.DateTimeFormat(locale, { weekday: 'long', timeZone: 'UTC' });
      relative = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
    } catch (err) {
      locale = 'en-US';
      timeFormat = new Intl.DateTimeFormat(locale, { hour: 'numeric', minute: '2-digit', hour12: twelve, timeZone: 'UTC' });
      dayFormat = new Intl.DateTimeFormat(locale, { weekday: 'long', timeZone: 'UTC' });
      relative = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
    }

    function clockText(minute) {
      return timeFormat.format(new Date(Date.UTC(2024, 0, 1, 0, minute % 1440)));
    }
    function zoneText(ms, style) {
      var p = new Intl.DateTimeFormat(locale, { timeZone: zone, timeZoneName: style }).formatToParts(new Date(ms));
      for (var i = 0; i < p.length; i++) { if (p[i].type === 'timeZoneName') { return p[i].value; } }
      return zone;
    }
    var words = {
      open: WB.opt(el, 'text-open', 'Open now, closes {time}'),
      closed: WB.opt(el, 'text-closed', 'Closed, opens {time}'),
      openAlways: WB.opt(el, 'text-open-always', 'Open now'),
      closedAll: WB.opt(el, 'text-closed-all', 'Closed'),
      at: WB.opt(el, 'text-at', 'at')
    };

    /* "5:00 PM", "tomorrow at 2:00 AM" or "Monday at 9:00 AM" for a minute counted from today 00:00.
       withToday adds "today at" for the current day. isEnd treats midnight as the end of the previous day. */
    function whenText(value, now, withToday, isEnd) {
      var offset = Math.floor(value / 1440);
      var minute = value - offset * 1440;
      if (isEnd && minute === 0) { offset -= 1; }
      var clock = clockText(minute);
      if (offset === 0 && !withToday) { return clock; }
      var day = offset === 0 || offset === 1
        ? relative.format(offset, 'day')
        : dayFormat.format(new Date(Date.UTC(2024, 0, 7 + (((now.dow + offset) % 7) + 7) % 7)));
      return day + ' ' + words.at + ' ' + clock;
    }

    var wasOpen = null;
    var timer = null;

    function render() {
      var ms = Date.now();
      var now = zoneNow(zone, ms);
      var spans = intervals(config, now);
      var open = null, next = null;
      for (var i = 0; i < spans.length; i++) {
        if (spans[i][0] <= now.min && now.min < spans[i][1]) { open = spans[i]; break; }
        if (spans[i][0] > now.min) { next = spans[i]; break; }
      }
      var zoneLabel = showZone ? ' ' + zoneText(ms, 'short') : '';
      var text;
      if (open && open[1] >= 9 * 1440) {
        text = words.openAlways;
      } else if (open) {
        text = words.open.replace('{time}', whenText(open[1], now, false, true) + zoneLabel);
      } else if (next) {
        text = words.closed.replace('{time}', whenText(next[0], now, true, false) + zoneLabel);
      } else {
        text = words.closedAll;
      }
      out.textContent = text;
      el.setAttribute('data-wb-open', open ? 'true' : 'false');
      if (wasOpen !== null && wasOpen !== !!open) { WB.emit(el, 'hours-change', { open: !!open }); }
      wasOpen = !!open;
    }

    function renderWeek() {
      if (listEl) {
        listEl.textContent = '';
        [1, 2, 3, 4, 5, 6, 0].forEach(function (d) {
          var ranges = config.week[d];
          var li = document.createElement('li');
          var name = document.createElement('span');
          name.textContent = dayFormat.format(new Date(Date.UTC(2024, 0, 7 + d)));
          var value = document.createElement('span');
          value.textContent = ranges.length ? ranges.map(function (r) {
            if (r[0] === 0 && r[1] === 1440) { return '24 hours'; }
            return clockText(r[0]) + ' – ' + clockText(r[1]);
          }).join(', ') : 'Closed';
          li.appendChild(name);
          li.appendChild(value);
          listEl.appendChild(li);
        });
      }
      if (zoneEl) { zoneEl.textContent = 'All times are ' + zoneText(Date.now(), 'long') + ' (' + zone + ').'; }
    }

    function schedule() {
      timer = setTimeout(function () {
        if (!el.isConnected) { document.removeEventListener('visibilitychange', onVisible); return; }
        render();
        schedule();
      }, 60000 - (Date.now() % 60000) + 50);
    }
    function onVisible() {
      if (!el.isConnected) { document.removeEventListener('visibilitychange', onVisible); clearTimeout(timer); return; }
      if (!document.hidden) { render(); }
    }
    document.addEventListener('visibilitychange', onVisible);

    render();
    renderWeek();
    schedule();
    el.setAttribute('data-wb-state', 'ready');
  });
})();

/* data-table */
(function () {
  /* Reads CSV as defined by RFC 4180: quoted cells may contain commas, doubled quotes and line breaks. */
  function parseCsv(text, delimiter) {
    if (text.charCodeAt(0) === 0xFEFF) { text = text.slice(1); }
    var rows = [], row = [], field = '', quoted = false;
    for (var i = 0; i < text.length; i++) {
      var c = text.charAt(i);
      if (quoted) {
        if (c === '"') {
          if (text.charAt(i + 1) === '"') { field += '"'; i++; } else { quoted = false; }
        } else { field += c; }
      } else if (c === '"' && field === '') {
        quoted = true;
      } else if (c === delimiter) {
        row.push(field); field = '';
      } else if (c === '\n' || c === '\r') {
        if (c === '\r' && text.charAt(i + 1) === '\n') { i++; }
        row.push(field); rows.push(row); row = []; field = '';
      } else { field += c; }
    }
    if (quoted) { throw new Error('The CSV file has a quote that is never closed.'); }
    if (field !== '' || row.length) { row.push(field); rows.push(row); }
    return rows.filter(function (r) { return !(r.length === 1 && r[0] === ''); });
  }

  function pick(data, path) {
    if (!path) { return data; }
    return path.split('.').reduce(function (obj, key) { return obj && typeof obj === 'object' ? obj[key] : undefined; }, data);
  }

  function cell(value) {
    if (value === null || value === undefined) { return ''; }
    return typeof value === 'object' ? JSON.stringify(value) : String(value);
  }

  /* Returns {columns: [{key,label}], rows: [[text,...]]} */
  function toTable(el, text, type) {
    var wanted = WB.opt(el, 'columns', '').split(',').map(function (c) {
      var bits = c.split(':');
      return { key: bits[0].trim(), label: (bits.slice(1).join(':') || bits[0]).trim() };
    }).filter(function (c) { return c.key; });
    var keys, records;

    if (type === 'csv') {
      var grid = parseCsv(text, WB.opt(el, 'delimiter', ',') === 'tab' ? '\t' : WB.opt(el, 'delimiter', ','));
      if (!grid.length) { return { columns: [], rows: [] }; }
      keys = grid[0].map(function (h) { return h.trim(); });
      records = grid.slice(1).map(function (r) {
        var o = {};
        keys.forEach(function (k, i) { o[k] = r[i] === undefined ? '' : r[i]; });
        return o;
      });
    } else {
      var data = pick(JSON.parse(text), WB.opt(el, 'path', ''));
      if (!Array.isArray(data)) { throw new Error('The JSON file does not contain a list of rows' + (WB.opt(el, 'path', '') ? ' at "' + WB.opt(el, 'path', '') + '".' : '.')); }
      records = data.map(function (r) { return r && typeof r === 'object' && !Array.isArray(r) ? r : { value: r }; });
      keys = [];
      records.slice(0, 50).forEach(function (r) { Object.keys(r).forEach(function (k) { if (keys.indexOf(k) < 0) { keys.push(k); } }); });
    }
    var columns = wanted.length ? wanted : keys.map(function (k) { return { key: k, label: k }; });
    return {
      columns: columns,
      rows: records.map(function (r) { return columns.map(function (c) { return cell(r[c.key]); }); })
    };
  }

  function detect(el, src, contentType, text) {
    var format = WB.opt(el, 'format', 'auto');
    if (format === 'csv' || format === 'json') { return format; }
    if (/\.json(\?|#|$)/i.test(src) || /json/i.test(contentType || '')) { return 'json'; }
    if (/\.csv(\?|#|$)/i.test(src) || /csv/i.test(contentType || '')) { return 'csv'; }
    return /^\s*[\[{]/.test(text) ? 'json' : 'csv';
  }

  WB.define('data-table', function (el) {
    var status = el.querySelector('[data-wb-status]');
    var output = el.querySelector('[data-wb-output]');
    var src = WB.opt(el, 'src', '');
    if (!status || !output) { throw new Error('data-table needs [data-wb-status] and [data-wb-output]'); }
    if (WB.todo(src)) {
      el.setAttribute('data-wb-state', 'unconfigured');
      status.textContent = 'This table has no data source yet.';
      console.warn('[wb data-table] Set data-wb-src to your CSV or JSON file.');
      return;
    }
    var timeout = parseInt(WB.opt(el, 'timeout', '12000'), 10) || 12000;
    var maxRows = parseInt(WB.opt(el, 'max-rows', '500'), 10) || 500;
    var token = 0;

    function setState(state, message, retry) {
      el.setAttribute('data-wb-state', state);
      el.setAttribute('aria-busy', state === 'loading' ? 'true' : 'false');
      status.textContent = '';
      if (message) { status.appendChild(document.createTextNode(message)); }
      if (retry) {
        status.appendChild(document.createTextNode(' '));
        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'wb-data__retry';
        button.textContent = 'Try again';
        button.addEventListener('click', function () { load(true); });
        status.appendChild(button);
      }
    }

    function draw(table) {
      output.textContent = '';
      var wrap = document.createElement('div');
      wrap.className = 'wb-data__scroll';
      wrap.tabIndex = 0;
      wrap.setAttribute('role', 'region');
      var caption = WB.opt(el, 'caption', '');
      wrap.setAttribute('aria-label', caption && !WB.todo(caption) ? caption : 'Data table');
      var t = document.createElement('table');
      if (caption && !WB.todo(caption)) {
        var cap = document.createElement('caption');
        cap.textContent = caption;
        t.appendChild(cap);
      }
      var thead = document.createElement('thead');
      var hr = document.createElement('tr');
      table.columns.forEach(function (c) {
        var th = document.createElement('th');
        th.scope = 'col';
        th.textContent = c.label;
        hr.appendChild(th);
      });
      thead.appendChild(hr);
      t.appendChild(thead);
      var tbody = document.createElement('tbody');
      table.rows.slice(0, maxRows).forEach(function (r) {
        var tr = document.createElement('tr');
        r.forEach(function (v) {
          var td = document.createElement('td');
          td.textContent = v;
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
      t.appendChild(tbody);
      wrap.appendChild(t);
      output.appendChild(wrap);
    }

    function load(fresh) {
      var mine = ++token;
      output.textContent = '';
      setState('loading', 'Loading…', false);
      var controller = new AbortController();
      var timer = setTimeout(function () { controller.abort(); }, timeout);
      fetch(src, { credentials: 'omit', cache: fresh ? 'reload' : 'default', signal: controller.signal }).then(function (response) {
        if (!response.ok) { throw new Error('The server answered ' + response.status + '.'); }
        return response.text().then(function (text) { return { text: text, type: response.headers.get('content-type') }; });
      }).then(function (result) {
        if (mine !== token) { return; }
        var table = toTable(el, result.text, detect(el, src, result.type, result.text));
        if (!table.rows.length) {
          setState('empty', WB.opt(el, 'empty', 'There is nothing to show yet.'), false);
          return;
        }
        draw(table);
        var more = table.rows.length > maxRows ? 'Showing the first ' + maxRows + ' of ' + table.rows.length + ' rows.' : '';
        setState('ready', more, false);
        WB.emit(el, 'data-loaded', { rows: Math.min(table.rows.length, maxRows) });
      }).catch(function (err) {
        if (mine !== token) { return; }
        var why = err && err.name === 'AbortError' ? 'The request took too long.' : (err && err.message ? err.message : 'Check your connection.');
        setState('error', 'The data could not be loaded. ' + why, true);
        WB.emit(el, 'data-error', {});
      }).then(function () { clearTimeout(timer); });
    }

    load(false);
  });
})();

/* live-values */
(function () {
  function parseCsv(text) {
    if (text.charCodeAt(0) === 0xFEFF) { text = text.slice(1); }
    var rows = [], row = [], field = '', quoted = false;
    for (var i = 0; i < text.length; i++) {
      var c = text.charAt(i);
      if (quoted) {
        if (c === '"') {
          if (text.charAt(i + 1) === '"') { field += '"'; i++; } else { quoted = false; }
        } else { field += c; }
      } else if (c === '"' && field === '') {
        quoted = true;
      } else if (c === ',') {
        row.push(field); field = '';
      } else if (c === '\n' || c === '\r') {
        if (c === '\r' && text.charAt(i + 1) === '\n') { i++; }
        row.push(field); rows.push(row); row = []; field = '';
      } else { field += c; }
    }
    if (quoted) { throw new Error('The CSV file has a quote that is never closed.'); }
    if (field !== '' || row.length) { row.push(field); rows.push(row); }
    return rows.filter(function (r) { return !(r.length === 1 && r[0] === ''); });
  }

  /* CSV (key,value) or JSON object -> plain object of strings */
  function toValues(text, src, contentType) {
    var asJson = /\.json(\?|#|$)/i.test(src) || /json/i.test(contentType || '') || /^\s*\{/.test(text);
    var values = {};
    if (asJson) {
      var data = JSON.parse(text);
      if (!data || typeof data !== 'object' || Array.isArray(data)) { throw new Error('The JSON file must be an object of key: value pairs.'); }
      Object.keys(data).forEach(function (k) { if (data[k] !== null && typeof data[k] !== 'object') { values[k] = String(data[k]); } });
    } else {
      var rows = parseCsv(text);
      if (rows.length && /^key$/i.test(rows[0][0].trim()) && /^value$/i.test((rows[0][1] || '').trim())) { rows.shift(); }
      rows.forEach(function (r) { if (r.length >= 2 && r[0].trim()) { values[r[0].trim()] = r[1]; } });
    }
    return values;
  }

  WB.define('live-values', function (el) {
    var src = WB.opt(el, 'src', '');
    var status = el.querySelector('[data-wb-status]');
    if (WB.todo(src)) {
      el.setAttribute('data-wb-state', 'unconfigured');
      console.warn('[wb live-values] Set data-wb-src to your CSV or JSON file.');
      return;
    }
    var seconds = parseInt(WB.opt(el, 'refresh', ''), 10);
    var token = 0;
    var timer = null;

    function load() {
      if (!el.isConnected) { return; }
      var mine = ++token;
      el.setAttribute('data-wb-state', 'loading');
      var controller = new AbortController();
      var stop = setTimeout(function () { controller.abort(); }, 12000);
      fetch(src, { credentials: 'omit', cache: 'no-cache', signal: controller.signal }).then(function (response) {
        if (!response.ok) { throw new Error('The server answered ' + response.status + '.'); }
        return response.text().then(function (text) { return toValues(text, src, response.headers.get('content-type')); });
      }).then(function (values) {
        if (mine !== token) { return; }
        Array.prototype.forEach.call(el.querySelectorAll('[data-wb-key]'), function (target) {
          var key = target.getAttribute('data-wb-key');
          if (Object.prototype.hasOwnProperty.call(values, key)) { target.textContent = values[key]; }
        });
        if (status) { status.textContent = ''; }
        el.setAttribute('data-wb-state', 'ready');
        WB.emit(el, 'values-loaded', {});
      }).catch(function (err) {
        if (mine !== token) { return; }
        el.setAttribute('data-wb-state', 'error');
        if (status) { status.textContent = WB.opt(el, 'status-text', 'Live values are unavailable right now, so saved values are shown.'); }
        console.warn('[wb live-values]', err && err.message ? err.message : err);
      }).then(function () {
        clearTimeout(stop);
        if (seconds >= 30 && el.isConnected) {
          timer = setTimeout(load, seconds * 1000);
        }
      });
    }
    load();
  });
})();

/* consent-analytics */
(function () {
  var KEY = 'wb-consent-analytics';
  var ID_PATTERN = /^G-[A-Z0-9]{4,20}$/;
  var memory = {};
  var current = null;   /* the one consent control that is active on this page */

  WB.consent = WB.consent || { analytics: undefined };
  WB.analytics = WB.analytics || {
    /* Sends a Google Analytics event. Returns true only when the event was handed to a loaded, allowed tag. */
    event: function (name, params) {
      return current && current.el.isConnected ? current.event(name, params) : false;
    }
  };

  function readStored() {
    if (memory[KEY] !== undefined) { return memory[KEY]; }
    try { return window.localStorage.getItem(KEY); } catch (err) { return null; }
  }

  /* Returns true when the value was saved in the browser's storage, false when only kept in memory. */
  function writeStored(value) {
    try {
      window.localStorage.setItem(KEY, value);
      delete memory[KEY];
      return true;
    } catch (err) {
      memory[KEY] = value;
      return false;
    }
  }

  function parseChoice(raw, version, maxDays) {
    var data;
    if (!raw) { return null; }
    try { data = JSON.parse(raw); } catch (err) { return null; }
    if (!data || typeof data !== 'object') { return null; }
    if (data.a !== 0 && data.a !== 1) { return null; }
    if (String(data.v) !== version) { return null; }
    if (typeof data.t !== 'number' || Date.now() - data.t > maxDays * 86400000) { return null; }
    return { analytics: data.a === 1 };
  }

  /* Best effort: removes Google Analytics cookies from this host and its parent domains. */
  function deleteGoogleCookies() {
    var names = document.cookie.split(';').map(function (part) {
      return part.split('=')[0].trim();
    }).filter(function (name) {
      return /^(_ga|_gid|_gat)/.test(name);
    });
    if (!names.length) { return; }
    var host = window.location.hostname;
    var domains = [''];
    if (!/^[0-9.]+$/.test(host) && host.indexOf(':') === -1) {
      var parts = host.split('.');
      for (var i = 0; i < parts.length - 1; i++) { domains.push('.' + parts.slice(i).join('.')); }
    }
    names.forEach(function (name) {
      domains.forEach(function (domain) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + (domain ? '; domain=' + domain : '');
      });
    });
  }

  function nextFocusable(from) {
    var all = document.querySelectorAll('a[href], button:not([disabled]), input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])');
    var first = null;
    for (var i = 0; i < all.length; i++) {
      if (from.contains(all[i]) || all[i].getClientRects().length === 0) { continue; }
      if (!first) { first = all[i]; }
      if (from.compareDocumentPosition(all[i]) & Node.DOCUMENT_POSITION_FOLLOWING) { return all[i]; }
    }
    return first;
  }

  /* One click listener for every "Cookie settings" button, including ones added later. */
  WB.once('consent-analytics-openers', function () {
    document.addEventListener('click', function (event) {
      var target = event.target;
      var opener = target && target.closest ? target.closest('[data-wb-consent-open]') : null;
      if (!opener || !current || !current.el.isConnected) { return; }
      event.preventDefault();
      current.open(opener);
    });
  });

  WB.define('consent-analytics', function (el) {
    var panel = el.querySelector('.wb-consent__panel');
    var live = el.querySelector('.wb-consent__live');
    var acceptButton = el.querySelector('[data-wb-accept]');
    var declineButton = el.querySelector('[data-wb-decline]');
    var closeButton = el.querySelector('[data-wb-close]');
    var note = el.querySelector('[data-wb-current]');
    if (!panel || !live || !acceptButton || !declineButton) {
      throw new Error('consent-analytics: the markup is incomplete. Copy the whole block.');
    }

    function openers() { return Array.prototype.slice.call(document.querySelectorAll('[data-wb-consent-open]')); }
    function showOpeners(visible) { openers().forEach(function (button) { button.hidden = !visible; }); }

    if (current && current.el.isConnected) {
      el.setAttribute('data-wb-state', 'duplicate');
      panel.hidden = true;
      console.warn('[wb consent-analytics] Only one consent block works per page. This extra one is switched off.');
      return;
    }

    var id = WB.opt(el, 'ga4-id', '');
    var dry = el.hasAttribute('data-wb-dry-run');
    var version = WB.opt(el, 'version', '1');
    var days = parseFloat(WB.opt(el, 'remember-days', '180'));
    if (!(days > 0)) { days = 180; }
    var honorGpc = WB.opt(el, 'honor-gpc', 'true') !== 'false';

    if (!dry) {
      if (WB.todo(id)) {
        el.setAttribute('data-wb-state', 'unconfigured');
        showOpeners(false);
        console.warn('[wb consent-analytics] Set data-wb-ga4-id to your Measurement ID (or add data-wb-dry-run to preview).');
        return;
      }
      if (!ID_PATTERN.test(id)) {
        el.setAttribute('data-wb-state', 'invalid');
        showOpeners(false);
        console.warn('[wb consent-analytics] data-wb-ga4-id must look like G-ABC123DEF4. Google Tag Manager (GTM-...) and Universal Analytics (UA-...) IDs are not supported here.');
        return;
      }
      if (document.querySelector('script[src*="googletagmanager.com"]')) {
        el.setAttribute('data-wb-state', 'conflict');
        showOpeners(false);
        console.warn('[wb consent-analytics] Another Google tag is already on this page. Remove it so this component is the only loader.');
        return;
      }
    }

    var link = panel.querySelector('.wb-consent__link');
    if (link && /YOUR_[A-Z0-9_]+/.test(link.getAttribute('href') || '')) {
      link.removeAttribute('href');
      console.warn('[wb consent-analytics] Set the privacy-policy link (YOUR_PRIVACY_POLICY_URL).');
    }

    var texts = {
      allowed: WB.opt(el, 'text-allowed', 'Analytics are allowed.'),
      declined: WB.opt(el, 'text-declined', 'Analytics are declined.'),
      gpc: WB.opt(el, 'text-gpc', 'Your browser sends a Global Privacy Control signal, so analytics stay off unless you allow them here.'),
      unsaved: WB.opt(el, 'text-unsaved', 'Your choice could not be saved on this device, so you may be asked again.'),
      preview: WB.opt(el, 'text-preview', 'Preview mode: no analytics script is loaded and nothing is sent.')
    };

    var granted;          /* true, false, or undefined while no choice has been made */
    var source = 'pending';
    var persisted = true;
    var started = false;  /* the Google tag has been requested */
    var loaded = false;   /* the Google tag finished loading */
    var lastOpener = null;

    if (dry) {
      var preview = document.createElement('p');
      preview.className = 'wb-consent__preview';
      preview.textContent = texts.preview;
      panel.insertBefore(preview, panel.querySelector('.wb-consent__actions'));
    }

    function gtag() {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(arguments);
    }

    function loadTag() {
      var script = document.createElement('script');
      script.async = true;
      script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
      script.setAttribute('data-wb-gtag', '');
      script.onload = function () {
        loaded = true;
        el.setAttribute('data-wb-analytics', granted === true ? 'on' : 'off');
      };
      script.onerror = function () {
        el.setAttribute('data-wb-analytics', 'blocked');
        console.warn('[wb consent-analytics] The Google tag could not be loaded (blocked or offline). No data is sent.');
      };
      document.head.appendChild(script);
    }

    function enable() {
      if (dry) { el.setAttribute('data-wb-analytics', 'dry-run'); return; }
      window['ga-disable-' + id] = false;
      if (!started) {
        started = true;
        el.setAttribute('data-wb-analytics', 'loading');
        gtag('consent', 'default', {
          analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied'
        });
        gtag('consent', 'update', { analytics_storage: 'granted' });
        gtag('js', new Date());
        gtag('config', id);
        loadTag();
      } else {
        gtag('consent', 'update', { analytics_storage: 'granted' });
        el.setAttribute('data-wb-analytics', loaded ? 'on' : 'loading');
      }
    }

    function disable() {
      el.setAttribute('data-wb-analytics', dry ? 'dry-run' : 'off');
      if (dry) { return; }
      window['ga-disable-' + id] = true;
      if (started) { gtag('consent', 'update', { analytics_storage: 'denied' }); }
      deleteGoogleCookies();
    }

    function describe() {
      var text = '';
      if (granted === true) { text = texts.allowed; }
      if (granted === false) { text = source === 'gpc' ? texts.gpc : texts.declined; }
      if (text && !persisted) { text += ' ' + texts.unsaved; }
      return text;
    }

    function apply() {
      WB.consent.analytics = granted;
      el.setAttribute('data-wb-consent', granted === true ? 'granted' : (granted === false ? 'denied' : 'pending'));
      if (granted === true) { enable(); } else { disable(); }
      if (granted !== undefined) { WB.emit(el, 'consent-change', { analytics: granted, source: source }); }
    }

    function openPanel(opener, quiet) {
      lastOpener = opener || null;
      var text = describe();
      if (note) { note.textContent = text; note.hidden = !text; }
      if (closeButton) { closeButton.hidden = granted === undefined; }
      panel.hidden = false;
      if (!quiet) { panel.focus(); }
    }

    function closePanel() {
      var hadFocus = panel.contains(document.activeElement);
      panel.hidden = true;
      if (hadFocus) {
        var target = lastOpener && lastOpener.isConnected && !lastOpener.hidden ? lastOpener : nextFocusable(el);
        if (target) { target.focus(); }
      }
      lastOpener = null;
    }

    function choose(value) {
      granted = value;
      source = 'user';
      persisted = writeStored(JSON.stringify({ v: version, a: value ? 1 : 0, t: Date.now() }));
      apply();
      closePanel();
      live.textContent = describe();
    }

    acceptButton.addEventListener('click', function () { choose(true); });
    declineButton.addEventListener('click', function () { choose(false); });
    if (closeButton) { closeButton.addEventListener('click', closePanel); }

    current = {
      el: el,
      open: openPanel,
      event: function (name, params) {
        if (dry || !loaded || granted !== true) { return false; }
        if (typeof name !== 'string' || !/^[a-z][a-z0-9_]{0,39}$/.test(name)) { return false; }
        gtag('event', name, params || {});
        return true;
      }
    };

    var stored = parseChoice(readStored(), version, days);
    if (stored) {
      granted = stored.analytics;
      source = 'stored';
    } else if (honorGpc && navigator.globalPrivacyControl === true) {
      granted = false;
      source = 'gpc';
    }
    el.setAttribute('data-wb-state', 'ready');
    showOpeners(true);
    apply();
    if (granted === undefined) { openPanel(null, true); }
  });
})();

/* track-clicks */
(function () {
  var NAME_PATTERN = /^[a-z][a-z0-9_]{0,39}$/;
  var PLACE_PATTERN = /^[a-z0-9_-]{1,30}$/;
  var PROVIDERS = { ga4: true, plausible: true, none: true };
  var BROWSER_HOSTS = /(^|\.)(wa\.me|api\.whatsapp\.com|web\.whatsapp\.com|whatsapp\.com)$/;

  /* Returns only a coarse type. Never returns the address, number or text. */
  function methodOf(node) {
    var href = node.tagName === 'A' ? node.getAttribute('href') : null;
    if (href === null || href === '') { return 'button'; }
    var url;
    try { url = new URL(href, window.location.href); } catch (err) { return 'link'; }
    var protocol = url.protocol.toLowerCase();
    if (protocol === 'tel:') { return 'tel'; }
    if (protocol === 'mailto:') { return 'mailto'; }
    if (protocol === 'sms:') { return 'sms'; }
    if (protocol === 'http:' || protocol === 'https:') {
      if (BROWSER_HOSTS.test(url.hostname)) { return 'whatsapp'; }
      return url.hostname === window.location.hostname ? 'internal' : 'outbound';
    }
    return 'link';
  }

  WB.define('track-clicks', function (box) {
    var provider = WB.opt(box, 'provider', 'none');
    if (!PROVIDERS[provider]) {
      box.setAttribute('data-wb-state', 'invalid');
      console.warn('[wb track-clicks] data-wb-provider must be ga4, plausible or none.');
      return;
    }
    var needConsent = WB.opt(box, 'require-consent', 'false') === 'true';
    var warned = {};
    box.setAttribute('data-wb-state', 'ready');

    box.addEventListener('click', function (event) {
      var target = event.target;
      var node = target && target.closest ? target.closest('[data-wb-track]') : null;
      if (!node || !box.contains(node)) { return; }

      var name = (node.getAttribute('data-wb-track') || '').trim();
      if (!NAME_PATTERN.test(name)) {
        if (!warned[name]) {
          warned[name] = true;
          console.warn('[wb track-clicks] Ignored event name "' + name + '". Use lowercase letters, digits and underscores, starting with a letter.');
        }
        return;
      }

      var params = { method: methodOf(node) };
      var place = (node.getAttribute('data-wb-track-place') || '').trim();
      if (PLACE_PATTERN.test(place)) { params.placement = place; }

      var sent = false;
      if (provider === 'ga4') {
        sent = !!(WB.analytics && WB.analytics.event(name, params));
      } else if (provider === 'plausible') {
        var allowed = !needConsent || (WB.consent && WB.consent.analytics === true);
        if (allowed && typeof window.plausible === 'function') {
          window.plausible(name, { props: params });
          sent = true;
        }
      }
      /* "sent" means handed to the analytics tool, not confirmed as received. */
      WB.emit(node, 'track', { name: name, params: params, provider: provider, sent: sent });
    });
  });
})();

/* lead-source */
(function () {
  var KEY = 'wb-lead-source';
  var UTM = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

  /* Keeps a tag only if it looks like a plain label, never an email address or a phone-like number. */
  function cleanTag(value) {
    if (typeof value !== 'string') { return ''; }
    value = value.trim();
    if (!value || value.indexOf('@') !== -1) { return ''; }
    if (/\d{7,}/.test(value.replace(/[\s.\-]/g, ''))) { return ''; }
    return value.replace(/[^A-Za-z0-9 _.+:\/-]/g, '').slice(0, 80);
  }

  function cleanPath(value) {
    if (typeof value !== 'string' || /@|%40/i.test(value)) { return ''; }
    return value.replace(/[^A-Za-z0-9\/_.~%+-]/g, '').slice(0, 120);
  }

  /* Reads the current page: tags, referring host name and landing path. Never the full address. */
  function collect() {
    var values = {};
    var hasTags = false;
    var params = null;
    try { params = new URLSearchParams(window.location.search); } catch (err) { params = null; }
    UTM.forEach(function (key) {
      var value = params ? cleanTag(params.get(key)) : '';
      if (value) { values[key] = value; hasTags = true; }
    });
    try {
      if (document.referrer) {
        var ref = new URL(document.referrer);
        if (/^https?:$/.test(ref.protocol) && ref.hostname !== window.location.hostname) {
          values.referrer_site = ref.hostname.toLowerCase().replace(/[^a-z0-9.-]/g, '').slice(0, 100);
        }
      }
    } catch (err) { /* ignore a referrer that cannot be read */ }
    var path = cleanPath(window.location.pathname);
    if (path) { values.landing_page = path; }
    return { values: values, hasTags: hasTags };
  }

  function storeFor(mode) {
    try {
      var area = mode === 'local' ? window.localStorage : window.sessionStorage;
      area.getItem(KEY);
      return area;
    } catch (err) { return null; }
  }

  function readSaved(area, maxDays) {
    if (!area) { return null; }
    try {
      var data = JSON.parse(area.getItem(KEY) || 'null');
      if (!data || typeof data !== 'object' || typeof data.t !== 'number' || !data.v || typeof data.v !== 'object') { return null; }
      if (Date.now() - data.t > maxDays * 86400000) { return null; }
      var clean = {};
      UTM.concat(['referrer_site', 'landing_page']).forEach(function (key) {
        if (typeof data.v[key] === 'string' && data.v[key]) { clean[key] = data.v[key]; }
      });
      return clean;
    } catch (err) { return null; }
  }

  WB.define('lead-source', function (box) {
    var form = box.closest('form');
    if (!form) {
      box.setAttribute('data-wb-state', 'invalid');
      console.warn('[wb lead-source] Place this element inside a <form>.');
      return;
    }
    var mode = WB.opt(box, 'storage', 'session');
    if (mode !== 'session' && mode !== 'local' && mode !== 'none') { mode = 'session'; }
    var maxDays = parseFloat(WB.opt(box, 'max-age-days', '30'));
    if (!(maxDays > 0)) { maxDays = 30; }
    var prefix = WB.opt(box, 'prefix', '').replace(/[^A-Za-z0-9_-]/g, '');

    var now = collect();
    var values = now.values;
    var area = mode === 'none' ? null : storeFor(mode);
    if (area) {
      var saved = readSaved(area, maxDays);
      if (saved && !now.hasTags) {
        values = saved;
      } else {
        try { area.setItem(KEY, JSON.stringify({ t: Date.now(), v: values })); } catch (err) { /* keep using this page's values */ }
      }
    }

    var added = {};
    Object.keys(values).forEach(function (key) {
      var name = prefix + key;
      if (form.elements.namedItem(name)) {
        console.warn('[wb lead-source] The form already has a field named "' + name + '". It was left unchanged.');
        return;
      }
      var input = document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      input.value = values[key];
      input.setAttribute('data-wb-lead-field', '');
      box.appendChild(input);
      added[name] = values[key];
    });
    box.setAttribute('data-wb-state', Object.keys(added).length ? 'ready' : 'empty');
    WB.emit(box, 'lead-source', { fields: added });
  });
})();
