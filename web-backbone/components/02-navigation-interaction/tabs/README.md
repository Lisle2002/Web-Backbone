# Tabs

Turns a set of titled blocks into a keyboard-accessible tab interface. Without JavaScript the blocks are simply shown one after another, each with its heading.

## Files

- [tabs.html](tabs.html)

## Requirements

- Nothing to install or sign up for.

## Paste location

- `<style>` block: once, in the `<head>` or above the first tab set.
- Markup: where the tabs should appear.
- `<script>` block: once, just before `</body>`.

## Change these values

- One `<div data-wb-panel>` per tab. The first heading inside it becomes the tab label. The example uses `<h3>`; use the heading level that fits your page (one level below the heading above the tabs).
- `data-wb-label` on the wrapper: a short name for the whole tab set, read by screen readers.
- `data-wb-activation`: `auto` (arrow keys switch tabs immediately, default) or `manual` (arrow keys move focus, Enter or Space switches).
- `data-wb-active`: which tab is open first, counting from 1 (default `1`).
- Optional `data-wb-tab="Label"` on a panel to set the label without a heading.
- CSS variables: `--wb-accent`, `--wb-border`, `--wb-focus`, `--wb-radius`.

## Repeat use

Unlimited tab sets per page, including more than one with the same tab titles. Tab and panel IDs are generated per instance. Late-inserted tab sets: run `WB.init(container)`.

## Limitations

- Tabs are horizontal only. Vertical tab lists need different arrow keys and styling.
- The heading inside each panel is hidden when the script runs, because the tab already names the panel; if the heading is part of your page outline, use `data-wb-tab` for labels and keep your own heading outside the panel.
- Nested tab sets are not supported (only direct children of the wrapper are panels, so a second set inside a panel works on its own, but tab keys are not shared).
