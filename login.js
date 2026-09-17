import {
    auth,
    signInWithEmailAndPassword,
    sendPasswordResetEmail
} from "./firebase.js";

const loginForm = document.getElementById("loginForm");
const errorMessage = document.getElementById("errorMessage");
const forgotPassword = document.getElementById("forgotPassword");


// ===============================
// LOGIN
// ===============================

loginForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const email =
        document.getElementById("loginEmail").value.trim();

    const password =
        document.getElementById("loginPassword").value;

    errorMessage.textContent = "";

    try {

        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        // Login successful
        window.location.href = "dashboard.html";

    } catch (error) {

        console.log(error);

        if (error.code === "auth/invalid-credential") {

            errorMessage.textContent =
                "Incorrect email or password.";

        } else if (error.code === "auth/too-many-requests") {

            errorMessage.textContent =
                "Too many attempts. Please wait and try again later.";

        } else {

            errorMessage.textContent =
                "Login failed. Please check your details.";
        }
    }
});


// ===============================
// FORGOT PASSWORD
// ===============================

forgotPassword.addEventListener("click", async function(event) {

    event.preventDefault();

    const email =
        document.getElementById("loginEmail").value.trim();

    if (!email) {

        errorMessage.textContent =
            "Please enter your email address first.";

        return;
    }

    try {

        await sendPasswordResetEmail(
            auth,
            email
        );

        errorMessage.textContent =
            "Password reset email sent. Check your inbox.";

    } catch (error) {

        console.log(error);

        if (error.code === "auth/user-not-found") {

            errorMessage.textContent =
                "No account was found with this email.";

        } else if (error.code === "auth/invalid-email") {

            errorMessage.textContent =
                "Please enter a valid email address.";

        } else {

            errorMessage.textContent =
                "Unable to send reset email. Please try again.";
        }
    }
});