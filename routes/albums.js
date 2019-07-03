var express = require('express');
var app = express();
var router = express.Router();

router.get('/', function(req, res) { });
router.post('/', function(req, res) { });
router.get('/:id', function(req, res) { });
router.patch('/:id', function(req, res) { });
router.delete('/:id', function(req, res) { });
app.use('/albums', router);

module.exports = app;
