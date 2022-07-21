const { authJwt } = require("../middleware");
const multer = require("../config/multer.config");
const controller = require("../controllers/posts.controller");

module.exports = function (app) {
  //header
    app.use(function(req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "Origin, Content-Type, Accept"
        );
        next();
      });
      //posts call the controller with the api/posts with post method and verify the token and if the user have upload the image
      //posts appelle le contrôleur avec api/posts avec la méthode post et vérifie le token et si l'utilisateur a uploadé l'image
    app.post("/api/posts", multer, verifyToken, controller.createPosts);
    //comments call the controller with the api/comments/:id with post method and verify the token
    //comments appelle le contrôleur avec api/comments/:id avec la méthode post et vérifie le token
    app.post("/api/posts/comments/:id", verifyToken, controller.postcomment);
    //getallposts call the controller with the api/posts with get method and verify the token
    //getallposts appelle le contrôleur avec api/posts avec la méthode get et vérifie le token
    app.get("/api/posts", verifyToken, controller.getAllPosts);
    //get one post call the controller with the api/posts/:id with get method and verify the token
    //getonepost appelle le contrôleur avec api/posts/:id avec la méthode get et vérifie le token
    app.get("/api/posts/:id", verifyToken, controller.getOnePosts);
    //deletepost call the controller with the api/posts/:id with delete method and verify the token
    //deletepost appelle le contrôleur avec api/posts/:id avec la méthode delete et vérifie le token
    app.delete("/api/posts/:id", verifyToken, controller.deletePosts);
    //deletecomment call the controller with the api/comments/:id with delete method and verify the token
    //deletecomment appelle le contrôleur avec api/comments/:id avec la méthode delete et vérifie le token
    app.delete("/api/posts/comments/:id", verifyToken, controller.deletecomment);
    //editpostwithimage call the controller with the api/posts/edit/:id with put method and verify the token and if the user have upload the image
    //editpostwithimage appelle le contrôleur avec api/posts/edit/:id avec la méthode put et vérifie le token et si l'utilisateur a uploadé l'image
    app.put("/api/posts/edit/:id", multer, verifyToken, controller.Editpostwithimage);
};