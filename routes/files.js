var express = require('express');
var router = express.Router();
var multer = require('multer');
var multerConfig = require('../config/multer-config');

var FileUpload = require('../models').FileUpload;


var multerUpload = multer(multerConfig.options).single('file');

var list = function(req, res) {
  FileUpload.findAll({
  }).then(function (files) {
    res.json({files: files});
  });
};

router.get('/', list);

router.post('/', function(req, res) {
  multerUpload(req, res, function (err) {
    if (err) {
      // console.log(err);
      res.status(400).send(err);
    }

    // Everything went fine
    if (req.file) {
      var fileType = req.file.mimetype.split('/')[0];
      FileUpload.create({
        file_name: req.file.filename,
        file_type: fileType,
        file_content_type: req.file.mimetype,
        file_size: req.file.size,
        file_path: req.file.path
      }).then(function (fileObj) {
        // console.log('here4', fileObj.dataValues);
        return res.status(200).json({
          file: fileObj.dataValues,
          status: 'success',
          msg: "File uploaded successfully!"
        });
      });
    } else {
      return res.status(400).json({
        status: 'error',
        msg: "File not uploaded!"
      });
    }
  });
});

module.exports = router;
