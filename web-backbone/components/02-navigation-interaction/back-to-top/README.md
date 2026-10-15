# Back-to-top button

A button that appears after the visitor has scrolled down and returns them to the top of the page. It moves keyboard focus to the start of the page so focus is not lost when the button disappears, and it does not animate for visitors who prefer reduced motion.

## Files

- [back-to-top.html](back-to-top.html)

## Requirements

- Nothing to install or sign up for.

## Paste location

- `<style>` block: once, in the `<head>`.
- The `<button>`: anywhere in `<body>`, conventionally just before `</body>`.
- `<script>` block: once, just before `</body>`.

## Change these values

- `data-wb-offset`: how many pixels to scroll before the button appears (default `400`).
- `data-wb-focus`: optional CSS selector for the element that should receive focus after the jump (default: the first focusable element on the page, for example your skip link or logo link).
- Button text.
- CSS variables: `--wb-accent`, `--wb-on-accent`, `--wb-focus`. The default position is bottom-left, so it does not collide with `floating-link` (bottom-right); change `left` to `right` if you prefer.

## Repeat use

Use one per page. A second copy would add a second button in the same corner.

## Limitations

- It uses the window's scroll position. If your site scrolls inside a container (an app-style layout) the button will not see that scrolling.
- Focus moves to the first focusable element in the page; set `data-wb-focus` if that is not the best place.
- Native smooth scrolling is a browser feature; on very old browsers the jump is instant.
