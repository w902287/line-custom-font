/**
 * LINE font capture v2 (pass-through)
 * - Saves only metadata for secure ZIP responses (never duplicates ZIP body).
 * - Saves small public preview TTF metadata, not binary.
 * - Saves candidate text/protobuf manifests with raw body.
 */
const enc=new TextEncoder(), dec=new TextDecoder("utf-8");
function bytesOf(){const b=$response.bodyBytes;if(b instanceof ArrayBuffer)return new Uint8Array(b);if(b&&b.buffer instanceof ArrayBuffer)return new Uint8Array(b.buffer,b.byteOffset||0,b.byteLength);return enc.encode($response.body||"");}
function hdr(h,n){h=h||{};n=n.toLowerCase();for(const k of Object.keys(h))if(k.toLowerCase()===n)return String(h[k]||"");return "";}
function nextId(){let n=0,o=$iCloud.readFile("LINE-font-capture-v2-counter.txt");if(o!==undefined)n=parseInt(dec.decode(o),10)||0;n++;$iCloud.writeFile(enc.encode(String(n)),"LINE-font-capture-v2-counter.txt");return String(n).padStart(3,"0");}
function meta(bytes,kind,markers){return [
 `time=${new Date().toISOString()}`,`kind=${kind}`,`url=${$request.url}`,`method=${$request.method||""}`,
 `status=${$response.statusCode||$response.status||""}`,`content-type=${hdr($response.headers,"content-type")}`,
 `content-length=${hdr($response.headers,"content-length")}`,`etag=${hdr($response.headers,"etag")}`,
 `last-modified=${hdr($response.headers,"last-modified")}`,`content-range=${hdr($response.headers,"content-range")}`,
 `accept-ranges=${hdr($response.headers,"accept-ranges")}`,`bytes-visible-to-script=${bytes.length}`,
 `markers=${(markers||[]).join(",")}`,"request-headers="+JSON.stringify($request.headers||{}),
 "response-headers="+JSON.stringify($response.headers||{})].join("\n");}
try{
 const bytes=bytesOf(), url=$request.url||"", ct=hdr($response.headers,"content-type").toLowerCase();
 const secureZip=/talk-asset\.line-scdn\.net\/secure\/.*\.zip(?:\?|$)/i.test(url);
 const publicPreview=/talk-asset\.line-scdn\.net\/public\/.*(?:_subset_|\.ttf)/i.test(url);
 if(secureZip){
  const id=nextId(),name=`LINE-font-secure-zip-${id}.txt`,text=meta(bytes,"secure-zip",["secure","zip"]);
  const ok=$iCloud.writeFile(enc.encode(text),name);console.log(`[LINE-Font-v2] secure ZIP ${id}\n${text}`);
  $notify("LINE 完整字型响应头已捕获",`${id}｜ETag ${hdr($response.headers,"etag")||"(none)"}`,`${ok?"已保存":"保存失败"}：${name}`);$done({});
 } else if(publicPreview){
  // Preview fonts are known; only log metadata to avoid nine duplicate binaries.
  console.log(`[LINE-Font-v2] preview ${url} ETag=${hdr($response.headers,"etag")} length=${hdr($response.headers,"content-length")}`);$done({});
 } else {
  const text=dec.decode(bytes),low=text.toLowerCase();
  const markers=["talk-asset.line-scdn.net","tt07-",".ttf",".zip","fontfamily","font_file","fontid","font_id","checksum","digest","md5","sha256"];
  const hit=markers.filter(x=>low.includes(x));
  if(!hit.length){$done({});}
  else{
   const id=nextId(),base=`LINE-font-manifest-v2-${id}`;
   const head=meta(bytes,"manifest-candidate",hit)+"\n\n----- decoded body -----\n"+text;
   const ok1=$iCloud.writeFile(enc.encode(head),base+".txt"),ok2=$iCloud.writeFile(bytes,base+".bin");
   console.log(`[LINE-Font-v2] manifest ${id} ${bytes.length}B ${url}`);
   $notify("LINE 字型清单候选已捕获",`${id}｜${bytes.length} bytes`,`${ok1&&ok2?"已保存":"保存失败"}：${base}.txt`);$done({});
  }
 }
}catch(e){console.log("[LINE-Font-v2] error "+String(e));$done({});}
