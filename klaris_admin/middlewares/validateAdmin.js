const joi = require("joi");

const validateAdmin = async (req, res, next) => {
    const { adminID, password } = req.headers;
    const admin = await Admin.loginByID(adminID, password);
    if (admin) {
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

module.exports = { validateAdmin };
