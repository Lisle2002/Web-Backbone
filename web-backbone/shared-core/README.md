# Shared bundle

Load the combined styles and scripts when using several components on the same page.

1. Copy `wb-all.css` and `wb-all.js` to the website.
2. Link the stylesheet in `<head>` and load the script before `</body>` using the correct paths for the page.
3. Copy the HTML markup from each selected component, omitting its inline `<style>` and executable `<script>` blocks.
4. Configure the component's `data-wb-*` attributes and placeholders.

```html
<link rel="stylesheet" href="assets/wb-all.css">
<script src="assets/wb-all.js" defer></script>
```

Use either the shared bundle or standalone scripts on a page. Update all components together to keep the shared loader consistent.

Page metadata, social previews, favicons, structured data, verification tags, Plausible, robots.txt, and sitemap.xml must be installed separately. For theme persistence before the first paint, also copy the theme component's small head script into `<head>`.

The bundle includes page-wide theme and anchor-scroll rules. Use standalone components when only a few features are needed.

For HTML inserted after page load, call `WB.init(container)` once the new markup is attached to the document.
