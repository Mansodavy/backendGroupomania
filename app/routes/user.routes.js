const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");
const multer = require("../config/multer.config");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });
  app.get("/api/user/getOneUser/:id", verifyToken, controller.getOneUser);
  app.put("/api/user/", verifyToken, controller.editprofil);
  app.put("/api/user/image/", multer, verifyToken, controller.editimage);
  app.delete("/api/user/", verifyToken, controller.deleteUser);
};