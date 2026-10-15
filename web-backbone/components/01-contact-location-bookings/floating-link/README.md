# Floating contact button

A pill-shaped link fixed to the bottom corner of the screen, for example "Chat on WhatsApp". It is a plain link, so it works without JavaScript and the destination can be any link (WhatsApp, `tel:`, a chat page).

## Files

- [floating-link.html](floating-link.html)

## Requirements

- Nothing to sign up for. WhatsApp links need WhatsApp (or WhatsApp Web) on the visitor's side.

## Paste location

- Put the `<style>` block in the `<head>`.
- Put the `<a>` anywhere inside `<body>`; just before `</body>` is conventional.

## Change these values

- `href`: `https://wa.me/YOUR_PHONE_DIGITS` (international format, digits only) with optional `?text=` (URL-encoded), or `tel:+15555550100`, or any chat link.
- The visible text.
- CSS variables: `--wb-accent` (button color), `--wb-on-accent` (text color, default white), `--wb-float-z` (stacking order, default 900), `--wb-focus`.
- To move it to the left, change `right:` to `left:` in the style block.

## Repeat use

Use it once per page. If you also use `back-to-top`, that button sits bottom-left by default, so the two do not collide.

## Limitations

- It floats over page content; on very small screens it can cover text near the bottom corner.
- The default green and white have good contrast, but if you change `--wb-accent` check the contrast yourself.
- The WhatsApp link format is described in `contact-links`; its official help page could not be fetched while this library was checked.
