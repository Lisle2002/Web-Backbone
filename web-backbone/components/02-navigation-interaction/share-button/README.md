# Share button

A "Share" button that opens the device's own share sheet when the browser offers one, and otherwise copies the page link to the clipboard. It reports success only when sharing or copying actually worked.

## Files

- [share-button.html](share-button.html)

## Requirements

- Nothing to install or sign up for.
- The share sheet (`navigator.share`) exists on most phones and some desktop browsers and needs an `https://` page. Without it the button copies the link, which also needs `https://` (or `localhost`) for the modern clipboard feature.

## Paste location

- `<style>` block: once, in the `<head>` or above the first button.
- Markup: where the button should appear.
- `<script>` block: once, just before `</body>`.

## Change these values

- `data-wb-url`: the link to share (default: this page's canonical link, or the current address).
- `data-wb-title` and `data-wb-text`: what the share sheet shows (default: the page title and nothing).
- `data-wb-copied` and `data-wb-failed`: the messages for the copy fallback.
- Button label.

## Repeat use

Unlimited. Each button can share its own link (set `data-wb-url`), for example one per article card. Late-inserted buttons: run `WB.init(container)`.

## Limitations

- `navigator.share` must be started by a click and is available only on `https://` pages; browser support varies, which is why the copy fallback is included.
- The share sheet's targets (WhatsApp, Mail, and so on) are chosen by the visitor's device. This component does not add per-network buttons or share counts.
- The component reports that sharing was started, not that anyone received it.
