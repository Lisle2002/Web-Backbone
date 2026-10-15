# Search and filter for on-page cards

Adds a search box and an optional category menu that show or hide cards (or list items, or rows) that are already on the page. It ignores capital letters and accents, matches all typed words, tells screen-reader users how many items are showing, and displays a message when nothing matches.

## Files

- [search-filter.html](search-filter.html)

## Requirements

- Nothing to install or sign up for. Everything searched is already in the page; this is not a site-wide search engine.

## Paste location

- `<style>` block: once, in the `<head>` or above the first filter.
- Markup: wrap your existing cards in this block and add `data-wb-item` to each card.
- `<script>` block: once, just before `</body>`.

## Change these values

- Mark each card with `data-wb-item`.
- Optional `data-wb-keywords="extra words"` on a card for words that should match but are not visible.
- Optional `data-wb-tags="Tag one, Tag two"` on a card to feed the category menu.
- Delete the category `<label>` and `<select>` if you do not need categories.
- The labels, the empty-state message and the "Clear" text.
- `data-wb-min` (default `1`): the number of typed characters before filtering starts.

## Repeat use

Unlimited filters per page, each filtering only the cards inside its own block. Late-inserted filters: run `WB.init(container)`. If you add cards to a filter after it started, re-create the block (this component reads its cards once).

## Limitations

- Cards added to the page after the filter started are not noticed.
- It matches the text on the page (and the optional keywords/tags). It does not rank results, correct typos or search other pages.
- Hidden cards are removed from the page for everyone, including screen readers; the count is announced instead.
- For hundreds of thousands of items you need real search software; for hundreds it is instant.
