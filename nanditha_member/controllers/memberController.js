const User = require("../models/user");

// Create User 
const createUser = async (req, res) => {
    const user = req.body;
    try {
        const createdUser = await User.createUser(user);
        res.status(201).json(createdUser);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Error creating user");
    }
};

// Login User 
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.loginUser(email, password);
        if (!user) {
            return res.status(401).send("Invalid email or password");
        }
        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Error logging in user");
    }
};

// Get All Users 
const getAllUsers = async (req, res) => {
    try {
        const users = await User.getAllUsers();
        res.json(users);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Error retrieving users");
    }
};

// Get User by ID
const getUserById = async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.getUserById(userId);
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Error retrieving user");
    }
};

// Update User by ID
const updateUser = async (req, res) => {
    const userId = req.params.id;
    const newUserData = req.body;
    try {
        const updatedUser = await User.updateUser(userId, newUserData);
        if (!updatedUser) {
            return res.status(404).send("User not found");
        }
        res.json(updatedUser);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Error updating user");
    }
};

// Delete User by ID
const deleteUser = async (req, res) => {
    const userId = req.params.id;
    try {
        const success = await User.deleteUser(userId);
        if (!success) {
            return res.status(404).send("User not found");
        }
        res.status(204).send();
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Error deleting user");
    }
};

module.exports = {
    createUser,
    loginUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
};
