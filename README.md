# LINE 自定義字型替換腳本（Quantumult X）

本倉庫僅公開腳本與設定範例，**不提供、託管或發布任何字型原檔及衍生 ZIP 字型包**。所有字型二進位檔均由 Git 歷史與 GitHub Releases 移除。

使用者應僅處理自己擁有或獲授權使用的字型，並將本機產生的 ZIP 放入 `iCloud Drive/Quantumult X/Data/`，由腳本透過 `$iCloud.readFile()` 載入。

## 公開內容

- Quantumult X 重寫與選擇器腳本
- LINE 雙免費槽的 Meta／ZIP 聯動邏輯
- 診斷與封裝腳本範例

## 不公開內容

- `.ttf`、`.otf`、`.ttc`、`.otc`
- `.zip` 字型包
- 以 Base64 或其他形式內嵌的字型資料

`.gitignore` 已封鎖上述二進位格式，避免後續誤提交。
