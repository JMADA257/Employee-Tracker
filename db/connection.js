const mysql = require("mysql2");
const inquirer = requrie("inquirer")

const PORT = process.env.PORT || 3001;

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "root",
    database: "employeetracker_db",
  },
  console.log("Connected to the employeetracker_db database.")
);
