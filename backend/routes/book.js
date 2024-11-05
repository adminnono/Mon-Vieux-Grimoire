const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

const bookCtrl = require("../controlers/book");

// Route pour récupérer tous les livres
router.get("/", bookCtrl.readBook);

// Route pour récupérer les 3 livres avec les meilleures notes
router.get("/bestrating", bookCtrl.bestRating);

// Route pour ajouter un nouveau livre
router.post(
  "/",
  auth,
  multer.uploadImage,
  multer.compressImage,
  bookCtrl.createBook
);

// Route pour récupérer un livre spécifique par son ID
router.get("/:id", bookCtrl.selectBook);

// Route pour mettre à jour un livre spécifique par son ID
router.put(
  "/:id",
  auth,
  multer.uploadImage,
  multer.compressImage,
  bookCtrl.updateBook
);

// Route pour supprimer un livre spécifique par son ID
// Nécessite l'authentification pour vérifier si l'utilisateur est autorisé à supprimer
router.delete("/:id", auth, bookCtrl.deleteBook);

// Route pour ajouter une note à un livre spécifique par son ID
// Nécessite l'authentification pour s'assurer que seul un utilisateur autorisé peut noter
router.post("/:id/rating", auth, bookCtrl.ratingBook);

module.exports = router;
