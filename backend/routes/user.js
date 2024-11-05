const express = require("express");
const router = express.Router();

const userCtrl = require("../controlers/user");

// Route pour créer un nouveau compte utilisateur
router.post("/signup", userCtrl.signup);

// Route pour connecter un utilisateur existant
router.post("/login", userCtrl.login);

module.exports = router;
