/** LINE font Control A: official TTF, ZIP metadata changed only. */
const FILE="LINE-font-control-A-zipmeta.zip";
try {
  const source=$iCloud.readFile(FILE);
  if(source===undefined){$notify("LINE Control A","找不到控制包",FILE);$done({status:"HTTP/1.1 404 Not Found",body:"not found"});}
  else {
    const total=source.byteLength; let start=0,end=total-1,range="";
    const h=$request.headers||{}; for(const k of Object.keys(h))if(k.toLowerCase()==="range")range=h[k]||"";
    const m=/^bytes=(\d+)-(\d*)$/i.exec(range.trim()); let status="HTTP/1.1 200 OK";
    if(m){start=Math.min(parseInt(m[1],10),total-1);if(m[2])end=Math.min(parseInt(m[2],10),total-1);if(end<start)end=start;status="HTTP/1.1 206 Partial Content";}
    const off=source.byteOffset||0; const bodyBytes=source.buffer.slice(off+start,off+end+1);
    const headers={"Content-Type":"application/zip","Content-Length":String(end-start+1),"Accept-Ranges":"bytes","Cache-Control":"no-store"};
    if(status.includes("206"))headers["Content-Range"]=`bytes ${start}-${end}/${total}`;
    console.log(`[LINE-Control-A] ${status} ${start}-${end}/${total}`);
    $notify("LINE 字型 Control A","官方 TTF／仅改 ZIP 时间戳",`回传 ${end-start+1}/${total} bytes`);
    $done({status,headers,bodyBytes});
  }
}catch(e){console.log("[LINE-Control-A] "+e);$done({status:"HTTP/1.1 500 Internal Server Error",body:String(e)});}
