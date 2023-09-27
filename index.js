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
      "View all departments.",
      "View all roles.",
      "View all employees.",
      "Add a department.",
      "Add a role.",
      "Add an employee.",
      "Delete an employee.",
      "Update an employee role.",
      "Quit.",
    ],
  },
];

async function init() {
  const { choice } = await inquirer.prompt(initQuestion);
  console.log(choice);
  switch (choice) {
    case "View all departments.":
      viewAllDepartments();
      break;
    case "View all roles.":
      viewAllRoles();
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
    case "Delete an employee.":
      deleteAnEmployee();
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

async function viewAllDepartments() {
  const result = await query("SELECT * FROM departments"); //join to show depertments instead of id
  console.table(result);
  init();
}

async function viewAllRoles() {
  const result = await query("SELECT * FROM role"); //join to show depertments instead of id
  console.table(result);
  init();
}

async function viewAllEmployees() {
  const result = await query("SELECT * FROM employee"); //join to show depertments instead of id
  console.table(result);
  init();
}

async function addARole() {
  const departments = await query("SELECT id AS value,name FROM departments");
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
      choices: departments,
    },
  ];
  const { title, salary, department_id } = await inquirer.prompt(questions);

  await query(
    "INSERT INTO role (title, salary, department_id) VALUES(?, ?, ?)",
    [title, salary, department_id]
  );
  viewAllRoles();
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

  await query("INSERT INTO departments (name) VALUES(?)", [name]);
  viewAllDepartments();
}

async function addAEmployee() {
  const roles = await query("SELECT title AS name, id AS value FROM role");
  const managers = await query(
    "SELECT CONCAT(first_name, last_name) as name, id AS value FROM employee WHERE manager_id IS null"
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
      name: "roles_id",
      message: "Please tell me your new role!",
      choices: roles,
    },
    {
      type: "list",
      name: "manager_id",
      message: "Please tell me your new manager!",
      choices: managers,
    },
  ];
  const { first_name, last_name, roles_id, manager_id } = await inquirer.prompt(
    questions
  );

  await query(
    "INSERT INTO employee (first_name, last_name, roles_id, manager_id) VALUES(?, ?, ?, ?)",
    [first_name, last_name, roles_id, manager_id]
  );
  viewAllEmployees();
}

async function updateEmployeeRole() {} //future

async function deleteAnEmployee() {} //Future

const quit = () => {
  console.log("Goodbye!");
  process.exit();
};

init();
