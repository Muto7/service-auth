const Mariadb = require("mariadb");
const retry = require("retry");
const Logger = require("./Logger");

const poolConfig = {
  host: process.env.DB_CONFIG_HOST || "localhost",
  user: process.env.DB_CONFIG_USER || "root",
  password: process.env.DB_CONFIG_PASS || "password123#",
  database: process.env.DB_CONFIG_DATABASE || "db_service_auth",
  port: process.env.DB_CONFIG_PORT || 3306,
  connectionLimit: parseInt(process.env.DB_CONFIG_LIMIT) || 10,
  connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT) || 10000,
  allowPublicKeyRetrieval: true,
};

const connectionPool = Mariadb.createPool(poolConfig);
let connection = null;

const connect = function () {
  return new Promise((resolve, reject) => {
    const operation = retry.operation({
      retries: 3, // Number of retries before giving up
      factor: 2, // Exponential backoff factor
      minTimeout: 1000, // Minimum retry delay in milliseconds
      maxTimeout: 3000, // Maximum retry delay in milliseconds
    });
    operation.attempt((currentAttempt) => {
      if (connection) {
        // If a connection already exists, reuse it
        resolve(connection);
        return;
      }

      connectionPool
        .getConnection()
        .then((conn) => {
          connection = conn;
          connection.end();
          resolve(connection);
          // console.log("Database connection successful");
        })
        .catch((error) => {
          if (operation.retry(error)) {
            console.error("Retry attempt", currentAttempt, ":", error.message);
            return;
          }
          reject(error);
        });
    });
  });
};

const runQuery = function (query, params) {
  return new Promise(async (resolve, reject) => {
    try {
      const connection = await connect();
      const result = await connection.query(query, params);
      connection.end();
      Logger.info(["SUCCESS Query to DB"]);
      resolve(result);
    } catch (error) {
      Logger.error(["SUCCESS Query to DB"], error);
      reject(error);
    }
  });
};

module.exports = {
  connect,
  runQuery,
};
