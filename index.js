const inquirer = require("inquirer");
const util = require("util");
const connection = require("./db/connection");
const query = util.promisify(connection.query).bind(connection);

const initQuestion = [
  {
    type: "list",
    name: "choice",
    message: "Please choose!",
    choices: [
      "View all department.",
      "View all role.",
      "View all employees.",
      "Add a department.",
      "Add a role.",
      "Add an employee.",
      "Update an employee role.",
      "Quit.",
    ],
  },
];

async function init() {
  const { choice } = await inquirer.prompt(initQuestion);
  console.log(choice);
  switch (choice) {
    case "View all department.":
      viewAlldepartment();
      break;
    case "View all role.":
      viewAllRole();
      break;
    case "View all employees.":
      viewAllEmployees();
      break;
    case "Add a department.":
      addADepartment();
      break;
    case "Add a role.":
      addARole();
      break;
    case "Add an employee.":
      addAEmployee();
      break;
    case "Update an employee role.":
      updateEmployeeRole();
      break;
    case "Quit.":
      quit();
      break;
    default:
  }
  return;
}

async function viewAlldepartment() {
  const result = await query("SELECT * FROM department");
  console.table(result);
  init();
}

async function viewAllRole() {
  const result = await query(
    "SELECT role.id, title, department.name as department, salary FROM role JOIN department ON department.id = role.department_id"
  ); //join to show depertments instead of id
  console.table(result);
  init();
}

async function viewAllEmployees() {
  const result = await query(
    `SELECT e.id, CONCAT(e.first_name, " ", e.last_name) AS name, r.title, d.name AS department, CONCAT(e2.first_name, " ", e2.last_name) AS manager, r.salary FROM employee AS e JOIN role AS r ON e.role_id = r.id LEFT JOIN employee AS e2 ON e.manager_id = e2.id JOIN department AS d ON d.id = r.department_id ORDER BY e.id;`
  );
  console.table(result);
  init();
}

async function addARole() {
  const department = await query("SELECT id AS value,name FROM department");
  const questions = [
    {
      type: "input",
      name: "title",
      message: "Please tell me your new title!",
    },
    {
      type: "input",
      name: "salary",
      message: "Please tell me your new salary!",
    },
    {
      type: "list",
      name: "department_id",
      message: "Please tell me your new department!",
      choices: department,
    },
  ];
  const { title, salary, department_id } = await inquirer.prompt(questions);

  await query(
    "INSERT INTO role (title, salary, department_id) VALUES(?, ?, ?)",
    [title, salary, department_id]
  );
  viewAllRole();
}

async function addADepartment() {
  const questions = [
    {
      type: "Input",
      name: "name",
      message: "Please tell me your new department!",
    },
  ];
  const { name } = await inquirer.prompt(questions);

  await query("INSERT INTO department (name) VALUES(?)", [name]);
  viewAlldepartment();
}

async function addAEmployee() {
  const role = await query("SELECT title AS name, id AS value FROM role");
  const managers = await query(
    `SELECT CONCAT(first_name, " ", last_name) as name, id AS value FROM employee WHERE manager_id IS null`
  );

  const questions = [
    {
      type: "Input",
      name: "first_name",
      message: "Please tell me your new first name!",
    },
    {
      type: "Input",
      name: "last_name",
      message: "Please tell me your new first name!",
    },
    {
      type: "list",
      name: "role_id",
      message: "Please tell me your new role!",
      choices: role,
    },
    {
      type: "list",
      name: "manager_id",
      message: "Please tell me your new manager!",
      choices: managers,
    },
  ];
  const { first_name, last_name, role_id, manager_id } = await inquirer.prompt(
    questions
  );

  await query(
    "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES(?, ?, ?, ?)",
    [first_name, last_name, role_id, manager_id]
  );
  viewAllEmployees();
}

async function updateEmployeeRole() {
  const fullName = await query(
    `SELECT CONCAT(first_name, " ", last_name) as name, id AS value FROM employee`
  );
  const allRole = await query(`SELECT id AS value, title AS name FROM role`);

  const questions = [
    {
      type: "list",
      name: "name",
      message: "Please choose the employee you'd like to update.",
      choices: fullName,
    },
    {
      type: "list",
      name: "role_id",
      message: "Please choose the role you would like to assign.",
      choices: allRole,
    },
  ];

  const { name, role_id } = await inquirer.prompt(questions);

  await query("UPDATE employee SET role_id = ? WHERE id = ?", [role_id, name]);
  viewAllEmployees();
}

const quit = () => {
  console.log("Goodbye!");
  process.exit();
};

init();

//show manager on view all employee screen
