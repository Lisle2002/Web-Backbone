# Light/dark theme toggle

A button that cycles the page between "System" (follows the visitor's device setting), "Light" and "Dark", remembers the choice, and sets matching color variables (`--wb-bg`, `--wb-text`, and the other `--wb-*` colors) that your styles can use. Without a saved choice the page follows the system setting.

## Files

- [theme-toggle.html](theme-toggle.html)

## Requirements

- Nothing to install or sign up for.
- Browser storage (`localStorage`) to remember the choice. If it is blocked the toggle still works until the page is reloaded.
- Your own CSS must use the color variables (or the `html[data-wb-theme]` attribute) for the toggle to change anything on your page. The default palette in the style block is a starting point.

## Paste location

- Step 1, in `<head>` as early as possible (before your stylesheets): the small `<script>` that restores a saved choice and prevents a flash of the wrong theme. Optional, but recommended.
- Step 2, `<style>` block: once, in the `<head>`.
- Step 3, the `<button>`: where the toggle should appear (for example in the header).
- Step 4, the second `<script>` block: once, just before `</body>`.

## Change these values

- The palette values under `:root` and the dark blocks in the style block.
- If your site already has its own colors, delete the last rule of the style block (`body { ... }`) and use `var(--wb-bg)` and `var(--wb-text)` in your CSS, or write your own rules under `html[data-wb-theme="dark"]` and inside `@media (prefers-color-scheme: dark)`.
- `data-wb-storage-key` on the button if you need a different storage name (the same value must be used in the head script).
- Button labels in the script (`LABELS`).

## Repeat use

Several buttons are fine (for example in the header and the footer); a change on one updates the label on all. Only one copy of the head script and the style block is needed.

## Limitations

- Only elements that use `--wb-*` variables (or that you style under `html[data-wb-theme]`) change color. Images and other site CSS with fixed colors are not recolored.
- The style block sets the page background and text color on `body`; delete that rule if your site already controls them.
- The head script is not essential: without it a saved choice is applied when the page's main script runs, which can cause a brief flash.
- Choosing "System" follows the device setting only through CSS, so a change made in the operating system is picked up at once; the button label does not change because the mode is still "System".
