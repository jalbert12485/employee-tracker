let departmentInfo=["Id","Name"];
let roleInfo=["Id", "Title", "Salary", "Department Id" ];
let employeeInfo=["Id","First Name","Last Name","Role Id", "Manager Id"];
let returnData;

$("#add-data").on("click",createAddDisplay);
$("#manage-data").on("click", function(){
    $.get("/view/information")
    .done(function(data){
        returnData=data;
        createInformationDisplay();
    });

});
$("#change-data").on("click", createChangeDisplay);

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

let departmentData;
let roleData;
let employeeData;

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
                newHTML += `<option value=${i}> ${employeeData[i].firstName} of ${employeeData[i].lastName}</option>`;
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
            departmentChangeTable(this.value);
            $("#department-change").attr("disabled",true);
        });
    break;
    case "role":
        $(`#role-change`).on("change",function(){
            roleChange2(this.value);
            $("#role-change").attr("disabled",true);
        });
        break;
    case "employee":
        $(`#employee-change`).on("change",function(){
            employeeChange2(this.value);
            $("#employee-change").attr("disabled",true);
        });
        break;

}
}


function departmentChangeTable(id){
    

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
        updateDepartmentName(id);
    })

}

function updateDepartmentName(id){
    let val=$("#new-value").val();
    $.post("update/department/name", { "id": id, "value": val }).done(function(){
        location.reload();
    })
}

function roleChange2(id){
    console.log("Role ID "+ id);
}

function employeeChange2(id){
    console.log("Employee ID "+ id);
}


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

function viewSelectOptions(){
    let selectContainer=$("<div>");
    selectContainer.addClass("row");
    selectContainer.attr("id","select-container");
    $("#form-container").append(selectContainer);
    viewSelect("Department");
    viewSelect("Title");
    viewSelect("Manager");
    

}


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