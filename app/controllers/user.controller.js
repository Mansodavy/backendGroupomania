const db = require("../models");
const config = require("../config/auth.config");
const Op = db.Sequelize.Op;
const User = db.user;
const Role = db.role;
const multer = require("multer");
const { user } = require("../models");
const fs = require("fs");

// get one user by id from the database
// Trouver un utilisateur par son id dans la base de données
exports.getOneUser = (req, res) => {
  User.findOne({
    where: {
      id: req.userId,
    },
    attributes: ["id"],
    include: [
      {
        model: db.role,
        attributes: ["id", "name"],
        through: {
          attributes: [],
        },
      },
    ],
  })
    .then((user) => {
      if (user) {
        res.status(200).send(user);
      } else {
        res.status(404).send({ message: "Utilisateur introuvable" });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

// Edit user profile in the database by id
// Modifier le profil d'un utilisateur dans la base de données grace a son id 
exports.editprofil = (req, res) => {
  User.update(
    {
      nom: req.body.nom,
      prenom: req.body.prenom,
    },
    
    {
      where: {
        id: req.userId
      },
    }
  )
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Une erreur s'est produite lors de la récupération des utilisateurs.",
      });
    });
};

// Delete user profile in the database by id
// Supprimer le profil d'un utilisateur dans la base de données grace a son id

exports.deleteUser = (req, res) => {
  console.log(req);
  User.destroy({
    where: {
      id: req.userId,
    },
  })
    .then((data) => {
      res.status(200).json({ message: "Utilisateur supprimé" });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Une erreur s'est produite lors de la récupération des utilisateurs.",
      });
    });
};

// EditImage user profile in the database by id
// Modifier l'image de profil d'un utilisateur dans la base de données grace a son id
exports.editimage = async (req, res) => {
  try {
    // Check if file is present
    // Vérifie si le fichier est présent
  const profile = req.file
    ? {
        imageUrl: `${req.protocol}://${req.get('host')}/images/${
          req.file.filename
        }`,
      }
      // If no file is present, keep the old image
      // Si aucun fichier n'est présent, garde l'ancienne image
    : { ...req.body };
  // Verify if have image
  // Vérifie si l'utilisateur a une image
  if (profile.imageUrl) {
    const user = await User.findOne({ where: { id: req.userId } });
    // delete old image
    // Supprime l'ancienne image
    const ancienneimage = user.imageUrl.split('/images/')[1];
    fs.unlinkSync(`images/${ancienneimage}`);
  }
  const user = await User.update(profile, {
    where: { id: req.userId },
  });
  if (!user) {
    res.status(404).send();
  }
  res.status(200).json({ message: 'Image de profile modifiée' });
} catch (e) {
  res.status(500).send(e);
}
};