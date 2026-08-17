/** LINE secure font ZIP response-header capture v3 (strict pass-through). */
const enc=new TextEncoder(),dec=new TextDecoder("utf-8");
function h(obj,name){obj=obj||{};name=name.toLowerCase();for(const k of Object.keys(obj))if(k.toLowerCase()===name)return String(obj[k]||"");return "";}
try{
 let n=0,old=$iCloud.readFile("LINE-font-secure-header-counter.txt");
 if(old!==undefined)n=parseInt(dec.decode(old),10)||0;n++;
 const id=String(n).padStart(3,"0"),name=`LINE-font-secure-header-${id}.txt`;
 $iCloud.writeFile(enc.encode(String(n)),"LINE-font-secure-header-counter.txt");
 const text=[
  `time=${new Date().toISOString()}`,`url=${$request.url}`,`method=${$request.method||""}`,
  `status=${$response.statusCode||$response.status||""}`,
  `etag=${h($response.headers,"etag")}`,`content-length=${h($response.headers,"content-length")}`,
  `content-type=${h($response.headers,"content-type")}`,`last-modified=${h($response.headers,"last-modified")}`,
  `content-range=${h($response.headers,"content-range")}`,`accept-ranges=${h($response.headers,"accept-ranges")}`,
  `request-range=${h($request.headers,"range")}`,
  "request-headers="+JSON.stringify($request.headers||{}),
  "response-headers="+JSON.stringify($response.headers||{})
 ].join("\n");
 const ok=$iCloud.writeFile(enc.encode(text),name);
 console.log(`[LINE-Secure-Header] ${id}\n${text}`);
 $notify("LINE 完整字型 ZIP 已捕获",`${id}｜${$response.statusCode||""}｜ETag ${h($response.headers,"etag")||"(none)"}`,`${ok?"已保存":"保存失败"}：${name}`);
}catch(e){console.log("[LINE-Secure-Header] "+String(e));}
$done({});
