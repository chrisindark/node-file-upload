var zipUploadFn = function (sequelize, DataTypes) {
  var ZipUpload = sequelize.define('ZipUpload', {
    file_name: DataTypes.STRING,
    file_path: DataTypes.STRING,
    // file_uploads_id: {
    //   type: DataTypes.INTEGER,
    //   references: 'FileUploads', // <<< Note, its table's name, not object name
    //   referencesKey: 'id' // <<< Note, its a column name
    // }
  }, {});
  ZipUpload.associate = function(models) {
    // associations can be defined here
    models.ZipUpload.belongsTo(models.FileUpload);
  };
  return ZipUpload;
};

module.exports = zipUploadFn;
