const { validationResult } = require("express-validator/check");
const path = require("path");
const io = require("../socket");
const User = require("../models/user");
const fs = require("fs");
const Post = require("../models/post");
exports.getPosts = async (req, res, next) => {
  //we do not render the element we return the data only we require is called
  //we want to fetch all post here in this controlled function
  const currentPage = req.query.page || 1;
  const perPage = 2;
  let totalItems;
  try {
    const totalItems = await Post.find().countDocuments();
    const posts = await Post.find()
      .populate("creator")
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
    res.status(200).json({
      message: "posts fetched succesfully",
      posts: posts,
      totalItems: totalItems,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next();
  }
};
exports.createPost = (req, res, next) => {
  //"crate the postt in db";
  //201 is indicated we create the resources
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("validation failed ,data entered is incorrect");
    error.statusCode = 402;
    throw error;
  }
  if (!req.file) {
    const error = new Error("no image provided");
    error.statusCode = 422;
    throw error;
  }
  const title = req.body.title;
  const imageUrl = req.file.path.replace("\\", "/");
  const content = req.body.content;
  let creator;

  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: req.userId,
  });
  console.log(creator);
  post
    .save()
    .then((result) => {
      console.log(result);
      return User.findById(req.userId);
    })
    .then((user) => {
      user.posts.push(post);
      creator = user;
      return user.save();
    })
    .then((result) => {
      io.getIo().emit("posts", {
        action: "create",
        post: post,
      });
      res.status(201).json({
        message: "Post create successfull",
        post: post,
        creator: {
          name: creator.name,
          _id: creator._id,
        },
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next();
    });
};
exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("could not found post");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: "post fetched", post: post });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next();
    });
};

exports.updatePost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("validation failed ,data entered is incorrect");
    error.statusCode = 402;
    throw error;
  }
  const postId = req.params.postId;
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;
  if (req.file) {
    imageUrl = req.file.path.replace("\\", "/");
  }
  if (!imageUrl) {
    const error = new Error("No file picked");
    error.statusCode = 422;
    throw error;
  }
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("could not found post");
        error.statusCode = 404;
        throw error;
      }
      if (post.creator.toString() !== req.userId.toString()) {
        const error = new Error("user not authenicated");
        error.statusCode = 403;
        throw error;
      }
      if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl);
      }
      post.title = title;
      post.imageUrl = imageUrl;
      post.content = content;
      return post.save();
    })
    .then((result) => {
      res.status(200).json({ message: "post updated", post: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next();
    });
};
exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("post not find");
        error.statusCode = 404;
        throw error;
      }
      if (post.creator.toString() !== req.userId.toString()) {
        const error = new Error("user not authenicated");
        error.statusCode = 403;
        throw error;
      }
      clearImage(post.imageUrl);
      return Post.findByIdAndRemove(postId);
    })
    .then((result) => {
      return User.findById(req.userId);
    })
    .then((user) => {
      user.posts.pull(postId);
      return user.save();
    })
    .then((result) => {
      res.status(200).json({
        message: "post deleted successfully",
        post: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next();
    });
};
const clearImage = (filePath) => {
  const newfilePath = path.join(__dirname, "..", filePath);
  fs.unlink(newfilePath, (err) => {
    console.log(err);
  });
};
