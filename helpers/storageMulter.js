const multer = require("multer");

module.exports = () => {
  // diskStorage engine để control storing file the disk.
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // multer mặc định đứng từ file cao nhất.
      cb(null, "./public/uploads/");
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now();
      // trong originalname bao gồm luôn định dạng file.
      cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
  });

  return storage;
};
