import {
    auth,
    db,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    doc,
    getDoc
} from "./firebase.js";


const loginForm = document.getElementById("loginForm");
const playerCodeInput = document.getElementById("playerCode");
const passwordInput = document.getElementById("loginPassword");
const errorMessage = document.getElementById("errorMessage");


// PLAYER LOGIN
loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    errorMessage.textContent = "";
    errorMessage.style.color = "#ff6b6b";


    const playerCode =
        playerCodeInput.value.trim().toUpperCase();

    const password =
        passwordInput.value;


    if (!playerCode || !password) {

        errorMessage.textContent =
            "Enter your Player Code and password.";

        return;
    }


    try {

        // Find Player Code
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

        const email =
            playerData.email;


        // Login with Firebase
        const userCredential =
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );


        const user =
            userCredential.user;


        // Get player profile
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


        // Save player information
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


        // Open dashboard
        window.location.replace(
            "dashboard.html"
        );


    } catch (error) {

        console.error(
            "Login error:",
            error
        );


        if (
            error.code ===
            "auth/invalid-credential"
        ) {

            errorMessage.textContent =
                "Incorrect Player Code or password.";

        }

        else if (
            error.code ===
            "auth/wrong-password"
        ) {

            errorMessage.textContent =
                "Incorrect password.";

        }

        else if (
            error.code ===
            "auth/too-many-requests"
        ) {

            errorMessage.textContent =
                "Too many attempts. Please wait and try again.";

        }

        else if (
            error.code ===
            "permission-denied"
        ) {

            errorMessage.textContent =
                "Firebase permission denied. Check your Firestore rules.";

        }

        else {

            errorMessage.textContent =
                error.message;

        }
    }

});


// FORGOT PASSWORD
const forgotPassword =
    document.getElementById("forgotPassword");


forgotPassword.addEventListener(
    "click",
    async function (event) {

        event.preventDefault();


        const playerCode =
            playerCodeInput.value.trim().toUpperCase();


        if (!playerCode) {

            errorMessage.textContent =
                "Enter your Player Code first.";

            return;
        }


        try {

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

    }
);