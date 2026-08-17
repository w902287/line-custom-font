#!/usr/bin/env python3
"""Build complete-font ZIPs for LINE's free Iansui slot (fontId 18)."""
import copy, hashlib, json, struct, zlib
from pathlib import Path
from fontTools.ttLib import TTFont

ROOT=Path('/var/minis/workspace/line-custom-font')
UPLOAD=Path('/var/minis/attachments/uploads')
OFFICIAL=Path('/tmp/iansui/Iansui-ForLINE (1).ttf')
ENTRY=b'Iansui-ForLINE (1).ttf'
FONTS={
 'yozai':('Yozai Medium',UPLOAD/'Yozai-Medium.ttf'),
 'naikai':('內海字體 Bold',UPLOAD/'NaikaiFont-Bold.ttf'),
 'taipei':('台北黑體 Bold',UPLOAD/'TaipeiSansTCBeta-Bold_1.ttf'),
}

def pack(plain):
 co=zlib.compressobj(9,zlib.DEFLATED,-15); raw=co.compress(plain)+co.flush()
 crc=zlib.crc32(plain)&0xffffffff; flags=0x0808
 tm=(17<<11)|(26<<5)|(50>>1); dt=((2025-1980)<<9)|(2<<5)|10
 local=struct.pack('<IHHHHHIIIHH',0x04034b50,20,flags,8,tm,dt,0,0,0,len(ENTRY),0)+ENTRY
 dd=struct.pack('<IIII',0x08074b50,crc,len(raw),len(plain)); off=len(local)+len(raw)+len(dd)
 cd=struct.pack('<IHHHHHHIIIHHHHHII',0x02014b50,20,20,flags,8,tm,dt,crc,len(raw),len(plain),len(ENTRY),0,0,0,0,0,0)+ENTRY
 end=struct.pack('<IHHHHIIH',0x06054b50,0,0,1,1,len(cd),off,0)
 return local+raw+dd+cd+end

off=TTFont(OFFICIAL,lazy=True); result={}
for key,(label,path) in FONTS.items():
 f=TTFont(path,recalcBBoxes=True,recalcTimestamp=False)
 f['name']=copy.deepcopy(off['name'])
 for tag in ('FFTM','DSIG'):
  if tag in f: del f[tag]
 f.recalcTimestamp=False
 ttf=ROOT/f'Iansui-slot-{key}.ttf'; f.save(ttf,reorderTables=False)
 plain=ttf.read_bytes(); arc=pack(plain)
 zp=ROOT/f'LINE-font-slot2-{key}.zip';zp.write_bytes(arc)
 check=TTFont(ttf,lazy=True); cm={}
 for t in check['cmap'].tables:
  if t.isUnicode():cm.update(t.cmap)
 result[key]={'label':label,'source':path.name,'file':zp.name,'ttf_size':len(plain),'size':len(arc),'sha256':hashlib.sha256(arc).hexdigest(),'md5':hashlib.md5(arc).hexdigest(),'glyphs':check['maxp'].numGlyphs,'unicode':len(cm)}
 print(key,result[key])
(ROOT/'line-font-slot2-manifest.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
