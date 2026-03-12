const multer = require('multer');
const path   = require('path');
const fs     = require('fs');

// Dossier où les fichiers seront stockés sur le serveur
const UPLOADS_DIR = path.resolve(__dirname, '..', '..', 'uploads');

// On crée le dossier s'il n'existe pas encore
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// "diskStorage" = on stocke les fichiers sur le disque (pas en mémoire)
const storage = multer.diskStorage({

  // Où stocker le fichier
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),

  // Comment nommer le fichier
  // On utilise Date.now() pour garantir un nom unique
  // ex: "1710000000000-ma-photo.jpg"
  filename: (_req, file, cb) => {
    const ext      = path.extname(file.originalname).toLowerCase();
    const baseName = Date.now() + '-' + Math.round(Math.random() * 1e6);
    cb(null, baseName + ext);
  },
});

// Filtre : on n'accepte que les images
function fileFilter(_req, file, cb) {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);   // accepté
  } else {
    cb(new Error('Format non supporté. Utilise JPG, PNG, WEBP ou GIF.'), false);
  }
}

// On exporte le middleware multer configuré
// limits.fileSize = 3MB max
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 3 * 1024 * 1024 },
});

module.exports = { upload };
