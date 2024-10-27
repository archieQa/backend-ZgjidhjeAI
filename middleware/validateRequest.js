// middleware/validateRequest.js
const { validationResult } = require("express-validator");

const validateRequest = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // Group errors by field and return detailed error messages
      const errorResponse = errors.array().reduce((acc, err) => {
        if (!acc[err.param]) {
          acc[err.param] = [];
        }
        acc[err.param].push(err.msg);
        return acc;
      }, {});

      return res.status(400).json({
        success: false,
        errors: errorResponse, // Errors grouped by field
      });
    }

    next();
  };
};

module.exports = validateRequest;
