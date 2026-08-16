/**
 * LINE Custom Font Size Test
 * 官方 100% 原版 TTF + 額外 2MB 空白檔案 (總大小 4.49MB)
 * 測試 LINE 是否會校驗「檔案總體積」或「ZIP 內部檔案結構」
 */
const FONT_URL = "https://raw.githubusercontent.com/w902287/line-custom-font/009c6469a940dd8a759fb58fe08e3c8aa097686f/official_test.zip";

console.log("[LINE-Font-SizeTest] 攔截到請求：" + $request.url);

$task.fetch({
    url: FONT_URL,
    method: "GET"
}).then(response => {
    let dataLen = response.bodyBytes ? response.bodyBytes.length : (response.body ? response.body.length : 0);
    console.log("[LINE-Font-SizeTest] 填充測試包下載完成，長度: " + dataLen);

    let headers = $response.headers || {};
    for (let k of Object.keys(headers)) {
        if (k.toLowerCase() === "content-length" || k.toLowerCase() === "content-range") {
            delete headers[k];
        }
    }
    headers["Content-Length"] = String(dataLen);

    $notify("LINE 字型體積校驗測試", "官方TTF + 填充至 4.49MB", "請測試是否能成功套用！");

    $done({
        headers: headers,
        body: response.body,
        bodyBytes: response.bodyBytes
    });
}, reason => {
    console.log("[LINE-Font-SizeTest] 下載失敗：" + JSON.stringify(reason));
    $notify("LINE 字型體積校驗測試", "下載失敗", reason.error || "網路異常");
    $done({});
});
