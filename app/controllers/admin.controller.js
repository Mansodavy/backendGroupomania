const db = require("../models");
const config = require("../config/auth.config");
const Op = db.Sequelize.Op;
const User = db.user;

exports.lastuserregistered = async (req, res) => {
    try {
        const users = await User.findAll({
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
            limit: 10,
        });
        res.send(users);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

exports.countusers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ["id"],
        });
        res.send(users);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}



    