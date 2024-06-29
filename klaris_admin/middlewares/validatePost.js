const Joi = require("joi");

const validatePost = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(255).required(),
    content: Joi.string().min(3).required(),
    pictureURL: Joi.string().uri().required(),
    adminID: Joi.string().pattern(/^A[0-9]{3}$/).required(),
    newEventID: Joi.string().pattern(/^[HCEPED][0-9]{3}$/).required(),
    eventType: Joi.string().valid('Healthcare', 'CSR', 'Environment', 'Education').required(),
    eventDate: Joi.date().required(),
    eventTime: Joi.string().required(),
    eventLocation: Joi.string().min(3).max(50).required()
  });

  const validation = schema.validate(req.body, { abortEarly: false });

  if (validation.error) {
    const errors = validation.error.details.map((error) => error.message);
    res.status(400).json({ message: "Validation error", errors });
    return;
  }

  next();
};

module.exports = validatePost;
