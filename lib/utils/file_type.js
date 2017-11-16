const imageFilter = function (req, file, cb) {
  // accept image only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

const videoFilter = function (req, file, cb) {
  // accept video only
  if (!file.originalname.match(/\.(mkv|mp4|webm|flv|mpg|3gp)$/i)) {
    return cb(new Error('Only video files are allowed!'), false);
  }
  cb(null, true);
};

module.exports = { imageFilter, videoFilter };
