/**
 * LINE Custom Font Local Injector for Quantumult X
 * 修復 Content-Length 截斷問題，確保 100% 完整下載
 */
const FONT_URL = "https://raw.githubusercontent.com/w902287/line-custom-font/0691cc7bb1939eb8a56a9b3665562b5f68cfb2af/TT07-armochih32c90b5_md_scale.zip";

console.log("[LINE-Font] 攔截到字型下載請求：" + $request.url);

$task.fetch({
    url: FONT_URL,
    method: "GET"
}).then(response => {
    let bodyData = response.bodyBytes || response.body;
    let dataLen = response.bodyBytes ? response.bodyBytes.length : (response.body ? response.body.length : 0);
    console.log("[LINE-Font] 二進位下載成功，長度: " + dataLen);

    let headers = $response.headers || {};
    // 移除舊的 content-length 避免長度衝突被 iOS 截斷
    for (let k of Object.keys(headers)) {
        if (k.toLowerCase() === "content-length" || k.toLowerCase() === "content-range") {
            delete headers[k];
        }
    }
    headers["Content-Length"] = String(dataLen);

    $notify("LINE 字型替換", "浪漫雅圓注入成功", "字型大小 " + (dataLen / 1024 / 1024).toFixed(2) + "MB，請點擊套用！");

    $done({
        headers: headers,
        body: response.body,
        bodyBytes: response.bodyBytes
    });
}, reason => {
    console.log("[LINE-Font] 下載失敗：" + JSON.stringify(reason));
    $notify("LINE 字型替換", "下載失敗", reason.error || "網路異常");
    $done({});
});
