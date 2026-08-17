/**
 * LINE font Control 0
 * Exact official ZIP bytes + captured official CDN response protocol.
 */
const FILE="LINE-font-official-baseline.zip";
const MD5="a0ae709267f268c3788de0938311ed30";
try{
 const source=$iCloud.readFile(FILE);
 if(source===undefined){$notify("LINE Control 0","找不到官方基准包",FILE);$done({status:"HTTP/1.1 404 Not Found",body:"not found"});}
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
  console.log(`[LINE-Control-0] HTTP/1.1 200 OK ${total}B ETag=${MD5}`);
  $notify("LINE 字型 Control 0","官方原包＋官方响应协议",`200 OK｜${total} bytes｜ETag ${MD5}`);
  $done({status:"HTTP/1.1 200 OK",headers,bodyBytes});
 }
}catch(e){console.log("[LINE-Control-0] "+String(e));$done({status:"HTTP/1.1 500 Internal Server Error",body:String(e)});}
