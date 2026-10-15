# Accessible FAQ accordion

Questions and answers using the browser's built-in `<details>` and `<summary>` elements, so keyboard and screen-reader behavior comes from the browser. The script is optional: it adds "only one open at a time" and opening an item from a link such as `#shipping`.

## Files

- [faq.html](faq.html)

## Requirements

- Nothing to install or sign up for. Without JavaScript every item still opens and closes.

## Paste location

- `<style>` block: once, in the `<head>` or above the first FAQ.
- Markup: where the questions should appear.
- `<script>` block: once, just before `</body>` (only needed for the one-open-at-a-time and link features).

## Change these values

- Each `<summary>` (question) and answer.
- `data-wb-exclusive="true"` to keep only one item open at a time; remove the attribute to allow several open.
- Add `open` to a `<details>` to start with that item open.
- Add an `id` to a `<details>` (for example `id="shipping"`) so a link `#shipping` opens it.
- CSS variables: `--wb-border`, `--wb-accent`, `--wb-focus`.

## Repeat use

Unlimited. "One open at a time" applies within one FAQ block, never across blocks. IDs you add to items are your own and must be unique on the page. A whole FAQ block can sit inside an answer of another one: each block looks after its own items, and with "one open at a time" an item closes only the items on its own level, never the answer it sits in.

## Limitations

- The "+" and "-" marks are decorative and added with CSS; browsers that do not support the empty alternative text for generated content may read them out.
- Animated opening is not included (and so reduced-motion needs no special handling).
- A link to an item inside a nested FAQ opens that item only. If the answer around it is closed, the item stays hidden until the visitor opens the answer.
- If you also publish this content as structured data, see `structured-data`: Google no longer shows FAQ rich results for most sites, but the markup remains valid.
