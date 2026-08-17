/** LINE Romantic Round v10 — serve the complete-glyph ZIP. */
const FILE="LINE-font-romantic-v10-full.zip";
const MD5="95ba2a3e2720091ec49aaea44136bcd9";
const EXPECTED=5480381;
try{
 const source=$iCloud.readFile(FILE);
 if(source===undefined){$notify("LINE 浪漫雅圓 v10","找不到完整字庫 ZIP",FILE);$done({status:"HTTP/1.1 404 Not Found",body:"not found"});}
 else{
  const total=source.byteLength,base=source.byteOffset||0,bodyBytes=source.buffer.slice(base,base+total);
  if(total!==EXPECTED){$notify("LINE 浪漫雅圓 v10","ZIP 大小不正確",`預期 ${EXPECTED}｜實際 ${total}`);$done({status:"HTTP/1.1 500 Internal Server Error",body:"wrong local ZIP"});}
  else{
   const headers={"Content-Type":"application/octet-stream","Content-Length":String(total),"Accept-Ranges":"bytes","ETag":`"${MD5}"`,"Last-Modified":"Wed, 08 Jul 2026 03:21:30 GMT","Cache-Control":"public,max-age=300","Vary":"Origin","Strict-Transport-Security":"max-age=15768000","Server":"VOS"};
   console.log(`[LINE-Romantic-v10] ZIP ${total}B MD5=${MD5}`);
   $notify("LINE 浪漫雅圓 v10","完整字庫 ZIP 注入成功",`200 OK｜${total} bytes｜MD5 ${MD5}`);
   $done({status:"HTTP/1.1 200 OK",headers,bodyBytes});
  }
 }
}catch(e){console.log("[LINE-Romantic-v10] ZIP error "+String(e));$done({status:"HTTP/1.1 500 Internal Server Error",body:String(e)});}
