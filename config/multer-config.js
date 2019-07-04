var multer  = require('multer');
var slug = require('slug');


var ALLOWED_FILE_TYPES = ['image', 'audio', 'video'];
var ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/gif', 'image/png',
  'image/bmp', 'image/webp'];
var ALLOWED_AUDIO_TYPES = ['audio/mp3', 'audio/mpeg', 'audio/mp4', 'audio/wav', 'audio/ogg'];
var ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];

var MAXIMUM_FILE_NAME_LENGTH = 100;

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // console.log('here1', file);
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    // console.log('here2', file);
    var fileParts = file.originalname.split('.');
    var fileOriginalName = fileParts.slice(0, fileParts.length - 1).join('.');

    var fieldName = file.fieldname.replace(/\W+/g, '-').toLowerCase();
    var fileName = slug(fileOriginalName.toLowerCase().split('').slice(0, MAXIMUM_FILE_NAME_LENGTH).join(''));
    var fileExtension = fileParts[fileParts.length - 1];

    // cb(null, fieldName + '-' + fileName + '-' + Date.now() + '.' + fileExtension);
    cb(null, 'zip-' + Date.now() + '.' + fileExtension);
  }
});

module.exports.storage = storage;

function fileFilter(req, file, cb) {
  // The function should call `cb` with a boolean
  // to indicate if the file should be accepted
  // console.log('here3', file);

  // allow files that are of type mp3, mp4, jpg etc
  var fileType = file && file.mimetype && file.mimetype.split('/')[0];
  if (fileType === 'image' && ALLOWED_IMAGE_TYPES.indexOf(file.mimetype) === -1) {
    cb(null, false);
  } else if (fileType === 'audio' && ALLOWED_AUDIO_TYPES.indexOf(file.mimetype) === -1) {
    cb(null, false);
  } else if (fileType === 'video' && ALLOWED_VIDEO_TYPES.indexOf(file.mimetype) === -1) {
    cb(null, false);
  }

  // To reject this file pass `false`, like so:
  // cb(null, false);

  // To accept the file pass `true`, like so:
  cb(null, true);

  // You can always pass an error if something goes wrong:
  // cb(new Error('I don\'t have a clue!'))
}

module.exports.options = {
  storage: storage,
  limits: {
    files: 1,
    fileSize: 20000000 // 200mb, in bytes
  },
  fileFilter: fileFilter
};
