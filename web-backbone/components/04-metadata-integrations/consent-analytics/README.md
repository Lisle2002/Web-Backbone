# Analytics with consent choice (Google Analytics 4)

A small consent notice that keeps Google Analytics 4 switched off until the visitor chooses to allow it. The Google tag is loaded only after "Allow", the choice is remembered, and a "Cookie settings" button lets the visitor reopen the notice and change or withdraw the choice at any time.

## Files

- [consent-analytics.html](consent-analytics.html)

## Requirements

- **A Google Analytics 4 property and its Measurement ID** (looks like `G-` followed by letters and digits). It is a public identifier and is meant to appear in page code. It is not a secret. Find it in Google Analytics under Admin, Data streams.
- **Google's script** from `googletagmanager.com`, loaded only after the visitor allows analytics. No other Google tag, Google Tag Manager snippet or old Analytics snippet may be on the same page, or the two will conflict (this component then does nothing and says so).
- Browser `localStorage` to remember the choice. If it is blocked, the notice still works but is shown again on each page.
- A privacy policy page that describes your use of analytics.
- **This is not legal advice.** Whether you need consent, what the notice must say, and how it must behave depends on where your visitors and your business are.

## Paste location

- `<style>` block: once, in the `<head>` or above the notice.
- Consent block (`<div class="wb-consent" ...>`): once per page, near the end of `<body>`, just before the script.
- "Cookie settings" button: in your footer or any place visitors can always reach. It is required, because withdrawing consent must stay possible. Several of these buttons are fine.
- `<script>` block: once, just before `</body>`.

## Change these values

- `data-wb-ga4-id`: your Measurement ID, for example `G-ABC123DEF4`.
- The notice wording and the privacy-policy link (`YOUR_PRIVACY_POLICY_URL`). The two choice buttons deliberately look identical; keep them that way.
- `data-wb-version`: change this number (for example from `1` to `2`) when your policy changes in a way that needs a fresh choice from everyone.
- `data-wb-remember-days`: how long a choice is remembered (default `180`).
- `data-wb-honor-gpc`: `true` (default) treats a browser's Global Privacy Control signal as "decline" until the visitor allows analytics themselves. Set `false` to ignore the signal.
- `data-wb-dry-run`: add this attribute to try the notice and the buttons **without** loading anything from Google (useful before you have an ID). Remove it before going live.
- Optional wording: `data-wb-text-allowed`, `data-wb-text-declined`, `data-wb-text-gpc`, `data-wb-text-unsaved`, `data-wb-text-preview`.
- CSS variables: `--wb-accent`, `--wb-on-accent`, `--wb-bg`, `--wb-text`, `--wb-border`, `--wb-radius`, `--wb-focus`, `--wb-consent-z`.

## Repeat use

Use exactly one consent block per page. You can place as many "Cookie settings" buttons as you like (header, footer, privacy page): they all reopen the same notice. If you insert a button later with JavaScript it works without any extra step (give it `data-wb-consent-open` and leave out the `hidden` attribute, because the script only unhides the buttons that exist at startup). You can restyle the button freely; keep it at least 24 pixels tall.

Other components can read the choice: `WB.consent.analytics` is `true`, `false` or `undefined` (no choice yet), and the notice fires a `wb:consent-change` event with `{analytics, source}` where `source` is `user`, `stored` or `gpc`.

## Limitations

- Works with a GA4 Measurement ID (`G-...`) loaded through `gtag.js`. It does not support Google Tag Manager containers, old Universal Analytics IDs, or advertising features. Ad-related consent signals are set to denied and are never granted by this component.
- Because the Google tag is not loaded until the visitor allows analytics, visitors who decline or never choose are not counted at all, and Google's modeling of unconsented traffic is not used.
- Withdrawing stops sending, tells Google's tag that analytics storage is denied, and deletes Google Analytics cookies from this host and its parent domains on a best-effort basis. A cookie set with unusual attributes may survive. The Google script that was already loaded stays in memory until the page is reloaded. Data that was already sent stays in Google Analytics; deleting it is done inside Google Analytics.
- The choice is stored in `localStorage` (not a cookie), per browser and per web address. Subdomains do not share it. If storage is blocked, the choice lasts only for the current page view.
- Visitors without JavaScript see nothing and are not tracked.
- Google Analytics records the page address including its query string and the referrer. Keep personal data out of page addresses.
- The notice is a plain region, not a modal dialog, so the rest of the page stays usable while it is open.
- Honoring the Global Privacy Control signal is a conservative default, not a statement about what the law requires of you.
