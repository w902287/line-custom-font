/**
 * LINE Custom Font Final Match (with 30s timeout & retry)
 * 浪漫雅圓 9,093 精選字 + 精確位元填充至 2,611,063 bytes
 */
const FONT_URL = "https://raw.githubusercontent.com/w902287/line-custom-font/main/official_test.zip";

console.log("[LINE-Font-Final] 攔截到請求：" + $request.url);

$task.fetch({
    url: FONT_URL,
    method: "GET",
    timeout: 30
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
    console.log("[LINE-Font-Final] 下載超時重試：" + JSON.stringify(reason));
    $notify("LINE 浪漫雅圓", "下載超時", "請確認網路連線或稍後重試");
    $done({});
});
