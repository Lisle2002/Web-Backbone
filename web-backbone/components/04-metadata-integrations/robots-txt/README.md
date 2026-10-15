# robots.txt (separate file)

A plain text file that tells well-behaved search-engine crawlers which parts of your site they may fetch, and where your sitemap is.

## Files

- [robots.txt](robots.txt)

## Requirements

- **This is a separate file, not code for a page.** It must be saved as exactly `robots.txt` (plain text, UTF-8) and be reachable at `https://YOUR_DOMAIN/robots.txt`, in the top folder of the domain. A copy in a sub-folder is ignored.
- Each subdomain (for example `shop.YOUR_DOMAIN`) needs its own file.
- Website builders usually generate this file for you and may not let you upload your own.

## Paste location

- Do not paste into a page. Create a new text file named `robots.txt`, copy the contents of the linked source file, and upload it to the top folder of your site (next to `index.html`).

## Change these values

- `YOUR_DOMAIN`: your real domain in the `Sitemap:` line.
- `Disallow` lines: list the folders you do not want crawlers to fetch, such as an admin or internal-search folder. Delete the example if you have none.
- Keep the `Sitemap:` line only if you publish a `sitemap.xml`.

## Repeat use

One `robots.txt` per domain or subdomain. Never put the same file in several folders.

## Limitations

- **robots.txt is not security.** It only asks crawlers to behave. Anyone can still open a listed folder, and the file itself is public, so do not list secret paths in it. Protect private pages with a login.
- **It does not reliably keep a page out of search results.** A blocked page can still be listed if other sites link to it. To keep a page out of results, use a `noindex` tag on a page that crawlers are allowed to fetch, or restrict access with a password.
- Some crawlers ignore the file. Rules are matched by path and their exact handling can differ slightly between search engines.
- If a placeholder such as `YOUR_PRIVATE_FOLDER` is left in the file it blocks a folder that does not exist, which is harmless but untidy; delete it.
