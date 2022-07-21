require('dotenv').config()
module.exports = {
  // Toute les informations de la base de données stockée dans le fichier .env
  // all informations about the database stored in the .env file
    HOST: process.env.DB_HOST,
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASSWORD,
    DB: process.env.DB_NAME,
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };