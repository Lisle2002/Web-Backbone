# Responsive mobile menu

Collapses an ordinary list of links behind a "Menu" button on narrow screens and shows the plain list on wide screens. Uses the standard disclosure pattern: the button reports whether the menu is open, Escape closes it, and without JavaScript the list is simply visible.

## Files

- [mobile-menu.html](mobile-menu.html)

## Requirements

- Nothing to sign up for or install.
- Your existing links, written as a `<ul>` inside a `<nav>`.

## Paste location

- `<style>` block: once, in the `<head>` or above the first menu.
- Markup: replace your existing navigation list with this `<nav>`.
- `<script>` block: once, just before `</body>`.

## Change these values

- The links inside `<ul data-wb-list>`.
- `aria-label` on the `<nav>` (for example "Main" or "Footer").
- `data-wb-breakpoint`: the screen width in pixels below which the menu collapses (default `768`).
- Button text: the words inside the toggle button.
- CSS variables: `--wb-accent`, `--wb-border`, `--wb-radius`, `--wb-bg`, `--wb-focus`.

## Repeat use

Unlimited, for example a header menu and a footer menu with different `aria-label` values. Each instance has its own state and its own list ID (generated). Late-inserted menus: run `WB.init(container)`.

## Limitations

- The menu opens below the button inside the normal flow of the page; it does not slide in or cover the page. Add your own styling for a full-screen overlay.
- No sub-menus (dropdowns inside the list) are handled; nest links in a second `<ul>` only if you also style them.
- The breakpoint is read once from the attribute; changing it later requires a reload.
