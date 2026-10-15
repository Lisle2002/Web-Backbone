# Page metadata and canonical address

The basic tags every page needs in its `<head>`: character set, mobile scaling, title, description and the canonical address (the one preferred URL for that page, which tells search engines which address to treat as the main one when the same page can be reached at several addresses).

## Files

- [page-metadata.html](page-metadata.html)

## Requirements

- Access to the `<head>` of every page. Search engines and social sites read these tags from the HTML they download, usually without running scripts, so they must be in the page source itself, not added later by JavaScript.
- The final public `https://` address of each page.

## Paste location

- Inside `<head>`, near the top. Keep `<meta charset>` within the first 1,024 bytes of the file.
- Each page needs its own title, description and canonical address.
- Also set the language on the page's opening tag: `<html lang="en">`.

## Change these values

- `YOUR_PAGE_TITLE | YOUR_SITE_NAME`: a short, specific title (about 60 characters or fewer is less likely to be cut off in results).
- `YOUR_PAGE_DESCRIPTION`: one or two plain sentences that describe this page (about 155 characters or fewer is less likely to be cut off).
- `href` of the canonical link: the full address including `https://`, written the way you want it to appear (decide on `www` or not and keep to it). It should point to the page itself, not to the home page.
- `theme-color`: your brand color (optional, used by some mobile browsers).
- Uncomment the `noindex` line only for pages that should stay out of search results.

## Repeat use

Paste once per page, with that page's own title, description and canonical address. Do not put two canonical links or two descriptions on one page.

## Limitations

- Search engines may rewrite titles and descriptions. The tags are suggestions, not commands.
- Many website builders set these tags from their own settings and ignore pasted tags; use the builder's SEO fields instead.
- `noindex` only works if the page can be crawled; do not also block it in `robots.txt`.
- `theme-color` is a hint used by some browsers and may be ignored.
