function doPost(e) {
    var CHANNEL_ACCESS_TOKEN = 'JLUNjLAikt2ns4CjSX2Qt+jsfCjjevij71v6GQf1herhIC5sZX4Mil+IS4DkdM+ffUNyHEDLDiS/+rslbt3Xt+rlr4tx3iGZhFEEZUW6VeZIUs8sUt5JCJuXIn9xuyAh0zlKBZOBSEHJKEWneTl5XgdB04t89/1O/w1cDnyilFU=';
    var msg= JSON.parse(e.postData.contents);
    console.log(msg);
    
    const replyToken = msg.events[0].replyToken; // 回覆的 token
    const userMessage = msg.events[0].message.text; // 抓取使用者傳的訊息內容
    const user_id = msg.events[0].source.userId; // 抓取使用者的 ID，等等用來查詢使用者的名稱
    const event_type = msg.events[0].source.type; // 分辨是個人聊天室還是群組，等等會用到
    // reply_messgae 為要回傳給 LINE 伺服器的內容，JSON 格式，詳情可看 LINE 官方 API 說明
    var reply_message = [{
    "type":"text",
    "text":userMessage
    }]
    const sheet_url = 'https://https://docs.google.com/spreadsheets/d/1i0Cv-sDqiJLDCOK6ehd1hDX-ethD5RFIZXZhP-gRQ1Q/edit#gid=0'; // 將引號處的內容改成你的 Google 試算表連結
    const sheet_name = 't1'; // 將 reserve 改成你的工作表名稱
    const SpreadSheet = SpreadsheetApp.openByUrl(sheet_url);
    const reserve_list = SpreadSheet.getSheetByName(sheet_name);
    var amount;
    var sent_msg = true;
    


    if (userMessage == "/ia"){
      amount = "【食材總金額】\n";
      amount += reserve_list.getSheetValues(2,6,1,1);
      reply_message = [
      {
        "type": "text",
        "text": amount + " 元"
      }
    ]
    }else if (userMessage == "/oa"){
      amount = "【雜項總金額】\n";
      amount += reserve_list.getSheetValues(2,7,1,1);
      reply_message = [
      {
        "type": "text",
        "text": amount + " 元"
      }
    ]
    }else if (userMessage == "/ta"){
      amount = "【烤肉總金額】\n";
      amount += reserve_list.getSheetValues(2,8,1,1);
      reply_message = [
      {
        "type": "text",
        "text": amount + " 元"
      }
    ]
    }else if (userMessage == "/il"){
      var ingredient_list = "🍖食材清單🦪\n";
      for (var i=2;i<30;i++){
        var tmp = reserve_list.getSheetValues(i,1,1,1);
        if (tmp != ""){
          ingredient_list += tmp + " " + reserve_list.getSheetValues(i,2,1,1) + "元\n";
        }else{
          break;
        }
      }
      ingredient_list += "----------\n總金額 " + reserve_list.getSheetValues(2,6,1,1) + " 元";
      reply_message = [
      {
        "type": "text",
        "text": ingredient_list
      }
      ]
      
    }else if (userMessage == "/ol"){
      var others_list = "🍴雜項清單🧊\n";
      for (var i=2;i<30;i++){
        var tmp = reserve_list.getSheetValues(i,3,1,1);
        if (tmp != ""){
          others_list += tmp + " " + reserve_list.getSheetValues(i,4,1,1) + "元\n";
        }else{
          break;
        }
      }
      others_list += "----------\n總金額 " + reserve_list.getSheetValues(2,7,1,1) + " 元";
      reply_message = [
      {
        "type": "text",
        "text": others_list
      }
      ]
      
    }else if (userMessage.includes("/ib")){
      if (userMessage.split(" ").length == 3){
        var item = userMessage.split(" ")[1];
        var price = userMessage.split(" ")[2];
        //找出下一個空格的位置
        var empty_row;
        for (var i=2;i<30;i++){
          var tmp = reserve_list.getSheetValues(i,1,1,1);
          if (tmp == ""){
            empty_row = i;
            break;
          }
        }
        reserve_list.getRange(empty_row,1).setValue(item);
        reserve_list.getRange(empty_row,2).setValue(price);

        reply_message = [
        {
          "type": "text",
          "text": "已將【" + item + " " + price + "元" +  "】記錄到清單中！"
        }
        ]
      }else{
        reply_message = [
        {
          "type": "text",
          "text": "輸入有誤！\n食材購買指令為：/ib {物品} {價格}"
        }
        ]
      }
      



    }else if (userMessage.includes("/ob")){
      if (userMessage.split(" ").length == 3){
        var item = userMessage.split(" ")[1];
        var price = userMessage.split(" ")[2];
        //找出下一個空格的位置
        var empty_row;
        for (var i=2;i<30;i++){
          var tmp = reserve_list.getSheetValues(i,3,1,1);
          if (tmp == ""){
            empty_row = i;
            break;
          }
        }
        reserve_list.getRange(empty_row,3).setValue(item);
        reserve_list.getRange(empty_row,4).setValue(price);

        reply_message = [
        {
          "type": "text",
          "text": "已將【" + item + " " + price + "元" +  "】記錄到清單中！"
        }
        ]
      }else{
        reply_message = [
        {
          "type": "text",
          "text": "輸入有誤！\n雜項購買指令為：/ob {物品} {價格}"
        }
        ]
      }
    }else if (userMessage.includes("/id")){
      if (userMessage.split(" ").length == 2){
        var item = userMessage.split(" ")[1];
        for (var i=2;i<30;i++){
          var tmp = reserve_list.getSheetValues(i,1,1,1);
          if (tmp == item){
            reserve_list.getRange(i,1).setValue("");
            reserve_list.getRange(i,2).setValue("");
            break;
          }
        }
        reply_message = [
        {
          "type": "text",
          "text": "已將【" + item  + "】從清單中刪除！"
        }
        ]
      }else{
        reply_message = [
        {
          "type": "text",
          "text": "輸入有誤！\n食材刪除指令為：/id {物品}"
        }
        ]
      }
    
    }else if (userMessage.includes("/od")){
      if (userMessage.split(" ").length == 2){
        var item = userMessage.split(" ")[1];
        for (var i=2;i<30;i++){
          var tmp = reserve_list.getSheetValues(i,3,1,1);
          if (tmp == item){
            reserve_list.getRange(i,3).setValue("");
            reserve_list.getRange(i,4).setValue("");
            break;
          }
        }
        reply_message = [
        {
          "type": "text",
          "text": "已將【" + item  + "】從清單中刪除！"
        }
        ]
      }else{
        reply_message = [
        {
          "type": "text",
          "text": "輸入有誤！\n雜項刪除指令為：/od {物品}"
        }
        ]
      }
    }else if (userMessage.includes("/iu")){
      if (userMessage.split(" ").length == 3){
        var item = userMessage.split(" ")[1];
        var new_ = userMessage.split(" ")[2];
        if (!isNaN(parseFloat(new_)) && isFinite(new_)){ //if new_ is number
          for (var i=2;i<30;i++){
          var tmp = reserve_list.getSheetValues(i,1,1,1);
          if (tmp == item){
            reserve_list.getRange(i,2).setValue(new_);
            reply_message = [
            {
              "type": "text",
              "text": "已將【" + item + "】的價格更改為" + new_ + "元"
            }
            ]
            break;
          }
        }
        }else{
          for (var i=2;i<30;i++){
          var tmp = reserve_list.getSheetValues(i,1,1,1);
          if (tmp == item){
            reserve_list.getRange(i,1).setValue(new_);
            reply_message = [
            {
              "type": "text",
              "text": "已將【" + item + "】更改為【" + new_ + "】"
            }
            ]
            break;
          }
          }
        }
      }else{
        reply_message = [
        {
          "type": "text",
          "text": "輸入有誤！\n雜項修改指令為：/iu {物品} {新物品OR新價格}"
        }
        ]
      }
    }else if (userMessage.includes("/ou")){
      if (userMessage.split(" ").length == 3){
        var item = userMessage.split(" ")[1];
        var new_ = userMessage.split(" ")[2];
        if (!isNaN(parseFloat(new_)) && isFinite(new_)){ //if new_ is number
          for (var i=2;i<30;i++){
          var tmp = reserve_list.getSheetValues(i,3,1,1);
          if (tmp == item){
            reserve_list.getRange(i,4).setValue(new_);
            reply_message = [
            {
              "type": "text",
              "text": "已將【" + item + "】的價格更改為" + new_ + "元"
            }
            ]
            break;
          }
        }
        }else{
          for (var i=2;i<30;i++){
          var tmp = reserve_list.getSheetValues(i,3,1,1);
          if (tmp == item){
            reserve_list.getRange(i,3).setValue(new_);
            reply_message = [
            {
              "type": "text",
              "text": "已將【" + item + "】更改為【" + new_ + "】"
            }
            ]
            break;
          }
          }
        }
      }else{
        reply_message = [
        {
          "type": "text",
          "text": "輸入有誤！\n雜項修改指令為：/ou {物品} {新物品OR新價格}"
        }
        ]
      }
    }else if (userMessage == "/help"){
      var cmd1 = "🥩烤肉小幫手 指令查詢🥩\n\n";
      var cmd2 = "⏺新增紀錄\n食材👉/ib {食材} {價格}\n雜項👉/ob {雜項} {價格}\n\n";
      var cmd3 = "⏺修改紀錄\n食材👉/iu {食材} {新名稱OR價格}\n雜項👉/ou {雜項} {新名稱OR價格}\n\n";
      var cmd4 = "⏺刪除紀錄\n食材👉/id {食材}\n雜項👉/od {雜項}\n\n";
      var cmd5 = "⏺查詢紀錄\n食材👉/il\n雜項👉/ol\n\n";
      var cmd6 = "⏺查詢金額\n食材金額👉/ia\n雜項金額👉/oa\n總金額👉/ta"
      reply_message = [
        {
          "type": "text",
          "text": cmd1 + cmd2 + cmd3 + cmd4 + cmd5 + cmd6
        }
        ]
    }else{
      sent_msg = false;
    }
    




    
    
    
    if (sent_msg){
      //回傳 JSON 給 LINE 並傳送給使用者
      var url = 'https://api.line.me/v2/bot/message/reply';
      UrlFetchApp.fetch(url, {
      'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
      },
      'method': 'post',
      'payload': JSON.stringify({
      'replyToken': replyToken,
      'messages': reply_message,
      }),
      });
    }
      
    

}