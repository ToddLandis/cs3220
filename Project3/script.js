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
  
  function populate() {
    var request = new XMLHttpRequest();
	request.open("GET","/~gallaghd/cs3220/termProject/getCombined.php",true); //FIXME myURL
	request.onreadystatechange = function() {
		if(this.readyState == 4) {
			var myData = request.responseText;
			return myData; //FIXME
		}
	}
	request.send();
  response = request.responseText;
	console.debug("responseText: " + request.responseText);
	/*
	var jsonResponse = response.responseText;
	var addressObject = JSON.parse ( jsonResponse );

	AJAX slide 22+
	*/
	
    
    return eval("(" + response+ ")");
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
  
  function make() {
    var years = convert(populate());
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
          hours += thisTerm.courses[course].hours;
        }
        instring = instring.concat("<h5>Hours: " + hours + "</h5></div>")
        
        // add each course to the term
        for (let course in thisTerm.courses) {
          thisCourse = thisTerm.courses[course];
          instring = instring.concat("<p onfocus=\"\">" + thisCourse.courseDesignator + ":  " + thisCourse.courseName + "</p>");
        }

        instring = instring.concat("</div>");
      }
      instring = instring.concat("</div>");
    }
    // set #UR to be dynamic
    doc = document.getElementById("UR");
    doc.innerHTML = instring;
  }
  
  make();
