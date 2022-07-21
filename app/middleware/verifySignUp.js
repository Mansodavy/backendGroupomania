const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

// check if email is already used by another user in the database
// Verifie si l'email est déjà utilisé par un autre utilisateur dans la base de données
checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    // Email
    user = await User.findOne({
      where: {
        email: req.body.email
      }
    });
    // Email exists already in the database
    // L'email existe déjà dans la base de données
    if (user) {
      return res.status(400).send({
        message: "Échec ! L'email est déjà utilisé !"
      });
    }

    next();
  } catch (error) {
    return res.status(500).send({
      message: error.message
    });
  }
};
// check if role exists
// Vérifie si le rôle existe
checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: "Échec ! Le rôle n'existe pas = " + req.body.roles[i]
        });
        return;
      }
    }
  }
  
  next();
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted
};

module.exports = verifySignUp;