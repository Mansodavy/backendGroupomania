const db = require("../models");
const Post = db.posts;
const url = require("url");
const fs = require("fs");
const path = require("path");
const User = db.user;
const Comment = db.comments;
// Create and Save a new post with image
// Crée et sauvegarde un nouveau post avec une image
exports.createPosts = async (req, res) => {
  try {
    const newPost = {
      ...req.body,
      userId: req.userId,
    };
    // Verify if the image is uploaded
    // Vérifie si l'image est uploadée
    if (req.file) {
      const imageUrl = `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`;
      newPost.imageUrl = imageUrl;
    }

    const posts = await Post.create(newPost);
    res.status(201).send({ message: "Post created" });
  } catch (e) {
    res.status(400).send(e);
  }
};
// Update a post with image
// Met à jour un post avec une image
exports.Editpostwithimage = async (req, res) => {
	try {
    // Verify if the image is uploaded
    // Vérifie si l'image est uploadée
		const postObject = req.file
			// if the image is uploaded then update the post with the image
      // Si l'image est uploadée alors met à jour le post avec l'image
    ? {
					...req.body,
					imageUrl: `${req.protocol}://${req.get('host')}/images/${
						req.file.filename
					}`,
			  }
			// if the image is not uploaded then update the post without the image
      //  Si l'image n'est pas uploadée alors met à jour le post sans l'image
        : { ...req.body };

		if (postObject.imageUrl) {
      // delete the old image
      // Supprime l'ancienne image
			const oldPost = await Post.findOne({ where: { id: req.params.id } });
      const oldFile = oldPost.imageUrl.split('/images/')[1];
      fs.unlink(`images/${oldFile}`, (err) => {
        if (err) {
          console.log(err);
        }
      }
      );
		}
		const post = await Post.update(postObject, {
			where: { id: req.params.id },
		});
		if (!post) {
			res.status(404).send();
		}
		res.status(200).json({ message: 'Post modifié' });
	} catch (e) {
		console.log(e);
		res.status(500).send(e);
	}
};
// Retrieve all posts from the database.
// Récupère tous les posts de la base de données.
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [
        {
          // Include the user who created the post
          // Inclure l'utilisateur qui a créé le post
          model: db.user,
          attributes: ["id", "nom", "prenom", "imageUrl"],
        },
          {
            model: db.comments,
            limit : 2,
            // Include the 2 last comments of the post
            // Inclure les 2 derniers commentaires du post
            include: [ {model: db.user, attributes: ["id", "nom", "prenom", "imageUrl"]}],
            order: [
              ['createdAt', 'DESC']
            ],
          } ,
          
          
      ],
    });
	if (posts.length === 0) {
    // If no posts are found, send a message 
    // Si aucun post n'est trouvé, envoyer un message
		res.status(200).send({ message: "Aucun post trouvé" });
	}else {
    // If posts are found, send them
    // Si des posts sont trouvés, les envoyer
		res.status(200).send(posts);
	}
  } catch (e) {
    res.status(400).send(e);
  }
};

// Delete a post by the given id in the request
// Supprime un post par l'id donné dans la requête
exports.postcomment = async (req, res) => {
  try {
    const post = await Post.findOne({
      where: {
        id: req.params.id,
      },
    });
    // Verify if the post exists
    // Vérifie si le post existe
    if (post) {
      const newComment = {
        commentaire: req.body.commentaire,
        userId: req.userId,
        postId: post.id,
      };
      Comment.create(newComment);
      res.status(201).send({ message: "Commentaire crée" });
    } else {
      res.status(404).send({ message: "Commentaire Introuvable " });
    }
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
};
// Retrieve a single post by an id
// Récupère un post par un id
exports.getOnePosts = async (req, res) => {
  try {
    const post = await Post.findOne({
      include: [
        {
          // Include the user who created the post
          // Inclure l'utilisateur qui a créé le post
          model: db.user,
          attributes: ["id", "nom", "prenom", "imageUrl"],
        },
        {
          // Include the comments of the post
          // Inclure les commentaires du post
          model: db.comments,
          include: [db.user],
        },
      ],
      where: {
        id: req.params.id,
      },
    });
    res.status(200).send(post);
  } catch (e) {
    res.status(400).send(e);
  }
};
// Delete a comment by the given comment id and post id in the request
// Supprime un commentaire par l'id du commentaire et du post dans la requête
exports.deletecomment = async (req, res) => {
  try {
    const comment = await Comment.findOne({
      where: {
        id: req.params.id,
      },
    });
    // Verify if the comment is found
    // Vérifie si le commentaire est trouvé
    if (comment) {
      Comment.destroy({
        where: {
          id: req.params.id,
        },
      });
      res.status(200).send({ message: "Commentaire supprimée" });
    } else {
      res.status(404).send({ message: "Commentaire introuvable" });
    }
  } catch (e) {
    res.status(400).send(e);
  }
};
// Delete a post by the given id in the request
// Supprime un post par l'id donné dans la requête
exports.deletePosts = async (req, res) => {
  try {
    const post = await Post.findOne({
      where: {
        id: req.params.id,
      },
    });
    // Verify if the post is found
    // Vérifie si le post est trouvé
    if (post) {
      Post.destroy({
        where: {
          id: req.params.id,
        },
      });
          // Delete the image of the post
    // Supprime l'image du post
    
    const fileName = post.imageUrl.split('images/')[1];
    if (fileName) {
      fs.unlinkSync(`images/${fileName}`);
    }
    res.status(200).send({ message: "Post Supprimée" });
    } else {
      res.status(404).send({ message: "Post introuvable" });
    }
  } catch (e) {
    res.status(400).send(e);
  }
};
