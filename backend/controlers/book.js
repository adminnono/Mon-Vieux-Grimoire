const { error } = require("console");
const Book = require("../models/Book");
const fs = require("fs");

// Fonction pour créer un livre nouveau
exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book); // Parse les données du livre envoyées dans la requête
  delete bookObject._id; // Supprime le champ '_id' pour éviter les conflits
  delete bookObject._userId; // Supprime '_userId' pour éviter les modifications non autorisées

  // Crée une nouvelle instance de Book avec les données reçues et l'URL de l'image
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId, // Attribue l'utilisateur actuel comme propriétaire
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`, // Chemin de l'image
  });

  // Sauvegarde le livre dans la base de données
  book
    .save()
    .then(() => res.status(201).json({ message: "Objet enregistré !" })) // Envoi une réponse de succès
    .catch((error) => res.status(400).json({ error })); // En cas d'erreur, envoie une réponse d'échec
};

// Fonction pour mettre à jour un livre existant
exports.updateBook = (req, res, next) => {
  // Si un fichier est joint, parse les nouvelles données avec l'image; sinon, utilise req.body
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  delete bookObject._userId; // Empêche la modification de l'ID utilisateur

  // Cherche le livre par ID et vérifie l'authenticité de l'utilisateur
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        // Vérifie si l'utilisateur est le propriétaire
        res.status(401).json({ message: "Non-autorisé" }); // Erreur de permission
      } else {
        // Met à jour le livre si l'utilisateur est autorisé
        Book.updateOne(
          { _id: req.params.id },
          { ...bookObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Objet modifié !" })) // Succès
          .catch((error) => res.status(401).json({ error })); // Échec de la mise à jour
      }
    })
    .catch((error) => res.status(400).json({ error })); // Erreur si le livre n'est pas trouvé
};

// Fonction pour supprimer un livre
exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        // Vérifie si l'utilisateur est le propriétaire
        res.status(401).json({ message: "Non-autorisé" }); // Erreur de permission
      } else {
        // Récupère le nom de fichier de l'image et la supprime
        const filename = book.imageUrl.split("/images/")[1];
        fs.unlink(`image/${filename}`, () => {
          // Supprime le livre de la base de données
          Book.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: "Objet supprimé !" })) // Succès
            .catch((error) => res.status(401).json({ error })); // Échec de suppression
        });
      }
    })
    .catch((error) => res.status(500).json({ error })); // Erreur serveur
};

// Fonction pour lire les informations d'un livre spécifique
exports.selectBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book)) // Envoie les données du livre trouvé
    .catch((error) => res.status(404).json({ error })); // Erreur si le livre n'est pas trouvé
};

// Fonction pour lire tous les livres
exports.readBook = (req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json(books)) // Envoie tous les livres trouvés
    .catch((error) => res.status(400).json({ error })); // Échec de la requête
};

// Fonction pour noter un livre
exports.ratingBook = (req, res, next) => {
  const userId = req.auth.userId; // Récupère l'ID de l'utilisateur
  const rating = req.body.rating; // Note envoyée par l'utilisateur

  // Cherche le livre par son ID
  Book.findById({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        res.status(404).json({ error: "Livre non trouvé !" }); // Erreur si le livre n'est pas trouvé
      }

      // Ajoute la note et calcule la moyenne
      book.ratings.push({ userId, grade: rating });
      const totalRatings = book.ratings.length;
      const sumRatings = book.ratings.reduce((sum, r) => sum + r.grade, 0);
      book.averageRating = (sumRatings / totalRatings).toFixed(1); // Met à jour la moyenne des notes

      // Sauvegarde les modifications
      book
        .save()
        .then((book) => res.status(201).json(book)) // Succès avec le livre mis à jour
        .catch((error) => res.status(400).json({ error })); // Erreur de sauvegarde
    })
    .catch((error) => res.status(400).json({ error })); // Erreur si le livre n'est pas trouvé
};

// Fonction pour obtenir les trois livres les mieux notés
exports.bestRating = (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 }) // Trie par note moyenne décroissante
    .limit(3) // Limite aux trois premiers livres
    .then((bestBooks) => {
      if (!bestBooks) {
        res.status(400).json({ error: "Requête impossible !" }); // Erreur si la requête échoue
      }
      res.status(200).json(bestBooks); // Envoie les trois livres les mieux notés
    });
};
