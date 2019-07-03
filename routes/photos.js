var express = require('express');
var router = express.Router();
var multer  = require('multer');
var multerStorage = require('../config/multer-config');


router.get('/', function(req, res) { });
router.post('/', multer({
  storage: multerStorage,
  // dest: './uploads/',
  // rename: function(field, filename) {
  //   filename = filename.replace(/\W+/g, '-').toLowerCase();
  //   return filename + '_' + Date.now();
  // },
  limits: {
    files: 1,
    fileSize: 200 * 1024 * 1024 // 200mb, in bytes
  }
}).array(), validatePhoto, function(req, res) {
  console.log();
  console.log(req.files);
  console.log();
  // The file does not exist, something bad happened
  if (!req.files.photo) {
    res.statusCode = 400;
    return res.json({
      errors: ['File failed to upload']
    });
  }
  // The file was determined to be too large
  if (req.files.photo.truncated) {
    res.statusCode = 400;
    return res.json({
      errors: ['File too large']
    });
  }

  var sql = 'INSERT INTO photo (description, filepath, album_id) VALUES ($1,$2,$3) RETURNING id';
  // Retrieve the data to insert from the POST body
  var data = [
    req.body.description,
    req.files.photo.path,
    req.body.album_id
  ];
  postgres.client.query(sql, data, function(err, result) {
    if (err) {
      // We shield our clients from internal errors, but log them
      console.error(err);
      res.statusCode = 500;
      return res.json({
        errors: ['Failed to create photo']
      });
    }

    var newPhotoId = result.rows[0].id;
    var sql = 'SELECT * FROM photo WHERE id = $1';
    postgres.client.query(sql, [newPhotoId], function (err, result) {
      if (err) {
        // We shield our clients from internal errors, but log them
        console.error(err);
        res.statusCode = 500;
        return res.json({
          errors: ['Could not retrieve photo after create']
        });
      }
      // The request created a new resource object
      res.statusCode = 201;
      // The result of CREATE should be the same as GET
      res.json(result.rows[0]);
    });
  });
});

router.get('/:id[0-9]+', lookupPhoto, function(req, res) {
  res.json(req.photo);
});
router.patch('/:id[0-9]+', lookupPhoto, function(req, res) { });
router.delete('/:id[0-9]+', lookupPhoto, function(req, res) { });

function lookupPhoto(req, res, next) {
  // We access the ID param on the request object
  var photoId = req.params.id;
  // Build an SQL query to select the resource object by ID
  var sql = 'SELECT * FROM photo WHERE id = ?';
  postgres.client.query(sql, [ photoId ], function(err, results) {
    if (err) {
      console.error(err);
      res.statusCode = 500;
      return res.json({ errors: ['Could not retrieve photo'] });
    }
    // No results returned mean the object is not found
    if (results.rows.length === 0) {
      // We are able to set the HTTP status code on the res object
      res.statusCode = 404;
      return res.json({ errors: ['Photo not found'] });
    }
    // By attaching a Photo property to the request
    // Its data is now made available in our handler function
    req.photo = results.rows[0];
    next();
  });
}

function validatePhoto(req, res, next) {
  req.checkBody('description', 'Invalid description').notEmpty();
  req.checkBody('album_id', 'Invalid album_id').isNumeric();
  var errors = req.validationErrors();
  if (errors) {
    var response = { errors: [] };
    errors.forEach(function(err) {
      response.errors.push(err.msg);
    });
    res.statusCode = 400;
    return res.json(response);
  }
  return next();
}

module.exports = router;
