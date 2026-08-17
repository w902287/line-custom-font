/**
 * LINE Romantic Round v10 — patch Mochi's full-ZIP SHA-256.
 * Built from the complete 22,026-glyph source font.
 */
const OLD="d44908eda3a66daee9c18253122059756016ee0ad8043b989f662ee8d608380e";
const NEW="b02bbdd7d5cf1d229800ad31570295eeeb5b0dba8caf2eeef1f21583c4d63147";
const enc=new TextEncoder();
function bytes(){const b=$response.bodyBytes;if(b instanceof ArrayBuffer)return new Uint8Array(b);if(b&&b.buffer instanceof ArrayBuffer)return new Uint8Array(b.buffer,b.byteOffset||0,b.byteLength);return enc.encode($response.body||"");}
try{
 const src=bytes(),old=enc.encode(OLD),neu=enc.encode(NEW);let count=0;
 for(let i=0;i<=src.length-old.length;i++){
  let ok=true;for(let j=0;j<old.length;j++)if(src[i+j]!==old[j]){ok=false;break;}
  if(ok){src.set(neu,i);count++;i+=old.length-1;}
 }
 const out=src.buffer.slice(src.byteOffset,src.byteOffset+src.byteLength);
 console.log(`[LINE-Romantic-v10] getFontMetas hash patched count=${count} bytes=${src.length}`);
 if(count>0)$notify("LINE 浪漫雅圓 v10","完整字庫 SHA-256 已改寫",`Mochi hash：${count} 處`);
 else $notify("LINE 浪漫雅圓 v10","字型清單已觸發，但未找到舊摘要",`響應 ${src.length} bytes`);
 $done({bodyBytes:out});
}catch(e){console.log("[LINE-Romantic-v10] meta error "+String(e));$done({});}
