module.exports = (sequelize, Sequelize) => {
    const Post = sequelize.define("post", {
      nomposte : {
        type: Sequelize.STRING
      },
      messagepost: {
        type: Sequelize.STRING
      },
      imageUrl: {
        type: Sequelize.STRING
      },
    });
    return Post;
  };