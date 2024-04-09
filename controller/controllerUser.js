const Logger = require("../service/Logger");
const DBService = require("../service/databases.js");
const validate = require("../validator/validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ResponseError = "../service/response-error.js";
const validateEmailUnique = require("../validator/validateEmail.js");

const findByEmail = (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = `SELECT * FROM users WHERE email = ?`;
      const Response = await DBService.runQuery(query, [email]);

      Logger.info(["SUCCESS", "SUCCESS TO DB"]);
      resolve(Response[0]);
    } catch (err) {
      Logger.info(["FAILURD", "FAILUR RO DB"], err.message);
      reject({ "err.message": err });
    }
  });
};

const register = (req) => {
  return new Promise(async (resolve, reject) => {
    const { name, email, password, confPassword } = req.body;

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    try {
      const query = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
      const Response = await DBService.runQuery(query, [
        name,
        email,
        hashPassword,
      ]);

      Logger.info(["Registrasi", "Berhasil terregistrasi"]);
      resolve(Response);
    } catch (err) {
      Logger.info(["Registrasi", "Gagal Registrasi"], err.message);
      reject({ "err.message": err });
    }
  });
};

module.exports = {
  register,
  findByEmail,
};
