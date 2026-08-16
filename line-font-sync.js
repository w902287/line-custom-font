/**
 * LINE Custom Font Local Injector for Quantumult X
 * 直接替換 Response Body
 */
const FONT_URL = "https://raw.githubusercontent.com/w902287/line-custom-font/2bde2f430dc3faa1f7b7d9fa13e137411588b95d/TT07-armochih32c90b5_md_scale.zip";

console.log("[LINE-Font] 攔截到字型下載請求：" + $request.url);

$task.fetch({
    url: FONT_URL,
    method: "GET"
}).then(response => {
    console.log("[LINE-Font] 字型二進位下載成功，正在回傳！大小: " + (response.body ? response.body.length : 0));
    $notify("LINE 字型替換", "浪漫雅圓注入成功", "字型檔案已替換，請點擊套用！");
    $done({
        body: response.body
    });
}, reason => {
    console.log("[LINE-Font] 下載失敗：" + JSON.stringify(reason));
    $notify("LINE 字型替換", "下載失敗", reason.error || "網路異常");
    $done({});
});
