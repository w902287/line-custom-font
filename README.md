# LINE 自定義字型替換模組 (Quantumult X / Surge / Loon)

透過 MitM 與 302 重定向機制，將 LINE 官方下載的字型壓縮包替換為你在 GitHub Release / Raw 上託管的自定義字體（TTF/OTF）。

---

## 🛠️ 部署指南 (GitHub 方案)

### 步驟 1：準備你的字型檔
1. 準備好你喜歡的字型檔案（支援 `.ttf` 或 `.otf`，例如繁體中文字體：思源黑體、芫荽體、霞鶩文楷、自定義蘋方等）。
2. 將字型檔壓縮成 `.zip` 格式（如 `my_custom_font.zip`）。
   > **注意**：壓縮時直接選取字型檔案壓縮，不要包在外層資料夾內。

### 步驟 2：上傳至 GitHub
你有兩種存放 `.zip` 檔案的方式：

* **方式 A（推薦 - GitHub Release）**：
  1. 建立一個新的 GitHub 倉庫（Public 或 Private 均可）。
  2. 到 **Releases** → **Create a new release**。
  3. 將 `my_custom_font.zip` 上傳至附件。
  4. 複製該 `.zip` 的直鏈下載網址：
     `https://github.com/<你的帳號>/<你的倉庫>/releases/download/<版本號>/my_custom_font.zip`

* **方式 B（GitHub Raw）**：
  1. 將 `.zip` 提交推送到公開倉庫 `main` 分支。
  2. 取得 Raw 網址：
     `https://raw.githubusercontent.com/<你的帳號>/<你的倉庫>/main/my_custom_font.zip`

---

### 步驟 3：配置代理工具 (Quantumult X)

#### 1. 新增 Snippet / 重寫配置
在 Quantumult X 配置文件中新增：

```ini
[mitm]
hostname = talk-asset.line-scdn.net

[rewrite_remote]
# 替換以下 URL 為你的 GitHub 字型直鏈
^https?:\/\/talk-asset\.line-scdn\.net\/secure\/.+\.zip url 302 https://github.com/<你的帳號>/<你的倉庫>/releases/download/v1.0.0/my_custom_font.zip
```

#### 2. 生效與載入字型
1. **信任 MitM 憑證**：確保 Quantumult X 的 MitM 憑證已安裝且在 iOS「設定」→「一般」→「關於本機」→「憑證信任設定」中開啟完全信任。
2. **清除 LINE 舊快取**：
   * 開啟 LINE →「設定」→「字型」。
   * 切換回「預設字型」，並點擊刪除已下載的官方字型。
3. **重新點擊下載**：
   * 在字型清單中，點擊任意一款官方字型進行下載。
   * 下載進度條完成後，點擊「套用」。
4. LINE 所有聊天室與介面即刻切換為你的自定義字體！
