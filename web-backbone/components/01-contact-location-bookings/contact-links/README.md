# Phone, email, SMS, WhatsApp and chat-app links

A list of native links that open the visitor's phone, mail, text-message, WhatsApp, Messenger or Telegram app (and a link to your Instagram profile). This is plain HTML with a little CSS and no script; the notes below show how to write each link correctly.

## Files

- [contact-links.html](contact-links.html)

## Requirements

- Nothing to install or sign up for.
- The visitor needs a device or app that handles the link type (a phone app for `tel:`, a mail app for `mailto:`, WhatsApp for `wa.me`).
- Optional chat links need your own accounts: a Facebook Page with messaging turned on for Messenger, a Telegram username for Telegram, an Instagram profile for Instagram.

## Paste location

- `<style>` block: once, in the `<head>` or above the first list.
- The `<ul>`: where the contact links should appear. Delete the items you do not want.

## Change these values

- `tel:+15555550100`: your number in international format, starting with `+` and the country code, with no spaces. The visible text can be written any way you like.
- `sms:+15555550100`: the same number. A prefilled text is added with `?body=Hello%20from%20the%20website`, but how it is handled differs between phones; remove `?body=...` if it misbehaves on yours.
- `https://wa.me/15555550100?text=Hello%20from%20the%20website`: the number in international format with **digits only** (no `+`, spaces, dashes or leading zeros). `text=` is optional and must be URL-encoded.
- `mailto:YOUR_EMAIL@YOUR_DOMAIN?subject=Website%20enquiry`: your address. Encode spaces as `%20` and line breaks as `%0A`. `subject` and `body` are optional.
- Optional chat apps (commented out in the list; remove the `<!--` and `-->` marks around the ones you use): `https://m.me/YOUR_FACEBOOK_PAGE_NAME` (your Facebook Page's name or ID), `https://t.me/YOUR_TELEGRAM_USERNAME`, and `https://www.instagram.com/YOUR_INSTAGRAM_HANDLE/`.
- Link text and the accessible hint for each link.

## Repeat use

Unlimited. There is no script, no ID and nothing to initialize. Use the `<ul>` as many times as you like.

## Limitations

- `mailto:` depends on the visitor having a mail app configured; many desktop visitors do not. Offer the contact form as well.
- An email address written into the page can be read by anyone or any program that downloads the page. Hiding it with tricks does not reliably stop that, so this component does not pretend to; use the contact form if you want to keep the address out of the page.
- Prefilled SMS text is not handled the same way on every phone.
- The `wa.me` format is WhatsApp's long-standing click-to-chat link, but WhatsApp's own help page could not be fetched while this library was checked, so confirm it on WhatsApp's site.
- Some website builders remove `tel:`, `sms:` or `mailto:` from their link fields; place these in an HTML/embed block.
- The `m.me` and `t.me` formats match what Meta and Telegram document. A Messenger link only works for a Page that has messaging set up. The Instagram link opens your profile, not a message box; Instagram's own message-link format was not verified, so it is not used.
