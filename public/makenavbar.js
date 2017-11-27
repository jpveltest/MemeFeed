function navbar() {
var nav = document.getElementById("nav");
if (localStorage.loggedIn == 'true') {
    var greeting = document.createElement("span");
    var logout = document.createElement("button");
    var memefeed = document.createElement("a");
    var mystuff = document.createElement("a");
    var sharedwithme = document.createElement("a");
    greeting.innerHTML = "Hello, " + localStorage.username + "!";
    logout.type = "submit";
    logout.innerHTML = "Logout";
    logout.onclick = function() {
        authLogout();
        location.reload();
    }
    memefeed.href = "/";
    memefeed.innerHTML = "MemeFeed";
    mystuff.href = "/mystuff";
    mystuff.innerHTML = "My Stuff";
    sharedwithme.href = "/sharedwithme";
    sharedwithme.innerHTML = "Shared with me";
    nav.appendChild(greeting);
    nav.appendChild(memefeed);
    nav.appendChild(mystuff);
    nav.appendChild(sharedwithme);
    nav.appendChild(logout);
} else {
    var anchor = document.createElement("a");
    anchor.href = "/register";
    anchor.innerHTML = "Log in / Sign up";
    nav.appendChild(anchor);
}
}