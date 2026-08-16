/**
 * LINE Custom Font Local Injector for Quantumult X
 * 直接覆蓋 Response Body，直接返回 200 OK 二進位
 */
const FONT_URL = "https://raw.githubusercontent.com/w902287/line-custom-font/2bde2f430dc3faa1f7b7d9fa13e137411588b95d/TT07-armochih32c90b5_md_scale.zip";

console.log("[LINE-Font] 攔截到字型下載請求：" + $request.url);

$task.fetch({
    url: FONT_URL,
    method: "GET"
}).then(response => {
    console.log("[LINE-Font] 字型二進位下載成功，直接注入 200 OK！");
    $notify("LINE 字型替換", "浪漫雅圓注入成功", "已成功替換字型二進位，請套用！");
    $done({
        status: "HTTP/1.1 200 OK",
        headers: {
            "Content-Type": "application/zip",
            "Content-Length": "" + (response.bodyBytes ? response.bodyBytes.length : (response.body ? response.body.length : 0)),
            "Access-Control-Allow-Origin": "*",
            "Connection": "keep-alive"
        },
        bodyBytes: response.bodyBytes,
        body: response.body
    });
}, reason => {
    console.log("[LINE-Font] 下載失敗：" + JSON.stringify(reason));
    $notify("LINE 字型替換", "下載失敗", reason.error || "網路異常");
    $done({});
});
