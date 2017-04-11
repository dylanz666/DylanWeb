//按钮列表逻辑
function checkList(m,l){
    for (var i = 0; i <28; i++) {
        if (i%m==l) {
            document.getElementById('cb_'+i).checked=true;
            document.getElementById('tb_'+i).value=preBet(i);
        }else{
            document.getElementById('cb_'+i).checked=false;
            document.getElementById('tb_'+i).value="";
        }
    }
    pre();
}
function checkBigSingle(start,end,m,l) {
    for (var i =0; i <28; i++) {
        if (i>=start && i<=end && i%m==l) {
            document.getElementById('cb_'+i).checked=true;
            document.getElementById('tb_'+i).value=preBet(i);
        }else{
            document.getElementById('cb_'+i).checked=false;
            document.getElementById('tb_'+i).value="";
        }
    }  
    pre();      
}
function checkSingleEnd(m,l) {
    for (var i =0; i <28; i++) {
        if ((i<=9 || i>=18) && i%m==l) {
            document.getElementById('cb_'+i).checked=true;
            document.getElementById('tb_'+i).value=preBet(i);
        }else{
            document.getElementById('cb_'+i).checked=false;
            document.getElementById('tb_'+i).value="";
        }
    }
    pre();   
}
function checkBigEnd(start,end) {
    for (var i =0; i <28; i++) {
        if (i>=start && i<=end) {
            document.getElementById('cb_'+i).checked=true;
            document.getElementById('tb_'+i).value=preBet(i);
        }else{
            document.getElementById('cb_'+i).checked=false;
            document.getElementById('tb_'+i).value="";
        }
    }
    pre();   
}
function frog(start,end) {
    for (var i =0; i <28; i++) {
        if (i%10>=start && i%10<=end) {
            document.getElementById('cb_'+i).checked=true;
            document.getElementById('tb_'+i).value=preBet(i);
        }else{
            document.getElementById('cb_'+i).checked=false;
            document.getElementById('tb_'+i).value="";
        }
    }
    pre();
}
function preBet(num) {
    switch (num){
        case 0:
        case 27:
            return 1;
            break;  
        case 1:
        case 26:
            return 3;
            break;
        case 2:
        case 25:
            return 6;
            break;
        case 3:
        case 24:
            return 10;
            break;
        case 4:
        case 23:
            return 15;
            break;
        case 5:
        case 22:
            return 21;
            break;
        case 6:
        case 21:
            return 28;
            break;
        case 7:
        case 20:
            return 36;
            break;
        case 8:
        case 19:
            return 45;
            break;
        case 9:
        case 18:
            return 55;
            break;
        case 10:
        case 17:
            return 63;
            break;
        case 11:
        case 16:
            return 69;
            break;
        case 12:
        case 15:
            return 73;
            break;
        case 13:
        case 14:
            return 75;
            break;
    }
}
//单一复选框操作函数
function cb_Fn(num) {
	if(document.getElementById('cb_'+num).checked==false){//checkbox事件是先改变前端，然后才发送事件的
		document.getElementById('cb_'+num).checked=false;
		document.getElementById('tb_'+num).value="";
	}else{
		document.getElementById('cb_'+num).checked=true;
    	document.getElementById('tb_'+num).value=preBet(num);        	
	} 
	pre();   	
}
//倍数按钮事件
function btn_times(num,times) {
	var tbValue=document.getElementById('tb_'+num).value;
	if (tbValue!="") {
		tbValue=parseInt(tbValue);
		var tbNewValue=parseInt(tbValue*times);
		document.getElementById('tb_'+num).value=tbNewValue;
	}
	pre();
}
//文本框事件 
function tb_Fn(num) {
	var tbValue=document.getElementById('tb_'+num).value;
	if (tbValue=="") {
		document.getElementById('cb_'+num).checked=false;
	}else{
		document.getElementById('cb_'+num).checked=true;
	}
	pre();
}
//全局倍数事件
function gb_times(times) {
	for (var i =0; i <28; i++) {
		var tbValue=document.getElementById('tb_'+i).value;		
		if (tbValue!="" && document.getElementById('cb_'+i).checked==true) {
	    	tbValue=parseInt(tbValue);
	    	var tbNewValue=parseInt(tbValue*times);
	        document.getElementById('tb_'+i).value=tbNewValue;
    	}       
    }
    pre();
}
//反选事件
function invert() {
	for (var i =0; i <28; i++) {
		var cbChecked=document.getElementById('cb_'+i).checked;
        if (cbChecked==true) {
        	document.getElementById('cb_'+i).checked=false;
            document.getElementById('tb_'+i).value="";
        }else{
        	document.getElementById('cb_'+i).checked=true;
            document.getElementById('tb_'+i).value=preBet(i);
        }
    }
    pre();
}
//清空事件
function clearAll() {
	for (var i =0; i <28; i++) {		
        document.getElementById('cb_'+i).checked=false;
        document.getElementById('tb_'+i).value="";        
    }
    document.getElementById('preBet').innerHTML=0;
}
// 投注事件
var cookie_pos=document.cookie.indexOf('username')+9;
var cookie_end=document.cookie.indexOf(';', cookie_pos);
var cookie_username=document.cookie.substring(cookie_pos, cookie_end);
var cookie_p=document.cookie.indexOf('password')+9;
var cookie_password=document.cookie.substring(cookie_p, cookie_p+32);
function makeDescision() {
	var location=window.location.href;
	var str_start=location.lastIndexOf('/')+1;
	var phase=location.substring(str_start,location.length);
	var num=new Array();
	for (var i =0; i <28; i++) {
		var tbValue=document.getElementById('tb_'+i).value;		
		if (tbValue!="") {
	    	tbValue=parseInt(tbValue);
	    	num[i]=tbValue;
    	}
	}
	var obj={'num_0':num[0],'num_1':num[1],'num_2':num[2],'num_3':num[3],'num_4':num[4],'num_5':num[5],
'num_6':num[6],'num_7':num[7],'num_8':num[8],'num_9':num[9],'num_10':num[10],'num_11':num[11],'num_12':num[12],
'num_13':num[13],'num_14':num[14],'num_15':num[15],'num_16':num[16],'num_17':num[17],'num_18':num[18],
'num_19':num[19],'num_20':num[20],'num_21':num[21],'num_22':num[22],'num_23':num[23],'num_24':num[24],
'num_25':num[25],'num_26':num[26],'num_27':num[27]};
	var str=JSON.stringify(obj);
	$.ajax({
        url: '/api/business/decision',
        type: 'post',
        data:{'username':cookie_username,'password':cookie_password,'phase':phase,'numbers':str},
        dataType:"json",
        async: false,
        success: function(res) {
        	if(res.enoughTime=="false"){
           		alert("本期投注时间已过！");
           		//window.location.reload();
           		window.close();           		
           }
           if(res.success=="true"){
           		alert("恭喜，投注成功！");
           		//window.location.reload();
           		window.close();
           }
           if(res.success=="false"){
           		alert("投注失败，请重试！");            		         		
           }
           if(res.userExisted=="false"){
           		alert("用户不存在或登录已过期！");  
           		window.close();         		
           }
           if(res.EnoughCoin=="false"){
           		alert("金币不足，请充值！");
           		window.close();           		
           }
           if(res.phase=="invalid"){
           		alert("投注期号错误，请重试！");
           		window.close();           		
           }
           if(res.isBetted=="true"){
           		alert("您已投过该期，只能投注一次哦！");
           		window.close();           		
           }
        }
    });
}
//预投统计
function pre() {
	var num=new Array();
	for (var i =0; i <28; i++) {
		var tbValue=document.getElementById('tb_'+i).value;		
		if (tbValue!="") {
	    	tbValue=parseInt(tbValue);
	    	num[i]=tbValue;
    	}else{
    		num[i]=0;
    	}
	}
	var sum=0;
	for(var i =0; i <28; i++){
		sum+=num[i];
	}
	document.getElementById('preBet').innerHTML=sum;
}
//梭哈逻辑
function allIn() {	
	var total=document.getElementById('coin').innerHTML;
	total=parseInt(total);
	var num=new Array();	
	for (var i =0; i <28; i++) {
		var tbValue=document.getElementById('tb_'+i).value;		
		if (tbValue!="") {	    	
	    	num[i]=parseInt(tbValue);
    	}else{
    		num[i]=0;
    	}
	}	
	var sum=0;
	for(var i =0; i <28; i++){
		sum+=num[i];
	}
	for (var i =0; i <28; i++) {
		var cbChecked=document.getElementById('cb_'+i).checked;
		var tbValue=document.getElementById('tb_'+i).value;
		console.log(cbChecked);
        if (cbChecked==true) {
        	var b=parseInt((total/sum)*tbValue);      
        	console.log(b);
            document.getElementById('tb_'+i).value=b;
        }
    }
    pre();
}