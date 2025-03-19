const sql = require("mssql")
const { Sequelize } = require("sequelize");
const userModel = require("../models/userModel");  
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

/*
// Configure the connection
const config = {
  server:  'DESKTOP-OHAIK4T\\SQLEXPRESS',
  database:  "creditos",
  port: 1433,
  authentication: {
    type: 'default',
    options: {
      userName: process.env.DB_USER ||  'adminTeso',     
      password: 'administrador123',  
    },
  },
  options: {
    enableArithAbort: true, // Required option for Node.js applications
    trustServerCertificate: true,
    trustedConnection: true, 
    instancename:  'SQLEXPRESS' 

  }
}

// Establish a connection to the database
async function getConnection() {
  try {
    const pool = await sql.connect(config);
    return pool;
  } catch (error) {
    console.error('Error connecting to SQL Server:', error);
    throw error;
  }
}
  */

