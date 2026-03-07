document.getElementById('login-btn').addEventListener('click', function() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

if(username === 'admin' && password === 'admin123') {
        window.location.replace("home.html");
    } else {
        alert("Invalid username or password. Please try again.");
    }

});

    