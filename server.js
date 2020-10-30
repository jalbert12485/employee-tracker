// Constant to give the required packages.

const express = require("express");
const path=require("path");
const fs=require("fs");
var mysql = require("mysql");

//  Provides the connection to the database.  Within the if else statement, the if covers if we are viewing the work on heroku and using the JAWSDB database.  Otherwise, it will connect to the local database.
var connection;
if(process.env.JAWSDB_URL){
  connection=mysql.createConnection(process.env.JAWSDB_URL);
}else{
  connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "employee_tracker"
});};

// constants to allow for easier use of express.
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));


// Routes
// ===========================================================

// This get request sends all stored employee information in a nice way for the user.  That is, instead of numberd ids, we display the names of the corresponding people, departments or roles using the join of tables.

app.get("/view/information", function(req, res) {
  connection.query(`SELECT Concat(employee.firstName,' ',employee.lastName) as Name, role.title as Title, role.salary as Salary, department.name as Department, Concat(emp.firstName,' ',emp.lastName) as Manager FROM employee JOIN role
	ON (employee.roleId = role.id)
    JOIN department ON (role.departmentId=department.id)
    Join employee as emp on (employee.managerId=emp.id);`, function(err, response) {
    if (err) throw err;
      
    res.json(response);
 
 

  });
});

// In order to change data, we will first need to get the data so that the user will know what can be changed.

app.get("/change/:value", function(req, res){
    let value=req.params.value;  
  
  connection.query(`SELECT * FROM ${value}`, function(err, response){
    if (err) throw err;
    res.json(response);
  });
});


// This post allows us to add information into any table (which we call category here) by using the object which we sent to it.

app.post("/:category", function(req,res){

    let category=req.params.category;

    connection.query(
        `INSERT INTO ${category} SET ?`,
        req.body,
        function(err, res) {
          if (err) throw err;
          
        });

    res.end();

});

// When changing information, the user will send the table, column id and desired value.  We then used these to update the table in the database.

app.post("/update/:table/:column", function(req,res){
  let table=req.params.table;
  let column=req.params.column;
  let id=Number(req.body.id)+1;
  let value=req.body.value;

  console.log(`UPDATE ${table}  SET ${column}="${value}" where id=${id};`);

  connection.query(
    `UPDATE ${table}  SET ${column}="${value}" where id=${id};`,
    function(err, response) {
      if (err) throw err;
      res.end();
    });
  
});

// A general get to show the user the starting page (index.html).

app.get("/*", function(req, res) {
    res.sendFile(path.join(__dirname, `/public/index.html`));
});


// Listener
// ===========================================================
app.listen(PORT, function() {
  console.log("App listening on PORT http://localhost:" + PORT);
});
