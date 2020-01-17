var express = require('express');
var cookie = require('cookie');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.cookie('test', 'test', { maxAge: 900000, httpOnly: true });
  res.setHeader('Set-Cookie', cookie.serialize('test', 'test', {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 1 // 1 day
  }));

  res.render('index', { title: 'Express' });
});

module.exports = router;
