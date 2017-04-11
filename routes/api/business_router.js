var router = require('koa-router')();
var business_controller = require('../../app/controllers/business_controller');

//抽奖路由
router.post('/draw',business_controller.draw);
router.post('/pull',business_controller.pull);
//获取用户投注结果路由
router.post('/getBetResult',business_controller.getBetResult);
router.get('/BettingHome/:phase',business_controller.BettingHome);
router.post('/getUserInfo',business_controller.getUserInfo);
router.post('/decision',business_controller.decision);
router.post('/getPayBack',business_controller.getPayBack);
module.exports = router;