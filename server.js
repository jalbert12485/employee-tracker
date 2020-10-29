const express = require("express");
const path=require("path");
const fs=require("fs");
var mysql = require("mysql");


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
  password: "root",
  database: "employee_tracker"
});};


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));


// Routes
// ===========================================================

app.get("/view/information", function(req, res) {
  connection.query(`SELECT Concat(employee.firstName,' ',employee.lastName) as Name, role.title as Title, role.salary as Salary, department.name as Department, Concat(emp.firstName,' ',emp.lastName) as Manager FROM employee JOIN role
	ON (employee.roleId = role.id)
    JOIN department ON (role.departmentId=department.id)
    Join employee as emp on (employee.managerId=emp.id);`, function(err, response) {
    if (err) throw err;
      
    res.json(response);
 
 

  });
});

app.get("/change/:value", function(req, res){
    let value=req.params.value;  
  
  connection.query(`SELECT * FROM ${value}`, function(err, response){
    if (err) throw err;
    res.json(response);
  });
});


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

app.post("/update/:table/:column", function(req,res){
  let table=req.params.table;
  let column=req.params.column;
  let id=req.body.id+1;
  let value=req.body.value;

  connection.query(
    `UPDATE ${table}  SET ${column}="${value}" where id=${id};`,
    function(err, response) {
      if (err) throw err;
      res.end();
    });
  
});


app.get("/*", function(req, res) {
    res.sendFile(path.join(__dirname, `/public/index.html`));
});


// Listener
// ===========================================================
app.listen(PORT, function() {
  console.log("App listening on PORT http://localhost:" + PORT);
});
