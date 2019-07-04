var express = require('express');
var router = express.Router();
var fs = require('fs');
var multer = require('multer');
var multerConfig = require('../config/multer-config');
var yazl = require('yazl');
var FileUpload = require('../models').FileUpload;

var WebTorrent = require('webtorrent');

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
      console.log(req.file);
      var zipFile = new yazl.ZipFile();

      // zipFile.addFile(req.file.path, req.file.filename);
      // zipFile.outputStream
      //   .pipe(fs.createWriteStream('./uploads/' + req.file.filename + '.zips'))
      //   .on('close', function () {
      //     console.log('zipping done');
      //   });
      // zipFile.end();

      var client = new WebTorrent();
      var magnetLink = 'magnet:?xt=urn:btih:0a553dcb9d27a963b5021e9cabbe079de88e2ec8&dn=Halsey-Without+Me.mp3&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80&tr=udp%3A%2F%2Fopen.demonii.com%3A1337&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Fexodus.desync.com%3A6969';

      // client.add(magnetLink, { path: './torrents' }, function (torrent) {
      //   console.log('client has torrent added');
      // });
      client.add(req.file.path, { path: './torrents' }, function (torrent) {
        console.log('client has torrent added');
      });

      client.on('torrent', function (torrent) {
        console.log('client has torrent ready');

        torrent.on('error', function (err) {
          console.log('torrent error occurred');
        });

        torrent.on('infoHash', function () {
          console.log('torrent infoHash received');
        });

        torrent.on('metadata', function () {
          console.log('torrent metadata received');
        });

        torrent.on('ready', function () {
          console.log('torrent ready');
        });

        torrent.on('download', function (bytes) {
          // console.log('just downloaded: ' + bytes);
          // console.log('total downloaded: ' + torrent.downloaded);
          // console.log('download speed: ' + torrent.downloadSpeed);
          // console.log('progress: ' + torrent.progress);
        });

        torrent.on('done', function () {
          console.log('torrent download finished');
          torrent.files.forEach(function (file) {

            zipFile.addFile('./torrents/' + file.path, file.name);
            zipFile.outputStream
              .pipe(fs.createWriteStream('./zips/' + file.name + '.zip'))
              .on('close', function () {
                console.log('zipping done');
              });
            zipFile.end();
          });

          client.destroy();
        });
      });

      client.on('error', function (err) {
        console.log('client error occurred');
      });

      res.json({
        status: 'success'
      });

      // var fileType = req.file.mimetype.split('/')[0];
      // FileUpload.create({
      //   file_name: req.file.filename,
      //   file_type: fileType,
      //   file_content_type: req.file.mimetype,
      //   file_size: req.file.size,
      //   file_path: req.file.path
      // }).then(function (fileObj) {
      //   // console.log('here4', fileObj.dataValues);
      //   return res.status(200).json({
      //     file: fileObj.dataValues,
      //     status: 'success',
      //     msg: "File uploaded successfully!"
      //   });
      // });
    } else {
      return res.status(400).json({
        status: 'error',
        msg: "File not uploaded!"
      });
    }
  });
});

router.delete('/:id', function (req, res) {
  FileUpload.findByPk(req.id).then(function (fileObj) {
    console.log(fileObj);
    res.json({
      status: 'success'
    });
  })
});

module.exports = router;
