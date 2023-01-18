const { createPool } = require("mysql");

const pool_test = createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.MYSQL_DB_TEST,
    connectionLimit: 10
  });
  
  
  module.exports = pool_test;

  //db gia to token pou exoun ginei log out