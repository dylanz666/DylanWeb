//接口的具体实现
//建立home接口
/*exports.home = async (ctx, next) => {
    //ctx.body = ctx.request.body;
    if(ctx.request.body.username=="dylan" && ctx.request.body.password=="123"){
        await ctx.render('lottery.html', {
        });
    }else{
        await ctx.render('index.html', {
        });
    }
}*/
//引入crypto模块，用于md5加密，crypto还有其他加密方式哦；
const crypto = require('crypto');
const hash = crypto.createHash('md5');
//引入mysql.js文件，内含几个自己写的方法；
const mysql=require('./mysql');
//注册接口
exports.registerHome = async (ctx, next) => {
    await ctx.render('register.html', {
    });
}
exports.register = async (ctx, next) => {
    var username=ctx.request.body.username;
    var password=ctx.request.body.password;
    var phone=ctx.request.body.phone;
    var password_md=crypto.createHash("md5").update(password).digest("hex");
    var existed=await mysql.checkUser(username);
    console.log("存在情况："+existed);
    if(existed==true){
        ctx.body={username,isExisted:'true',result:'fail'};
    }else{
        await mysql.insert(username,password_md,phone);
        ctx.body={user:username,isExisted:'false',result:'true'};
    }
}
//登录验证接口===>数据库操作
exports.home = async (ctx, next) => {
    var username=ctx.request.body.username;
    var password=ctx.request.body.password;
    var password_md=crypto.createHash("md5").update(password).digest("hex");
    let ret;
    ret=await mysql.select(username,password_md);
    if(ret==true){
        await ctx.render('center.html');
    }else{
        ctx.body={isExisted:'false',result:'fail'};
    await ctx.render('/');
    }
    var tNow=new Date();
    var cookieDay=tNow.getDay()+1;
    var mNow=tNow.getMonth()+1;
    var yNow=tNow.getYear();
    var cookieAge=yNow+"-"+mNow+"-"+cookieDay;
    ctx.cookies.set(
        'username',
        username,
        {
            domain: '127.0.0.1',  // 写cookie所在的域名
            path: '/',       // 写cookie所在的路径
            maxAge: 60 * 60 * 1000, // cookie有效时长
            expires: new Date(cookieAge),  // cookie失效时间
            httpOnly: false,  // 是否只用于http请求中获取
            overwrite: false  // 是否允许重写
        }
    );
    ctx.cookies.set(
        'password',
        password_md,
        {
            path: '/',       // 写cookie所在的路径
            maxAge: 60 * 60 * 1000, // cookie有效时长
            expires: new Date(cookieAge),  // cookie失效时间
            httpOnly: false,  // 是否只用于http请求中获取
            overwrite: false  // 是否允许重写
        }
    )
}
//游戏1
exports.firstGame = async (ctx, next) => {
    var username=ctx.request.body.username;
    var password=ctx.request.body.password;
    let ret;
    ret=await mysql.select(username,password);
    if(ret==true){
    await ctx.render('lottery.html');
    }else{
        ctx.body={isExisted:'false',result:'fail'};
    await ctx.render('/');
    }
}
//游戏2
exports.secondGame = async (ctx, next) => {
    var username=ctx.request.body.username;
    var password=ctx.request.body.password;
    let ret;
    ret=await mysql.select(username,password);
    if(ret==true){
    await ctx.render('game.html');
    }else{
        ctx.body={isExisted:'false',result:'fail'};
    await ctx.render('/');
    }
}
//充值跳转接口
exports.recharge = async (ctx, next) => {
    await ctx.render('recharge.html');
}