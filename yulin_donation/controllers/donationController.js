const Donation = require('../models/donation');

const getAllDonationsByMemberID = async (req, res, next) => {
  try {
    const memberID = req.params.memberID;
    const donations = await Donation.getAllDonationsByMemberID(memberID);
    res.json(donations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve donations' });
  }
};

const createDonation = async (req, res, next) => {
  try {
    const donationData = req.body;
    const newDonation = await Donation.createDonation(donationData);
    res.status(201).json(newDonation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create donation' });
  }
};

const updateDonation = async (req, res, next) => {
  try {
    const donationID = req.params.donationID;
    const donationData = req.body;
    const updatedDonation = await Donation.updateDonation(donationID, donationData);
    res.json(updatedDonation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update donation' });
  }
};

module.exports = {
  getAllDonationsByMemberID,
  createDonation,
  updateDonation,
};
