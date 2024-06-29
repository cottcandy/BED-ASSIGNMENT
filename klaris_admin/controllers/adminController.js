const Post = require('../models/post');
const validatePost = require('../middlewares/validatePost');
const validateAdmin = require('../middlewares/validateAdmin');

const loginAdmin = async (req, res) => {
    const { email, password } = req.body;
    try {
      const admin = await Admin.login(email, password);
      if (!admin) {
        return res.status(401).send("Invalid email or password");
      }
      res.json(admin);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error logging in admin");
    }
  };
  
  const getAdminPosts = async (req, res) => {
    const adminId = req.params.id;
    try {
      const posts = await Post.getPostsByAdmin(adminId);
      res.json(posts);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error retrieving posts");
    }
  };
  
  module.exports = {
    loginAdmin,
    getAdminPosts,
  };