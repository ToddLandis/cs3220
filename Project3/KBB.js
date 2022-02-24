

// KBBmake()
var makes;
function KBBmake() {
  console.log("test");
  var request = new XMLHttpRequest();
  var value = document.getElementById("KBByear");
  request.open("GET","/~gallaghd/ymm/ymmdb.php?fmt=json&year="+value,true);
  request.onreadystatechange = function() {
    console.log("TEST"); //DEBUG
    if(this.readyState == 4) {
      data = this.responseText;
      json = JSON.parse(data);
      string = "";
      for (i in json) {
        string = string.concat("<option>" + json[i].name + "</option>");
      }
      console.log(string); //DEBUG
      html = document.getElementById("KBBmake");
      html.innerHTML = string;
    }
  }
  request.send(null);
}


// KBBmodel()
function KBBmodel() {
  console.log("test");
  var request = new XMLHttpRequest();
  var value = document.getElementById("KBBmake"); //FIXME
  request.open("GET","/~gallaghd/ymm/ymmdb.php?fmt=json&year="+value,true); //FIXME
  request.onreadystatechange = function() {
    console.log("TEST"); //DEBUG
    if(this.readyState == 4) {
      data = this.responseText;
      json = JSON.parse(data);
      string = "";
      for (i in json) {
        string = string.concat("<option>" + json[i] + "</option>");
      }
      console.log(string); //DEBUG
      html = document.getElementById("KBBmodel");
      html.innerHTML = string;
    }
  }
  request.send(null);
}