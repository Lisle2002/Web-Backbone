# Contact form (Formspree or Web3Forms)

A normal HTML form that posts to a form service you configure, with sending, success, failure and retry messages. It works as a plain form without JavaScript; the script adds the messages and keeps the visitor on the page.

## Files

- [contact-form.html](contact-form.html)

## Requirements

- **An account with a form service.** Two are supported by name:
  - **Formspree:** create a form in your Formspree dashboard; it gives you an endpoint such as `https://formspree.io/f/YOUR_FORMSPREE_FORM_ID`.
  - **Web3Forms:** create an access key at web3forms.com; the form posts to `https://api.web3forms.com/submit`. The access key is designed to be placed in the page, so treat it as public and use the service's own settings to limit misuse.
- Plans, submission limits, spam filtering and where notifications are sent are set by the service. Check its current terms.
- An `https://` page. The `generic` provider requires an endpoint that accepts a standard form POST and returns an appropriate HTTP success status.
- **Never put a private key, SMTP password or server secret in this form.**

## Paste location

- `<style>` block: once, in the `<head>` or above the first form.
- Form markup: where the form should appear.
- `<script>` block: once, just before `</body>`.

## Change these values

- `action` on the `<form>`: your service endpoint (Formspree) or `https://api.web3forms.com/submit` (Web3Forms).
- `data-wb-provider`: `formspree` (default), `web3forms` or `generic`.
- Web3Forms only: uncomment the hidden `access_key` input and put your key in it; replace the Formspree honeypot with the Web3Forms one as marked.
- `data-wb-success` and `data-wb-failure`: the messages shown.
- `data-wb-timeout`: milliseconds before a request is abandoned (default `15000`).
- Fields: add, remove or rename fields freely. Keep every field inside a `<label>`. File uploads are not handled.

## Repeat use

Unlimited forms per page. Each form keeps its own state, messages and retry button, and nothing uses a fixed ID. Give each form its own `action` if they should reach different places. Late-inserted forms: run `WB.init(container)` after inserting.

## Limitations

- "Submitted" means the form service accepted the request. It does not prove that an email reached your inbox or that anyone has read it.
- The honeypot field only stops simple bots. For stronger protection use the service's own options (for example its CAPTCHA or domain restrictions); those are not part of this component.
- Configure the endpoint for the selected provider. Web3Forms requires a JSON response containing `success: true`.
- The access key for Web3Forms is visible to anyone who views the page source. Anyone could use it to send messages to you, which is why limits and spam options in the service matter.
- File attachments, multi-step forms and payments are not included.
