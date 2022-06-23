const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });
  app.get("/api/user/getOneUser/:id", verifyToken, controller.getOneUser);
  app.get("/api/user/verifyrank/:id", verifyToken, controller.verifyuserrole);
  app.get("/api/user/getUser", verifyToken, controller.getUser);
  app.put("/api/user/", verifyToken, controller.editprofil);
  app.delete("/api/user/", verifyToken, controller.deleteUser);
  app.get(
    "/api/test/user",
    [authJwt.verifyToken],
    controller.userBoard
  );
};