import {
    auth,
    db,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    doc,
    getDoc
} from "./firebase.js";


// ===============================
// ELEMENTS
// ===============================
const loginForm =
    document.getElementById("loginForm");

const playerCodeInput =
    document.getElementById("playerCode");

const passwordInput =
    document.getElementById("loginPassword");

const errorMessage =
    document.getElementById("errorMessage");


// ===============================
// LOGIN
// ===============================
loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();


    const playerCode =
        playerCodeInput.value
            .trim()
            .toUpperCase();

    const password =
        passwordInput.value;


    // Clear error
    errorMessage.textContent = "";


    if (!playerCode || !password) {

        errorMessage.textContent =
            "Enter your Player Code and password.";

        return;
    }


    try {

        // ===============================
        // FIND PLAYER CODE
        // ===============================
        const codeRef =
            doc(db, "playerCodes", playerCode);

        const codeSnap =
            await getDoc(codeRef);


        if (!codeSnap.exists()) {

            errorMessage.textContent =
                "Player Code not found.";

            return;
        }


        // Get player's email
        const playerData =
            codeSnap.data();

        const email =
            playerData.email;


        // ===============================
        // FIREBASE LOGIN
        // ===============================
        const userCredential =
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

        const user =
            userCredential.user;


        // ===============================
        // GET PLAYER PROFILE
        // ===============================
        const playerRef =
            doc(db, "players", user.uid);

        const playerSnap =
            await getDoc(playerRef);


        if (!playerSnap.exists()) {

            errorMessage.textContent =
                "Player profile was not found.";

            return;
        }


        const player =
            playerSnap.data();


        // ===============================
        // SAVE LOGIN DATA
        // ===============================
        localStorage.setItem(
            "playerUid",
            user.uid
        );

        localStorage.setItem(
            "playerCode",
            player.playerCode
        );

        localStorage.setItem(
            "playerAccount",
            JSON.stringify(player)
        );


        // ===============================
        // OPEN DASHBOARD
        // ===============================
        window.location.replace(
            "dashboard.html"
        );


    } catch (error) {

        console.error("Login error:", error);


        if (
            error.code ===
            "auth/invalid-credential"
        ) {

            errorMessage.textContent =
                "Incorrect Player Code or password.";

        } else if (
            error.code ===
            "auth/wrong-password"
        ) {

            errorMessage.textContent =
                "Incorrect password.";

        } else if (
            error.code ===
            "auth/too-many-requests"
        ) {

            errorMessage.textContent =
                "Too many attempts. Please wait and try again.";

        } else if (
            error.code ===
            "permission-denied"
        ) {

            errorMessage.textContent =
                "Firebase permission denied. Check your Firestore rules.";

        } else {

            errorMessage.textContent =
                error.message;
        }

    }

});


// ===============================
// FORGOT PASSWORD
// ===============================
const forgotPassword =
    document.getElementById("forgotPassword");


forgotPassword.addEventListener("click", async (e) => {

    e.preventDefault();


    const playerCode =
        playerCodeInput.value
            .trim()
            .toUpperCase();


    if (!playerCode) {

        errorMessage.textContent =
            "Enter your Player Code first.";

        return;
    }


    try {

        // Find player code
        const codeRef =
            doc(db, "playerCodes", playerCode);

        const codeSnap =
            await getDoc(codeRef);


        if (!codeSnap.exists()) {

            errorMessage.textContent =
                "Player Code not found.";

            return;
        }


        const playerData =
            codeSnap.data();


        // Send password reset email
        await sendPasswordResetEmail(
            auth,
            playerData.email
        );


        alert(
            "Password reset instructions have been sent to the email address used when you registered."
        );


    } catch (error) {

        console.error(
            "Password reset error:",
            error
        );


        errorMessage.textContent =
            error.message;

    }

});