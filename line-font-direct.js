/**
 * LINE font transport baseline
 * Rewrite upstream URL inside Quantumult X; LINE receives CDN 200 directly.
 * No $task.fetch, no response-body buffering, no redirect exposed to LINE.
 */
const FONT_URL = "https://cdn.jsdelivr.net/gh/w902287/line-custom-font@23e901e/official_test.zip";

const headers = Object.assign({}, $request.headers || {});
for (const key of Object.keys(headers)) {
  const lower = key.toLowerCase();
  if (lower === "host" || lower === ":authority" || lower === "range") {
    delete headers[key];
  }
}

console.log("[LINE-Font-Direct] upstream => " + FONT_URL);
$done({ url: FONT_URL, headers });
