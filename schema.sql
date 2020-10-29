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
  departmentId INT, 
  PRIMARY KEY (id)
);

-- Creates the table "department" within employee-tracker --
CREATE TABLE employee (
  -- Creates a numeric column called "id" which will automatically increment its default value as we create new rows --
  id INT AUTO_INCREMENT NOT NULL,
  -- Makes a string column called "name" which cannot contain null --
  firstName VARCHAR(30),
  lastName VARCHAR(30),
  roleId INT,
  managerId INT,
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

INSERT INTO role (title, salary, departmentId)
VALUES ("Professor", 50000, 1);

INSERT INTO role (title, salary, departmentId)
VALUES ("Teaching Assistant", 20000, 1);

INSERT INTO role (title, salary, departmentId)
VALUES ("Professor", 60000, 2);

INSERT INTO role (title, salary, departmentId)
VALUES ("Teaching Assistant", 25000, 2);

INSERT INTO employee (firstName, lastName, roleId, managerId)
VALUES ("Justin", "Albert", 1, 1);

INSERT INTO employee (firstName, lastName, roleId, managerId)
VALUES ("Paula", "Johnson", 3, 2);

INSERT INTO employee (firstName, lastName, roleId, managerId)
VALUES ("Arthur", "Albert", 2, 1);

INSERT INTO employee (firstName, lastName, roleId, managerId)
VALUES ("Teddy", "Albert", 4, 2);

SELECT employee.firstName, emp.firstName FROM employee JOIN employee as emp on (employee.managerId=emp.id);

SELECT Concat(employee.firstName,' ',employee.lastName) as Name, role.title as Title, role.salary as Salary, department.name as Department, Concat(emp.firstName,' ',emp.lastName) as Manager FROM employee JOIN role
	ON (employee.roleId = role.id)
    JOIN department ON (role.departmentId=department.id)
    Join employee as emp on (employee.managerId=emp.id);
    

 
    

    
