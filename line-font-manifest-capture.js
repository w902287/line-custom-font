/**
 * LINE font manifest capture (response-body, pass-through)
 * Saves only responses containing specific font asset markers.
 */
const enc = new TextEncoder();
const dec = new TextDecoder("utf-8");
function bytesOf() {
  const b = $response.bodyBytes;
  if (b instanceof ArrayBuffer) return new Uint8Array(b);
  if (b && b.buffer instanceof ArrayBuffer) return new Uint8Array(b.buffer, b.byteOffset || 0, b.byteLength);
  return enc.encode($response.body || "");
}
function getHeader(h, name) {
  h = h || {}; name = name.toLowerCase();
  for (const k of Object.keys(h)) if (k.toLowerCase() === name) return String(h[k] || "");
  return "";
}
try {
  const bytes = bytesOf();
  const ct = getHeader($response.headers, "content-type").toLowerCase();
  // Never save the 2.61 MB ZIP itself; it is already known.
  if (ct.includes("zip") || (bytes.length > 3 && bytes[0]===0x50 && bytes[1]===0x4b)) {$done({});}
  else {
    const text = dec.decode(bytes);
    const low = text.toLowerCase();
    const markers = ["talk-asset.line-scdn.net", "tt07-", ".ttf", ".zip", "fontfamily", "font_file"];
    const hit = markers.filter(x => low.includes(x));
    if (!hit.length) {$done({});}
    else {
      let n = 0;
      const old = $iCloud.readFile("LINE-font-capture-counter.txt");
      if (old !== undefined) n = parseInt(dec.decode(old),10) || 0;
      n += 1;
      const id = String(n).padStart(3,"0");
      $iCloud.writeFile(enc.encode(String(n)), "LINE-font-capture-counter.txt");
      const binName = `LINE-font-capture-${id}.bin`;
      const txtName = `LINE-font-capture-${id}.txt`;
      const meta = [
        `time=${new Date().toISOString()}`,
        `url=${$request.url}`,
        `method=${$request.method || ""}`,
        `status=${$response.statusCode || $response.status || ""}`,
        `content-type=${ct}`,
        `bytes=${bytes.length}`,
        `markers=${hit.join(",")}`,
        "request-headers=" + JSON.stringify($request.headers || {}),
        "response-headers=" + JSON.stringify($response.headers || {}),
        "\n----- decoded body (raw bytes are in .bin) -----\n",
        text
      ].join("\n");
      const ok1 = $iCloud.writeFile(bytes, binName);
      const ok2 = $iCloud.writeFile(enc.encode(meta), txtName);
      console.log(`[LINE-Font-Capture] ${id} ${bytes.length}B ${$request.url}`);
      $notify("LINE 字型清单已捕获",`${id}｜${bytes.length} bytes`,`${ok1&&ok2?"已保存":"保存失败"}：${txtName}`);
      $done({});
    }
  }
} catch(e) {
  console.log("[LINE-Font-Capture] error: "+String(e));
  $done({});
}
