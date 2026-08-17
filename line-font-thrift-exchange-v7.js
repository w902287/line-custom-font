/** Premium Font Thrift exchange capture v7; exact endpoint only; pass-through. */
const enc=new TextEncoder(),dec=new TextDecoder("utf-8");
function arr(b,s){if(b instanceof ArrayBuffer)return new Uint8Array(b);if(b&&b.buffer instanceof ArrayBuffer)return new Uint8Array(b.buffer,b.byteOffset||0,b.byteLength);return enc.encode(s||"");}
function next(){let n=0,o=$iCloud.readFile("LINE-font-thrift-exchange-counter.txt");if(o!==undefined)n=parseInt(dec.decode(o),10)||0;n++;$iCloud.writeFile(enc.encode(String(n)),"LINE-font-thrift-exchange-counter.txt");return String(n).padStart(3,"0");}
function hex(b){return Array.from(b.slice(0,64)).map(x=>x.toString(16).padStart(2,"0")).join("");}
try{
 const id=next(),base=`LINE-font-thrift-exchange-${id}`;
 const req=arr($request.bodyBytes,$request.body),res=arr($response.bodyBytes,$response.body);
 const meta=[`time=${new Date().toISOString()}`,`url=${($request.url||"").split("?")[0]}`,`status=${$response.statusCode||$response.status||""}`,`request-bytes=${req.length}`,`response-bytes=${res.length}`,`request-first64=${hex(req)}`,`response-first64=${hex(res)}`,`response-headers=${JSON.stringify($response.headers||{})}`].join("\n");
 const a=$iCloud.writeFile(req,base+"-request.bin"),b=$iCloud.writeFile(res,base+"-response.bin"),c=$iCloud.writeFile(enc.encode(meta),base+".txt");
 console.log(`[LINE-Font-Thrift-v7] ${id} req=${req.length} res=${res.length}`);
 $notify("LINE 字型 Thrift 交换已捕获",`${id}｜请求 ${req.length}B／响应 ${res.length}B`,`${a&&b&&c?"已保存":"部分保存失败"}：${base}`);
}catch(e){console.log("[LINE-Font-Thrift-v7] "+String(e));}
$done({});
