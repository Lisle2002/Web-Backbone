# Live values from a CSV or JSON file

Keeps small pieces of text on a page (a price, today's special, a status, a date) up to date from one public file, so you can change them without editing the page. The text already on the page stays if the file cannot be read.

## Files

- [live-values.html](live-values.html)

## Requirements

- A public file with two columns (`key,value`, CSV) or a flat JSON object (`{"key": "value"}`), on your own site or on a site that allows your page to read it (CORS).
- A page served over `http(s)://` (browsers usually block reading local files from a page opened from disk).

## Paste location

- Markup: wrap the area in the block and mark each changing item with `data-wb-key`.
- `<script>` block: once, just before `</body>`. No style block is needed.

## Change these values

- `data-wb-src`: the CSV or JSON address.
- `data-wb-key` on each element: the name of the value to show there.
- The fallback text inside each element (what shows if the file cannot be read).
- Optional `data-wb-refresh`: seconds between refreshes (at least `30`); leave it out to load once.
- Optional `data-wb-status-text` for the message shown in the `[data-wb-status]` element when loading fails.

## Repeat use

Unlimited blocks, each with its own file and keys. Keys are only looked up inside their own block, so the same key name can be used in different blocks. Late-inserted blocks: run `WB.init(container)`.

## Limitations

- Values are inserted as plain text, so they cannot contain formatting, links or images.
- Browsers and CDNs may cache the file. `cache: no-cache` makes the browser check for a newer copy, but a CDN in front of your site can still serve a stale one.
- Anything in the file is public. Do not put private information there.
- The fallback text is what search engines and visitors without JavaScript see, so keep it sensible.
