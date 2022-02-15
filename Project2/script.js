class Course {
	constructor(term, year, courseDesignator, courseName) {
		this.term = term;
		this.year = year;
		this.courseDesignator = courseDesignator;
		this.courseName = courseName;
	}
}
class Plan {
	constructor(planName, catalogueYear, major, studentName, semester) {
		this.planName = planName;
		this.catalogueYear = catalogueYear;
		this.major = major;
		this.studentName = studentName;
		this.semester = semester;
		const this.courses = [];
	}
	addCourse(course) {
		this.courses.push(course);
	}
}

class Year {
	constructor() {
		this.terms = {};
	}
	addTerm(term) {
		this.terms.push(term);
	}
}

class Term {
	constructor() {
		const this.courses = [];
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
	for (i in plan.courses) {
		if (!(i.year in myYears)) {
			myYears[i.year] = new Year();
			console.log(i.year); //DEBUG
		}
		if (!(i.term in myYears[i.year])) {
			myYears[i.year][i.term] = new Term();
			console.log(i.term);
		}
		myYears[i.year][i.term].addCourse(i);
	}
	return myYears;
}

function make() {
	var years = convert(populate());
	
	var instring = "";
	
	for (let year in years) {
		thisYear = years[year];
		instring.concat("<div class=\"years\">");
		
		for (let term in thisYear) {
			thisTerm = thisYear[term];
			instring.concat("<div class=\"semester\"><h4>" + term + " " + year + "<h4>");
			
			for (let course in thisTerm) {
				instring.concat("<p>" + course.courseName + "</p>");
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
