# Click-to-load third-party embed

Shows a short notice and a button instead of a third-party embed (a video, a map). Nothing is requested from the other site until the visitor presses the button, which then replaces the notice with the real embed. A normal link to the same content is kept as an alternative.

## Files

- [click-to-load.html](click-to-load.html)

## Requirements

- The embed address (the `src` of the provider's iframe). Built-in allowed hosts: `www.youtube-nocookie.com`, `www.youtube.com`, `player.vimeo.com` and `www.google.com` (Google Maps embeds only, paths starting `/maps/embed`). Add others with `data-wb-allow-hosts`.
- An `https://` page and `https://` embed addresses only.

## Paste location

- `<style>` block: once, in the `<head>` or above the first embed.
- Markup: where the embed should appear.
- `<script>` block: once, just before `</body>`.

## Change these values

- `data-wb-src`: the provider's embed address.
- `data-wb-title`: a short description of the content (needed for accessibility).
- `data-wb-ratio`: the shape, for example `16 / 9` (default) or `4 / 3`.
- `data-wb-allow-hosts`: extra host names, separated by commas, if you need a provider that is not built in.
- `data-wb-permissions`: the iframe's `allow` list (default `fullscreen; picture-in-picture; encrypted-media`). Remove entries the embed does not need.
- The notice text, the button text and the alternative link inside the placeholder.

## Repeat use

Unlimited, each with its own notice and embed. Loading one does not load the others. Late-inserted embeds: run `WB.init(container)`.

## Limitations

- It delays loading; it is not a full consent system. If you also need to remember consent, record it yourself or use a consent tool.
- The allowed-host list protects you if embed addresses ever come from outside content, but you should still only list providers you trust.
- Without JavaScript the button does nothing; the link under it is the fallback.
- The provider decides whether its player may be embedded and what it stores.
