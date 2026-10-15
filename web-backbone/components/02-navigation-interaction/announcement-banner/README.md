# Dismissible announcement banner

A notice bar at the top of the page that a visitor can dismiss. The dismissal is remembered for a number of days, changing the banner's `id` shows it again to everyone, and you can set an optional start and end time.

## Files

- [announcement-banner.html](announcement-banner.html)

## Requirements

- Nothing to install or sign up for.
- Browser storage (`localStorage`) to remember the dismissal. If storage is blocked the banner still works, but it reappears on the next page load.

## Paste location

- `<style>` block: once, in the `<head>` or above the banner.
- Markup: at the very top of `<body>` (or wherever the banner should sit).
- `<script>` block: once, just before `</body>`.

## Change these values

- The message text and optional link inside the banner.
- `data-wb-id`: a short name for this announcement (for example `spring-sale-2027`). Change it to show the banner again to people who dismissed the old one.
- `data-wb-remember-days`: how long a dismissal is remembered (default `30`).
- Optional `data-wb-start` and `data-wb-end`: ISO date and time **with a time zone**, for example `2027-03-01T00:00:00-05:00`. Outside this window the banner stays hidden.
- CSS variables: `--wb-accent` (background), `--wb-on-accent` (text), `--wb-focus`.

## Repeat use

Several banners can exist, each with its own `data-wb-id`. Dismissing one does not affect the others. Two banners that share the same `data-wb-id` share one dismissal.

## Limitations

- The banner is hidden until the script runs. Visitors without JavaScript do not see it. If the message is essential, put it in normal page content instead.
- Dismissals are stored per browser. They are not shared between a visitor's devices.
- The start and end times use the visitor's clock. A wrong device clock can show or hide the banner at the wrong time.
