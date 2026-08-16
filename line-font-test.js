/**
 * LINE Custom Font Final Match
 * 浪漫雅圓 9,093 精選字 + 精確位元填充至 2,611,063 bytes (100% 對齊官方原廠大小)
 */
const FONT_URL = "https://raw.githubusercontent.com/w902287/line-custom-font/793a4268c2f768c28d9b092dc18004fe9d147bd1/official_test.zip";

console.log("[LINE-Font-Final] 攔截到請求：" + $request.url);

$task.fetch({
    url: FONT_URL,
    method: "GET"
}).then(response => {
    let dataLen = response.bodyBytes ? response.bodyBytes.length : (response.body ? response.body.length : 0);
    console.log("[LINE-Font-Final] 浪漫雅圓精確位元包下載完成，長度: " + dataLen);

    let headers = $response.headers || {};
    for (let k of Object.keys(headers)) {
        if (k.toLowerCase() === "content-length" || k.toLowerCase() === "content-range") {
            delete headers[k];
        }
    }
    headers["Content-Length"] = String(dataLen);

    $notify("LINE 浪漫雅圓", "原廠精確大小注入", "大小 2,611,063 bytes (2.61MB)，請套用！");

    $done({
        headers: headers,
        body: response.body,
        bodyBytes: response.bodyBytes
    });
}, reason => {
    console.log("[LINE-Font-Final] 下載失敗：" + JSON.stringify(reason));
    $notify("LINE 浪漫雅圓", "下載失敗", reason.error || "網路異常");
    $done({});
});
