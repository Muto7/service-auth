const express = require("express");
const bodyparser = require("body-parser");
const users = require("./api/users");

const app = express();
const port = 5001;

app.use(bodyparser.json());

app.use("/api", users);

//start the server
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
