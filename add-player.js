import {
    auth,
    db,
    createUserWithEmailAndPassword,
    doc,
    setDoc,
    onAuthStateChanged,
    getDoc
} from "./firebase.js";

const form = document.getElementById("addPlayerForm");
const statusMessage = document.getElementById("statusMessage");

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "admin-login.html";
        return;
    }
    const adminRef = doc(db, "admins", user.uid);
    const adminSnap = await getDoc(adminRef);
    if (!adminSnap.exists() || adminSnap.data().role !== "admin") {
        window.location.href = "admin-login.html";
    }
});

function generateCode() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "IMB-";
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    statusMessage.textContent = "Generating code and creating player...";
    statusMessage.style.color = "#f5b5d2";

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const jerseyNumber = document.getElementById("jerseyNumber").value.trim();
    const position = document.getElementById("position").value.trim();
    const password = document.getElementById("tempPassword").value.trim();

    const playerCode = generateCode();

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, "players", user.uid), {
            uid: user.uid,
            fullName: fullName,
            email: email,
            jerseyNumber: jerseyNumber,
            position: position,
            playerCode: playerCode,
            createdAt: new Date().toISOString()
        });

        await setDoc(doc(db, "playerCodes", playerCode), {
            email: email,
            uid: user.uid
        });

        statusMessage.style.color = "lightgreen";
        statusMessage.innerHTML = `✅ Player Created!<br><strong>Code: ${playerCode}</strong><br>Share this code and password with the player.`;
        form.reset();

    } catch (error) {
        console.error("Error creating player:", error);
        statusMessage.style.color = "red";
        statusMessage.textContent = "Error: " + error.message;
    }
});
