# Click tracking without personal data

Records clicks on the links and buttons you mark, such as phone, email, text-message, WhatsApp and booking links, as named events. It sends only the event name, a coarse type (for example `tel` or `mailto`) and an optional placement label you choose. It never sends the phone number, email address, link address, link text or anything typed into a form.

## Files

- [track-clicks.html](track-clicks.html)

## Requirements

- **An analytics tool already on the page:**
  - `ga4`: the `consent-analytics` component from this library. Events are sent only after the visitor has allowed analytics and the Google tag has loaded.
  - `plausible`: the Plausible script from the `plausible` component (or the one from your dashboard). The goals must exist in Plausible with the same names.
  - `none`: no provider. The component only fires a browser event (`wb:track`) that your own code can listen to.
- Nothing else. No account, key or external script is added by this component.

## Paste location

- Wrap the part of the page whose links you want to track (usually `<main>`, or the whole `<body>` content) in the container shown below. Or put `data-wb="track-clicks"` and the settings on an element that already wraps it.
- `<script>` block: once, just before `</body>`. No styles are needed.

## Change these values

- `data-wb-provider`: `ga4`, `plausible` or `none`.
- On each link or button you want counted, add `data-wb-track="event_name"` (a `<button>` is reported with the type `button`). Names must start with a lowercase letter and use only lowercase letters, digits and underscores (maximum 40 characters), for example `phone_click`.
- Optional on the same element: `data-wb-track-place="header"`, a short label for where the link is (lowercase letters, digits, `-` and `_`, up to 30 characters).
- Optional on the container: `data-wb-require-consent="true"` makes the `plausible` provider send only when `consent-analytics` is on the page and the visitor has allowed analytics.

## Repeat use

Several containers may exist on one page, each with its own provider. Tracked elements inside a container, including ones inserted later, work without any extra step because the container listens for clicks. Do not nest one container inside another.

## Limitations

- Only primary clicks and keyboard activation are seen. Middle-click and "open in new tab" shortcuts on some browsers are not.
- `sent: true` means the event was handed to the analytics tool. It does not prove Google or Plausible received it; blockers and network failures can stop it.
- Only the coarse `method` and the placement label are sent. If you add `data-wb-track-place` values, keep them generic. Page addresses are still recorded by the analytics tool itself.
- A phone or email link that has no handler on the visitor's device (for example no mail app) is still counted as a click, because the page cannot see what happens afterward.
- The `ga4` provider depends on the `consent-analytics` component. Without it, nothing is sent.
- Plausible goals must be created in the dashboard first.
