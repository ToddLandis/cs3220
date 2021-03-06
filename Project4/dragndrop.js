// global variable stack
var changestack = [];

function allowDrop(ev) {
    ev.preventDefault();
  }
  
  function drag(ev) {
    // the data being transferred by drag is the element id
    ev.dataTransfer.setData("text", ev.target.id);
    // if the element is in the plan, then take the element out of where it's being moved from
    if (!ev.target.classList.contains('requirement')) {
      setTimeout(() => {
        ev.target.classList.add('hide');
      }, 0);

      var plan = document.getElementById('planSelect').options[document.getElementById('planSelect').value].text; //FIXME
      console.log("Insert Plan: " + plan); //DEBUG
      var course = ev.target.id;
      var term = ev.target.parentNode.id.substring(0, ev.target.id.search(" "));
      var year = ev.target.parentNode.id.substring(ev.target.id.search(" "));
  
      changestack.push({'change':'delete','plan':plan,'course':course,'year':year,'term':term});
      // DEBUG
      console.log("removed " + course + " from "  + ev.target.parentNode.id);
    }
  }

  function dragFromTable(ev) {
    var row = ev.target;
    var rowdata = row.firstChild.innerText + ": " + row.childNodes[1].innerText;
    var newid = "table_" + rowdata;
    ev.dataTransfer.setData('text', newid);
 
    ghostEle = document.createElement('p');
    ghostEle.classList.add('dragging');
    ghostEle.innerHTML = rowdata;
    ghostEle.style.backgroundColor = "var(--highlight)";
    ghostEle.style.width = "fit-content";
    ghostEle.id = "ghost";

    // Append it to `body`
    document.body.appendChild(ghostEle);


    // Customize the drag image
    ev.dataTransfer.setDragImage(ghostEle, 0, 0);
  }

  function stopdrag(ev) {
    ev.target.classList.remove('hide');
    if (document.body.contains(document.getElementById("ghost"))) {
      ghost = document.getElementById("ghost");
      ghost.remove();
    }
  }

  function drop(ev) {
    ev.preventDefault();
    var transdata = ev.dataTransfer.getData("text");
    var data;
    
    if (transdata.substring(0,6) === "table_") {
      data = document.createElement("p");
      data.innerText = transdata.substring(6);
      data.id = "req_" + transdata.substring(6, transdata.search(":"));
      data.setAttribute("draggable", "true");
      data.setAttribute("ondragstart", "drag(event)");
      data.setAttribute("ondragend", "stopdrag(event)");
      data.classList.add("requirement");
    }
    else {
      data = document.getElementById(transdata);
    }

    if (data.classList.contains("requirement")) {
      // if the class is not already in the plan, allow it to be added
      if (!document.body.contains(document.getElementById(data.id.substring(4)))) {
        var oldId = data.id;
        data = data.cloneNode(true);
        data.id = oldId.substring(4);

        data.setAttribute("onmouseover", "deleteoption(event)");
        data.setAttribute("onmouseout", "removedel(event)");
        data.classList.remove("requirement");
      }
      else {
        return;
      }
    }

    var parentSemester;
    // special cases for dropping class on other elements
    if (ev.target.getAttribute("draggable") == "true")
        parentSemester = ev.target.parentNode;
    else if (ev.target.parentNode.classList.contains("term_head"))
        parentSemester = ev.target.parentNode.parentNode;
    else if (ev.target.classList.contains("term_head"))
        parentSemester = ev.target.parentNode;
    else 
        parentSemester = ev.target;

    parentSemester.appendChild(data);

    var plan = document.getElementById('planSelect').options[document.getElementById('planSelect').value].text; //FIXME
    console.log("Insert Plan: " + plan); //DEBUG
    var course = data.id;
    var term = parentSemester.id.substring(0, parentSemester.id.search(" "));
    var year = parentSemester.id.substring(parentSemester.id.search(" "));
    
    changestack.push({'change':'insert','plan':plan,'course':course,'year':year,'term':term});
    // DEBUG
    console.log("inserted " + course + " to "  + parentSemester.id);
  }

  function deleteoption(ev) {
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
    console.log("Insert Plan: " + plan); //DEBUG
    var course = oldclass.id;
    var term = oldclass.parentNode.id.substring(0, ev.target.id.search(" "));
    var year = oldclass.parentNode.id.substring(ev.target.id.search(" "));

    changestack.push({'change':'delete','plan':plan,'course':course,'year':year,'term':term});
    // DEBUG
    console.log("removed " + course + " from "  + oldclass.parentNode.id);

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
}
