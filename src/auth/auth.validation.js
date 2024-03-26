const joi = require('joi');

const userLoginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
});

module.exports = {
  userLoginSchema,
};
