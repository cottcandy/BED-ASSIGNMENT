const Joi = require("joi");

const validateMember = (req, res, next) => {
  const schema = Joi.object({
    memberEmail: Joi.string().email().required(),
    firstName: Joi.string().min(1).max(50).required(),
    lastName: Joi.string().min(1).max(50).required(),
    memberPassword: Joi.string().min(6).max(12).required(),
    birthday: Joi.date().required(),
    phoneNumber: Joi.string().min(7).max(8).required()
  });

  const validation = schema.validate(req.body, { abortEarly: false });

  if (validation.error) {
    const errors = validation.error.details.map((error) => error.message);
    res.status(400).json({ message: "Validation error", errors });
    return;
  }

  next();
};

module.exports = validateMember;