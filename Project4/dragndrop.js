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
    ghostEle.style.backgroundColor = "#d3d3d3";
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

    if (ev.target.getAttribute("draggable") == "true")
        ev.target.parentNode.appendChild(data);
    else if (ev.target.parentNode.classList.contains("term_head"))
        ev.target.parentNode.parentNode.appendChild(data);
    else if (ev.target.classList.contains("term_head"))
        ev.target.parentNode.appendChild(data);
    else 
        ev.target.appendChild(data);
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
    oldclass.remove()
  }
