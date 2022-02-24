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