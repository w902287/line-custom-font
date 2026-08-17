/**
 * LINE font Control B
 * Payload: Control A (official TTF; ZIP timestamp +2 sec only).
 * Response protocol mirrors the captured official CDN response exactly.
 */
const FILE="LINE-font-control-A-zipmeta.zip";
const MD5="178a8e94570efab6c0171a1a878258ae";
try{
 const source=$iCloud.readFile(FILE);
 if(source===undefined){$notify("LINE Control B","找不到控制包",FILE);$done({status:"HTTP/1.1 404 Not Found",body:"not found"});}
 else{
  const total=source.byteLength,base=source.byteOffset||0;
  const bodyBytes=source.buffer.slice(base,base+total);
  const headers={
   "Content-Type":"application/octet-stream",
   "Content-Length":String(total),
   "Accept-Ranges":"bytes",
   "ETag":`"${MD5}"`,
   "Last-Modified":"Wed, 08 Jul 2026 03:21:30 GMT",
   "Cache-Control":"public,max-age=300",
   "Vary":"Origin",
   "Strict-Transport-Security":"max-age=15768000",
   "Server":"VOS"
  };
  console.log(`[LINE-Control-B] HTTP/1.1 200 OK ${total}B ETag=${MD5} request-range=${JSON.stringify(($request.headers||{}).Range||"")}`);
  $notify("LINE 字型 Control B","官方响应协议＋匹配自身 MD5",`200 OK｜${total} bytes｜ETag ${MD5}`);
  $done({status:"HTTP/1.1 200 OK",headers,bodyBytes});
 }
}catch(e){console.log("[LINE-Control-B] "+String(e));$done({status:"HTTP/1.1 500 Internal Server Error",body:String(e)});}
