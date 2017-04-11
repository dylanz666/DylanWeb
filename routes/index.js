var router = require('koa-router')();

router.get('/', async function (ctx, next) {
  ctx.state = {
    title: 'login'
  };
  await ctx.render('index.html', {
  });
})
module.exports = router;
