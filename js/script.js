document.addEventListener("DOMContentLoaded", function () {
    // REGISTER FUNCTION
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", function (event) {
            event.preventDefault();
            
            const email = document.getElementById("email").value;
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;
            const registerMsg = document.getElementById("register-msg");

            // Simpan data di LocalStorage
            localStorage.setItem("userEmail", email);
            localStorage.setItem("userUsername", username);
            localStorage.setItem("userPassword", password);

            registerMsg.textContent = "Registrasi berhasil! Silakan login.";
            registerMsg.style.color = "green";

            // Redirect ke halaman login setelah 2 detik
            setTimeout(() => {
                window.location.href = "login.html";
            }, 2000);
        });
    }

    // LOGIN FUNCTION
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const loginEmail = document.getElementById("loginEmail").value;
            const loginPassword = document.getElementById("loginPassword").value;
            const loginMsg = document.getElementById("login-msg");

            // Ambil data dari LocalStorage
            const storedEmail = localStorage.getItem("userEmail");
            const storedPassword = localStorage.getItem("userPassword");

            if (loginEmail === storedEmail && loginPassword === storedPassword) {
                localStorage.setItem("loggedInUser", loginEmail);
                loginMsg.textContent = "Login berhasil!";
                loginMsg.style.color = "green";

                setTimeout(() => {
                    window.location.href = "home.html";
                }, 1000);
            } else {
                loginMsg.textContent = "Email atau password salah!";
                loginMsg.style.color = "red";
            }
        });
    }
});