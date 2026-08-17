/** LINE font request logger (request-header, pass-through). */
try {
  const u=$request.url||"";
  if (/font|\.zip(?:\?|$)|\.ttf(?:\?|$)|talk-asset\.line-scdn\.net\/secure/i.test(u)) {
    console.log(`[LINE-Font-Request] ${$request.method||"GET"} ${u}\n${JSON.stringify($request.headers||{})}`);
    if (/talk-asset\.line-scdn\.net\/secure/i.test(u)) $notify("LINE 字型下载请求",$request.method||"GET",u.slice(0,180));
  }
} catch(e) { console.log("[LINE-Font-Request] "+String(e)); }
$done({});
