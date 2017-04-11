var router = require('koa-router')();
var user_controller = require('../../app/controllers/user_controller');


//router.post('/home', user_controller.home);
//注册路由
router.get('/registerHome',user_controller.registerHome);
router.post('/register',user_controller.register);
//登录验证路由
router.post('/home',user_controller.home);
//第一个game路由
router.post('/firstGame',user_controller.firstGame);
router.post('/secondGame',user_controller.secondGame);
//充值跳转路由
router.get('/recharge',user_controller.recharge);
module.exports = router;