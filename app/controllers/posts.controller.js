const { sauces } = require("../models");
const db = require("../models");
const Post = db.posts;
const url = require("url");
const fs = require("fs");
const path = require("path");
const User = db.user;
const Comment = db.comments;

exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
  };
  
  exports.userBoard = (req, res) => {
    res.status(200).send("User Content.");
  };
  
  exports.adminBoard = (req, res) => {
    res.status(200).send("Admin Content.");
  };
  
exports.createPosts = async (req, res) => {
	try {
		const newPost = {
			...req.body,
			userId: req.userId,
		};

		if (req.file) {
			const imageUrl = `${req.protocol}://${req.get('host')}/images/${
				req.file.filename
			}`;
			newPost.imageUrl = imageUrl;
		}

		const posts = await Post.create(newPost);
		res.status(201).send({ message: 'Post created' });
	} catch (e) {
		res.status(400).send(e);
	}
};

exports.getAllPosts = async (req, res) => {
	try {
		const posts = await Post.findAll(
			{ include: [
				{
				  model: db.user,
				  attributes: ["id", "nom", "prenom", "imageUrl"],
				},
			  ],
			});
		res.status(200).send(posts);
	} catch (e) {
		res.status(400).send(e);
	}
};

exports.postcomment = async (req,res) => {
	try {
		const post = await Post.findOne({
			where: {
				id: req.params.id,
			},
		});
		console.log(req.userId)
		if (post) {
			const newComment = {
				commentaire: req.body.commentaire,
				userId: req.userId,
				postId: post.id,
			};
			console.log(newComment)
			Comment.create(newComment);
			res.status(201).send({ message: 'Comment created' });
		} else {
			res.status(404).send({ message: 'Post not found' });
		}
	} catch (e) {
		console.log(e)
		res.status(400).send(e);
	}
}

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
}

exports.deletecomment = async (req,res) => {
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
			res.status(200).send({ message: 'Comment deleted' });
		} else {
			res.status(404).send({ message: 'Comment not found' });
		}
	} catch (e) {
		res.status(400).send(e);
	}
}																				

exports.deletePosts = async (req,res) => {
	try {
		const post = await Post.findOne({
			where: {
				id: req.params.id,
			},
		});
		if (post) {
			Post.destroy({
				where: {
					id: req.params.id,
				},
			});
			res.status(200).send({ message: 'Post deleted' });
		} else {
			res.status(404).send({ message: 'Post not found' });
		}
	} catch (e) {
		res.status(400).send(e);
	}
}