# sitemap.xml (separate file)

An XML file that lists the pages you want search engines to know about, with the date each last changed. It helps crawlers find pages; it does not guarantee that they are indexed or ranked.

## Files

- [sitemap.xml](sitemap.xml)

## Requirements

- **This is a separate file, not code for a page.** Save it as `sitemap.xml` (UTF-8) in the top folder of your site, so it is reachable at `https://YOUR_DOMAIN/sitemap.xml`.
- Every address must be a full, absolute address on the same site (same `https://` and same host name as the sitemap).
- Many website builders and content systems create a sitemap automatically. If yours does, use that one instead of writing this by hand.

## Paste location

- Do not paste into a page. Create a new text file named `sitemap.xml`, copy the contents of the linked source file, and upload it to the top folder of your site.
- Tell search engines where it is: keep the `Sitemap:` line in `robots.txt`, and/or submit the address in Google Search Console or the equivalent tool of another search engine.

## Change these values

- Replace every `YOUR_DOMAIN` and `YOUR_PAGE_PATH`, and add one `<url>` block per page you want listed. List only pages that are public and should appear in search results (your canonical addresses).
- `lastmod`: the date the page's content last meaningfully changed, as `YYYY-MM-DD`. If you cannot keep it accurate, delete the `lastmod` lines.
- Characters that XML treats specially must be escaped inside addresses: write `&` as `&amp;`.

## Repeat use

One sitemap file per site is normal. A single file may hold at most 50,000 addresses and 50 MB uncompressed; larger sites split into several sitemap files listed in a sitemap index file (see sitemaps.org).

## Limitations

- A sitemap is a hint. Listing a page does not make search engines index it, and a page missing from the sitemap can still be found by links.
- Do not list pages that redirect, are blocked by `robots.txt`, or are marked `noindex`.
- The addresses must match the site the sitemap is on; a sitemap cannot list pages of a different host unless that is set up in the search engine's own tool.
- Optional tags such as `changefreq` and `priority` are left out on purpose; they are not needed here.
- Images and video can have their own sitemap extensions; they are not covered by this file.
