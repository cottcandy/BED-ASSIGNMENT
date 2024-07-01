const Member = require('../models/member');

// Create Member
const createMember = async (req, res) => {
    const memberData = req.body;
    try {
        const createdMember = await Member.createUser(memberData);
        res.status(201).json(createdMember);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Error creating member");
    }
};

// Login Member
const loginMember = async (req, res) => {
    const { email, password } = req.body;
    try {
        const member = await Member.loginUser(email, password);
        res.json(member);
    } catch (error) {
        console.error(error.message);
        res.status(401).send(error.message); 
    }
};

// Get All Members
const getAllMembers = async (req, res) => {
    try {
        const members = await Member.getAllUsers();
        res.json(members);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Error retrieving members");
    }
};

// Get Member by ID
const getMemberById = async (req, res) => {
    const memberId = req.params.id;
    try {
        const member = await Member.getUserById(memberId);
        res.json(member);
    } catch (error) {
        console.error(error.message);
        res.status(404).send(error.message); 
    }
};

// Update Member by ID
const updateMember = async (req, res) => {
    const memberId = req.params.id;
    const newMemberData = req.body;
    try {
        const updatedMember = await Member.updateUser(memberId, newMemberData);
        res.json(updatedMember);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Error updating member");
    }
};

// Delete Member by ID
const deleteMember = async (req, res) => {
    const memberId = req.params.id;
    try {
        const deleted = await Member.deleteUser(memberId);
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).send("Member not found");
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Error deleting member");
    }
};

module.exports = {
    createMember,
    loginMember,
    getAllMembers,
    getMemberById,
    updateMember,
    deleteMember,
};