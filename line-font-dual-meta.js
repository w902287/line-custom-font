/** Patch both free LINE font slots according to QX persistent selection. */
const KEY="line.custom.font.combo";
const OLD1="d44908eda3a66daee9c18253122059756016ee0ad8043b989f662ee8d608380e";
const OLD2="7794013dd3564875be0fde9fe206ebcafcaec2456f42157f024d515d675f2aa5";
const ROMANTIC="b02bbdd7d5cf1d229800ad31570295eeeb5b0dba8caf2eeef1f21583c4d63147";
const POPGOTHIC="2ec06ab2bbec6002e24cff35a267eb1a01f0ddc9a58db5edf60473092b23f7c8";
const YOZAI="90898425c49d9ae260ad5c807609291c4713c92371e1ce3df158fbca43676cb0";
const TAIPEI="7de371a1c7dc6a756525635fb177a87382daef04f6d737cc48c5b87db659a119";
const combos={ry:["浪漫雅圓","Yozai Medium",ROMANTIC,YOZAI],rt:["浪漫雅圓","台北黑體 Bold",ROMANTIC,TAIPEI],py:["Pop Gothic Bold","Yozai Medium",POPGOTHIC,YOZAI],pt:["Pop Gothic Bold","台北黑體 Bold",POPGOTHIC,TAIPEI]};
const enc=new TextEncoder();
function body(){const b=$response.bodyBytes;if(b instanceof ArrayBuffer)return new Uint8Array(b);if(b&&b.buffer instanceof ArrayBuffer)return new Uint8Array(b.buffer,b.byteOffset||0,b.byteLength);return enc.encode($response.body||"");}
function patch(src,a,b){const x=enc.encode(a),y=enc.encode(b);let n=0;for(let i=0;i<=src.length-x.length;i++){let ok=true;for(let j=0;j<x.length;j++)if(src[i+j]!==x[j]){ok=false;break;}if(ok){src.set(y,i);n++;i+=x.length-1;}}return n;}
try{
 const selected=$prefs.valueForKey(KEY)||"ry",c=combos[selected]||combos.ry,src=body();
 const n1=patch(src,OLD1,c[2]),n2=patch(src,OLD2,c[3]);
 // Compact field 2 (i32): TTL 3600 = 15 a0 38; TTL 0 uses valid two-byte varint 80 00, preserving body length.
 let ttl=0;for(let i=0;i<src.length-2;i++)if(src[i]===0x15&&src[i+1]===0xa0&&src[i+2]===0x38){src[i+1]=0x80;src[i+2]=0x00;ttl++;}
 const out=src.buffer.slice(src.byteOffset,src.byteOffset+src.byteLength);
 console.log(`[LINE-Font-Dual] combo=${selected} slot1=${n1} slot2=${n2} ttl0=${ttl} bytes=${src.length}`);
 if(n1===1&&n2===1)$notify("LINE 雙欄字型摘要已更新",`${c[0]} ＋ ${c[1]}`,`白玉 ${n1}｜芫荽 ${n2}｜TTL 0 即時刷新`);
 else $notify("LINE 雙欄字型清單未完整命中",`${c[0]} ＋ ${c[1]}`,`白玉 ${n1}｜芫荽 ${n2}｜響應 ${src.length} bytes`);
 $done({bodyBytes:out});
}catch(e){console.log("[LINE-Font-Dual] meta error "+String(e));$done({});}
