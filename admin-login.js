import {
    auth,
    db,
    signInWithEmailAndPassword,
    signOut,
    doc,
    getDoc
} from "./firebase.js";

const form = document.getElementById("adminLoginForm");
const emailInput = document.getElementById("adminEmail");
const passwordInput = document.getElementById("adminPassword");
const errorMessage = document.getElementById("errorMessage");

form.addEventListener("submit", async function (event) {

    event.preventDefault();

    errorMessage.textContent = "Checking admin account...";
    errorMessage.style.color = "#f5b5d2";

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
        errorMessage.textContent =
            "Please enter your email and password.";
        errorMessage.style.color = "red";
        return;
    }

    try {

        // STEP 1: Login to Firebase
        const result =
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

        const user = result.user;

        console.log("Firebase login successful:", user.uid);

        errorMessage.textContent =
            "Login successful. Checking admin access...";

        errorMessage.style.color = "green";


        // STEP 2: Find admin document
        const adminRef =
            doc(db, "admins", user.uid);

        const adminSnap =
            await getDoc(adminRef);


        // STEP 3: Check admin document
        if (!adminSnap.exists()) {

            await signOut(auth);

            errorMessage.textContent =
                "Login worked, but this account is not registered as an admin.";

            errorMessage.style.color = "red";

            return;
        }


        // STEP 4: Check role
        const adminData =
            adminSnap.data();

        console.log("Admin data:", adminData);


        if (adminData.role !== "admin") {

            await signOut(auth);

            errorMessage.textContent =
                "Admin document found, but the role is not 'admin'.";

            errorMessage.style.color = "red";

            return;
        }


        // STEP 5: Save admin information
        localStorage.setItem(
            "adminUid",
            user.uid
        );

        localStorage.setItem(
            "adminEmail",
            user.email
        );

        localStorage.setItem(
            "adminRole",
            "admin"
        );


        // STEP 6: Open dashboard
        errorMessage.textContent =
            "Admin verified. Opening dashboard...";

        errorMessage.style.color = "green";


        setTimeout(function () {

            window.location.href =
                "admin-dashboard.html";

        }, 500);


    } catch (error) {

        console.error(
            "ADMIN LOGIN ERROR:",
            error
        );

        errorMessage.style.color = "red";

        if (error.code === "auth/invalid-credential") {

            errorMessage.textContent =
                "Incorrect admin email or password.";

        } else if (error.code === "auth/user-not-found") {

            errorMessage.textContent =
                "This admin email does not exist in Firebase Authentication.";

        } else if (error.code === "auth/wrong-password") {

            errorMessage.textContent =
                "The admin password is incorrect.";

        } else if (error.code === "auth/too-many-requests") {

            errorMessage.textContent =
                "Too many login attempts. Please wait and try again.";

        } else if (error.code === "permission-denied") {

            errorMessage.textContent =
                "Firestore permission denied. Check the Security rules.";

        } else {

            errorMessage.textContent =
                "Error: " + error.code + " - " + error.message;
        }
    }
});