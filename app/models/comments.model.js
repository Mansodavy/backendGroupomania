module.exports = (sequelize, Sequelize) => {
    const Comments = sequelize.define("comments", {
      commentaire: {
        type: Sequelize.STRING
      },
      userId: {
        type: Sequelize.INTEGER,
      },
      postId: {
        type: Sequelize.INTEGER,
      },
    });
    return Comments;
  };