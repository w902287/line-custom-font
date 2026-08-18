/** Stable v3: patch both free LINE font slots and avoid zero-TTL resync loops. */
const KEY="line.custom.font.combo";
const OLD1="d44908eda3a66daee9c18253122059756016ee0ad8043b989f662ee8d608380e";
const OLD2="7794013dd3564875be0fde9fe206ebcafcaec2456f42157f024d515d675f2aa5";
const ROMANTIC="b02bbdd7d5cf1d229800ad31570295eeeb5b0dba8caf2eeef1f21583c4d63147";
const YOZAI="90898425c49d9ae260ad5c807609291c4713c92371e1ce3df158fbca43676cb0";
const TAIPEI="7de371a1c7dc6a756525635fb177a87382daef04f6d737cc48c5b87db659a119";
const SARASA="d9690202341025e5af04f26511de746b5b96aab927506d12e7b9669abe6c5916";
const combos={ry:["浪漫雅圓","Yozai Medium",ROMANTIC,YOZAI],rt:["浪漫雅圓","台北黑體 Bold",ROMANTIC,TAIPEI],say:["Sarasa Mono Slab TC","Yozai Medium",SARASA,YOZAI],sat:["Sarasa Mono Slab TC","台北黑體 Bold",SARASA,TAIPEI]};
const enc=new TextEncoder();
function body(){const b=$response.bodyBytes;if(b instanceof ArrayBuffer)return new Uint8Array(b);if(b&&b.buffer instanceof ArrayBuffer)return new Uint8Array(b.buffer,b.byteOffset||0,b.byteLength);return enc.encode($response.body||"");}
function patch(src,a,b){const x=enc.encode(a),y=enc.encode(b);let n=0;for(let i=0;i<=src.length-x.length;i++){let ok=true;for(let j=0;j<x.length;j++)if(src[i+j]!==x[j]){ok=false;break;}if(ok){src.set(y,i);n++;i+=x.length-1;}}return n;}
function longTTL(src){
 // Outer field 2: TTL 3600. Replace its two-byte varint with 31,536,000 seconds (one year), preserving both struct stops.
 const old=new Uint8Array([0x15,0xa0,0x38,0x00,0x00]),neu=new Uint8Array([0x15,0x80,0xce,0x89,0x1e,0x00,0x00]);
 for(let i=0;i<=src.length-old.length;i++){
  let ok=true;for(let j=0;j<old.length;j++)if(src[i+j]!==old[j]){ok=false;break;}
  if(ok){const out=new Uint8Array(src.length+neu.length-old.length);out.set(src.subarray(0,i));out.set(neu,i);out.set(src.subarray(i+old.length),i+neu.length);return [out,1];}
 }
 return [src,0];
}
try{
 const selected=$prefs.valueForKey(KEY)||"ry",c=combos[selected]||combos.ry,src=body();
 const n1=patch(src,OLD1,c[2]),n2=patch(src,OLD2,c[3]),ttlResult=longTTL(src),finalSrc=ttlResult[0],ttl=ttlResult[1];
 const out=finalSrc.buffer.slice(finalSrc.byteOffset,finalSrc.byteOffset+finalSrc.byteLength);
 console.log(`[LINE-Font-Stable-v3] combo=${selected} slot1=${n1} slot2=${n2} ttl1y=${ttl} bytes=${finalSrc.length}`);
 if(n1===1&&n2===1)$notify("LINE 雙欄字型穩定摘要已更新",`${c[0]} ＋ ${c[1]}`,`白玉 ${n1}｜芫荽 ${n2}｜TTL 1 年`);
 else $notify("LINE 雙欄字型清單未完整命中",`${c[0]} ＋ ${c[1]}`,`白玉 ${n1}｜芫荽 ${n2}｜響應 ${finalSrc.length} bytes`);
 $done({bodyBytes:out});
}catch(e){console.log("[LINE-Font-Stable-v3] meta error "+String(e));$done({});}
