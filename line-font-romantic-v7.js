/**
 * LINE Romantic Round Local Echo v7
 * Reads iCloud Drive/Quantumult X/Data/LINE-font-romantic-v7.zip.
 */
const FILE = "LINE-font-romantic-v7.zip";

try {
  const source = $iCloud.readFile(FILE);
  if (source === undefined) {
    console.log("[LINE-Font-v7] 已触发，但找不到：" + FILE);
    $notify("LINE 浪漫雅圆 v7", "找不到字型包", "请放入 iCloud Drive/Quantumult X/Data/" + FILE);
    $done({status:"HTTP/1.1 404 Not Found",headers:{"Content-Type":"text/plain"},body:"romantic v7 not found"});
  } else {
    const total = source.byteLength;
    let start = 0, end = total - 1, range = "";
    const rh = $request.headers || {};
    for (const key of Object.keys(rh)) if (key.toLowerCase() === "range") range = rh[key] || "";
    const m = /^bytes=(\d+)-(\d*)$/i.exec(range.trim());
    let status = "HTTP/1.1 200 OK";
    if (m) {
      start = Math.min(parseInt(m[1],10), total-1);
      if (m[2]) end = Math.min(parseInt(m[2],10), total-1);
      if (end < start) end = start;
      status = "HTTP/1.1 206 Partial Content";
    }
    const offset = source.byteOffset || 0;
    const bodyBytes = source.buffer.slice(offset+start, offset+end+1);
    const headers = {
      "Content-Type":"application/zip",
      "Content-Length":String(end-start+1),
      "Accept-Ranges":"bytes",
      "Cache-Control":"no-store"
    };
    if (status.indexOf("206") >= 0) headers["Content-Range"]=`bytes ${start}-${end}/${total}`;
    console.log(`[LINE-Font-v7] 浪漫雅圆已读取：${status} ${start}-${end}/${total}`);
    $notify("LINE 浪漫雅圆 v7", "真正自定义包注入成功", `回传 ${end-start+1}/${total} bytes`);
    $done({status,headers,bodyBytes});
  }
} catch (e) {
  console.log("[LINE-Font-v7] 异常："+String(e));
  $done({status:"HTTP/1.1 500 Internal Server Error",headers:{"Content-Type":"text/plain"},body:String(e)});
}
