var themes = require(__dirname + '../../themes/themes');
var pageBuilderService = require('../services/page-builder.service');
var formio = require('../services/formio.service');
var eventBusService = require('../services/event-bus.service');

var adminService = require('../services/admin.service');

var moduleService = require('../services/module.service').startup();
var menuService = require('../services/menu.service');
var mediaService = require('../services/media.service');
var siteSettingsService = require('../services/site-settings.service');
var contentService = require('../services/content.service');

var cors = require('cors');

const chalk = require('chalk');
const log = console.log;

var admin = require(__dirname + '/admin');
const helmet = require('helmet')

module.exports = function (app) {
  var router = app.loopback.Router();

  let page = '';
  let adminPage = '';



  (async () => {
    eventBusService.emit('startup');
  })();

  (async () => {
    await menuService.startup();
    await mediaService.startup();
    await siteSettingsService.startup();

    //TODO fix admin path for prod mode
    adminPage = await admin.loadAdmin();
  })();


  app.get('/hbs', async function (req, res) {
    res.render('home');
  });

  app.get('/test', async function (req, res) {
    res.send('ok');
  });

  app.get('/admin-ng', async function (req, res) {
    res.send(adminPage);
  });

  router.get('/admin/content-types', function (req, res) {
    res.send(adminPage);
  });

  app.get('*', async function (req, res, next) {
    if ( req.url === '/explorer' || req.url.startsWith('/api')
      || req.url.endsWith('.css') || req.url.endsWith('.html') || req.url.endsWith('.ico') || req.url.endsWith('.map') 
      || req.url.endsWith('.js') || req.url.indexOf('fonts') > -1 || req.url.indexOf('.woff') > -1) {
      // log(chalk.blue(req.url));
      return next();
    }

    // formio.getComponents();

    if(req.url.startsWith('/blog/')){
      res.render('blog', await contentService.getBlog(req));
    }
    else if(req.url.startsWith('/admin')){
      res.render('admin',  {layout: 'admin.handlebars', model: {}});
    }
    else{
      res.render('home', await contentService.getRenderedPage(req));
    }

  });
  // app.use('/admin', function(req, res, next) {
  //   console.log('admin route', req.url);
  //   res.send(adminPage);
  // });

  // app.use(/\/((?!admin).)*/, function(){
  //   return "ok";
  // });

  // app.get('*', function(req, res){
  //   res.send(adminPage);
  // });

  // Allow from a specific host.
  // Sets "X-Frame-Options: ALLOW-FROM http://example.com".
  // app.use(helmet.frameguard({
  //   action: 'allow-from',
  //   domain: 'http://localhost:4200'
  // }))

  // app.use(helmet.frameguard({ action: 'sameorigin' }))


  // app.use(helmet.frameguard({ action: 'allow' }))


  // app.use(helmet.frameguard({ action: 'sameorigin' }))



  app.use(router);

};  

