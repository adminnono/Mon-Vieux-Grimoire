const express = require("express");
const mongoose = require("mongoose");

const path = require("path");

const bookRoute = require("./routes/book");
const userRoute = require("./routes/user");
const dotenv = require("dotenv");
const app = express();
// Change les variables d'environnement
// Charger les variables d'environnement des fichiers `.env` et `.env.local`
dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local" });

const MONGODB_URI_TEMPLATE = process.env.MONGODB_URI_TEMPLATE;
const MONGODB_USER = process.env.MONGODB_USER;
const MONGODB_PASS = process.env.MONGODB_PASS;

const MONGODB_URI = MONGODB_URI_TEMPLATE.replace(
  "{USER}",
  MONGODB_USER
).replace("{PASSWORD}", MONGODB_PASS);
// Connexion à MongoDB via mongoose avec l'URI de connexion

mongoose
  .connect(
    MONGODB_URI,
    { useNewUrlParser: true, useUnifiedTopology: true } // Options pour une connexion plus stable
  )
  .then(() => console.log("Connexion à MongoDB réussi !")) // Confirme la réussite de la connexion
  .catch(() => console.log("Connexion à MongoDB échoué !")); // Affiche un message en cas d'échec de connexion

// Configuration des en-têtes pour autoriser toutes les requêtes (CORS)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Autorise toutes les origines
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization" // Autorise les en-têtes spécifiques
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS" // Autorise les méthodes HTTP spécifiques
  );
  next(); // Passe au middleware suivant
});

// Middleware pour analyser les données JSON dans le corps des requêtes
app.use(express.json());

// Gestion des routes et des fichiers statiques
app.use("/images", express.static(path.join(__dirname, "images"))); // Définit le dossier 'images' comme dossier statique pour les images
app.use("/api/books", bookRoute); // Route pour les opérations sur les livres
app.use("/api/auth", userRoute); // Route pour les opérations d'authentification

module.exports = app;
