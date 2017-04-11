//接口的具体实现
//抽奖接口
const fs = require("fs");
const mysql=require('./mysql');
exports.draw=async(ctx,next)=>{
    var rtn = new Array();
    var finalData;    
    for (var i = 0; i < 3; i++) {
        rtn[i] = parseInt(Math.random() * 10);
    }
    var sum=rtn[0]+rtn[1]+rtn[2];
    var ten=parseInt(sum/10);
    var mod=sum%10;
    finalData = {num1: rtn[0], num2: rtn[1], num3: rtn[2],num4:ten,num5:mod};
    var data=rtn[0]+','+rtn[1]+','+rtn[2]+','+sum;
    var userExist=await mysql.checkUser(ctx.request.body.username,ctx.request.body.password);
    if(userExist==true){
        await mysql.recordLottery(ctx.request.body.username,rtn[0],rtn[1],rtn[2],sum);
        ctx.body = finalData;
    }else{
        ctx.body={result:'fail'}
    }
}
exports.pull=async(ctx,next)=>{
    //获取开奖数据
    var history=await mysql.getRecords();
    //计算距离下一期的开奖时间
    const time=new Date();
    var minute = time.getMinutes();
    var second = time.getSeconds();
    var m=minute % 5;
    var t=301-m*60-second;
    ctx.body={time:t,history:history};
}
//获取区间内用户的投注记录，用于前端表格显示
exports.getBetResult=async(ctx,next)=>{
    //获取开奖数据
    var history=await mysql.getRecords();
    //获取开奖数据10条数据的第一个phase和最后一个phase,用于查询特定用户在该区间的投注记录
    var p1=history[0].phase+3;
    var p2=history[9].phase;
    //用户验证
    var userInfo=await mysql.userInfo(ctx.request.body.username,ctx.request.body.password);
    if(userInfo==null){
        ctx.body={userExisted:"false"};
    }else{
        //查询区间内该用户的投注记录
        var sqlstr='select username,phase,numbers,bet,profit,total from finance where phase between '+p2+' and '+ p1 +' AND username=';
        var br=await mysql.queryBetResult(sqlstr,ctx.request.body.username);
        //返回数据给前端
        ctx.body={username:userInfo.username,phone:userInfo.phone,totalCoin:userInfo.cash,bets:br};
    }
}
//投注页面跳转接口
exports.BettingHome = async (ctx, next) => {
//    ctx.body=ctx.params.phase;
await ctx.render('betting.html');
}
//获取用户信息
exports.getUserInfo=async(ctx,next)=>{
    var userInfo=await mysql.userInfo(ctx.request.body.username,ctx.request.body.password);
    if(userInfo==null){
     ctx.body={userExisted:"false"};
     }else{
     ctx.body={info:userInfo};
     }
}
//投注逻辑
/**
 *  1.接收前端传来的投注数据，包括，username,password,phase,投注details(json字符串-->便于储存)；
 *  2.mysql的代码，包括验证用户名密码，验证投注总额-->从投注details中获取（各投注的和）；
 *  3.验证结果：成功：insert语句；失败：render或redirect操作-->完成情况:前端alert并刷新；
 *  4.同时更新userinfo表的cash字段；
 *
 *
 *  */
exports.decision=async(ctx,next)=>{
    //计算距离下一期的开奖时间
    const time=new Date();
    var minute = time.getMinutes();
    var second = time.getSeconds();
    var m=minute % 5;
    var t=301-m*60-second;
    var username=ctx.request.body.username;
    var password=ctx.request.body.password;
    var phase=ctx.request.body.phase;
    var details=ctx.request.body.numbers;
    //将投注情况转化为json，方便使用
    var detailsObj=JSON.parse(details);
    var sum=0;
    //遍历json对象，计算投注总额
    var num="";
    for(var i=0;i<28;i++){
        num="num_"+i;
        if(detailsObj[num]){
            sum+=detailsObj[num];
        }
    };
    var userInfo=await mysql.userInfo(username,password);//获取用户信息；
    var history=await mysql.getRecords();//获取近10期开奖信息；
    var isBetted=await mysql.isBetted(username,phase);//验证改用户是否投注过该期；
    if(userInfo==null){//如果用户验证的结果为空：用户不存在；
        ctx.body={userExisted:"false"};
    }else if(t<80 && phase<=history[0].phase+1){
        ctx.body={enoughTime:"false"};
    }else if(userInfo.cash<sum){//如果用户投注额大于用户现有的金币，则用户金币不足；
        ctx.body={EnoughCoin:"false"};
    }else if(history[0].phase>=phase || phase>history[0].phase+3){//如果用户投注的期号不在投注期号范围内则：期号无效
        ctx.body={phase:"invalid"};
    }else if(isBetted==true){//如果用户已经投注过该期，则用户不能再投了
        ctx.body={isBetted:"true"};
    }else if(sum>0){//如果以上条件都不是，且投注的总金币大于0，则是正确的投注
        //ctx.body={info:sum};
        var update_coin=userInfo.cash-sum;
        var betObj={'username':username,'password':password,'phase':phase,'sum':sum,'cash':update_coin,'numbers':details};
        await mysql.updateUserInfo(betObj);
        await mysql.setDecision(betObj);
        ctx.body={success:"true"};
    }else{//如果以上条件都不是，则投注失败，也即：用户投注额没有大于0
        ctx.body={success:"false"};
    }
}
/**
 * 剩余工作：
 * 1.开奖后派奖逻辑
 * 2.前端梭哈逻辑
 * 3.忘记密码逻辑
 * 4.充值逻辑
 *1.派奖应针对所有人，这样就可以进入schedule
 *
 * */
//开奖后派奖逻辑-->目前暂时先通过前端触发，后面要改为后端schedule触发
 exports.getPayBack=async(ctx,next)=>{
    var username=ctx.request.body.username;
    var password=ctx.request.body.password;
    //获得最新开奖数据-->在定时开奖后马上获取
    var latestRecord=await mysql.getLatestRecord();
    var phase=latestRecord.phase;
    var result=latestRecord.result;
    //获取用户的投注详情
    var data=await mysql.getUserBetted(username,phase);
    var userCash=await mysql.userInfo(username,password);
    if(data==null){
        ctx.body={'profit':false};
    }else {
        var profit = data.profit;
        var total = userCash.cash;
        var bettedResult = data.numbers;
        var obj = JSON.parse(bettedResult);
        //遍历json对象，计算获得金币总额
        var num = "";
        var earn = 0;
        //计算获得金币数量
        for (var i = 0; i < 28; i++) {
            num = "num_" + i;
            if (obj[num] && i == result && profit == 0) {
                switch (i) {
                    case 0:
                    case 27:
                        earn = obj[num] * 1000;
                        break;
                    case 1:
                    case 26:
                        earn = obj[num] * 333.3;
                        break;
                    case 2:
                    case 25:
                        earn = parseInt(obj[num] * 166.6);
                        break;
                    case 3:
                    case 24:
                        earn = obj[num] * 100;
                        break;
                    case 4:
                    case 23:
                        earn = parseInt(obj[num] * 66.6);
                        break;
                    case 5:
                    case 22:
                        earn = parseInt(obj[num] * 47.6);
                        break;
                    case 6:
                    case 21:
                        earn = parseInt(obj[num] * 35.7);
                        break;
                    case 7:
                    case 20:
                        earn = parseInt(obj[num] * 27.7);
                        break;
                    case 8:
                    case 19:
                        earn = parseInt(obj[num] * 22.2);
                        break;
                    case 9:
                    case 18:
                        earn = parseInt(obj[num] * 18.1);
                        break;
                    case 10:
                    case 17:
                        earn = parseInt(obj[num] * 15.8);
                        break;
                    case 11:
                    case 16:
                        earn = parseInt(obj[num] * 14.4);
                        break;
                    case 12:
                    case 15:
                        earn = parseInt(obj[num] * 13.6);
                        break;
                    case 13:
                    case 14:
                        earn = parseInt(obj[num] * 13.3);
                        break;
                }
                //更新finance表，更新userinfo表
            }
        }
        ;
        if (earn > 0) {
            total += earn;
            var updateObj = {'username': username, 'password': password, 'phase': phase, 'profit': earn, 'cash': total};
            //根据获得金币数量更新finance表的profit及total金币数量
        await mysql.updateFinance(updateObj)
            ;
            //根据获得金币数量更新userinfo表的cash总金币数量
        await mysql.updateUserInfo(updateObj)
            ;
            ctx.body = {"success": true};
        } else {
            ctx.body = {"success": false};
        }
    }
}