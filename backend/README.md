## Créateur du Projet

Ce projet a été développé par **adminnono**.

## Instructions pour Lancer le Projet

### 1. Installation des Packages

Assurez-vous d'installer les dépendances suivantes :

- **nodemon**
- **express**
- **mongoose**
- **bcrypt**
- **jsonwebtoken**
- **multer**
- **sharp**

### 2. Démarrage du Projet

Après avoir installé tous les packages, naviguez vers le dossier **Backend** et exécutez les commandes suivantes pour démarrer le projet :

- **cd Backend**
- **npm run dev**

Après avoir effectué ces commandes, votre Backend devrait écouter sur le port 3000 et être connecté à MongoDB !

Après dans un autre terminal Bash, lancer le Frontend et se mettre sur le port 3001 :

- **cd Frontend**
- **npm start**

Bravo ! Vous avez réussi à lancer le projet !

### 2. Création du Fichier d'Environnement Local

1. Créez un fichier `.env.local` à la racine de votre projet avec votre identifiant et mot de passe MongoDB :

   ```plaintext
   MONGODB_USER=votre_nom_utilisateur
   MONGODB_PASS=votre_mot_de_passe
   ```

2. Assurez-vous d'ajouter `.env.local` à votre fichier `.gitignore` pour éviter de commettre des informations sensibles :
   ```plaintext
   # .gitignore
   .env.local
   ```

> **Note :** Le fichier `.env` avec les autres configurations est déjà poussé dans le dépôt, vous n'avez donc pas besoin de le créer.
