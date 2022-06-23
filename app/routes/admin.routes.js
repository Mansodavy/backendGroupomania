const { authJwt } = require("../middleware");
const controller = require("../controllers/admin.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });
  app.get("/api/admin/lastuserregistered", verifyToken, controller.lastuserregistered);
  app.get("/api/admin/countusers", verifyToken, controller.countusers);
};