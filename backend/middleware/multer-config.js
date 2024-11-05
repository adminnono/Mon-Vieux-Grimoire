const multer = require("multer"); // Importe multer pour gérer le téléchargement de fichiers
const sharp = require("sharp"); // Importe sharp pour la manipulation et la compression d'images
const fs = require("fs"); // Importe le module fs pour gérer le système de fichiers
const path = require("path"); // Importe path pour travailler avec les chemins de fichiers

// Dictionnaire MIME_TYPES : Associe les types MIME d'images aux extensions correspondantes
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

// Configuration de multer pour stocker les fichiers en mémoire temporairement
const storage = multer.memoryStorage(); // Stockage en mémoire pour un traitement rapide de l'image

// Filtrage des fichiers selon leur type MIME pour autoriser seulement jpg et png
const fileFilter = (req, file, callback) => {
  const isValid = MIME_TYPES[file.mimetype]; // Vérifie si le type MIME est supporté
  if (isValid) {
    callback(null, true); // Accepte le fichier
  } else {
    callback(new Error("Type de fichier non pris en charge."), false); // Rejette le fichier si non supporté
  }
};

// Configuration de multer avec des restrictions sur la taille et le type de fichier
const upload = multer({
  storage: storage, // Utilise le stockage en mémoire
  limits: {
    fileSize: 4 * 1024 * 1024, // Limite la taille des fichiers à 4 Mo
  },
  fileFilter: fileFilter, // Utilise le filtre défini plus haut
}).single("image"); // Accepte uniquement un fichier avec le champ "image"

// Middleware pour compresser les images en format WebP
const compressImage = (req, res, next) => {
  if (!req.file) {
    return next(); // Si aucun fichier n'est envoyé, passe au middleware suivant
  }

  // Génère un nom unique pour le fichier en utilisant le timestamp et remplace les espaces
  const name = req.file.originalname.split(" ").join("_");
  const extension = MIME_TYPES[req.file.mimetype] || "jpg"; // Récupère l'extension correspondante
  const webpFilename =
    Date.now() + "_" + name.replace(/\.(jpg|jpeg|png)$/, ".webp"); // Remplace l'extension par ".webp"

  // Définit le répertoire où les images compressées seront stockées
  const imagesDir = path.join(__dirname, "../images");

  // Crée le répertoire s'il n'existe pas déjà
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  // Définit le chemin complet du fichier WebP
  const webpFilePath = path.join(imagesDir, webpFilename);

  // Utilise sharp pour redimensionner et convertir l'image en WebP
  sharp(req.file.buffer)
    .resize({ fit: "cover", height: 250, width: 250 }) // Redimensionne l'image à 250x250 pixels
    .webp({ quality: 85 }) // Définit la qualité de compression à 85 pour le format WebP
    .toFile(webpFilePath) // Sauvegarde le fichier compressé
    .then(() => {
      // Mise à jour des propriétés de l'image pour la requête
      req.file.path = webpFilePath; // Définit le chemin du fichier compressé
      req.file.filename = webpFilename; // Définit le nom du fichier compressé
      next(); // Passe au middleware suivant
    })
    .catch((err) => {
      console.error("Erreur lors de la conversion en WebP :", err); // Log l'erreur en cas d'échec
      next(err); // Passe l'erreur au middleware suivant
    });
};

// Middleware pour gérer les erreurs lors du téléchargement de l'image
const uploadImage = (req, res, next) => {
  upload(req, res, function (err) {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        // Erreur si la taille du fichier dépasse la limite définie
        return res.status(400).json({
          message: "La taille du fichier est trop importante (4 Mo maximum).",
        });
      } else if (err.message === "Type de fichier non pris en charge.") {
        // Erreur si le type MIME du fichier n'est pas supporté
        return res.status(400).json({ message: err.message });
      } else {
        // Autres erreurs de téléchargement
        return res.status(400).json({ message: err.message });
      }
    }
    next(); // Passe au middleware suivant si aucun problème n'est survenu
  });
};

// Exporte les fonctions uploadImage et compressImage pour les utiliser dans d'autres parties de l'application
module.exports = {
  uploadImage,
  compressImage,
};
