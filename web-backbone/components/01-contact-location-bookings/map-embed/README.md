# Google Map embed

Shows a map of your location with a plain iframe and adds a text link that opens the same place in Google Maps. No script, so there is nothing to initialize. The frame ships with a blank placeholder address, so the browser contacts Google only after you replace it.

## Files

- [map-embed.html](map-embed.html)

## Requirements

- A place that exists on Google Maps.
- **Option A (simplest, no API key):** on google.com/maps search for the place, choose **Share**, then **Embed a map**, and copy the `src="..."` value from the code Google gives you.
- **Option B (Maps Embed API):** a Google Cloud project with the Maps Embed API enabled and an API key. The key is a public identifier that appears in your page source, so restrict it to your website address (HTTP referrers) in Google Cloud. Check Google's current pricing and billing requirements before relying on it.
- An `https://` page. Some website builders strip iframes; use a custom-code area that permits embeds.

## Paste location

- Put the `<style>` block once in the `<head>` (or directly above the first map).
- Put the `<figure>` where the map should appear.

## Change these values

- `src` of the iframe: replace the **whole** value (it starts as the blank placeholder `about:blank#YOUR_GOOGLE_MAPS_EMBED_ADDRESS`) with your Option A embed URL, or the Option B URL `https://www.google.com/maps/embed/v1/place?key=YOUR_MAPS_EMBED_API_KEY&q=YOUR_ADDRESS_URL_ENCODED`.
- `title` of the iframe: a short description for screen-reader users.
- The `href` of the text link: `https://www.google.com/maps/search/?api=1&query=YOUR_ADDRESS_URL_ENCODED` (spaces as `%20` or `+`, commas as `%2C`).
- Optional CSS variables: `--wb-map-ratio` (default `4 / 3`) and `--wb-radius`.

## Repeat use

Unlimited. Copy only the `<figure>` for each extra map; the `<style>` is needed once. There are no IDs and no script.

## Limitations

- The iframe loads Google content (and Google may set cookies) as soon as it nears the viewport. If you need a visitor's permission first, use `click-to-load` with a map URL instead.
- Ad blockers, a strict Content-Security-Policy (`frame-src`) or a builder that removes iframes will leave an empty frame; the text link still works.
- The share-dialog embed URL is Google's own format and could change. The Embed API URL format was checked against Google's documentation; the share-dialog format was not available in a documented form.
- This is plain HTML, so it cannot warn you about a leftover placeholder. The placeholder (`about:blank#...`) is a blank page, so a forgotten one shows an empty frame and the browser contacts nobody; there is no console warning and no map.
- `aspect-ratio` needs a reasonably current browser.
