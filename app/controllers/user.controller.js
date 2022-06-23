const db = require("../models");
const config = require("../config/auth.config");
const Op = db.Sequelize.Op;
const User = db.user;
const Role = db.role;

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.getOneUser = (req, res) => {
  User.findOne({
    where: {
      id: req.params.id,
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
        res.status(404).send({ message: "User not found" });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.getUser = (req, res) => {
  User.findAll({
    attributes: ["id", "nom", "prenom", "email", "imageUrl"],
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
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
      });
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
        id: req.params.id,
      },
    }
  )
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
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
        message: err.message || "Some error occurred while retrieving users.",
      });
    });
};

exports.verifyuserrole = (req, res) => {
  User.findOne({
    where: {
      id: req.params.id,
    },
    attributes: ["id"],
    include: [
      {
        model: db.role,
        attributes: ["id"],
        through: {
          attributes: [],
        },
      },
    ],
  })
    .then((data) => {
      if (data.roles.roleId === 4) {
        res.status(200).send(true);
      } else {
        res.status(200).send(false);
        console.log(data);
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
      });
    });
};
