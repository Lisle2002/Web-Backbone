# Current-year footer

Keeps the year in a footer line up to date automatically, optionally as a range such as "2020–2027". The year already written in the HTML stays in place if scripts do not run.

## Files

- [footer-year.html](footer-year.html)

## Requirements

- Nothing to install or sign up for.

## Paste location

- Markup: inside your footer, where the year should appear.
- `<script>` block: once, just before `</body>`.

## Change these values

- The fallback year written inside the `<span>` (shown when scripts do not run).
- Optional `data-wb-start`: the first year, to show a range such as 2020–2027. Leave it out for a single year.
- The text around the span (your name or company).

## Repeat use

Unlimited. Each span is filled independently.

## Limitations

- The year comes from the visitor's device clock, so a wrong clock shows a wrong year, and near midnight on 31 December visitors in different time zones may see different years.
- A static HTML copyright year is still the right fallback; update it when you update the page.
