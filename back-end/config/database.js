//const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(process.env.MYSQL_DB, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: process.env.DIALECT,
  operatorsAliases: false,

  pool: {
    max: process.env.max,
    min: process.env.min,
    acquire: process.env.acquire,
    idle: process.env.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("../models/user.model")(sequelize, Sequelize);

module.exports = db;





//------------ database me basi auto https://www.youtube.com/watch?v=WfCJ3sHnLBM--------------
const { createPool } = require("mysql");


const pool = createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.MYSQL_DB,
  connectionLimit: 10
});

module.exports = pool; 


