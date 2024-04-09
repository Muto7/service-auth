const wiston = require("winston");

const logger = wiston.createLogger({
  transports: [
    //Transport untuk menulis ke file
    new wiston.transports.File({ filename: "app.log" }),
    //Transport untuk menampilkan di konsol
    new wiston.transports.Console(),
  ],
  format: wiston.format.combine(
    wiston.format.timestamp(),
    wiston.format.json()
  ),
});

module.exports = logger;
