// import des models et autres prérequis pour le controller
// import the models and other prerequisites for the controller
const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// inscription d'un utilisateur dans la base de données
// register a user in the database
exports.signup = async (req, res) => {
console.log(req.body)
  // Save User to Database
  try {
    const user = await User.create({
      nom: req.body.nom,
      prenom: req.body.prenom,
      email: req.body.email,
      // Use Bcrypt to hash password
      // Utilisation de bcrypt pour hasher le mot de passe
      password: bcrypt.hashSync(req.body.password, 8),
      // Ajout de l'image de profil par défaut
      // Add the default profile picture
      imageUrl: req.body.imageUrl,
    });

    // Add role to user
    // Ajout du role à l'utilisateur
    if (req.body.roles) {
      const roles = await Role.findAll({
        where: {
          name: {
            [Op.or]: req.body.roles,
          },
        },
      });
      
      const result = user.setRoles(roles);
      if (result) res.send({ message: "Utilisateur enregistré avec succès" });
    } else {
      const result = user.setRoles([1]);
      if (result) res.send({ message: "L'utilisateur s'est enregistré avec succès !" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
// Connexion d'un utilisateur 
// Login a user
exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    // Check if user exists
    // Vérifie si l'utilisateur existe
    if (!user) {
      return res.status(404).send({ message: "Utilisateur introuvable." });
    }
    // Check if password is correct with bcrypt
    // Vérifie si le mot de passe est correct avec bcrypt
    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    // If password is valid, create a token if is not valid send error
    // Si le mot de passe est valide, créer un token if is not valid send error
    if (!passwordIsValid) {
      return res.status(401).send({
        message: "Mot de passe invalid !",
      });
    }

    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400, // 24 hours
    });
    // If user is found and password is valid, return user and token
    // Si l'utilisateur est trouvé et le mot de passe est valide, retourne l'utilisateur et le token
    let authorities = [];
    const roles = await user.getRoles();
    for (let i = 0; i < roles.length; i++) {
      authorities.push("ROLE_" + roles[i].name.toUpperCase());
    }

    req.session.token = token;
    return res.status(200).send({
      id: user.id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      roles: authorities,
      token: token,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};
// Déconnexion d'un utilisateur
// Logout a user
exports.signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({
      message: "Vous avez été déconnecté !",
    });
  } catch (err) {
    this.next(err);
  }
};
