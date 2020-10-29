use qnyiufk171nohtty;

CREATE TABLE role (
  -- Creates a numeric column called "id" which will automatically increment its default value as we create new rows --
  id INT AUTO_INCREMENT NOT NULL,
  -- Makes a string column called "title" which cannot contain null --
  title VARCHAR(30),   
    --  Makes a decimal value called salary --
  salary DECIMAL,
  -- To link to department--
  departmentId INT, 
	createdAt TIMESTAMP NOT NULL,
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
  createdAt TIMESTAMP NOT NULL,
  PRIMARY KEY (id)
);

-- Creates the table "department" within employee-tracker --
CREATE TABLE department (
  -- Creates a numeric column called "id" which will automatically increment its default value as we create new rows --
  id INT AUTO_INCREMENT NOT NULL,
  -- Makes a string column called "name" which cannot contain null --
  name VARCHAR(50) NOT NULL,
    createdAt TIMESTAMP NOT NULL,

  PRIMARY KEY (id)
);

ALTER TABLE department MODIFY COLUMN createdAt TIMESTAMP NOT NULL DEFAULT current_timestamp;
ALTER TABLE role MODIFY COLUMN createdAt TIMESTAMP NOT NULL DEFAULT current_timestamp;
ALTER TABLE employee MODIFY COLUMN createdAt TIMESTAMP NOT NULL DEFAULT current_timestamp;