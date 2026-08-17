/** Premium Font Thrift request-only capture v8; exact endpoint; pass-through. */
const enc=new TextEncoder(),dec=new TextDecoder("utf-8");
function arr(b,s){if(b instanceof ArrayBuffer)return new Uint8Array(b);if(b&&b.buffer instanceof ArrayBuffer)return new Uint8Array(b.buffer,b.byteOffset||0,b.byteLength);return enc.encode(s||"");}
function next(){let n=0,o=$iCloud.readFile("LINE-font-thrift-request-v8-counter.txt");if(o!==undefined)n=parseInt(dec.decode(o),10)||0;n++;$iCloud.writeFile(enc.encode(String(n)),"LINE-font-thrift-request-v8-counter.txt");return String(n).padStart(3,"0");}
function hex(b){return Array.from(b.slice(0,96)).map(x=>x.toString(16).padStart(2,"0")).join("");}
function safeHeaders(h){const out={};for(const k of Object.keys(h||{})){if(!/authorization|cookie|token/i.test(k))out[k]=h[k];else out[k]="<redacted>";}return out;}
try{
 const b=arr($request.bodyBytes,$request.body),id=next(),base=`LINE-font-thrift-request-v8-${id}`;
 const meta=[`time=${new Date().toISOString()}`,`url=${($request.url||"").split("?")[0]}`,`method=${$request.method||""}`,`bytes=${b.length}`,`first96=${hex(b)}`,`headers-sanitized=${JSON.stringify(safeHeaders($request.headers||{}))}`].join("\n");
 const a=$iCloud.writeFile(b,base+".bin"),c=$iCloud.writeFile(enc.encode(meta),base+".txt");
 console.log(`[LINE-Font-Thrift-v8] request ${id} ${b.length}B`);
 $notify("LINE 字型 Thrift 请求已捕获",`${id}｜${b.length} bytes`,`${a&&c?"已保存":"保存失败"}：${base}.bin`);
}catch(e){console.log("[LINE-Font-Thrift-v8] "+String(e));}
$done({});
