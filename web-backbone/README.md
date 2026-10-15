# Web Backbone

Reusable website components in HTML, CSS, and vanilla JavaScript. Copy individual components into a website and configure their placeholders. No build step or package installation is required.

## Quick start

1. Choose a component from the catalog below.
2. Read its setup instructions for placement, required services, and settings.
3. Copy the component file: put styles in `<head>`, markup where the feature belongs, and scripts before `</body>` as instructed.
4. Replace `YOUR_*` placeholders, sample contact details, URLs, and content with the site's own values.
5. Open the website and check the configured feature before publishing.

Metadata belongs in `<head>`. `robots.txt` and `sitemap.xml` are separate files placed at the site's root. Maps and video embeds start blank until configured; the Plausible script must be configured and uncommented.

## Components

### Contact, location, and bookings

| Component | Code | Setup |
| --- | --- | --- |
| Google Map embed | [map-embed.html](components/01-contact-location-bookings/map-embed/map-embed.html) | [Instructions](components/01-contact-location-bookings/map-embed/README.md) |
| Directions links | [directions-links.html](components/01-contact-location-bookings/directions-links/directions-links.html) | [Instructions](components/01-contact-location-bookings/directions-links/README.md) |
| Calendly booking (inline and popup) | [calendly.html](components/01-contact-location-bookings/calendly/calendly.html) | [Instructions](components/01-contact-location-bookings/calendly/README.md) |
| Phone, email, SMS, WhatsApp and chat-app links | [contact-links.html](components/01-contact-location-bookings/contact-links/contact-links.html) | [Instructions](components/01-contact-location-bookings/contact-links/README.md) |
| Floating contact button | [floating-link.html](components/01-contact-location-bookings/floating-link/floating-link.html) | [Instructions](components/01-contact-location-bookings/floating-link/README.md) |
| Contact form (Formspree or Web3Forms) | [contact-form.html](components/01-contact-location-bookings/contact-form/contact-form.html) | [Instructions](components/01-contact-location-bookings/contact-form/README.md) |
| Newsletter sign-up (Mailchimp hosted form) | [newsletter.html](components/01-contact-location-bookings/newsletter/newsletter.html) | [Instructions](components/01-contact-location-bookings/newsletter/README.md) |
| Add to calendar (Google link and .ics download) | [add-to-calendar.html](components/01-contact-location-bookings/add-to-calendar/add-to-calendar.html) | [Instructions](components/01-contact-location-bookings/add-to-calendar/README.md) |

### Navigation and interaction

| Component | Code | Setup |
| --- | --- | --- |
| Responsive mobile menu | [mobile-menu.html](components/02-navigation-interaction/mobile-menu/mobile-menu.html) | [Instructions](components/02-navigation-interaction/mobile-menu/README.md) |
| Accessible FAQ accordion | [faq.html](components/02-navigation-interaction/faq/faq.html) | [Instructions](components/02-navigation-interaction/faq/README.md) |
| Tabs | [tabs.html](components/02-navigation-interaction/tabs/tabs.html) | [Instructions](components/02-navigation-interaction/tabs/README.md) |
| Modal dialog | [modal.html](components/02-navigation-interaction/modal/modal.html) | [Instructions](components/02-navigation-interaction/modal/README.md) |
| Dismissible announcement banner | [announcement-banner.html](components/02-navigation-interaction/announcement-banner/announcement-banner.html) | [Instructions](components/02-navigation-interaction/announcement-banner/README.md) |
| Back-to-top button | [back-to-top.html](components/02-navigation-interaction/back-to-top/back-to-top.html) | [Instructions](components/02-navigation-interaction/back-to-top/README.md) |
| Anchor scrolling with a fixed header | [anchor-scroll.html](components/02-navigation-interaction/anchor-scroll/anchor-scroll.html) | [Instructions](components/02-navigation-interaction/anchor-scroll/README.md) |
| Copy-to-clipboard button | [copy-button.html](components/02-navigation-interaction/copy-button/copy-button.html) | [Instructions](components/02-navigation-interaction/copy-button/README.md) |
| Share button | [share-button.html](components/02-navigation-interaction/share-button/share-button.html) | [Instructions](components/02-navigation-interaction/share-button/README.md) |
| Light/dark theme toggle | [theme-toggle.html](components/02-navigation-interaction/theme-toggle/theme-toggle.html) | [Instructions](components/02-navigation-interaction/theme-toggle/README.md) |
| Current-year footer | [footer-year.html](components/02-navigation-interaction/footer-year/footer-year.html) | [Instructions](components/02-navigation-interaction/footer-year/README.md) |
| Skip-to-content link | [skip-link.html](components/02-navigation-interaction/skip-link/skip-link.html) | [Instructions](components/02-navigation-interaction/skip-link/README.md) |

### Media and content

| Component | Code | Setup |
| --- | --- | --- |
| Responsive image | [responsive-image.html](components/03-media-content/responsive-image/responsive-image.html) | [Instructions](components/03-media-content/responsive-image/README.md) |
| Photo gallery with accessible lightbox | [gallery.html](components/03-media-content/gallery/gallery.html) | [Instructions](components/03-media-content/gallery/README.md) |
| Responsive video embed | [video-embed.html](components/03-media-content/video-embed/video-embed.html) | [Instructions](components/03-media-content/video-embed/README.md) |
| Click-to-load third-party embed | [click-to-load.html](components/03-media-content/click-to-load/click-to-load.html) | [Instructions](components/03-media-content/click-to-load/README.md) |
| Search and filter for on-page cards | [search-filter.html](components/03-media-content/search-filter/search-filter.html) | [Instructions](components/03-media-content/search-filter/README.md) |
| Business-hours status ("Open now") | [hours-status.html](components/03-media-content/hours-status/hours-status.html) | [Instructions](components/03-media-content/hours-status/README.md) |
| Public data table (CSV or JSON) with loading, empty and error states | [data-table.html](components/03-media-content/data-table/data-table.html) | [Instructions](components/03-media-content/data-table/README.md) |
| Live values from a CSV or JSON file | [live-values.html](components/03-media-content/live-values/live-values.html) | [Instructions](components/03-media-content/live-values/README.md) |

### Metadata and integrations

| Component | Code | Setup |
| --- | --- | --- |
| Page metadata and canonical address | [page-metadata.html](components/04-metadata-integrations/page-metadata/page-metadata.html) | [Instructions](components/04-metadata-integrations/page-metadata/README.md) |
| Social link previews (Open Graph and X/Twitter cards) | [social-previews.html](components/04-metadata-integrations/social-previews/social-previews.html) | [Instructions](components/04-metadata-integrations/social-previews/README.md) |
| Favicons and web app manifest | [favicons.html](components/04-metadata-integrations/favicons/favicons.html) · [manifest.webmanifest](components/04-metadata-integrations/favicons/manifest.webmanifest) | [Instructions](components/04-metadata-integrations/favicons/README.md) |
| Structured data examples (JSON-LD) | [structured-data.html](components/04-metadata-integrations/structured-data/structured-data.html) | [Instructions](components/04-metadata-integrations/structured-data/README.md) |
| Analytics with consent choice (Google Analytics 4) | [consent-analytics.html](components/04-metadata-integrations/consent-analytics/consent-analytics.html) | [Instructions](components/04-metadata-integrations/consent-analytics/README.md) |
| Plausible Analytics (privacy-focused alternative) | [plausible.html](components/04-metadata-integrations/plausible/plausible.html) | [Instructions](components/04-metadata-integrations/plausible/README.md) |
| Click tracking without personal data | [track-clicks.html](components/04-metadata-integrations/track-clicks/track-clicks.html) | [Instructions](components/04-metadata-integrations/track-clicks/README.md) |
| Lead source for forms (campaign tags, referring site, landing page) | [lead-source.html](components/04-metadata-integrations/lead-source/lead-source.html) | [Instructions](components/04-metadata-integrations/lead-source/README.md) |
| robots.txt (separate file) | [robots.txt](components/04-metadata-integrations/robots-txt/robots.txt) | [Instructions](components/04-metadata-integrations/robots-txt/README.md) |
| sitemap.xml (separate file) | [sitemap.xml](components/04-metadata-integrations/sitemap-xml/sitemap.xml) | [Instructions](components/04-metadata-integrations/sitemap-xml/README.md) |
| Site ownership verification tags | [site-verification.html](components/04-metadata-integrations/site-verification/site-verification.html) | [Instructions](components/04-metadata-integrations/site-verification/README.md) |

## Shared bundle

For several components on one page, use the optional [shared bundle](shared-core/README.md). Standalone files include their own scripts and styles and do not require the bundle.

## Configuration

- Preserve `wb-` classes and `data-wb-*` attributes used by the component.
- Use one copy of components marked “Once per page” in their instructions.
- Use components from the same release on a page; the first loaded shared core takes precedence.
- After adding new component markup dynamically, call `WB.init(container)`.
- If initialization throws, repair the markup and call `WB.init(container)` again. Reload after changing settings on components already initialized as unconfigured or invalid.
- Form, booking, newsletter, and analytics integrations require the relevant account or endpoint. Never place server secrets in browser code.
- Customize the documented CSS variables and component styles to fit the website.

## Compatibility

Use a website or custom-code area that permits HTML, CSS, and JavaScript. Some website builders restrict scripts or iframes. Browser permissions, third-party services, network access, and cross-origin policies can affect features. Check provider integrations with the site's actual settings.

These components supply browser functionality. Authentication, private databases, payment verification, and other trusted server operations require an appropriate backend or provider.
