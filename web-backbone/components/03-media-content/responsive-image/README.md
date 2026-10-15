# Responsive image

An image that scales with its container, loads the right file size for the visitor's screen, avoids layout jumps while loading, and has proper alt text and an optional caption. It is plain HTML and CSS with no script.

## Files

- [responsive-image.html](responsive-image.html)

## Requirements

- Your own image files, exported at two or three widths (for example 480, 960 and 1600 pixels wide) and, if you want smaller downloads, a WebP copy of each. Any image editor or export tool can make them.
- The real pixel size of the largest file (for the `width` and `height` attributes).

## Paste location

- `<style>` block: once, in the `<head>` or above the first image.
- The `<figure>`: where the image should appear.

## Change these values

- File paths in every `srcset`, in `src` and the `<source>` line.
- `width` and `height`: the pixel size of the file named in `src` (they set the shape of the reserved space, not the displayed size).
- `alt`: a short description of what the picture shows. Use `alt=""` only if the picture is purely decorative.
- `sizes`: how wide the image is shown. `100vw` means full screen width; `(min-width: 60rem) 50vw, 100vw` means half the screen on wide screens and full width otherwise.
- The caption (or delete the `<figcaption>`).
- For the first big image at the top of the page, remove `loading="lazy"` and add `fetchpriority="high"`.

## Repeat use

Unlimited. Copy only the `<figure>`; the `<style>` is needed once. There is no script and no ID.

## Limitations

- The component does not create the resized files; you must export them.
- A browser picks one source; the choice depends on screen density as well as width, so the file you see in the Network tab can differ from your expectation.
- `loading="lazy"` on an image at the very top of the page can slow the visible start of the page; remove it there.
