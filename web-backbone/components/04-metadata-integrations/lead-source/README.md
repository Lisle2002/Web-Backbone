# Lead source for forms (campaign tags, referring site, landing page)

Adds hidden fields to a form so each submission says where the visitor came from: the campaign tags in the address (`utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`), the referring website's host name, and the first page they landed on. It works with the `contact-form` component or any ordinary form.

## Files

- [lead-source.html](lead-source.html)

## Requirements

- A form on the page. The component goes **inside** that form, so the fields are submitted with it.
- Campaign links that actually carry `utm_` tags (you add them to the links you share). Without them you still get the referring host and landing page.
- Browser storage is used by default so the source survives a visit to several pages (see the limits). Choose `data-wb-storage="none"` to store nothing.
- Tell visitors in your privacy notice that this information is submitted with the form.

## Paste location

- Markup: one empty `<div>` anywhere **inside** each `<form>` that should receive the fields, before the submit button.
- `<script>` block: once, just before `</body>`.

## Change these values

- `data-wb-storage`: `session` (default, kept until the browser tab is closed), `local` (kept for `data-wb-max-age-days`, default 30) or `none` (nothing is stored; only the current page is used).
- `data-wb-prefix`: optional text added to every field name (for example `src_` gives `src_utm_source`). Use it if your form service expects different names.

## Repeat use

Put one empty `<div data-wb="lead-source">` inside each form that should carry the fields. Several forms on a page are fine; each gets its own hidden fields. If a form already has a field with the same name, that field is left alone and a warning is logged. For forms inserted later, run `WB.init(container)`.

## Limitations

- The fields are ordinary hidden inputs, so visitors can edit them. Treat them as hints for your own reporting, not as proof.
- Only the referring site's **host name** and the landing page's **path** are kept, never full addresses or query strings (apart from the five campaign tags). Many browsers already shorten the referrer, and some visits arrive with none.
- Values that look like an email address or a long number are dropped, and unusual characters are removed, because campaign links sometimes carry personal data by mistake.
- With `session` or `local`, a small record is stored in the browser. Whether that needs consent depends on your country and on how you classify it. `none` avoids storage but only knows the page the visitor is on right now, which is the landing page only if the form is on it.
- Visits that do not carry tags and have no referrer show only the landing page.
- The component adds fields; the form service decides how they appear in its emails and records.
