# Business-hours status ("Open now")

Shows whether a business is open right now, and when it next opens or closes, using the business's own time zone (not the visitor's). Supports several time ranges per day, overnight hours, closed dates and special days. It can also print the weekly schedule as a list. If anything is wrong with the settings, your plain-text fallback stays on the page.

## Files

- [hours-status.html](hours-status.html)

## Requirements

- The business's IANA time-zone name, for example `Europe/Berlin` or `America/Chicago` (not "EST").
- Nothing to sign up for. The check runs in the visitor's browser using the browser's own time-zone database.

## Paste location

- `<style>` block: once, in the `<head>` or above the first instance.
- Markup: where the status (and optional list) should appear.
- `<script>` block: once, just before `</body>`.

## Change these values

- `data-wb-timezone`: the IANA time-zone name of the business.
- `data-wb-hours`: weekly hours. Groups are separated by `;`. Each group is days, a space, then times. Days: `Mon`, `Mon-Fri`, `Sat,Sun`, or wrap-around ranges like `Fri-Mon`. Times: `09:00-17:00`, several ranges `09:00-12:00,13:00-17:00`, overnight `18:00-02:00`, `24h`, or `closed`. Days not listed are closed.
- `data-wb-closed` (optional): dates the business is closed, `YYYY-MM-DD`, separated by commas, in the business's time zone.
- `data-wb-special` (optional): different hours for particular dates, for example `2027-12-24 09:00-12:00; 2027-12-31 closed`.
- `data-wb-clock`: `12` (default) or `24` hour display. `data-wb-locale`: language for day and time names (default: the page language).
- `data-wb-show-zone="false"` to hide the time-zone abbreviation.
- Wording, for other languages: `data-wb-text-open` (default `Open now, closes {time}`), `data-wb-text-closed` (`Closed, opens {time}`), `data-wb-text-open-always` (`Open now`, used when there is no closing time in the next week), `data-wb-text-closed-all` (`Closed`) and `data-wb-text-at` (`at`). Day and time names come from the page language.
- The fallback text inside `[data-wb-output]` (shown until the script succeeds, and kept if it cannot).

## Repeat use

Unlimited, for example one block per branch with its own time zone and hours, or a compact status in the header and a full list in the footer. Each block keeps its own timer. Late-inserted blocks: run `WB.init(container)`.

## Limitations

- It relies on the visitor's device clock. A wrong clock gives a wrong answer.
- Hours are stated in the business's wall-clock time. On the two days a year when clocks change, a range that crosses the change is shown by wall-clock time and may be an hour longer or shorter than written.
- Holidays are not known; list them in `data-wb-closed` yourself.
- The status text is not announced to screen readers when it changes (it would interrupt them every minute); it is read when they reach it.
- The time-zone label is the browser's short name for the zone. For US zones that is "EST"/"EDT" and so on; elsewhere it is often "GMT+1" style unless the page language is set to match the region (for example `en-GB`).
- Day names, "today"/"tomorrow" and clock formats come from the browser's language data for the page language; the surrounding words use the attributes above and are English by default.
