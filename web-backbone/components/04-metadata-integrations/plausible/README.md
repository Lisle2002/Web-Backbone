# Plausible Analytics (privacy-focused alternative)

The one-line script that sends page views to Plausible Analytics, a privacy-focused analytics service. Use it instead of `consent-analytics`, not together with it, unless you really want two analytics tools. The tag ships switched off (inside an HTML comment), so nothing is requested from Plausible until you set it up.

## Files

- [plausible.html](plausible.html)

## Requirements

- **A Plausible account** (the hosted service is a paid subscription after any trial it offers; check their current plans) **or your own self-hosted Plausible** installation. Neither can be created from a web page.
- Your site added in the Plausible dashboard, using the same domain you put in `data-domain`.
- **Use the snippet from your own dashboard if it differs from the supplied source file.** Plausible has changed its snippet over time, and its documentation says to copy the current one from your site settings (Sites, Settings, General, Tracking, then "Review" next to Site installation). The dashboard is the authority, not this file.
- Plausible's data policy states that it does not use cookies or local storage and does not need a consent banner for its analytics. That is the provider's statement, not legal advice, and laws differ by country.

## Paste location

- Inside `<head>` of every page you want counted (or in your shared header template), once.

## Change these values

- `data-domain`: the domain you registered in Plausible, without `https://`.
- Switch the tag on: delete the two lines that open and close the comment around the script tag (the line `<!--` above it and the line `-->` below it). Until you do, the tag does nothing.
- `src`: keep `https://plausible.io/js/script.js` for the hosted service. For a self-hosted installation, use the script address from your own server.

## Repeat use

This is page-wide: one copy per page. It is meant to be on every page, not several times on one page. Custom events are sent from `track-clicks`, not from here.

## Limitations

- Visits are counted only on the domain registered in the dashboard. Testing on `localhost` or a staging address will not show up as that domain, and the script may ignore local addresses.
- Ad and tracker blockers block this script for some visitors, so the numbers are a floor, not an exact count.
- This component does not wait for consent. If your own legal advice says you need a choice before any analytics, place the script from your consent flow instead.
- Custom events (for example from `track-clicks`) must first be created as Goals in the Plausible dashboard, with exactly the same name; otherwise Plausible receives them but does not show them.
- Pricing, plans and the exact snippet format were not verified when this library was built and may have changed.
