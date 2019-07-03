var express = require('express');
var router = express.Router();
var User = require('../models').User;


/* GET users listing. */
router.get('/', function(req, res, next) {
  User.findAll({
    include: [ models.Task ]
  }).then(function (users) {
    return res.status(200).json({users: users});
  });
});

module.exports = router;
