function getDivider(){
    var divider = document.createElement("li");
    divider.className = "divider";
    divider.role = "separator";
    return divider
}

function navbar() {
var nav = document.getElementById("nav");

var firstparts = "<div class=\"navbar navbar-default navbar-fixed-top\" role=\"navigation\" style=\"background-color:#CAEBF2;\">";
firstparts += "<div class=\"navbar-header\">";
firstparts += "<div id=\"navbar-container\" class=\"container fontcolor\">";
firstparts += "<a href=\"/\" class=\"navbar-brand\"><span><img src=\"../assets/logo.png\" width=\"30\" height=\"30\" class=\"d-inline-block align-top\" alt=\"\"></span>  MemeFeed</a>";
firstparts += "</div></div></div>";

nav.innerHTML = firstparts;

var navbarcontainer = document.getElementById("navbar-container");

var menu_left = document.createElement("ul");
    menu_left.className = "nav navbar-nav"
    menu_left.id = "mainmenu";
    navbarcontainer.appendChild(menu_left);

var menu_right = document.createElement("ul");
    menu_right.className = "nav navbar-nav navbar-right"
    menu_right.id = "menuright"; 
    navbarcontainer.appendChild(menu_right)


if (localStorage.loggedIn == 'true') {

    var mystuff_item = document.createElement("li"); 
    var mystuff_a = document.createElement("a"); 
    mystuff_item.id = "mystuff";
    mystuff_a.href = "/mystuff";
    mystuff_a.className= "link";
    mystuff_a.innerHTML = "My Stuff";
    mystuff_item.appendChild(mystuff_a);



    var sharedwithme_item = document.createElement("li"); 
    var sharedwithme_a = document.createElement("a"); 
    sharedwithme_item.id = "sharedwithme";
    sharedwithme_a.href = "/sharedwithme";
    sharedwithme_a.className= "link";
    sharedwithme_a.innerHTML = "Shared With Me";
    sharedwithme_item.appendChild(sharedwithme_a);
    
    menu_left = document.getElementById("mainmenu");
    menu_left.appendChild(getDivider());
    menu_left.appendChild(mystuff_item);
    menu_left.appendChild(getDivider());
    menu_left.appendChild(sharedwithme_item);


    var logout_item = document.createElement("li"); 
    var logout_a = document.createElement("a"); 
    logout_item.id = "logout";
    logout_item.appendChild(logout_a);
    logout_a.href = "/";
    logout_a.className= "link";
    logout_a.type = "submit";
    logout_a.innerHTML = "Logout";
    logout_a.onclick = function() {
        authLogout();
        location.reload();
    }

    // var greeting = document.createElement("span");
    // var logout = document.createElement("button");

    // greeting.innerHTML = "Hello, " + localStorage.username + "!";

    var greeting_item = document.createElement("li"); 
    var greeting_p = document.createElement("p"); 
    greeting_p.className = "navbar-text";
    greeting_p.innerHTML = "Hello, " + localStorage.username + "!";
    greeting_item.appendChild(greeting_p);

    menu_right = document.getElementById("menuright");
    menu_right.appendChild(greeting_item);
    menu_right.appendChild(logout_item);

    // var greeting = document.createElement("span");
    // var logout = document.createElement("button");

    // greeting.innerHTML = "Hello, " + localStorage.username + "!";
} else {

    var login_signup_item = document.createElement("li"); 
    var login_signup_a = document.createElement("a"); 
    login_signup_item.id = "register";
    login_signup_item.appendChild(login_signup_a);
    login_signup_a.href = "/register";
    login_signup_a.className= "link";
    login_signup_a.innerHTML = "Login / Sign Up";


    menu_right = document.getElementById("menuright");
    menu_right.appendChild(login_signup_item);
}
}
