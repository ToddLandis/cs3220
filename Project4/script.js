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
var newCatalog;

function populate() {
  var request = new XMLHttpRequest();
  request.open("GET","/~tilandis/TermProject/Project4/getAll.php",true);
  request.onreadystatechange = function() {
    if(this.readyState == 4) {
      var myData = this.responseText;
      json = JSON.parse(myData);
      newPlan = json.plans[0];
      newCatalog = json.catalog;
      requirements = json.Requirements;
      
      student = newPlan.User_name;
      stu_ID = newPlan.User_ID;
      planName = newPlan.Plan_Name;
      major = newPlan.major;
      currentyear = newPlan.currYear;
      currentterm = newPlan.currTerm;

      info = document.getElementById("planinfo");
      var pinfo = "";
      pinfo = pinfo.concat("<p>Student: " + student + "<p/>");
      pinfo = pinfo.concat("<p>Plan Name: " + planName + "<p/>");
      pinfo = pinfo.concat("<p>Major: " + major + "<p/>");

      info.innerHTML = pinfo;


      //AJAXfunctions should go here ///////////////////////////////////////////////////////////////////

      make(convert(newPlan))

      // ACCORDIAN //////////////////////////////
      html = document.getElementById('accordion');
      var string = "";
      for (let cat in requirements) {
          console.log("DEBUG");
          string += '<div id="core" class="accordion-content"><h3>' + cat + '</h3>';
        /*
          core = json.categories.Core.courses;
          electives = json.categories.Electives.courses;
          cognates = json.categories.Cognates.courses;
          */
          for (i in requirements[cat]) {
            console.log("DEBUG2");
            string = string.concat("<p class=\"requirement\" tabindex=\"0\" id=\"req_" + requirements[cat][i].id + "\" draggable=\"true\" ondragstart=\"drag(event)\" ondragend=\"stopdrag(event)\">" + requirements[cat][i].id + ": " + requirements[cat][i].Title+ "</p>");
          }
          string += "</div>";
        /*
          string = "";
          html = document.getElementById('electives');
          for (i in electives) {
            string = string.concat("<p class=\"requirement\" tabindex=\"0\" id=\"req_" + electives[i] + "\" draggable=\"true\" ondragstart=\"drag(event)\" ondragend=\"stopdrag(event)\">" + electives[i] + ": " + newCatalog.courses[electives[i]].name + "</p>");
          }
          html.innerHTML = string;

          string = "";
          html = document.getElementById('cognates');
          for (i in cognates) {
            string = string.concat("<p class=\"requirement\" tabindex=\"0\" id=\"req_" + cognates[i] + "\" draggable=\"true\" ondragstart=\"drag(event)\" ondragend=\"stopdrag(event)\">" + cognates[i] + ": " + newCatalog.courses[cognates[i]].name + "</p>");
          }
          html.innerHTML = string;*/
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
  request.send(null);
}
  
function convert(plan) {
  
  var myYears = {};
  
  // create 4 years with semesters
  year = catalog.year
  for (i = year; i<year+4; i++) {
    myYears[year] = new Year();
    myYears[year].addTerm("Fall", new Term());
    myYears[year].addTerm("Spring", new Term());
    myYears[year].addTerm("Summer", new Term());
  }

  courses = plan.courses;
  for (let i in courses) {
    
    // Year object holds Fall of same year, but Spring and Summer of next year
    if (courses[i].term == "Fall") {
      year = courses[i].year
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
  //var years = convert(populate()); // had to change with async
  var instring = "";
  
  instring = instring.concat("<div class=\"profile\"></div>")

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
      }
      instring = instring.concat("<h5>Hours: " + hours + "</h5></div>")
      
      // add each course to the term
      for (let course in thisTerm.courses) {
        thisCourse = thisTerm.courses[course];
        instring = instring.concat("<p id=\"" + thisCourse.id + "\" draggable=\"true\" ondragstart=\"drag(event)\" ondragend=\"stopdrag(event)\" onmouseover=\"deleteoption(event)\" onmouseout=\"removedel(event)\">" + thisCourse.id + ":  " + newCatalog.courses[thisCourse.DBID].name + "</p>");
      }

      instring = instring.concat("</div>");
    }
    instring = instring.concat("</div>");
  }
  // set #UR to be dynamic
  doc = document.getElementById("UR");
  doc.innerHTML = instring;
}
  
// make(); // had to change with async
populate(); // main async function
// Anything that uses the AJAX data should be called in populate() at the location marked with a comment //AJAXfunctions


// write modified plan to the database
function savePlan() {
  return;
}
