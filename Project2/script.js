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
		this.courses = courses; //FIXME I think the issue might be with the array declarations
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
	myPlan.addCourse(new Course("Summer", "2023", "Math-100", "Remediadiary Math"));
	myPlan.addCourse(new Course("Summer", "2023", "Eng-100", "Remediadiary Reading"));
	myPlan.addCourse(new Course("Fall", "2023", "CS-1240", "Java Programming"));
	myPlan.addCourse(new Course("Fall", "2023", "CS-1250", "Dominating the World"));
	
	console.log("First Course Term: " + myPlan.courses[0].term);//DEBUG
	
	myPlan.addCourse(new Course("Fall", "2023", "CS-1210", "C++ Programming"));
	myPlan.addCourse(new Course("Fall", "2023", "EG-1210", "Digital Logic Design"));
	myPlan.addCourse(new Course("Spring", "2024", "CS-1220", "C++ Programming 2"));
	myPlan.addCourse(new Course("Spring", "2024", "CS-1230", "Python Programming"));
	myPlan.addCourse(new Course("Summer", "2024", "Math-100", "Remediadiary Math"));
	myPlan.addCourse(new Course("Summer", "2024", "Eng-100", "Remediadiary Reading"));
	myPlan.addCourse(new Course("Fall", "2024", "CS-1240", "Java Programming"));
	myPlan.addCourse(new Course("Fall", "2024", "CS-1250", "Dominating the World"));
	
	myPlan.addCourse(new Course("Fall", "2024", "CS-1210", "C++ Programming"));
	myPlan.addCourse(new Course("Fall", "2024", "EG-1210", "Digital Logic Design"));
	myPlan.addCourse(new Course("Spring", "2025", "CS-1220", "C++ Programming 2"));
	myPlan.addCourse(new Course("Spring", "2025", "CS-1230", "Python Programming"));
	myPlan.addCourse(new Course("Summer", "2025", "Math-100", "Remediadiary Math"));
	myPlan.addCourse(new Course("Summer", "2025", "Eng-100", "Remediadiary Reading"));
	myPlan.addCourse(new Course("Fall", "2025", "CS-1240", "Java Programming"));
	myPlan.addCourse(new Course("Fall", "2025", "CS-1250", "Dominating the World"));
	
	myPlan.addCourse(new Course("Fall", "2025", "CS-1210", "C++ Programming"));
	myPlan.addCourse(new Course("Fall", "2025", "EG-1210", "Digital Logic Design"));
	myPlan.addCourse(new Course("Spring", "2026", "CS-1220", "C++ Programming 2"));
	myPlan.addCourse(new Course("Spring", "2026", "CS-1230", "Python Programming"));
	myPlan.addCourse(new Course("Summer", "2026", "Math-100", "Remediadiary Math"));
	myPlan.addCourse(new Course("Summer", "2026", "Eng-100", "Remediadiary Reading"));
	myPlan.addCourse(new Course("Fall", "2026", "CS-1240", "Java Programming"));
	myPlan.addCourse(new Course("Fall", "2026", "CS-1250", "Dominating the World"));
	
	return myPlan;
}

function convert(plan) {
	
	var myYears = {};
	console.log("Convert Debug: " + plan.courses[1].year); //DEBUG
	courses = plan.courses;
	for (let i in courses) {
		console.log(" Should be Object: " + i);
		console.log(" Should be year: " + courses[i].year);
		if (!(courses[i].year in myYears)) {
			myYears[courses[i].year] = new Year();
			console.log("  year: " + courses[i].year); //DEBUG
		}
		if (!(courses[i].term in myYears[courses[i].year].terms)) {
			myYears[courses[i].year].addTerm(courses[i].term, new Term());
			console.log("  term: " + courses[i].term); //DEBUG
		}
		myYears[courses[i].year].terms[courses[i].term].addCourse(courses[i]);
	}
	return myYears;
}

function make() {
	var years = convert(populate());
	console.log("years: " + years); //DEBUG
	var instring = "";
	
	for (let year in years) {
		thisYear = years[year];
		console.log(" year: " + year); //DEBUG
		console.log(" years[year]: " + years[year]); //DEBUG
		console.log(" thisYear.terms[\"Spring\"]: " + thisYear.terms["Spring"]); //DEBUG
		instring.concat("<div class=\"years\">");
		
		for (let term in thisYear.terms) {
			thisTerm = thisYear.terms[term];
			console.log("  term: " + term); //DEBUG
			console.log("  thisYear[term]: " + thisYear[term]); //DEBUG
			instring.concat("<div class=\"semester\"><h4>" + term + " " + year + "<h4>");
			
			for (let courses in thisTerm.courses) {
				console.log("   course: " + course);
				thisCourse = thisTerm.courses[course]
				console.log("   thisCourse: " + thisCourse + " " + thisCourse.courseName) //DEBUG
				console.log("   thisCourse[1]: " + thisCourse[1] + "thisCourse[1].courseName: " + thisCourse[0].courseName); //DEBUG
				instring.concat("<p>" + thisCourse.courseName + "</p>");
			}
			
			instring.concat("</div>");
		}
		
		instring.concat("</div>");
	}
	
	console.log("string: " + instring); //DEBUG
	doc = document.getElementById("UR");
	doc.innerHTML = instring;
}

make();
