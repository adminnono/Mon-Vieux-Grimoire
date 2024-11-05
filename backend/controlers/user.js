const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

// Fonction pour créer un compte utilisateur
exports.signup = (req, res, next) => {
  // Hachage du mot de passe fourni avec un coût de salage de 10
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      // Crée un nouvel utilisateur avec l'email et le mot de passe haché
      const user = new User({
        email: req.body.email, // Récupère l'email fourni dans la requête
        password: hash, // Stocke le mot de passe haché au lieu du mot de passe brut
      });

      // Sauvegarde le nouvel utilisateur dans la base de données
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" })) // Succès : utilisateur créé
        .catch((error) => res.status(400).json({ error })); // Erreur : problème de sauvegarde
    })
    .catch((error) => res.status(500).json({ error })); // Erreur serveur en cas d'échec du hachage
};

// Fonction pour connecter un utilisateur existant
exports.login = (req, res, next) => {
  // Cherche un utilisateur dans la base de données avec l'email fourni
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        // Si aucun utilisateur n'est trouvé
        res
          .status(401)
          .json({ message: "Identifiant/mot de passe incorrect !" }); // Erreur d'authentification
      } else {
        // Compare le mot de passe fourni avec le mot de passe haché stocké
        bcrypt
          .compare(req.body.password, user.password)
          .then((valid) => {
            if (!valid) {
              // Si le mot de passe est incorrect
              res
                .status(401)
                .json({ message: "Identifiant/mot de passe incorrect !" }); // Erreur d'authentification
            } else {
              // Génère un token JWT contenant l'ID de l'utilisateur
              res.status(200).json({
                userId: user._id, // ID de l'utilisateur pour le suivi
                token: jwt.sign(
                  // Crée un token avec une clé secrète et une durée d'expiration
                  { userId: user._id },
                  "RANDOM_TOKEN_SECRET", // Clé secrète utilisée pour signer le token
                  { expiresIn: "24h" } // Durée de validité du token (24 heures)
                ),
              });
            }
          })
          .catch((error) => res.status(500).json({ error })); // Erreur serveur si la comparaison échoue
      }
    })
    .catch((error) => res.status(500).json({ error })); // Erreur serveur si la recherche échoue
};
