module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
      nom : {
        type: Sequelize.STRING
      },
      prenom : {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      imageUrl: {
        type: Sequelize.STRING
      },
    });
    return User;
  };