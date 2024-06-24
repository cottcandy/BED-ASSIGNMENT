const User = require("../models/admin");

async function getUsersWithBooks(req, res) {
    try {
      const users = await User.getUsersWithBooks();
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching users with books" });
    }
  }

const createUser = async (req, res) => {
    const user = req.body;
    try {
        const createdUser = await User.createUser(user);
        res.status(201).json(createdUser);
    }catch (error) {
        console.error(error);
        res.status(500).send("Error creating user")
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.getAllUsers();
        res.json(users);
    }catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving users")
    }
};

const getUserById = async (req, res) => {
    const userId = parseInt(req.params.id);
    try{
        const id = await User.getUserById(userId);
        if(!id) {
            return res.status(404).send("User not found")
        }
        res.json(id)
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving user")
    }
};

const updateUser = async (req, res) => {
    const userId = parseInt(req.params.id);
    const newUserData = req.body;
  
    try {
      const updatedUser = await Book.updateBook(userId, newUserData);
      if (!updatedUser) {
        return res.status(404).send("User not found");
      }
      res.json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error updating user");
    }
};

const deleteUser = async (req, res) => {
    const userId = parseInt(req.params.id);
    
    try {
      const success = await Book.deleteBook(userId);
      if (!success) {
        return res.status(404).send("User not found");
      }
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).send("Error deleting user");
    }
};

async function searchUsers(req, res) {
  const searchTerm = req.query.searchTerm; // Extract search term from query params

  try {    
    const users = await User.searchUsers(searchTerm);
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error searching users" });
  }
};

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    searchUsers,
    getUsersWithBooks,
}