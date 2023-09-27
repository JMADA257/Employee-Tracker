INSERT INTO departments (name)
VALUES ("IT"),
       ("Front-End"),
       ("Back-End"),
       ("Management");

INSERT INTO role (title, salary, department_id)
VALUES ("Lead engineer", 140000, 1),
       ("Senior Dev", 120000, 2),
       ("Med Dev", 90000, 2),
       ("Junior Dev", 1000, 3),
       ("CEO", 400000, 4),
       ("Director", 150000, 1),
       ("Manager", 100000, 2);
       

INSERT INTO employee (first_name, last_name, roles_id, manager_id)
VALUES 
        ("Jordan", "Adams", 4, null),
        ("Jake", "Zook", 2, 1),
        ("Maisie", "Ciullo", 1, 1),
        ("Lillian", "E", 3, null),
        ("Pete", "Richards", 4, null),
        ("Jason", "Borne", 1, 3),
        ("Steven", "Rodriguez", 2, 6);


