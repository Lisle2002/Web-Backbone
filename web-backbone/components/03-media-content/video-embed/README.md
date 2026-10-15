# Responsive video embed

Puts a video in the page at a fixed 16:9 shape that scales with the layout. Three ready variants are included: YouTube (privacy-enhanced address), Vimeo, and a video file that you host yourself. No script. The YouTube and Vimeo frames ship with blank placeholder addresses, so the browser contacts the provider only after you replace them.

## Files

- [video-embed.html](video-embed.html)

## Requirements

- **YouTube:** the video ID, which is the part after `v=` in the video's address (or after `youtu.be/`).
- **Vimeo:** the numeric video ID from the video's address. The video's privacy settings must allow embedding.
- **Self-hosted:** an `.mp4` file (H.264 video with AAC audio plays in all current browsers) and, ideally, a captions file in WebVTT (`.vtt`) format.
- An `https://` page. The YouTube and Vimeo players need the page to send a normal referrer; do not add `referrerpolicy="no-referrer"`.

## Paste location

- `<style>` block: once, in the `<head>` or above the first video.
- Use **one** of the three blocks (A, B or C) where the video should appear and delete the other two.

## Change these values

- A: replace the **whole** `src` (it starts as the blank placeholder `about:blank#YOUR_YOUTUBE_EMBED_ADDRESS`) with `https://www.youtube-nocookie.com/embed/` followed by your video ID; then `YOUR_YOUTUBE_VIDEO_ID` in the "Watch on YouTube" link, and the `title`.
- B: replace the **whole** `src` (`about:blank#YOUR_VIMEO_EMBED_ADDRESS`) with `https://player.vimeo.com/video/` followed by your video ID; then `YOUR_VIMEO_VIDEO_ID` in the link, and the `title`.
- C: the `src` of the `<source>`, the `poster` image, the captions `<track>` and the fallback download link.
- `--wb-video-ratio` (default `16 / 9`) for other shapes, for example `4 / 3` or `9 / 16`.

## Repeat use

Unlimited, with any mix of A, B and C. The shape is controlled by the CSS variable. There is no script and no ID. Several embedded players on one page slow it down; consider `click-to-load` for pages with many videos.

## Limitations

- Opened as a local file (`file://`) rather than from a web server, YouTube may refuse to play the embed because no referrer is sent. Test from a real or local web server.
- YouTube and Vimeo may set cookies and receive the visitor's address once the player loads. The "privacy-enhanced" `youtube-nocookie.com` address reduces, but does not remove, that. Use `click-to-load` if the visitor must agree first.
- The owner of the video controls whether embedding is allowed; embedding can be turned off at any time.
- Autoplay is deliberately not set; browsers block it with sound anyway.
- This is plain HTML, so it cannot warn you about a leftover placeholder. The placeholder addresses (`about:blank#...`) are blank pages, so a forgotten one shows an empty frame and the browser contacts nobody; there is no console warning and no player.
