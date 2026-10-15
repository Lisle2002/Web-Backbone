# Directions links

Turns one visible address (or coordinates) into "Get directions" links for Google Maps and Apple Maps, with the correct URL encoding. The address stays visible as plain text whether or not the script runs.

## Files

- [directions-links.html](directions-links.html)

## Requirements

- Nothing to sign up for. Google's Maps URLs need no API key.
- JavaScript. Without it the address text remains and the links are not added.

## Paste location

- `<style>` block: once, in the `<head>` or above the first instance.
- Markup: where the address and links should appear.
- `<script>` block: once, just before `</body>` (it is safe to paste again; it only runs once).

## Change these values

- The address text inside `data-wb-address` (visible text, used to build the links), or `data-wb-latlng="LATITUDE,LONGITUDE"` for an exact point.
- `data-wb-providers`: `google`, `apple` or `google,apple`.
- `data-wb-travelmode`: `driving`, `walking`, `bicycling` (Google only) or `transit`.
- Optional `data-wb-label-google` and `data-wb-label-apple` to change the link text.

## Repeat use

Unlimited. Each block builds its own links from its own address. Late-inserted blocks: call `WB.init(container)` after inserting.

## Limitations

- Apple Maps links open Apple Maps on Apple devices and apple.com's web maps elsewhere. Apple's documentation shows `http://maps.apple.com/` examples; the `https` form is used here and was not confirmed in that document.
- Google travel modes `bicycling` and `two-wheeler` have no Apple equivalent, so the Apple link then leaves the mode unset.
- Very long addresses can exceed Google's 2,048-character limit for a Maps URL.
