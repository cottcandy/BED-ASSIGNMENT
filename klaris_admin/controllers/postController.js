const Post = require('../models/post');
const validatePost = require('../middlewares/validatePost');

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
  const postId = parseInt(req.params.id);
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
  const newPost = req.body;
  try {
    const createdPost = await Post.createPost(newPost);
    res.status(201).json(createdPost);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating post");
  }
};


const deletePost = async (req, res) => {
  const postId = parseInt(req.params.id);

  try {
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
