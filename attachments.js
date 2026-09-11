const router = require('express').Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const crypto = require('crypto');
const controller = require('../controllers/requisitionController');
const { auth, role } = require('../middleware/auth');

const dir = process.env.UPLOAD_DIR || 'uploads';
fs.mkdirSync(path.resolve(dir), { recursive: true });
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, dir),
  filename: (req, file, cb) => cb(null, crypto.randomUUID() + path.extname(file.originalname))
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['application/pdf', 'image/png', 'image/jpeg'];
    cb(null, allowed.includes(file.mimetype));
  }
});

router.post('/:id', auth, role('empleado'), upload.array('attachments', 5), controller.addAttachments);
module.exports = router;
