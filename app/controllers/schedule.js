const mysql=require('./mysql');
const schedule = require("node-schedule");
exports.schedule=async(ctx,next)=>{
    var rule = new schedule.RecurrenceRule();
    var time = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
    //var time1 = [0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46,48,50,52,54,56,58];
    rule.minute = time;
    await schedule.scheduleJob(rule, function () {
        var rtn = new Array();
        for (var i = 0; i < 3; i++) {
            rtn[i] = parseInt(Math.random() * 10);
        }
        var result=rtn[0]+rtn[1]+rtn[2];
        var details=rtn[0]+' + '+rtn[1]+' + '+rtn[2]+' =';
        mysql.recordLottery(rtn[0],rtn[1],rtn[2],details,result);
        console.log('good_luck：'+result.toString());
    });

}