# Site ownership verification tags

The small `<meta>` tags that search engines and social platforms ask you to add to your home page to prove you own the site (for example Google Search Console, Bing Webmaster Tools, Meta Business and Pinterest).

## Files

- [site-verification.html](site-verification.html)

## Requirements

- An account with each service you want to verify with. Each service gives you its own tag with a code that is unique to you. Copy the exact tag from the service's verification screen; the values in the source file are placeholders.
- Access to the `<head>` of your home page. Some services only check the home page.
- The codes are public identifiers. They are meant to be visible in your page source and are not secrets.

## Paste location

- Inside `<head>` of your home page (or in the shared head template, which puts it on every page). Keep only the lines for services you use.

## Change these values

- Replace each `YOUR_..._VERIFICATION_CODE` with the code from that service, or paste the whole tag the service gives you in its place.
- Delete the lines you do not need.

## Repeat use

One tag per service. Do not repeat the same tag on the same page.

## Limitations

- Only Google's tag format and placement (inside `<head>` of the home page, within the first 2 MB of the file, for a URL-prefix property) were checked against its documentation. Tag names for the other services are the common ones but were not verified; use the tag each service gives you.
- Google's HTML-tag method works for URL-prefix properties, not for domain properties; domain properties are verified through your DNS settings instead.
- The tag must be in the HTML the server sends. A tag inserted later by JavaScript may not be seen by the service.
- Website builders usually have a dedicated field for these codes; use it if it exists.
- A placeholder left in a tag will fail verification. It does no other harm.
