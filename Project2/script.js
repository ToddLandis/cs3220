class Course {
	constructor(term, year, courseDesignator, courseName) {
		this.term = term;
		this.year = year;
		this.courseDesignator = courseDesignator;
		this.courseName = courseName;
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
		this.courses = courses; //FIXME I think the issue might be with the array declarations
	}
	addCourse(course) {
		this.courses.push(course);
	}
}

function populate() {
	var myPlan = new Plan("myPlan", "2022", "Comp. Sci.", "Fredrick Douglas", "Fall");
	
	myPlan.addCourse(new Course("Fall", "2022", "CS-1210", "C++ Programming"));
	myPlan.addCourse(new Course("Fall", "2022", "EG-1210", "Digital Logic Design"));
	myPlan.addCourse(new Course("Spring", "2023", "CS-1220", "C++ Programming 2"));
	myPlan.addCourse(new Course("Spring", "2023", "CS-1230", "Python Programming"));
	myPlan.addCourse(new Course("Summer", "2023", "Math-100", "Remedial Math"));
	myPlan.addCourse(new Course("Summer", "2023", "Eng-100", "Remedial Reading"));
	
	console.log("First Course Term: " + myPlan.courses[0].term);//DEBUG
	
	myPlan.addCourse(new Course("Fall", "2023", "CS-1210", "C++ Programming"));
	myPlan.addCourse(new Course("Fall", "2023", "EG-1210", "Digital Logic Design"));
	myPlan.addCourse(new Course("Spring", "2024", "CS-1220", "C++ Programming 2"));
	myPlan.addCourse(new Course("Spring", "2024", "CS-1230", "Python Programming"));
	myPlan.addCourse(new Course("Summer", "2024", "Math-100", "Remedial Math"));
	myPlan.addCourse(new Course("Summer", "2024", "Eng-100", "Remedial Reading"));
	
	myPlan.addCourse(new Course("Fall", "2024", "CS-1210", "C++ Programming"));
	myPlan.addCourse(new Course("Fall", "2024", "EG-1210", "Digital Logic Design"));
	myPlan.addCourse(new Course("Spring", "2025", "CS-1220", "C++ Programming 2"));
	myPlan.addCourse(new Course("Spring", "2025", "CS-1230", "Python Programming"));
	myPlan.addCourse(new Course("Summer", "2025", "Math-100", "Remedial Math"));
	myPlan.addCourse(new Course("Summer", "2025", "Eng-100", "Remedial Reading"));
	
	myPlan.addCourse(new Course("Fall", "2025", "CS-1210", "C++ Programming"));
	myPlan.addCourse(new Course("Fall", "2025", "EG-1210", "Digital Logic Design"));
	myPlan.addCourse(new Course("Spring", "2026", "CS-1220", "C++ Programming 2"));
	myPlan.addCourse(new Course("Spring", "2026", "CS-1230", "Python Programming"));
	myPlan.addCourse(new Course("Summer", "2026", "Math-100", "Remedial Math"));
	myPlan.addCourse(new Course("Summer", "2026", "Eng-100", "Remedial Reading"));
	
	return myPlan;
}

function convert(plan) {
	
	var myYears = {};
	courses = plan.courses;
	for (let i in courses) {
		if (courses[i].term == "Fall") {
			year = courses[i].year
			if (!(year in myYears)) {
				myYears[courses[i].year] = new Year();
			}
			if (!(courses[i].term in myYears[courses[i].year].terms)) {
				myYears[courses[i].year].addTerm("Fall", new Term());
				myYears[courses[i].year].addTerm("Spring", new Term());
				myYears[courses[i].year].addTerm("Summer", new Term());
			}
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
	
	for (let year in years) {
		thisYear = years[year];
		instring = instring.concat("<div class=\"years\">");
		
		for (let term in thisYear.terms) {
			thisTerm = thisYear.terms[term];
			
			if (term == "Fall") {
				instring = instring.concat("<div class=\"semester\"><h4>" + term + " " + year + "</h4>");
			} else {
				instring = instring.concat("<div class=\"semester\"><h4>" + term + " " + (parseInt(year)+1).toString() + "</h4>");
			}
			
			for (let course in thisTerm.courses) {
				thisCourse = thisTerm.courses[course];
				instring = instring.concat("<p>" + thisCourse.courseName + "</p>");
			}
			
			instring = instring.concat("</div>");
		}
		
		instring = instring.concat("</div>");
	}
	
	doc = document.getElementById("UR");
	doc.innerHTML = instring;
}

make();


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
