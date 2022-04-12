class Year {
  constructor() {
    this.terms = {};
  }
  addTerm(key, term) {
    this.terms[key] = term;
  }
}
  
class Term {
  constructor(courses = []) {
    this.courses = courses;
    this.hours = 0;
  }
  addCourse(course) {
    this.courses.push(course);
  }
}

// Global Vars Needed
var newPlan;
var Plans;
var newCatalog;

function populate(plansOnly) {
  var request = new XMLHttpRequest();
  request.open("GET","/~tilandis/TermProject/Project4/getAll.php",true);
  request.onreadystatechange = function() {
    if(this.readyState == 4) {
      var myData = this.responseText;
      json = JSON.parse(myData);
      console.log(json); //DEBUG
      // Different plans selectable by changing index value
      Plans = json.plans;
      newPlan = json.plans[0];
      newCatalog = json.catalog;
      requirements = json.Requirements;
      
      student = newPlan.User_name;
      stu_ID = newPlan.User_ID;
      planName = newPlan.Plan_Name;
      major = newPlan.major;
      catYear = newPlan.Year;
      currentyear = newPlan.currYear;
      currentterm = newPlan.currTerm;

      planMenu = '<select id="planSelect" onchange="make(convert(document.getElementById(\'planSelect\').value));">';
      for (i in json.plans) {
        pname = json.plans[i].Plan_Name;
        planMenu = planMenu.concat('<option value="' + i + '">' + pname + '</option>');
      }
      planMenu = planMenu.concat('</select>');


      info = document.getElementById("planinfo");
      var pinfo = "";
      pinfo = pinfo.concat("<p>Student: " + student + "<p/>");
      pinfo = pinfo.concat("<p>Plan: " + planMenu + "<p/>");
      pinfo = pinfo.concat("<p>Major: " + major + "<p/>");
      pinfo = pinfo.concat("<p id='credits'></p>")
      info.innerHTML = pinfo;

      //FIXME When a different plan is selected from dropdown menu, it will have to run make(convert(newPlan)) again.

      //AJAXfunctions should go here ///////////////////////////////////////////////////////////////////

      make(convert(0));

      if (!plansOnly) {

        // ACCORDIAN //////////////////////////////
        html = document.getElementById('accordion');
        var string = "";
        for (let cat in requirements) {
            string += '<h3>' + cat + '</h3><div id="core" class="accordion-content">';
            for (i in requirements[cat]) {
              string = string.concat("<p class=\"notinplan\" tabindex=\"0\" id=\"req_" + requirements[cat][i].id + "\" data-hours=\"" + requirements[cat][i].credits + "\" draggable=\"true\" ondragstart=\"drag(event)\" ondragend=\"stopdrag(event)\">" + requirements[cat][i].id + ": " + requirements[cat][i].Title + "</p>");
            }
            string += "</div>";
        }
        html.innerHTML = string;

        // DATATABLES //////////////////////////////////////////////////
        data = newCatalog.courses;
        datatables = [];
        for (i in data) {
          row = data[i]
          datatables.push([row.id, row.name, row.description, row.credits]);
        }

        $(document).ready( function () {
          try {
            $('#table_id').DataTable({
              data: datatables,
              paging: false,
              info: false,
              column: [
                {data: 'id'},
                {data: 'name'},
                {data: 'description'},
                {data: 'credits'}
              ],
              "pageLength": 1000,
              // Add HTML5 draggable class to each row
              createdRow: function ( row, data, dataIndex, cells ) {
                  $(row).attr('class', 'fromTable');
                  $(row).attr('draggable', 'true');
                  $(row).attr('ondragstart', 'dragFromTable(event)');
                  $(row).attr('ondragend', 'stopdrag(event)');
              },
              language: {
                searchPlaceholder: "Search courses",
                search: "",
                
              }
            });
          }
          catch (e) {
            console.log("Whoops, that's an error");
          }

        } );
        
        //////////////////////////////////////////////////////////////////////////////////////////////////
      }
    }
  }
  request.send(null);
}
  
function convert(plannum) {
  plan = Plans[plannum]
  var myYears = {};

  // create 4 years with semesters
  year = plan.Year;
  for (i = year; i<year+4; i++) {
    myYears[i] = new Year();
    myYears[i].addTerm("Fall", new Term());
    myYears[i].addTerm("Spring", new Term());
    myYears[i].addTerm("Summer", new Term());
  }

  courses = plan.courses;
  for (let i in courses) {
    
    // Year object holds Fall of same year, but Spring and Summer of next year
    if (courses[i].term == "Fall") {
      year = courses[i].year;
    }
    else {
      year = (parseInt(courses[i].year) - 1).toString();
    }
    // if the year does not yet exist, make it
    if (!(year in myYears)) {
      myYears[year] = new Year();
    }
    // if the term does not yet exist, make it
    if (!(courses[i].term in myYears[year].terms)) {
      myYears[year].addTerm("Fall", new Term());
      myYears[year].addTerm("Spring", new Term());
      myYears[year].addTerm("Summer", new Term());
    }
    if (courses[i] !== undefined) {
      myYears[year].terms[courses[i].term].addCourse(courses[i]);
    }
  }
  return myYears;
}
  
function make(years) {
  var instring = "";
  instring = instring.concat("<div id=\"plan\">");
  instring = instring.concat("<div class=\"profile\"></div>")

  var totalHours = 0;
  for (let year in years) {
    thisYear = years[year];
    instring = instring.concat("<div class=\"years\">");
    
    for (let term in thisYear.terms) {
      thisTerm = thisYear.terms[term];

      // add header to the term
      if (term == "Fall") {
        instring = instring.concat("<div class=\"semester\" id=\"" + term + " " + year + "\" ondrop=\"drop(event)\" ondragover=\"allowDrop(event)\"><div class=\"term_head\"><h4>" + term + " " + year + "</h4>");
      } else {
        instring = instring.concat("<div class=\"semester\" id=\"" + term + " " + year + "\" ondrop=\"drop(event)\" ondragover=\"allowDrop(event)\"><div class=\"term_head\"><h4>" + term + " " + (parseInt(year)+1).toString() + "</h4>");
      }

      // add hours to each term
      var hours = 0
      for (let course in thisTerm.courses) {
        thisCourse = thisTerm.courses[course];
        hours += newCatalog.courses[thisCourse.DBID].credits;
        totalHours += newCatalog.courses[thisCourse.DBID].credits;
      }
      instring = instring.concat("<h5 id='hours'>Hours: " + hours + "</h5></div>")
      
      // add each course to the term
      for (let course in thisTerm.courses) {
        thisCourse = thisTerm.courses[course];
        instring = instring.concat("<p id=\"" + thisCourse.id + "\" data-hours=\"" + newCatalog.courses[thisCourse.DBID].credits + "\" draggable=\"true\" ondragstart=\"drag(event)\" ondragend=\"stopdrag(event)\" onmouseover=\"deleteoption(event)\" onmouseout=\"removedel(event)\">" + thisCourse.id + ":  " + newCatalog.courses[thisCourse.DBID].name + "</p>");
      }

      instring = instring.concat("</div>");
    }
    instring = instring.concat("</div>");
  }
  instring = instring.concat("</div><p id=\"statusbar\" class=\"invisible\"></p>");
  document.getElementById("credits").innerText = "Credits: " + totalHours; 
  // set #UR to be dynamic
  doc = document.getElementById("UR");
  doc.innerHTML = instring;
}

// make(); // had to change with async
populate(false); // main async function
// Anything that uses the AJAX data should be called in populate() at the location marked with a comment //AJAXfunctions

// Update when they change the plan
/*
document.getElementById("planSelect").onchange = function(){
  populate(document.getElementById("planSelect").value);
 };
*/
