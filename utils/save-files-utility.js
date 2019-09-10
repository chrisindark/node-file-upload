var fs = require('fs');
var slug = require('slug');
var yazl = require('yazl');
var multerConfig = require('../config/multer-config');

var zipFile = new yazl.ZipFile();

var renameFile = function (req, file, cb, fileType) {
  var fileParts;
  if (file.originalname) {
    fileParts = file.originalname.split('.');
  } else {
    fileParts = file.name.split('.');
  }
  var fileOriginalName = fileParts.length > 1 ? fileParts.slice(0, fileParts.length - 1).join('.') : fileParts[0];

  var fieldName;
  if (file.fieldname) {
    fieldName = file.fieldname.replace(/\W+/g, '-').toLowerCase();
  } else {
    fieldName = 'file';
  }
  var fileName = slug(fileOriginalName.toLowerCase().split('').slice(0, multerConfig.MAXIMUM_FILE_NAME_LENGTH).join(''));
  var fileExtension = fileType ? fileType : fileParts[fileParts.length - 1];

  var finalFileName = fieldName + '-' + fileName + '-' + Date.now() + '.' + fileExtension;

  if (typeof cb === 'function') {
    cb(null, finalFileName);
  }

  return finalFileName;
};

var saveFileToUploads = function () {};

var saveFileToTorrents = function () {};

var saveFileToZips = function () {};

var createFolder = function (dir) {
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }
};

module.exports = {
  renameFile: renameFile,
  createFolder: createFolder
};
