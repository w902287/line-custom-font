#!/usr/bin/env python3
"""
LINE 自定義字型打包腳本
將任意 .ttf 或 .otf 字型檔打包為 LINE 相容的官方格式壓縮包
"""
import os
import sys
import zipfile
import argparse

TARGET_FONT_NAME = "TT07-armochih32c90b5_md_scale.ttf"
TARGET_ZIP_NAME = "TT07-armochih32c90b5_md_scale.zip"

def package_font(input_font_path, output_dir="."):
    if not os.path.exists(input_font_path):
        print(f"錯誤：找不到輸入字型檔案 {input_font_path}")
        return False
    
    os.makedirs(output_dir, exist_ok=True)
    out_zip_path = os.path.join(output_dir, TARGET_ZIP_NAME)
    
    print(f"[*] 讀取字型檔: {input_font_path}")
    print(f"[*] 注入為 LINE 內部命名: {TARGET_FONT_NAME}")
    
    with zipfile.ZipFile(out_zip_path, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=9) as z:
        z.write(input_font_path, arcname=TARGET_FONT_NAME)
        
    print(f"[✓] 打包完成！輸出檔案: {out_zip_path} ({os.path.getsize(out_zip_path)} bytes)")
    return True

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("用法: python3 pack_font.py <你的字型檔案.ttf/.otf> [輸出目錄]")
        sys.exit(1)
    
    font_file = sys.argv[1]
    out_dir = sys.argv[2] if len(sys.argv) > 2 else "."
    package_font(font_file, out_dir)
