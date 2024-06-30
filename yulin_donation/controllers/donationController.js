const Donation = require('../models/donation');

const getAllDonations = async (req, res, next) => {
  try {
    const donations = await Donation.getAllDonations();
    res.json(donations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve donations' });
  }
};

const getDonationByID = async (req, res, next) => {
  try {
    const donationID = req.params.id; 
    const donation = await Donation.getDonationByID(donationID);
    if (!donation) {
      return res.status(404).json({ message: `Donation with ID ${donationID} not found` });
    }
    res.json(donation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve donation' });
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
  getAllDonations,
  getDonationByID,
  createDonation,
  updateDonation,
};
