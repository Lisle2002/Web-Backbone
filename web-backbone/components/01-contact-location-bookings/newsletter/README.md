# Newsletter sign-up (Mailchimp hosted form)

A sign-up form that posts to Mailchimp's hosted form address from your own page. It opens Mailchimp's response page in a new tab and never claims the visitor is subscribed, because the browser cannot see Mailchimp's answer.

## Files

- [newsletter.html](newsletter.html)

## Requirements

- **A Mailchimp account and an Audience.** In Mailchimp, find the signup forms and the **Embedded forms** (or "host your own signup form") code for your audience. Menu names change, so follow Mailchimp's current help pages.
- From that embed code copy three things: the form `action` URL, the email field name (normally `EMAIL`), and the name of the hidden "bot" field (a long name starting with `b_`).
- Plans, sending limits and double opt-in are set in Mailchimp.
- No private key is needed or used. Never place a Mailchimp API key in a web page.
- Other email services that give you a hosted form address may work by changing the three values, but only Mailchimp is described here.

## Paste location

- `<style>` block: once, in the `<head>` or above the first form.
- Markup: where the sign-up should appear.
- `<script>` block: once, just before `</body>`.

## Change these values

- `action` on the `<form>`: the exact URL from your Mailchimp embed code.
- The email input `name` if Mailchimp's code uses something other than `EMAIL`.
- The bot-field input `name` (copy it from Mailchimp's code). If you leave the placeholder, the script removes that field and the form still posts.
- The notice text and the privacy-policy link (`YOUR_PRIVACY_POLICY_URL`). Add any consent wording your law or Mailchimp settings require.
- `data-wb-sent` to change the message shown after submitting.

## Repeat use

Unlimited. Each block has its own form, message and button state, and there are no fixed IDs. Different blocks may point to different audiences.

## Limitations

- The response cannot be read by your page (it comes from another website), so success is never claimed. The visitor must look at Mailchimp's page.
- Copy the action URL and required field names from the embedded form for the intended Mailchimp audience.
- Mailchimp requires your own consent wording for some places (for example the EU); this component only supplies a notice line, not legal compliance.
- Pop-up blockers rarely block form submits triggered by a click, but if one does, the visitor sees nothing happen; the status text still appears.
