const http = require("http");
const app = require("./app");

// Fonction pour normaliser le port
const normalizePort = (val) => {
  const port = parseInt(val, 10); // Convertit la valeur du port en entier

  // Vérifie si la valeur n'est pas un nombre
  if (isNaN(port)) {
    return val; // Retourne la valeur originale si ce n'est pas un nombre
  }
  // Vérifie si le port est un nombre positif
  if (port >= 0) {
    return port; // Retourne le port s'il est valide
  }
  return false; // Retourne false si le port n'est pas valide
};

// Définit le port d'écoute, en utilisant soit la variable d'environnement PORT soit 3000 par défaut
const port = normalizePort(process.env.PORT || "3000");
app.set("port", port); // Définit le port dans l'application express

// Gestion des erreurs liées au serveur
const errorHandler = (error) => {
  // Vérifie si l'erreur n'est pas liée à l'écoute du serveur
  if (error.syscall !== "listen") {
    throw error; // Lève l'erreur si elle n'est pas liée à l'écoute
  }
  const address = server.address(); // Récupère l'adresse du serveur
  const bind =
    typeof address === "string" ? "pipe " + address : "port: " + port; // Définit le type d'adresse (pipe ou port)

  // Gère les différents types d'erreurs
  switch (error.code) {
    case "EACCES": // Erreur de permission
      console.error(bind + " requires elevated privileges."); // Affiche un message d'erreur
      process.exit(1); // Quitte le processus
      break;
    case "EADDRINUSE": // Adresse déjà utilisée
      console.error(bind + " is already in use."); // Affiche un message d'erreur
      process.exit(1); // Quitte le processus
      break;
    default:
      throw error; // Lève l'erreur par défaut
  }
};

// Crée un serveur HTTP en utilisant l'application express
const server = http.createServer(app);

// Ajoute un gestionnaire d'événements pour les erreurs
server.on("error", errorHandler);

// Ajoute un gestionnaire d'événements pour l'écoute
server.on("listening", () => {
  const address = server.address(); // Récupère l'adresse du serveur
  const bind = typeof address === "string" ? "pipe " + address : "port " + port; // Définit le type d'adresse (pipe ou port)
  console.log("Listening on " + bind); // Affiche un message indiquant que le serveur est à l'écoute
});

// Démarre le serveur et écoute sur le port spécifié
server.listen(port);
