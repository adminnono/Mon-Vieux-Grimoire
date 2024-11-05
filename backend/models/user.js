const mongoose = require("mongoose"); // Importe mongoose pour gérer les interactions avec la base de données MongoDB

const uniqueValidator = require("mongoose-unique-validator"); // Importe mongoose-unique-validator pour garantir l'unicité des champs

// Définition du schéma utilisateur (userSchema)
const userSchema = mongoose.Schema({
  email: {
    type: String, // Définit le champ email comme une chaîne de caractères
    required: true, // Rend le champ obligatoire
    unique: true, // Garantit l'unicité de l'email dans la base de données (aucun email dupliqué)
  },
  password: {
    type: String, // Définit le champ password comme une chaîne de caractères
    required: true, // Rend le champ obligatoire
  },
});

// Application du plugin uniqueValidator au schéma utilisateur
// Ce plugin ajoute une validation d'unicité pour les champs marqués comme uniques dans le schéma (ici, 'email')
userSchema.plugin(uniqueValidator);

// Exporte le modèle 'User' basé sur userSchema pour interagir avec la collection "users" dans MongoDB
module.exports = mongoose.model("User", userSchema);
