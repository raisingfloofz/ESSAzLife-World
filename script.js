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
    const cloudAccount = getActiveCloudAccount();
    const savedAccount = localStorage.getItem("essazlifeWorldAccount");
    let localAccount = null;
    try { localAccount = savedAccount ? JSON.parse(savedAccount) : null; } catch {}
    const account = cloudAccount || localAccount;
    settingsAccountName.textContent = account
        ? account.nickname + " • @" + account.username
        : "No World account signed in";

    // Cloud account changes are handled by the Cloudflare backend.
    const cloudMode = localStorage.getItem("essazlifeWorldLoginMode") === "cloud";
    changeNicknameButton.disabled = false;
    changePasswordButton.disabled = false;
    changeUsernameButton.disabled = cloudMode;
    changeUsernameButton.title = cloudMode ? "Cloud username changes are not supported." : "";
    deleteAccountButton.disabled = false;
    upgradeWorldCloudButton.disabled = cloudMode;
    upgradeWorldCloudButton.title = cloudMode
        ? "This is already a cloud account." : "";
    worldCloudUpgradeStatus.textContent = cloudMode
        ? "☁️ Signed in to World Cloud. Nickname, password, and deletion are managed securely online."
        : "";
    settingsOverlay.classList.add("show");
});

changeNicknameButton.addEventListener("click", function () {
    const cloud = getActiveCloudAccount();
    const savedAccount = localStorage.getItem("essazlifeWorldAccount");
    if (!cloud && !savedAccount) return;
    const account = cloud || JSON.parse(savedAccount);
    newNickname.value = account.nickname;

    nicknameError.style.display = "none";
    nicknameError.textContent = "";

    settingsOverlay.classList.remove("show");
    changeNicknameOverlay.classList.add("show");
});

changeNicknameClose.addEventListener("click", function () {
    changeNicknameOverlay.classList.remove("show");
});

changeNicknameForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const cloudMode = localStorage.getItem("essazlifeWorldLoginMode") === "cloud";
    const nickname = newNickname.value.trim();

    if (nickname.length < 1) {
        nicknameError.textContent = "Please enter a nickname.";
        nicknameError.style.display = "block";
        return;
    }

    if (cloudMode) {
        const submit = changeNicknameForm.querySelector('button[type="submit"]');
        submit.disabled = true;
        try {
            const result = await worldCloudAuthenticatedRequest("/account/nickname", { nickname });
            saveWorldCloudSession(
                sessionStorage.getItem("essazlifeWorldCloudToken") || localStorage.getItem("essazlifeWorldCloudToken"),
                result.account
            );
            changeNicknameOverlay.classList.remove("show");
            showWelcomeBackMessage();
        } catch (error) { showWorldFormError(nicknameError, error); }
        finally { submit.disabled = false; }
        return;
    }
    const account = JSON.parse(localStorage.getItem("essazlifeWorldAccount"));
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
    if (localStorage.getItem("essazlifeWorldLoginMode") === "cloud") return;

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
    const cloudMode = localStorage.getItem("essazlifeWorldLoginMode") === "cloud";

    passwordChangeError.style.display = "none";
    passwordChangeError.textContent = "";

    if (cloudMode) {
        if (newPassword.value.length < 12 || newPassword.value.length > 128) {
            return showWorldFormError(passwordChangeError, new Error("Cloud passwords must be 12–128 characters."));
        }
        if (newPassword.value !== confirmNewPassword.value) {
            return showWorldFormError(passwordChangeError, new Error("New passwords do not match."));
        }
        const submit = changePasswordForm.querySelector('button[type="submit"]');
        submit.disabled = true;
        try {
            const result = await worldCloudAuthenticatedRequest("/account/password", {
                currentPassword: currentPassword.value, newPassword: newPassword.value
            });
            saveWorldCloudSession(result.token, result.account);
            changePasswordForm.reset();
            changePasswordOverlay.classList.remove("show");
        } catch (error) { showWorldFormError(passwordChangeError, error); }
        finally { submit.disabled = false; }
        return;
    }
    const account = JSON.parse(localStorage.getItem("essazlifeWorldAccount"));
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

confirmLogoutButton.addEventListener("click", async function () {
    confirmLogoutButton.disabled = true;
    try {
        if (localStorage.getItem("essazlifeWorldLoginMode") === "cloud") {
            await worldCloudAuthenticatedRequest("/logout", {});
        }
        clearWorldCloudSession();
        localStorage.setItem("essazlifeWorldLoginMode", "none");
        localStorage.setItem("essazlifeWorldLoggedIn", "false");
        logoutConfirmOverlay.classList.remove("show");
        settingsOverlay.classList.remove("show");
        welcomeBackMessage.textContent = "";
        welcomeScreen.style.display = "flex";
    } catch (error) {
        alert("Cloud logout could not be confirmed. Please check your connection and try again. " + error.message);
    } finally { confirmLogoutButton.disabled = false; }
});

deleteAccountButton.addEventListener("click", function () {
    const cloud = localStorage.getItem("essazlifeWorldLoginMode") === "cloud";
    document.getElementById("cloudDeleteFields").hidden = !cloud;
    document.getElementById("deleteExplanation").textContent = cloud
        ? "Permanently delete your World Cloud account. Your local World account and ESSA app data will remain on this device. This cannot be undone."
        : "This removes only your local World account on this device. ESSA app data is not deleted.";
    document.getElementById("cloudDeleteError").style.display = "none";
    deleteConfirmOverlay.classList.add("show");
});

cancelDeleteButton.addEventListener("click", function () {
    deleteConfirmOverlay.classList.remove("show");
});

confirmDeleteButton.addEventListener("click", async function () {
    if (localStorage.getItem("essazlifeWorldLoginMode") === "cloud") {
        const password = document.getElementById("cloudDeletePassword").value;
        const confirmation = document.getElementById("cloudDeleteConfirmText").value;
        const errorBox = document.getElementById("cloudDeleteError");
        if (!password || confirmation !== "DELETE") {
            return showWorldFormError(errorBox, new Error("Enter your cloud password and type DELETE."));
        }
        confirmDeleteButton.disabled = true;
        try {
            await worldCloudAuthenticatedRequest("/account/delete", {password, confirm:"DELETE"});
            clearWorldCloudSession();
            localStorage.setItem("essazlifeWorldLoginMode", "none");
            localStorage.setItem("essazlifeWorldLoggedIn", "false");
            deleteConfirmOverlay.classList.remove("show");
            settingsOverlay.classList.remove("show");
            welcomeBackMessage.textContent = "";
            welcomeScreen.style.display = "flex";
            document.getElementById("cloudDeletePassword").value = "";
            document.getElementById("cloudDeleteConfirmText").value = "";
        } catch (error) { showWorldFormError(errorBox, error); }
        finally { confirmDeleteButton.disabled = false; }
        return;
    }
    clearWorldCloudSession();
    localStorage.setItem("essazlifeWorldLoginMode", "none");
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

    clearWorldCloudSession();
    localStorage.setItem("essazlifeWorldLoginMode", "local");
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


/* =========================================
   ESSAzLife World Cloud Authentication
   ========================================= */

const WORLD_AUTH_URL =
    "https://essazlife-world-auth.biawhite1024.workers.dev";

function showWorldFormError(element, error) {
    element.textContent = error.message || "Something went wrong.";
    element.style.display = "block";
}

async function worldCloudAuthenticatedRequest(endpoint, data) {
    const token = sessionStorage.getItem("essazlifeWorldCloudToken") ||
        localStorage.getItem("essazlifeWorldCloudToken");
    if (!token) throw new Error("Please log in to World Cloud again.");
    let response;
    try {
        response = await fetch(WORLD_AUTH_URL + endpoint, {
            method: "POST",
            headers: {"Content-Type":"application/json", Authorization:"Bearer " + token},
            body: JSON.stringify(data), cache: "no-store"
        });
    } catch { throw new Error("Cloud unavailable. Check your connection."); }
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || "Cloud request failed (" + response.status + ").");
    return result;
}

async function worldCloudRequest(endpoint, data) {
    const response = await fetch(
        WORLD_AUTH_URL + endpoint,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.error || "Cloud authentication failed."
        );
    }

    return result;
}


async function registerWorldCloudAccount(
    username,
    nickname,
    password
) {
    if (password.length < 12) {
        throw new Error(
            "Cloud passwords must be at least 12 characters."
        );
    }

    if (password.length > 128) {
        throw new Error(
            "Cloud passwords cannot exceed 128 characters."
        );
    }

    return worldCloudRequest("/register", {
        username,
        nickname,
        password
    });
}


async function loginWorldCloudAccount(
    username,
    password
) {
    return worldCloudRequest("/login", {
        username,
        password
    });
}


/* Remember World Cloud login across PWA restarts. The server still expires
   tokens after 24 hours. Never trust the cached profile without /me. */
function saveWorldCloudSession(token, account) {
    localStorage.setItem("essazlifeWorldCloudToken", token);
    localStorage.setItem("essazlifeWorldCloudAccount", JSON.stringify(account));
    // Embedded apps currently expect the sessionStorage keys too.
    sessionStorage.setItem("essazlifeWorldCloudToken", token);
    sessionStorage.setItem("essazlifeWorldCloudAccount", JSON.stringify(account));
}

function clearWorldCloudSession() {
    sessionStorage.removeItem("essazlifeWorldCloudToken");
    sessionStorage.removeItem("essazlifeWorldCloudAccount");
    localStorage.removeItem("essazlifeWorldCloudToken");
    localStorage.removeItem("essazlifeWorldCloudAccount");
}

function getActiveCloudAccount() {
    if (localStorage.getItem("essazlifeWorldLoginMode") !== "cloud") return null;
    try {
        const account = JSON.parse(sessionStorage.getItem("essazlifeWorldCloudAccount") ||
            localStorage.getItem("essazlifeWorldCloudAccount"));
        return account && typeof account.username === "string" &&
            typeof account.nickname === "string" ? account : null;
    } catch { return null; }
}

function showWelcomeBackMessage() {
    let account = getActiveCloudAccount();
    if (!account && localStorage.getItem("essazlifeWorldLoginMode") !== "cloud") {
        try {
            account = JSON.parse(localStorage.getItem("essazlifeWorldAccount"));
        } catch { account = null; }
    }
    welcomeBackMessage.textContent = account && account.nickname
        ? "Welcome Back, " + account.nickname : "";
}

async function restoreWorldLogin() {
    const mode = localStorage.getItem("essazlifeWorldLoginMode");
    const loggedIn = localStorage.getItem("essazlifeWorldLoggedIn") === "true";
    if (mode === "cloud") {
        // Keep the welcome screen up until the server verifies this session.
        welcomeScreen.style.display = "flex";
        const token = sessionStorage.getItem("essazlifeWorldCloudToken") ||
            localStorage.getItem("essazlifeWorldCloudToken");
        if (!token) {
            localStorage.setItem("essazlifeWorldLoggedIn", "false");
            welcomeBackMessage.textContent = "";
            return;
        }
        try {
            const response = await fetch(WORLD_AUTH_URL + "/me", {
                headers: { Authorization: "Bearer " + token },
                cache: "no-store"
            });
            if (!response.ok) throw new Error("Cloud session expired or unavailable");
            const result = await response.json();
            if (!result.account || !result.account.username || !result.account.nickname) {
                throw new Error("Invalid cloud profile");
            }
            saveWorldCloudSession(token, result.account);
            localStorage.setItem("essazlifeWorldLoggedIn", "true");
            showWelcomeBackMessage();
            welcomeScreen.style.display = "none";
        } catch (error) {
            // Preserve the token for a possible transient network outage, but
            // never grant access without verification. Explicit login can retry.
            localStorage.setItem("essazlifeWorldLoggedIn", "false");
            welcomeBackMessage.textContent = "";
            console.warn("World Cloud session requires a new login:", error.message);
        }
        return;
    }
    if (loggedIn && localStorage.getItem("essazlifeWorldAccount")) {
        welcomeScreen.style.display = "none";
        showWelcomeBackMessage();
    }
}
restoreWorldLogin();

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


/* =========================================
   WORLD LOGIN — CLOUD + LEGACY LOCAL
   ========================================= */

loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    loginError.style.display = "none";
    loginError.textContent = "";

    const username = loginUsername.value.trim();
    const password = loginPassword.value;

    const submitButton =
        loginForm.querySelector('button[type="submit"]');

    submitButton.disabled = true;

    try {
        // Try the cloud account first.
        const result = await loginWorldCloudAccount(
            username,
            password
        );

        if (!result.token || !result.account) {
            throw new Error("Cloud login was incomplete.");
        }

        saveWorldCloudSession(result.token, result.account);

        // Preserve any existing local account without displaying its profile.
        localStorage.setItem("essazlifeWorldLoginMode", "cloud");
        localStorage.setItem(
            "essazlifeWorldLoggedIn",
            "true"
        );

        loginOverlay.classList.remove("show");
        welcomeScreen.style.display = "none";
        loginForm.reset();

        welcomeBackMessage.textContent =
            "Welcome Back, " + result.account.nickname;

    } catch (error) {
        // Only permit legacy login for a matching
        // account already saved on this device.
        let localAccount = null;

        try {
            localAccount = JSON.parse(
                localStorage.getItem("essazlifeWorldAccount")
            );
        } catch {
            localAccount = null;
        }

        const localMatches =
            localAccount &&
            localAccount.username === username &&
            localAccount.passwordHash ===
                await hashPassword(password);

        if (localMatches) {
            clearWorldCloudSession();
            localStorage.setItem("essazlifeWorldLoginMode", "local");

            localStorage.setItem(
                "essazlifeWorldLoggedIn",
                "true"
            );

            loginOverlay.classList.remove("show");
            welcomeScreen.style.display = "none";
            loginForm.reset();

            showWelcomeBackMessage();
        } else {
            loginError.textContent =
                error.message === "Failed to fetch"
                    ? "Cloud unavailable. Check your connection."
                    : "Incorrect username or password, or cloud login unavailable.";

            loginError.style.display = "block";
        }
    } finally {
        submitButton.disabled = false;
    }
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
            .then(function (registration) {

    console.log(
        "ESSAzLife World service worker registered."
    );

    // Check for a newer version whenever World opens.
    registration.update().catch(function (error) {
        console.log(
            "Update check unavailable:",
            error
        );
    });

})
            .catch(function (error) {
                console.error(
                    "Service worker registration failed:",
                    error
                );
            });
    });
}

/* =========================================================
   WORLD TUTORIAL
========================================================= */

const watchTutorialButton =
    document.getElementById("watchTutorialButton");

if (watchTutorialButton) {
    watchTutorialButton.addEventListener(
        "click",
        function () {
            window.open(
                "https://youtu.be/kRgJaMIpOGk",
                "_blank"
            );
        }
    );
}

/* =========================================================
   OPTIONAL GOOGLE CLOUD SIGN-IN
========================================================= */

const googleSignInButton =
    document.getElementById("googleSignInButton");

const cloudSyncStatus =
    document.getElementById("cloudSyncStatus");

window.addEventListener("load", function () {

    const firebase = window.essazFirebase;

    if (!firebase) {
        console.log("Firebase is not available.");
        return;
    }

    firebase.onAuthStateChanged(firebase.auth, function (user) {

        if (user) {

            googleSignOutButton.style.display = "block";

            cloudSyncStatus.textContent =
                "Connected to Google: " +
                (user.email || "Account connected");

            googleSignInButton.textContent =
                "✅ Google Connected";

        } else {

            googleSignOutButton.style.display = "none";

            cloudSyncStatus.textContent =
                "Not connected to cloud.";

            googleSignInButton.textContent =
                "☁️ Connect with Google";

        }

    });

});

if (googleSignInButton && cloudSyncStatus) {

    googleSignInButton.addEventListener("click", async function () {

        googleSignInButton.disabled = true;
        cloudSyncStatus.textContent = "Connecting to Google...";

        try {

            const firebase = window.essazFirebase;

            if (!firebase) {
                throw new Error("Firebase is not ready.");
            }

            const user = await firebase.signInWithGoogle();

            cloudSyncStatus.textContent =
                "Connected to Google: " + (user.email || "Account connected");

            googleSignInButton.textContent =
                "✅ Google Connected";

        } catch (error) {

            console.error("Google sign-in error:", error);

            cloudSyncStatus.textContent =
                "Could not connect to Google. Please try again.";

        } finally {

            googleSignInButton.disabled = false;

        }

    });

}

/* =========================================================
   DISCONNECT GOOGLE CLOUD ACCOUNT
========================================================= */

const googleSignOutButton =
    document.getElementById("googleSignOutButton");

if (googleSignOutButton) {

    googleSignOutButton.addEventListener("click", async function () {

        googleSignOutButton.disabled = true;

        try {

            const firebase = window.essazFirebase;

            if (!firebase) {
                throw new Error("Firebase is not ready.");
            }

            await firebase.signOut(firebase.auth);

            cloudSyncStatus.textContent =
                "Not connected to cloud.";

            googleSignInButton.textContent =
                "☁️ Connect with Google";

            googleSignOutButton.style.display = "none";

            console.log("Google disconnected successfully.");

        } catch (error) {

            console.error("Google disconnect error:", error);

            cloudSyncStatus.textContent =
                "Could not disconnect Google. Please try again.";

        } finally {

            googleSignOutButton.disabled = false;

        }

    });

}




/* =========================================
   WORLD CLOUD ACCOUNT UPGRADE
   ========================================= */

const upgradeWorldCloudButton =
    document.getElementById("upgradeWorldCloudButton");

const worldCloudUpgradeStatus =
    document.getElementById("worldCloudUpgradeStatus");

const cloudVerifyOverlay =
    document.getElementById("cloudVerifyOverlay");

const cloudVerifyClose =
    document.getElementById("cloudVerifyClose");

const cloudVerifyForm =
    document.getElementById("cloudVerifyForm");

const cloudVerifyPassword =
    document.getElementById("cloudVerifyPassword");

const cloudVerifyError =
    document.getElementById("cloudVerifyError");

let verifiedWorldAccount = null;

function closeCloudVerify() {
    cloudVerifyOverlay.classList.remove("show");
    cloudVerifyForm.reset();
    cloudVerifyError.textContent = "";
    cloudVerifyError.style.display = "none";
    verifiedWorldAccount = null;
}

function cloudUpgradeError(message) {
    cloudVerifyError.textContent = message;
    cloudVerifyError.style.display = "block";
}

upgradeWorldCloudButton.addEventListener("click", function () {
    closeCloudVerify();

    cloudVerifyOverlay.classList.add("show");
    cloudVerifyPassword.focus();
});

cloudVerifyClose.addEventListener("click", closeCloudVerify);

cloudVerifyOverlay.addEventListener("click", function (event) {
    if (event.target === cloudVerifyOverlay) {
        closeCloudVerify();
    }
});

cloudVerifyForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    cloudVerifyError.style.display = "none";
    cloudVerifyError.textContent = "";

    const submitButton =
        cloudVerifyForm.querySelector('button[type="submit"]');

    submitButton.disabled = true;

    try {
        const savedAccount =
            localStorage.getItem("essazlifeWorldAccount");

        if (!savedAccount) {
            throw new Error("No local World account was found.");
        }

        const account = JSON.parse(savedAccount);
        const enteredPassword = cloudVerifyPassword.value;

        if (!account.username || !account.nickname ||
            !account.passwordHash) {
            throw new Error("Your local account is incomplete.");
        }

        const enteredHash = await hashPassword(enteredPassword);

        if (enteredHash !== account.passwordHash) {
            throw new Error("Incorrect World password.");
        }

        let cloudPassword = enteredPassword;

        if (cloudPassword.length < 12) {
            const newPassword =
                document.getElementById("cloudNewPassword").value;

            if (newPassword.length < 12) {
                throw new Error(
                    "Your existing password is verified. " +
                    "Choose a cloud password with at least 12 characters."
                );
            }

            if (newPassword.length > 128) {
                throw new Error(
                    "Cloud passwords cannot exceed 128 characters."
                );
            }

            cloudPassword = newPassword;
        }

        worldCloudUpgradeStatus.textContent =
            "⏳ Creating your cloud account...";

        const result = await registerWorldCloudAccount(
            account.username,
            account.nickname,
            cloudPassword
        );

        if (!result.token || !result.account) {
            throw new Error("Cloud registration was incomplete.");
        }

        // Keep the cloud session separate from local login.
        saveWorldCloudSession(result.token, result.account);
        localStorage.setItem("essazlifeWorldLoginMode", "cloud");
        localStorage.setItem("essazlifeWorldLoggedIn", "true");
        showWelcomeBackMessage();

        closeCloudVerify();

        worldCloudUpgradeStatus.textContent =
            "✅ Cloud account created! @" +
            result.account.username +
            " can now log in on another device.";

        console.log("World cloud account registration successful.");

    } catch (error) {
        console.error("Cloud upgrade error:", error);

        const message = error instanceof TypeError
            ? "Could not connect to Cloudflare. Try again later."
            : error.message;

        cloudUpgradeError(message);

        worldCloudUpgradeStatus.textContent =
            "Cloud upgrade not completed. Your local account is safe.";

    } finally {
        submitButton.disabled = false;
    }
});
