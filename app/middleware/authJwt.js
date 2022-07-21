const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;

// verify if the token is valid or not using the secret key from the config file and the token provided by the user in the request header (Authorization) and return the user if the token is valid
// Verifie si le token est valide ou non en utilisant la clé secrète de la configuration et le token fourni par l'utilisateur dans l'en-tête de la requête (Authorization) et retourne l'utilisateur si le token est valide
verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(403).send({ message: "Pas de token donnée !" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }
    req.userId = decoded.id;
    next();
  });
};
// verify if the user is admin or not
// Vérifie si l'utilisateur est admin ou non
isAdmin = async (req, res, next) => {
  try {
    // find the user by the id in the request
    // Trouve l'utilisateur par l'id dans la requête
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        return next();
      }
    }
    // if the user is not admin, return an error
    // Si l'utilisateur n'est pas admin, retourne une erreur
    return res.status(403).send({
      message: "Require Admin Role!",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Unable to validate User role!",
    });
  }
};

const authJwt = {
  verifyToken,
  isAdmin,
};
module.exports = authJwt;