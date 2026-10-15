# Add to calendar (Google link and .ics download)

Gives visitors an "Add to Google Calendar" link and a downloadable `.ics` file (works with Apple Calendar, Outlook and most calendar apps) for one event. The event details are settings on the element.

## Files

- [add-to-calendar.html](add-to-calendar.html)

## Requirements

- Nothing to sign up for. The `.ics` file is created in the visitor's browser; nothing is uploaded.
- JavaScript, and a browser that supports file downloads from a generated file (all current desktop and Android browsers; see limitations for iPhone).

## Paste location

- `<style>` block: once, in the `<head>` or above the first instance.
- Markup: where the buttons should appear.
- `<script>` block: once, just before `</body>`.

## Change these values

- `data-wb-title`: the event title.
- `data-wb-start` and optional `data-wb-end`: ISO date and time **with an explicit time zone**, for example `2027-06-01T18:00:00-04:00` (offset) or `2027-06-01T22:00:00Z` (UTC). For an all-day event use dates only: `2027-06-01` (and an optional last day in `data-wb-end`, included).
- `data-wb-duration`: minutes, used when `data-wb-end` is left out (default `60`).
- `data-wb-location`, `data-wb-description` (plain text, new lines allowed) and `data-wb-url` (an `https://` page about the event). All optional.
- `data-wb-label-google` and `data-wb-label-ics` to change the button text.

## Repeat use

Unlimited. Each block reads its own event settings. Two different events on one page are two blocks. Late-inserted blocks: run `WB.init(container)` after inserting.

## Limitations

- Times must carry a time zone or offset. The file stores the moment in UTC, so recurring events, daylight-saving rules for repeated events and named time zones are not covered.
- On iPhone and iPad, browsers may show the generated `.ics` file as text instead of offering to add it to Calendar. The Google link and an `.ics` file hosted as a real file on your site work more reliably there.
- The Google link uses Google's `calendar/render?action=TEMPLATE` address, which is widely used. It was not available in Google's published documentation when this library was checked, so treat it as unverified.
- No reminders (alarms), attendees or recurrence are written. Details are plain text; HTML is not supported.
- There is no Outlook.com or Yahoo link; those apps read the `.ics` file.
