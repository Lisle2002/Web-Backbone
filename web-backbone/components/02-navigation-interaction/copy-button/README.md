# Copy-to-clipboard button

A button that copies a piece of text (a code, an address, a promo code, a link) to the visitor's clipboard and tells them whether it worked. If the browser refuses, the exact text appears in a small box, already selected, so they can copy it by hand with Ctrl+C or Cmd+C.

## Files

- [copy-button.html](copy-button.html)

## Requirements

- Nothing to install or sign up for.
- The modern clipboard feature needs an `https://` page (or `localhost`). Older methods are tried when it is missing.

## Paste location

- `<style>` block: once, in the `<head>` or above the first button.
- Markup: where the text and button should appear.
- `<script>` block: once, just before `</body>`.

## Change these values

- The visible text inside `[data-wb-source]`, or put the text to copy in `data-wb-text` on the wrapper to copy something different from what is shown.
- Button label and the messages: `data-wb-done` (default "Copied") and `data-wb-failed` (default "Press Ctrl+C or Cmd+C to copy").
- `data-wb-field-label`: the name a screen reader gives the manual-copy box (default "Text to copy").
- CSS variables: `--wb-border`, `--wb-radius`, `--wb-accent`, `--wb-focus`.

## Repeat use

Unlimited. Each button copies its own text and shows its own message. Late-inserted buttons: run `WB.init(container)`.

## Limitations

- Copying only works from a click or key press, never automatically on page load.
- If the browser's clipboard permission is blocked by policy (some embedded or enterprise browsers), copying fails and the manual message is shown. The script cannot override that.
- Only plain text is copied; images and rich formatting are not.
- When the browser refuses, the script cannot copy for the visitor: they have to press Ctrl+C or Cmd+C themselves (on a phone, touch and hold the selected text). The box stays until they press Escape or move on, and it is not shown when copying works.
