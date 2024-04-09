const DBService = require("../service/databases.js");

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
  validateEmailUnique,
};
