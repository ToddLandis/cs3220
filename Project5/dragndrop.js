// global variable stack
var changestack = [];

// transferData format
//    from other semester:  [courseid]-from:[semesterid]
//    from requirements:    req_[courseid],[hours]
//    from table:           tab_[courseid]

function allowDrop(ev) {
    ev.preventDefault();
}
  
function drag(ev) {

  ev.dataTransfer.setData("text", ev.target.id);
  // if the element is in the plan, then take the element out of where it's being moved from
  if (!ev.target.classList.contains('notinplan')) {
    setTimeout(() => {
      ev.target.classList.add('hide');
    }, 0);

    // add to the dataTransfer where this data came from
    var parentSem = ev.target.parentNode;
    var transdata = ev.target.id + "-from:" + parentSem.id
    ev.dataTransfer.setData("text", transdata);
  }
}

function dragFromTable(ev) {
  var row = ev.target;
  var rowdata = row.firstChild.innerText + ": " + row.childNodes[1].innerText;
  var hours = row.childNodes[3].innerText;
  var newid = "tab_" + rowdata;
  var transdata = newid + "," + hours;
  ev.dataTransfer.setData('text', transdata);

  // make the drag image
  ghostEle = document.createElement('p');
  ghostEle.classList.add('dragging');
  ghostEle.innerHTML = rowdata;
  ghostEle.style.backgroundColor = "var(--highlight)";
  ghostEle.style.width = "fit-content";
  ghostEle.id = "ghost";

  // Append it to body
  document.body.appendChild(ghostEle);

  // Customize the drag image
  ev.dataTransfer.setDragImage(ghostEle, 0, 0);
}

function stopdrag(ev) {
  // get rid of drag image
  ev.target.classList.remove('hide');
  if (document.body.contains(document.getElementById("ghost"))) {
    ghost = document.getElementById("ghost");
    ghost.remove();
  }
}

function drop(ev) {
  ev.preventDefault();
  var transdata = ev.dataTransfer.getData("text");
  // data holds the p element of the course
  var data;
  
  // make sure data is the correct element
  if (transdata.includes("tab_")) {
    data = document.createElement("p");
    data.innerText = transdata.substring(4, transdata.search(","));
    data.id = transdata.substring(0, transdata.search(":"));
    var hours = transdata.substring(transdata.search(",")+1);
    data.setAttribute("data-hours", hours);
    data.setAttribute("draggable", "true");
    data.setAttribute("ondragstart", "drag(event)");
    data.setAttribute("ondragend", "stopdrag(event)");
    data.classList.add("notinplan");
  }
  else if (transdata.includes("-from:")) {
    var id = transdata.substring(0,transdata.search("-from:"));
    data = document.getElementById(id);
  }
  else {
    data = document.getElementById(transdata);
  }

  // if the class is not already in the plan, allow it to be added
  if (data.classList.contains("notinplan")) {
    if (!document.body.contains(document.getElementById(data.id.substring(4)))) {
      var oldId = data.id;
      data = data.cloneNode(true);
      // get rid of tab_ or req_
      data.id = oldId.substring(4);

      data.setAttribute("onmouseover", "deleteoption(event)");
      data.setAttribute("onmouseout", "removedel(event)");
      data.classList.remove("notinplan");

      var coursehours = data.getAttribute("data-hours");
      var credits_html = document.getElementById("credits");
      var old_credits = credits_html.innerText.substring(9);
      var new_credits = (parseInt(old_credits) + parseInt(coursehours)).toString();
      credits_html.innerText = "Credits: " + new_credits;
    }
    else {
      statusMessage("Course " + data.id.substring(4) + " is already in the plan");
      return;
    }
  }

  // special cases for dropping class on other elements
  var parentSemester;
  if (ev.target.getAttribute("draggable") == "true")
      parentSemester = ev.target.parentNode;
  else if (ev.target.parentNode.classList.contains("term_head"))
      parentSemester = ev.target.parentNode.parentNode;
  else if (ev.target.classList.contains("term_head"))
      parentSemester = ev.target.parentNode;
  else 
      parentSemester = ev.target;

  // transfer class over
  parentSemester.appendChild(data);

  // add hours to new semester
  var credits = data.getAttribute("data-hours");
  var hours_html = parentSemester.firstChild.childNodes[1];
  var sem_hours = hours_html.innerText.substring(hours_html.innerText.search(" "));
  hours_html.innerText = "Hours: " + (parseInt(sem_hours) + parseInt(credits)).toString();

  // remove hours from old semester
  if (transdata.includes("-from:")) {
    var old_sem = document.getElementById(transdata.substring(transdata.search("-from:")+6));
    var old_hours_html = old_sem.firstChild.childNodes[1];
    var old_sem_hours = old_hours_html.innerText.substring(hours_html.innerText.search(" "));
    old_hours_html.innerText = "Hours: " + (parseInt(old_sem_hours) - parseInt(credits)).toString();

    // push delete to stack
    var plan = document.getElementById('planSelect').options[document.getElementById('planSelect').value].text; 
    var course = ev.target.id;
    var term = old_sem.id.substring(0, ev.target.id.search(" "));
    var year = old_sem.id.substring(ev.target.id.search(" "));

    changestack.push({'change':'delete','plan':plan,'course':course,'year':year,'term':term});
  }

  // push insert to stack
  console.log("I pushed!")
  var plan = document.getElementById('planSelect').options[document.getElementById('planSelect').value].text; //FIXME
  var course = data.id;
  var term = parentSemester.id.substring(0, parentSemester.id.search(" "));
  var year = parentSemester.id.substring(parentSemester.id.search(" "));
  
  changestack.push({'change':'insert','plan':plan,'course':course,'year':year,'term':term});
}

function deleteoption(ev) {
  // create the remove button
  if (!document.contains(document.getElementById("rbtn"))) {
    var removebtn = document.createElement("button");
    removebtn.id = "rbtn";
    removebtn.innerText = "Remove";
    removebtn.setAttribute("onclick", "removeclass(event)");
    removebtn.style.border = "none";
    removebtn.style.backgroundColor = "var(--highlight)";
    removebtn.style.color = "var(--ur-color)";
    removebtn.style.marginLeft = "10px";
    removebtn.style.padding = "0";
    removebtn.style.cursor = "pointer";
    removebtn.style.fontSize = "0.7em";

    ev.target.appendChild(removebtn);
  }
}

function removedel(ev) {
  // remove the remove button
  if (document.contains(document.getElementById("rbtn"))) {
    if(!$("#rbtn:hover").length != 0 && !$("#rbtn:hover").length != 0) {
      var removebtn = document.getElementById("rbtn");
      removebtn.remove();
    }
  }
}

function removeclass(ev) {
  var oldclass = document.getElementById(ev.target.parentNode.id);
  
  var plan = document.getElementById('planSelect').options[document.getElementById('planSelect').value].text; //FIXME
  var course = oldclass.id;
  var term = oldclass.parentNode.id.substring(0, ev.target.id.search(" "));
  var year = oldclass.parentNode.id.substring(ev.target.id.search(" "));

  // push change to stack
  changestack.push({'change':'delete','plan':plan,'course':course,'year':year,'term':term});

  // change the hours
  var coursehours = oldclass.getAttribute("data-hours");
  var hourshtml = oldclass.parentNode.childNodes[0].childNodes[1]
  var oldsemesterhours = hourshtml.innerText.substring(7);
  var newsemesterhours = (parseInt(oldsemesterhours) - parseInt(coursehours)).toString();
  hourshtml.innerText = "Hours: " + newsemesterhours;

  var credits_html = document.getElementById("credits");
  var old_credits = credits_html.innerText.substring(9);
  var new_credits = (parseInt(old_credits) - parseInt(coursehours)).toString();
  credits_html.innerText = "Credits: " + new_credits;

  // remove the class
  oldclass.remove()
}

// write modified plan to the database
function savePlan() {
  console.log("Changestack: " + changestack); //DEBUG
  var dataString = JSON.stringify(changestack);
  console.log("JSON Data: " + dataString); //DEBUG
  
  $.ajax({
    url: 'updatePlan.php',
    data: {myData: dataString},
    type: 'POST'
  });
  changestack = [];

  statusMessage("Plan Saved");
}

function revertPlan() {
  changestack = [];
  var loadPlanOnly = true;
  populate(loadPlanOnly);
}

function statusMessage(message) {
  var status = document.getElementById("statusbar");
  status.innerText = message;
  status.style.transition = "none";
  status.classList.remove("invisible");
  setTimeout(function () {  
    status.style.transition = "opacity 0.3s linear 0s";
    status.classList.add("invisible");
  }, 2500);
}