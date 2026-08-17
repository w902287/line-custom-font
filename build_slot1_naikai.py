#!/usr/bin/env python3
"""Build Naikai Bold for LINE's Mochi free slot (fontId 41)."""
import copy, hashlib, json, struct, zlib
from pathlib import Path
from fontTools.ttLib import TTFont
R=Path('/var/minis/workspace/line-custom-font')
src=Path('/var/minis/attachments/uploads/NaikaiFont-Bold.ttf')
off=TTFont('/var/minis/workspace/official_raw.ttf',lazy=True)
f=TTFont(src,recalcBBoxes=True,recalcTimestamp=False)
f['name']=copy.deepcopy(off['name'])
for tag in ('FFTM','DSIG'):
 if tag in f:del f[tag]
f.recalcTimestamp=False
ttf=R/'Mochi-slot-naikai.ttf';f.save(ttf,reorderTables=False)
plain=ttf.read_bytes();entry=b'TT07-armochih32c90b5_md_scale.ttf'
co=zlib.compressobj(9,zlib.DEFLATED,-15);raw=co.compress(plain)+co.flush();crc=zlib.crc32(plain)&0xffffffff
flags=0x0808;tm=(12<<11)|(21<<5)|(26>>1);dt=((2026-1980)<<9)|(7<<5)|8
local=struct.pack('<IHHHHHIIIHH',0x04034b50,20,flags,8,tm,dt,0,0,0,len(entry),0)+entry
dd=struct.pack('<IIII',0x08074b50,crc,len(raw),len(plain));offst=len(local)+len(raw)+len(dd)
cd=struct.pack('<IHHHHHHIIIHHHHHII',0x02014b50,20,20,flags,8,tm,dt,crc,len(raw),len(plain),len(entry),0,0,0,0,0,0)+entry
end=struct.pack('<IHHHHIIH',0x06054b50,0,0,1,1,len(cd),offst,0)
arc=local+raw+dd+cd+end
out=R/'LINE-font-slot1-naikai.zip';out.write_bytes(arc)
cm={}
for t in f['cmap'].tables:
 if t.isUnicode():cm.update(t.cmap)
print(json.dumps({'file':out.name,'ttf_size':len(plain),'size':len(arc),'sha256':hashlib.sha256(arc).hexdigest(),'md5':hashlib.md5(arc).hexdigest(),'glyphs':f['maxp'].numGlyphs,'unicode':len(cm)},indent=2))
