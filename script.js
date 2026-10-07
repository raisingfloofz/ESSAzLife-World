console.log("WORLD JS IS WORKING");

const directoryButton = document.getElementById("directoryButton");
const directoryOverlay = document.getElementById("directoryOverlay");
const directoryClose = document.getElementById("directoryClose");

directoryButton.addEventListener("click", function () {
    directoryOverlay.classList.add("show");
});

directoryClose.addEventListener("click", function () {
    directoryOverlay.classList.remove("show");
});

directoryOverlay.addEventListener("click", function (event) {
    if (event.target === directoryOverlay) {
        directoryOverlay.classList.remove("show");
    }
});

const helpButton = document.getElementById("helpButton");
const helpOverlay = document.getElementById("helpOverlay");
const helpClose = document.getElementById("helpClose");

helpButton.addEventListener("click", function () {
    helpOverlay.classList.add("show");
});

helpClose.addEventListener("click", function () {
    helpOverlay.classList.remove("show");
});

helpOverlay.addEventListener("click", function (event) {
    if (event.target === helpOverlay) {
        helpOverlay.classList.remove("show");
    }
});

const bulletinButton = document.getElementById("bulletinButton");
const bulletinOverlay = document.getElementById("bulletinOverlay");
const bulletinClose = document.getElementById("bulletinClose");

bulletinButton.addEventListener("click", function () {
    bulletinOverlay.classList.add("show");
});

bulletinClose.addEventListener("click", function () {
    bulletinOverlay.classList.remove("show");
});

bulletinOverlay.addEventListener("click", function (event) {
    if (event.target === bulletinOverlay) {
        bulletinOverlay.classList.remove("show");
    }
});

const settingsButton = document.getElementById("settingsButton");
const settingsOverlay = document.getElementById("settingsOverlay");
const settingsClose = document.getElementById("settingsClose");

const settingsAccountName = document.getElementById("settingsAccountName");

const changeNicknameButton = document.getElementById("changeNicknameButton");
const changeNicknameOverlay = document.getElementById("changeNicknameOverlay");
const changeNicknameClose = document.getElementById("changeNicknameClose");
const changeNicknameForm = document.getElementById("changeNicknameForm");
const newNickname = document.getElementById("newNickname");
const nicknameError = document.getElementById("nicknameError");

const changeUsernameButton = document.getElementById("changeUsernameButton");
const changeUsernameOverlay = document.getElementById("changeUsernameOverlay");
const changeUsernameClose = document.getElementById("changeUsernameClose");
const changeUsernameForm = document.getElementById("changeUsernameForm");
const newUsername = document.getElementById("newUsername");
const usernameError = document.getElementById("usernameError");

const changePasswordButton = document.getElementById("changePasswordButton");
const changePasswordOverlay = document.getElementById("changePasswordOverlay");
const changePasswordClose = document.getElementById("changePasswordClose");
const changePasswordForm = document.getElementById("changePasswordForm");
const currentPassword = document.getElementById("currentPassword");
const newPassword = document.getElementById("newPassword");
const confirmNewPassword = document.getElementById("confirmNewPassword");
const passwordChangeError = document.getElementById("passwordChangeError");

const logoutButton = document.getElementById("logoutButton");
const logoutConfirmOverlay = document.getElementById("logoutConfirmOverlay");
const cancelLogoutButton = document.getElementById("cancelLogoutButton");
const confirmLogoutButton = document.getElementById("confirmLogoutButton");

const deleteAccountButton = document.getElementById("deleteAccountButton");
const deleteConfirmOverlay = document.getElementById("deleteConfirmOverlay");
const cancelDeleteButton = document.getElementById("cancelDeleteButton");
const confirmDeleteButton = document.getElementById("confirmDeleteButton");

settingsButton.addEventListener("click", function () {
    const savedAccount = localStorage.getItem("essazlifeWorldAccount");

    if (savedAccount) {
        const account = JSON.parse(savedAccount);

        settingsAccountName.textContent =
            account.nickname + " • @" + account.username;
    }

    settingsOverlay.classList.add("show");
});

changeNicknameButton.addEventListener("click", function () {
    const savedAccount = localStorage.getItem("essazlifeWorldAccount");

    if (!savedAccount) {
        return;
    }

    const account = JSON.parse(savedAccount);

    newNickname.value = account.nickname;

    nicknameError.style.display = "none";
    nicknameError.textContent = "";

    settingsOverlay.classList.remove("show");
    changeNicknameOverlay.classList.add("show");
});

changeNicknameClose.addEventListener("click", function () {
    changeNicknameOverlay.classList.remove("show");
});

changeNicknameForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const nickname = newNickname.value.trim();

    if (nickname.length < 1) {
        nicknameError.textContent = "Please enter a nickname.";
        nicknameError.style.display = "block";
        return;
    }

    const account = JSON.parse(
        localStorage.getItem("essazlifeWorldAccount")
    );

    account.nickname = nickname;

    localStorage.setItem(
        "essazlifeWorldAccount",
        JSON.stringify(account)
    );

    changeNicknameOverlay.classList.remove("show");

    showWelcomeBackMessage();
});

changeUsernameButton.addEventListener("click", function () {
    const savedAccount = localStorage.getItem("essazlifeWorldAccount");

    if (!savedAccount) {
        return;
    }

    const account = JSON.parse(savedAccount);

    newUsername.value = account.username;

    usernameError.style.display = "none";
    usernameError.textContent = "";

    settingsOverlay.classList.remove("show");
    changeUsernameOverlay.classList.add("show");
});

changeUsernameClose.addEventListener("click", function () {
    changeUsernameOverlay.classList.remove("show");
});

changeUsernameForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const username = newUsername.value.trim();

    if (username.length < 3) {
        usernameError.textContent =
            "Username must be at least 3 characters.";

        usernameError.style.display = "block";
        return;
    }

    const account = JSON.parse(
        localStorage.getItem("essazlifeWorldAccount")
    );

    account.username = username;

    localStorage.setItem(
        "essazlifeWorldAccount",
        JSON.stringify(account)
    );

    changeUsernameOverlay.classList.remove("show");
});

changePasswordButton.addEventListener("click", function () {
    changePasswordForm.reset();

    passwordChangeError.style.display = "none";
    passwordChangeError.textContent = "";

    settingsOverlay.classList.remove("show");
    changePasswordOverlay.classList.add("show");
});

changePasswordClose.addEventListener("click", function () {
    changePasswordOverlay.classList.remove("show");
});

changePasswordForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    passwordChangeError.style.display = "none";
    passwordChangeError.textContent = "";

    const account = JSON.parse(
        localStorage.getItem("essazlifeWorldAccount")
    );

    const currentPasswordHash =
        await hashPassword(currentPassword.value);

    if (currentPasswordHash !== account.passwordHash) {
        passwordChangeError.textContent =
            "Current password is incorrect.";

        passwordChangeError.style.display = "block";
        return;
    }

    if (newPassword.value.length < 6) {
        passwordChangeError.textContent =
            "New password must be at least 6 characters.";

        passwordChangeError.style.display = "block";
        return;
    }

    if (newPassword.value !== confirmNewPassword.value) {
        passwordChangeError.textContent =
            "New passwords do not match.";

        passwordChangeError.style.display = "block";
        return;
    }

    account.passwordHash =
        await hashPassword(newPassword.value);

    localStorage.setItem(
        "essazlifeWorldAccount",
        JSON.stringify(account)
    );

    changePasswordForm.reset();
    changePasswordOverlay.classList.remove("show");
});

logoutButton.addEventListener("click", function () {
    logoutConfirmOverlay.classList.add("show");
});

cancelLogoutButton.addEventListener("click", function () {
    logoutConfirmOverlay.classList.remove("show");
});

confirmLogoutButton.addEventListener("click", function () {
    localStorage.setItem(
        "essazlifeWorldLoggedIn",
        "false"
    );

    logoutConfirmOverlay.classList.remove("show");
    settingsOverlay.classList.remove("show");

    welcomeBackMessage.textContent = "";
    welcomeScreen.style.display = "flex";
});

deleteAccountButton.addEventListener("click", function () {
    deleteConfirmOverlay.classList.add("show");
});

cancelDeleteButton.addEventListener("click", function () {
    deleteConfirmOverlay.classList.remove("show");
});

confirmDeleteButton.addEventListener("click", function () {
    localStorage.removeItem("essazlifeWorldAccount");
    localStorage.removeItem("essazlifeWorldLoggedIn");

    deleteConfirmOverlay.classList.remove("show");
    settingsOverlay.classList.remove("show");

    welcomeBackMessage.textContent = "";
    welcomeScreen.style.display = "flex";
});

settingsClose.addEventListener("click", function () {
    settingsOverlay.classList.remove("show");
});

settingsOverlay.addEventListener("click", function (event) {
    if (event.target === settingsOverlay) {
        settingsOverlay.classList.remove("show");
    }
});

const welcomeCreateButton = document.getElementById("welcomeCreateButton");
const createAccountOverlay = document.getElementById("createAccountOverlay");
const createAccountClose = document.getElementById("createAccountClose");

const welcomeScreen = document.getElementById("welcomeScreen");
const welcomeBackMessage = document.getElementById("welcomeBackMessage");

welcomeCreateButton.addEventListener("click", function () {
    createAccountOverlay.classList.add("show");
});

createAccountClose.addEventListener("click", function () {
    createAccountOverlay.classList.remove("show");
});

createAccountOverlay.addEventListener("click", function (event) {
    if (event.target === createAccountOverlay) {
        createAccountOverlay.classList.remove("show");
    }
});

const createAccountForm = document.getElementById("createAccountForm");
const createUsername = document.getElementById("createUsername");
const createPassword = document.getElementById("createPassword");
const createNickname = document.getElementById("createNickname");
const confirmPassword = document.getElementById("confirmPassword");
const createAccountError = document.getElementById("createAccountError");

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);

    const hashBuffer = await crypto.subtle.digest("SHA-256", data);

    const hashArray = Array.from(new Uint8Array(hashBuffer));

    return hashArray
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");
}


createAccountForm.addEventListener("submit", async function (event) {
    event.preventDefault();

   const nickname = createNickname.value.trim();
const username = createUsername.value.trim();
const password = createPassword.value;
    const confirmedPassword = confirmPassword.value;
    

    createAccountError.style.display = "none";
    createAccountError.textContent = "";

    if (nickname.length < 1) {
    createAccountError.textContent =
        "Please enter a nickname.";

    createAccountError.style.display = "block";
    return;
}

    if (username.length < 3) {
        createAccountError.textContent =
            "Username must be at least 3 characters.";

        createAccountError.style.display = "block";
        return;
    }

    if (password.length < 6) {
        createAccountError.textContent =
            "Password must be at least 6 characters.";

        createAccountError.style.display = "block";
        return;
    }

    if (password !== confirmedPassword) {
        createAccountError.textContent =
            "Passwords do not match.";

        createAccountError.style.display = "block";
        return;
    }

    const passwordHash = await hashPassword(password);

    const worldAccount = {
    nickname: nickname,
    username: username,
    passwordHash: passwordHash
};

    localStorage.setItem(
        "essazlifeWorldAccount",
        JSON.stringify(worldAccount)
    );

    localStorage.setItem(
        "essazlifeWorldLoggedIn",
        "true"
    );

    createAccountOverlay.classList.remove("show");
    welcomeScreen.style.display = "none";

    createAccountForm.reset();

    console.log("ESSAzLife World account created.");

    showWelcomeBackMessage();
});

const savedLoginState = localStorage.getItem("essazlifeWorldLoggedIn");

if (savedLoginState === "true") {
    welcomeScreen.style.display = "none";
    showWelcomeBackMessage();
}

function showWelcomeBackMessage() {
    const savedAccount = localStorage.getItem("essazlifeWorldAccount");

    if (!savedAccount) {
        welcomeBackMessage.textContent = "";
        return;
    }

    const account = JSON.parse(savedAccount);

    if (account.nickname) {
        welcomeBackMessage.textContent =
            "Welcome Back, " + account.nickname;
    }
}

const welcomeLoginButton = document.getElementById("welcomeLoginButton");
const loginOverlay = document.getElementById("loginOverlay");
const loginClose = document.getElementById("loginClose");
const loginForm = document.getElementById("loginForm");
const loginUsername = document.getElementById("loginUsername");
const loginPassword = document.getElementById("loginPassword");
const loginError = document.getElementById("loginError");

welcomeLoginButton.addEventListener("click", function () {
    loginError.style.display = "none";
    loginOverlay.classList.add("show");
});

loginClose.addEventListener("click", function () {
    loginOverlay.classList.remove("show");
});

loginOverlay.addEventListener("click", function (event) {
    if (event.target === loginOverlay) {
        loginOverlay.classList.remove("show");
    }
});

loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    loginError.style.display = "none";
    loginError.textContent = "";

    const savedAccount = localStorage.getItem("essazlifeWorldAccount");

    if (!savedAccount) {
        loginError.textContent =
            "No World account was found on this device.";

        loginError.style.display = "block";
        return;
    }

    const account = JSON.parse(savedAccount);

    const enteredUsername = loginUsername.value.trim();
    const enteredPassword = loginPassword.value;

    const enteredPasswordHash = await hashPassword(enteredPassword);

    if (
        enteredUsername !== account.username ||
        enteredPasswordHash !== account.passwordHash
    ) {
        loginError.textContent =
            "Incorrect username or password.";

        loginError.style.display = "block";
        return;
    }

    localStorage.setItem(
        "essazlifeWorldLoggedIn",
        "true"
    );

    loginOverlay.classList.remove("show");
    welcomeScreen.style.display = "none";

    loginForm.reset();

    showWelcomeBackMessage();
});

/* =========================================================
   OPEN HANDLER EDITION
========================================================= */

const handlerApp = document.getElementById("handlerApp");

handlerApp.addEventListener("click", function () {
    window.location.href = "apps/handler/index.html";
});

const playModeApp = document.getElementById("playModeApp");

playModeApp.addEventListener("click", function () {
    window.location.href = "apps/playmode/index.html";
});

/*-------------------------------------------------------
  OPEN CHOREZ APP
---------------------------------------------------------*/

const chorezApp =
    document.getElementById("chorezApp");

if (chorezApp) {

    chorezApp.addEventListener(
        "click",
        function () {

            window.location.href =
                "apps/chorez/index.html";
        }
    );
}

/* =========================================================
   PWA SERVICE WORKER
========================================================= */

if ("serviceWorker" in navigator) {

    window.addEventListener("load", function () {

        navigator.serviceWorker
            .register("./service-worker.js")
            .then(function () {
                console.log(
                    "ESSAzLife World service worker registered."
                );
            })
            .catch(function (error) {
                console.error(
                    "Service worker registration failed:",
                    error
                );
            });
    });
}