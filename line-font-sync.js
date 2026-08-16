/**
 * LINE Custom Font Local Injector for Quantumult X
 * 2.04MB 精選版 (保證進度條 100% 完整跑滿)
 */
const FONT_URL = "https://raw.githubusercontent.com/w902287/line-custom-font/01c4ced16aea361260fb4fa2b5b00f8baec81f8d/TT07-armochih32c90b5_md_scale.zip";

console.log("[LINE-Font] 攔截到字型下載請求：" + $request.url);

$task.fetch({
    url: FONT_URL,
    method: "GET"
}).then(response => {
    let dataLen = response.bodyBytes ? response.bodyBytes.length : (response.body ? response.body.length : 0);
    console.log("[LINE-Font] 二進位下載成功，長度: " + dataLen);

    let headers = $response.headers || {};
    for (let k of Object.keys(headers)) {
        if (k.toLowerCase() === "content-length" || k.toLowerCase() === "content-range") {
            delete headers[k];
        }
    }
    headers["Content-Length"] = String(dataLen);

    $notify("LINE 字型替換", "浪漫雅圓注入成功", "字型大小 " + (dataLen / 1024 / 1024).toFixed(2) + "MB，進度條已完整下載！");

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
