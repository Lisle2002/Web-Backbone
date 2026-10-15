# Anchor scrolling with a fixed header

Makes links such as `#contact` land on the section instead of hiding it behind a fixed or sticky header. It measures your header, uses smooth scrolling unless the visitor prefers reduced motion, and moves keyboard focus to the section that was linked.

## Files

- [anchor-scroll.html](anchor-scroll.html)

## Requirements

- Nothing to install or sign up for.
- Sections with an `id` to link to.

## Paste location

- `<style>` block: once, in the `<head>`.
- The empty marker `<div>`: anywhere in `<body>`.
- `<script>` block: once, just before `</body>`.

## Change these values

- `data-wb-header`: CSS selector of your fixed or sticky header (default `header`). If the header is not fixed or sticky, no spacing is added.
- `data-wb-gap`: extra space in pixels below the header (default `8`).
- If your header height never changes you can skip the script and the marker and use only this line in your own CSS: `html { scroll-padding-top: 80px; }` (use your header height).

## Repeat use

Use it once per page. Extra copies of the marker or the script are ignored.

## Limitations

- It cannot see a header that appears only after scrolling or a header whose height changes after the first measurement unless the browser supports `ResizeObserver` (all current browsers do).
- Pages that scroll inside a container instead of the window are not covered.
- It does not intercept link clicks, so the browser's normal fragment behavior (history entries, `:target` styling) is unchanged.
