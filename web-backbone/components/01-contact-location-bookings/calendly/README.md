# Calendly booking (inline and popup)

Shows your Calendly booking page inline in the page, or opens it in Calendly's popup when a visitor clicks a link. The link keeps working as a normal link if Calendly's script is blocked or fails.

## Files

- [calendly.html](calendly.html)

## Requirements

- A Calendly account and the public scheduling link of an event type (for example `https://calendly.com/YOUR_CALENDLY_USER/YOUR_EVENT_TYPE`). Plans and embed features are set by Calendly; check what your plan allows.
- Calendly's own script (`widget.js`) and stylesheet (`widget.css`) from `assets.calendly.com`. The component loads them for you, once, only when needed.
- An `https://` page. No API key or secret is used; the scheduling link is public.

## Paste location

- `<style>` block: once, in the `<head>` or above the first instance.
- Markup: where the calendar (inline) or the booking link (popup) should appear.
- `<script>` block: once, just before `</body>`.

## Change these values

- The scheduling link: the `href` of the link (the single place the address is set).
- `data-wb-mode`: `inline` (calendar in the page, default) or `popup` (the link opens Calendly's overlay).
- Inline only: `data-wb-height` (pixels, default `700`) and `data-wb-load`: `visible` (default, loads when scrolled near), `load` (immediately) or `click` (shows a button; nothing from Calendly loads until pressed).
- Optional: `data-wb-url` holds the scheduling address when the element is not a link. When there is a link, its `href` is used.
- Optional: add Calendly's own display parameters to the link, as described in Calendly's embed options.

## Repeat use

Several inline calendars and several popup links can share a page; each uses its own box and settings. Calendly's two files are requested once. Popup links added later: run `WB.init(container)` after inserting them. Caution: two full-size inline calendars on one page are heavy for visitors; prefer one inline plus popup links.

## Limitations

- Inline and popup display, the popup's keyboard and focus behavior, and what Calendly stores are controlled by Calendly, not by this code.
- Only `calendly.com` addresses are accepted. A custom or white-label Calendly domain will be rejected until you change `validUrl`.
- The booking event uses Calendly's browser message (`calendly.event_scheduled`). Calendly's documentation was reachable for the embed methods and the message; the exact origin check could only be confirmed in part.
- The component waits up to 10 seconds in total for Calendly's script (the `LOAD_MS` value at the top of the script). If it has not loaded by then, the inline calendar is replaced by a message and the link below it, and the popup link opens your Calendly page in the same tab. A script that is still loading when the wait ends is left in place, so if it arrives later the next click works. Further clicks on a popup link are ignored while it is still waiting.
- The time limit ends this component's wait; it cannot cancel the browser's own request. While that request is pending, the browser may hold back the page's `load` event (most visible with `data-wb-load="load"`, which asks for the script at once).
- Calendly loads third-party scripts and may set cookies. Choose `data-wb-load="click"` if you need the visitor to ask for it first.
- No attendee details are read or forwarded. Use Calendly's own notifications or webhooks for that; those need Calendly's server-side features.
