const express = require("express");
const path=require("path");
const fs=require("fs");
const Department=require("./node/department");
const Employee=require("./node/employee");
const Role=require("./node/role");
var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "products_db"
});


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));


// Routes
// ===========================================================

app.get("/:route", function(req, res) {
    let route=req.params.route;
    res.sendFile(path.join(__dirname, `/public/${route}.html`));
});

connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }

  console.log("connected as id " + connection.threadId);
});



app.post("/admin/productadd/diaper", function(req, res) {

  let sent=req.body;
  
  let diaper1=new Diaper(sent.name, sent.price, sent.short, sent.long, sent.imgSrc, sent.imgAlt, sent.inventory, sent.style, sent.size, sent.print);
  
 
    createProduct(diaper1);
    
    res.end();
    
  });
  
  
  
  
  function createProduct(product){
    connection.query(
      "INSERT INTO products SET ?",
      product,
      function(err, res) {
        if (err) throw err;
        
      });
  
  }


 
  

app.post("/admin/productadd/wipe", function(req, res) {

let sent=req.body;

let wipe1=new Wipe(sent.name, sent.price, sent.short, sent.long, sent.imgSrc, sent.imgAlt, sent.inventory, sent.dimensions);


  createProduct(wipe1);
  res.end();

});




app.get("/admin/products", function(req, res) {
  connection.query("SELECT * FROM products", function(err, response) {
    if (err) throw err;

    res.json(response);
 
 

  });
});


app.post("/admin/productchange", function(req,res){

  
  connection.query(`UPDATE products SET ${req.body.value}="${req.body.input}" WHERE id = ${req.body.id}`, function(err,result){
    if(err) throw err;
    res.end();
  }
  
  )

});


app.get("/*", function(req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});


// Listener
// ===========================================================
app.listen(PORT, function() {
  console.log("App listening on PORT localhost:" + PORT);
});
