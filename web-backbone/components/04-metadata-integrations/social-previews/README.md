# Social link previews (Open Graph and X/Twitter cards)

The tags that control the title, description and picture shown when someone shares a page link on Facebook, LinkedIn, WhatsApp, Slack, X and similar services.

## Files

- [social-previews.html](social-previews.html)

## Requirements

- A share image on your own site at a public `https://` address. A shape of about 1200 × 630 pixels (roughly 1.9 : 1) works across services. Keep the file small.
- The tags must be in the HTML the server sends. Services read them without running scripts, so tags added by JavaScript are not seen.

## Paste location

- Inside `<head>` of each page, together with `page-metadata`.

## Change these values

- `og:title`, `og:description`, `og:url`: this page's own text and its canonical address.
- `og:image`: the full `https://` address of the image (not a relative path). `og:image:width` and `og:image:height` should match the file. `og:image:alt` describes the picture.
- `og:site_name`, `og:locale` (for example `en_US`, `de_DE`).
- `og:type`: `website` for ordinary pages, `article` for blog posts.
- `twitter:card`: `summary_large_image` for a large picture or `summary` for a small one. Optional `twitter:site` with your account name.

## Repeat use

Paste once per page with that page's own values. Reuse one share image for the whole site if you do not have one per page.

## Limitations

- Every service caches previews, sometimes for days. A change does not appear everywhere at once.
- Each service has its own image size, shape and file-size limits and can change them. The values here are a common safe choice, not a guarantee for every service.
- The tags are suggestions; services may crop, replace or ignore them.
- Private or password-protected pages cannot be previewed, because the service cannot read them.
- X's documentation for cards could not be checked while this library was built; the tag names here are the long-established ones.
