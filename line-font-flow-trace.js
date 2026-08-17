/** LINE font flow trace: response-header metadata only, no body/cookies. */
const enc=new TextEncoder(),dec=new TextDecoder("utf-8");
function h(o,n){o=o||{};n=n.toLowerCase();for(const k of Object.keys(o))if(k.toLowerCase()===n)return String(o[k]||"");return "";}
function cleanUrl(u){try{const x=new URL(u);return x.origin+x.pathname+([...x.searchParams.keys()].length?"?params="+[...x.searchParams.keys()].join(","):"");}catch(_){return String(u).split("?")[0];}}
try{
 let n=0,o=$iCloud.readFile("LINE-font-flow-counter.txt");if(o!==undefined)n=parseInt(dec.decode(o),10)||0;n++;
 $iCloud.writeFile(enc.encode(String(n)),"LINE-font-flow-counter.txt");
 const id=String(n).padStart(4,"0"), name=`LINE-font-flow-${id}.txt`;
 const text=[
  `time=${new Date().toISOString()}`,`url=${cleanUrl($request.url||"")}`,`method=${$request.method||""}`,
  `status=${$response.statusCode||$response.status||""}`,`content-type=${h($response.headers,"content-type")}`,
  `content-length=${h($response.headers,"content-length")}`,`etag=${h($response.headers,"etag")}`,
  `last-modified=${h($response.headers,"last-modified")}`,`content-range=${h($response.headers,"content-range")}`,
  `request-range=${h($request.headers,"range")}`,`user-agent=${h($request.headers,"user-agent")}`
 ].join("\n");
 $iCloud.writeFile(enc.encode(text),name);
 console.log(`[LINE-Font-Flow] ${id} ${cleanUrl($request.url||"")} ${$response.statusCode||""} ${h($response.headers,"content-type")} ${h($response.headers,"content-length")}`);
}catch(e){console.log("[LINE-Font-Flow] "+String(e));}
$done({});
