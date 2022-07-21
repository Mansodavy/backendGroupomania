const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");
const multer = require("../config/multer.config");

module.exports = function(app) {
  //header
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });
  //getoneuser call the controller with the api/getOneUser/:id with get method and verify the token
  //getoneuser appelle le contrôleur avec api/getOneUser/:id avec la méthode get et vérifie le token
  app.get("/api/user/getOneUser/:id", verifyToken, controller.getOneUser);
  //Editprofil call the controller with the api/user with put method and verify the token
  //Editprofil appelle le contrôleur avec api/user avec la méthode put et vérifie le token
  app.put("/api/user/", verifyToken, controller.editprofil);
  //editimage call the controller with the api/user/image with put method and verify the token and if the user have upload the image
  //editimage appelle le contrôleur avec api/user/image avec la méthode put et vérifie le token et si l'utilisateur a uploadé l'image
  app.put("/api/user/image/", multer, verifyToken, controller.editimage);
  //deteletuser call the controller with the api/user/ with delete method and verify the token
  //deteletuser appelle le contrôleur avec api/user/ avec la méthode delete et vérifie le token
  app.delete("/api/user/", verifyToken, controller.deleteUser);
};