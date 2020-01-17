var express = require('express');
var cookie = require('cookie');

var router = express.Router();
var models = require('../models');


/* GET users listing. */
router.get('/', function(req, res, next) {
  var cookies = cookie.parse(req.headers.cookie || '');
  var test = cookies.test;
  console.log('cookies', test);

  models.User.findAll({
    include: [ models.Task ]
  }).then(function (users) {
    return res.status(200).json({users: users});
  });
});

module.exports = router;
