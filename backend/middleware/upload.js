const path = require('path');
const multer = require('multer');
const constants = require('../config/constants');
const { ApiError } = require('../utils/helpers');

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../uploads'),
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^\w.\-]+/g, '_');
    cb(null, `${Date.now()}-${safe}`);
  }
});

function fileFilter(_req, file, cb) {
  const ext = path.extname(file.originalname).replace('.', '').toLowerCase();
  if (!constants.allowedExtensions.includes(ext)) {
    return cb(new ApiError(400, `Only ${constants.allowedExtensions.join(', ').toUpperCase()} files are allowed.`));
  }
  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: constants.fileSizeLimitMB * 1024 * 1024 }
});

module.exports = { upload };
