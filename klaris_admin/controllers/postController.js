const Post = require('../models/post');

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.getAllPosts();
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving posts");
  }
};

const getPostById = async (req, res) => {
  const postId = req.params.id; // Use req.params.id directly
  try {
    const post = await Post.getPostById(postId);
    if (!post) {
      return res.status(404).send("Post not found");
    }
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving post");
  }
};

const createPost = async (req, res) => {
  try {
    const newPostData = req.body;
    const newPost = await Post.createPost(newPostData);
    res.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating post");
  }
};

const deletePost = async (req, res) => {
  try {
    const postId = req.params.id; // Use req.params.id directly
    const success = await Post.deletePost(postId);
    if (!success) {
      return res.status(404).send("Post not found");
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting post");
  }
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  deletePost,
};
