const jwt = require("jsonwebtoken");

// Middleware d'authentification pour sécuriser les routes
module.exports = (req, res, next) => {
  try {
    // Récupère le token d'authentification depuis l'en-tête "Authorization" de la requête
    const token = req.headers.authorization.split(" ")[1];

    // Vérifie le token avec la clé secrète 'RANDOM_TOKEN_SECRET'
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");

    // Extrait l'ID utilisateur contenu dans le token déchiffré
    const userId = decodedToken.userId;

    // Ajoute l'ID utilisateur à l'objet de requête pour une utilisation ultérieure dans les contrôleurs
    req.auth = { userId: userId };

    // Passe au middleware suivant ou au contrôleur
    next();
  } catch (error) {
    // En cas d'erreur (token invalide ou non fourni), renvoie un statut 401 (non autorisé)
    res.status(401).json({ error });
  }
};
