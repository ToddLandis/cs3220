// Include Scripts
/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function dropdownFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}
  
// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

/* dark mode function */
function darkModeFunction() {
  var element = document.body;
  var content = document.getElementsByClassName("modebtn");
  element.classList.toggle("dark-mode");
  content.innerText = "Light Mode";
}

class Course {
  constructor(term, year, courseDesignator, courseName, hours) {
    this.term = term;
    this.year = year;
    this.courseDesignator = courseDesignator;
    this.courseName = courseName;
    this.hours = hours;
  }
}
  
class Plan {
  constructor(planName, catalogueYear, major, studentName, semester, courses = []) {
    this.planName = planName;
    this.catalogueYear = catalogueYear;
    this.major = major;
    this.studentName = studentName;
    this.semester = semester;
    this.courses = courses;
  }
  addCourse(course) {
    this.courses.push(course);
  }
}
  
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
  request.open("GET","/~gallaghd/cs3220/termProject/getCombined.php",true);
  request.onreadystatechange = function() {
    if(this.readyState == 4) {
      var myData = this.responseText;
      console.log(myData);  //DEBUG
      json = JSON.parse(myData);
      newPlan = json.plan;
      newCatalog = json.catalog;

      //AJAXfunctions should go here ///////////////////////////////////////////////////////////////////

      make(convert(newPlan))

      // ACCORDIAN //////////////////////////////
      var request = new XMLHttpRequest();
      request.open("GET","/~gallaghd/cs3220/termProject/getRequirements.php",true);
      request.onreadystatechange = function() {
        if(this.readyState == 4) {
          var myData = this.responseText;
          console.log(myData); //DEBUG
          json = JSON.parse(myData);
          core = json.categories.Core.courses;
          electives = json.categories.Electives.courses;
          cognates = json.categories.Cognates.courses;

          html = document.getElementById('core');
          for (i in core) {
            html.append("<p>" + core[i] + ": " + newCatalog.courses[core[i]].name + "</p>");
          }
          html = document.getElementById('electives');
          for (i in electives) {
            html.append("<p>" + electives[i] + ": " + newCatalog.courses[electives[i]].name + "</p>");
          }
          html = document.getElementById('cognates');
          for (i in cognates) {
            html.append("<p>" + cognates[i] + ": " + newCatalog.courses[cognates[i]].name + "</p>");
          }
        }
      }
      request.send(null);

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
            column: [
              {data: 'id'},
              {data: 'name'},
              {data: 'description'},
              {data: 'credits'}
            ],
            "pageLength": 1000
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
        instring = instring.concat("<div class=\"semester\"><div class=\"term_head\"><h4>" + term + " " + year + "</h4>");
      } else {
        instring = instring.concat("<div class=\"semester\"><div class=\"term_head\"><h4>" + term + " " + (parseInt(year)+1).toString() + "</h4>");
      }

      // add hours to each term
      var hours = 0
      for (let course in thisTerm.courses) {
        thisCourse = thisTerm.courses[course];
        hours += newCatalog.courses[thisCourse.id].credits;
      }
      instring = instring.concat("<h5>Hours: " + hours + "</h5></div>")
      
      // add each course to the term
      for (let course in thisTerm.courses) {
        thisCourse = thisTerm.courses[course];
        instring = instring.concat("<p onfocus=\"\">" + thisCourse.id + ":  " + newCatalog.courses[thisCourse.id].name + "</p>");
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
