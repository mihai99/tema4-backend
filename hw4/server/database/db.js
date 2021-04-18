const ConnectionPool = require("tedious-connection-pool");

// Create connection to database
var poolConfig = {
  min: 1,
  max: 20,
  log: true,
};

var connectionConfig = {
  userName: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  options: {
    port: 1433,
    database: process.env.DB_NAME,
    encrypt: true,
    rowCollectionOnRequestCompletion: true,
  },
};

const pool = new ConnectionPool(poolConfig, connectionConfig);

pool.on("error", function (err) {
  console.error(err);
});

module.exports = pool;
