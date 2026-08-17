#!/usr/bin/env python3
"""Build LINE Romantic Round v10 from the complete source font."""
import copy
import hashlib
import struct
import zlib
from pathlib import Path
from fontTools.ttLib import TTFont

SRC = Path('/var/minis/attachments/uploads/浪漫雅圆_1.ttf')
OFFICIAL = Path('/var/minis/workspace/official_raw.ttf')
OUT_TTF = Path('/var/minis/workspace/line-custom-font/TT07-armochih32c90b5_md_scale-v10-full.ttf')
OUT_ZIP = Path('/var/minis/workspace/line-custom-font/LINE-font-romantic-v10-full.zip')
ENTRY = b'TT07-armochih32c90b5_md_scale.ttf'

src = TTFont(SRC, recalcBBoxes=True, recalcTimestamp=False)
off = TTFont(OFFICIAL, lazy=True)

# Keep the complete Romantic Round glyph/cmap/layout tables. Only present it
# under Mochi's internal identity and drop FontForge's nonessential timestamp.
src['name'] = copy.deepcopy(off['name'])
if 'FFTM' in src:
    del src['FFTM']
if 'DSIG' in src:
    del src['DSIG']
src.recalcTimestamp = False
src.save(OUT_TTF, reorderTables=False)

plain = OUT_TTF.read_bytes()
co = zlib.compressobj(9, zlib.DEFLATED, -15)
deflated = co.compress(plain) + co.flush()
crc = zlib.crc32(plain) & 0xffffffff
flags = 0x0808
mtime = (12 << 11) | (21 << 5) | (26 >> 1)
mdate = ((2026 - 1980) << 9) | (7 << 5) | 8
local = struct.pack('<IHHHHHIIIHH', 0x04034b50, 20, flags, 8, mtime, mdate,
                    0, 0, 0, len(ENTRY), 0) + ENTRY
dd = struct.pack('<IIII', 0x08074b50, crc, len(deflated), len(plain))
offset = len(local) + len(deflated) + len(dd)
central = struct.pack('<IHHHHHHIIIHHHHHII', 0x02014b50, 20, 20, flags, 8,
                      mtime, mdate, crc, len(deflated), len(plain), len(ENTRY),
                      0, 0, 0, 0, 0, 0) + ENTRY
eocd = struct.pack('<IHHHHIIH', 0x06054b50, 0, 0, 1, 1,
                   len(central), offset, 0)
archive = local + deflated + dd + central + eocd
OUT_ZIP.write_bytes(archive)

check = TTFont(OUT_TTF)
cmap = {}
for table in check['cmap'].tables:
    if table.isUnicode():
        cmap.update(table.cmap)
required = '送片傳圖照這過還關開個您於型工程溫度公司備份區'
missing = [ch for ch in required if ord(ch) not in cmap]
empty = []
for ch in required:
    name = cmap.get(ord(ch))
    if not name:
        continue
    glyph = check['glyf'][name]
    glyph.recalcBounds(check['glyf'])
    if not hasattr(glyph, 'xMin') or (glyph.xMin == glyph.xMax and glyph.yMin == glyph.yMax):
        empty.append(ch)
assert not missing and not empty, (missing, empty)
assert zlib.decompress(deflated, -15) == plain
print('TTF', len(plain), 'glyphs', check['maxp'].numGlyphs, 'unicode', len(cmap))
print('ZIP', len(archive), 'deflate', len(deflated), 'flags', hex(flags))
print('SHA256', hashlib.sha256(archive).hexdigest())
print('MD5', hashlib.md5(archive).hexdigest())
print('required glyphs OK:', required)
