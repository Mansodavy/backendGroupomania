const db = require("../models");
const config = require("../config/auth.config");
const Op = db.Sequelize.Op;
const User = db.user;
const Role = db.role;
const multer = require("multer");
const { user } = require("../models");
const fs = require("fs");

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

exports.editimage = async (req, res) => {
  try {
  const profile = req.file
    ? {
        imageUrl: `${req.protocol}://${req.get('host')}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  if (profile.imageUrl) {
    const user = await User.findOne({ where: { id: req.userId } });
    const ancienneimage = user.imageUrl.split('/images/')[1];
    fs.unlink(`images/${ancienneimage}`, (err) => {
      if (err) {
        console.log(err);
      }
    }
    );
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