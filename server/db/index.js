const sql = require("mssql")
const { Sequelize } = require("sequelize");
const userModel = require("../models/User.model");  
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB,
  process.env.USER,
  process.env.PASSWORD,
  {
    host: process.env.HOST,
    port: process.env.SQL_PORT,
    dialect: process.env.DIALECT,
    dialectOptions: {
      options: { encrypt: false },
    },
  }
);

const db = {};

db.User = userModel(sequelize);  

db.sequelize = sequelize;  
db.Sequelize = Sequelize;

module.exports = db;
