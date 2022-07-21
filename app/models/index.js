const config = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  // Toute les informations de la base de données appeller dans le fichier config/db.config.js
  // all informations about the database called in the config/db.config.js file
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: false,
    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.posts = require("../models/posts.model.js")(sequelize, Sequelize);
db.comments = require("../models/comments.model.js")(sequelize, Sequelize);
// BelongsToMany relation between user and role
// Relation entre user et role (BelongsToMany)
db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId"
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId"
});

// HasMany belongsTo relation between user and posts
// Relation entre user et posts (HasMany) (belongsTo)
db.user.hasMany(db.posts, { 
  onDelete: "cascade",
});
db.posts.belongsTo(db.user, {
});
// HasMany belongsTo relation between user and comments
// Relation entre user et comments (HasMany) (belongsTo)
db.comments.belongsTo(db.user, {
});
db.user.hasMany(db.comments, {
  onDelete: "cascade",
});
// HasMany belongsTo relation between posts and comments
// Relation entre posts et comments (HasMany) (belongsTo)
db.posts.hasMany(db.comments, {
  });
db.comments.belongsTo(db.posts, {
});

db.ROLES = ["user", "admin"];
module.exports = db;
