/**
 * LINE Custom Font Body Injector for Quantumult X
 * 直接覆蓋 Response Body，無需 302 跳轉，徹底解決 LINE 客戶端跳轉錯誤
 */
const FONT_ZIP_URL = "https://raw.githubusercontent.com/w902287/line-custom-font/main/TT07-armochih32c90b5_md_scale.zip";

$task.fetch({
    url: FONT_ZIP_URL,
    method: "GET"
}).then(response => {
    $done({
        status: "HTTP/1.1 200 OK",
        headers: {
            "Content-Type": "application/zip",
            "Content-Length": "" + (response.bodyBytes ? response.bodyBytes.length : (response.body ? response.body.length : 0)),
            "Connection": "keep-alive"
        },
        bodyBytes: response.bodyBytes,
        body: response.body
    });
}, reason => {
    $done({});
});
