/**
 * LINE Romantic v9 — patch Premium Font getFontMetas response.
 * Replaces only Mochi/full-ZIP SHA-256 (same 64-byte field length).
 */
const OLD="d44908eda3a66daee9c18253122059756016ee0ad8043b989f662ee8d608380e";
const NEW="af528873c5ac14b5a434394fd477932d814b4b60b818c42a940da10247a999b0";
const enc=new TextEncoder();
function bytes(){const b=$response.bodyBytes;if(b instanceof ArrayBuffer)return new Uint8Array(b);if(b&&b.buffer instanceof ArrayBuffer)return new Uint8Array(b.buffer,b.byteOffset||0,b.byteLength);return enc.encode($response.body||"");}
try{
 const src=bytes(),old=enc.encode(OLD),neu=enc.encode(NEW);let count=0;
 for(let i=0;i<=src.length-old.length;i++){
  let ok=true;for(let j=0;j<old.length;j++)if(src[i+j]!==old[j]){ok=false;break;}
  if(ok){src.set(neu,i);count++;i+=old.length-1;}
 }
 const out=src.buffer.slice(src.byteOffset,src.byteOffset+src.byteLength);
 console.log(`[LINE-Romantic-v9] getFontMetas hash patched count=${count} bytes=${src.length}`);
 if(count>0)$notify("LINE 浪漫雅圆 v9","字型清单 SHA-256 已改写",`Mochi hash：${count} 处`);
 else $notify("LINE 浪漫雅圆 v9","字型清单已触发，但未找到旧摘要",`响应 ${src.length} bytes`);
 $done({bodyBytes:out});
}catch(e){console.log("[LINE-Romantic-v9] meta error "+String(e));$done({});}
