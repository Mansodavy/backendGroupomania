const db = require("../models");
const Post = db.posts;
const url = require("url");
const fs = require("fs");
const path = require("path");
const User = db.user;
const Comment = db.comments;

exports.createPosts = async (req, res) => {
  try {
    const newPost = {
      ...req.body,
      userId: req.userId,
    };

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

exports.Editpostwithimage = async (req, res) => {
	try {
		const postObject = req.file
			? {
					...req.body,
					imageUrl: `${req.protocol}://${req.get('host')}/images/${
						req.file.filename
					}`,
			  }
			: { ...req.body };

		if (postObject.imageUrl) {
			const oldPost = await Post.findOne({ where: { id: req.params.id } });
			const oldFile = oldPost.imageUrl.split('/images/')[1];
			fs.unlinkSync(`images/${oldFile}`);
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

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [
        {
          model: db.user,
          attributes: ["id", "nom", "prenom", "imageUrl"],
        },
          {
            model: db.comments,
            limit : 5,
            attributes: ["commentaire"],
          },
      
      ],
    });
	console.log(posts.length);
	if (posts.length === 0) {
		res.status(200).send({ message: "Aucun post trouvé" });
	}else {
		res.status(200).send(posts);
	}
  } catch (e) {
    res.status(400).send(e);
  }
};

exports.postcomment = async (req, res) => {
  try {
    const post = await Post.findOne({
      where: {
        id: req.params.id,
      },
    });
    console.log(req.userId);
    if (post) {
      const newComment = {
        commentaire: req.body.commentaire,
        userId: req.userId,
        postId: post.id,
      };
      console.log(newComment);
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

exports.getOnePosts = async (req, res) => {
  try {
    const post = await Post.findOne({
      include: [
        {
          model: db.user,
          attributes: ["id", "nom", "prenom", "imageUrl"],
        },
        {
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

exports.deletecomment = async (req, res) => {
  try {
    const comment = await Comment.findOne({
      where: {
        id: req.params.id,
      },
    });
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

exports.deletePosts = async (req, res) => {
  try {
    const post = await Post.findOne({
      where: {
        id: req.params.id,
      },
    });
    const fileName = post.imageUrl.split('images/')[1];
		console.log(post.imageUrl);
		fs.unlinkSync(`./images/${fileName}`);
    if (post) {
      Post.destroy({
        where: {
          id: req.params.id,
        },
      });
      res.status(200).send({ message: "Post Supprimée" });
    } else {
      res.status(404).send({ message: "Post introuvable" });
    }
  } catch (e) {
    res.status(400).send(e);
  }
};
