var fileUploadFn = function (sequelize, DataTypes) {
  var FileUpload = sequelize.define('FileUpload', {
    file_name: DataTypes.STRING,
    file_type: DataTypes.STRING,
    file_content_type: DataTypes.STRING,
    file_size: DataTypes.INTEGER,
    file_path: DataTypes.STRING
  }, {});
  FileUpload.associate = function(models) {
    // associations can be defined here
  };
  return FileUpload;
};

module.exports = fileUploadFn;
