exports.schedule=async(ctx,next)=>{
    var schedule = require("node-schedule");
    var rule = new schedule.RecurrenceRule();
    var time = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
    rule.minute = time;
    console.log('准备好了')
    schedule.scheduleJob(rule, function () {
        console.log('定时执行任务，哈哈！');
    });
}