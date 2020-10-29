DROP DATABASE IF EXISTS employee_tracker;
-- Creates the "employee_tracker" database --
CREATE DATABASE employee_tracker;

-- Makes it so all of the following code will affect employee_tracker--
USE employee_tracker;

-- Creates the table "role" within employee-tracker --
CREATE TABLE role (
  -- Creates a numeric column called "id" which will automatically increment its default value as we create new rows --
  id INT AUTO_INCREMENT NOT NULL,
  -- Makes a string column called "title" which cannot contain null --
  title VARCHAR(30),   
    --  Makes a decimal value called salary --
  salary DECIMAL,
  -- To link to department--
  department_id INT, 
  PRIMARY KEY (id)
);

-- Creates the table "department" within employee-tracker --
CREATE TABLE employee (
  -- Creates a numeric column called "id" which will automatically increment its default value as we create new rows --
  id INT AUTO_INCREMENT NOT NULL,
  -- Makes a string column called "name" which cannot contain null --
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INT,
  manager_id INT,
  PRIMARY KEY (id)
);

-- Creates the table "department" within employee-tracker --
CREATE TABLE department (
  -- Creates a numeric column called "id" which will automatically increment its default value as we create new rows --
  id INT AUTO_INCREMENT NOT NULL,
  -- Makes a string column called "name" which cannot contain null --
  name VARCHAR(50) NOT NULL,

  PRIMARY KEY (id)
);

-- Creates new rows containing data in all named columns --
INSERT INTO department (name)
VALUES ("Math");

INSERT INTO department (name)
VALUES ("Computer Science");

INSERT INTO role (title, salary, department_id)
VALUES ("Professor", 50000, 1);

INSERT INTO role (title, salary, department_id)
VALUES ("Teaching Assistant", 20000, 1);

INSERT INTO role (title, salary, department_id)
VALUES ("Professor", 60000, 2);

INSERT INTO role (title, salary, department_id)
VALUES ("Teaching Assistant", 25000, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Justin", "Albert", 1, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Paula", "Johnson", 3, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Arthur", "Albert", 2, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Teddy", "Albert", 4, 2);

SELECT * FROM employee JOIN role
	ON (employee.role_id = role.id)
    JOIN department ON (role.department_id=department.id);
    
