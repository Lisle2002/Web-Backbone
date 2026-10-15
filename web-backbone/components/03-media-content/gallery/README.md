# Photo gallery with accessible lightbox

A grid of thumbnails that opens each photo large in a dialog with previous/next buttons, keyboard arrows, swipe on touch screens, a caption and a position counter ("3 of 8"). Each thumbnail is a real link to the full photo, so it still works when scripts do not.

## Files

- [gallery.html](gallery.html)

## Requirements

- Your own photos: a small thumbnail and a larger file for each (the larger file is loaded only when opened).
- A browser with `<dialog>` support (all current browsers). Without it, the links simply open the photo.

## Paste location

- `<style>` block: once, in the `<head>` or above the first gallery.
- Markup: where the gallery should appear.
- `<script>` block: once, just before `</body>`.

## Change these values

- For every photo: the thumbnail `src`, `width`, `height`, the full-size `href`, and the `alt` text on the thumbnail (it is reused in the large view).
- Optional `data-wb-caption` on a link for a caption shown in the large view.
- `data-wb-loop="false"` to stop at the first and last photo.
- `data-wb-label`: the name of the gallery for screen readers.
- Add or delete `<li>` items freely.
- CSS variables: `--wb-gallery-min` (smallest thumbnail width, default `10rem`), `--wb-gap` (default `0.75rem`), `--wb-radius`, `--wb-focus`.

## Repeat use

Unlimited galleries per page; each builds its own viewer the first time one of its photos is opened. Several galleries do not share photos, captions or state. Late-inserted galleries: run `WB.init(container)`.

## Limitations

- Zoom and pinch gestures on the large photo use the browser's own page zoom; there is no built-in image zoom.
- Photos load from whatever address you list; huge originals make the large view slow, so use sensibly sized files.
- Thumbnails must be inside links that point to the photo files. Photos only in `<img>` tags with no link are not picked up.
- Swipe is for touch and pen input only; a mouse drag does nothing.
