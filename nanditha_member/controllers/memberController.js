const Member = require("../models/member");

// Create Member 
const createMember = async (req, res) => {
    const memberData = req.body;
    try {
        const createdMember = await Member.create(memberData);
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
        const member = await Member.login(email, password);
        if (!member) {
            return res.status(401).send("Invalid email or password");
        }
        res.json(member);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Error logging in member");
    }
};

// Get All Members 
const getAllMembers = async (req, res) => {
    try {
        const members = await Member.find();
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
        const member = await Member.findById(memberId);
        if (!member) {
            return res.status(404).send("Member not found");
        }
        res.json(member);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Error retrieving member");
    }
};

// Update Member by ID
const updateMember = async (req, res) => {
    const memberId = req.params.id;
    const newMemberData = req.body;
    try {
        const updatedMember = await Member.findByIdAndUpdate(memberId, newMemberData, { new: true });
        if (!updatedMember) {
            return res.status(404).send("Member not found");
        }
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
        const deletedMember = await Member.findByIdAndDelete(memberId);
        if (!deletedMember) {
            return res.status(404).send("Member not found");
        }
        res.status(204).send();
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
