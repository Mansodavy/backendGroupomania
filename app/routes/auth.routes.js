const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");

module.exports = function(app) {
  //header
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept",
      "Access-Control-Allow-Credentials: true"

    );
    next();
  });

  //Signup call the controller with the api/auth/signup with post method
  //Signup appelle le contrôleur avec l'api/auth/signup avec la méthode post
  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );
  //Signin call the controller with the api/auth/signin with post method
  //Signin appelle le contrôleur avec l'api/auth/signin avec la méthode post
  app.post("/api/auth/signin", controller.signin);

  //Signout call the controller with the api/auth/signout with post method
  //Signout appelle le contrôleur avec l'api/auth/signout avec la méthode post
  app.post("/api/auth/signout", controller.signout);
};