# Structured data examples (JSON-LD)

Ready-to-edit JSON-LD blocks that describe a local business, an organization, an event, a breadcrumb trail and a FAQ page to search engines. Each block is independent: keep only the ones that match real, visible content on the page.

## Files

- [structured-data.html](structured-data.html)

## Requirements

- The facts must be true and also shown to visitors on the same page. Markup that describes content people cannot see goes against search engines' guidelines.
- Valid JSON: straight quotes, no trailing commas, numbers without quotes.
- Search engines read these blocks from the HTML they download; they do not guarantee any special display.

## Paste location

- Inside `<head>` or at the end of `<body>` of the page the block describes. Paste each block you need as its own `<script type="application/ld+json">` element.

## Change these values

- Replace every `YOUR_...` value. Delete any property you cannot fill truthfully rather than leaving a placeholder.
- LocalBusiness: use a more specific type if one fits (for example `Restaurant`, `Dentist`); `name` and `address` are required by Google, and `url`, `telephone`, `geo` and `openingHoursSpecification` are recommended. Latitude and longitude must be plain numbers: replace the whole quoted placeholder, quotation marks included, with a number such as `47.3769`.
- Event: `startDate` (and `endDate`) need a time zone offset such as `-04:00`. Each event needs its own page.
- BreadcrumbList: at least two items; the last item may leave out `item`.
- FAQPage: see the limits; only mark up questions and answers that are visible on the page.

## Repeat use

Use each block at most once per page, and only on a page it truly describes. A page may carry several different blocks (for example an Event and a BreadcrumbList). Do not repeat the same business on every page unless each page is about it.

## Limitations

- Markup does not guarantee rich results, ranking or any special display.
- Google's FAQ rich results were retired (their documentation page for FAQ markup has been removed), so the FAQPage block is kept only because the markup is still valid schema.org vocabulary.
- Google lists `name` and `address` as required for LocalBusiness, and `name`, `startDate` and `location` for Event; recommended properties help but are optional. Requirements change; check Google's current pages for your type.
- Events must be public, bookable events at a physical place, each with its own page, to be eligible for Google's event features.
- JSON-LD in a page's HTML is read by crawlers that process the downloaded page; scripts that insert it later may be read less reliably.
