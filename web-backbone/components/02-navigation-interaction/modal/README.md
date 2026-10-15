# Modal dialog

A pop-up dialog built on the browser's native `<dialog>` element: it traps focus, closes with Escape, blocks the page behind it, and returns focus to the button that opened it. The opening control can be a normal link, so there is a fallback when scripts do not run.

## Files

- [modal.html](modal.html)

## Requirements

- Nothing to install or sign up for. Needs a browser with `<dialog>` support (all current browsers).

## Paste location

- `<style>` block: once, in the `<head>` or above the first dialog.
- Markup: where the open button should appear. The dialog sits next to it.
- `<script>` block: once, just before `</body>`.

## Change these values

- The open control's text and, if it is a link, its `href` (the page shown when scripts do not run, and when a visitor opens the link in a new tab).
- The title inside `[data-wb-title]` and the dialog content. The title is an `<h2>`; change it to the heading level that fits your page.
- `data-wb-backdrop-close="false"` on the wrapper if clicking outside the box should not close it.
- CSS variables: `--wb-bg`, `--wb-text`, `--wb-border`, `--wb-radius`, `--wb-accent`, `--wb-focus`.

## Repeat use

Unlimited dialogs, each with its own opener, title ID and focus return. Several openers inside one wrapper open the same dialog. A dialog can also sit inside another dialog's content (put a whole second copy of the markup there): each component controls only its own opener, close button, title and dialog, so closing the inner dialog leaves the outer one open, and focus goes back level by level. Late-inserted dialogs: run `WB.init(container)`.

## Limitations

- The page behind may still scroll with the mouse wheel on some browsers; the dialog does not lock page scrolling (doing so changes page layout, so it is left to you).
- Without JavaScript the dialog's content is not shown (a closed `<dialog>` is hidden), so give the link a real page to go to.
- Each nested dialog needs its own close button. Escape closes the top dialog first. Keep nesting shallow for easier navigation.
- On a link opener, Ctrl, Cmd, Shift or Alt with the click, or a click with any button but the main one, does what the browser normally does and does not open the dialog. A button opener opens the dialog for any click. A click that another script has already cancelled does not open the dialog.
