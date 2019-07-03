var multer = require('multer');
var multerS3 = require('multer-s3');
var fs = require('fs');
var AWS = require('aws-sdk');


AWS.config.loadFromPath(require('../config/aws-config'));
var s3 = new AWS.S3();

//Create bucket. Note: bucket name must be unique.
//Requires only bucketName via post
//check [http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#createBucket-property](http://) for more info
exports.createBucket = function (req, res) {
  var item = req.body;
  var params = { Bucket: item.bucketName };
  s3.createBucket(params, function (err, data) {
    if (err) {
      return res.send({ "error": err });
    }
    res.send({ dataL: data });
  });
};

//List all buckets owned by the authenticate sender of the request. Note: bucket name must be unique.
//check http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#listBuckets-property for more info
exports.listBuckets = function (req, res) {
  s3.listBuckets({}, function (err, data) {
    if (err) {
      return res.send({ "error": err });
    }
    res.send({ data: data });
  });
};

//Delete bucket.
//Require bucketName via delete
//check http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#deleteBucket-property for more info
exports.deleteBucket = function (req, res) {
  var item = req.body;
  var params = { Bucket: item.bucketName };
  s3.deleteBucket(params, function (err, data) {
    if (err) {
      return res.send({ "error": err });
    }
    res.send({ data: data });
  });
};

//Delete bucket cors configuration.
// Requires bucketName via delete
//check http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#deleteBucketCors-property for more info
exports.deleteBucketCors = function (req, res) {
  var item = req.body;
  var params = { Bucket: item.bucketName };
  s3.deleteBucketCors(params, function (err, data) {
    if (err) {
      return res.send({ "error": err });
    }
    res.send({ data: data });
  });
};

//Retrieves objects from Amazon s3
//check http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getObject-property to configure params properties
//eg var params = {Bucket: 'bucketname', Key:'keyname'}
exports.getObjects = function (req, res) {
  var item = req.body;
  var params = { Bucket: req.params.bucketName };
  s3.getObject(params, function (err, data) {
    if (err) {
      return res.send({ "error": err });
    }
    res.send({ data: data });
  });
};

//Delete qn object
//check http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#deleteObject-property for more info
exports.deleteObject = function (req, res) {
  var item = req.body;
  var params = { Bucket: item.bucketName, Key: item.key };
  s3.deleteObjects(params, function (err, data) {
    if (err) {
      return res.send({ "error": err });
    }
    res.send({ data: data });
  });
};

//cloud image uploader using multer-s3
//Pass the bucket name to the bucketName param to upload the file to the bucket
exports.uploadFile = function (req, res) {
  var item = req.body;
  var upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: item.bucketName,
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
      key: function (req, file, cb) {
        cb(null, Date.now().toString())
      }
    })
  })
};
