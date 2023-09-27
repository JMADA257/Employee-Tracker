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
      "view all departments",
      "view all roles",
      "view all employees",
      "add a department",
      "add a role",
      "add an employee",
      //   "update an employee role",
      "quit",
    ],
  },
];

async function init() {
  const { choice } = await inquirer.prompt(initQuestion);
  console.log(choice);
  switch (choice) {
    case "view all departments":
      viewAllDepartments();
      break;
    case "view all roles":
      viewAllRoles();
      break;
    case "view all employees":
      viewAllEmployees();
      break;
    case "add a department":
      addADepartment();
      break;
    case "add a role":
      addARole();
      break;
    case "add an employee":
      addAEmployee();
      break;
    // case "update an employee role":
    //   statements;
    //   break;
    case "quit":
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
  ];
  const { first_name, last_name } = await inquirer.prompt(questions);

  await query("INSERT INTO employee (first_name, last_name) VALUES(?, ?)", [
    first_name,
    last_name,
  ]);
  viewAllEmployees();
}

async function quit() {
  console.log("goodbye");
  return;
}

init();
