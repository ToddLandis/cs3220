/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function projDropdownFunction() {
    document.getElementById("projDropdown").classList.toggle("show");
}
function linksDropdownFunction() {
    document.getElementById("linksDropdown").classList.toggle("show");
}
    
// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('#projdropbtn')) {
        var dropdown = document.getElementById("projDropdown");
        if (dropdown.classList.contains('show')) {
            dropdown.classList.remove('show');
        }
    }
    if (!event.target.matches('#linksdropbtn')) {
        var dropdown = document.getElementById("linksDropdown");
        if (dropdown.classList.contains('show')) {
            dropdown.classList.remove('show');
        }
    }
}
  
/* dark mode function */
function darkModeFunction() {
    var element = document.body;
    var content = document.getElementById("modebtn");
    element.classList.toggle("dark-mode");
    if (content.innerHTML == "Dark Mode") {content.innerHTML = "Light Mode";}
    else if (content.innerHTML == "Light Mode") {content.innerHTML = "Dark Mode";}
}