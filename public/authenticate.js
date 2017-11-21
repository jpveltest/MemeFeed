function authLogin(response) {
    console.log('we in login');
	if (response != -1) {
        var user = JSON.parse(response);
        localStorage.userId = user.id;
        localStorage.username = user.username;
        localStorage.loggedIn = true;
        return true;
    } else {
        authLogout();
        return false;
    }
}

function authLogout() {
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.loggedIn = false;
}