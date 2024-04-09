const Joi = require("joi");
const DBService = require("../service/databases.js");

const registerUserValidation = (body) => {
  const schema = Joi.object({
    name: Joi.string().max(100).required(),
    email: Joi.string().max(100).required(),
    password: Joi.string().max(100).required(),
    confPassword: Joi.string().valid(Joi.ref("password")).required(),
  });
  return schema.validate(body);
};

// const loginUserValidation = Joi.object({
//   username: Joi.string().max(100).required(),
//   password: Joi.string().max(100).required(),
// });

const validateEmailUnique = async (email) => {
  try {
    const query = "SELECT * FROM users WHERE email = ?";
    const result = await DBService.runQuery(query, [email]);
    return result.length === 0;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  registerUserValidation,
  validateEmailUnique,
  // loginUserValidation,
};
