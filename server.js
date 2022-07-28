const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const cookieSession = require("cookie-session");
const path = require("path");

const app = express();

// Options for cors
// Options pour cors
var corsOptions = {
	origin: '*',
	allowedHeaders: 'Content-Type, Authorization',
	methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
	optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// set the path for the static images
// Définit le chemin pour les images statiques
app.use("/images", express.static(path.join(__dirname, "images")));

// cookie session
app.use(
  cookieSession({
    name: "Groupomania-session",
    secret: "COOKIE_SECRET", // should use as secret environment variable
    httpOnly: true,
    sameSite: 'strict'
  })
);

// database
const db = require("./app/models");
const Role = db.role;

db.sequelize.sync();
// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/posts.routes")(app);


// set port, listen for requests
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
