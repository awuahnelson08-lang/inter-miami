import {
    auth,
    db,
    createUserWithEmailAndPassword,
    doc,
    setDoc
} from "./firebase.js";


const form = document.getElementById("registerForm");
const errorMessage = document.getElementById("errorMessage");
const codeBox = document.getElementById("codeBox");
const codeDisplay = document.getElementById("playerCode");
const copyButton = document.getElementById("copyButton");


// Generate Player Code
function generatePlayerCode() {

    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    let code = "IMB-";

    for (let i = 0; i < 6; i++) {

        const randomNumber =
            Math.floor(Math.random() * characters.length);

        code += characters[randomNumber];
    }

    return code;
}


// Registration
form.addEventListener("submit", async function (event) {

    event.preventDefault();

    errorMessage.textContent = "";
    errorMessage.style.color = "red";


    const fullName =
        document.getElementById("fullName").value.trim();

    const username =
        document.getElementById("username").value.trim();

    const jerseyNumber =
        document.getElementById("jerseyNumber").value;

    const position =
        document.getElementById("position").value;

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;


    try {

        // Create Firebase account
        const account =
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );


        const user = account.user;


        // Generate Player Code
        const code = generatePlayerCode();


        // Save player information
        await setDoc(
            doc(db, "players", user.uid),
            {
                uid: user.uid,
                fullName: fullName,
                username: username,
                jerseyNumber: jerseyNumber,
                position: position,
                email: email,
                playerCode: code,
                role: "player",
                createdAt: new Date().toISOString()
            }
        );


        // Save Player Code mapping
        await setDoc(
            doc(db, "playerCodes", code),
            {
                uid: user.uid,
                email: email
            }
        );


        // Save locally
        localStorage.setItem(
            "playerUid",
            user.uid
        );

        localStorage.setItem(
            "playerCode",
            code
        );

        localStorage.setItem(
            "playerAccount",
            JSON.stringify({
                uid: user.uid,
                fullName: fullName,
                username: username,
                jerseyNumber: jerseyNumber,
                position: position,
                email: email,
                playerCode: code,
                role: "player"
            })
        );


        // Show Player Code
        codeDisplay.textContent = code;

        codeBox.style.display = "block";

        form.style.display = "none";

        errorMessage.style.color = "green";

        errorMessage.textContent =
            "Account created successfully!";


        // Open dashboard after 3 seconds
        setTimeout(function () {

            window.location.replace(
                "dashboard.html"
            );

        }, 3000);


    } catch (error) {

        console.error(
            "Registration error:",
            error
        );


        if (
            error.code ===
            "auth/email-already-in-use"
        ) {

            errorMessage.textContent =
                "This email is already registered. Please use another email or log in.";

        }

        else if (
            error.code ===
            "auth/weak-password"
        ) {

            errorMessage.textContent =
                "Password must be at least 6 characters.";

        }

        else if (
            error.code ===
            "auth/invalid-email"
        ) {

            errorMessage.textContent =
                "Please enter a valid email address.";

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
                "Registration failed: " +
                error.message;
        }
    }

});


// Copy Player Code
copyButton.addEventListener(
    "click",
    function () {

        const code =
            codeDisplay.textContent;


        navigator.clipboard
            .writeText(code)

            .then(function () {

                alert(
                    "Player Code copied!"
                );

            })

            .catch(function () {

                alert(
                    "Could not copy the code."
                );

            });

    }
);