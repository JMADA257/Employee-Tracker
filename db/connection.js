const mysql = require("mysql2");

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "root",
    database: "employeetracker_db",
  },
  console.log("Connected to the employeetracker_db database.")
);

db.connect(function(err) {
  if (err) throw err;
  // db.query("SELECT * FROM roles", function (err, result, fields) {
  //   if (err) throw err;

  //   console.log(result);
  // });
});

module.exports = db