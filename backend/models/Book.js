const mongoose = require("mongoose");

// Définition du schéma de notation (ratingSchema) pour les notes attribuées aux livres
const ratingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Stocke l'ID de l'utilisateur qui a noté le livre
    ref: "User", // Référence au modèle 'User' pour établir une relation entre les utilisateurs et leurs notes
  },
  grade: { type: Number, required: true }, // Note attribuée au livre, obligatoire
});

// Définition du schéma principal pour les livres (BookSchema)
const BookSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Stocke l'ID de l'utilisateur qui a ajouté le livre
    ref: "User", // Référence au modèle 'User' pour savoir qui a ajouté le livre
    required: true, // Champ obligatoire
  },
  title: { type: String, required: true }, // Titre du livre, obligatoire
  author: { type: String, required: true }, // Auteur du livre, obligatoire
  imageUrl: { type: String, required: true }, // URL de l'image du livre, obligatoire
  year: { type: Number, required: true }, // Année de publication du livre, obligatoire
  genre: { type: String, required: true }, // Genre du livre, obligatoire
  ratings: {
    type: [ratingSchema], // Tableau de notes, chaque note suit le format défini dans ratingSchema
    default: [], // Par défaut, il est vide (pas de notes initiales)
  },
  averageRating: { type: Number, default: 0 }, // Note moyenne du livre, initialisée à 0
});

// Exporte le modèle 'Book' basé sur le schéma BookSchema pour interagir avec la collection "books" de MongoDB
module.exports = mongoose.model("Book", BookSchema);
