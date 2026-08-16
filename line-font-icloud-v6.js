/**
 * LINE Font iCloud Local Echo v6
 * Reads iCloud Drive/Quantumult X/Data/LINE-font-official-baseline.zip.
 * No CDN, no $task.fetch, no original upstream response.
 */
const FILE = "LINE-font-official-baseline.zip";

try {
  const source = $iCloud.readFile(FILE);
  if (source === undefined) {
    console.log("[LINE-Font-v6] 已触发，但 iCloud Data 找不到：" + FILE);
    $notify("LINE 字型 v6", "规则已触发，但找不到 ZIP", "请检查 iCloud Drive/Quantumult X/Data/" + FILE);
    $done({
      status: "HTTP/1.1 404 Not Found",
      headers: {"Content-Type": "text/plain; charset=utf-8"},
      body: "QX iCloud Data font file not found"
    });
  } else {
    const total = source.byteLength;
    let start = 0;
    let end = total - 1;
    let range = "";
    const reqHeaders = $request.headers || {};
    for (const key of Object.keys(reqHeaders)) {
      if (key.toLowerCase() === "range") range = reqHeaders[key] || "";
    }
    const match = /^bytes=(\d+)-(\d*)$/i.exec(range.trim());
    let status = "HTTP/1.1 200 OK";
    if (match) {
      start = Math.min(parseInt(match[1], 10), total - 1);
      if (match[2]) end = Math.min(parseInt(match[2], 10), total - 1);
      if (end < start) end = start;
      status = "HTTP/1.1 206 Partial Content";
    }
    const base = source.byteOffset || 0;
    const buffer = source.buffer.slice(base + start, base + end + 1);
    const headers = {
      "Content-Type": "application/zip",
      "Content-Length": String(end - start + 1),
      "Accept-Ranges": "bytes",
      "Cache-Control": "no-store"
    };
    if (status.indexOf("206") >= 0) {
      headers["Content-Range"] = `bytes ${start}-${end}/${total}`;
    }
    console.log(`[LINE-Font-v6] 已触发并读取成功：${status} ${start}-${end}/${total}`);
    $notify("LINE 字型 v6", "本地 ZIP 注入成功", `回传 ${end - start + 1}/${total} bytes`);
    $done({status, headers, bodyBytes: buffer});
  }
} catch (error) {
  console.log("[LINE-Font-v6] 执行异常：" + String(error));
  $done({
    status: "HTTP/1.1 500 Internal Server Error",
    headers: {"Content-Type": "text/plain; charset=utf-8"},
    body: "QX iCloud local echo error: " + String(error)
  });
}
