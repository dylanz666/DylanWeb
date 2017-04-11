var router = require('koa-router')();
var user_router = require('./user_router');
var business_router = require('./business_router');
router.use('/users', user_router.routes(), user_router.allowedMethods());
router.use('/business', business_router.routes(), business_router.allowedMethods());
module.exports = router;