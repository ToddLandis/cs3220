<?php
session_start();
if (!isset($_SESSION['ID'])) {
        header("Location: ./login.php");
}
?>
<!DOCTYPE HTML>
<html>
        <head>
                <title>APE</title>
                <link rel="stylesheet" href="default.css" />
                <link rel="icon" type="image/x-icon" href="favicon.ico" />
                <!--- This code is taken from JQueryUI to implement the accordion -->
                <script src="https://code.jquery.com/jquery-3.6.0.js"></script>
                <script src="https://code.jquery.com/ui/1.13.1/jquery-ui.js"></script>

                <!-- Datatables Scripts -->
                <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.11.4/css/jquery.dataTables.css">
                <script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/1.11.4/js/jquery.dataTables.js"></script>

                <!-- KBB Script -->
                <script>
                </script>
        </head>
        <body>
                <div id="main">
                        <div id="header">
                                <div id="left">
                                        <button onclick="darkModeFunction()" class="headerbtn" id="modebtn">Dark Mode</button>
                                </div>
                                <div id="title">
                                        <h1>Academic Planning Environment</h1>
                                </div>
                                <div id="right">
                                        <div class="menu">
                                                <button onclick="projDropdownFunction()" class="headerbtn" id="projdropbtn">v4.0</button>
                                                <div id="projDropdown" class="dropdown-content">
                                                        <a href="/~tilandis/TermProject/Project1/index.html">Version 1</a>
                                                        <a href="/~tilandis/TermProject/Project2/index.html">Version 2</a>
                                                        <a href="/~tilandis/TermProject/Project3/index.html">Version 3</a>
                                                        <a href="/~tilandis/TermProject/Project5/index.html">Version 5</a>
                                                        <a href="/~tilandis/TermProject/Project6/index.html">Version 6</a>
                                                </div>
                                        </div>
                                        <div class="menu">
                                                <button onclick="linksDropdownFunction()" class="headerbtn" id="linksdropbtn">Links</button>
                                                <div id="linksDropdown" class="dropdown-content">
                                                        <a href="http://csweb.cedarville.edu">People's Choice Awards</a>
                                                        <a href="http://judah.cedarville.edu/~carpent/cs3220.html">Ryan's Homepage</a>
                                                        <a href="http://judah.cedarville.edu/~tilandis/cs3220.html">Todd's Homepage</a>
                                                        <a href="http://judah.cedarville.edu/~hearne/cs3220.html">Joshua's Homepage</a>
                                                </div>
                                        </div>
                                </div>
                        </div>
                        <div id="infobar">
                                <div id="planinfo"></div>
                                <button class="infobtn" id="savebtn" onclick="savePlan()">Save Plan</button>
                                <button class="infobtn" id="logoutbtn" onclick="window.location.href='logout.php';">Log Out</button>
                        </div>
                        <div id="upper" class="half">
                                <div id="UL">
                                        <div id="accordion">
                                                <h3>Requirements</h3>
                                                <div id="core" class="accordion-content">
                                                </div>
                                                <h3>Electives</h3>
                                                <div id="electives" class="accordion-content">
                                                </div>
                                                <h3>Cognates</h3>
                                                <div id="cognates" class="accordion-content">
                                                </div>
                                        </div>
                                </div>
                                <div id="UR">
                                        
                                </div>
                        </div>
                        <div id="lower" class="half">
                                <div id="LL">
                                        
                               </div>
                                <div id="LR">
                                        <table id="table_id" class="">
                                                <thead>
                                                        <tr>
                                                                <th>Course Designator</th>
                                                                <th>Course Name</th>
                                                                <th>Description</th>
                                                                <th>Credit Hours</th>
                                                        </tr>
                                                </thead>
                                                <tbody>
                                                </tbody>
                                        </table>
                                </div>
                        </div>
                </div>
        </body>
        <script type="text/javascript" src="./script.js"></script>
        <script type="text/javascript" src="./style.js"></script>
        <script type="text/javascript" src="./dragndrop.js"></script>
        <!--
        <script>
                $( function() {
                  	$( "#accordion" ).accordion({
				heightStyle: "fill"
			});
                } );
        </script>
        -->
        <script type="text/JavaScript">
        $( document ).ready(function() { 
                setTimeout(function () {  
                        $( "#accordion" ).accordion({
				heightStyle: "fill"
			});
                }, 100); 
        });
        </script>
</html>
