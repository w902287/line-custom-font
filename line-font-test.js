/**
 * LINE Custom Font Baseline Test (100% Official Raw ZIP)
 * 用於排查 QX 腳本二進位回傳鏈路是否正常
 */
const FONT_URL = "https://raw.githubusercontent.com/w902287/line-custom-font/main/official_test.zip";

console.log("[LINE-Font-Test] 攔截到請求：" + $request.url);

$task.fetch({
    url: FONT_URL,
    method: "GET"
}).then(response => {
    let dataLen = response.bodyBytes ? response.bodyBytes.length : (response.body ? response.body.length : 0);
    console.log("[LINE-Font-Test] 官方原裝包下載完成，長度: " + dataLen);

    let headers = $response.headers || {};
    for (let k of Object.keys(headers)) {
        if (k.toLowerCase() === "content-length" || k.toLowerCase() === "content-range") {
            delete headers[k];
        }
    }
    headers["Content-Length"] = String(dataLen);

    $notify("LINE 字型基準測試", "官方原裝包注入", "大小 2.61MB，請測試是否能成功套用！");

    $done({
        headers: headers,
        body: response.body,
        bodyBytes: response.bodyBytes
    });
}, reason => {
    console.log("[LINE-Font-Test] 下載失敗：" + JSON.stringify(reason));
    $notify("LINE 字型基準測試", "下載失敗", reason.error || "網路異常");
    $done({});
});
