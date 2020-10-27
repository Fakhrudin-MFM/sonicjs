'use strict';
var emitterService = require('../services/emitter.service');

module.exports = function (Contenttype) {

  Contenttype.observe('loaded', async function filterProperties(ctx, next) {
    // if (ctx.options && ctx.options.skipPropertyFilter) return next();
    // if (ctx.instance && ctx.instance.data) {
    //   var date = + new Date()
    //   ctx.instance.data.createdOn = date;
    //   ctx.instance.data.updatedOn = undefined;
    // }

    if(ctx.data){
      // The data property exists when saving a new model instance.  No instance property.
    }

    if(ctx.instance){
      // instance exists when querying data from the database.  No data property.  It's either one or the other
    }

    await emitterService.emit('contentTypeLoaded', ctx.data );

    console.log('content type loaded');


    // next();
  });

  // Contenttype.observe('before save', async function filterProperties(ctx, next) {
  //   // if (ctx.options && ctx.options.skipPropertyFilter) return next();
  //   // if (ctx.instance && ctx.instance.data) {
  //   //   var date = + new Date()
  //   //   ctx.instance.data.createdOn = date;
  //   //   ctx.instance.data.updatedOn = undefined;
  //   // }

  //   await emitterService.emit('contentTypeBeforeSave', { instance: ctx.instance.data });


  //   next();
  // });

  Contenttype.status = function (cb) {
    var response = new Date();
    cb(null, response);
  };

  Contenttype.remoteMethod(
    'status', {
      http: {
        path: '/status',
        verb: 'get',
      },
      returns: {
        arg: 'status',
        type: 'string',
      },
    }
  );

  Contenttype.getName = function (id, cb) {
    Contenttype.findById(id, function (err, instance) {
      var response = 'Name of coffee shop is ' + instance.name;
      cb(null, response);
    });
  };

  Contenttype.remoteMethod(
    'getName', {
      http: {
        path: '/getname',
        verb: 'get',
      },
      accepts: {
        arg: 'id',
        type: 'string',
        http: {
          source: 'query',
        },
      },
      returns: {
        arg: 'name',
        type: 'string',
      },
    }
  );


};
