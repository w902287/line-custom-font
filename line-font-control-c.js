/**
 * LINE font Control C
 * Payload: Control A (official TTF, ZIP timestamp +2 sec only).
 * Header: exact official protocol AND original official ETag.
 * Distinguishes ETag-string comparison from actual payload hashing.
 */
const FILE="LINE-font-control-A-zipmeta.zip";
const OFFICIAL_ETAG="a0ae709267f268c3788de0938311ed30";
try{
 const source=$iCloud.readFile(FILE);
 if(source===undefined){$notify("LINE Control C","找不到控制包",FILE);$done({status:"HTTP/1.1 404 Not Found",body:"not found"});}
 else{
  const total=source.byteLength,base=source.byteOffset||0;
  const bodyBytes=source.buffer.slice(base,base+total);
  const headers={
   "Content-Type":"application/octet-stream",
   "Content-Length":String(total),
   "Accept-Ranges":"bytes",
   "ETag":`"${OFFICIAL_ETAG}"`,
   "Last-Modified":"Wed, 08 Jul 2026 03:21:30 GMT",
   "Cache-Control":"public,max-age=300",
   "Vary":"Origin",
   "Strict-Transport-Security":"max-age=15768000",
   "Server":"VOS"
  };
  console.log(`[LINE-Control-C] modified ZIP ${total}B; spoofed official ETag=${OFFICIAL_ETAG}`);
  $notify("LINE 字型 Control C","改 2 bytes／伪装官方 ETag",`200 OK｜${total} bytes｜ETag ${OFFICIAL_ETAG}`);
  $done({status:"HTTP/1.1 200 OK",headers,bodyBytes});
 }
}catch(e){console.log("[LINE-Control-C] "+String(e));$done({status:"HTTP/1.1 500 Internal Server Error",body:String(e)});}
