let departmentInfo=["Id","Name"];
let roleInfo=["Id", "Title", "Salary", "Department Id" ];
let employeeInfo=["Id","First Name","Last Name","Role Id", "Manager Id"];

$("#add-data").on("click",createAddDisplay);
$("#manage-data").on("click", createManageDisplay);

function createAddDisplay(){
    $("#button-div").empty();
    $("#button-div").html(`<div class="col-md-4" id="add-department"><button type="button" class="btn btn-primary" >Add Department</button></div>
    <div class="col-md-4" id="add-role"><button type="button" class="btn btn-primary" >Add Role</button></div>
    <div class="col-md-4" id="add-employee"><button type="button" class="btn btn-primary" >Add Employee</button></div>`);

    $("#add-department").on("click", function(){
        addDisplay(departmentInfo);});
    $("#add-role").on("click",function(){addDisplay(roleInfo);});
    $("#add-employee").on("click",function(){addDisplay(employeeInfo);});

}


function createManageDisplay(){
    $("#button-div").empty();
    $("#button-div").html(`<div class="col-md-4" id="manage-department"><button type="button" class="btn btn-primary" >Manage Departments</button></div>
    <div class="col-md-4" id="manage-role"><button type="button" class="btn btn-primary" >Manage Roles</button></div>
    <div class="col-md-4" id="manage-employee"><button type="button" class="btn btn-primary" >Manage Employee</button></div>`);
}

function addDisplay(info){

        $("#form-container").empty();
        for(let i=0; i< info.length; i++){
            if(info[i] != "Id"){
          let newDiv=$("<div>");
          newDiv.addClass("form-group");
          let newLabel=$("<label>");
          newLabel.attr("for",`newInput${i}`);
          newLabel.text(info[i]);
          
          newDiv.append(newLabel);
      
          let newInput=$("<input>");
          newInput.attr("type","text");
          newInput.addClass("form-control");
          newInput.attr("id",`newInput${i}`);
          newInput.attr("placeholder",`Enter ${info[i]}`);
      
          newDiv.append(newInput);
          $("#form-container").append(newDiv);
        }
    }
      
        let newRow=$("<div>");
        newRow.addClass("row");
      
        let newCol=$("<div>");
        newCol.addClass("col-md-6")
      
        let newButton1=$("<button>");
        newButton1.attr("type","button");
        newButton1.attr("id","form-submit");
        newButton1.addClass("btn btn-primary");
        newButton1.text("Submit");
        newButton1.on("click", function(event){
          event.preventDefault();
        //   sendNewWipe();
        //   location.reload();
        });
          newCol.append(newButton1);
          newRow.append(newCol);
        let newCol2=$("<div>");
        newCol2.addClass("col-md-6");
        let newButton2=$("<button>");
        newButton2.attr("type","button");
        newButton2.text("Restart");
        newButton2.addClass("btn btn-primary");
        newButton2.on("click",function(){
          location.reload();
        });
        newCol2.append(newButton2);
        newRow.append(newCol2);
      
      
          $("#form-container").append(newRow);
       
      
      
}