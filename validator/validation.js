const { ResponseError } = require("../service/response-error");

const validate = (schema, request) => {
  const result = schema.validate(request, {
    abortEarly: false,
    allowUnknow: false,
  });
  if (result.error) {
    return new ResponseError(400, result.error.message);
  } else {
    return result.value;
  }
};

module.exports = {
  validate,
};
