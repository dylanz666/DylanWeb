/**
 * Created by dylanz on 2017/3/13.
 */
const mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'zzh.9098',
    port: '3306',
    database: 'lottery'
});
connection.connect();

module.exports = {
    select: function (username, password) {
        var select = 'select * from userinfo where username=' + connection.escape(username) + 'and password=' + connection.escape(password);
        return new Promise(function (resolve, reject) {
            querySQL(select).then(function (data) {
                if (data != "") {
                    resolve(true);
                } else {
                    resolve(false);
                }
            })
        })
    },
    insert: function (username, password, phone) {
        var insert = 'insert into userinfo(username,password,phone)values(' + connection.escape(username) + ',' + connection.escape(password) + ',' + connection.escape(phone) + ')';
        return new Promise(function (resolve, reject) {
            querySQL(insert).then(function (data) {
                resolve('success');
            })
        })

    },
    checkUser: function (username) {
        var check = 'select * from userinfo where username=' + connection.escape(username);
        return new Promise(function (resolve, reject) {
            querySQL(check).then(function (data) {
                if (data != "") {
                    resolve(true);
                } else {
                    resolve(false);
                }
            })
        })
    },
    recordLottery: function (num1, num2, num3, details, result) {
        var record = 'insert into record(num1,num2,num3,details,result)values('
            + connection.escape(num1) + ',' + connection.escape(num2) + ',' + connection.escape(num3) + ','
            + connection.escape(details) + ',' + connection.escape(result) + ')';
        return new Promise(function (resolve, reject) {
            querySQL(record).then(function (data) {
                resolve('success');
            })
        })
    },
    getRecords: function () {
        var latest = 'SELECT phase,details,result,timestamp FROM record ORDER BY phase DESC LIMIT 10';
        return new Promise(function (resolve, reject) {
            querySQL(latest).then(function (data) {
                resolve(data);
            })
        })
    },
    queryBetResult: function (sqlstr,username) {
        var sql=sqlstr+connection.escape(username)+'ORDER BY phase DESC';
        return new Promise(function (resolve, reject) {
            connection.query(sql, function (err, results) {
                resolve(results);
            })
        })
    },
    //获取用户的信息
    userInfo:function(username,password){
        var info='select username,phone,cash from userinfo where username=' + connection.escape(username) + ' and password=' + connection.escape(password);
        return new Promise(function (resolve, reject) {
            querySQL(info).then(function (data) {
                resolve(data[0]);
            })
        })
    },
    //查看该用户的该期是否有投注
    isBetted:function(username,phase){
        var isBetted='select bet from finance where username='+connection.escape(username)+' and phase='+phase;
        return new Promise(function (resolve, reject) {
            querySQL(isBetted).then(function (data) {
                if(data==""){
                    resolve(false);
                }else{
                    resolve(true);
                }
            })
        })
    },
    //在finance表插入数据，即创建投注记录
    setDecision:function(betObj){
        var insertData='insert into finance(username,phase,bet,profit,total,numbers)values('
            +"'"+betObj.username+"'"+','+betObj.phase+','+betObj.sum+',0,'+betObj.cash+','+"'"+betObj.numbers+"'" + ')';
        return new Promise(function (resolve, reject) {
            querySQL(insertData).then(function (data) {
                resolve(data);
            })
        })
    },
    //更新用户信息，即更新改用户的金币总数
    updateUserInfo:function(betObj){
        var updateUserInfo='update userinfo set cash= '+betObj.cash +' where username= '+connection.escape(betObj.username)+' and password= '+connection.escape(betObj.password);
        return new Promise(function (resolve, reject) {
            querySQL(updateUserInfo).then(function (data) {
                resolve(data);
            })
        })
    },
    //派奖逻辑-->在服务器完成就可以了
    getUserBetted:function(username,phase){
        var getUB='SELECT * from finance where username='+connection.escape(username)+' and phase='+phase;
        return new Promise(function (resolve, reject) {
            querySQL(getUB).then(function (data) {
                console.log(data.length);
                if(data.length==0){
                    resolve(null);
                }else{
                    resolve(data);
                    console.log(data);
                }
            })
        })
    },
    getLatestRecord: function () {
        var latest = 'SELECT * from record WHERE phase=(SELECT max(phase) from record)';
        return new Promise(function (resolve, reject) {
            querySQL(latest).then(function (data) {
                resolve(data[0]);
            })
        })
    },
    updateFinance:function(updateObj){
        var updateF= 'update finance set profit='+updateObj.profit+',total='+updateObj.cash+' where username='+connection.escape(updateObj.username)+' and phase='+updateObj.phase;
        console.log(updateF);
        return new Promise(function (resolve, reject) {
            querySQL(updateF).then(function (data) {
                resolve(data);
            })
        })
    }
}
function querySQL(sql) {
    return new Promise(function (resolve, reject) {
        connection.query(sql, function (err, results) {
            resolve(results);
        })
    })
}
//connection.end();