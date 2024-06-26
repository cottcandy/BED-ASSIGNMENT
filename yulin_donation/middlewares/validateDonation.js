const Joi = require("joi");

const validateDonation = (req, res, next) => {
  const schema = Joi.object({
    donationAmount: Joi.number().min(1).required(),
    eventType: Joi.string().valid('Healthcare', 'CSR', 'Environment', 'Education').required(),
    eventDate: Joi.date().required(),
    eventTime: Joi.string().required(),
    eventLocation: Joi.string().min(3).max(50).required(),
    newEventID: Joi.string().required(),
    newMemberID: Joi.string().required(),
  });

  const validation = schema.validate(req.body, { abortEarly: false });

  if (validation.error) {
    const errors = validation.error.details.map((error) => error.message);
    res.status(400).json({ message: "Validation error", errors });
    return;
  }

  next();
};

module.exports = validateDonation;
