/**
 * LINE Custom Font Body Injector for Quantumult X
 * 支持通知與零跳轉二進位注入
 */
const FONT_URL = "https://raw.githubusercontent.com/w902287/line-custom-font/main/TT07-armochih32c90b5_md_scale.zip";

console.log("[LINE-Font] 攔截到字型下載請求：" + $request.url);

$notify("LINE 字型替換", "浪漫雅圓注入中", "正在從 GitHub 獲取自定義字型包...");

$task.fetch({
    url: FONT_URL,
    method: "GET"
}).then(response => {
    console.log("[LINE-Font] 成功從 GitHub 下載字型，大小：" + (response.bodyBytes ? response.bodyBytes.length : (response.body ? response.body.length : 0)) + " bytes");
    $notify("LINE 字型替換", "浪漫雅圓注入成功！", "已成功替換官方字型包，請點擊套用。");
    
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
    console.log("[LINE-Font] 下載失敗：" + reason.error);
    $notify("LINE 字型替換", "下載失敗", reason.error || "網路連線異常");
    $done({});
});
