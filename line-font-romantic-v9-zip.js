/** LINE Romantic v9 — serve local v8 ZIP with matching CDN headers. */
const FILE="LINE-font-romantic-v8-unsigned.zip";
const MD5="2da2bf737136fa51b3da79e31a7d2cf6";
try{
 const source=$iCloud.readFile(FILE);
 if(source===undefined){$notify("LINE 浪漫雅圆 v9","找不到 ZIP",FILE);$done({status:"HTTP/1.1 404 Not Found",body:"not found"});}
 else{
  const total=source.byteLength,base=source.byteOffset||0,bodyBytes=source.buffer.slice(base,base+total);
  const headers={"Content-Type":"application/octet-stream","Content-Length":String(total),"Accept-Ranges":"bytes","ETag":`"${MD5}"`,"Last-Modified":"Wed, 08 Jul 2026 03:21:30 GMT","Cache-Control":"public,max-age=300","Vary":"Origin","Strict-Transport-Security":"max-age=15768000","Server":"VOS"};
  console.log(`[LINE-Romantic-v9] ZIP ${total}B MD5=${MD5}`);
  $notify("LINE 浪漫雅圆 v9","自定义 ZIP 注入成功",`200 OK｜${total} bytes｜MD5 ${MD5}`);
  $done({status:"HTTP/1.1 200 OK",headers,bodyBytes});
 }
}catch(e){console.log("[LINE-Romantic-v9] ZIP error "+String(e));$done({status:"HTTP/1.1 500 Internal Server Error",body:String(e)});}
