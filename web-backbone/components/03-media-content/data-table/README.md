# Public data table (CSV or JSON) with loading, empty and error states

Fetches a public CSV or JSON file and shows it as an accessible table. It handles the loading, empty and error states, offers a "Try again" button after a failure, reads quoted CSV correctly (commas, quotes and line breaks inside quoted cells), and inserts every value as plain text.

## Files

- [data-table.html](data-table.html)

## Requirements

- A public data file: a CSV or JSON file on your own site, or on another site that allows requests from your page (CORS). Private data, passwords and API keys do not belong in a browser page.
- A page served over `http(s)://`. Browsers usually block reading local files from a page opened directly from disk; use a web server (or a hosted copy) when testing.
- For a spreadsheet: publish it as CSV from your spreadsheet program (for Google Sheets, **File → Share → Publish to web → CSV**). The data source must permit cross-origin requests from the website.

## Paste location

- `<style>` block: once, in the `<head>` or above the first table.
- Markup: where the table should appear.
- `<script>` block: once, just before `</body>`.

## Change these values

- `data-wb-src`: the CSV or JSON address (a path on your site or a full `https://` address).
- `data-wb-format`: `auto` (default), `csv` or `json`.
- `data-wb-columns`: optional list of columns to show and their labels, `key:Label,key2:Label2`. For CSV the keys are the header names in the first row. Without it every column is shown.
- JSON only: `data-wb-path` if the rows are inside the file, for example `data-wb-path="items"` or `data.rows`.
- CSV only: `data-wb-delimiter` for files that use `;` or a tab instead of a comma.
- `data-wb-caption`, `data-wb-empty`, `data-wb-max-rows` (default `500`) and `data-wb-timeout` (milliseconds, default `12000`).

## Repeat use

Unlimited tables per page, each with its own file, columns and state. Several tables may read the same file. Late-inserted tables: run `WB.init(container)`.

## Limitations

- Files from another site need that site to allow your page to read them (CORS). If it does not, the browser blocks the request and you will see the error state; no snippet can bypass that.
- It displays text only: no links, images, sorting, paging or editing. Very large files are cut at `data-wb-max-rows`.
- The first 50 JSON rows decide the column list when you do not set `data-wb-columns`.
- This is for public data. Anything fetched by a browser page can be read by every visitor.
