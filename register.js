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
const playerCode = document.getElementById("playerCode");
const copyButton = document.getElementById("copyButton");

function generatePlayerCode() {

    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    let randomCode = "";

    for (let i = 0; i < 6; i++) {

        const randomIndex =
            Math.floor(
                Math.random() * characters.length
            );

        randomCode += characters[randomIndex];
    }

    return "IMB-" + randomCode;
}

form.addEventListener("submit", async function(event) {

    event.preventDefault();

    errorMessage.textContent = "";

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

        const userCredential =
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

        const user = userCredential.user;

        const code = generatePlayerCode();

        await setDoc(
            doc(db, "players", user.uid),
            {
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

        playerCode.textContent = code;

        codeBox.style.display = "block";

        form.style.display = "none";

    } catch (error) {

        console.log(error);

        if (error.code === "auth/email-already-in-use") {

            errorMessage.textContent =
                "This email is already registered.";

        } else if (error.code === "auth/weak-password") {

            errorMessage.textContent =
                "Password must be at least 6 characters.";

        } else {

            errorMessage.textContent =
                "Registration failed. Please try again.";
        }
    }
});

copyButton.addEventListener("click", function() {

    const code = playerCode.textContent;

    navigator.clipboard.writeText(code);

    alert("Player code copied!");

});