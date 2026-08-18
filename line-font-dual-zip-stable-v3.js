/** Stable v3: serve selected local ZIP with verified metadata. */
const KEY="line.custom.font.combo";
const files={
 romantic:{label:"浪漫雅圓",file:"LINE-font-romantic-v10-full.zip",size:5480381,md5:"95ba2a3e2720091ec49aaea44136bcd9"},
 sarasa:{label:"Sarasa Mono Slab TC",file:"LINE-font-slot1-sarasa-mono-slab-tc.zip",size:11763205,md5:"db7c145e3d001be1eae78e3e08c3e6dc"},
 yozai:{label:"Yozai Medium",file:"LINE-font-slot2-yozai.zip",size:9778405,md5:"6bb591b541a61b830026524783f2f5b0"},
 taipei:{label:"台北黑體 Bold",file:"LINE-font-slot2-taipei.zip",size:11214470,md5:"adf0d8e32ad1f90ea1e7b3cf4c208b5c"}
};
const combos={ry:["romantic","yozai"],rt:["romantic","taipei"],say:["sarasa","yozai"],sat:["sarasa","taipei"]};
try{
 const selected=$prefs.valueForKey(KEY)||"ry",pair=combos[selected]||combos.ry;
 const slot=/Iansui-ForLINE/i.test($request.url)?2:1,item=files[pair[slot-1]],source=$iCloud.readFile(item.file);
 if(source===undefined){$notify("LINE 雙欄字型找不到 ZIP",`第 ${slot} 欄｜${item.label}`,item.file);$done({status:"HTTP/1.1 404 Not Found",body:"not found"});}
 else if(source.byteLength!==item.size){$notify("LINE 雙欄字型 ZIP 大小錯誤",item.file,`預期 ${item.size}｜實際 ${source.byteLength}`);$done({status:"HTTP/1.1 500 Internal Server Error",body:"wrong ZIP"});}
 else{
  const total=source.byteLength,base=source.byteOffset||0,bodyBytes=source.buffer.slice(base,base+total);
  const headers={"Content-Type":"application/octet-stream","Content-Length":String(total),"Accept-Ranges":"bytes","ETag":`"${item.md5}"`,"Last-Modified":"Wed, 08 Jul 2026 03:21:30 GMT","Cache-Control":"public,max-age=300","Vary":"Origin","Strict-Transport-Security":"max-age=15768000","Server":"VOS"};
  console.log(`[LINE-Font-Stable-v3] combo=${selected} slot=${slot} font=${item.label} size=${total}`);
  $notify("LINE 雙欄字型穩定 ZIP 注入成功",`第 ${slot} 欄｜${item.label}`,`${total} bytes｜MD5 已聯動`);
  $done({status:"HTTP/1.1 200 OK",headers,bodyBytes});
 }
}catch(e){console.log("[LINE-Font-Stable-v3] ZIP error "+String(e));$done({status:"HTTP/1.1 500 Internal Server Error",body:String(e)});}
