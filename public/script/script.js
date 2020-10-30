// These arrays will be used to construct the table that we display to the user when they request to see employee information.

let departmentInfo=["Id","Name"];
let roleInfo=["Id", "Title", "Salary", "Department Id" ];
let employeeInfo=["Id","First Name","Last Name","Role Id", "Manager Id"];
let returnData;

// When the add data button is clicked, we display a form to facilitate the adding of data.

$("#add-data").on("click",createAddDisplay);

// When the view data button is clicked, we will display a table of the information along with selectors that allow the user to focus their view.
$("#manage-data").on("click", function(){
    $.get("/view/information")
    .done(function(data){
        returnData=data;
        createInformationDisplay();
    });

});

// When the change data button is clicked we create new buttons to further prompt the user.
$("#change-data").on("click", createChangeDisplay);


// This creates new buttons with functionality to get more information from the user on what they want to change.
function createChangeDisplay(){
    $("#button-div").empty();
    $("#button-div").html(`<div class="col-md-4" id="change-department"><button type="button" class="btn btn-primary" >Change Departments</button></div>
    <div class="col-md-4" id="change-role"><button type="button" class="btn btn-primary" >Change Roles</button></div>
    <div class="col-md-4" id="change-employee"><button type="button" class="btn btn-primary" >Change Employees</button></div>`);

    $("#change-department").on("click", function(){
        getChangeInfo("department");});
    $("#change-role").on("click",function(){getChangeInfo("role");});
    $("#change-employee").on("click",function(){getChangeInfo("employee");});
}

// We will use this variables to keep track of the information that is available for the user to change.

let departmentData;
let roleData;
let employeeData;


// Get the current information on employees one table at a time.
function getChangeInfo(value){

    $.ajax({
        url: `/change/department`,
      })
    .then(function(data){
        departmentData=data;
       
        
        $.ajax({
            url: `/change/role`,
          })
        .then(function(data){
            roleData=data;

            $.ajax({
                url: `/change/employee`,
              })
            .then(function(data){
                employeeData=data;
            console.log(data);
                getMoreChangeInput(value);
            });
        });
    });
    
}

// After choosing if they want to change the department, role or employee data, the user will be prompted to say which one of these they want to change.  This will be done through dropdown select options so that they user will have to choose an existing option.
function getMoreChangeInput(value){
    $("#button-div").empty();
    let newSelect=$("<div>");

    let newHTML="";

    switch (value){

        case "department":
        for(let i=0; i < departmentData.length; i++){
            newHTML += `<option value=${i}> ${departmentData[i].name}</option>`;
        };
        break;
        case "role":
            for(let i=0; i < roleData.length; i++){
                let j=roleData[i].departmentId-1;
                newHTML += `<option value=${i}> ${roleData[i].title} of ${departmentData[j].name}</option>`;
            };
            break;
        case "employee":
            for(let i=0; i < employeeData.length; i++){
                newHTML += `<option value=${i}> ${employeeData[i].firstName} ${employeeData[i].lastName}</option>`;
            };
            break;

    }
    newSelect.html( `<form> <div class="form-group">
    <select class="form-control" id="${value}-change"><option> Select ${value}</option> ${newHTML}
    </select>
  </div> </form>`);
  $("#button-div").append(newSelect);
  switch (value){

    case "department":
        $(`#department-change`).on("change",function(e){
            e.preventDefault();
            changeTable(value, "name", this.value);
            $("#department-change").attr("disabled",true);
        });
    break;
    case "role":
        $(`#role-change`).on("change",function(){
            roleChange2(value, this.value);
            $("#role-change").attr("disabled",true);
        });
        break;
    case "employee":
        $(`#employee-change`).on("change",function(){
            employeeChange2(value, this.value);
            $("#employee-change").attr("disabled",true);
        });
        break;

}
}

// This create a text input that allows the user to type in the new value they wish to assign to whatever item they chose to change.

function changeTable(table, column, id){
    console.log(id);

    let newForm=$("<form>");
    newForm.addClass("form-inline");
    let newInput=$("<input>");
    newInput.attr("placeholder","Enter New Value");
    newInput.addClass("form-control mb-4 ml-1");
    newInput.attr("type","text");
    newInput.attr("id","new-value");
    newForm.append(newInput);
    let newButton=$("<button>");
    newButton.attr("type","submit");
    newButton.addClass("btn btn-primary mb-4 ml-1");
    newButton.text("Submit");
    newButton.attr("id","new-value-submit");
    newForm.append(newButton);

    $("#button-div").append(newForm);

    $("#new-value-submit").on("click",function(){
        updateName(table, column, id);
    })

}

// UpdateName send the information from the user to the server to allow for the informatoin to be updated in the database.

function updateName(table, column, id){
    let val=$("#new-value").val();
    $.post(`update/${table}/${column}`, { "id": id, "value": val }).done(function(){
        location.reload();
    })
}

// If the user wants to change role information, they will be prompted to say if htey want to change the title or the deparment.  If they choose title, we send them back up to the change table function above.  If they choose department, we send them to changeroledeptid to give them the available choices.

function roleChange2(table, id){

    
    let newForm=$("<form>");
    newForm.addClass("form-inline");
    let newInput=$("<select>");
    newInput.attr("placeholder","Enter New Value");
    newInput.addClass("form-control mb-4 ml-1");
    newInput.attr("type","text");
    newInput.attr("id","column-select");

    let newOption=$("<option>");
    newOption.text("Select");
    newOption.val("title"); 
    newInput.append(newOption);
    newOption=$("<option>");
    newOption.text("Title");
    newOption.val("title");
    newInput.append(newOption);
    newOption=$("<option>");
    newOption.text("Department");
    newOption.val("departmentId");
    newInput.append(newOption);


    newForm.append(newInput);
    $("#button-div").append(newForm);

    $(`#column-select`).on("change",function(e){
        e.preventDefault();
        if(this.value=="title"){
        changeTable(table, this.value, id);}else{
        changeRoleDeptId(table, "departmentId", id);
        }
        $("#column-select").attr("disabled",true);
    });

}

// Similar to the role change 2, we need more information if the user wishes to change the employee information.  We process name changes through the table change form above.  Otherwise, we will give them the available choices for role and manager.

function employeeChange2(table, id){
    let newForm=$("<form>");
    newForm.addClass("form-inline");
    let newInput=$("<select>");
    newInput.attr("placeholder","Enter New Value");
    newInput.addClass("form-control mb-4 ml-1");
    newInput.attr("type","text");
    newInput.attr("id","column-select");

    let newOption=$("<option>");
    newOption.text("Select");
    newOption.val("title"); 
    newInput.append(newOption);
    newOption=$("<option>");
    newOption.text("First Name");
    newOption.val("firstName");
    newInput.append(newOption);
    newOption=$("<option>");
    newOption.text("Last Name");
    newOption.val("lastName");
    newInput.append(newOption);
    newOption=$("<option>");
    newOption.text("Role");
    newOption.val("roleId");
    newInput.append(newOption);
    newOption=$("<option>");
    newOption.text("Manager");
    newOption.val("managerId");
    newInput.append(newOption);


    newForm.append(newInput);
    $("#button-div").append(newForm);

    $(`#column-select`).on("change",function(e){
        e.preventDefault();
        if($("#column-select").val()=="firstName" || $("#column-select").val()=="lastName" ){
        changeTable(table, this.value, id);}else if($("#column-select").val()=="roleId"){
            changeEmployeeRole(table, this.value, id);
        }else{
            changeEmployeeManager(table, this.value, id);
        }
        $("#column-select").attr("disabled",true);
    });
}

// Displays the options for change and collects the users wishes, then sends the change along to the server.

function changeRoleDeptId(table, column, id){
    let newForm=$("<form>");
    newForm.addClass("form-inline");
    let newInput=$("<select>");
    newInput.attr("placeholder","Enter New Value");
    newInput.addClass("form-control mb-4 ml-1");
    newInput.attr("id","dept-id-select");

    let newOption=$("<option>");
    newOption.text("Select");
    newOption.val("title"); 
    newInput.append(newOption);
    for(let i=0; i<departmentData.length; i++){
        newOption=$("<option>");
        newOption.text(departmentData[i].name);
        newOption.attr("value",i);
        newInput.append(newOption);
    }
    newForm.append(newInput);
    $("#button-div").append(newForm);

    $("#dept-id-select").on("change",function(){
        let val=$("#dept-id-select").val();
        $.post(`update/${table}/${column}`, { "id": id, "value": Number(val)+1 }).done(function(){
            location.reload();
        })

    })

}
// Displays the options for change and collects the users wishes, then sends the change along to the server.


function changeEmployeeRole(table, column, id){
    let newForm=$("<form>");
    newForm.addClass("form-inline");
    let newInput=$("<select>");
    newInput.attr("placeholder","Enter New Value");
    newInput.addClass("form-control mb-4 ml-1");
    newInput.attr("id","role-id-select");

    let newOption=$("<option>");
    newOption.text("Select");
    newOption.val(0); 
    newInput.append(newOption);
    for(let i=0; i<roleData.length; i++){
        newOption=$("<option>");
        newOption.text(`${roleData[i].title} of ${departmentData[Number(roleData[i].departmentId)-1].name}`);
        newOption.attr("value",i);
        newInput.append(newOption);
    }
    newForm.append(newInput);
    $("#button-div").append(newForm);

    $("#role-id-select").on("change",function(){
        let val=$("#role-id-select").val();
        $.post(`update/${table}/${column}`, { "id": id, "value": Number(val)+1 }).done(function(){
            location.reload();
        })

    })

}
// Displays the options for change and collects the users wishes, then sends the change along to the server.


function changeEmployeeManager(table, column, id){
    let newForm=$("<form>");
    newForm.addClass("form-inline");
    let newInput=$("<select>");
    newInput.attr("placeholder","Enter New Value");
    newInput.addClass("form-control mb-4 ml-1");
    newInput.attr("id","role-id-select");

    let newOption=$("<option>");
    newOption.text("Select");
    newOption.val(0); 
    newInput.append(newOption);
    for(let i=0; i<roleData.length; i++){
        newOption=$("<option>");
        newOption.text(`${employeeData[i].firstName} ${employeeData[i].lastName}`);
        newOption.attr("value",i);
        newInput.append(newOption);
    }
    newForm.append(newInput);
    $("#button-div").append(newForm);

    $("#role-id-select").on("change",function(){
        let val=$("#role-id-select").val();
        $.post(`update/${table}/${column}`, { "id": id, "value": Number(val)+1 }).done(function(){
            location.reload();
        })

    })


}

//  Displays more buttons after the user decides to add information so that it can be narrowed down to see if they want to add a department, role or employee.

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

// Displays the table of information joining all the tables we have in the database.  Also creates select options for viewing a subset of the total number of employees.  This includes viewing by department, manager or role.

function createInformationDisplay(){
    $("#form-container").empty();
    let newTable=$("<table>");
    let newRow=$("<tr>");
    for(const value in returnData[0]){
        let newCol=$("<th>");
        newCol.text(value);
        newRow.append(newCol);
    }
    newTable.append(newRow);
    $("#form-container").append(newTable);
    for(let i=0; i< returnData.length; i++){
        newRow=$("<tr>");
        for(const value in returnData[i]){
            let newCol=$("<th>");
            newCol.text(returnData[i][`${value}`]);
            newRow.append(newCol);
        }
        newTable.append(newRow);
    }

    viewSelectOptions();

    let newDiv=$("<div>");
    newDiv.addClass("row");
    let newDiv2=$("<div>");
    newDiv2.addClass("col-md-6");
    let newButton=$("<button>");
    newButton.text("Restart");
    newButton.addClass("btn btn-primary");
    newButton.on("click",function(e){
        e.preventDefault();
        location.reload();
    });
    newDiv2.append(newButton);
    newDiv.append(newDiv2);
    $("#form-container").append(newDiv);


}

// Uses viewselect to create all three selector inputs.

function viewSelectOptions(){
    let selectContainer=$("<div>");
    selectContainer.addClass("row");
    selectContainer.attr("id","select-container");
    $("#form-container").append(selectContainer);
    viewSelect("Department");
    viewSelect("Title");
    viewSelect("Manager");
    

}

// Creates the selector options based on input.

function viewSelect(value){

    let uniqueChoices=[];
    for(let i=0; i<returnData.length; i++){
        if(uniqueChoices.indexOf(returnData[i][`${value}`])==-1){
            uniqueChoices.push(returnData[i][`${value}`]);
        }
    }


    let newDiv=$("<div>");
    let newHTML="";
    for(let i=0; i< uniqueChoices.length; i++){
        newHTML+=`<option value="${uniqueChoices[i]}">${uniqueChoices[i]}</option>`;
    }

    newDiv.html( `<form> <div class="form-group">
    <label for="${value}-view">View ${value}</label>
    <select class="form-control" id="${value}-view"><option value=${uniqueChoices[0]}> Select ${value}</option>${newHTML}
    </select>
  </div> </form>`);
    newDiv.addClass("col-md-4");

    $("#select-container").append(newDiv);
    $(`#${value}-view`).on("change",function(){
        filteredEmployeeView(value, this.value);
    });


}

// Creates the filtered view based on the users choices.

function filteredEmployeeView(value, name){

    $("#form-container").empty();
    let newTable=$("<table>");
    let newRow=$("<tr>");
    for(const value in returnData[0]){
        let newCol=$("<th>");
        newCol.text(value);
        newRow.append(newCol);
    }
    newTable.append(newRow);
    $("#form-container").append(newTable);
    for(let i=0; i< returnData.length; i++){
 
        if(returnData[i][`${value}`]==name){
        newRow=$("<tr>");
        for(const value in returnData[i]){
            let newCol=$("<th>");
            newCol.text(returnData[i][`${value}`]);
            newRow.append(newCol);
        }
        newTable.append(newRow);
    }}

    viewSelectOptions();

    let newDiv=$("<div>");
    newDiv.addClass("row");
    let newDiv2=$("<div>");
    newDiv2.addClass("col-md-6");
    let newButton=$("<button>");
    newButton.text("Restart");
    newButton.addClass("btn btn-primary");
    newButton.on("click",function(e){
        e.preventDefault();
        location.reload();
    });
    newDiv2.append(newButton);
    newDiv.append(newDiv2);
    $("#form-container").append(newDiv);

}

// Create the form display that will be used by the user to fill out the required information to add data.

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
          sendToServer(info);
          location.reload();

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

// Sends the add information to the server through a post.

function sendToServer(info){
    let newInfo=[];
 for(let i=1; i<info.length; i++ ){
    newInfo.push($(`#newInput${i}`).val());
 }
 switch (info){
     case departmentInfo:
         let department={
             name: newInfo[0]
         }
        $.post("/department",department);
     break;
       
     case roleInfo:
         let role={
             title: newInfo[0],
             salary: newInfo[1],
             departmentId: newInfo[2] 
         }
        $.post("/role",role);
     break;

     case employeeInfo:
         let employee={
             firstName: newInfo[0],
             lastName: newInfo[1],
             roleId: newInfo[2],
             managerId: newInfo[3]
         }
         $.post("/employee",employee);
     break;
 }

}