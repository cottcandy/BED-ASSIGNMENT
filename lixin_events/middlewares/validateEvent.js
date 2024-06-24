const Joi = require("joi");

const validateEvent = (req, res, next) => {
  const schema = Joi.object({
    EventType: Joi.string().valid('Healthcare', 'CSR', 'Environment', 'Education').required(),
    EventDate: Joi.date().required(),
    EventTime: Joi.string().required(),
    EventLocation: Joi.string().min(3).max(50).required(),
    AdminID: Joi.string().pattern(/^A\d{3}$/).required(), 
  });

  const validation = schema.validate(req.body, { abortEarly: false }); // Validate request body

  if (validation.error) {
    const errors = validation.error.details.map((error) => error.message);
    res.status(400).json({ message: "Validation error", errors });
    return; // Terminate middleware execution on validation error
  }

  next(); // If validation passes, proceed to the next route handler
};

module.exports = validateEvent;
