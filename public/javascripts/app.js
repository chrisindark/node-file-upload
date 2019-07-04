(function () {
  var getAllFiles = function () {
    var allFilesUrl = '/api/files';
    $.ajax({
      url: allFilesUrl,
      method: 'GET',
      success: function (res) {
        console.log('get files', res);
      },
      error: function (err) {
        console.log('get files error', err);
      }
    });
  };

  var postFile = function () {
    var fileElem = $('#file');
    var fileSubmitForm = $('#file-submit-form');
    var fileSubmit = $('#file-submit');

    fileSubmitForm.on('submit', function (e) {
      e.preventDefault();

      if (!fileElem[0].files[0]) {
        return;
      }

      var formData = new FormData();
      formData.append('file', fileElem[0].files[0]);

      var postFileUrl = '/api/files';
      $.ajax({
        url: postFileUrl,
        type: 'POST',
        data: formData,
        async: false,
        success: function (data) {
          console.log('post file', data);
        },
        error: function (err) {
          console.log('post file error', err);
        },
        cache: false,
        contentType: false,
        processData: false
      });
    });
  };

  var postTorrent = function () {
    var fileElem = $('#torrent');
    var fileSubmitForm = $('#torrent-submit-form');
    var fileSubmit = $('#torrent-submit');

    fileSubmitForm.on('submit', function (e) {
      e.preventDefault();

      if (!fileElem[0].files[0]) {
        return;
      }

      var formData = new FormData();
      formData.append('file', fileElem[0].files[0]);

      var postFileUrl = '/api/files';
      $.ajax({
        url: postFileUrl,
        type: 'POST',
        data: formData,
        async: false,
        success: function (data) {
          console.log('post file', data);
        },
        error: function (err) {
          console.log('post file error', err);
        },
        cache: false,
        contentType: false,
        processData: false
      });
    });
  };

  $(document).ready(function () {
    getAllFiles();
    postFile();
  });

})();
