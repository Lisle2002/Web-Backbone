# Skip-to-content link

A link that is invisible until a keyboard user presses Tab, then jumps past the menu to the main content. It helps keyboard and screen-reader users and is a standard accessibility feature. It is plain HTML and CSS; a few lines of script make sure focus really moves in every browser.

## Files

- [skip-link.html](skip-link.html)

## Requirements

- Nothing to install or sign up for.
- An element on your page with `id="main"` (or another id that you set in the link). Give it `tabindex="-1"` so it can receive focus.

## Paste location

- `<style>` block: once, in the `<head>`.
- The `<a>`: the very first thing inside `<body>`.
- `<script>` block: once, just before `</body>`.
- Add `id="main" tabindex="-1"` to your main content element (for example `<main id="main" tabindex="-1">`).

## Change these values

- The link's `href` (`#main`) and its text.
- The `id` on your main content area (it must match the `href`).
- CSS variables: `--wb-accent`, `--wb-on-accent`, `--wb-focus`.

## Repeat use

One per page. Place it before any other link or button.

## Limitations

- Mouse users never see it, by design.
- If a fixed header covers the top of the page, combine it with `anchor-scroll` so the focused content is not hidden.
- The link stays hidden by moving off-screen, which works in current browsers; very old browsers may ignore `transform`.
