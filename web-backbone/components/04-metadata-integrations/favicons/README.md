# Favicons and web app manifest

The small set of links that gives your site an icon in browser tabs, bookmarks, phone home screens and installed-app lists, plus a minimal `manifest.webmanifest` file that names the site and lists its larger icons.

## Files

- [favicons.html](favicons.html)
- [manifest.webmanifest](manifest.webmanifest)

## Requirements

- The icon image files themselves. You must create them with any image editor; this component does not generate them. A practical set: `favicon.ico` (32 × 32), `icon.svg` (optional, scalable), `apple-touch-icon.png` (180 × 180, with a solid background), `icon-192.png`, `icon-512.png`, and optionally `icon-mask.png` (512 × 512 with extra empty margin so it survives being cropped to a circle or rounded square).
- Files placed in the top folder of your site, or paths adjusted in the source file.

## Paste location

- The `<link>` lines: inside `<head>` of every page.
- `manifest.webmanifest`: a separate file saved in the top folder of your site, next to your `index.html`.

## Change these values

- File paths if your icons are not in the top folder.
- In the manifest: `name`, `short_name` (shown under the icon, keep it short), `theme_color` and `background_color`.
- Delete the lines for icons you do not have.

## Repeat use

The `<link>` lines go on every page (or in your shared header template). The manifest is one file for the whole site.

## Limitations

- Browsers cache favicons for a long time; changes can take days to appear.
- The manifest here is deliberately minimal. It does not make the site installable as an app (that needs more, such as a start address and a service worker where required) and it does not claim to.
- The `.webmanifest` file must be served as a normal file; some servers need the type `application/manifest+json`, and many ignore the difference.
- Paths starting with `/` assume the site lives at the top of the domain. For a site in a sub-folder, change them.
