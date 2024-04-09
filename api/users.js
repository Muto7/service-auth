const router = require("express").Router();
const users = require("../controller/controllerUser");
const Logger = require("../service/Logger");
const ResponseError = require("../service/response-error");
const validate = require("../validator/user-validation");

const postUsers = async (req, res) => {
  let Response;

  try {
    // Validasi nama tidak boleh kosong
    if (!req.body.name) {
      Response = {
        status: 400,
        message: "Name is required",
      };
      return res.status(400).send(Response);
    }
    //validasi email tidak boleh kosong
    if (!req.body.email) {
      Response = {
        status: 400,
        message: "Email is required",
      };
      return res.status(400).send(Response);
    }
    // Periksa apakah email sudah terdaftar
    const existingUser = await users.findByEmail(req.body.email);
    if (existingUser) {
      Response = {
        status: 400,
        message: "Email is already registered",
      };
      return res.status(400).send(Response);
    }
    const validation = validate.registerUserValidation(req.body);
    const { error } = validation;
    // jika password dan confPassword tidak cocok
    if (error) {
      console.log();
      let message;
      if (error.details[0].path[0] == "confPassword") {
        message = "Passwrd not match";
      } else {
        message = error.details[0].message;
      }
      Response = {
        status: 400,
        message: message,
      };

      return res.status(400).send(Response);
    }

    const data = await users.register(req);
    console.log(data);

    Logger.info(["SUCCESS Registrasi"]);
    Response = {
      status: 200,
      message: "anda berhasil registrasi",
    };
    return res.status(200).send(Response);
  } catch (err) {
    Response = {
      status: "Internal Server Error",
      data: "The Post users has failed due to an internal server error.",
    };
    Logger.error(["FAILED Post Product"], err);
    return res.status(500).send(Response);
  }
};

router.post("/users", postUsers);

module.exports = router;
