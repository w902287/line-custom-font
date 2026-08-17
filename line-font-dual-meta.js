/** Patch both free LINE font slots according to QX persistent selection. */
const KEY="line.custom.font.combo";
const OLD1="d44908eda3a66daee9c18253122059756016ee0ad8043b989f662ee8d608380e";
const OLD2="7794013dd3564875be0fde9fe206ebcafcaec2456f42157f024d515d675f2aa5";
const ROMANTIC="b02bbdd7d5cf1d229800ad31570295eeeb5b0dba8caf2eeef1f21583c4d63147";
const NAIKAI="37047052f5eca6e751a496608ca4037041376158aa2c5930b73120dd84563587";
const YOZAI="90898425c49d9ae260ad5c807609291c4713c92371e1ce3df158fbca43676cb0";
const TAIPEI="7de371a1c7dc6a756525635fb177a87382daef04f6d737cc48c5b87db659a119";
const combos={ry:["浪漫雅圓","Yozai Medium",ROMANTIC,YOZAI],rt:["浪漫雅圓","台北黑體 Bold",ROMANTIC,TAIPEI],ny:["內海字體 Bold","Yozai Medium",NAIKAI,YOZAI],nt:["內海字體 Bold","台北黑體 Bold",NAIKAI,TAIPEI]};
const enc=new TextEncoder();
function body(){const b=$response.bodyBytes;if(b instanceof ArrayBuffer)return new Uint8Array(b);if(b&&b.buffer instanceof ArrayBuffer)return new Uint8Array(b.buffer,b.byteOffset||0,b.byteLength);return enc.encode($response.body||"");}
function patch(src,a,b){const x=enc.encode(a),y=enc.encode(b);let n=0;for(let i=0;i<=src.length-x.length;i++){let ok=true;for(let j=0;j<x.length;j++)if(src[i+j]!==x[j]){ok=false;break;}if(ok){src.set(y,i);n++;i+=x.length-1;}}return n;}
try{
 const selected=$prefs.valueForKey(KEY)||"ry",c=combos[selected]||combos.ry,src=body();
 const n1=patch(src,OLD1,c[2]),n2=patch(src,OLD2,c[3]);
 // Compact field 2 (i32): TTL 3600 = 15 a0 38; TTL 64 = 15 80 01. Same length.
 let ttl=0;for(let i=0;i<src.length-2;i++)if(src[i]===0x15&&src[i+1]===0xa0&&src[i+2]===0x38){src[i+1]=0x80;src[i+2]=0x01;ttl++;}
 const out=src.buffer.slice(src.byteOffset,src.byteOffset+src.byteLength);
 console.log(`[LINE-Font-Dual] combo=${selected} slot1=${n1} slot2=${n2} ttl=${ttl} bytes=${src.length}`);
 if(n1===1&&n2===1)$notify("LINE 雙欄字型摘要已更新",`${c[0]} ＋ ${c[1]}`,`白玉 ${n1}｜芫荽 ${n2}｜TTL 64 秒`);
 else $notify("LINE 雙欄字型清單未完整命中",`${c[0]} ＋ ${c[1]}`,`白玉 ${n1}｜芫荽 ${n2}｜響應 ${src.length} bytes`);
 $done({bodyBytes:out});
}catch(e){console.log("[LINE-Font-Dual] meta error "+String(e));$done({});}
