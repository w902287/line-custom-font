/** LINE dual-slot font selector — invoked through QX event-interaction actions. */
const KEY="line.custom.font.combo";
const choices={
  ry:{title:"浪漫雅圓 ＋ Yozai Medium",slot1:"浪漫雅圓",slot2:"Yozai Medium"},
  rt:{title:"浪漫雅圓 ＋ 台北黑體 Bold",slot1:"浪漫雅圓",slot2:"台北黑體 Bold"},
  say:{title:"Sarasa Mono Slab TC ＋ Yozai Medium",slot1:"Sarasa Mono Slab TC",slot2:"Yozai Medium"},
  sat:{title:"Sarasa Mono Slab TC ＋ 台北黑體 Bold",slot1:"Sarasa Mono Slab TC",slot2:"台北黑體 Bold"}
};
try{
  const env=(typeof $environment!=="undefined"&&$environment)||{};
  const source=env.sourcePath||"";
  const direct=env.variables&&env.variables.combo;
  const m=source.match(/[?&#]combo=([a-z0-9_-]+)/i);
  const selected=direct||(m?m[1]:null);
  if(!selected||!choices[selected]){
    const current=$prefs.valueForKey(KEY)||"ry",c=choices[current];
    $done({title:"LINE 雙欄字型",htmlMessage:`<p style="font-family:-apple-system;text-align:center;font-size:18px">目前組合<br><b>${c.title}</b></p>`});
  }else{
    const previous=$prefs.valueForKey(KEY)||"ry",p=choices[previous]||choices.ry;
    const ok=$prefs.setValueForKey(selected,KEY),c=choices[selected];
    const changed=[];
    if(p.slot1!==c.slot1)changed.push(`白玉欄：${p.slot1} → ${c.slot1}`);
    if(p.slot2!==c.slot2)changed.push(`芫荽欄：${p.slot2} → ${c.slot2}`);
    const action=changed.length?`立即回 LINE：右上角 ⋯ → 刪除所有字型，重開字型頁；看到摘要更新通知後，重新下載白玉與芫荽兩欄。變動內容：${changed.join("；")}`:"組合沒有改變，不需重新下載。";
    console.log(`[LINE-Font-Dual] previous=${previous} selected=${selected} saved=${ok}`);
    $notify("LINE 雙欄字型已切換",c.title,action);
    $done({title:"切換完成",htmlMessage:`<p style="font-family:-apple-system;text-align:center;font-size:18px"><b>${c.title}</b><br><br>白玉書體 → ${c.slot1}<br>芫荽 → ${c.slot2}<br><br>${action}</p>`});
  }
}catch(e){console.log("[LINE-Font-Dual] select error "+String(e));$done();}
