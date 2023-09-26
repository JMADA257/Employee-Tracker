const mysql = require("mysql2");

const PORT = process.env.PORT || 3001;

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "root",
    database: "",
  },
  console.log("Connected to the ### database.")
);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
