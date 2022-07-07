const { authJwt } = require("../middleware");
const multer = require("../config/multer.config");
const controller = require("../controllers/posts.controller");

module.exports = function (app) {
    app.use(function(req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "Origin, Content-Type, Accept"
        );
        next();
      });
    app.post("/api/posts", multer, verifyToken, controller.createPosts);
    app.post("/api/posts/comments/:id", verifyToken, controller.postcomment);
    app.get("/api/posts", verifyToken, controller.getAllPosts);
    app.get("/api/posts/:id", verifyToken, controller.getOnePosts);
    app.delete("/api/posts/:id", verifyToken, controller.deletePosts);
    app.delete("/api/posts/comments/:id", verifyToken, controller.deletecomment);
    app.put("/api/posts/edit/:id", multer, verifyToken, controller.Editpostwithimage);
};