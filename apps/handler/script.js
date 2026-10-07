/* =========================================================
   ESSAzLife
   FULL SCRIPT.JS
========================================================= */
/* =========================================================
   ESSAZLIFE WORLD CONNECTION
========================================================= */

const WORLD_ACCOUNT_KEY = "essazlifeWorldAccount";
const WORLD_LOGIN_KEY = "essazlifeWorldLoggedIn";

function getWorldAccount() {

    const isLoggedIn =
        localStorage.getItem(
            WORLD_LOGIN_KEY
        ) === "true";

    if (!isLoggedIn) {
        return null;
    }

    const savedAccount =
        localStorage.getItem(
            WORLD_ACCOUNT_KEY
        );

    if (!savedAccount) {
        return null;
    }

    try {
        return JSON.parse(
            savedAccount
        );
    } catch (error) {
        return null;
    }
}

/* =========================================================
   GLOBAL STORAGE
========================================================= */

const ACCOUNTS_KEY = "essazLifeAccounts";
const SESSION_KEY = "essazLifeCurrentUser";

let pendingWelcomeCredentials = null;


/* =========================================================
   APP DATA
========================================================= */

const breedOptions = {

    Dog: [
        "Labrador Retriever",
        "Golden Retriever",
        "German Shepherd",
        "Border Collie",
        "Siberian Husky",
        "Beagle",
        "Springer Spaniel",
        "German Shorthaired Pointer",
        "Poodle",
        "Australian Shepherd",
        "Corgi",
        "Chihuahua",
        "Pit Bull",
        "Mixed Breed"
    ],

    Cat: [
        "Domestic Shorthair",
        "Domestic Longhair",
        "Maine Coon",
        "Siamese",
        "Persian",
        "Ragdoll",
        "Bengal",
        "Sphynx",
        "British Shorthair",
        "Mixed Breed"
    ],

    Bunny: [
        "Holland Lop",
        "Mini Lop",
        "Netherland Dwarf",
        "Lionhead",
        "Dutch",
        "Flemish Giant",
        "Rex",
        "Mixed Breed"
    ],

    Bear: [
        "Brown Bear",
        "Black Bear",
        "Polar Bear",
        "Panda",
        "Teddy Bear"
    ],

    Cow: [
        "Holstein",
        "Jersey",
        "Angus",
        "Highland",
        "Hereford",
        "Longhorn"
    ],

    Fox: [
        "Red Fox",
        "Arctic Fox",
        "Fennec Fox",
        "Gray Fox",
        "Kit Fox",
        "Swift Fox",
        "Silver Fox"
    ],

    Wolf: [
        "Gray Wolf",
        "Arctic Wolf",
        "Red Wolf",
        "Mexican Gray Wolf",
        "Eurasian Wolf"
    ],

    Coyote: [
        "Eastern Coyote",
        "Western Coyote",
        "Plains Coyote",
        "Mountain Coyote",
        "Desert Coyote"
    ],

    Frog: [
        "Tree Frog",
        "Bullfrog",
        "Poison Dart Frog"
    ],

    Elephant: [
        "African Elephant",
        "Asian Elephant"
    ],

    Monkey: [
        "Capuchin",
        "Macaque",
        "Spider Monkey",
        "Squirrel Monkey"
    ],

    Deer: [
        "White-Tailed Deer",
        "Mule Deer",
        "Red Deer",
        "Fallow Deer"
    ],

    Bird: [
        "Parakeet",
        "Cockatiel",
        "Parrot",
        "Canary",
        "Finch",
        "Owl",
        "Crow"
    ],

    Penguin: [
        "Macaroni",
        "Emperor",
        "Chinstrap",
        "Humboldt",
        "Gentoo",
        "Adelie"
    ],

    Pig: [
        "Berkshire",
        "Duroc",
        "Hampshire",
        "Landrace",
        "Pietrain",
        "Bentheim Black Pied",
        "Pot-Bellied Pig",
        "Kunekune",
        "Juliana Pig"
    ],

    Leopard: [
        "African Leopard",
        "Amur Leopard",
        "Arabian Leopard",
        "Indian Leopard",
        "Javan Leopard",
        "Persian Leopard",
        "Sri Lankan Leopard",
        "Snow Leopard"
    ],

    Tiger: [
        "Bengal Tiger",
        "Siberian Tiger",
        "Sumatran Tiger",
        "Malayan Tiger",
        "Indochinese Tiger",
        "South China Tiger"
    ],

    Lion: [
        "African Lion",
        "Asiatic Lion"
    ],

    Horse: [
        "Arabian",
        "Quarter Horse",
        "Thoroughbred",
        "Appaloosa",
        "Paint Horse",
        "Mustang",
        "Morgan",
        "Friesian",
        "Clydesdale",
        "Percheron",
        "Shetland Pony",
        "Welsh Pony",
        "Miniature Horse",
        "Mixed Breed"
    ],

    Opossum: [
        "Virginia Opossum",
        "Common Opossum",
        "Short-Tailed Opossum",
        "Woolly Opossum"
    ],

    "Red Panda": [
        "Himalayan Red Panda",
        "Chinese Red Panda"
    ],

    "Rodent / Small Animal": [
        "Ferret",
        "Mouse",
        "Rat",
        "Guinea Pig",
        "Hamster",
        "Gerbil",
        "Chinchilla",
        "Squirrel",
        "Chipmunk",
        "Prairie Dog",
        "Capybara"
    ],

    Bug: [
        "Butterfly",
        "Moth",
        "Ladybug",
        "Beetle",
        "Bee",
        "Bumblebee",
        "Dragonfly",
        "Grasshopper",
        "Cricket",
        "Praying Mantis",
        "Caterpillar",
        "Firefly",
        "Ant",
        "Spider",
        "Other Bug"
    ]
};


const speciesIcons = {
    Dog: "🐶",
    Cat: "🐱",
    Bunny: "🐰",
    Bear: "🐻",
    Cow: "🐮",
    Fox: "🦊",
    Wolf: "🐺",
    Coyote: "🐺",
    Frog: "🐸",
    Elephant: "🐘",
    Monkey: "🐵",
    Deer: "🦌",
    Bird: "🐦",
    Penguin: "🐧",
    Pig: "🐷",
    Leopard: "🐆",
    Tiger: "🐯",
    Lion: "🦁",
    Horse: "🐴",
    Opossum: "🐾",
    "Red Panda": "🐾",
    "Rodent / Small Animal": "🐹",
    Bug: "🐞",
    Custom: "🐾"
};


const standardSpecies = [
    "Dog",
    "Cat",
    "Bunny",
    "Bear",
    "Cow",
    "Fox",
    "Wolf",
    "Coyote",
    "Frog",
    "Elephant",
    "Monkey",
    "Deer",
    "Bird",
    "Penguin",
    "Pig",
    "Leopard",
    "Tiger",
    "Lion",
    "Horse",
    "Opossum",
    "Red Panda",
    "Rodent / Small Animal",
    "Bug"
];


const presetColors = [
    "#ff3b30",
    "#ff9500",
    "#ffcc00",
    "#34c759",
    "#007aff",
    "#5856d6",
    "#ff69b4",
    "#87ceeb",
    "#4fb5ae",
    "#8b4513",
    "#000000",
    "#ffffff",
    "#808080",
    "#ffd700",
    "#c0c0c0"
];


const careTypes = [
    { name: "Food", icon: "🍖" },
    { name: "Water", icon: "💧" },
    { name: "Treat", icon: "🦴" },
    { name: "Walk", icon: "🐕" },
    { name: "Outing", icon: "🚗" },
    { name: "Potty", icon: "🚽" },
    { name: "Training", icon: "⭐" },
    { name: "Medication", icon: "💊" },
    { name: "Bath", icon: "🛁" },
    { name: "Brushing", icon: "🪮" }
];


const presetTricks = [
    "Sit",
    "Stay",
    "Come",
    "Down",
    "Heel",
    "Wait",
    "Leave It",
    "Drop It",
    "Touch",
    "Look at Me",
    "Place",
    "Stand",
    "Spin",
    "Shake",
    "High Five",
    "Wave",
    "Roll Over",
    "Play Dead",
    "Bow",
    "Speak",
    "Quiet",
    "Fetch",
    "Find It",
    "Back Up",
    "Jump",
    "Hug",
    "Kiss",
    "Paw"
];


const diaryMoodOptions = [
    { value: "Amazing", emoji: "🤩" },
    { value: "Happy", emoji: "😊" },
    { value: "Calm", emoji: "😌" },
    { value: "Excited", emoji: "🥳" },
    { value: "Loved", emoji: "🥰" },
    { value: "Okay", emoji: "🙂" },
    { value: "Tired", emoji: "😴" },
    { value: "Bored", emoji: "😐" },
    { value: "Confused", emoji: "😕" },
    { value: "Anxious", emoji: "😟" },
    { value: "Sad", emoji: "😢" },
    { value: "Angry", emoji: "😠" },
    { value: "Overwhelmed", emoji: "😵‍💫" },
    { value: "Scared", emoji: "😨" },
    { value: "Custom", emoji: "💭" }
];




/* =========================================================
   BASIC HELPERS
========================================================= */

function escapeHTML(value) {

    return String(
        value ?? ""
    )
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );
}


function safeJSON(
    key,
    fallback
) {

    try {

        const result =
            JSON.parse(
                localStorage.getItem(
                    key
                )
            );

        return result === null
            ? fallback
            : result;

    } catch (error) {

        return fallback;
    }
}


/* =========================================================
   ACCOUNT STORAGE
========================================================= */

function getAccounts() {

    return safeJSON(
        ACCOUNTS_KEY,
        []
    );
}


function saveAccounts(
    accounts
) {

    localStorage.setItem(
        ACCOUNTS_KEY,
        JSON.stringify(
            accounts
        )
    );
}


function getCurrentUserId() {

    return localStorage.getItem(
        SESSION_KEY
    );
}

/* =========================================================
   CONNECT WORLD ACCOUNT TO HANDLER
========================================================= */

function connectWorldAccountToHandler() {

    const worldAccount =
        getWorldAccount();

    if (!worldAccount) {
        return null;
    }

    const accounts =
        getAccounts();

    /*
        First, check whether the currently selected
        Handler account still exists.

        This preserves existing Handler data because
        all Handler data is connected to its internal ID.
    */
    const currentHandlerId =
        getCurrentUserId();

    let handlerAccount =
        accounts.find(
            function(account) {

                return (
                    String(account.id) ===
                    String(currentHandlerId)
                );
            }
        );


    /*
        If there is no current Handler account,
        look for an existing account with the
        same username as the World account.
    */
    if (!handlerAccount) {

        handlerAccount =
            accounts.find(
                function(account) {

                    return (
                        String(
                            account.username ||
                            ""
                        ).toLowerCase() ===
                        String(
                            worldAccount.username ||
                            ""
                        ).toLowerCase()
                    );
                }
            );
    }


    /*
        If this World user has never used Handler
        before, create a Handler data profile for them.
    */
    if (!handlerAccount) {

        handlerAccount = {

            id:
                makeId("user"),

            username:
                worldAccount.username || "",

            nickname:
                worldAccount.nickname ||
                worldAccount.username ||
                "",

            genderIdentity:
                "",

            pronouns:
                "",

            ageGroup:
                "",

            themeColor:
                "#4fb5ae",

            createdAt:
                new Date().toISOString(),

            worldManaged:
                true
        };

        accounts.push(
            handlerAccount
        );
    }


    /*
        World owns nickname and username,
        so keep Handler's copies synchronized.
    */
    handlerAccount.username =
        worldAccount.username || "";

    handlerAccount.nickname =
        worldAccount.nickname ||
        worldAccount.username ||
        "";
    
    /*
    Remove old standalone Handler
    authentication information.
    World now manages authentication.
*/
delete handlerAccount.email;
delete handlerAccount.passwordSalt;
delete handlerAccount.passwordHash;
delete handlerAccount.recoveryBirthMonth;
delete handlerAccount.recoveryBirthDay;
delete handlerAccount.recoveryMiddleName;
delete handlerAccount.recoveryLastName;

handlerAccount.worldManaged =
    true;


    saveAccounts(
        accounts
    );

    setCurrentUserId(
        handlerAccount.id
    );

    return handlerAccount;
}


function setCurrentUserId(
    userId
) {

    if (userId) {

        localStorage.setItem(
            SESSION_KEY,
            String(
                userId
            )
        );

    } else {

        localStorage.removeItem(
            SESSION_KEY
        );
    }
}


function getCurrentUser() {

    const id =
        getCurrentUserId();

    if (!id) {
        return null;
    }

    return (
        getAccounts().find(
            function(account) {

                return (
                    String(
                        account.id
                    ) ===
                    String(
                        id
                    )
                );
            }
        ) || null
    );
}


/* =========================================================
   USER STORAGE
========================================================= */

function userStorageKey(
    type
) {

    const user =
        getCurrentUser();

    if (!user) {
        return null;
    }

    return (
        "essazLife_" +
        user.id +
        "_" +
        type
    );
}
/* =========================================================
   USER DATA STORAGE
========================================================= */

function getSavedEssas() {

    const key =
        userStorageKey(
            "essas"
        );

    if (!key) {
        return [];
    }

    return safeJSON(
        key,
        []
    );
}


function saveEssas(
    essas
) {

    const key =
        userStorageKey(
            "essas"
        );

    if (!key) {
        return;
    }

    localStorage.setItem(
        key,
        JSON.stringify(
            essas
        )
    );
}


function getSavedCare() {

    const key =
        userStorageKey(
            "care"
        );

    if (!key) {
        return [];
    }

    return safeJSON(
        key,
        []
    );
}


function saveCare(
    care
) {

    const key =
        userStorageKey(
            "care"
        );

    if (!key) {
        return;
    }

    localStorage.setItem(
        key,
        JSON.stringify(
            care
        )
    );
}


function getSavedTricks() {

    const key =
        userStorageKey(
            "tricks"
        );

    if (!key) {
        return [];
    }

    return safeJSON(
        key,
        []
    );
}


function saveTricks(
    tricks
) {

    const key =
        userStorageKey(
            "tricks"
        );

    if (!key) {
        return;
    }

    localStorage.setItem(
        key,
        JSON.stringify(
            tricks
        )
    );
}


function getSavedScores() {

    const key =
        userStorageKey(
            "scores"
        );

    if (!key) {
        return [];
    }

    return safeJSON(
        key,
        []
    );
}


function saveScores(
    scores
) {

    const key =
        userStorageKey(
            "scores"
        );

    if (!key) {
        return;
    }

    localStorage.setItem(
        key,
        JSON.stringify(
            scores
        )
    );
}


function getSavedDrawings() {

    const key =
        userStorageKey(
            "drawings"
        );

    if (!key) {
        return [];
    }

    return safeJSON(
        key,
        []
    );
}


function saveDrawings(
    drawings
) {

    const key =
        userStorageKey(
            "drawings"
        );

    if (!key) {
        return;
    }

    localStorage.setItem(
        key,
        JSON.stringify(
            drawings
        )
    );
}


function getSavedDiary() {

    const key =
        userStorageKey(
            "diary"
        );

    if (!key) {
        return [];
    }

    return safeJSON(
        key,
        []
    );
}


function saveDiary(
    diary
) {

    const key =
        userStorageKey(
            "diary"
        );

    if (!key) {
        return;
    }

    localStorage.setItem(
        key,
        JSON.stringify(
            diary
        )
    );
}


/* =========================================================
   HEADER HELPERS
========================================================= */

function getHeaderButtons() {

    return document.querySelector(
        ".header-buttons"
    );
}


function showHeaderButtons(
    shouldShow
) {

    const buttons =
        getHeaderButtons();


    if (!buttons) {

        return;
    }


    buttons.style.display =
        shouldShow
            ? "flex"
            : "none";
}


function setupHeaderButtons() {

    const buttons =
        getHeaderButtons();

    if (!buttons) {
        return;
    }

    const buttonList =
        buttons.querySelectorAll(
            "button"
        );

   // Home
const homeButton =
    document.getElementById("home-button");

if (homeButton) {
    homeButton.onclick =
        function() {
            renderHome();
        };
}


// Help
const helpButton =
    document.getElementById("help-button");

if (helpButton) {
    helpButton.onclick =
        function() {
            showHelp();
        };
}


// Profile
const profileButton =
    document.getElementById("profile-button");

if (profileButton) {
    profileButton.onclick =
        function() {
            renderProfile();
        };
}

}




/* =========================================================
   THEME HELPERS
========================================================= */

function resetPageTheme() {

    document.body.style.background =
        "";

    document.body.style.color =
        "";


    const main =
        document.querySelector(
            "main"
        );


    if (main) {

        main.style.background =
            "";

        main.style.color =
            "";
    }
}

function applyUserTheme() {

    resetPageTheme();

    const user =
        getCurrentUser();

    if (!user) {
        return;
    }

    const color =
        (
            typeof user.themeColor === "string" &&
            /^#[0-9a-f]{6}$/i.test(
                user.themeColor
            )
        )
            ? user.themeColor
            : "#4fb5ae";
    
            document.documentElement.style.setProperty(
    "--user-theme-color",
    color
);

    document.body.style.background =
        hexToRGBA(
            color,
            0.12
        );


    const main =
        document.querySelector(
            "main"
        );


    if (main) {

        main.style.background =
            hexToRGBA(
                color,
                0.06
            );
    }
}

function applyEssaProfileTint(
    favoriteColor
) {

    resetPageTheme();


    const color =
        (
            typeof favoriteColor === "string" &&
            /^#[0-9a-f]{6}$/i.test(
                favoriteColor
            )
        )
            ? favoriteColor
            : "#4fb5ae";


    document.body.style.background =
        hexToRGBA(
            color,
            0.12
        );


    const main =
        document.querySelector(
            "main"
        );


    if (main) {

        main.style.background =
            hexToRGBA(
                color,
                0.06
            );
    }
}



function hexToRGBA(
    hex,
    alpha
) {

    if (
        !hex ||
        !/^#[0-9a-f]{6}$/i.test(
            hex
        )
    ) {

        return (
            "rgba(79,181,174," +
            alpha +
            ")"
        );
    }


    const red =
        parseInt(
            hex.slice(
                1,
                3
            ),
            16
        );


    const green =
        parseInt(
            hex.slice(
                3,
                5
            ),
            16
        );


    const blue =
        parseInt(
            hex.slice(
                5,
                7
            ),
            16
        );


    return (
        "rgba(" +
        red +
        "," +
        green +
        "," +
        blue +
        "," +
        alpha +
        ")"
    );
}


/* =========================================================
   DATE HELPERS
========================================================= */

function formatDate(
    dateValue
) {

    if (!dateValue) {

        return "";
    }


    const date =
        new Date(
            dateValue
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return String(
            dateValue
        );
    }


    return date.toLocaleDateString(
        undefined,
        {
            year:
                "numeric",

            month:
                "long",

            day:
                "numeric"
        }
    );
}


function formatDateTime(
    dateValue
) {

    if (!dateValue) {

        return "";
    }


    const date =
        new Date(
            dateValue
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return String(
            dateValue
        );
    }


    return date.toLocaleString();
}


function getRelativeTime(
    dateValue
) {

    if (!dateValue) {

        return "Never";
    }


    const date =
        new Date(
            dateValue
        );


    const now =
        new Date();


    const difference =
        now.getTime() -
        date.getTime();


    if (
        Number.isNaN(
            difference
        )
    ) {

        return "Unknown";
    }


    const minutes =
        Math.floor(
            difference /
            60000
        );


    if (
        minutes <
        1
    ) {

        return "Just now";
    }


    if (
        minutes <
        60
    ) {

        return (
            minutes +
            (
                minutes === 1
                    ? " minute ago"
                    : " minutes ago"
            )
        );
    }


    const hours =
        Math.floor(
            minutes /
            60
        );


    if (
        hours <
        24
    ) {

        return (
            hours +
            (
                hours === 1
                    ? " hour ago"
                    : " hours ago"
            )
        );
    }


    const days =
        Math.floor(
            hours /
            24
        );


    if (
        days <
        30
    ) {

        return (
            days +
            (
                days === 1
                    ? " day ago"
                    : " days ago"
            )
        );
    }


    return formatDate(
        date
    );
}


/* =========================================================
   ID HELPER
========================================================= */

function makeId(
    prefix = "item"
) {

    return (
        prefix +
        "-" +
        Date.now() +
        "-" +
        Math.random()
            .toString(
                36
            )
            .slice(
                2,
                9
            )
    );
}


/* =========================================================
   BASIC HELP / ABOUT
========================================================= */

function showHelp() {

    const oldPopup =
        document.getElementById(
            "help-popup"
        );

    if (oldPopup) {
        oldPopup.remove();
    }

    const popup =
        document.createElement(
            "div"
        );

    popup.id =
        "help-popup";

    popup.innerHTML = `

        <div class="training-delete-overlay">

            <div class="training-delete-box">

                <h2>
                    ❓ Handler Edition Help
                </h2>

                <p>
                    Learn how to use ESSAzLife Handler Edition
                    to manage your ESSAs, training, care,
                    scores, anxiety support, and diary.
                </p>

                <div
                    style="
                        margin-top:20px;
                        margin-bottom:20px;
                    "
                >

                    <p class="tutorial-note">
                        <strong>Note:</strong> Tutorial is in reference to
                        the main Handler Edition App,
                        <strong>not</strong> the version you've accessed
                        through ESSAzLife World. Watching can help you
                        understand the main layout, but not all features
                        are available in this version.
                    </p>

                   <a
    href="https://youtu.be/PUG8GpxUSaA?si=gkw0YlLQRovXZSNS"
    target="_blank"
    rel="noopener noreferrer"
    class="handler-action-button"
    style="
        display:inline-block;
        text-decoration:none;
    "
>
    ▶️ Watch Tutorial
</a>

                </div>

                <button
                    class="handler-action-button primary"
                    onclick="
                        document.getElementById(
                            'help-popup'
                        ).remove()
                    "
                >
                    Close
                </button>

            </div>

        </div>
    `;

    document.body.appendChild(
        popup
    );
}


/* =========================================================
   APP TABS
========================================================= */

function makeAppTabs(
    active
) {

    const user =
        getCurrentUser();


    const themeColor =
        (
            user &&
            typeof user.themeColor === "string" &&
            /^#[0-9a-f]{6}$/i.test(
                user.themeColor
            )
        )
            ? user.themeColor
            : "#4fb5ae";


    const tabs = [

        {
            name:
                "Home",

            icon:
                "🏠",

            action:
                "renderHome()"
        },

        {
            name:
                "Training",

            icon:
                "⭐",

            action:
                "renderTrainingTab()"
        },

        {
            name:
                "Scores",

            icon:
                "📊",

            action:
                "renderScoresTab()"
        },

        {
            name:
                "Anxiety Support",

            icon:
                "💚",

            action:
                "renderAnxietySupport()"
        },

        {
            name:
                "Diary",

            icon:
                "📖",

            action:
                "renderDiary()"
        }

    ];


    return `

        <div
    class="app-tabs"
    style="
        display:flex;
        gap:8px;
        flex-wrap:wrap;
        margin-bottom:25px;
    "
>
            ${tabs
                .map(
                    function(tab) {

                        const isActive =
                            tab.name ===
                            active;


                        return `

                            <button
    class="app-tab-button"

    onclick="
        ${tab.action}
    "

    style="
                                    padding:10px 14px;
                                    border-radius:12px;
                                    cursor:pointer;
                                    font-weight:bold;

                                    border:
                                        ${
                                            isActive
                                                ? "1px solid " + themeColor
                                                : "1px solid #dbe5e7"
                                        };

                                    background:
                                        ${
                                            isActive
                                                ? themeColor
                                                : "white"
                                        };

                                    color:
                                        ${
                                            isActive
                                                ? "white"
                                                : "#26343b"
                                        };
                                "
                            >

                                ${tab.icon}

                                ${escapeHTML(
                                    tab.name
                                )}

                            </button>

                        `;

                    }
                )
                .join("")}

        </div>

    `;
}


/* =========================================================
   FIND ESSA
========================================================= */

function getEssaById(
    essaId
) {

    return (
        getSavedEssas().find(
            function(essa) {

                return (
                    String(
                        essa.id
                    ) ===
                    String(
                        essaId
                    )
                );
            }
        ) ||
        null
    );
}
/* =========================================================
   HOME
========================================================= */

function renderHome(
    sortBy = "alphabetical"
) {

    applyUserTheme();


    const user =
        getCurrentUser();


    if (!user) {

        renderAuthHome();

        return;
    }


    showHeaderButtons(
        true
    );


    let essas =
        getSavedEssas()
            .slice();


    /* -------------------------
       SORT: ALPHABETICAL
    ------------------------- */

    if (
        sortBy ===
        "alphabetical"
    ) {

        essas.sort(
            function(a, b) {

                return String(
                    a.name || ""
                ).localeCompare(
                    String(
                        b.name || ""
                    )
                );
            }
        );
    }


    /* -------------------------
       SORT: NEWEST ADOPTION
    ------------------------- */

    if (
        sortBy ===
        "adoptionNewest"
    ) {

        essas.sort(
            function(a, b) {

                return String(
                    b.adoptionDate || ""
                ).localeCompare(
                    String(
                        a.adoptionDate || ""
                    )
                );
            }
        );
    }


    /* -------------------------
       SORT: OLDEST ADOPTION
    ------------------------- */

    if (
        sortBy ===
        "adoptionOldest"
    ) {

        essas.sort(
            function(a, b) {

                return String(
                    a.adoptionDate || ""
                ).localeCompare(
                    String(
                        b.adoptionDate || ""
                    )
                );
            }
        );
    }


    /* -------------------------
       SORT: TRAINING EXPERIENCE
    ------------------------- */

    if (
        sortBy ===
        "training"
    ) {

        const scores =
            getSavedScores();


        essas.sort(
            function(a, b) {

                const aCount =
                    scores.filter(
                        function(score) {

                            return (
                                String(
                                    score.essaId
                                ) ===
                                String(
                                    a.id
                                )
                            );
                        }
                    ).length;


                const bCount =
                    scores.filter(
                        function(score) {

                            return (
                                String(
                                    score.essaId
                                ) ===
                                String(
                                    b.id
                                )
                            );
                        }
                    ).length;


                return (
                    bCount -
                    aCount
                );
            }
        );
    }


    let cards =
        "";


    essas.forEach(
        function(essa) {

            const visual =
                essa.photo

                    ? `

                       <img
    src="${essa.photo}"
    alt="${escapeHTML(
        essa.name
    )}"

    style="
        width:100%;
        height:100%;
        object-fit:cover;
        object-position:
            ${essa.photoPositionX ?? 50}%
            ${essa.photoPositionY ?? 50}%;
    "
>

                    `

                    : `

                        <div
                            style="
                                width:100%;
                                height:100%;

                                display:flex;
                                align-items:center;
                                justify-content:center;

                                font-size:80px;

                                background:#f6fbfa;
                            "
                        >

                            ${essa.icon || "🐾"}

                        </div>

                    `;


            cards += `

                <button
                    onclick="
                        showEssaProfile('${essa.id}')
                    "

                    style="
                        padding:0;

                        overflow:hidden;

                        border:1px solid #dbe5e7;

                        border-radius:20px;

                        background:white;

                        cursor:pointer;

                        text-align:left;

                        box-shadow:
                            0 4px 14px
                            rgba(0,0,0,.05);
                    "
                >


                    <div
                        style="
                            width:100%;

                            aspect-ratio:1/1;

                            overflow:hidden;
                        "
                    >

                        ${visual}

                    </div>


                    <div
                        style="
                            padding:16px;
                        "
                    >


                        <h2
                            style="
                                margin:0 0 6px 0;

                                color:#26343b;
                            "
                        >

                            ${escapeHTML(
                                essa.name
                            )}

                        </h2>


                        <p
                            style="
                                margin:0;

                                color:#68777b;
                            "
                        >

                            ${escapeHTML(
                                essa.species ||
                                ""
                            )}

                        </p>


                    </div>


                </button>

            `;

        }
    );


    if (!cards) {

        cards = `

            <div
                style="
                    grid-column:1/-1;

                    padding:35px;

                    background:white;

                    border:
                        1px dashed
                        #b9d6d3;

                    border-radius:20px;
                "
            >

                <h2>
                    Your ESSA family is waiting! 🐾
                </h2>


                <p>
                    Add your first ESSA to get started.
                </p>

            </div>

        `;
    }


    const displayName =
        user.nickname ||
        user.username ||
        "Friend";


    document.querySelector(
        "main"
    ).innerHTML = `

        ${makeAppTabs(
            "Home"
        )}


        <div
            style="
                max-width:1400px;

                margin:0 auto;
            "
        >


            <h1>

                Welcome Back,
                ${escapeHTML(
                    displayName
                )}!

            </h1>


            <button
                class="add-essa-button"

                onclick="
                    showEssaForm()
                "
            >

                + Add an ESSA

            </button>


            <div
                style="
                    max-width:300px;

                    margin:25px auto;
                "
            >


                <label
                    for="home-sort"

                    style="
                        display:block;

                        margin-bottom:7px;

                        font-weight:bold;
                    "
                >

                    Sort ESSAs

                </label>


                <select
                    id="home-sort"

                    onchange="
                        renderHome(
                            this.value
                        )
                    "

                    style="
                        width:100%;

                        padding:10px;

                        border:
                            1px solid
                            #cbd9dc;

                        border-radius:10px;
                    "
                >


                    <option
                        value="alphabetical"
                    >
                        Alphabetical
                    </option>


                    <option
                        value="adoptionNewest"
                    >
                        Newest Adoption
                    </option>


                    <option
                        value="adoptionOldest"
                    >
                        Oldest Adoption
                    </option>


                    <option
                        value="training"
                    >
                        Most Training Experience
                    </option>


                </select>


            </div>


            <div
                style="
                    display:grid;

                    grid-template-columns:
                        repeat(
                            4,
                            minmax(
                                0,
                                1fr
                            )
                        );

                    gap:22px;

                    margin-top:30px;
                "
            >

                ${cards}

            </div>


        </div>

    `;


    const sortSelect =
        document.getElementById(
            "home-sort"
        );


    if (sortSelect) {

        sortSelect.value =
            sortBy;
    }
}


function renderProfile() {

    applyUserTheme();

    const user =
        getCurrentUser();

    const worldAccount =
        getWorldAccount();

    if (!user) {
        renderAuthHome();
        return;
    }

    document.querySelector(
        "main"
    ).innerHTML = `

        ${makeAppTabs("")}

        <div class="essa-form">

            <h1>
                👤 Handler Profile
            </h1>

            ${user.handlerCertified ? `

                <div class="profile-handler-certification">

                    <h2>
                        🏆 Handler Certification
                    </h2>

                    <p>
                        You are an ESSAzLife Certified Handler!
                    </p>

                    <div class="profile-handler-award-buttons">

                        <button
                            class="handler-action-button primary"
                            onclick="openHandlerAward(
                                'Handler.Certificate.png',
                                'Handler Certificate'
                            )"
                        >
                            🏆 View & Download Certificate
                        </button>

                        <button
                            class="handler-action-button primary"
                            onclick="openHandlerAward(
                                'Handler.ID.Card.png',
                                'Handler ID Badge'
                            )"
                        >
                            🪪 View & Download Badge
                        </button>

                    </div>

                    <button
                        class="profile-handler-edit-button"
                        onclick="openHandlerAwardEditor()"
                    >
                        ✏️ Edit Certificate & Badge Information
                    </button>

                </div>

            ` : ""}

            <label>
                Nickname
            </label>

            <input
                type="text"
                value="${escapeHTML(
                    worldAccount?.nickname ||
                    user.nickname ||
                    ""
                )}"
                readonly
            >

            <p>
                Managed through ESSAzLife World.
            </p>


            <label>
                Username
            </label>

            <input
                type="text"
                value="${escapeHTML(
                    worldAccount?.username ||
                    user.username ||
                    ""
                )}"
                readonly
            >

            <p>
                Managed through ESSAzLife World.
            </p>


            <label>
                Gender Identity
            </label>

            <input
                id="profile-gender"
                type="text"
                value="${escapeHTML(
                    user.genderIdentity ||
                    ""
                )}"
            >


            <label>
                Pronouns
            </label>

            <input
                id="profile-pronouns"
                type="text"
                value="${escapeHTML(
                    user.pronouns ||
                    ""
                )}"
                placeholder="Example: she/her, he/him, they/them"
            >


            <label>
                Age Group
            </label>

            <select id="profile-age-group">

                <option value="">
                    Prefer not to say
                </option>

                <option value="3-7">
                    Ages 3–7
                </option>

                <option value="8-13">
                    Ages 8–13
                </option>

                <option value="14+">
                    Ages 14+
                </option>

            </select>


            <label>
                🎨 Handler Background Color
            </label>

            <input
                id="profile-theme"
                type="color"
                value="${user.themeColor || "#ffffff"}"
                style="height:50px;"
            >


            <div
                style="
                    display:flex;
                    gap:10px;
                    flex-wrap:wrap;
                    margin-top:20px;
                "
            >

                <button
                    onclick="renderHome()"
                >
                    Cancel
                </button>

                <button
                    onclick="saveProfile()"
                >
                    Save Profile
                </button>

            </div>


            <hr
                style="
                    margin:30px 0;
                    border:none;
                    border-top:1px solid #dbe5e7;
                "
            >


            <div
                style="
                    padding:22px;
                    background:white;
                    border:1px solid #dbe5e7;
                    border-radius:18px;
                    margin-bottom:25px;
                "
            >

                <h2
                    style="
                        margin-top:0;
                        color:var(
                            --user-theme-color,
                            #4fb5ae
                        );
                    "
                >
                    💾 Backup & Restore
                </h2>

                <p
                    style="
                        color:#68777b;
                        font-size:13px;
                        line-height:1.5;
                    "
                >
                    Download a backup of your ESSAzLife
                    Handler Edition data, or restore your
                    data from a previous backup.
                </p>

                <div
                    style="
                        display:flex;
                        gap:10px;
                        flex-wrap:wrap;
                        margin-top:15px;
                    "
                >

                    <button
                        type="button"
                        class="handler-action-button primary"
                        onclick="backupHandlerData()"
                    >
                        ⬇️ Download Backup
                    </button>

                    <button
                        type="button"
                        class="handler-action-button"
                        onclick="
                            document.getElementById(
                                'handler-backup-file'
                            ).click()
                        "
                    >
                        ⬆️ Restore Backup
                    </button>

                    <input
                        id="handler-backup-file"
                        type="file"
                        accept=".json,application/json"
                        style="display:none;"
                        onchange="
                            restoreHandlerData(
                                this.files[0]
                            );
                            this.value = '';
                        "
                    >

                </div>

            </div>

        </div>
    `;


    const ageGroup =
        document.getElementById(
            "profile-age-group"
        );

    if (ageGroup) {
        ageGroup.value =
            user.ageGroup ||
            "";
    }
}

/* =========================================================
   DOWNLOAD HANDLER BACKUP
========================================================= */

function backupHandlerData() {

    const backup = {
        app: "ESSAzLife Handler Edition",
        version: 1,
        createdAt: new Date().toISOString(),
        localStorage: {}
    };


    for (
        let i = 0;
        i < localStorage.length;
        i++
    ) {

        const key =
            localStorage.key(i);


        if (key) {

            backup.localStorage[key] =
                localStorage.getItem(
                    key
                );
        }
    }


    const backupText =
        JSON.stringify(
            backup,
            null,
            2
        );


    const blob =
        new Blob(
            [backupText],
            {
                type:
                    "application/json"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    const date =
        new Date()
            .toISOString()
            .slice(
                0,
                10
            );


    link.href =
        url;


    link.download =
        "ESSAzLife-Handler-Backup-" +
        date +
        ".json";


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();


    URL.revokeObjectURL(
        url
    );
}

/* =========================================================
   READ HANDLER BACKUP
========================================================= */

function restoreHandlerData(
    file
) {

    if (!file) {
        return;
    }


    const reader =
        new FileReader();


    reader.onload =
        function(event) {

            try {

                const backup =
                    JSON.parse(
                        event.target.result
                    );


                if (
                    !backup ||
                    backup.app !==
                        "ESSAzLife Handler Edition" ||
                    !backup.localStorage
                ) {

                    showInvalidBackupPopup();

                    return;
                }


                showRestoreBackupPopup(
                    backup
                );

            } catch (error) {

                showInvalidBackupPopup();
            }
        };


    reader.readAsText(
        file
    );
}

/* =========================================================
   RESTORE BACKUP CONFIRMATION
========================================================= */

function showRestoreBackupPopup(
    backup
) {

    const oldPopup =
        document.getElementById(
            "restore-backup-popup"
        );


    if (oldPopup) {
        oldPopup.remove();
    }


    const popup =
        document.createElement(
            "div"
        );


    popup.id =
        "restore-backup-popup";


    popup.innerHTML = `

        <div class="training-delete-overlay">

            <div class="training-delete-box">

                <h2>
                    💾 Restore Backup?
                </h2>


                <p>
                    Restoring this backup will replace
                    the Handler Edition data currently
                    stored in this browser.
                    <br><br>
                    Make sure you have downloaded a
                    backup of your current data first.
                </p>


                <div class="training-delete-buttons">

                    <button
                        class="handler-action-button"
                        onclick="
                            document.getElementById(
                                'restore-backup-popup'
                            ).remove()
                        "
                    >
                        Cancel
                    </button>


                    <button
                        class="handler-action-button primary"
                        onclick="
                            confirmHandlerRestore()
                        "
                    >
                        Restore
                    </button>

                </div>

            </div>

        </div>
    `;


    document.body.appendChild(
        popup
    );


    window.pendingHandlerBackup =
        backup;
}

/* =========================================================
   CONFIRM HANDLER RESTORE
========================================================= */

function confirmHandlerRestore() {

    const backup =
        window.pendingHandlerBackup;


    if (
        !backup ||
        !backup.localStorage
    ) {
        return;
    }


    localStorage.clear();


    Object.keys(
        backup.localStorage
    ).forEach(
        function(key) {

            localStorage.setItem(
                key,
                backup.localStorage[key]
            );
        }
    );


    window.pendingHandlerBackup =
        null;


    const popup =
        document.getElementById(
            "restore-backup-popup"
        );


    if (popup) {
        popup.remove();
    }


    window.location.reload();
}

/* =========================================================
   SAVE RECOVERY ANSWERS
========================================================= */

function saveRecoveryAnswers() {

    const currentUser =
        getCurrentUser();


    if (!currentUser) {

        alert(
            "You must be logged in."
        );

        return;
    }


    const birthMonth =
        document
            .getElementById(
                "profile-recovery-month"
            )
            ?.value;


    const birthDay =
        document
            .getElementById(
                "profile-recovery-day"
            )
            ?.value;


    const middleName =
        document
            .getElementById(
                "profile-recovery-middle"
            )
            ?.value
            .trim();


    const lastName =
        document
            .getElementById(
                "profile-recovery-last"
            )
            ?.value
            .trim();


    if (
        !birthMonth ||
        !birthDay ||
        !middleName ||
        !lastName
    ) {

        alert(
            "Please fill out all of your account recovery answers."
        );

        return;
    }


    const accounts =
        getAccounts();


    const accountIndex =
        accounts.findIndex(
            function(account) {

                return (
                    String(
                        account.id
                    ) ===
                    String(
                        currentUser.id
                    )
                );
            }
        );


    if (
        accountIndex ===
        -1
    ) {

        alert(
            "Your account could not be found."
        );

        return;
    }


    accounts[
        accountIndex
    ].recoveryBirthMonth =
        Number(
            birthMonth
        );


    accounts[
        accountIndex
    ].recoveryBirthDay =
        Number(
            birthDay
        );


    accounts[
        accountIndex
    ].recoveryMiddleName =
        middleName;


    accounts[
        accountIndex
    ].recoveryLastName =
        lastName;


    saveAccounts(
        accounts
    );


    alert(
        "Your account recovery answers have been saved!"
    );


    renderProfile();
}

/* =========================================================
   SAVE PROFILE
========================================================= */

function saveProfile() {

    const current =
        getCurrentUser();

    if (!current) {
        return;
    }

    const accounts =
        getAccounts();

    const index =
        accounts.findIndex(
            function(account) {

                return (
                    String(account.id) ===
                    String(current.id)
                );
            }
        );

    if (index === -1) {
        return;
    }


    const genderInput =
        document.getElementById(
            "profile-gender"
        );

    const pronounsInput =
        document.getElementById(
            "profile-pronouns"
        );

    const ageGroupInput =
        document.getElementById(
            "profile-age-group"
        );

    const themeInput =
        document.getElementById(
            "profile-theme"
        );


    if (genderInput) {

        accounts[index].genderIdentity =
            genderInput.value.trim();
    }


    if (pronounsInput) {

        accounts[index].pronouns =
            pronounsInput.value.trim();
    }


    if (ageGroupInput) {

        accounts[index].ageGroup =
            ageGroupInput.value;
    }


    if (themeInput) {

        accounts[index].themeColor =
            themeInput.value;
    }


    saveAccounts(
        accounts
    );

    renderHome();
}


/* =========================================================
   ADD / EDIT ESSA
========================================================= */

function showEssaForm(
    essaId = null
) {

    resetPageTheme();


    const existing =
        essaId !== null

            ? getEssaById(
                essaId
            )

            : null;


    const editing =
        Boolean(
            existing
        );


    const speciesOptions =
        standardSpecies
            .map(
                function(species) {

                    return `

                        <option
                            value="${escapeHTML(
                                species
                            )}"
                        >

                            ${escapeHTML(
                                species
                            )}

                        </option>

                    `;

                }
            )
            .join("");


    document.querySelector(
        "main"
    ).innerHTML = `

        ${makeAppTabs(
            "Home"
        )}


        <div
            class="essa-form"
        >


            <h1>

                ${
                    editing

                        ? "Edit ESSA"

                        : "Add an ESSA"
                }

            </h1>


            ${
                existing &&
                existing.photo

                    ? `

                        <div
                            style="
                                text-align:center;

                                margin-bottom:20px;
                            "
                        >

                            <img
    src="${existing.photo}"

    alt="${escapeHTML(
        existing.name
    )}"

    style="
        width:150px;

        height:150px;

        object-fit:cover;

        object-position:
            ${existing.photoPositionX ?? 50}%
            ${existing.photoPositionY ?? 50}%;

        border-radius:20px;

        border:
            1px solid
            #dbe5e7;
    "
>

                        </div>

                    `

                    : ""
            }


                       <label>
                Photo
            </label>


            <input
                id="essa-photo"
                type="file"
                accept="image/*"
                style="display:none;"
                onchange="previewEssaPhoto()"
            >


            <button
                type="button"
                class="handler-action-button"
                onclick="
                    document.getElementById(
                        'essa-photo'
                    ).click()
                "
            >
                📷 Choose Photo
            </button>


            <div
                id="essa-photo-selection"
                style="
                    display:none;
                    margin-top:15px;
                    text-align:center;
                "
            >

                <p
                    style="
                        margin:0 0 10px;
                        font-weight:bold;
                        color:#26343b;
                    "
                >
                    ✓ Photo Selected
                </p>


                <img
                    id="essa-photo-preview"
                    alt="Selected ESSA photo"
                    style="
                        width:120px;
                        height:120px;
                        object-fit:cover;
                        border-radius:16px;
                        border:2px solid
                            var(--user-theme-color, #4fb5ae);
                    "
                >


                <p
                    id="essa-photo-file-name"
                    style="
                        margin:8px 0 0;
                        color:#7c898d;
                        font-size:13px;
                    "
                ></p>

            </div>


            <p
                style="
                    margin-top:10px;
                    color:#7c898d;
                    font-size:13px;
                "
            >
                Optional. If you don't add a photo,
                ESSAzLife will use an icon based on
                your ESSA's species.
            </p>

            </p>


            <label>
                ESSA Name
            </label>


            <input
                id="essa-name"

                type="text"

                value="${escapeHTML(
                    existing?.name ||
                    ""
                )}"
            >


            <label>
                Species
            </label>


            <select
                id="essa-species"

                onchange="
                    updateSpeciesFields()
                "
            >


                <option value="">
                    Select species
                </option>


                ${speciesOptions}


                <option value="Custom">
                    Custom
                </option>


            </select>


            <div
                id="custom-species-area"

                style="
                    display:none;
                "
            >


                <label>
                    Custom Species
                </label>


                <input
                    id="essa-custom-species"

                    type="text"
                >


            </div>


            <div
                id="breed-area"

                style="
                    display:none;
                "
            >


                <label>
                    Breed / Type
                </label>


                <select
                    id="essa-breed"

                    onchange="
                        updateCustomBreedField()
                    "
                ></select>


            </div>


            <div
                id="custom-breed-area"

                style="
                    display:none;
                "
            >


                <label>
                    Custom Breed / Type
                </label>


                <input
                    id="essa-custom-breed"

                    type="text"
                >


            </div>


            <label>
                Plush Color
            </label>


            <input
                id="essa-plush-color"

                type="text"

                placeholder="Example: Brown and white"

                value="${escapeHTML(
                    existing?.plushColor ||
                    ""
                )}"
            >


            <label>
                Adoption Date
            </label>


            <input
                id="essa-adoption-date"

                type="date"

                value="${escapeHTML(
                    existing?.adoptionDate ||
                    ""
                )}"
            >


            <label>
                Favorite Color
            </label>


            ${makeColorPicker(
                "favorite-color",
                existing?.favoriteColor ||
                "#4fb5ae"
            )}


            <label>
                Collar
            </label>


            <select
                id="collar-choice"

                onchange="
                    updateCollarChoice()
                "
            >


                <option value="color">
                    Choose Collar Color
                </option>


                <option value="none">
                    No Collar
                </option>


            </select>


            <div
                id="collar-color-area"
            >


                <label>
                    Collar Color
                </label>


                ${makeColorPicker(
                    "collar-color",
                    (
                        existing?.collarColor &&
                        existing.collarColor !==
                            "none"

                            ? existing.collarColor

                            : "#4fb5ae"
                    )
                )}


            </div>


            <label>
                Favorite Food
            </label>


            <input
                id="essa-favorite-food"

                type="text"

                value="${escapeHTML(
                    existing?.favoriteFood ||
                    ""
                )}"
            >


            <label>
                Favorite Weather
            </label>


            <input
                id="essa-favorite-weather"

                type="text"

                value="${escapeHTML(
                    existing?.favoriteWeather ||
                    ""
                )}"
            >


            <label>
                Favorite Toy
            </label>


            <input
                id="essa-favorite-toy"

                type="text"

                value="${escapeHTML(
                    existing?.favoriteToy ||
                    ""
                )}"
            >


            <label>
                Likes
            </label>


            <textarea
                id="essa-likes"
            >${escapeHTML(
                existing?.likes ||
                ""
            )}</textarea>


            <label>
                Dislikes
            </label>


            <textarea
                id="essa-dislikes"
            >${escapeHTML(
                existing?.dislikes ||
                ""
            )}</textarea>


            <h2>
                🩺 Medical Notes
            </h2>


            <label>
                Allergies
            </label>


            <textarea
                id="essa-allergies"
            >${escapeHTML(
                existing?.allergies ||
                ""
            )}</textarea>


            <label>
                Medications
            </label>


            <textarea
                id="essa-medications"
            >${escapeHTML(
                existing?.medications ||
                ""
            )}</textarea>


            <label>
                Conditions
            </label>


            <textarea
                id="essa-conditions"
            >${escapeHTML(
                existing?.conditions ||
                ""
            )}</textarea>


            <div
                style="
                    display:flex;

                    gap:10px;

                    flex-wrap:wrap;

                    margin-top:25px;
                "
            >


                <button
                    onclick="
                        renderHome()
                    "
                >

                    Cancel

                </button>


                <button
                    onclick="
                        saveEssa(
                            ${
                                editing

                                    ? `'${existing.id}'`

                                    : "null"
                            }
                        )
                    "
                >

                    ${
                        editing

                            ? "Save Changes"

                            : "Add ESSA"
                    }

                </button>


            </div>


        </div>

    `;


    /* =====================================================
       SET EXISTING SPECIES / BREED
    ===================================================== */

    if (existing) {

        const speciesSelect =
            document.getElementById(
                "essa-species"
            );


        if (
            standardSpecies.includes(
                existing.species
            )
        ) {

            speciesSelect.value =
                existing.species;

        } else {

            speciesSelect.value =
                "Custom";


            document.getElementById(
                "essa-custom-species"
            ).value =
                existing.species ||
                "";
        }


        updateSpeciesFields();


        const breedSelect =
            document.getElementById(
                "essa-breed"
            );


        if (
            existing.breed &&
            breedSelect
        ) {

            const availableBreeds =
                Array.from(
                    breedSelect.options
                )
                    .map(
                        function(option) {

                            return option.value;
                        }
                    );


            if (
                availableBreeds.includes(
                    existing.breed
                )
            ) {

                breedSelect.value =
                    existing.breed;

            } else {

                breedSelect.value =
                    "Custom";


                updateCustomBreedField();


                const customBreed =
                    document.getElementById(
                        "essa-custom-breed"
                    );


                if (customBreed) {

                    customBreed.value =
                        existing.breed;
                }
            }
        }


        const collarChoice =
            document.getElementById(
                "collar-choice"
            );


        if (
            existing.collarColor ===
            "none"
        ) {

            collarChoice.value =
                "none";

        } else {

            collarChoice.value =
                "color";
        }


        updateCollarChoice();

    } else {

        updateSpeciesFields();

        updateCollarChoice();
    }
}

function previewEssaPhoto() {

    const photoInput =
        document.getElementById(
            "essa-photo"
        );

    const selectionArea =
        document.getElementById(
            "essa-photo-selection"
        );

    const preview =
        document.getElementById(
            "essa-photo-preview"
        );

    const fileName =
        document.getElementById(
            "essa-photo-file-name"
        );


    if (
        !photoInput ||
        !photoInput.files ||
        !photoInput.files[0]
    ) {
        return;
    }


    const file =
        photoInput.files[0];


    readImageFile(
        file
    )
        .then(
            function(compressedPhoto) {

                preview.src =
                    compressedPhoto;

                fileName.textContent =
                    file.name;

                selectionArea.style.display =
                    "block";
            }
        )

        .catch(
            function(error) {

                console.error(
                    error
                );

                alert(
                    "ESSAzLife could not read that image."
                );
            }
        );
}

/* =========================================================
   COLOR PICKER
========================================================= */

function makeColorPicker(
    id,
    startingColor = "#4fb5ae"
) {

    return `

        <input
            id="${id}"

            type="color"

            value="${startingColor}"

            style="
                width:100%;

                height:48px;

                cursor:pointer;
            "
        >

    `;
}


/* =========================================================
   UPDATE SPECIES FIELDS
========================================================= */

function updateSpeciesFields() {

    const speciesSelect =
        document.getElementById(
            "essa-species"
        );


    const customArea =
        document.getElementById(
            "custom-species-area"
        );


    const breedArea =
        document.getElementById(
            "breed-area"
        );


    const breedSelect =
        document.getElementById(
            "essa-breed"
        );


    if (
        !speciesSelect ||
        !customArea ||
        !breedArea ||
        !breedSelect
    ) {

        return;
    }


    const species =
        speciesSelect.value;


    customArea.style.display =
        species ===
        "Custom"

            ? "block"

            : "none";


    if (
        species &&
        species !==
            "Custom" &&
        breedOptions[
            species
        ]
    ) {

        breedArea.style.display =
            "block";


        breedSelect.innerHTML = `

            <option value="">
                Select breed / type
            </option>


            ${
                breedOptions[
                    species
                ]
                    .map(
                        function(breed) {

                            return `

                                <option
                                    value="${escapeHTML(
                                        breed
                                    )}"
                                >

                                    ${escapeHTML(
                                        breed
                                    )}

                                </option>

                            `;

                        }
                    )
                    .join("")
            }


            <option value="Custom">
                Custom
            </option>

        `;

    } else {

        breedArea.style.display =
            "none";


        breedSelect.innerHTML =
            "";
    }


    updateCustomBreedField();
}


/* =========================================================
   CUSTOM BREED FIELD
========================================================= */

function updateCustomBreedField() {

    const select =
        document.getElementById(
            "essa-breed"
        );


    const area =
        document.getElementById(
            "custom-breed-area"
        );


    if (
        !select ||
        !area
    ) {

        return;
    }


    area.style.display =
        select.value ===
        "Custom"

            ? "block"

            : "none";
}


/* =========================================================
   COLLAR FIELD
========================================================= */

function updateCollarChoice() {

    const choice =
        document.getElementById(
            "collar-choice"
        );


    const area =
        document.getElementById(
            "collar-color-area"
        );


    if (
        !choice ||
        !area
    ) {

        return;
    }


    area.style.display =
        choice.value ===
        "none"

            ? "none"

            : "block";
}


/* =========================================================
   READ + COMPRESS IMAGE FILE
========================================================= */

function readImageFile(
    file
) {

    return new Promise(
        function(
            resolve,
            reject
        ) {

            if (!file) {

                resolve(
                    null
                );

                return;
            }


            const reader =
                new FileReader();


            reader.onload =
                function(event) {

                    const image =
                        new Image();


                    image.onload =
                        function() {

                            const maxSize =
                                1200;

                            let width =
                                image.width;

                            let height =
                                image.height;


                            if (
                                width > maxSize ||
                                height > maxSize
                            ) {

                                const scale =
                                    Math.min(
                                        maxSize / width,
                                        maxSize / height
                                    );

                                width =
                                    Math.round(
                                        width * scale
                                    );

                                height =
                                    Math.round(
                                        height * scale
                                    );
                            }


                            const canvas =
                                document.createElement(
                                    "canvas"
                                );

                            canvas.width =
                                width;

                            canvas.height =
                                height;


                            const context =
                                canvas.getContext(
                                    "2d"
                                );


                            context.drawImage(
                                image,
                                0,
                                0,
                                width,
                                height
                            );


                            const compressedImage =
                                canvas.toDataURL(
                                    "image/jpeg",
                                    0.78
                                );


                            resolve(
                                compressedImage
                            );
                        };


                    image.onerror =
                        function(error) {

                            reject(
                                error
                            );
                        };


                    image.src =
                        event.target.result;
                };


            reader.onerror =
                function(error) {

                    reject(
                        error
                    );
                };


            reader.readAsDataURL(
                file
            );

        }
    );
}
async function saveEssa(
    editEssaId = null
) {

    const name =
        document
            .getElementById(
                "essa-name"
            )
            .value
            .trim();


    const speciesChoice =
        document
            .getElementById(
                "essa-species"
            )
            .value;


    if (
        !name ||
        !speciesChoice
    ) {

        alert(
            "Please enter an ESSA name and species."
        );

        return;
    }


    const species =
        speciesChoice ===
        "Custom"

            ? document
                .getElementById(
                    "essa-custom-species"
                )
                .value
                .trim()

            : speciesChoice;


    if (!species) {

        alert(
            "Please enter the custom species."
        );

        return;
    }


    let breed =
        "";


    const breedSelect =
        document.getElementById(
            "essa-breed"
        );


    if (
        speciesChoice !==
            "Custom" &&
        breedSelect
    ) {

        breed =
            breedSelect.value;


        if (
            breed ===
            "Custom"
        ) {

            breed =
                document
                    .getElementById(
                        "essa-custom-breed"
                    )
                    .value
                    .trim();
        }
    }


    const fileInput =
        document.getElementById(
            "essa-photo"
        );


    const file =
        fileInput?.files?.[0] ||
        null;


    let photo =
        null;


    try {

        photo =
            await readImageFile(
                file
            );

    } catch (error) {

        console.error(
            error
        );


        alert(
            "ESSAzLife could not read that image."
        );

        return;
    }


    const collarChoice =
        document.getElementById(
            "collar-choice"
        ).value;


    const collarColor =
        collarChoice ===
        "none"

            ? "none"

            : document
                .getElementById(
                    "collar-color"
                )
                .value;


    const essas =
        getSavedEssas();


    if (
        editEssaId !==
        null
    ) {

        const index =
            essas.findIndex(
                function(essa) {

                    return (
                        String(
                            essa.id
                        ) ===
                        String(
                            editEssaId
                        )
                    );
                }
            );


        if (
            index ===
            -1
        ) {

            alert(
                "That ESSA could not be found."
            );

            return;
        }


        const existing =
            essas[
                index
            ];


        essas[
            index
        ] = {

            ...existing,

            name:
                name,

            species:
                species,

            breed:
                breed,

            plushColor:
                document
                    .getElementById(
                        "essa-plush-color"
                    )
                    .value
                    .trim(),

            adoptionDate:
                document
                    .getElementById(
                        "essa-adoption-date"
                    )
                    .value,

            favoriteColor:
                document
                    .getElementById(
                        "favorite-color"
                    )
                    .value,

            collarColor:
                collarColor,

            favoriteFood:
                document
                    .getElementById(
                        "essa-favorite-food"
                    )
                    .value
                    .trim(),

            favoriteWeather:
                document
                    .getElementById(
                        "essa-favorite-weather"
                    )
                    .value
                    .trim(),

            favoriteToy:
                document
                    .getElementById(
                        "essa-favorite-toy"
                    )
                    .value
                    .trim(),

            likes:
                document
                    .getElementById(
                        "essa-likes"
                    )
                    .value
                    .trim(),

            dislikes:
                document
                    .getElementById(
                        "essa-dislikes"
                    )
                    .value
                    .trim(),

            allergies:
                document
                    .getElementById(
                        "essa-allergies"
                    )
                    .value
                    .trim(),

            medications:
                document
                    .getElementById(
                        "essa-medications"
                    )
                    .value
                    .trim(),

            conditions:
                document
                    .getElementById(
                        "essa-conditions"
                    )
                    .value
                    .trim(),

            icon:
                speciesIcons[
                    speciesChoice
                ] ||
                speciesIcons.Custom,

            photo:
                photo ||
                existing.photo ||
                null,

            updatedAt:
                new Date()
                    .toISOString()

        };


    } else {

        essas.push(
            {

                id:
                    makeId(
                        "essa"
                    ),

                name:
                    name,

                species:
                    species,

                breed:
                    breed,

                plushColor:
                    document
                        .getElementById(
                            "essa-plush-color"
                        )
                        .value
                        .trim(),

                adoptionDate:
                    document
                        .getElementById(
                            "essa-adoption-date"
                        )
                        .value,

                favoriteColor:
                    document
                        .getElementById(
                            "favorite-color"
                        )
                        .value,

                collarColor:
                    collarColor,

                favoriteFood:
                    document
                        .getElementById(
                            "essa-favorite-food"
                        )
                        .value
                        .trim(),

                favoriteWeather:
                    document
                        .getElementById(
                            "essa-favorite-weather"
                        )
                        .value
                        .trim(),

                favoriteToy:
                    document
                        .getElementById(
                            "essa-favorite-toy"
                        )
                        .value
                        .trim(),

                likes:
                    document
                        .getElementById(
                            "essa-likes"
                        )
                        .value
                        .trim(),

                dislikes:
                    document
                        .getElementById(
                            "essa-dislikes"
                        )
                        .value
                        .trim(),

                allergies:
                    document
                        .getElementById(
                            "essa-allergies"
                        )
                        .value
                        .trim(),

                medications:
                    document
                        .getElementById(
                            "essa-medications"
                        )
                        .value
                        .trim(),

                conditions:
                    document
                        .getElementById(
                            "essa-conditions"
                        )
                        .value
                        .trim(),

                icon:
                    speciesIcons[
                        speciesChoice
                    ] ||
                    speciesIcons.Custom,

                photo:
                    photo,

                createdAt:
                    new Date()
                        .toISOString(),

                updatedAt:
                    new Date()
                        .toISOString()

            }
        );
    }


    try {

        saveEssas(
            essas
        );

    } catch (error) {

        console.error(
            error
        );


        alert(
            "ESSAzLife could not save this ESSA. The image may be too large for browser storage."
        );

        return;
    }


    renderHome();
}

function getAdoptionDuration(
    adoptionDate
) {

    if (!adoptionDate) {
        return "";
    }

    const adopted =
        new Date(
            adoptionDate + "T00:00:00"
        );

    const today =
        new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );


    const difference =
        today - adopted;

    const days =
        Math.floor(
            difference /
            (
                1000 *
                60 *
                60 *
                24
            )
        );


    if (days < 0) {
        return "Adoption day is coming soon 💚";
    }


    if (days === 0) {
        return "Adopted today 💚";
    }


    if (days === 1) {
        return "Adopted 1 day ago 💚";
    }


    if (days < 30) {
        return `Adopted ${days} days ago 💚`;
    }


    if (days < 365) {

        const months =
            Math.floor(
                days / 30
            );

        return (
            `Adopted ${months} ` +
            `${months === 1 ? "month" : "months"} ago 💚`
        );
    }


    const years =
        Math.floor(
            days / 365
        );

    return (
        `Adopted ${years} ` +
        `${years === 1 ? "year" : "years"} ago 💚`
    );
}

/* =========================================================
   ESSA PROFILE
========================================================= */

function showEssaProfile(
    essaId
) {

    const essa =
        getEssaById(
            essaId
        );


    if (!essa) {

        renderHome();

        return;
    }


    applyEssaProfileTint(
        essa.favoriteColor
    );


    const careEvents =
        getSavedCare()
            .filter(
                function(event) {

                    return (
                        String(
                            event.essaId
                        ) ===
                        String(
                            essa.id
                        )
                    );
                }
            )
            .sort(
                function(a, b) {

                    return (
                        new Date(
                            b.date
                        ) -
                        new Date(
                            a.date
                        )
                    );
                }
            );


    const recentCare =
        careEvents
            .slice(
                0,
                5
            );


    const visual =
    essa.photo

        ? `

            <img
                src="${essa.photo}"

                alt="${escapeHTML(
                    essa.name
                )}"

                style="
                    width:220px;
                    height:220px;
                    object-fit:cover;
                    object-position:
                        ${essa.photoPositionX ?? 50}%
                        ${essa.photoPositionY ?? 50}%;
                    border-radius:24px;
                    border:1px solid #dbe5e7;
                "
            >

            <button
                type="button"

                onclick="
                    openEssaPhotoAdjuster(
                        '${essa.id}'
                    )
                "

                style="
                    display:block;
                    margin:10px auto 0;
                    padding:9px 14px;
                    border:none;
                    border-radius:10px;
                    background:
                        var(--user-theme-color, #4fb5ae);
                    color:white;
                    font-weight:bold;
                    cursor:pointer;
                "
            >
                📸 Adjust Photo
            </button>

        `

        : `

            <div
                style="
                    width:220px;
                    height:220px;

                    display:flex;
                    align-items:center;
                    justify-content:center;

                    margin:auto;

                    border-radius:24px;

                    background:white;

                    border:
                        1px solid
                        #dbe5e7;

                    font-size:110px;
                "
            >

                ${essa.icon || "🐾"}

            </div>

        `;


    const careHTML =
        recentCare.length

            ? recentCare
                .map(
                    function(event) {

                        return `

                            <div
                                style="
                                    padding:12px;

                                    border-bottom:
                                        1px solid
                                        #e5ecee;
                                "
                            >

                                <strong>
                                    ${escapeHTML(
                                        event.type
                                    )}
                                </strong>

                                <br>

                                <span
                                    style="
                                        color:#68777b;
                                    "
                                >

                                    ${formatDateTime(
                                        event.date
                                    )}

                                </span>


                                ${
                                    event.notes

                                        ? `

                                            <div
                                                style="
                                                    margin-top:5px;
                                                "
                                            >

                                                ${escapeHTML(
                                                    event.notes
                                                )}

                                            </div>

                                        `

                                        : ""
                                }

                            </div>

                        `;
                    }
                )
                .join("")

            : `

                <p>
                    No care has been logged yet.
                </p>

            `;


    document.querySelector(
        "main"
    ).innerHTML = `

        ${makeAppTabs(
            "Home"
        )}


        <div
            style="
                max-width:1000px;
                margin:0 auto;
            "
        >


            <button
                class="handler-action-button"

                onclick="
                    renderHome()
                "

                style="
                    margin-bottom:20px;
                "
            >

                ← Back to ESSAs

            </button>


            <div
    class="essa-profile-grid"
    style="

                    grid-template-columns:
                        minmax(
                            250px,
                            .7fr
                        )
                        minmax(
                            0,
                            1.3fr
                        );

                    gap:25px;
                "
            >


                <div
                    style="
                        padding:25px;

                        background:
                            rgba(
                                255,
                                255,
                                255,
                                .92
                            );

                        border-radius:24px;

                        text-align:center;

                        border:
                            1px solid
                            #dbe5e7;
                    "
                >

                    ${visual}


                    <h1
                        style="
                            margin-bottom:5px;
                        "
                    >

                        ${escapeHTML(
                            essa.name
                        )}

                    </h1>


                    <p
                        style="
                            margin-top:0;

                            color:#68777b;
                        "
                    >

                        ${escapeHTML(
                            essa.species ||
                            ""
                        )}

                        ${
                            essa.breed

                                ? " • " +
                                escapeHTML(
                                    essa.breed
                                )

                                : ""
                        }

                    </p>
                    
                                        ${
                        essa.adoptionDate

                            ? `
                                <p
                                    style="
                                        margin:12px 0 18px;
                                        font-weight:bold;
                                        color:
                                            var(--user-theme-color, #4fb5ae);
                                    "
                                >
                                    ${getAdoptionDuration(
                                        essa.adoptionDate
                                    )}
                                </p>
                            `

                            : ""
                    }
                    
                    <div
    class="essa-certification-area"
    style="
        margin-bottom:18px;
    "
>
    ${
        essa.essaCertified

            ? `
                <div>
                    <h3
                        style="
                            margin:0 0 6px;
                            color:var(--user-theme-color, #4fb5ae);
                        "
                    >
                        🏆 ESSA Certified!
                    </h3>

                    <p
                        style="
                            margin:0;
                            color:#68777b;
                            font-weight:bold;
                        "
                    >
                        Certified ${essa.essaCertificationDate}
                    </p>

                    

                    <div
    style="
        display:flex;
        gap:8px;
        flex-wrap:wrap;
        justify-content:center;
        margin-top:12px;
    "
>
    <button
        class="handler-action-button primary"
        onclick="
            openEssaCertificate(
                '${essa.id}'
            )
        "
    >
        🏆 View Certificate
    </button>

    <button
        class="handler-action-button primary"
        onclick="
            openEssaIdCard(
                '${essa.id}'
            )
        "
    >
        🪪 View ID Card
    </button>
</div>
                </div>
            `

            : `
                <button
                    class="handler-action-button primary"
                    onclick="
                        startEssaCertification(
                            '${essa.id}'
                        )
                    "
                >
                    🏆 Start ESSA Certification
                </button>
            `
    }
</div>

                    <button
                         class="handler-action-button primary"

                        onclick="
                            showEssaForm(
                                '${essa.id}'
                            )
                        "
                    >

                        ✏️ Edit ESSA

                    </button>


                    <button
                        class="handler-action-button danger"

                        onclick="
                            deleteEssa(
                                '${essa.id}'
                            )
                        "
                    >

                        🗑️ Delete ESSA

                    </button>


                </div>


                <div
                    style="
                        display:flex;
                        flex-direction:column;
                        gap:20px;
                    "
                >


                    <div
                        style="
                            padding:22px;

                            background:
                                rgba(
                                    255,
                                    255,
                                    255,
                                    .92
                                );

                            border-radius:22px;

                            border:
                                1px solid
                                #dbe5e7;
                        "
                    >

                        <h2>
                            💚 About
                        </h2>


                        <p>

                            <strong>
                                Plush Color:
                            </strong>

                            ${escapeHTML(
                                essa.plushColor ||
                                "Not added"
                            )}

                        </p>


                        <p>

                            <strong>
                                Adoption Date:
                            </strong>

                            ${
                                essa.adoptionDate

                                    ? formatDate(
                                        essa.adoptionDate
                                    )

                                    : "Not added"
                            }

                        </p>


                        <p>

                            <strong>
                                Favorite Food:
                            </strong>

                            ${escapeHTML(
                                essa.favoriteFood ||
                                "Not added"
                            )}

                        </p>


                        <p>

                            <strong>
                                Favorite Weather:
                            </strong>

                            ${escapeHTML(
                                essa.favoriteWeather ||
                                "Not added"
                            )}

                        </p>


                        <p>

                            <strong>
                                Favorite Toy:
                            </strong>

                            ${escapeHTML(
                                essa.favoriteToy ||
                                "Not added"
                            )}

                        </p>


                        <p>

                            <strong>
                                Likes:
                            </strong>

                            ${escapeHTML(
                                essa.likes ||
                                "Not added"
                            )}

                        </p>


                        <p>

                            <strong>
                                Dislikes:
                            </strong>

                            ${escapeHTML(
                                essa.dislikes ||
                                "Not added"
                            )}

                        </p>


                    </div>


                    <div
                        style="
                            padding:22px;

                            background:
                                rgba(
                                    255,
                                    255,
                                    255,
                                    .92
                                );

                            border-radius:22px;

                            border:
                                1px solid
                                #dbe5e7;
                        "
                    >

                        <h2>
                            🩺 Medical Notes
                        </h2>


                        <p>

                            <strong>
                                Allergies:
                            </strong>

                            ${escapeHTML(
                                essa.allergies ||
                                "None listed"
                            )}

                        </p>


                        <p>

                            <strong>
                                Medications:
                            </strong>

                            ${escapeHTML(
                                essa.medications ||
                                "None listed"
                            )}

                        </p>


                        <p>

                            <strong>
                                Conditions:
                            </strong>

                            ${escapeHTML(
                                essa.conditions ||
                                "None listed"
                            )}

                        </p>


                    </div>


                    <div
                        style="
                            padding:22px;

                            background:
                                rgba(
                                    255,
                                    255,
                                    255,
                                    .92
                                );

                            border-radius:22px;

                            border:
                                1px solid
                                #dbe5e7;
                        "
                    >

                        <div
                            style="
                                display:flex;

                                align-items:center;

                                justify-content:
                                    space-between;

                                gap:10px;

                                flex-wrap:wrap;
                            "
                        >

                            <h2
                                style="
                                    margin:0;
                                "
                            >

                                🐾 Care

                            </h2>


                            <button
                            class="handler-action-button primary"

                                onclick="
                                    showCareLogForm(
                                        '${essa.id}'
                                    )
                                "
                            >

                                + Log Care

                            </button>


                        </div>


                        <div
                            style="
                                margin-top:15px;
                            "
                        >

                            ${careHTML}

                        </div>


                        <button
                        class="handler-action-button"

                            onclick="
                                showCareHistory(
                                    '${essa.id}'
                                )
                            "

                            style="
                                margin-top:15px;
                            "
                        >

                            View Full Care History

                        </button>


                    </div>


                </div>


            </div>


        </div>

    `;
}

function openEssaPhotoAdjuster(essaId) {

    const essa =
        getEssaById(essaId);

    if (!essa || !essa.photo) {
        return;
    }


    const overlay =
        document.createElement("div");

    overlay.className =
        "handler-award-overlay";


    const popup =
        document.createElement("div");

    popup.className =
        "handler-award-popup";


    const startX =
        essa.photoPositionX ?? 50;

    const startY =
        essa.photoPositionY ?? 50;


    popup.innerHTML = `

        <h2>
            📸 Adjust ${escapeHTML(essa.name)}'s Photo
        </h2>


        <div
            style="
                width:220px;
                height:220px;
                overflow:hidden;
                border-radius:24px;
                border:1px solid #dbe5e7;
                margin:0 auto 18px;
            "
        >

            <img
                id="essa-photo-adjust-preview"

                src="${essa.photo}"

                style="
                    width:100%;
                    height:100%;
                    object-fit:cover;
                    object-position:
                        ${startX}%
                        ${startY}%;
                "
            >

        </div>


        <div
            style="
                width:100%;
                max-width:400px;
            "
        >

            <label>
                ↔️ Left / Right
            </label>

            <input
                id="essa-photo-x"
                type="range"
                min="0"
                max="100"
                value="${startX}"
                style="width:100%;"
            >


            <label
                style="
                    display:block;
                    margin-top:15px;
                "
            >
                ↕️ Up / Down
            </label>

            <input
                id="essa-photo-y"
                type="range"
                min="0"
                max="100"
                value="${startY}"
                style="width:100%;"
            >

        </div>


        <div
            class="handler-award-popup-buttons"
        >

            <button
                class="handler-action-button primary"
                onclick="
                    saveEssaPhotoPosition(
                        '${essa.id}'
                    )
                "
            >
                💾 Save Position
            </button>


            <button
                class="handler-results-close"
                onclick="
                    closeHandlerAward()
                "
            >
                Cancel
            </button>

        </div>

    `;


    overlay.appendChild(popup);

    document.body.appendChild(overlay);


    const preview =
        document.getElementById(
            "essa-photo-adjust-preview"
        );

    const xSlider =
        document.getElementById(
            "essa-photo-x"
        );

    const ySlider =
        document.getElementById(
            "essa-photo-y"
        );


    function updatePreview() {

        preview.style.objectPosition =
            `${xSlider.value}% ${ySlider.value}%`;
    }


    xSlider.addEventListener(
        "input",
        updatePreview
    );

    ySlider.addEventListener(
        "input",
        updatePreview
    );
}

function saveEssaPhotoPosition(essaId) {

    const essa =
        getEssaById(essaId);

    if (!essa) {
        return;
    }


    const xSlider =
        document.getElementById(
            "essa-photo-x"
        );

    const ySlider =
        document.getElementById(
            "essa-photo-y"
        );


    if (!xSlider || !ySlider) {
        return;
    }


    essa.photoPositionX =
        Number(xSlider.value);

    essa.photoPositionY =
        Number(ySlider.value);


    const essas =
        getSavedEssas();

    const essaIndex =
        essas.findIndex(
            function(savedEssa) {

                return (
                    String(savedEssa.id) ===
                    String(essaId)
                );
            }
        );


    if (essaIndex === -1) {
        return;
    }


    essas[essaIndex] =
        essa;


    saveEssas(
        essas
    );


    closeHandlerAward();


    showEssaProfile(
        essaId
    );
}


/* =========================================================
   DELETE ESSA
========================================================= */

function deleteEssa(
    essaId
) {

    const essa =
        getEssaById(
            essaId
        );


    if (!essa) {

        return;
    }


    const overlay =
        document.createElement(
            "div"
        );

    overlay.className =
        "delete-essa-overlay";


    const popup =
        document.createElement(
            "div"
        );

    popup.className =
        "delete-essa-popup";


    popup.innerHTML = `
        <h2>
            🗑️ Delete ${escapeHTML(essa.name)}?
        </h2>

        <p>
            Are you sure you want to delete
            <strong>${escapeHTML(essa.name)}</strong>?
        </p>

        <p class="delete-essa-warning">
            This will permanently delete this ESSA profile
            and its saved care and score information.
            <strong>This cannot be undone.</strong>
        </p>

        <div class="delete-essa-buttons">

            <button
                class="delete-essa-cancel"
                onclick="closeDeleteEssaPopup()"
            >
                Cancel
            </button>

            <button
                class="delete-essa-confirm"
                onclick="confirmDeleteEssa('${essaId}')"
            >
                Delete ESSA
            </button>

        </div>
    `;


    overlay.appendChild(
        popup
    );

    document.body.appendChild(
        overlay
    );
}

function closeDeleteEssaPopup() {

    const overlay =
        document.querySelector(
            ".delete-essa-overlay"
        );


    if (overlay) {

        overlay.remove();
    }
}


function confirmDeleteEssa(
    essaId
) {

    const essas =
        getSavedEssas()
            .filter(
                function(item) {

                    return (
                        String(
                            item.id
                        ) !==
                        String(
                            essaId
                        )
                    );
                }
            );


    saveEssas(
        essas
    );


    const care =
        getSavedCare()
            .filter(
                function(event) {

                    return (
                        String(
                            event.essaId
                        ) !==
                        String(
                            essaId
                        )
                    );
                }
            );


    saveCare(
        care
    );


    const scores =
        getSavedScores()
            .filter(
                function(score) {

                    return (
                        String(
                            score.essaId
                        ) !==
                        String(
                            essaId
                        )
                    );
                }
            );


    saveScores(
        scores
    );


    closeDeleteEssaPopup();

    renderHome();
}

/* =========================================================
   REAL-WORLD CARE LOGGING
========================================================= */

function showCareLogForm(
    essaId,
    editEventId = null
) {

    const essa =
        getEssaById(
            essaId
        );


    if (!essa) {

        renderHome();

        return;
    }


    const events =
        getSavedCare();


    const existing =
        editEventId

            ? events.find(
                function(event) {

                    return (
                        String(
                            event.id
                        ) ===
                        String(
                            editEventId
                        )
                    );
                }
            )

            : null;


    const careOptions =
        careTypes
            .map(
                function(type) {

                    return `

                        <option
                            value="${escapeHTML(
                                type.name
                            )}"
                        >

                            ${type.icon}

                            ${escapeHTML(
                                type.name
                            )}

                        </option>

                    `;
                }
            )
            .join("");


    const dateValue =
        existing?.date

            ? new Date(
                existing.date
            )
                .toISOString()
                .slice(
                    0,
                    16
                )

            : new Date()
                .toISOString()
                .slice(
                    0,
                    16
                );


    document.querySelector(
        "main"
    ).innerHTML = `

        ${makeAppTabs(
            "Home"
        )}


        <div
            class="essa-form"
        >


            <button
                onclick="
                    showEssaProfile(
                        '${essa.id}'
                    )
                "
            >

                ← Back to
                ${escapeHTML(
                    essa.name
                )}

            </button>


            <h1>

                ${
                    existing

                        ? "Edit Care Entry"

                        : "Log Care"
                }

            </h1>


            <p>

                For:

                <strong>
                    ${escapeHTML(
                        essa.name
                    )}
                </strong>

            </p>


            <label>
                Care Type
            </label>


            <select
              id="care-type"
              class="care-filter-select"
            >


                ${careOptions}

            </select>


            <label>
                Date & Time
            </label>


            <input
                id="care-date"

                type="datetime-local"

                value="${dateValue}"
            >


            <label>
                Notes
            </label>


            <textarea
                id="care-notes"

                placeholder="Optional notes"
            >${escapeHTML(
                existing?.notes ||
                ""
            )}</textarea>


            <div
                style="
                    display:flex;

                    gap:10px;

                    flex-wrap:wrap;

                    margin-top:20px;
                "
            >


                <button
                    onclick="
                        showEssaProfile(
                            '${essa.id}'
                        )
                    "
                >

                    Cancel

                </button>


                <button
                class="handler-action-button primary"

                    onclick="
                        saveCareEntry(
                            '${essa.id}',
                            ${
                                existing
                                    ? `'${existing.id}'`
                                    : "null"
                            }
                        )
                    "
                >

                    ${
                        existing
                            ? "Save Changes"
                            : "Log Care"
                    }

                </button>


            </div>


        </div>

    `;


    if (existing) {

        const careType =
            document.getElementById(
                "care-type"
            );


        if (careType) {

            careType.value =
                existing.type;
        }
    }
}


/* =========================================================
   SAVE CARE ENTRY
========================================================= */

function saveCareEntry(
    essaId,
    editEventId = null
) {

    const type =
        document
            .getElementById(
                "care-type"
            )
            .value;


    const date =
        document
            .getElementById(
                "care-date"
            )
            .value;


    const notes =
        document
            .getElementById(
                "care-notes"
            )
            .value
            .trim();


    if (
        !type ||
        !date
    ) {

        alert(
            "Please choose a care type and time."
        );

        return;
    }


    const events =
        getSavedCare();


    if (editEventId) {

        const index =
            events.findIndex(
                function(event) {

                    return (
                        String(
                            event.id
                        ) ===
                        String(
                            editEventId
                        )
                    );
                }
            );


        if (
            index !==
            -1
        ) {

            events[
                index
            ] = {

                ...events[
                    index
                ],

                type:
                    type,

                date:
                    new Date(
                        date
                    )
                        .toISOString(),

                notes:
                    notes,

                careMode:
                    events[index]
                        .careMode ||
                    "irl",

                updatedAt:
                    new Date()
                        .toISOString()

            };
        }

    } else {

        events.push(
            {

                id:
                    makeId(
                        "care"
                    ),

                essaId:
                    essaId,

                type:
                    type,

                date:
                    new Date(
                        date
                    )
                        .toISOString(),

                notes:
                    notes,

                careMode:
                    "irl",

                createdAt:
                    new Date()
                        .toISOString()

            }
        );
    }


    saveCare(
        events
    );


    showEssaProfile(
        essaId
    );
}


/* =========================================================
   CARE HISTORY
========================================================= */

function showCareHistory(
    essaId,
    selectedType = "All",
    selectedMode = "all"
) {

    const essa =
        getEssaById(
            essaId
        );


    if (!essa) {

        renderHome();

        return;
    }


    let events =
        getSavedCare()
            .filter(
                function(event) {

                    return (
                        String(
                            event.essaId
                        ) ===
                        String(
                            essa.id
                        )
                    );
                }
            );


    /* -------------------------
       FILTER BY CARE TYPE
    ------------------------- */

    if (
        selectedType !==
        "All"
    ) {

        events =
            events.filter(
                function(event) {

                    return (
                        event.type ===
                        selectedType
                    );
                }
            );
    }


    /* -------------------------
       FILTER BY IRL / VIRTUAL
    ------------------------- */

    if (
        selectedMode ===
        "irl"
    ) {

        events =
            events.filter(
                function(event) {

                    return (
                        !event.careMode ||
                        event.careMode ===
                        "irl"
                    );
                }
            );
    }


    if (
        selectedMode ===
        "virtual"
    ) {

        events =
            events.filter(
                function(event) {

                    return (
                        event.careMode ===
                        "virtual"
                    );
                }
            );
    }


    /* -------------------------
       NEWEST FIRST
    ------------------------- */

    events.sort(
        function(a, b) {

            return (
                new Date(
                    b.date
                ) -
                new Date(
                    a.date
                )
            );
        }
    );


    /* -------------------------
       CARE TYPE OPTIONS
    ------------------------- */

    const filterOptions =
        [
            "All",

            ...careTypes.map(
                function(type) {

                    return type.name;
                }
            )
        ]
            .map(
                function(type) {

                    return `

                        <option
                            value="${escapeHTML(
                                type
                            )}"
                        >
                            ${escapeHTML(
                                type
                            )}
                        </option>

                    `;
                }
            )
            .join("");


    /* -------------------------
       CARE HISTORY CARDS
    ------------------------- */

    const eventHTML =
        events.length

            ? events
                .map(
                    function(event) {

                        const careType =
                            careTypes.find(
                                function(type) {

                                    return (
                                        type.name ===
                                        event.type
                                    );
                                }
                            );


                        const isVirtual =
                            event.careMode ===
                            "virtual";


                        let displayType =
                            event.type;

                            if (
    isVirtual &&
    event.type ===
    "Water"
) {

    displayType =
        "Drink";
}


                        if (
                            isVirtual &&
                            event.type ===
                            "Food"
                        ) {

                            displayType =
                                "Feeding";
                        }


                        if (
                            isVirtual &&
                            event.type ===
                            "Bath"
                        ) {

                            displayType =
                                "Bathing";
                        }


                        if (isVirtual) {

                            displayType +=
                                " (Virtual)";
                        }


                        return `

                            <div
                                style="
                                    padding:16px;
                                    margin-bottom:12px;
                                    background:white;
                                    border:
                                        1px solid
                                        #dbe5e7;
                                    border-radius:16px;
                                "
                            >

                                <div
                                    style="
                                        display:flex;
                                        justify-content:
                                            space-between;
                                        align-items:flex-start;
                                        gap:15px;
                                        flex-wrap:wrap;
                                    "
                                >

                                    <div>

                                        <strong
                                            style="
                                                font-size:17px;
                                            "
                                        >
                                            ${careType?.icon || "🐾"}

                                            ${escapeHTML(
                                                displayType
                                            )}
                                        </strong>


                                        <div
                                            style="
                                                margin-top:4px;
                                                color:#68777b;
                                            "
                                        >
                                            ${formatDateTime(
                                                event.date
                                            )}
                                        </div>


                                        ${
                                            event.notes

                                                ? `

                                                    <p
                                                        style="
                                                            margin-bottom:0;
                                                        "
                                                    >
                                                        ${escapeHTML(
                                                            event.notes
                                                        )}
                                                    </p>

                                                `

                                                : ""
                                        }

                                    </div>


                                    <div
                                        style="
                                            display:flex;
                                            gap:8px;
                                            flex-wrap:wrap;
                                        "
                                    >

                                      <button
    onclick="
        showCareLogForm(
            '${essa.id}',
            '${event.id}'
        )
    "

    style="
        padding:8px 14px;
        border-radius:10px;
        border:none;
        background:
            var(--user-theme-color, #4fb5ae);
        color:white;
        font-weight:bold;
        cursor:pointer;
    "
>
    ✏️ Edit
</button>


                                       <button
    onclick="
        deleteCareEntry(
            '${essa.id}',
            '${event.id}',
            '${selectedType}'
        )
    "

    style="
        padding:8px 14px;
        border-radius:10px;
        border:1px solid #f3b8b3;
        background:#fff5f4;
        color:#b42318;
        font-weight:bold;
        cursor:pointer;
    "
>
    🗑️ Delete
</button>

                                    </div>

                                </div>

                            </div>

                        `;
                    }
                )
                .join("")

            : `

                <div
                    style="
                        padding:25px;
                        background:white;
                        border-radius:18px;
                        border:
                            1px solid
                            #dbe5e7;
                    "
                >
                    No care entries found.
                </div>

            `;


    /* -------------------------
       PAGE
    ------------------------- */

    document.querySelector(
        "main"
    ).innerHTML = `

        ${makeAppTabs(
            "Home"
        )}


        <div
            style="
                max-width:950px;
                margin:0 auto;
            "
        >

            <button
            class="handler-action-button"
            
                onclick="
                    showEssaProfile(
                        '${essa.id}'
                    )
                "
            >
                ← Back to
                ${escapeHTML(
                    essa.name
                )}
            </button>


            <h1>
                🐾 Care History
            </h1>


            <p>
                ${escapeHTML(
                    essa.name
                )}
            </p>


            <div
                style="
                    display:flex;
                    gap:12px;
                    flex-wrap:wrap;
                    margin-bottom:20px;
                "
            >

                <div
                    style="
                        min-width:200px;
                    "
                >

                    <label>
                        Care Type
                    </label>


                    <select
                        id="care-history-filter"
                        class="care-filter-select"

                        onchange="
                            showCareHistory(
                                '${essa.id}',
                                this.value,
                                document.getElementById(
                                    'care-history-mode-filter'
                                ).value
                            )
                        "
                    >
                        ${filterOptions}
                    </select>

                </div>


                <div
                    style="
                        min-width:200px;
                    "
                >

                    <label>
                        Care Source
                    </label>


                    <select
                        id="care-history-mode-filter"
                        class="care-filter-select"

                        onchange="
                            showCareHistory(
                                '${essa.id}',
                                document.getElementById(
                                    'care-history-filter'
                                ).value,
                                this.value
                            )
                        "
                    >

                        <option value="all">
                            ALL
                        </option>

                        <option value="irl">
                            Just IRL
                        </option>

                        <option value="virtual">
                            Just Virtual
                        </option>

                    </select>

                </div>

            </div>


            <button
             class="handler-action-button primary"
             
                onclick="
                    showCareLogForm(
                        '${essa.id}'
                    )
                "

                style="
                    margin-bottom:20px;
                "
            >
                + Log Care
            </button>


            ${eventHTML}

        </div>

    `;


    const typeFilter =
        document.getElementById(
            "care-history-filter"
        );


    if (typeFilter) {

        typeFilter.value =
            selectedType;
    }


    const modeFilter =
        document.getElementById(
            "care-history-mode-filter"
        );


    if (modeFilter) {

        modeFilter.value =
            selectedMode;
    }
}


/* =========================================================
   DELETE CARE ENTRY
========================================================= */

function deleteCareEntry(
    essaId,
    eventId,
    selectedType = "All"
) {

    const overlay =
        document.createElement("div");

    overlay.className =
        "handler-award-overlay";


    const popup =
        document.createElement("div");

    popup.className =
        "handler-award-popup";


    popup.innerHTML = `

        <h2>
            🗑️ Delete Care Entry?
        </h2>

        <p
            style="
                font-size:16px;
                color:#68777b;
                margin:5px 0 20px;
            "
        >
            Are you sure you want to delete this care entry?
            This cannot be undone.
        </p>


        <div
            class="handler-award-popup-buttons"
        >

            <button
                type="button"

                style="
                    padding:10px 18px;
                    border-radius:10px;
                    border:1px solid #f3b8b3;
                    background:#fff5f4;
                    color:#b42318;
                    font-weight:bold;
                    cursor:pointer;
                "

                onclick="
                    confirmDeleteCareEntry(
                        '${essaId}',
                        '${eventId}',
                        '${selectedType}'
                    )
                "
            >
                🗑️ Delete
            </button>


            <button
                type="button"
                class="handler-action-button primary"

                onclick="
                    closeHandlerAward()
                "
            >
                Cancel
            </button>

        </div>

    `;


    overlay.appendChild(
        popup
    );

    document.body.appendChild(
        overlay
    );
}

function confirmDeleteCareEntry(
    essaId,
    eventId,
    selectedType = "All"
) {

    const events =
        getSavedCare()
            .filter(
                function(event) {

                    return (
                        String(
                            event.id
                        ) !==
                        String(
                            eventId
                        )
                    );
                }
            );


    saveCare(
        events
    );


    closeHandlerAward();


    showCareHistory(
        essaId,
        selectedType
    );
}

/* =========================================================
   TRAINING TAB
========================================================= */

function renderTrainingTab() {

    applyUserTheme();

    const user =
        getCurrentUser();

    const tricks =
        getSavedTricks();

    let cards =
        "";


    tricks.forEach(
        function(trick) {

            cards += `

                <div
                    style="
                        background:white;

                        border:
                            1px solid
                            #dbe5e7;

                        border-radius:16px;

                        padding:18px;

                        box-shadow:
                            0 4px 12px
                            rgba(0,0,0,.05);
                    "
                >


                    <button
                        onclick="
                            showTrickLogger(
                                '${trick.id}'
                            )
                        "

                        style="
                            width:100%;

                            padding:14px;

                            border:none;

                            border-radius:10px;

                            background:var(--user-theme-color, #4fb5ae);

                            color:white;

                            font-size:17px;

                            cursor:pointer;
                        "
                    >

                        ⭐ ${escapeHTML(
                            trick.name
                        )}

                    </button>


                    <button
                        onclick="
                            deleteTrick(
                                '${trick.id}'
                            )
                        "

                        style="
                            margin-top:10px;

                            border:none;

                            background:none;

                            color:#b42318;

                            cursor:pointer;
                        "
                    >

                        Delete

                    </button>


                </div>

            `;
        }
    );


    if (
        tricks.length ===
        0
    ) {

        cards = `

            <div
                style="
                    padding:25px;

                    background:white;

                    border:
                        1px dashed
                        #b9d6d3;

                    border-radius:18px;
                "
            >

                <p
                    style="
                        margin:0;
                    "
                >

                    You haven't added any tricks yet.

                </p>

            </div>

        `;
    }


    document.querySelector(
        "main"
    ).innerHTML = `

        ${makeAppTabs(
            "Training"
        )}


        <div
            style="
                max-width:1000px;

                margin:0 auto;
            "
        >


            <h1>
                ⭐ Training
            </h1>


            <p
                style="
                    color:#68777b;

                    line-height:1.5;
                "
            >

                Build your trick library,
                then tap a trick whenever
                you want to log a score.

            </p>


            <button
                class="add-essa-button"

                onclick="
                    showAddTrickForm()
                "
            >

                + Add a Trick

            </button>

            <div
    style="
        margin-top:20px;
        padding:20px;
        background:white;
        border:1px solid #dbe5e7;
        border-radius:16px;
    "
>

    <h2
        style="
            margin-top:0;
            color:var(--user-theme-color, #4fb5ae);
        "
    >
        🏆 Certification
    </h2>

       
                    <p
        style="
            color:#68777b;
            line-height:1.5;
        "
    >
        ${
            user &&
            user.handlerCertified

                ? "Your Handler Certification is complete. ESSA Certification is unlocked!"

                : "Complete the Handler Certification Exam to unlock ESSA Certification."
        }
    </p>


    <div
        style="
            display:flex;
            gap:10px;
            flex-wrap:wrap;
            justify-content:center;
        "
    >

        <button
            class="handler-action-button primary"
            onclick="
                showHandlerCertificationExam()
            "
        >
            🏆 Handler Certification Exam
        </button>


        ${
            user &&
            user.handlerCertified

                ? `
                    <button
                        class="handler-action-button primary"
                        onclick="
                            renderHome()
                        "
                    >
                        🏆 ESSA Certification Exam
                    </button>
                `

                : `
                    <button
                        class="handler-action-button"
                        onclick="
                            showLockedEssaCertificationPopup()
                        "
                    >
                        🔒 ESSA Certification Exam
                    </button>
                `
        }

    </div>

</div>


            <div
                style="
                    margin-top:30px;

                    display:grid;

                    grid-template-columns:
                        repeat(
                            auto-fit,
                            minmax(
                                200px,
                                1fr
                            )
                        );

                    gap:15px;
                "
            >

                ${cards}

            </div>


        </div>

    `;
}


/* =========================================================
   ADD TRICK
========================================================= */

function showAddTrickForm() {

    const options =
        presetTricks
            .map(
                function(trick) {

                    return `

                        <option
                            value="${escapeHTML(
                                trick
                            )}"
                        >

                            ${escapeHTML(
                                trick
                            )}

                        </option>

                    `;

                }
            )
            .join("");


    document.querySelector(
        "main"
    ).innerHTML = `

        ${makeAppTabs(
            "Training"
        )}


        <div
            class="essa-form"
        >


            <h1>
                Add a Trick
            </h1>


            <label>
                Trick
            </label>


            <select
                id="trick-choice"

                onchange="
                    updateCustomTrickField()
                "
            >


                <option value="">
                    Choose a trick
                </option>


                ${options}


                <option value="Custom">
                    Custom Trick
                </option>


            </select>


            <div
                id="custom-trick-area"

                style="
                    display:none;
                "
            >


                <label>
                    Custom Trick Name
                </label>


                <input
                    id="custom-trick-name"

                    type="text"
                >


            </div>


            <div
                style="
                    display:flex;

                    gap:10px;

                    flex-wrap:wrap;

                    margin-top:20px;
                "
            >


                <button
                    onclick="
                        renderTrainingTab()
                    "
                >

                    Cancel

                </button>


                <button
                    onclick="
                        saveNewTrick()
                    "
                >

                    Add Trick

                </button>


            </div>


        </div>

    `;
}


/* =========================================================
   CUSTOM TRICK FIELD
========================================================= */

function updateCustomTrickField() {

    const choice =
        document
            .getElementById(
                "trick-choice"
            )
            .value;


    const customArea =
        document.getElementById(
            "custom-trick-area"
        );


    if (!customArea) {

        return;
    }


    customArea.style.display =
        choice ===
        "Custom"

            ? "block"

            : "none";
}


/* =========================================================
   SAVE NEW TRICK
========================================================= */

function saveNewTrick() {

    const choice =
        document
            .getElementById(
                "trick-choice"
            )
            .value;


    let name =
        choice;


    if (
        choice ===
        "Custom"
    ) {

        name =
            document
                .getElementById(
                    "custom-trick-name"
                )
                .value
                .trim();
    }


    if (!name) {

        alert(
            "Please choose or enter a trick."
        );

        return;
    }


    const tricks =
        getSavedTricks();


    const duplicate =
        tricks.some(
            function(trick) {

                return (
                    String(
                        trick.name ||
                        ""
                    )
                        .toLowerCase() ===
                    name
                        .toLowerCase()
                );
            }
        );


    if (duplicate) {

        alert(
            "That trick is already in your library."
        );

        return;
    }


    tricks.push(
        {

            id:
                makeId(
                    "trick"
                ),

            name:
                name,

            createdAt:
                new Date()
                    .toISOString()

        }
    );


    saveTricks(
        tricks
    );


    renderTrainingTab();
}


/* =========================================================
   DELETE TRICK
========================================================= */
function deleteTrick(
    trickId
) {

    const tricks =
        getSavedTricks();

    const trick =
        tricks.find(
            function(item) {

                return (
                    String(item.id) ===
                    String(trickId)
                );
            }
        );


    if (!trick) {
        return;
    }


    const oldPopup =
        document.getElementById(
            "trick-delete-popup"
        );

    if (oldPopup) {
        oldPopup.remove();
    }


    const popup =
        document.createElement(
            "div"
        );

    popup.id =
        "trick-delete-popup";


    popup.innerHTML = `

        <div class="training-delete-overlay">

            <div class="training-delete-box">

                <h2>
                    Delete Trick?
                </h2>

                <p>
                    Are you sure you want to delete
                    <strong>${escapeHTML(trick.name)}</strong>
                    from your trick library?
                </p>

                <div class="training-delete-buttons">

                    <button
                        class="handler-action-button"
                        onclick="
                            document.getElementById(
                                'trick-delete-popup'
                            ).remove()
                        "
                    >
                        Cancel
                    </button>

                    <button
                        class="handler-action-button danger"
                        onclick="
                            document.getElementById(
                                'trick-delete-popup'
                            ).remove();

                            deleteTrickConfirmed(
                                '${trickId}'
                            );
                        "
                    >
                        Delete
                    </button>

                </div>

            </div>

        </div>
    `;


    document.body.appendChild(
        popup
    );
}

function deleteTrickConfirmed(
    trickId
) {

    const tricks =
        getSavedTricks();


    const trick =
        tricks.find(
            function(item) {

                return (
                    String(
                        item.id
                    ) ===
                    String(
                        trickId
                    )
                );
            }
        );


    if (!trick) {

        return;
    }


    const remainingTricks =
        tricks.filter(
            function(item) {

                return (
                    String(
                        item.id
                    ) !==
                    String(
                        trickId
                    )
                );
            }
        );


    saveTricks(
        remainingTricks
    );


    renderTrainingTab();
}


/* =========================================================
   TRAINING SCORE LOGGER
========================================================= */

function showTrickLogger(
    trickId
) {

    const trick =
        getSavedTricks()
            .find(
                function(item) {

                    return (
                        String(
                            item.id
                        ) ===
                        String(
                            trickId
                        )
                    );
                }
            );


    if (!trick) {

        renderTrainingTab();

        return;
    }


    const essas =
        getSavedEssas();


    if (
        essas.length ===
        0
    ) {

        alert(
            "Add an ESSA before logging a training score."
        );

        return;
    }


    const essaOptions =
        essas
            .slice()
            .sort(
                function(a, b) {

                    return String(
                        a.name ||
                        ""
                    )
                        .localeCompare(
                            String(
                                b.name ||
                                ""
                            )
                        );
                }
            )
            .map(
                function(essa) {

                    return `

                        <option
                            value="${essa.id}"
                        >

                            ${escapeHTML(
                                essa.name
                            )}

                        </option>

                    `;

                }
            )
            .join("");


    const now =
        new Date();


    document.querySelector(
        "main"
    ).innerHTML = `

        ${makeAppTabs(
            "Training"
        )}


        <div
            class="essa-form"
        >


            <h1>

                ⭐ ${escapeHTML(
                    trick.name
                )}

            </h1>


            <label>
                ESSA
            </label>


            <select
                id="score-essa"
            >

                ${essaOptions}

            </select>


            <label>
                When?
            </label>


            <select
                id="score-when"

                onchange="
                    updateScoreWhenFields()
                "
            >


                <option value="now">
                    Now
                </option>


                <option value="custom">
                    Custom Date & Time
                </option>


            </select>


            <div
                id="score-custom-time"

                style="
                    display:none;
                "
            >


                <label>
                    Date
                </label>


                <input
                    id="score-date"

                    type="date"

                    value="${getLocalDateString(
                        now
                    )}"
                >


                <label>
                    Time
                </label>


                <input
                    id="score-time"

                    type="time"

                    value="${getLocalTimeString(
                        now
                    )}"
                >


            </div>


            <label>
                Score
            </label>


            <select
                id="score-stars"
            >


                <option value="1">
                    ⭐ 1 Star
                </option>


                <option value="2">
                    ⭐⭐ 2 Stars
                </option>


                <option value="3">
                    ⭐⭐⭐ 3 Stars
                </option>


                <option value="4">
                    ⭐⭐⭐⭐ 4 Stars
                </option>


                <option value="5">
                    ⭐⭐⭐⭐⭐ 5 Stars
                </option>


            </select>


            <div
                style="
                    display:flex;

                    gap:10px;

                    flex-wrap:wrap;

                    margin-top:20px;
                "
            >


                <button
                    onclick="
                        renderTrainingTab()
                    "
                >

                    Cancel

                </button>


                <button
                    onclick="
                        saveTrainingScore(
                            '${trick.id}'
                        )
                    "
                >

                    Save Score

                </button>


            </div>


        </div>

    `;
}


/* =========================================================
   TRAINING TIME FIELDS
========================================================= */

function updateScoreWhenFields() {

    const when =
        document
            .getElementById(
                "score-when"
            )
            .value;


    const customTime =
        document.getElementById(
            "score-custom-time"
        );


    if (!customTime) {

        return;
    }


    customTime.style.display =
        when ===
        "custom"

            ? "block"

            : "none";
}


/* =========================================================
   LOCAL DATE STRING
========================================================= */

function getLocalDateString(
    date
) {

    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() +
            1
        )
            .padStart(
                2,
                "0"
            );


    const day =
        String(
            date.getDate()
        )
            .padStart(
                2,
                "0"
            );


    return (
        year +
        "-" +
        month +
        "-" +
        day
    );
}


/* =========================================================
   LOCAL TIME STRING
========================================================= */

function getLocalTimeString(
    date
) {

    const hours =
        String(
            date.getHours()
        )
            .padStart(
                2,
                "0"
            );


    const minutes =
        String(
            date.getMinutes()
        )
            .padStart(
                2,
                "0"
            );


    return (
        hours +
        ":" +
        minutes
    );
}


/* =========================================================
   SAVE TRAINING SCORE
========================================================= */

function saveTrainingScore(
    trickId
) {

    const trick =
        getSavedTricks()
            .find(
                function(item) {

                    return (
                        String(
                            item.id
                        ) ===
                        String(
                            trickId
                        )
                    );
                }
            );


    if (!trick) {

        return;
    }


    const essaId =
        document
            .getElementById(
                "score-essa"
            )
            .value;


    const when =
        document
            .getElementById(
                "score-when"
            )
            .value;


    let date;

    let time;


    if (
        when ===
        "now"
    ) {

        const now =
            new Date();


        date =
            getLocalDateString(
                now
            );


        time =
            getLocalTimeString(
                now
            );

    } else {

        date =
            document
                .getElementById(
                    "score-date"
                )
                .value;


        time =
            document
                .getElementById(
                    "score-time"
                )
                .value;
    }


    if (
        !date ||
        !time
    ) {

        alert(
            "Please choose a date and time."
        );

        return;
    }


    const stars =
        Number(
            document
                .getElementById(
                    "score-stars"
                )
                .value
        );


    const scores =
        getSavedScores();


    scores.push(
        {

            id:
                makeId(
                    "score"
                ),

            essaId:
                essaId,

            trickId:
                trick.id,

            trickName:
                trick.name,

            stars:
                stars,

            date:
                date,

            time:
                time,

            createdAt:
                new Date()
                    .toISOString()

        }
    );


    saveScores(
        scores
    );


    renderScoresTab();
}
/* =========================================================
   SCORE DATE / TIME HELPER
========================================================= */

function makeLocalDateTime(
    date,
    time
) {

    if (!date) {

        return null;
    }


    const safeTime =
        time ||
        "00:00";


    const result =
        new Date(
            date +
            "T" +
            safeTime
        );


    if (
        Number.isNaN(
            result.getTime()
        )
    ) {

        return null;
    }


    return result;
}


/* =========================================================
   SCORE HELPERS
========================================================= */

function getScoreTimestamp(
    score
) {

    if (!score) {

        return 0;
    }


    const date =
        makeLocalDateTime(
            score.date,
            score.time
        );


    return date

        ? date.getTime()

        : 0;
}


function getScoreGroups() {

    const scores =
        getSavedScores();


    const groups =
        {};


    scores.forEach(
        function(score) {

            const key =
                String(
                    score.essaId
                ) +
                "_" +
                String(
                    score.trickId
                );


            if (
                !groups[
                    key
                ]
            ) {

                groups[
                    key
                ] = {

                    essaId:
                        score.essaId,

                    trickId:
                        score.trickId,

                    trickName:
                        score.trickName,

                    scores:
                        []

                };
            }


            groups[
                key
            ].scores.push(
                score
            );

        }
    );


    return Object.values(
        groups
    );
}


/* =========================================================
   AVERAGE SCORE
========================================================= */

function calculateAverageScore(
    scores
) {

    if (
        !scores ||
        scores.length ===
        0
    ) {

        return 0;
    }


    const total =
        scores.reduce(
            function(
                sum,
                score
            ) {

                return (
                    sum +
                    Number(
                        score.stars
                    )
                );

            },
            0
        );


    return (
        total /
        scores.length
    );
}


/* =========================================================
   LATEST SCORE
========================================================= */

function getLatestScore(
    scores
) {

    if (
        !scores ||
        scores.length ===
        0
    ) {

        return null;
    }


    return scores
        .slice()
        .sort(
            function(a, b) {

                return (
                    getScoreTimestamp(
                        b
                    ) -
                    getScoreTimestamp(
                        a
                    )
                );

            }
        )[0];
}


/* =========================================================
   STAR DISPLAY
========================================================= */

function makeStarDisplay(
    stars
) {

    const amount =
        Math.max(
            0,
            Math.min(
                5,
                Number(
                    stars
                ) || 0
            )
        );


    return (
        "⭐".repeat(
            amount
        ) +
        "☆".repeat(
            5 -
            amount
        )
    );
}


/* =========================================================
   SCORES TAB
========================================================= */

function renderScoresTab(
    essaFilter = "all",
    sortBy = "essa"
) {

    applyUserTheme();


    const essas =
        getSavedEssas();


    let groups =
        getScoreGroups();


    /* -------------------------
       FILTER BY ESSA
    ------------------------- */

    if (
        essaFilter !==
        "all"
    ) {

        groups =
            groups.filter(
                function(group) {

                    return (
                        String(
                            group.essaId
                        ) ===
                        String(
                            essaFilter
                        )
                    );

                }
            );
    }


    /* -------------------------
       SORT BY ESSA NAME
    ------------------------- */

    if (
        sortBy ===
        "essa"
    ) {

        groups.sort(
            function(a, b) {

                const essaA =
                    getEssaById(
                        a.essaId
                    );


                const essaB =
                    getEssaById(
                        b.essaId
                    );


                return String(
                    essaA?.name ||
                    ""
                )
                    .localeCompare(
                        String(
                            essaB?.name ||
                            ""
                        )
                    );

            }
        );
    }


    /* -------------------------
       SORT BY TRICK
    ------------------------- */

    if (
        sortBy ===
        "trick"
    ) {

        groups.sort(
            function(a, b) {

                return String(
                    a.trickName ||
                    ""
                )
                    .localeCompare(
                        String(
                            b.trickName ||
                            ""
                        )
                    );

            }
        );
    }


    /* -------------------------
       HIGHEST AVERAGE
    ------------------------- */

    if (
        sortBy ===
        "highestAverage"
    ) {

        groups.sort(
            function(a, b) {

                return (
                    calculateAverageScore(
                        b.scores
                    ) -
                    calculateAverageScore(
                        a.scores
                    )
                );

            }
        );
    }


    /* -------------------------
       LOWEST AVERAGE
    ------------------------- */

    if (
        sortBy ===
        "lowestAverage"
    ) {

        groups.sort(
            function(a, b) {

                return (
                    calculateAverageScore(
                        a.scores
                    ) -
                    calculateAverageScore(
                        b.scores
                    )
                );

            }
        );
    }


    /* -------------------------
       MOST ATTEMPTS
    ------------------------- */

    if (
        sortBy ===
        "mostAttempts"
    ) {

        groups.sort(
            function(a, b) {

                return (
                    b.scores.length -
                    a.scores.length
                );

            }
        );
    }


    /* -------------------------
       MOST RECENT
    ------------------------- */

    if (
        sortBy ===
        "mostRecent"
    ) {

        groups.sort(
            function(a, b) {

                return (
                    getScoreTimestamp(
                        getLatestScore(
                            b.scores
                        )
                    ) -
                    getScoreTimestamp(
                        getLatestScore(
                            a.scores
                        )
                    )
                );

            }
        );
    }


    /* -------------------------
       ESSA FILTER OPTIONS
    ------------------------- */

    const filterOptions =
        essas
            .slice()
            .sort(
                function(a, b) {

                    return String(
                        a.name ||
                        ""
                    )
                        .localeCompare(
                            String(
                                b.name ||
                                ""
                            )
                        );

                }
            )
            .map(
                function(essa) {

                    return `

                        <option
                            value="${essa.id}"
                        >

                            ${escapeHTML(
                                essa.name
                            )}

                        </option>

                    `;

                }
            )
            .join("");


    /* -------------------------
       SCORE CARDS
    ------------------------- */

    let cards =
        "";


    groups.forEach(
        function(group) {

            const essa =
                getEssaById(
                    group.essaId
                );


            if (!essa) {

                return;
            }


            const average =
                calculateAverageScore(
                    group.scores
                );


            const latest =
                getLatestScore(
                    group.scores
                );


            cards += `

                <div
                    style="
                        padding:20px;

                        background:white;

                        border:
                            1px solid
                            #dbe5e7;

                        border-radius:18px;

                        box-shadow:
                            0 4px 14px
                            rgba(0,0,0,.05);
                    "
                >


                    <p
                        style="
                            margin:0;

                            color:#68777b;
                        "
                    >

                        ${escapeHTML(
                            essa.name
                        )}

                    </p>


                    <button
                        onclick="
                            showTrickProgress(
                                '${group.essaId}',
                                '${group.trickId}'
                            )
                        "

                        style="
                            margin:
                                8px 0
                                15px 0;

                            padding:0;

                            border:none;

                            background:none;

                            color:#3b9f99;

                            font-size:21px;

                            font-weight:bold;

                            cursor:pointer;

                            text-align:left;
                        "
                    >

                        ${escapeHTML(
                            group.trickName
                        )}

                    </button>


                    <div
                        style="
                            display:grid;

                            grid-template-columns:
                                repeat(
                                    3,
                                    1fr
                                );

                            gap:10px;
                        "
                    >


                        <div>

                            <strong>
                                Average
                            </strong>

                            <div>

                                ${average.toFixed(
                                    1
                                )} ⭐

                            </div>

                        </div>


                        <div>

                            <strong>
                                Latest
                            </strong>

                            <div>

                                ${
                                    latest

                                        ? latest.stars +
                                        " ⭐"

                                        : "—"
                                }

                            </div>

                        </div>


                        <div>

                            <strong>
                                Attempts
                            </strong>

                            <div>

                                ${group.scores.length}

                            </div>

                        </div>


                    </div>


                </div>

            `;

        }
    );


    if (!cards) {

        cards = `

            <div
                style="
                    padding:25px;

                    background:white;

                    border:
                        1px dashed
                        #b9d6d3;

                    border-radius:18px;
                "
            >

                <p
                    style="
                        margin:0;
                    "
                >

                    No training scores yet.

                </p>

            </div>

        `;
    }


    document.querySelector(
        "main"
    ).innerHTML = `

        ${makeAppTabs(
            "Scores"
        )}


        <div
            style="
                max-width:1100px;

                margin:0 auto;
            "
        >


            <h1>
                🏆 Scores
            </h1>


            <p
                style="
                    color:#68777b;

                    line-height:1.5;
                "
            >

                Track how your ESSAs are
                improving with each trick.

            </p>


            <div
                style="
                    display:flex;

                    gap:12px;

                    justify-content:center;

                    flex-wrap:wrap;

                    margin:
                        20px 0
                        30px 0;
                "
            >


                <div
                    style="
                        min-width:220px;
                    "
                >


                    <label>
                        ESSA
                    </label>


                    <select
                        id="scores-essa-filter"
                    style="
                    width:100%;
                    padding:10px;
                    border:1px solid #cbd9dc;
                    border-radius:10px;
                    background:white;
                    font-size:14px;
                    cursor:pointer;
                    "
                        onchange="
                            renderScoresTab(
                                this.value,
                                document
                                    .getElementById(
                                        'scores-sort'
                                    )
                                    .value
                            )
                        "
                    >


                        <option
                            value="all"
                        >

                            All ESSAs

                        </option>


                        ${filterOptions}


                    </select>


                </div>


                <div
                    style="
                        min-width:220px;
                    "
                >


                    <label>
                        Sort
                    </label>


                    <select
                        id="scores-sort"
                    style="
                    width:100%;
                    padding:10px;
                    border:1px solid #cbd9dc;
                    border-radius:10px;
                    background:white;
                    font-size:14px;
                    cursor:pointer;
                    "

                        onchange="
                            renderScoresTab(
                                document
                                    .getElementById(
                                        'scores-essa-filter'
                                    )
                                    .value,
                                this.value
                            )
                        "
                    >


                        <option
                            value="essa"
                        >

                            ESSA Name

                        </option>


                        <option
                            value="trick"
                        >

                            Trick Name

                        </option>


                        <option
                            value="highestAverage"
                        >

                            Highest Average

                        </option>


                        <option
                            value="lowestAverage"
                        >

                            Lowest Average

                        </option>


                        <option
                            value="mostAttempts"
                        >

                            Most Attempts

                        </option>


                        <option
                            value="mostRecent"
                        >

                            Most Recent Training

                        </option>


                    </select>


                </div>


            </div>


            <div
                style="
                    display:grid;

                    grid-template-columns:
                        repeat(
                            auto-fit,
                            minmax(
                                260px,
                                1fr
                            )
                        );

                    gap:18px;
                "
            >

                ${cards}

            </div>


        </div>

    `;


    const essaSelect =
        document.getElementById(
            "scores-essa-filter"
        );


    const sortSelect =
        document.getElementById(
            "scores-sort"
        );


    if (essaSelect) {

        essaSelect.value =
            String(
                essaFilter
            );
    }


    if (sortSelect) {

        sortSelect.value =
            sortBy;
    }
}


/* =========================================================
   TRICK PROGRESS
========================================================= */

function showTrickProgress(
    essaId,
    trickId
) {

    const essa =
        getEssaById(
            essaId
        );


    if (!essa) {

        renderScoresTab();

        return;
    }


    const scores =
        getSavedScores()
            .filter(
                function(score) {

                    return (

                        String(
                            score.essaId
                        ) ===
                        String(
                            essaId
                        )

                        &&

                        String(
                            score.trickId
                        ) ===
                        String(
                            trickId
                        )

                    );

                }
            )
            .sort(
                function(a, b) {

                    return (
                        getScoreTimestamp(
                            b
                        ) -
                        getScoreTimestamp(
                            a
                        )
                    );

                }
            );


    if (
        scores.length ===
        0
    ) {

        renderScoresTab();

        return;
    }


    const trickName =
        scores[0].trickName ||
        "Trick";


    const average =
        calculateAverageScore(
            scores
        );


    const bestScore =
        Math.max(
            ...scores.map(
                function(score) {

                    return Number(
                        score.stars
                    );
                }
            )
        );


    const latest =
        getLatestScore(
            scores
        );


    const historyHTML =
        scores
            .map(
                function(score) {

                    return `

                        <div
                            style="
                                padding:16px;

                                margin-bottom:12px;

                                background:white;

                                border:
                                    1px solid
                                    #dbe5e7;

                                border-radius:16px;
                            "
                        >


                            <div
                                style="
                                    display:flex;

                                    justify-content:
                                        space-between;

                                    gap:15px;

                                    align-items:
                                        flex-start;

                                    flex-wrap:wrap;
                                "
                            >


                                <div>


                                    <div
                                        style="
                                            font-size:21px;

                                            margin-bottom:5px;
                                        "
                                    >

                                        ${makeStarDisplay(
                                            score.stars
                                        )}

                                    </div>


                                    <div
                                        style="
                                            color:#68777b;
                                        "
                                    >

                                        ${formatScoreDateTime(
                                            score
                                        )}

                                    </div>


                                </div>


                                <div
                                    style="
                                        display:flex;

                                        gap:8px;

                                        flex-wrap:wrap;
                                    "
                                >


                                    <button
                                    class="handler-action-button primary"

                                        onclick="
                                            showEditScoreForm(
                                                '${score.id}'
                                            )
                                        "
                                    >

                                        Edit

                                    </button>


                                    <button
                                    class="handler-action-button danger"

                                        onclick="
                                            deleteTrainingScore(
                                                '${score.id}',
                                                '${essaId}',
                                                '${trickId}'
                                            )
                                        "
                                    >

                                        Delete

                                    </button>


                                </div>


                            </div>


                        </div>

                    `;

                }
            )
            .join("");


    document.querySelector(
        "main"
    ).innerHTML = `

        ${makeAppTabs(
            "Scores"
        )}


        <div
            style="
                max-width:900px;

                margin:0 auto;
            "
        >


            <button
             class="handler-action-button"
             
                onclick="
                    renderScoresTab()
                "
            >

                ← Back to Scores

            </button>


            <h1>

                ⭐ ${escapeHTML(
                    trickName
                )}

            </h1>


            <h2
                style="
                    margin-top:0;

                    color:#68777b;
                "
            >

                ${escapeHTML(
                    essa.name
                )}

            </h2>


            <div
                style="
                    display:grid;

                    grid-template-columns:
                        repeat(
                            3,
                            minmax(
                                0,
                                1fr
                            )
                        );

                    gap:14px;

                    margin:
                        25px 0;
                "
            >


                <div
                    style="
                        padding:18px;

                        background:white;

                        border-radius:16px;

                        border:
                            1px solid
                            #dbe5e7;

                        text-align:center;
                    "
                >

                    <strong>
                        Average
                    </strong>


                    <div
                        style="
                            margin-top:8px;

                            font-size:24px;
                        "
                    >

                        ${average.toFixed(
                            1
                        )} ⭐

                    </div>


                </div>


                <div
                    style="
                        padding:18px;

                        background:white;

                        border-radius:16px;

                        border:
                            1px solid
                            #dbe5e7;

                        text-align:center;
                    "
                >

                    <strong>
                        Best
                    </strong>


                    <div
                        style="
                            margin-top:8px;

                            font-size:24px;
                        "
                    >

                        ${bestScore} ⭐

                    </div>


                </div>


                <div
                    style="
                        padding:18px;

                        background:white;

                        border-radius:16px;

                        border:
                            1px solid
                            #dbe5e7;

                        text-align:center;
                    "
                >

                    <strong>
                        Attempts
                    </strong>


                    <div
                        style="
                            margin-top:8px;

                            font-size:24px;
                        "
                    >

                        ${scores.length}

                    </div>


                </div>


            </div>


            <div
                style="
                    padding:20px;

                    background:
                        rgba(
                            255,
                            255,
                            255,
                            .8
                        );

                    border-radius:18px;

                    border:
                        1px solid
                        #dbe5e7;

                    margin-bottom:25px;
                "
            >


                <strong>
                    Latest Score
                </strong>


                <div
                    style="
                        font-size:24px;

                        margin-top:8px;
                    "
                >

                    ${
                        latest

                            ? makeStarDisplay(
                                latest.stars
                            )

                            : "—"
                    }

                </div>


            </div>


            <h2>
                Training History
            </h2>


            ${historyHTML}


        </div>

    `;
}


/* =========================================================
   FORMAT SCORE DATE / TIME
========================================================= */

function formatScoreDateTime(
    score
) {

    const date =
        makeLocalDateTime(
            score.date,
            score.time
        );


    if (!date) {

        return "Unknown date";
    }


    return date.toLocaleString(
        undefined,
        {

            year:
                "numeric",

            month:
                "short",

            day:
                "numeric",

            hour:
                "numeric",

            minute:
                "2-digit"

        }
    );
}


/* =========================================================
   EDIT SCORE FORM
========================================================= */

function showEditScoreForm(
    scoreId
) {

    const score =
        getSavedScores()
            .find(
                function(item) {

                    return (
                        String(
                            item.id
                        ) ===
                        String(
                            scoreId
                        )
                    );

                }
            );


    if (!score) {

        renderScoresTab();

        return;
    }


    const essa =
        getEssaById(
            score.essaId
        );


    document.querySelector(
        "main"
    ).innerHTML = `

        ${makeAppTabs(
            "Scores"
        )}


        <div
            class="essa-form"
        >


            <h1>
                Edit Training Score
            </h1>


            <p>

                <strong>
                    ${escapeHTML(
                        essa?.name ||
                        "ESSA"
                    )}
                </strong>

                —

                ${escapeHTML(
                    score.trickName ||
                    "Trick"
                )}

            </p>


            <label>
                Date
            </label>


            <input
                id="edit-score-date"

                type="date"

                value="${escapeHTML(
                    score.date ||
                    ""
                )}"
            >


            <label>
                Time
            </label>


            <input
                id="edit-score-time"

                type="time"

                value="${escapeHTML(
                    score.time ||
                    ""
                )}"
            >


            <label>
                Score
            </label>


            <select
                id="edit-score-stars"
            >


                <option value="1">
                    ⭐ 1 Star
                </option>


                <option value="2">
                    ⭐⭐ 2 Stars
                </option>


                <option value="3">
                    ⭐⭐⭐ 3 Stars
                </option>


                <option value="4">
                    ⭐⭐⭐⭐ 4 Stars
                </option>


                <option value="5">
                    ⭐⭐⭐⭐⭐ 5 Stars
                </option>


            </select>


            <div
                style="
                    display:flex;

                    gap:10px;

                    flex-wrap:wrap;

                    margin-top:20px;
                "
            >


                <button
                    onclick="
                        showTrickProgress(
                            '${score.essaId}',
                            '${score.trickId}'
                        )
                    "
                >

                    Cancel

                </button>


                <button
                    onclick="
                        saveEditedTrainingScore(
                            '${score.id}'
                        )
                    "
                >

                    Save Changes

                </button>


            </div>


        </div>

    `;


    const starSelect =
        document.getElementById(
            "edit-score-stars"
        );


    if (starSelect) {

        starSelect.value =
            String(
                score.stars
            );
    }
}


/* =========================================================
   SAVE EDITED SCORE
========================================================= */

function saveEditedTrainingScore(
    scoreId
) {

    const scores =
        getSavedScores();


    const index =
        scores.findIndex(
            function(score) {

                return (
                    String(
                        score.id
                    ) ===
                    String(
                        scoreId
                    )
                );

            }
        );


    if (
        index ===
        -1
    ) {

        return;
    }


    const date =
        document
            .getElementById(
                "edit-score-date"
            )
            .value;


    const time =
        document
            .getElementById(
                "edit-score-time"
            )
            .value;


    const stars =
        Number(
            document
                .getElementById(
                    "edit-score-stars"
                )
                .value
        );


    if (
        !date ||
        !time
    ) {

        alert(
            "Please choose a date and time."
        );

        return;
    }


    scores[
        index
    ] = {

        ...scores[
            index
        ],

        date:
            date,

        time:
            time,

        stars:
            stars,

        updatedAt:
            new Date()
                .toISOString()

    };


    const essaId =
        scores[
            index
        ].essaId;


    const trickId =
        scores[
            index
        ].trickId;


    saveScores(
        scores
    );


    showTrickProgress(
        essaId,
        trickId
    );
}

function deleteTrainingScore(
    scoreId,
    essaId,
    trickId
) {

    const oldPopup =
        document.getElementById(
            "training-delete-popup"
        );

    if (oldPopup) {
        oldPopup.remove();
    }


    const popup =
        document.createElement(
            "div"
        );

    popup.id =
        "training-delete-popup";

    popup.innerHTML = `

        <div class="training-delete-overlay">

            <div class="training-delete-box">

                <h2>
                    Delete Training Score?
                </h2>

                <p>
                    Are you sure you want to delete
                    this training score?
                </p>

                <div class="training-delete-buttons">

                    <button
                        class="handler-action-button"
                        onclick="
                            document.getElementById(
                                'training-delete-popup'
                            ).remove()
                        "
                    >
                        Cancel
                    </button>

                    <button
                        class="handler-action-button danger"
                        onclick="
                            document.getElementById(
                                'training-delete-popup'
                            ).remove();

                            deleteTrainingScoreConfirmed(
                                '${scoreId}',
                                '${essaId}',
                                '${trickId}'
                            );
                        "
                    >
                        Delete
                    </button>

                </div>

            </div>

        </div>
    `;


    document.body.appendChild(
        popup
    );
}
/* =========================================================
   DELETE TRAINING SCORE
========================================================= */
function deleteTrainingScore(
    scoreId,
    essaId,
    trickId
) {

    const oldPopup =
        document.getElementById(
            "training-delete-popup"
        );

    if (oldPopup) {
        oldPopup.remove();
    }


    const popup =
        document.createElement(
            "div"
        );

    popup.id =
        "training-delete-popup";

    popup.innerHTML = `

        <div class="training-delete-overlay">

            <div class="training-delete-box">

                <h2>
                    Delete Training Score?
                </h2>

                <p>
                    Are you sure you want to delete
                    this training score?
                </p>

                <div class="training-delete-buttons">

                    <button
                        class="handler-action-button"
                        onclick="
                            document.getElementById(
                                'training-delete-popup'
                            ).remove()
                        "
                    >
                        Cancel
                    </button>

                    <button
                        class="handler-action-button danger"
                        onclick="
                            document.getElementById(
                                'training-delete-popup'
                            ).remove();

                            deleteTrainingScoreConfirmed(
                                '${scoreId}',
                                '${essaId}',
                                '${trickId}'
                            );
                        "
                    >
                        Delete
                    </button>

                </div>

            </div>

        </div>
    `;


    document.body.appendChild(
        popup
    );
}

function deleteTrainingScoreConfirmed(
    scoreId,
    essaId,
    trickId
) {

    const remainingScores =
        getSavedScores()
            .filter(
                function(score) {

                    return (
                        String(
                            score.id
                        ) !==
                        String(
                            scoreId
                        )
                    );

                }
            );


    saveScores(
        remainingScores
    );


    const stillExists =
        remainingScores.some(
            function(score) {

                return (

                    String(
                        score.essaId
                    ) ===
                    String(
                        essaId
                    )

                    &&

                    String(
                        score.trickId
                    ) ===
                    String(
                        trickId
                    )

                );

            }
        );


    if (stillExists) {

        showTrickProgress(
            essaId,
            trickId
        );

    } else {

        renderScoresTab();
    }
}



/* =========================================================
   ANXIETY SUPPORT — STORAGE
========================================================= */

function getSavedAnxietyDrawings() {

    const key =
        userStorageKey(
            "anxietyDrawings"
        );


    if (!key) {

        return [];
    }


    try {

        const saved =
            JSON.parse(
                localStorage.getItem(
                    key
                ) ||
                "[]"
            );


        return Array.isArray(
            saved
        )
            ? saved
            : [];

    } catch (error) {

        console.error(
            "Could not load anxiety drawings:",
            error
        );


        return [];
    }
}


function saveAnxietyDrawings(
    drawings
) {

    const key =
        userStorageKey(
            "anxietyDrawings"
        );


    if (!key) {

        return;
    }


    localStorage.setItem(
        key,
        JSON.stringify(
            drawings
        )
    );
}


/* =========================================================
   ANXIETY SUPPORT — MAIN PAGE
========================================================= */

function renderAnxietySupport() {

    applyUserTheme();


    document.querySelector(
        "main"
    ).innerHTML = `

        ${makeAppTabs(
            "Anxiety Support"
        )}


        <div
            style="
                max-width:1050px;
                margin:0 auto;
            "
        >


            <div
                style="
                    text-align:center;
                    margin-bottom:28px;
                "
            >

                <h1>
                    💚 Anxiety Support
                </h1>


                <p
                    style="
                        max-width:700px;
                        margin:0 auto;
                        color:#68777b;
                        line-height:1.6;
                    "
                >

                    A quiet place for grounding,
                    distraction, creativity,
                    and slowing down when
                    everything feels like a lot.

                </p>

            </div>


            <div
                style="
                    display:grid;
                    grid-template-columns:
                        repeat(
                            auto-fit,
                            minmax(
                                220px,
                                1fr
                            )
                        );
                    gap:18px;
                "
            >


                                ${makeAnxietySupportCard(
                    "👀",
                    "5-4-3-2-1 Grounding",
                    "Reconnect with what is around you.",
                    "showGroundingExercise()"
                )}


                ${makeAnxietySupportCard(
                    "🎨",
                    "Draw",
                    "Doodle, scribble, or draw whatever you want.",
                    "showAnxietyDrawingPad()"
                )}


                ${makeAnxietySupportCard(
                    "🖼️",
                    "My Drawings",
                    "Look back at drawings you saved.",
                    "showAnxietyDrawingGallery()"
                )}


                ${makeAnxietySupportCard(
                    "🧸",
                    "Watch ESSA Content",
                    "Relax and watch videos about emotional support stuffed animals.",
                    "window.open('https://www.youtube.com/results?search_query=emotional+support+stuffed+animal', '_blank')"
                )}


                ${makeAnxietySupportCard(
                    "🎥",
                    "Watch ESSA Training Videos",
                    "Watch ESSA training videos and spend some time learning with your ESSA.",
                    "window.open('https://www.youtube.com/playlist?list=PLemizXmM3UrU', '_blank')"
                )}


                ${makeAnxietySupportCard(
                    "💚",
                    "Watch ESSA Care Tips",
                    "Watch videos about caring for and bonding with your ESSA.",
                    "window.open('https://www.youtube.com/playlist?list=PLXU0FiWnm3rM', '_blank')"
                )}


                ${makeAnxietySupportCard(
                    "🌳",
                    "Watch ESSA Outing Videos",
                    "Watch ESSAs head out on adventures and outings.",
                    "window.open('https://www.youtube.com/playlist?list=PLd_LkzymW8Pc', '_blank')"
                )} 
                

            </div>


            <div
                style="
                    margin-top:30px;
                    padding:20px;
                    background:
                        rgba(
                            255,
                            255,
                            255,
                            .9
                        );
                    border:
                        1px solid
                        #dbe5e7;
                    border-radius:20px;
                    text-align:center;
                "
            >

                <h2
                    style="
                        margin-top:0;
                    "
                >
                    Need More Support?
                </h2>


                <p
                    style="
                        color:#68777b;
                        line-height:1.6;
                    "
                >

                    If you feel unsafe,
                    overwhelmed,
                    or need immediate help,
                    you can open the crisis
                    support information.

                </p>


                <button
    class="handler-action-button primary"
    onclick="
        showCrisisSupportModal()
    "
>
    I Need Help.
</button>

            </div>


        </div>

    `;
}


/* =========================================================
   ANXIETY SUPPORT CARD
========================================================= */

function makeAnxietySupportCard(
    icon,
    title,
    description,
    action
) {

    return `

        <button
            onclick="${action}"

            style="
                width:100%;
                min-height:190px;
                padding:22px;
                border:
                    1px solid
                    #dbe5e7;
                border-radius:22px;
                background:white;
                color:#26343b;
                cursor:pointer;
                text-align:center;
                box-shadow:
                    0 4px 14px
                    rgba(
                        0,
                        0,
                        0,
                        .05
                    );
            "
        >

            <div
                style="
                    font-size:45px;
                    margin-bottom:10px;
                "
            >
                ${icon}
            </div>


            <div
                style="
                    font-size:19px;
                    font-weight:bold;
                    margin-bottom:8px;
                "
            >
                ${escapeHTML(
                    title
                )}
            </div>


            <div
                style="
                    color:#68777b;
                    line-height:1.5;
                "
            >
                ${escapeHTML(
                    description
                )}
            </div>

        </button>

    `;
}


/* =========================================================
   BREATHING EXERCISE
========================================================= */

var breathingTimer =
    null;

var breathingStepIndex =
    0;


function showBreathingExercise() {

    stopBreathingExercise();


    document.querySelector(
        "main"
    ).innerHTML = `

        ${makeAppTabs(
            "Support"
        )}


        <div
            style="
                max-width:750px;
                margin:0 auto;
                text-align:center;
            "
        >


            <button
                onclick="
                    stopBreathingExercise();
                    renderAnxietySupport();
                "
            >
                ← Back
            </button>


            <h1>
                🌬️ Slow Breathing
            </h1>


            <p
                style="
                    color:#68777b;
                    line-height:1.6;
                "
            >

                Follow the circle.
                There is no need to breathe
                perfectly — just go at a pace
                that feels comfortable.

            </p>


            <div
                id="breathing-circle"

                style="
                    width:210px;
                    height:210px;
                    margin:
                        45px
                        auto
                        25px
                        auto;
                    border-radius:50%;
                    background:
                        rgba(
                            79,
                            181,
                            174,
                            .25
                        );
                    border:
                        4px solid
                        #4fb5ae;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    transition:
                        transform
                        4s ease,
                        background
                        .4s ease;
                    transform:scale(.72);
                "
            >

                <strong
                    id="breathing-instruction"

                    style="
                        font-size:25px;
                    "
                >
                    Ready?
                </strong>

            </div>


            <button
                id="breathing-start-button"

                onclick="
                    startBreathingExercise()
                "
            >
                Start
            </button>


            <button
                onclick="
                    stopBreathingExercise()
                "
            >
                Stop
            </button>


        </div>

    `;
}


/* =========================================================
   START BREATHING
========================================================= */

function startBreathingExercise() {

    stopBreathingExercise();


    breathingStepIndex =
        0;


    runNextBreathingStep();
}


/* =========================================================
   BREATHING STEPS
========================================================= */

function runNextBreathingStep() {

    const circle =
        document.getElementById(
            "breathing-circle"
        );


    const text =
        document.getElementById(
            "breathing-instruction"
        );


    if (
        !circle ||
        !text
    ) {

        stopBreathingExercise();

        return;
    }


    const steps = [

        {
            text:
                "Breathe in…",

            duration:
                4000,

            scale:
                1
        },

        {
            text:
                "Hold…",

            duration:
                2000,

            scale:
                1
        },

        {
            text:
                "Breathe out…",

            duration:
                6000,

            scale:
                .72
        },

        {
            text:
                "Rest…",

            duration:
                2000,

            scale:
                .72
        }

    ];


    const step =
        steps[
            breathingStepIndex
        ];


    text.textContent =
        step.text;


    circle.style.transform =
        `scale(${step.scale})`;


    breathingStepIndex =
        (
            breathingStepIndex +
            1
        ) %
        steps.length;


    breathingTimer =
        setTimeout(
            runNextBreathingStep,
            step.duration
        );
}


/* =========================================================
   STOP BREATHING
========================================================= */

function stopBreathingExercise() {

    if (
        breathingTimer
    ) {

        clearTimeout(
            breathingTimer
        );


        breathingTimer =
            null;
    }


    const text =
        document.getElementById(
            "breathing-instruction"
        );


    const circle =
        document.getElementById(
            "breathing-circle"
        );


    if (text) {

        text.textContent =
            "Ready?";
    }


    if (circle) {

        circle.style.transform =
            "scale(.72)";
    }
}


/* =========================================================
   5-4-3-2-1 GROUNDING
========================================================= */

function showGroundingExercise() {

    document.querySelector(
        "main"
    ).innerHTML = `

        ${makeAppTabs(
            "Anxiety Support"
        )}


        <div
            style="
                max-width:800px;
                margin:0 auto;
            "
        >


            <button
            class="handler-action-button"

                onclick="
                    renderAnxietySupport()
                "
            >
                ← Back
            </button>


            <h1>
                👀 5-4-3-2-1 Grounding
            </h1>


            <p
                style="
                    color:#68777b;
                    line-height:1.6;
                "
            >

                Take your time.
                You can type your answers,
                say them out loud,
                or simply notice them.

            </p>


            ${makeGroundingPrompt(
                "5",
                "things you can see",
                "👀"
            )}


            ${makeGroundingPrompt(
                "4",
                "things you can touch or feel",
                "✋"
            )}


            ${makeGroundingPrompt(
                "3",
                "things you can hear",
                "👂"
            )}


            ${makeGroundingPrompt(
                "2",
                "things you can smell",
                "👃"
            )}


            ${makeGroundingPrompt(
                "1",
                "thing you can taste or would like to taste",
                "👅"
            )}
        
            <div
    style="
        margin-top:18px;
        padding:12px 16px;
        border-radius:12px;
        background:white;
        border:1px solid var(--user-theme-color, #4fb5ae);
        color:#68777b;
        font-size:14px;
        text-align:center;
    "
>
    🔒 Hey, your entries do not save to the app. But when you hit done you can screenshot!
</div>

            <button
            class="handler-action-button primary"

                onclick="
                    showGroundingResults()
                "

                style="
                    margin-top:20px;
                "
            >
                Done 💚
            </button>


        </div>

    `;
}

function showGroundingResults() {

    const answers =
        Array.from(
            document.querySelectorAll(
                ".grounding-answer"
            )
        );


    const date =
        new Date();


    const dateText =
        date.toLocaleDateString(
            undefined,
            {
                year: "numeric",
                month: "long",
                day: "numeric"
            }
        );


    const timeText =
        date.toLocaleTimeString(
            undefined,
            {
                hour: "numeric",
                minute: "2-digit"
            }
        );


    let entriesHTML = "";


    answers.forEach(
        function(answer) {

            const value =
                answer.value.trim();

            const number =
                answer.dataset.groundingNumber;

            const text =
                answer.dataset.groundingText;

            const icon =
                answer.dataset.groundingIcon;


            entriesHTML += `

                <div class="grounding-result-entry">

                    <strong>
                        ${icon}
                        ${number}
                        ${escapeHTML(text)}
                    </strong>

                    <p>
                        ${
                            value
                                ? escapeHTML(value)
                                : "—"
                        }
                    </p>

                </div>
            `;
        }
    );


    const oldPopup =
        document.getElementById(
            "grounding-results-popup"
        );


    if (oldPopup) {
        oldPopup.remove();
    }


    const popup =
        document.createElement(
            "div"
        );


    popup.id =
        "grounding-results-popup";


    popup.innerHTML = `

        <div class="grounding-results-overlay">

            <div class="grounding-results-card">

                <div class="grounding-results-brand">

    <img
        src="MooCow.Icon.jpg"
        alt="MooCow"
        class="grounding-results-logo"
    >

    <strong>ESSAzLife</strong>

</div>


                <div class="grounding-results-date">
                    ${dateText} • ${timeText}
                </div>


                <h2>
                    5-4-3-2-1 Grounding
                </h2>


                <p class="grounding-results-message">
                    I hope the exercise helped you.
                    Screenshot your entries for later!
                </p>


                <div class="grounding-results-entries">

                    ${entriesHTML}

                </div>


                <button
                    class="handler-action-button primary"
                    onclick="
                        document.getElementById(
                            'grounding-results-popup'
                        ).remove();

                        renderAnxietySupport();
                    "
                >
                    Close
                </button>

            </div>

        </div>
    `;


    document.body.appendChild(
        popup
    );
}


/* =========================================================
   GROUNDING PROMPT
========================================================= */

function makeGroundingPrompt(
    number,
    text,
    icon
) {

    return `

        <div
            style="
                padding:18px;
                margin-bottom:14px;
                background:white;
                border:
                    1px solid
                    #dbe5e7;
                border-radius:18px;
            "
        >

            <strong
                style="
                    font-size:18px;
                "
            >

                ${icon}
                ${number}
                ${escapeHTML(
                    text
                )}

            </strong>


            <textarea
    class="grounding-answer"

     data-grounding-number="${number}"
    data-grounding-text="${escapeHTML(text)}"
    data-grounding-icon="${icon}"


    placeholder="You can type here if you want..."
></textarea>

        </div>

    `;
}


/* =========================================================
   COMFORT IDEAS
========================================================= */

function showComfortIdeas() {

    const ideas = [

        "Wrap up in a favorite blanket.",

        "Hold or sit with an ESSA or plush.",

        "Take a few sips of water.",

        "Put on a familiar show or video.",

        "Listen to a song that feels safe or familiar.",

        "Dim the lights for a few minutes.",

        "Sit somewhere quieter.",

        "Stretch your shoulders and unclench your jaw.",

        "Step outside or look out a window.",

        "Name five things in the room that are your favorite color.",

        "Play a simple game for a few minutes.",

        "Write down what your brain keeps repeating.",

        "Wash your face with cool or comfortably warm water.",

        "Do something repetitive with your hands.",

        "Give yourself permission to do absolutely nothing for five minutes."

    ];


    const randomIdea =
        ideas[
            Math.floor(
                Math.random() *
                ideas.length
            )
        ];


    document.querySelector(
        "main"
    ).innerHTML = `

        ${makeAppTabs(
            "Support"
        )}


        <div
            style="
                max-width:750px;
                margin:0 auto;
                text-align:center;
            "
        >


            <button
                onclick="
                    renderAnxietySupport()
                "

                style="
                    float:left;
                "
            >
                ← Back
            </button>


            <div
                style="
                    clear:both;
                "
            ></div>


            <h1>
                🧸 Comfort Idea
            </h1>


            <div
                id="comfort-idea"

                style="
                    margin:
                        35px
                        auto;
                    padding:35px;
                    background:white;
                    border:
                        1px solid
                        #dbe5e7;
                    border-radius:24px;
                    font-size:22px;
                    line-height:1.6;
                    box-shadow:
                        0 5px 18px
                        rgba(
                            0,
                            0,
                            0,
                            .06
                        );
                "
            >

                ${escapeHTML(
                    randomIdea
                )}

            </div>


            <button
                onclick="
                    showAnotherComfortIdea()
                "
            >
                Give Me Another
            </button>


        </div>

    `;
}


/* =========================================================
   ANOTHER COMFORT IDEA
========================================================= */

function showAnotherComfortIdea() {

    const ideas = [

        "Wrap up in a favorite blanket.",

        "Hold or sit with an ESSA or plush.",

        "Take a few sips of water.",

        "Put on a familiar show or video.",

        "Listen to something familiar.",

        "Dim the lights for a little while.",

        "Move somewhere quieter.",

        "Relax your shoulders and hands.",

        "Look outside and find something moving.",

        "Find five objects that are the same color.",

        "Play a calm game.",

        "Doodle without trying to make anything specific.",

        "Wash your hands or face.",

        "Organize something tiny, like five objects.",

        "Rest for five minutes without needing to accomplish anything."

    ];


    const box =
        document.getElementById(
            "comfort-idea"
        );


    if (!box) {

        return;
    }


    const idea =
        ideas[
            Math.floor(
                Math.random() *
                ideas.length
            )
        ];


    box.textContent =
        idea;
}


/* =========================================================
   THOUGHT RESET
========================================================= */

function showThoughtReset() {

    document.querySelector(
        "main"
    ).innerHTML = `

        ${makeAppTabs(
            "Support"
        )}


        <div
            style="
                max-width:800px;
                margin:0 auto;
            "
        >


            <button
                onclick="
                    renderAnxietySupport()
                "
            >
                ← Back
            </button>


            <h1>
                🧠 Thought Reset
            </h1>


            <p
                style="
                    color:#68777b;
                    line-height:1.6;
                "
            >

                You do not have to convince yourself
                everything is perfect.
                This is just a place to slow the thought
                down and look at it one piece at a time.

            </p>


            <label>
                What thought is bothering you?
            </label>


            <textarea
                id="thought-reset-thought"

                style="
                    min-height:110px;
                "
            ></textarea>


            <label>
                What do you know for certain right now?
            </label>


            <textarea
                id="thought-reset-facts"

                style="
                    min-height:100px;
                "
            ></textarea>


            <label>
                Is there another possible explanation?
            </label>


            <textarea
                id="thought-reset-alternative"

                style="
                    min-height:100px;
                "
            ></textarea>


            <label>
                What would help you feel a little safer or calmer right now?
            </label>


            <textarea
                id="thought-reset-help"

                style="
                    min-height:100px;
                "
            ></textarea>


            <button
                onclick="
                    clearThoughtReset()
                "

                style="
                    margin-top:20px;
                "
            >
                Clear
            </button>


        </div>

    `;
}


/* =========================================================
   CLEAR THOUGHT RESET
========================================================= */

function clearThoughtReset() {

    [
        "thought-reset-thought",
        "thought-reset-facts",
        "thought-reset-alternative",
        "thought-reset-help"
    ]
        .forEach(
            function(id) {

                const field =
                    document.getElementById(
                        id
                    );


                if (field) {

                    field.value =
                        "";
                }

            }
        );
}


/* =========================================================
   ANXIETY DRAWING PAD
========================================================= */

var anxietyDrawingCanvas =
    null;

var anxietyDrawingContext =
    null;

var anxietyDrawingActive =
    false;

var anxietyDrawingLastX =
    0;

var anxietyDrawingLastY =
    0;

var anxietyDrawingColor =
    "#26343b";

var anxietyDrawingWidth =
    5;

var anxietyDrawingTool =
    "brush";

var anxietyColorPickTimer =
    null;

var anxietyColorPickStartX =
    0;

var anxietyColorPickStartY =
    0;

var anxietyDrawingUndoHistory =
    [];

/* =========================================================
   SHOW DRAWING PAD
========================================================= */

function showAnxietyDrawingPad() {

    document.querySelector(
        "main"
    ).innerHTML = `

        ${makeAppTabs(
            "Anxiety Support"
        )}


        <div
            style="
                max-width:950px;
                margin:0 auto;
            "
        >


            <button
            class="handler-action-button"

                onclick="
                    renderAnxietySupport()
                "
            >
                ← Back
            </button>


            <h1>
                🎨 Drawing Pad
            </h1>


            <p
                style="
                    color:#68777b;
                "
            >

                Scribble, doodle,
                color, write,
                or make complete nonsense.
                It all counts.

            </p>


            <div
                style="
                    display:flex;
                    gap:10px;
                    flex-wrap:wrap;
                    align-items:center;
                    margin-bottom:15px;
                "
            >

                <div
    class="drawing-tool-buttons"
>
    <button
        id="drawing-tool-brush"
        class="handler-action-button primary"
        onclick="
            setAnxietyDrawingTool(
                'brush'
            )
        "
    >
        🖌️ Brush
    </button>

    <button
        id="drawing-tool-eraser"
        class="handler-action-button"
        onclick="
            setAnxietyDrawingTool(
                'eraser'
            )
        "
    >
        Eraser
    </button>

    <button
        id="drawing-tool-bucket"
        class="handler-action-button"
        onclick="
            setAnxietyDrawingTool(
                'bucket'
            )
        "
    >
        🪣 Bucket
    </button>
</div>

                <label
                    style="
                        margin:0;
                    "
                >
                    Color
                </label>


                <input
                    id="anxiety-drawing-color"

                    type="color"

                    value="#26343b"

                    oninput="
                        setAnxietyDrawingColor(
                            this.value
                        )
                    "

                    style="
                        width:55px;
                        height:42px;
                        padding:2px;
                    "
                >


                <label
                    style="
                        margin:0 0 0 10px;
                    "
                >
                    Brush
                </label>


                <input
                    id="anxiety-drawing-width"

                    type="range"

                    min="1"

                    max="30"

                    value="5"

                    oninput="
                        setAnxietyDrawingWidth(
                            this.value
                        )
                    "
                >

                <button
    type="button"
    class="handler-action-button"
    onclick="
        undoAnxietyDrawing()
    "
>
    ↩️ Undo
</button>

                <button
                class="handler-action-button"

                    onclick="
                        clearAnxietyDrawing()
                    "
                >
                    Clear
                </button>


                <button
                 class="handler-action-button primary"
                 
                    onclick="
                        saveCurrentAnxietyDrawing()
                    "
                >
                    Save Drawing
                </button>


            </div>


            <div
                style="
                    width:100%;
                    overflow:hidden;
                    background:white;
                    border:
                        1px solid
                        #dbe5e7;
                    border-radius:20px;
                    touch-action:none;
                "
            >

                <canvas
                    id="anxiety-drawing-canvas"

                    width="900"

                    height="550"

                    style="
                        display:block;
                        width:100%;
                        height:auto;
                        cursor:crosshair;
                        touch-action:none;
                    "
                ></canvas>

            </div>


        </div>

    `;


    setupAnxietyDrawingCanvas();
}


/* =========================================================
   SETUP DRAWING CANVAS
========================================================= */

function setupAnxietyDrawingCanvas() {

    anxietyDrawingCanvas =
        document.getElementById(
            "anxiety-drawing-canvas"
        );


    if (
        !anxietyDrawingCanvas
    ) {

        return;
    }


    anxietyDrawingContext =
        anxietyDrawingCanvas
            .getContext(
                "2d"
            );


    anxietyDrawingContext.fillStyle =
        "#ffffff";


    anxietyDrawingContext.fillRect(
        0,
        0,
        anxietyDrawingCanvas.width,
        anxietyDrawingCanvas.height
    );


    anxietyDrawingContext.lineCap =
        "round";


    anxietyDrawingContext.lineJoin =
        "round";


    anxietyDrawingCanvas
        .addEventListener(
            "pointerdown",
            startAnxietyDrawing
        );


    anxietyDrawingCanvas
        .addEventListener(
            "pointermove",
            moveAnxietyDrawing
        );


    anxietyDrawingCanvas
        .addEventListener(
            "pointerup",
            stopAnxietyDrawing
        );


    anxietyDrawingCanvas
        .addEventListener(
            "pointerleave",
            stopAnxietyDrawing
        );


    anxietyDrawingCanvas
        .addEventListener(
            "pointercancel",
            stopAnxietyDrawing
        );
}


/* =========================================================
   DRAWING COORDINATES
========================================================= */

function getAnxietyCanvasPoint(
    event
) {

    const rect =
        anxietyDrawingCanvas
            .getBoundingClientRect();


    const scaleX =
        anxietyDrawingCanvas.width /
        rect.width;


    const scaleY =
        anxietyDrawingCanvas.height /
        rect.height;


    return {

        x:
            (
                event.clientX -
                rect.left
            ) *
            scaleX,

        y:
            (
                event.clientY -
                rect.top
            ) *
            scaleY

    };
}


/* =========================================================
   START DRAWING
========================================================= */

function startAnxietyDrawing(
    event
) {

    if (
        !anxietyDrawingCanvas ||
        !anxietyDrawingContext
    ) {

        return;
    }


    event.preventDefault();

    saveAnxietyDrawingUndoState();

    const point =
        getAnxietyCanvasPoint(
            event
        );

    const originalPixel =
    anxietyDrawingContext.getImageData(
        Math.floor(
            point.x
        ),
        Math.floor(
            point.y
        ),
        1,
        1
    ).data;


    if (
    anxietyDrawingTool ===
    "bucket"
) {

    fillAnxietyDrawingArea(
        Math.floor(
            point.x
        ),
        Math.floor(
            point.y
        ),
        anxietyDrawingColor
    );

    return;
}

anxietyColorPickStartX =
    point.x;

anxietyColorPickStartY =
    point.y;


clearTimeout(
    anxietyColorPickTimer
);


anxietyColorPickTimer =
    setTimeout(
        function() {

            pickAnxietyDrawingColorFromPixel(
    originalPixel
);

        },
        650
    );

    anxietyDrawingActive =
        true;


    anxietyDrawingLastX =
        point.x;


    anxietyDrawingLastY =
        point.y;


    try {

        anxietyDrawingCanvas
            .setPointerCapture(
                event.pointerId
            );

    } catch (error) {

        /* Not all browsers require this. */
    }
}


/* =========================================================
   MOVE DRAWING
========================================================= */

function moveAnxietyDrawing(
    event
) {

    if (
        !anxietyDrawingActive ||
        !anxietyDrawingContext
    ) {

        return;
    }


    event.preventDefault();


    const point =
        getAnxietyCanvasPoint(
            event
        );
    const movedDistance =
    Math.hypot(
        point.x -
        anxietyColorPickStartX,

        point.y -
        anxietyColorPickStartY
    );


if (
    movedDistance > 20
) {

    clearTimeout(
        anxietyColorPickTimer
    );

    anxietyColorPickTimer =
        null;
}


    if (
    anxietyDrawingTool ===
    "eraser"
) {

    anxietyDrawingContext.strokeStyle =
        "#ffffff";

} else {

    anxietyDrawingContext.strokeStyle =
        anxietyDrawingColor;
}


    anxietyDrawingContext.lineWidth =
        anxietyDrawingWidth;


    anxietyDrawingContext.beginPath();


    anxietyDrawingContext.moveTo(
        anxietyDrawingLastX,
        anxietyDrawingLastY
    );


    anxietyDrawingContext.lineTo(
        point.x,
        point.y
    );


    anxietyDrawingContext.stroke();


    anxietyDrawingLastX =
        point.x;


    anxietyDrawingLastY =
        point.y;
}


/* =========================================================
   STOP DRAWING
========================================================= */

function stopAnxietyDrawing() {

    anxietyDrawingActive =
        false;


    clearTimeout(
        anxietyColorPickTimer
    );

    anxietyColorPickTimer =
        null;
}

/* =========================================================
   DRAWING COLOR
========================================================= */

function setAnxietyDrawingColor(
    color
) {

    anxietyDrawingColor =
        color ||
        "#26343b";
}

/* =========================================================
   DRAWING TOOL
========================================================= */

function setAnxietyDrawingTool(
    tool
) {

    anxietyDrawingTool =
        tool;


    const brushButton =
        document.getElementById(
            "drawing-tool-brush"
        );

    const eraserButton =
        document.getElementById(
            "drawing-tool-eraser"
        );

    const bucketButton =
        document.getElementById(
            "drawing-tool-bucket"
        );


    [
        brushButton,
        eraserButton,
        bucketButton
    ].forEach(
        function(button) {

            if (!button) {
                return;
            }

            button.classList.remove(
                "primary"
            );
        }
    );


    const activeButton =
        document.getElementById(
            "drawing-tool-" + tool
        );


    if (activeButton) {

        activeButton.classList.add(
            "primary"
        );
    }
}
/* =========================================================
   BUCKET FILL
========================================================= */

function fillAnxietyDrawingArea(
    startX,
    startY,
    fillColor
) {

    if (
        !anxietyDrawingCanvas ||
        !anxietyDrawingContext
    ) {
        return;
    }


    const width =
        anxietyDrawingCanvas.width;

    const height =
        anxietyDrawingCanvas.height;


    if (
        startX < 0 ||
        startY < 0 ||
        startX >= width ||
        startY >= height
    ) {
        return;
    }


    const imageData =
        anxietyDrawingContext.getImageData(
            0,
            0,
            width,
            height
        );

    const data =
        imageData.data;


    const startIndex =
        (
            startY * width +
            startX
        ) * 4;


    const targetColor = [
        data[startIndex],
        data[startIndex + 1],
        data[startIndex + 2],
        data[startIndex + 3]
    ];


    const hex =
        fillColor.replace(
            "#",
            ""
        );


    const newColor = [
        parseInt(
            hex.substring(0, 2),
            16
        ),

        parseInt(
            hex.substring(2, 4),
            16
        ),

        parseInt(
            hex.substring(4, 6),
            16
        ),

        255
    ];


    if (
        targetColor[0] === newColor[0] &&
        targetColor[1] === newColor[1] &&
        targetColor[2] === newColor[2] &&
        targetColor[3] === newColor[3]
    ) {
        return;
    }


    function matchesTarget(
        x,
        y
    ) {

        const index =
            (
                y * width +
                x
            ) * 4;


        return (
            data[index] === targetColor[0] &&
            data[index + 1] === targetColor[1] &&
            data[index + 2] === targetColor[2] &&
            data[index + 3] === targetColor[3]
        );
    }


    function colorPixel(
        x,
        y
    ) {

        const index =
            (
                y * width +
                x
            ) * 4;


        data[index] =
            newColor[0];

        data[index + 1] =
            newColor[1];

        data[index + 2] =
            newColor[2];

        data[index + 3] =
            newColor[3];
    }


    const stack = [
        [
            startX,
            startY
        ]
    ];


    while (
        stack.length > 0
    ) {

        const point =
            stack.pop();

        const x =
            point[0];

        const y =
            point[1];


        if (
            x < 0 ||
            y < 0 ||
            x >= width ||
            y >= height
        ) {
            continue;
        }


        if (
            !matchesTarget(
                x,
                y
            )
        ) {
            continue;
        }


        colorPixel(
            x,
            y
        );


        stack.push(
            [x + 1, y],
            [x - 1, y],
            [x, y + 1],
            [x, y - 1]
        );
    }


    anxietyDrawingContext.putImageData(
        imageData,
        0,
        0
    );
}

/* =========================================================
   PICK COLOR FROM DRAWING
========================================================= */

function pickAnxietyDrawingColor(
    x,
    y
) {

    if (
        !anxietyDrawingCanvas ||
        !anxietyDrawingContext
    ) {
        return;
    }


    const pixel =
        anxietyDrawingContext.getImageData(
            Math.floor(x),
            Math.floor(y),
            1,
            1
        ).data;


    const red =
        pixel[0]
            .toString(16)
            .padStart(2, "0");

    const green =
        pixel[1]
            .toString(16)
            .padStart(2, "0");

    const blue =
        pixel[2]
            .toString(16)
            .padStart(2, "0");


    anxietyDrawingColor =
        "#" +
        red +
        green +
        blue;


    const colorInput =
        document.getElementById(
            "anxiety-drawing-color"
        );


    if (
        colorInput
    ) {

        colorInput.value =
            anxietyDrawingColor;
    }


    anxietyDrawingActive =
        false;

    anxietyColorPickTimer =
        null;
}

/* =========================================================
   PICK COLOR FROM SAVED PIXEL
========================================================= */

function pickAnxietyDrawingColorFromPixel(
    pixel
) {

    const red =
        pixel[0]
            .toString(16)
            .padStart(2, "0");

    const green =
        pixel[1]
            .toString(16)
            .padStart(2, "0");

    const blue =
        pixel[2]
            .toString(16)
            .padStart(2, "0");


    anxietyDrawingColor =
        "#" +
        red +
        green +
        blue;


    const colorInput =
        document.getElementById(
            "anxiety-drawing-color"
        );


    if (
        colorInput
    ) {

        colorInput.value =
            anxietyDrawingColor;
    }


    anxietyDrawingActive =
        false;

    anxietyColorPickTimer =
        null;
}

/* =========================================================
   SAVE DRAWING UNDO STATE
========================================================= */

function saveAnxietyDrawingUndoState() {

    if (
        !anxietyDrawingCanvas ||
        !anxietyDrawingContext
    ) {
        return;
    }


    const snapshot =
        anxietyDrawingContext.getImageData(
            0,
            0,
            anxietyDrawingCanvas.width,
            anxietyDrawingCanvas.height
        );


    anxietyDrawingUndoHistory.push(
        snapshot
    );


    if (
        anxietyDrawingUndoHistory.length > 20
    ) {

        anxietyDrawingUndoHistory.shift();
    }
}

/* =========================================================
   UNDO DRAWING
========================================================= */

function undoAnxietyDrawing() {

    if (
        !anxietyDrawingContext ||
        anxietyDrawingUndoHistory.length === 0
    ) {
        return;
    }


    const previousState =
        anxietyDrawingUndoHistory.pop();


    anxietyDrawingContext.putImageData(
        previousState,
        0,
        0
    );
}

/* =========================================================
   DRAWING WIDTH
========================================================= */

function setAnxietyDrawingWidth(
    width
) {

    anxietyDrawingWidth =
        Math.max(
            1,
            Number(
                width
            ) || 5
        );
}


/* =========================================================
   CLEAR DRAWING
========================================================= */
function clearAnxietyDrawing() {

    const oldPopup =
        document.getElementById(
            "drawing-clear-popup"
        );

    if (oldPopup) {
        oldPopup.remove();
    }


    const popup =
        document.createElement(
            "div"
        );

    popup.id =
        "drawing-clear-popup";


    popup.innerHTML = `

        <div class="training-delete-overlay">

            <div class="training-delete-box">

                <h2>
                    Clear Drawing?
                </h2>

                <p>
                    Are you sure you want to clear
                    this drawing?
                </p>

                <div class="training-delete-buttons">

                    <button
                        class="handler-action-button"
                        onclick="
                            document.getElementById(
                                'drawing-clear-popup'
                            ).remove()
                        "
                    >
                        Cancel
                    </button>

                    <button
                        class="handler-action-button danger"
                        onclick="
                            document.getElementById(
                                'drawing-clear-popup'
                            ).remove();

                            clearAnxietyDrawingConfirmed();
                        "
                    >
                        Clear
                    </button>

                </div>

            </div>

        </div>
    `;


    document.body.appendChild(
        popup
    );
}

function clearAnxietyDrawingConfirmed() { 

    if (
        !anxietyDrawingCanvas ||
        !anxietyDrawingContext
    ) {

        return;
    }


    anxietyDrawingContext.fillStyle =
        "#ffffff";


    anxietyDrawingContext.fillRect(
        0,
        0,
        anxietyDrawingCanvas.width,
        anxietyDrawingCanvas.height
    );
}


/* =========================================================
   SAVE DRAWING
========================================================= */

function saveCurrentAnxietyDrawing() {

    if (
        !anxietyDrawingCanvas
    ) {

        return;
    }


    const drawings =
        getSavedAnxietyDrawings();


    const image =
        anxietyDrawingCanvas
            .toDataURL(
                "image/jpeg",
                .72
            );


    drawings.unshift(
        {

            id:
                makeId(
                    "drawing"
                ),

            image:
                image,

            createdAt:
                new Date()
                    .toISOString()

        }
    );


    try {

        saveAnxietyDrawings(
            drawings
        );


        showDrawingSavedPopup();

    } catch (error) {

        console.error(
            error
        );


        alert(
            "That drawing could not be saved. Browser storage may be full."
        );
    }
}

function showDrawingSavedPopup() {

    const oldPopup =
        document.getElementById(
            "drawing-saved-popup"
        );

    if (oldPopup) {
        oldPopup.remove();
    }


    const popup =
        document.createElement(
            "div"
        );

    popup.id =
        "drawing-saved-popup";


    popup.innerHTML = `

        <div class="training-delete-overlay">

            <div class="training-delete-box">

                <h2>
                    🎨 Drawing Saved!
                </h2>

                <p>
                    Your drawing has been saved
                    to your Gallery.
                </p>

                <div class="training-delete-buttons">

                    <button
                        class="handler-action-button primary"
                        onclick="
                            document.getElementById(
                                'drawing-saved-popup'
                            ).remove()
                        "
                    >
                        Got It!
                    </button>

                </div>

            </div>

        </div>
    `;


    document.body.appendChild(
        popup
    );
}


/* =========================================================
   DRAWING GALLERY
========================================================= */

function showAnxietyDrawingGallery() {

    const drawings =
        getSavedAnxietyDrawings();


    let cards =
        "";


    drawings.forEach(
        function(drawing) {

            cards += `

                <div
                    style="
                        background:white;
                        border:
                            1px solid
                            #dbe5e7;
                        border-radius:18px;
                        padding:12px;
                    "
                >


                    <img
                        src="${drawing.image}"

                        alt="Saved drawing"

                        style="
                            width:100%;
                            aspect-ratio:
                                16 / 10;
                            object-fit:contain;
                            background:white;
                            border-radius:12px;
                        "
                    >


                    <p
                        style="
                            color:#68777b;
                            font-size:13px;
                        "
                    >

                        ${formatDateTime(
                            drawing.createdAt
                        )}

                    </p>


                    <div
    style="
        display:flex;
        gap:10px;
        flex-wrap:wrap;
    "
>

    <button
        class="handler-action-button danger"
        onclick="
            deleteAnxietyDrawing(
                '${drawing.id}'
            )
        "
    >
        Delete
    </button>

    <button
        class="handler-action-button"
        onclick="
            downloadAnxietyDrawing(
                '${drawing.id}'
            )
        "
    >
        ⬇️ Download
    </button>

</div>


                </div>

            `;

        }
    );


    if (!cards) {

        cards = `

            <div
                style="
                    padding:25px;
                    background:white;
                    border:
                        1px dashed
                        #b9d6d3;
                    border-radius:18px;
                "
            >
                No saved drawings yet.
            </div>

        `;
    }


    document.querySelector(
        "main"
    ).innerHTML = `

        ${makeAppTabs(
            "Anxiety Support"
        )}


        <div
            style="
                max-width:1000px;
                margin:0 auto;
            "
        >


            <button
    class="handler-action-button"
    onclick="
        renderAnxietySupport()
    "
>
    ← Back
</button>


            <h1>
                🖼️ My Drawings
            </h1>


            <button
    class="handler-action-button primary"
    onclick="
        showAnxietyDrawingPad()
    "
>
    + New Drawing
</button>


            <div
                style="
                    display:grid;
                    grid-template-columns:
                        repeat(
                            auto-fit,
                            minmax(
                                250px,
                                1fr
                            )
                        );
                    gap:18px;
                    margin-top:22px;
                "
            >

                ${cards}

            </div>


        </div>

    `;
}

/* =========================================================
   DOWNLOAD DRAWING
========================================================= */

function downloadAnxietyDrawing(
    drawingId
) {

    const drawings =
        getSavedAnxietyDrawings();


    const drawing =
        drawings.find(
            function(item) {

                return (
                    item.id ===
                    drawingId
                );
            }
        );


    if (
        !drawing ||
        !drawing.image
    ) {
        return;
    }


    const link =
        document.createElement(
            "a"
        );


    link.href =
        drawing.image;


    link.download =
        "ESSAzLife-Drawing-" +
        drawing.id +
        ".jpg";


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();
}

/* =========================================================
   DELETE DRAWING POPUP
========================================================= */

function deleteAnxietyDrawing(
    drawingId
) {

    const oldPopup =
        document.getElementById(
            "drawing-delete-popup"
        );


    if (oldPopup) {
        oldPopup.remove();
    }


    const popup =
        document.createElement(
            "div"
        );


    popup.id =
        "drawing-delete-popup";


    popup.innerHTML = `

        <div class="training-delete-overlay">

            <div class="training-delete-box">

                <h2>
                    Delete Drawing?
                </h2>

                <p>
                    Are you sure you want to delete
                    this drawing? This cannot be undone.
                </p>


                <div class="training-delete-buttons">

                    <button
                        class="handler-action-button"
                        onclick="
                            document.getElementById(
                                'drawing-delete-popup'
                            ).remove()
                        "
                    >
                        Cancel
                    </button>


                    <button
                        class="handler-action-button danger"
                        onclick="
                            document.getElementById(
                                'drawing-delete-popup'
                            ).remove();

                            deleteAnxietyDrawingConfirmed(
                                '${drawingId}'
                            )
                        "
                    >
                        Delete
                    </button>

                </div>

            </div>

        </div>
    `;


    document.body.appendChild(
        popup
    );
}

/* =========================================================
   DELETE DRAWING
========================================================= */

function deleteAnxietyDrawingConfirmed(
    drawingId
) { 


    const drawings =
        getSavedAnxietyDrawings()
            .filter(
                function(drawing) {

                    return (
                        String(
                            drawing.id
                        ) !==
                        String(
                            drawingId
                        )
                    );

                }
            );


    saveAnxietyDrawings(
        drawings
    );


    showAnxietyDrawingGallery();
}


/* =========================================================
   CRISIS SUPPORT MODAL
========================================================= */

function showCrisisSupportModal() {

    const oldModal =
        document.getElementById(
            "crisis-support-modal"
        );


    if (oldModal) {

        oldModal.remove();
    }


    const modal =
        document.createElement(
            "div"
        );


    modal.id =
        "crisis-support-modal";


    modal.innerHTML = `

        <div
            style="
                position:fixed;
                inset:0;
                z-index:9999;
                background:
                    rgba(
                        0,
                        0,
                        0,
                        .55
                    );
                display:flex;
                align-items:center;
                justify-content:center;
                padding:20px;
                box-sizing:border-box;
            "

            onclick="
                if (
                    event.target ===
                    this
                ) {
                    closeCrisisSupportModal();
                }
            "
        >


            <div
                style="
                    width:min(
                        100%,
                        620px
                    );
                    max-height:90vh;
                    overflow:auto;
                    padding:25px;
                    background:white;
                    border-radius:24px;
                    box-shadow:
                        0 10px 35px
                        rgba(
                            0,
                            0,
                            0,
                            .3
                        );
                "
            >


                <h2
                    style="
                        margin-top:0;
                    "
                >
                                    <h2>
                    💚 Crisis Support
                </h2>


            


<p
    style="
        line-height:1.6;
    "
>
    I'm sorry you're feeling this way.
    I'm mighty proud of you for recognizing
    when things are getting to be too much.
    Please remember that there are people
    who love and care about you.
    <strong>— Raising Floofz</strong>
</p>


<p
    style="
        line-height:1.6;
    "
>
    If you or someone else is in immediate
    danger, contact local emergency services.
</p>


                <p
                    style="
                        line-height:1.6;
                    "
                >

                    In the United States,
                    you can call or text
                    <strong>988</strong>
                    to reach the
                    Suicide & Crisis Lifeline.

                </p>


                <p
                    style="
                        line-height:1.6;
                    "
                >

                    You can also use
                    <strong>Crisis Text Line</strong>
                    by texting
                    <strong>HOME</strong>
                    to
                    <strong>741741</strong>.

                </p>


                <a
                    href="https://www.crisistextline.org/"
                    target="_blank"
                    rel="noopener noreferrer"

                    style="
                        display:inline-block;
                        margin:8px 10px 8px 0;
                        padding:10px 16px;
                        border-radius:10px;
                        background:var(--user-theme-color, #4fb5ae);
                        color:white;
                        text-decoration:none;
                        font-weight:bold;
                    "
                >
                    Open Crisis Text Line
                </a>


                <button
    class="handler-action-button"
    onclick="
        closeCrisisSupportModal()
    "
>
    Close
</button>


            </div>


        </div>

    `;


    document.body.appendChild(
        modal
    );
}


/* =========================================================
   CLOSE CRISIS MODAL
========================================================= */

function closeCrisisSupportModal() {

    const modal =
        document.getElementById(
            "crisis-support-modal"
        );


    if (modal) {

        modal.remove();
    }
}


/* =========================================================
   DIARY — STORAGE
========================================================= */

function getSavedDiaryEntries() {

    const key =
        userStorageKey(
            "diary"
        );


    if (!key) {

        return [];
    }


    try {

        const saved =
            JSON.parse(
                localStorage.getItem(
                    key
                ) ||
                "[]"
            );


        return Array.isArray(
            saved
        )
            ? saved
            : [];

    } catch (error) {

        console.error(
            "Could not load diary:",
            error
        );


        return [];
    }
}


function saveDiaryEntries(
    entries
) {

    const key =
        userStorageKey(
            "diary"
        );


    if (!key) {

        return;
    }


    localStorage.setItem(
        key,
        JSON.stringify(
            entries
        )
    );
}


/* =========================================================
   DIARY — MAIN PAGE
========================================================= */

function renderDiary() {

    applyUserTheme();

    const entries =
        getSavedDiaryEntries()
            .slice()
            .sort(
                function(a, b) {

                    return (
                        new Date(
                            b.createdAt
                        ) -
                        new Date(
                            a.createdAt
                        )
                    );

                }
            );


    let cards =
        "";


    entries.forEach(
        function(entry) {

            cards += `

                <button
                    onclick="
                        showDiaryEntry(
                            '${entry.id}'
                        )
                    "

                    style="
                        width:100%;
                        padding:18px;
                        background:white;
                        border:
                            1px solid
                            #dbe5e7;
                        border-radius:18px;
                        text-align:left;
                        cursor:pointer;
                        color:#26343b;
                    "
                >


                    <div
                        style="
                            display:flex;
                            justify-content:
                                space-between;
                            gap:15px;
                            align-items:flex-start;
                        "
                    >


                        <div>

                            <div
                                style="
                                    font-size:20px;
                                    font-weight:bold;
                                "
                            >

                                ${entry.mood || "📝"}

                                ${escapeHTML(
                                    entry.title ||
                                    "Untitled Entry"
                                )}

                            </div>


                            <div
                                style="
                                    margin-top:6px;
                                    color:#68777b;
                                    font-size:13px;
                                "
                            >

                                ${formatDateTime(
                                    entry.createdAt
                                )}

                            </div>

                        </div>


                        ${
                            Array.isArray(
                                entry.images
                            ) &&
                            entry.images.length >
                                0

                                ? `
                                    <span>
                                        📷
                                        ${entry.images.length}
                                    </span>
                                `

                                : ""
                        }


                    </div>


                    <p
                        style="
                            margin-bottom:0;
                            color:#56656a;
                            line-height:1.5;
                        "
                    >

                        ${escapeHTML(
                            makeDiaryPreview(
                                entry.text ||
                                ""
                            )
                        )}

                    </p>


                </button>

            `;

        }
    );


    if (!cards) {

        cards = `

            <div
                style="
                    padding:30px;
                    background:white;
                    border:
                        1px dashed
                        #b9d6d3;
                    border-radius:20px;
                    text-align:center;
                "
            >

                <div
                    style="
                        font-size:45px;
                    "
                >
                    📖
                </div>


                <h2>
                    Your diary is empty.
                </h2>


                <p
                    style="
                        color:#68777b;
                    "
                >
                    Write your first entry whenever you're ready.
                </p>

            </div>

        `;
    }


    document.querySelector(
        "main"
    ).innerHTML = `

        ${makeAppTabs(
            "Diary"
        )}


        <div
            style="
                max-width:900px;
                margin:0 auto;
            "
        >


            <div
                style="
                    display:flex;
                    justify-content:
                        space-between;
                    align-items:center;
                    gap:15px;
                    flex-wrap:wrap;
                    margin-bottom:25px;
                "
            >


                <div>

                    <h1
                        style="
                            margin-bottom:5px;
                        "
                    >
                        📖 Diary
                    </h1>


                    <p
                        style="
                            margin:0;
                            color:#68777b;
                        "
                    >
                        A private space for your thoughts.
                    </p>

                </div>


               <div
    style="
        display:flex;
        gap:10px;
        flex-wrap:wrap;
    "
>

    <button
        class="handler-action-button primary"

        onclick="
            showDiaryEntryForm()
        "
    >
        + New Entry
    </button>


    <button
        class="handler-action-button"

        onclick="
            openJournalCustomizer()
        "
    >
        🎨 Customize Journal
    </button>

</div>

            </div>


           <div
    style="
        display:flex;
        justify-content:center;
        padding:15px 0 30px;
    "
>

    <button
        type="button"

        onclick="
            openJournal()
        "

        style="
            position:relative;
            display:block;
            padding:0;
            border:none;
            background:none;
            cursor:pointer;
            width:min(360px, 85vw);
        "
    >

        <img
            src="journal-covers/${
                getCurrentUser()?.journalCover ||
                "journal-bluewaves.png"
            }"

            alt="Your journal"

            style="
                display:block;
                width:100%;
                height:auto;
                border-radius:10px;
                box-shadow:
                    0 12px 30px
                    rgba(0,0,0,.22);
            "
        >

        <div
            style="
                position:absolute;
                left:18%;
                right:12%;
                top:32%;
                text-align:center;
                color:#26343b;
                pointer-events:none;
            "
        >

            <div
                style="
                    font-size:22px;
                    font-weight:bold;
                "
            >
                ${escapeHTML(
                    getCurrentUser()?.nickname ||
                    getCurrentUser()?.username ||
                    "My"
                )}'s Diary
            </div>

            <div
                style="
                    margin-top:2px;
                    font-size:14px;
                "
            >
                @${
                    escapeHTML(
                        (
                            getCurrentUser()?.username ||
                            "user"
                        ).replace(/^@/, "")
                    )
                }
            </div>

        </div>

    </button>

</div>


        </div>

    `;
}

/* =========================================================
   JOURNAL COVER CUSTOMIZER
========================================================= */

function openJournalCustomizer() {

    const covers = [

        {
            file: "journal-bluewaves.png",
            name: "Blue Waves"
        },

        {
            file: "journal-camo.png",
            name: "Camo"
        },

        {
            file: "journal-cows.png",
            name: "MooCow and DaisyBelle"
        },

        {
            file: "journal-daisybelle.png",
            name: "DaisyBelle"
        },

        {
            file: "journal-essaflag.png",
            name: "ESSA Flag"
        },

        {
            file: "journal-ghostdogs.png",
            name: "Ghost Dogs"
        },

        {
            file: "journal-lily.png",
            name: "Beagle"
        },

        {
            file: "journal-mocha.png",
            name: "German Pointer"
        },

        {
            file: "journal-moose.png",
            name: "Golden Retriever"
        },

        {
            file: "journal-mudpie.png",
            name: "Springer Spaniel"
        },

        {
            file: "journal-oreo.png",
            name: "Border Collie"
        },

        {
            file: "journal-pumpkinpiestuff.png",
            name: "Pumpkin Pie"
        },

        {
            file: "journal-pumpkinspice.png",
            name: "Pumpkin Spice"
        },

        {
            file: "journal-spookycookies.png",
            name: "Spooky Cookies"
        },

        {
            file: "journal-stormy.png",
            name: "Husky"
        },

        {
            file: "journal-xmasdogs.png",
            name: "Christmas Dogs"
        },

        {
    file: "journal-sheltie.png",
    name: "Sheltie by Raina"
},

{
    file: "journal-gsd.png",
    name: "German Shepherd by D1v1ne_Essas"
},

{
    file: "journal-essa-power.png",
    name: "ESSA Power by foxy861929"
},

{
    file: "journal-brown-cat.png",
    name: "Brown Cat by I_love_SunSets_A_lot"
},

{
    file: "journal-brown-dog.png",
    name: "Brown Dog by I_love_SunSets_A_lot"
},

{
    file: "journal-purple-oreo.png",
    name: "Purple Oreo by Olliez"
},

{
    file: "journal-horse55.png",
    name: "Dog by horse55"
}

    ];


    const overlay =
        document.createElement(
            "div"
        );

    overlay.className =
        "handler-award-overlay";


    const popup =
        document.createElement(
            "div"
        );

    popup.className =
        "handler-award-popup";


    let coverCards =
        "";


    covers.forEach(
        function(cover) {

            coverCards += `

                <button
                    type="button"

                    onclick="
                        selectJournalCover(
                            '${cover.file}'
                        )
                    "

                    style="
                        border:1px solid #dbe5e7;
                        background:white;
                        border-radius:14px;
                        padding:8px;
                        cursor:pointer;
                    "
                >

                    <img
                        src="journal-covers/${cover.file}"

                        alt="${cover.name}"

                        style="
                            width:120px;
                            aspect-ratio:3 / 4;
                            object-fit:cover;
                            border-radius:9px;
                            display:block;
                        "
                    >

                    <div
                        style="
                            margin-top:7px;
                            font-size:12px;
                            font-weight:bold;
                            color:#26343b;
                        "
                    >
                        ${cover.name}
                    </div>

                </button>

            `;
        }
    );


    popup.innerHTML = `

        <h2>
            🎨 Choose Your Journal
        </h2>

        <p
            style="
                color:#68777b;
                margin-top:0;
            "
        >
            Pick a cover for your diary.
        </p>


        <div
            style="
                display:grid;
                grid-template-columns:
                    repeat(auto-fit, minmax(130px, 1fr));
                gap:12px;
                width:100%;
                overflow-y:auto;
                padding:5px;
            "
        >
            ${coverCards}
        </div>


        <div
            class="handler-award-popup-buttons"
        >

            <button
                type="button"
                class="handler-results-close"

                onclick="
                    closeHandlerAward()
                "
            >
                Cancel
            </button>

        </div>

    `;


    overlay.appendChild(
        popup
    );

    document.body.appendChild(
        overlay
    );
}

/* =========================================================
   SELECT JOURNAL COVER
========================================================= */

function selectJournalCover(
    coverFile
) {

    const user =
        getCurrentUser();

    if (!user) {
        return;
    }


    const accounts =
        getAccounts();


    const accountIndex =
        accounts.findIndex(
            function(account) {

                return (
                    String(account.id) ===
                    String(user.id)
                );
            }
        );


    if (accountIndex === -1) {
        return;
    }


    accounts[
        accountIndex
    ].journalCover =
        coverFile;


    saveAccounts(
        accounts
    );


    closeHandlerAward();

    renderDiary();
}

/* =========================================================
   OPEN JOURNAL
========================================================= */

function openJournal() {

    const entries =
        getSavedDiaryEntries()
            .slice()
            .sort(
                function(a, b) {

                    return (
                        new Date(
                            a.createdAt
                        ) -
                        new Date(
                            b.createdAt
                        )
                    );
                }
            );


    showJournalPage(
        entries,
        Math.max(
            0,
            entries.length - 1
        )
    );
}

/* =========================================================
   SHOW JOURNAL PAGE
========================================================= */

function showJournalPage(
    entries,
    pageIndex = 0
) {

    if (
        !entries ||
        entries.length === 0
    ) {

        document.querySelector(
            "main"
        ).innerHTML = `

            ${makeAppTabs(
                "Diary"
            )}

            <div
                style="
                    max-width:850px;
                    margin:30px auto;
                    text-align:center;
                "
            >

                <button
                    class="handler-action-button"
                    onclick="
                        renderDiary()
                    "
                >
                    ← Close Journal
                </button>

                <div
                    style="
                        margin-top:25px;
                        padding:50px 25px;
                        background:#fffdf7;
                        border:1px solid #d8d1c4;
                        border-radius:18px;
                    "
                >

                    <h2>
                        📖 Your journal is empty.
                    </h2>

                    <p>
                        Your first entry is waiting to be written.
                    </p>

                    <button
                        class="handler-action-button primary"
                        onclick="
                            showDiaryEntryForm()
                        "
                    >
                        + New Entry
                    </button>

                </div>

            </div>
        `;

        return;
    }


    pageIndex =
        Math.max(
            0,
            Math.min(
                pageIndex,
                entries.length - 1
            )
        );


    const entry =
        entries[
            pageIndex
        ];


    document.querySelector(
        "main"
    ).innerHTML = `

        ${makeAppTabs(
            "Diary"
        )}

        <div
            style="
                max-width:900px;
                margin:25px auto;
            "
        >

            <div
                style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    gap:10px;
                    flex-wrap:wrap;
                    margin-bottom:18px;
                "
            >

                <button
                    class="handler-action-button"
                    onclick="
                        renderDiary()
                    "
                >
                    ← Close Journal
                </button>

                <button
                    class="handler-action-button primary"
                    onclick="
                        showDiaryEntryForm()
                    "
                >
                    + New Entry
                </button>

            </div>


            <div
                style="
                    background:#fffdf7;
                    border:1px solid #d8d1c4;
                    border-radius:18px;
                    padding:35px;
                    min-height:500px;
                    box-shadow:
                        0 12px 30px
                        rgba(0,0,0,.12);
                "
            >

                <div
    style="
        display:flex;
        justify-content:space-between;
        align-items:flex-start;
        gap:15px;
        margin-bottom:20px;
    "
>

    <div
        style="
            flex:1;
            text-align:center;
        "
    >

        <div
            style="
                color:#68777b;
                font-size:14px;
                margin-bottom:10px;
            "
        >
            ${formatDateTime(
                entry.createdAt
            )}
        </div>


        <h1
            style="
                margin:0;
            "
        >
            ${entry.mood || "📝"}

            ${escapeHTML(
                entry.title ||
                "Untitled Entry"
            )}
        </h1>

    </div>


    <div
        style="
            display:flex;
            gap:8px;
            flex-wrap:wrap;
        "
    >

        <button
            type="button"
            class="handler-action-button primary"

            onclick="
                showDiaryEntryForm(
                    '${entry.id}'
                )
            "
        >
            ✏️ Edit
        </button>


        <button
            type="button"

            onclick="
                deleteDiaryEntry(
                    '${entry.id}'
                )
            "

            style="
                padding:10px 14px;
                border-radius:10px;
                border:1px solid #f3b8b3;
                background:#fff5f4;
                color:#b42318;
                font-weight:bold;
                cursor:pointer;
            "
        >
            🗑️ Delete
        </button>

    </div>

</div>

               <div
    style="
        white-space:pre-wrap;
        line-height:1.7;
        margin-top:25px;
    "
>${escapeHTML(
    entry.text ||
    ""
)}</div>

${
    entry.drawing

        ? `

            <div
                style="
                    display:flex;
                    justify-content:center;
                    margin-top:25px;
                "
            >

                <img
                    src="${entry.drawing}"

                    alt="Handwritten diary entry"

                    onclick="
                        openDiaryImage(
                            this.src
                        )
                    "

                    style="
                        display:block;
                        width:auto;
                        max-width:100%;
                        max-height:600px;
                        object-fit:contain;
                        border-radius:12px;
                        border:1px solid #dbe5e7;
                        box-shadow:
                            0 4px 14px
                            rgba(0,0,0,.10);
                        cursor:pointer;
                    "
                >

            </div>

        `

        : ""
}


${
    Array.isArray(
        entry.images
    ) &&
    entry.images.length > 0

        ? `

            <div
                style="
                    display:grid;
                    grid-template-columns:
                        repeat(auto-fit, minmax(150px, 1fr));
                    gap:12px;
                    margin-top:30px;
                "
            >

                ${
                    entry.images
                        .map(
                            function(image) {

                                return `

                                   <img
    src="${image}"

    alt="Diary photo"

    onclick="
        openDiaryImage(
            this.src
        )
    "

    style="
        width:150px;
        height:150px;
        max-width:100%;
        object-fit:cover;
        border-radius:14px;
        border:1px solid #dbe5e7;
        display:block;
        cursor:pointer;
    "
>

                                `;
                            }
                        )
                        .join("")
                }

            </div>

        `

        : ""
}


                <div
                    style="
                        display:flex;
                        justify-content:space-between;
                        align-items:center;
                        gap:12px;
                        margin-top:40px;
                    "
                >

                    <button
                        class="handler-action-button"

                        ${
                            pageIndex === 0
                                ? "disabled"
                                : ""
                        }

                        onclick="
                            showJournalPage(
                                getSavedDiaryEntries()
                                    .slice()
                                    .sort(
    function(a, b) {
        return (
            new Date(a.createdAt) -
            new Date(b.createdAt)
        );
    }
),
                                ${pageIndex - 1}
                            )
                        "
                    >
                        ← Previous
                    </button>


                    <span
                        style="
                            color:#68777b;
                            font-size:14px;
                        "
                    >
                        Page
                        ${pageIndex + 1}
                        of
                        ${entries.length}
                    </span>


                    <button
                        class="handler-action-button"

                        ${
                            pageIndex ===
                            entries.length - 1

                                ? "disabled"
                                : ""
                        }

                        onclick="
                            showJournalPage(
                                getSavedDiaryEntries()
                                    .slice()
                                    .sort(
                                        function(a, b) {
                                            return (
                                                new Date(a.createdAt) -
new Date(b.createdAt)
                                            );
                                        }
                                    ),
                                ${pageIndex + 1}
                            )
                        "
                    >
                        Next →
                    </button>

                </div>

            </div>

        </div>
    `;
}

/* =========================================================
   OPEN DIARY IMAGE
========================================================= */

function openDiaryImage(
    imageSource
) {

    const overlay =
        document.createElement(
            "div"
        );


    overlay.style.cssText = `
        position:fixed;
        inset:0;
        z-index:20000;
        display:flex;
        align-items:center;
        justify-content:center;
        padding:20px;
        box-sizing:border-box;
        background:rgba(0,0,0,.85);
        cursor:pointer;
    `;


    const image =
        document.createElement(
            "img"
        );


    image.src =
        imageSource;


    image.alt =
        "Expanded diary photo";


    image.style.cssText = `
        display:block;
        max-width:95vw;
        max-height:90vh;
        width:auto;
        height:auto;
        object-fit:contain;
        border-radius:14px;
        box-shadow:0 10px 40px rgba(0,0,0,.45);
        cursor:default;
    `;


    image.onclick =
        function(event) {

            event.stopPropagation();
        };


    const closeButton =
        document.createElement(
            "button"
        );


    closeButton.type =
        "button";


    closeButton.textContent =
        "✕";


    closeButton.style.cssText = `
        position:fixed;
        top:20px;
        right:20px;
        width:44px;
        height:44px;
        border:none;
        border-radius:50%;
        background:white;
        color:#26343b;
        font-size:20px;
        font-weight:bold;
        cursor:pointer;
        box-shadow:0 3px 12px rgba(0,0,0,.3);
    `;


    closeButton.onclick =
        function(event) {

            event.stopPropagation();

            overlay.remove();
        };


    overlay.onclick =
        function() {

            overlay.remove();
        };


    overlay.appendChild(
        image
    );


    overlay.appendChild(
        closeButton
    );


    document.body.appendChild(
        overlay
    );
}


/* =========================================================
   DIARY PREVIEW
========================================================= */

function makeDiaryPreview(
    text
) {

    const clean =
        String(
            text ||
            ""
        )
            .replace(
                /\s+/g,
                " "
            )
            .trim();


    if (
        clean.length <=
        140
    ) {

        return clean;
    }


    return (
        clean.slice(
            0,
            140
        ) +
        "…"
    );
}


/* =========================================================
   DIARY ENTRY FORM
========================================================= */

function showDiaryEntryForm(
    entryId = null
) {

    const entries =
        getSavedDiaryEntries();


    const existing =
        entryId

            ? entries.find(
                function(entry) {

                    return (
                        String(
                            entry.id
                        ) ===
                        String(
                            entryId
                        )
                    );

                }
            )

            : null;

            if (
    existing &&
    existing.drawing
) {

    window.currentDiaryDrawing =
        existing.drawing;

} else {

    window.currentDiaryDrawing =
        null;
}


    document.querySelector(
        "main"
    ).innerHTML = `

        ${makeAppTabs(
            "Diary"
        )}


        <div
            class="essa-form"

            style="
                max-width:850px;
                margin:0 auto;
            "
        >


            <button
                onclick="
                    ${
                        existing

                            ? `showDiaryEntry(
                                '${existing.id}'
                            )`

                            : "renderDiary()"
                    }
                "
            >
                ← Back
            </button>


            <h1>

                ${
                    existing
                        ? "Edit Diary Entry"
                        : "New Diary Entry"
                }

            </h1>


            <label>
                Mood
            </label>


            <select
                id="diary-mood"
            >

                <option value="😊">
                    😊 Happy
                </option>

                <option value="😌">
                    😌 Calm
                </option>

                <option value="🥰">
                    🥰 Loved
                </option>

                <option value="🤩">
                    🤩 Excited
                </option>

                <option value="😐">
                    😐 Neutral
                </option>

                <option value="😴">
                    😴 Tired
                </option>

                <option value="😢">
                    😢 Sad
                </option>

                <option value="😰">
                    😰 Anxious
                </option>

                <option value="😡">
                    😡 Angry
                </option>

                <option value="🥺">
                    🥺 Sensitive
                </option>

                <option value="🤒">
                    🤒 Not Feeling Well
                </option>

            </select>


           <label>
    Title
</label>


<input
    id="diary-title"

    type="text"

    maxlength="100"

    value="${escapeHTML(
        existing?.title ||
        ""
    )}"

    placeholder="Give this entry a title..."
>


<label>
    Entry Type
</label>


<div
    style="
        display:flex;
        gap:12px;
        flex-wrap:wrap;
        margin-bottom:18px;
    "
>

    <label
        style="
            display:flex;
            align-items:center;
            gap:8px;
            padding:10px 16px;
            border:2px solid var(--user-theme-color, #4fb5ae);
            border-radius:999px;
            cursor:pointer;
            font-weight:bold;
        "
    >

      <input
    type="radio"
    name="diary-entry-type"
    value="type"

    ${
        existing?.drawing
            ? ""
            : "checked"
    }

    onchange="
        switchDiaryEntryType(
            'type'
        )
    "
>
        ⌨️ Type

    </label>


    <label
        style="
            display:flex;
            align-items:center;
            gap:8px;
            padding:10px 16px;
            border:2px solid var(--user-theme-color, #4fb5ae);
            border-radius:999px;
            cursor:pointer;
            font-weight:bold;
        "
    >

      <input
    type="radio"
    name="diary-entry-type"
    value="draw"

    ${
        existing?.drawing
            ? "checked"
            : ""
    }

    onchange="
        switchDiaryEntryType(
            'draw'
        )
    "
>

        ✍️ Draw

    </label>

</div>


<label
    id="diary-entry-label"
>
    Entry
</label>


<textarea
    id="diary-text"

    style="
        min-height:280px;
        resize:vertical;
    "

    placeholder="Write whatever is on your mind..."
>${escapeHTML(
    existing?.text ||
    ""
)}</textarea>

<div
    id="diary-draw-area"

    style="
        display:none;
        margin-top:5px;
    "
>

    <div
        style="
            border:2px solid var(--user-theme-color, #4fb5ae);
            border-radius:16px;
            overflow:hidden;
            background:#fffef8;
        "
    >

        <div
            style="
                display:flex;
                align-items:center;
                gap:10px;
                flex-wrap:wrap;
                padding:12px;
                border-bottom:1px solid #dbe5e7;
                background:#ffffff;
            "
        >

            <button
                type="button"
                class="handler-action-button primary"
                id="diary-brush-button"
            >
                🖊️ Brush
            </button>


            <button
                type="button"
                class="handler-action-button"
                id="diary-eraser-button"
            >
                🧽 Eraser
            </button>


            <button
                type="button"
                class="handler-action-button"
                id="diary-clear-drawing-button"
            >
                🗑️ Clear
            </button>

            <button
    type="button"
    class="handler-action-button primary"

    id="diary-finish-drawing-button"

    onclick="
        finishDiaryDrawing()
    "
>
    ✓ Finish
</button>


            <span
                style="
                    margin-left:auto;
                    color:#68777b;
                    font-size:13px;
                "
            >
                ✌️ Pinch with two fingers to zoom
            </span>

        </div>


       <div
    id="diary-canvas-viewport"

    style="
        position:relative;
        width:100%;
        height:500px;
        overflow:hidden;
        touch-action:none;
        background:#f3efe4;
    "
>

   <div
    id="diary-canvas-zoom-layer"

    style="
        position:absolute;
        left:50%;
        top:50%;
        height:100%;
        aspect-ratio:3 / 4;
        background:
            url('Diary-Paper.png')
            center / 100% 100%
            no-repeat;
        transform:
            translate(-50%, -50%)
            scale(1);
        transform-origin:center center;
        touch-action:none;
    "
>

    <canvas
        id="diary-drawing-canvas"

        width="1200"
        height="1600"

        style="
            display:block;
            width:100%;
            height:100%;
            background:transparent;
            touch-action:none;
            box-shadow:
                0 3px 15px
                rgba(0,0,0,.12);
        "
    ></canvas>

</div>

</div>


        <div
            style="
                padding:12px;
                text-align:center;
                color:#68777b;
                font-size:13px;
                background:white;
            "
        >
            Use your mouse, finger, or stylus to write and draw.
        </div>

    </div>

</div>

            <label>
                Add Images
            </label>


           <input
    id="diary-images"

    type="file"

    accept="image/*"

    multiple

    onchange="
        previewDiaryImages()
    "

    style="
        display:none;
    "
>


<button
    type="button"
    class="handler-action-button primary"

    onclick="
        document.getElementById(
            'diary-images'
        ).click()
    "
>
    📷 Add Photos
</button>


<div
    id="diary-image-preview"

    style="
        display:flex;
        gap:10px;
        flex-wrap:wrap;
        margin-top:12px;
    "
>
</div>

            ${
                existing &&
                Array.isArray(
                    existing.images
                ) &&
                existing.images.length >
                    0

                    ? `

                        <p
                            style="
                                color:#68777b;
                                font-size:13px;
                            "
                        >

                            This entry currently has
                            ${existing.images.length}
                            saved image(s).

                            New selected images will
                            be added to them.

                        </p>

                    `

                    : ""
            }


            <div
                style="
                    display:flex;
                    gap:10px;
                    flex-wrap:wrap;
                    margin-top:22px;
                "
            >


                <button
                    onclick="
                        ${
                            existing

                                ? `showDiaryEntry(
                                    '${existing.id}'
                                )`

                                : "renderDiary()"
                        }
                    "
                >
                    Cancel
                </button>


                <button
                    onclick="
                        saveDiaryEntry(
                            ${
                                existing
                                    ? `'${existing.id}'`
                                    : "null"
                            }
                        )
                    "
                >

                    ${
                        existing
                            ? "Save Changes"
                            : "Save Entry"
                    }

                </button>


            </div>


        </div>

    `;

    if (
    existing &&
    existing.drawing
) {

    switchDiaryEntryType(
        "draw"
    );


    redoDiaryDrawing();
}


    if (
        existing
    ) {

        const mood =
            document.getElementById(
                "diary-mood"
            );


        if (mood) {

            mood.value =
                existing.mood ||
                "😐";
        }
    }
}

/* =========================================================
   SWITCH DIARY ENTRY TYPE
========================================================= */

function switchDiaryEntryType(
    entryType
) {

    const textArea =
        document.getElementById(
            "diary-text"
        );


    const drawArea =
        document.getElementById(
            "diary-draw-area"
        );


    const entryLabel =
        document.getElementById(
            "diary-entry-label"
        );


    if (
        !textArea ||
        !drawArea
    ) {
        return;
    }


    if (
        entryType === "draw"
    ) {

        textArea.style.display =
            "none";


        drawArea.style.display =
            "block";

        setupDiaryDrawingCanvas();


        if (entryLabel) {

            entryLabel.textContent =
                "Draw / Write";
        }

    } else {

        textArea.style.display =
            "block";


        drawArea.style.display =
            "none";


        if (entryLabel) {

            entryLabel.textContent =
                "Entry";
        }

    }
}

/* =========================================================
   SET UP DIARY DRAWING CANVAS
========================================================= */

function setupDiaryDrawingCanvas() {

    const canvas =
        document.getElementById(
            "diary-drawing-canvas"
        );


    const zoomLayer =
        document.getElementById(
            "diary-canvas-zoom-layer"
        );


    if (
        !canvas ||
        !zoomLayer
    ) {
        return;
    }


    const context =
        canvas.getContext(
            "2d"
        );


    let isDrawing =
        false;


    let drawingPointerId =
        null;


    let tool =
        "brush";


    let zoom =
        1;


    let panX =
        0;


    let panY =
        0;


    const activeTouches =
        new Map();


    let pinchStartDistance =
        0;


    let pinchStartZoom =
        1;


    let pinchStartCenter =
        null;


    let pinchStartPanX =
        0;


    let pinchStartPanY =
        0;


    context.lineCap =
        "round";

    context.lineJoin =
        "round";

    context.lineWidth =
        6;

    context.strokeStyle =
        "#26343b";


    function updateZoomLayer() {

        zoomLayer.style.transform = `
            translate(
                calc(-50% + ${panX}px),
                calc(-50% + ${panY}px)
            )
            scale(${zoom})
        `;
    }


    function getCanvasPoint(
        event
    ) {

        const rect =
            canvas.getBoundingClientRect();


        return {

            x:
                (
                    event.clientX -
                    rect.left
                ) *
                (
                    canvas.width /
                    rect.width
                ),

            y:
                (
                    event.clientY -
                    rect.top
                ) *
                (
                    canvas.height /
                    rect.height
                )

        };
    }


    function getTouchDistance() {

        const touches =
            Array.from(
                activeTouches.values()
            );


        if (
            touches.length < 2
        ) {
            return 0;
        }


        const x =
            touches[1].x -
            touches[0].x;


        const y =
            touches[1].y -
            touches[0].y;


        return Math.hypot(
            x,
            y
        );
    }


    function getTouchCenter() {

        const touches =
            Array.from(
                activeTouches.values()
            );


        if (
            touches.length < 2
        ) {
            return null;
        }


        return {

            x:
                (
                    touches[0].x +
                    touches[1].x
                ) / 2,

            y:
                (
                    touches[0].y +
                    touches[1].y
                ) / 2

        };
    }


    canvas.onpointerdown =
        function(event) {

            if (
                event.pointerType === "touch"
            ) {

                activeTouches.set(
                    event.pointerId,
                    {
                        x: event.clientX,
                        y: event.clientY
                    }
                );


                if (
                    activeTouches.size >= 2
                ) {

                    isDrawing =
                        false;


                    drawingPointerId =
                        null;


                    context.beginPath();


                    pinchStartDistance =
                        getTouchDistance();


                    pinchStartZoom =
                        zoom;


                    pinchStartCenter =
                        getTouchCenter();


                    pinchStartPanX =
                        panX;


                    pinchStartPanY =
                        panY;


                    return;
                }
            }


            isDrawing =
                true;


            drawingPointerId =
                event.pointerId;


            try {

                canvas.setPointerCapture(
                    event.pointerId
                );

            } catch (error) {

                // Pointer capture is not required
                // on every browser/device.
            }


            const point =
                getCanvasPoint(
                    event
                );


            context.beginPath();


            context.moveTo(
                point.x,
                point.y
            );
        };


    canvas.onpointermove =
        function(event) {

            if (
                event.pointerType === "touch" &&
                activeTouches.has(
                    event.pointerId
                )
            ) {

                activeTouches.set(
                    event.pointerId,
                    {
                        x: event.clientX,
                        y: event.clientY
                    }
                );


                if (
                    activeTouches.size >= 2
                ) {

                    event.preventDefault();


                    isDrawing =
                        false;


                    const distance =
                        getTouchDistance();


                    const center =
                        getTouchCenter();


                    if (
                        pinchStartDistance > 0
                    ) {

                        zoom =
                            pinchStartZoom *
                            (
                                distance /
                                pinchStartDistance
                            );


                        zoom =
                            Math.max(
                                1,
                                Math.min(
                                    zoom,
                                    4
                                )
                            );
                    }


                    if (
                        center &&
                        pinchStartCenter
                    ) {

                        panX =
                            pinchStartPanX +
                            (
                                center.x -
                                pinchStartCenter.x
                            );


                        panY =
                            pinchStartPanY +
                            (
                                center.y -
                                pinchStartCenter.y
                            );
                    }


                    updateZoomLayer();


                    return;
                }
            }


            if (
                !isDrawing ||
                event.pointerId !==
                drawingPointerId
            ) {
                return;
            }


            const point =
                getCanvasPoint(
                    event
                );


            if (
                tool === "eraser"
            ) {

                context.globalCompositeOperation =
                    "destination-out";


                context.lineWidth =
                    35;

            } else {

                context.globalCompositeOperation =
                    "source-over";


                context.strokeStyle =
                    "#26343b";


                context.lineWidth =
                    6;
            }


            context.lineTo(
                point.x,
                point.y
            );


            context.stroke();
        };


    function endPointer(
        event
    ) {

        if (
            event.pointerType === "touch"
        ) {

            activeTouches.delete(
                event.pointerId
            );


            if (
                activeTouches.size < 2
            ) {

                pinchStartDistance =
                    0;


                pinchStartCenter =
                    null;
            }
        }


        if (
            event.pointerId ===
            drawingPointerId
        ) {

            isDrawing =
                false;


            drawingPointerId =
                null;


            context.beginPath();
        }
    }


    canvas.onpointerup =
        endPointer;


    canvas.onpointercancel =
        endPointer;


    const brushButton =
        document.getElementById(
            "diary-brush-button"
        );


    const eraserButton =
        document.getElementById(
            "diary-eraser-button"
        );


    const clearButton =
        document.getElementById(
            "diary-clear-drawing-button"
        );


    if (brushButton) {

        brushButton.onclick =
            function() {

                tool =
                    "brush";
            };
    }


    if (eraserButton) {

        eraserButton.onclick =
            function() {

                tool =
                    "eraser";
            };
    }


    if (clearButton) {

        clearButton.onclick =
            function() {

                context.clearRect(
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );
            };
    }


    updateZoomLayer();
}

/* =========================================================
   FINISH DIARY DRAWING
========================================================= */

function finishDiaryDrawing() {

    const canvas =
        document.getElementById(
            "diary-drawing-canvas"
        );


    if (!canvas) {
        return;
    }


    const paperImage =
        new Image();


    paperImage.onload =
        function() {

            const finishedCanvas =
                document.createElement(
                    "canvas"
                );


            finishedCanvas.width =
                canvas.width;

            finishedCanvas.height =
                canvas.height;


            const finishedContext =
                finishedCanvas.getContext(
                    "2d"
                );


            finishedContext.drawImage(
                paperImage,
                0,
                0,
                finishedCanvas.width,
                finishedCanvas.height
            );


            finishedContext.drawImage(
                canvas,
                0,
                0,
                finishedCanvas.width,
                finishedCanvas.height
            );


            const finishedDrawing =
                finishedCanvas.toDataURL(
                    "image/png"
                );


            window.currentDiaryDrawing =
                finishedDrawing;


            const drawArea =
                document.getElementById(
                    "diary-draw-area"
                );


            if (drawArea) {

                drawArea.innerHTML = `

                    <div
                        style="
                            text-align:center;
                            padding:20px;
                            border:2px solid var(--user-theme-color, #4fb5ae);
                            border-radius:16px;
                            background:#fffef8;
                        "
                    >

                        <div
                            style="
                                font-weight:bold;
                                margin-bottom:12px;
                            "
                        >
                            ✓ Drawing Finished
                        </div>


                        <img
                            src="${finishedDrawing}"

                            alt="Finished diary drawing"

                            style="
                                display:block;
                                width:auto;
                                max-width:100%;
                                max-height:400px;
                                margin:0 auto 15px;
                                object-fit:contain;
                                border-radius:10px;
                                border:1px solid #dbe5e7;
                            "
                        >


                        <button
                            type="button"
                            class="handler-action-button"

                            onclick="
                                redoDiaryDrawing()
                            "
                        >
                            ✏️ Keep Editing
                        </button>

                    </div>

                `;
            }
        };


    paperImage.src =
        "Diary-Paper.png";
}

/* =========================================================
   REDO DIARY DRAWING
========================================================= */

function redoDiaryDrawing() {

    const savedDrawing =
        window.currentDiaryDrawing;


    const drawArea =
        document.getElementById(
            "diary-draw-area"
        );


    if (!drawArea) {
        return;
    }


    drawArea.innerHTML = `

        <div
            style="
                border:2px solid var(--user-theme-color, #4fb5ae);
                border-radius:16px;
                overflow:hidden;
                background:#fffef8;
            "
        >

            <div
                style="
                    display:flex;
                    align-items:center;
                    gap:10px;
                    flex-wrap:wrap;
                    padding:12px;
                    border-bottom:1px solid #dbe5e7;
                    background:#ffffff;
                "
            >

                <button
                    type="button"
                    class="handler-action-button primary"
                    id="diary-brush-button"
                >
                    🖊️ Brush
                </button>


                <button
                    type="button"
                    class="handler-action-button"
                    id="diary-eraser-button"
                >
                    🧽 Eraser
                </button>


                <button
                    type="button"
                    class="handler-action-button"
                    id="diary-clear-drawing-button"
                >
                    🗑️ Clear
                </button>


                <button
                    type="button"
                    class="handler-action-button primary"
                    id="diary-finish-drawing-button"

                    onclick="
                        finishDiaryDrawing()
                    "
                >
                    ✓ Finish
                </button>


                <span
                    style="
                        margin-left:auto;
                        color:#68777b;
                        font-size:13px;
                    "
                >
                    ✌️ Pinch with two fingers to zoom
                </span>

            </div>


            <div
                id="diary-canvas-viewport"

                style="
                    position:relative;
                    width:100%;
                    height:500px;
                    overflow:hidden;
                    touch-action:none;
                    background:
    #f3efe4
    url('Diary-Paper.png')
    center / contain
    no-repeat;
                "
            >

                <div
                    id="diary-canvas-zoom-layer"

                    style="
                        position:absolute;
                        left:50%;
                        top:50%;
                        height:100%;
                        transform:
                            translate(-50%, -50%)
                            scale(1);
                        transform-origin:center center;
                        touch-action:none;
                    "
                >

                    <canvas
                        id="diary-drawing-canvas"

                        width="1200"
                        height="1600"

                        style="
                            display:block;
                            width:auto;
                            height:100%;
                           background:transparent;
                            touch-action:none;
                            box-shadow:
                                0 3px 15px
                                rgba(0,0,0,.12);
                        "
                    ></canvas>

                </div>

            </div>


            <div
                style="
                    padding:12px;
                    text-align:center;
                    color:#68777b;
                    font-size:13px;
                    background:white;
                "
            >
                Use your mouse, finger, or stylus to write and draw.
            </div>

        </div>
    `;


    setupDiaryDrawingCanvas();


    if (savedDrawing) {

        const canvas =
            document.getElementById(
                "diary-drawing-canvas"
            );


        const context =
            canvas.getContext(
                "2d"
            );


        const image =
            new Image();


        image.onload =
            function() {

                context.clearRect(
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );


                context.drawImage(
                    image,
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );
            };


        image.src =
            savedDrawing;
    }
}

/* =========================================================
   PREVIEW DIARY IMAGES
========================================================= */

function previewDiaryImages() {

    const input =
        document.getElementById(
            "diary-images"
        );

    const previewArea =
        document.getElementById(
            "diary-image-preview"
        );


    if (
        !input ||
        !previewArea
    ) {
        return;
    }


    previewArea.innerHTML =
        "";


    const files =
        Array.from(
            input.files || []
        );


    files.forEach(
        function(
            file,
            index
        ) {

            const reader =
                new FileReader();


            reader.onload =
                function(event) {

                    const wrapper =
                        document.createElement(
                            "div"
                        );


                    wrapper.style.position =
                        "relative";


                   wrapper.innerHTML = `

    <img
        src="${event.target.result}"

        style="
            width:110px;
            height:110px;
            object-fit:cover;
            border-radius:14px;
            border:1px solid #dbe5e7;
        "
    >


    <button
        type="button"

        onclick="
            openDiaryImageCropper(
                ${index}
            )
        "

        title="Crop photo"

        style="
            position:absolute;
            top:5px;
            right:38px;
            width:28px;
            height:28px;
            padding:0;
            border:none;
            border-radius:50%;
            background:white;
            color:#26343b;
            font-weight:bold;
            cursor:pointer;
            box-shadow:
                0 2px 6px
                rgba(0,0,0,.2);
        "
    >
        ✏️
    </button>


    <button
        type="button"

        onclick="
            removeDiarySelectedImage(
                ${index}
            )
        "

        title="Remove photo"

        style="
            position:absolute;
            top:5px;
            right:5px;
            width:28px;
            height:28px;
            padding:0;
            border:none;
            border-radius:50%;
            background:white;
            color:#b42318;
            font-weight:bold;
            cursor:pointer;
            box-shadow:
                0 2px 6px
                rgba(0,0,0,.2);
        "
    >
        ✕
    </button>

`;

                    previewArea.appendChild(
                        wrapper
                    );
                };


            reader.readAsDataURL(
                file
            );
        }
    );
}

/* =========================================================
   REMOVE SELECTED DIARY IMAGE
========================================================= */

function removeDiarySelectedImage(
    removeIndex
) {

    const input =
        document.getElementById(
            "diary-images"
        );


    if (
        !input ||
        !input.files
    ) {
        return;
    }


    const dataTransfer =
        new DataTransfer();


    Array.from(
        input.files
    ).forEach(
        function(
            file,
            index
        ) {

            if (
                index !==
                removeIndex
            ) {

                dataTransfer.items.add(
                    file
                );
            }
        }
    );


    input.files =
        dataTransfer.files;


    previewDiaryImages();
}

/* =========================================================
   OPEN DIARY IMAGE CROPPER
========================================================= */

function openDiaryImageCropper(
    imageIndex
) {

    const input =
        document.getElementById(
            "diary-images"
        );

    if (
        !input ||
        !input.files ||
        !input.files[imageIndex]
    ) {
        return;
    }


    const file =
        input.files[
            imageIndex
        ];


    const reader =
        new FileReader();


    reader.onload =
        function(event) {

            const overlay =
                document.createElement(
                    "div"
                );

            overlay.className =
                "handler-award-overlay";


            const popup =
                document.createElement(
                    "div"
                );

            popup.className =
                "handler-award-popup";


            popup.innerHTML = `

                <h2>
                    ✏️ Crop Photo
                </h2>


                <div
                    style="
                        width:280px;
                        height:280px;
                        overflow:hidden;
                        border-radius:18px;
                        border:2px solid
                            var(--user-theme-color, #4fb5ae);
                        margin:0 auto 18px;
                    "
                >

                    <img
                        id="diary-crop-image"

                        src="${event.target.result}"

                        style="
                            width:100%;
                            height:100%;
                            object-fit:cover;
                            object-position:50% 50%;
                            transform:scale(1);
                        "
                    >

                </div>


                <div
                    style="
                        width:100%;
                        max-width:400px;
                    "
                >

                    <label>
                        ↔️ Left / Right
                    </label>

                    <input
                        id="diary-crop-x"
                        type="range"
                        min="0"
                        max="100"
                        value="50"
                        style="width:100%;"
                    >


                    <label
                        style="
                            display:block;
                            margin-top:12px;
                        "
                    >
                        ↕️ Up / Down
                    </label>

                    <input
                        id="diary-crop-y"
                        type="range"
                        min="0"
                        max="100"
                        value="50"
                        style="width:100%;"
                    >


                    <label
                        style="
                            display:block;
                            margin-top:12px;
                        "
                    >
                        🔍 Zoom
                    </label>

                    <input
                        id="diary-crop-zoom"
                        type="range"
                        min="1"
                        max="3"
                        step="0.05"
                        value="1"
                        style="width:100%;"
                    >

                </div>


                <div
                    class="handler-award-popup-buttons"
                >

                    <button
                        type="button"
                        class="handler-action-button primary"

                        onclick="
                            saveDiaryImageCrop(
                                ${imageIndex}
                            )
                        "
                    >
                        💾 Save Crop
                    </button>


                    <button
                        type="button"
                        class="handler-results-close"

                        onclick="
                            closeHandlerAward()
                        "
                    >
                        Cancel
                    </button>

                </div>

            `;


            overlay.appendChild(
                popup
            );

            document.body.appendChild(
                overlay
            );


            const cropImage =
                document.getElementById(
                    "diary-crop-image"
                );

            const xSlider =
                document.getElementById(
                    "diary-crop-x"
                );

            const ySlider =
                document.getElementById(
                    "diary-crop-y"
                );

            const zoomSlider =
                document.getElementById(
                    "diary-crop-zoom"
                );


            function updateCropPreview() {

                cropImage.style.objectPosition =
                    `${xSlider.value}% ${ySlider.value}%`;

                cropImage.style.transform =
                    `scale(${zoomSlider.value})`;
            }


            xSlider.addEventListener(
                "input",
                updateCropPreview
            );

            ySlider.addEventListener(
                "input",
                updateCropPreview
            );

            zoomSlider.addEventListener(
                "input",
                updateCropPreview
            );
        };


    reader.readAsDataURL(
        file
    );
}

/* =========================================================
   SAVE DIARY IMAGE CROP
========================================================= */

function saveDiaryImageCrop(
    imageIndex
) {

    const input =
        document.getElementById(
            "diary-images"
        );

    const cropImage =
        document.getElementById(
            "diary-crop-image"
        );

    const xSlider =
        document.getElementById(
            "diary-crop-x"
        );

    const ySlider =
        document.getElementById(
            "diary-crop-y"
        );

    const zoomSlider =
        document.getElementById(
            "diary-crop-zoom"
        );


    if (
        !input ||
        !input.files ||
        !input.files[imageIndex] ||
        !cropImage ||
        !xSlider ||
        !ySlider ||
        !zoomSlider
    ) {
        return;
    }


    const sourceImage =
        new Image();


    sourceImage.onload =
        function() {

            const canvas =
                document.createElement(
                    "canvas"
                );


            const outputSize =
                1000;


            canvas.width =
                outputSize;

            canvas.height =
                outputSize;


            const context =
                canvas.getContext(
                    "2d"
                );


            const zoom =
                Number(
                    zoomSlider.value
                );


            const baseCropSize =
                Math.min(
                    sourceImage.width,
                    sourceImage.height
                );


            const cropSize =
                baseCropSize /
                zoom;


            const maxX =
                sourceImage.width -
                cropSize;

            const maxY =
                sourceImage.height -
                cropSize;


            const sourceX =
                maxX *
                (
                    Number(
                        xSlider.value
                    ) / 100
                );


            const sourceY =
                maxY *
                (
                    Number(
                        ySlider.value
                    ) / 100
                );


            context.drawImage(
                sourceImage,
                sourceX,
                sourceY,
                cropSize,
                cropSize,
                0,
                0,
                outputSize,
                outputSize
            );


            canvas.toBlob(
                function(blob) {

                    if (!blob) {
                        return;
                    }


                    const oldFile =
                        input.files[
                            imageIndex
                        ];


                    const croppedFile =
                        new File(
                            [blob],
                            oldFile.name,
                            {
                                type:
                                    "image/jpeg"
                            }
                        );


                    const dataTransfer =
                        new DataTransfer();


                    Array.from(
                        input.files
                    ).forEach(
                        function(
                            file,
                            index
                        ) {

                            dataTransfer.items.add(
                                index === imageIndex
                                    ? croppedFile
                                    : file
                            );
                        }
                    );


                    input.files =
                        dataTransfer.files;


                    closeHandlerAward();

                    previewDiaryImages();
                },

                "image/jpeg",
                0.82
            );
        };


    sourceImage.src =
        cropImage.src;
}


/* =========================================================
   READ MULTIPLE DIARY IMAGES
========================================================= */

async function readDiaryImages(
    files
) {

    const results =
        [];


    if (
        !files ||
        files.length ===
        0
    ) {

        return results;
    }


    for (
        const file
        of files
    ) {

        const data =
            await readImageFile(
                file
            );


        if (data) {

            results.push(
                data
            );
        }
    }


    return results;
}


/* =========================================================
   SAVE DIARY ENTRY
========================================================= */

async function saveDiaryEntry(
    entryId = null
) {

    const mood =
        document
            .getElementById(
                "diary-mood"
            )
            .value;


    const title =
        document
            .getElementById(
                "diary-title"
            )
            .value
            .trim();


    const text =
        document
            .getElementById(
                "diary-text"
            )
            .value
            .trim();


    const drawing =
        window.currentDiaryDrawing ||
        null;


    if (
        !title &&
        !text &&
        !drawing
    ) {

        alert(
            "Write a title, some text, or create a drawing before saving."
        );

        return;
    }


    const imageInput =
        document.getElementById(
            "diary-images"
        );


    let newImages =
        [];


    try {

        newImages =
            await readDiaryImages(
                imageInput?.files
            );

    } catch (error) {

        console.error(
            error
        );


        alert(
            "One of those images could not be read."
        );

        return;
    }


    const entries =
        getSavedDiaryEntries();


    if (
        entryId
    ) {

        const index =
            entries.findIndex(
                function(entry) {

                    return (
                        String(
                            entry.id
                        ) ===
                        String(
                            entryId
                        )
                    );

                }
            );


        if (
            index ===
            -1
        ) {

            renderDiary();

            return;
        }


        const existing =
            entries[
                index
            ];


        entries[
            index
        ] = {

            ...existing,

            mood:
                mood,

            title:
                title,

            text:
                text,

            drawing:
                drawing ||
                existing.drawing ||
                null,

            images:
                [
                    ...(
                        Array.isArray(
                            existing.images
                        )
                            ? existing.images
                            : []
                    ),

                    ...newImages
                ],

            updatedAt:
                new Date()
                    .toISOString()

        };

    } else {

        entries.unshift(
            {

                id:
                    makeId(
                        "diary"
                    ),

                mood:
                    mood,

                title:
                    title,

                text:
                    text,

                drawing:
                    drawing,

                images:
                    newImages,

                createdAt:
                    new Date()
                        .toISOString(),

                updatedAt:
                    new Date()
                        .toISOString()

            }
        );
    }


    try {

        saveDiaryEntries(
            entries
        );

    } catch (error) {

        console.error(
            error
        );


        alert(
            "This diary entry could not be saved. Large images may have filled browser storage."
        );

        return;
    }


    window.currentDiaryDrawing =
        null;


    if (
    entryId
) {

    openJournal();

} else {

    renderDiary();
}
}

/* =========================================================
   VIEW DIARY ENTRY
========================================================= */

function showDiaryEntry(
    entryId
) {

    const entry =
        getSavedDiaryEntries()
            .find(
                function(item) {

                    return (
                        String(
                            item.id
                        ) ===
                        String(
                            entryId
                        )
                    );

                }
            );


    if (!entry) {

        renderDiary();

        return;
    }


    let imagesHTML =
        "";


    if (
        Array.isArray(
            entry.images
        ) &&
        entry.images.length >
            0
    ) {

        imagesHTML =
            entry.images
                .map(
                    function(
                        image,
                        index
                    ) {

                        return `

                            <div
                                style="
                                    position:relative;
                                "
                            >

                                <img
                                    src="${image}"

                                    alt="Diary image"

                                    style="
                                        width:100%;
                                        aspect-ratio:
                                            1 / 1;
                                        object-fit:cover;
                                        border-radius:16px;
                                    "
                                >


                                <button
                                    onclick="
                                        removeDiaryImage(
                                            '${entry.id}',
                                            ${index}
                                        )
                                    "

                                    title="Remove image"

                                    style="
                                        position:absolute;
                                        top:8px;
                                        right:8px;
                                        width:34px;
                                        height:34px;
                                        padding:0;
                                        border-radius:50%;
                                        background:
                                            rgba(
                                                255,
                                                255,
                                                255,
                                                .92
                                            );
                                        color:#b42318;
                                    "
                                >
                                    ×
                                </button>

                            </div>

                        `;

                    }
                )
                .join("");
    }


    document.querySelector(
        "main"
    ).innerHTML = `

        ${makeAppTabs(
            "Diary"
        )}


        <div
            style="
                max-width:850px;
                margin:0 auto;
            "
        >


            <button
            class="handler-action-button"
                onclick="
                    renderDiary()
                "
            >
                ← Diary
            </button>


            <article
                style="
                    margin-top:20px;
                    padding:28px;
                    background:white;
                    border:
                        1px solid
                        #dbe5e7;
                    border-radius:24px;
                "
            >


                <div
                    style="
                        display:flex;
                        justify-content:
                            space-between;
                        align-items:flex-start;
                        gap:15px;
                        flex-wrap:wrap;
                    "
                >


                    <div>

                        <h1
                            style="
                                margin:
                                    0
                                    0
                                    8px
                                    0;
                            "
                        >

                            ${entry.mood || "📝"}

                            ${escapeHTML(
                                entry.title ||
                                "Untitled Entry"
                            )}

                        </h1>


                        <div
                            style="
                                color:#68777b;
                                font-size:14px;
                            "
                        >

                            ${formatDateTime(
                                entry.createdAt
                            )}

                        </div>

                    </div>


                    <div
                        style="
                            display:flex;
                            gap:8px;
                            flex-wrap:wrap;
                        "
                    >


                        <button
    class="handler-action-button primary"
    onclick="
        showDiaryEntryForm(
            '${entry.id}'
        )
    "
>
    Edit
</button>


<button
    class="handler-action-button danger"
    onclick="
        deleteDiaryEntry(
            '${entry.id}'
        )
    "
>
    Delete
</button>

                    </div>


                </div>


                <div
                    style="
                        white-space:pre-wrap;
                        line-height:1.75;
                        margin-top:25px;
                        font-size:16px;
                    "
                >${escapeHTML(
                    entry.text ||
                    ""
                )}</div>


                ${
                    imagesHTML

                        ? `

                            <div
                                style="
                                    display:grid;
                                    grid-template-columns:
                                        repeat(
                                            auto-fit,
                                            minmax(
                                                180px,
                                                1fr
                                            )
                                        );
                                    gap:12px;
                                    margin-top:28px;
                                "
                            >

                                ${imagesHTML}

                            </div>

                        `

                        : ""
                }


            </article>


        </div>

    `;
}


/* =========================================================
   REMOVE DIARY IMAGE
========================================================= */

function removeDiaryImage(
    entryId,
    imageIndex
) {

    const entries =
        getSavedDiaryEntries();


    const index =
        entries.findIndex(
            function(entry) {

                return (
                    String(
                        entry.id
                    ) ===
                    String(
                        entryId
                    )
                );

            }
        );


    if (
        index ===
        -1
    ) {

        return;
    }


    if (
        !Array.isArray(
            entries[
                index
            ].images
        )
    ) {

        return;
    }


    const confirmed =
        confirm(
            "Remove this image from the diary entry?"
        );


    if (!confirmed) {

        return;
    }


    entries[
        index
    ].images.splice(
        Number(
            imageIndex
        ),
        1
    );


    entries[
        index
    ].updatedAt =
        new Date()
            .toISOString();


    saveDiaryEntries(
        entries
    );


    showDiaryEntry(
        entryId
    );
}

/* =========================================================
   DELETE DIARY ENTRY POPUP
========================================================= */

function deleteDiaryEntry(
    entryId
) {

    const oldPopup =
        document.getElementById(
            "diary-delete-popup"
        );


    if (oldPopup) {
        oldPopup.remove();
    }


    const popup =
        document.createElement(
            "div"
        );


    popup.id =
        "diary-delete-popup";


    popup.innerHTML = `

        <div class="training-delete-overlay">

            <div class="training-delete-box">

                <h2>
                    Delete Diary Entry?
                </h2>

                <p>
                    Are you sure you want to delete
                    this diary entry? This cannot be undone.
                </p>


                <div class="training-delete-buttons">

                    <button
                        class="handler-action-button"
                        onclick="
                            document.getElementById(
                                'diary-delete-popup'
                            ).remove()
                        "
                    >
                        Cancel
                    </button>


                    <button
                        class="handler-action-button danger"
                        onclick="
                            document.getElementById(
                                'diary-delete-popup'
                            ).remove();

                            deleteDiaryEntryConfirmed(
                                '${entryId}'
                            )
                        "
                    >
                        Delete
                    </button>

                </div>

            </div>

        </div>
    `;


    document.body.appendChild(
        popup
    );
}

/* =========================================================
   DELETE DIARY ENTRY
========================================================= */

function deleteDiaryEntryConfirmed(
    entryId
) {

    const entries =
        getSavedDiaryEntries()
            .filter(
                function(entry) {

                    return (
                        String(
                            entry.id
                        ) !==
                        String(
                            entryId
                        )
                    );

                }
            );


    saveDiaryEntries(
        entries
    );


    renderDiary();
}


/* =========================================================
   START APP
========================================================= */

function startESSAzLife() {

    setupHeaderButtons();


    /*
        Connect the logged-in World account
        to its Handler data profile.
    */
    const user =
        connectWorldAccountToHandler();


    if (user) {

        showHeaderButtons(
            true
        );

        renderHome();

    } else {

        /*
            Handler Edition inside World should
            only be used through a logged-in
            ESSAzLife World account.
        */
        showHeaderButtons(
            false
        );

        window.location.href =
            "../../index.html";
    }
}


if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        startESSAzLife
    );

} else {

    startESSAzLife();
}

function showLockedEssaCertificationPopup() {

    const overlay =
        document.createElement("div");

    overlay.id =
        "essa-certification-locked-popup";

    overlay.className =
        "training-delete-overlay";

    overlay.innerHTML = `

        <div class="training-delete-box">

            <h2>
                🔒 ESSA Certification Exam Locked
            </h2>

            <p>
                You must complete and pass the
                Handler Certification Exam before
                you can certify your ESSAs.
            </p>

            <div class="training-delete-buttons">

                <button
                    class="handler-action-button primary"
                    onclick="
                        document.getElementById(
                            'essa-certification-locked-popup'
                        ).remove()
                    "
                >
                    Close
                </button>

            </div>

        </div>

    `;

    document.body.appendChild(
        overlay
    );
}

function showHandlerCertificationExam() {

    applyUserTheme();

    document.querySelector(
        "main"
    ).innerHTML = `

        ${makeAppTabs(
            "Training"
        )}

        <div
            style="
                max-width:700px;
                margin:0 auto;
                text-align:center;
            "
        >

            <h1>
                🏆 Handler Certification Exam
            </h1>

            <div
                style="
                    margin-top:25px;
                    padding:25px;
                    background:white;
                    border:1px solid #dbe5e7;
                    border-radius:16px;
                    text-align:left;
                "
            >

                <p
                    style="
                        line-height:1.6;
                    "
                >
                    This Handler Certification Exam is
                    designed for entertainment purposes
                    only and some of the questions are
                    meant to be realistic for a more
                    immersive experience.
                </p>

                <p
                    style="
                        line-height:1.6;
                    "
                >
                    <strong>Directions:</strong>
                    Answer each question to the best of
                    your ability. Score 70% or higher
                    to pass.
                </p>

                <div
                    style="
                        margin-top:25px;
                        text-align:center;
                    "
                >

                    <button
                        class="handler-action-button primary"
                        onclick="
                            showHandlerExamMaterial()
                        "
                    >
                        Next
                    </button>

                </div>

            </div>

        </div>

    `;
}

function showHandlerExamMaterial() {

    applyUserTheme();

    document.querySelector(
        "main"
    ).innerHTML = `

        ${makeAppTabs(
            "Training"
        )}

        <div
            style="
                max-width:800px;
                margin:0 auto;
                text-align:center;
            "
        >

            <h1>
                🏆 Handler Certification Course
            </h1>

            <p
                style="
                    color:#68777b;
                    line-height:1.5;
                "
            >
                Watch the certification course before
                beginning your exam.
            </p>
        
            <p
    style="
        max-width:750px;
        margin:25px auto 0;
        color:#68777b;
        line-height:1.5;
        font-size:16px;
    "
>
    <strong>Please Note:</strong> Selecting the play button below will take you to YouTube.
    You will then need to return here to take the Exam.
    If you have already watched the video, select <strong>Start Exam</strong>.
</p>

          <a
    href="https://youtu.be/3vQ_sz5EGp0"
    target="_blank"
    rel="noopener noreferrer"
    style="
        display:inline-block;
        margin-top:30px;
        padding:16px 28px;
        background:black;
        color:white;
        text-decoration:none;
        border-radius:12px;
        font-size:18px;
        font-weight:bold;
    "
>
    ▶ Watch Handler Certification Course
</a>

            <div
                style="
                    margin-top:25px;
                "
            >

                <button
                    class="handler-action-button primary"
                    onclick="
                        startHandlerCertificationExam()
                    "
                >
                    Start Exam
                </button>

            </div>

        </div>

    `;
}

function startHandlerCertificationExam() {
    document.querySelector("main").innerHTML = `
        <div class="handler-exam">
            <h1>ESSAzLife Handler Edition</h1>
            <h2>Handler Certification Exam</h2>

            <div class="handler-exam-info">
                <p>
                    <strong>Please Note:</strong>
                    This Handler Certification Exam is designed for entertainment
                    purposes only, and some of the questions are meant to be
                    realistic for a more immersive experience.
                </p>

                <p>
                    <strong>Directions:</strong>
                    Answer each question to the best of your ability.
                    Score <strong>70% or higher</strong> to pass.
                </p>
            </div>

            <button
                class="handler-action-button primary"
                onclick="beginHandlerExamQuestions()"
            >
                Next
            </button>
        </div>
    `;
}

let currentHandlerQuestion = 0;
let handlerExamScore = 0;
let selectedHandlerAnswer = null;
let handlerExamAnswers = [];

function beginHandlerExamQuestions() {
    currentHandlerQuestion = 0;
    handlerExamScore = 0;
    selectedHandlerAnswer = null;
    handlerExamAnswers = [];

    showHandlerExamQuestion();
}

function showHandlerExamQuestion() {
    const question = handlerExamQuestions[currentHandlerQuestion];

    document.querySelector("main").innerHTML = `
        <div class="handler-exam">
            <h1>Handler Certification Exam</h1>

            <p>
                Question ${currentHandlerQuestion + 1} of ${handlerExamQuestions.length}
            </p>

            <h2>${question.question}</h2>

            <div class="handler-answer-options">
                <button onclick="selectHandlerAnswer(0)">
                    A. ${question.answers[0]}
                </button>

                <button onclick="selectHandlerAnswer(1)">
                    B. ${question.answers[1]}
                </button>

                <button onclick="selectHandlerAnswer(2)">
                    C. ${question.answers[2]}
                </button>

                <button onclick="selectHandlerAnswer(3)">
                    D. ${question.answers[3]}
                </button>
                        </div>

            <button
                class="handler-action-button primary"
                id="handler-next-question"
                onclick="submitHandlerAnswer()"
                disabled
            >
                Next Question
            </button>
        </div>
    `;
}

function selectHandlerAnswer(answerIndex) {
    selectedHandlerAnswer = answerIndex;

    const answerButtons = document.querySelectorAll(
        ".handler-answer-options button"
    );

    answerButtons.forEach(function(button) {
        button.classList.remove("selected");
    });

    answerButtons[answerIndex].classList.add("selected");

    document.getElementById("handler-next-question").disabled = false;
}

function submitHandlerAnswer() {
    if (selectedHandlerAnswer === null) {
        return;
    }

    const question = handlerExamQuestions[currentHandlerQuestion];

    const isCorrect = question.correct.includes(selectedHandlerAnswer);

    handlerExamAnswers.push({
        questionIndex: currentHandlerQuestion,
        selectedAnswer: selectedHandlerAnswer,
        correct: isCorrect
    });

    if (isCorrect) {
        handlerExamScore++;
    }

    currentHandlerQuestion++;
    selectedHandlerAnswer = null;

    if (currentHandlerQuestion < handlerExamQuestions.length) {
        showHandlerExamQuestion();
    } else {
        showHandlerExamResults();
    }
}

function showHandlerExamResults() {
    const totalQuestions = handlerExamQuestions.length;
    const percentage = Math.round(
        (handlerExamScore / totalQuestions) * 100
    );

    const passed = handlerExamScore >= 7;

   const accounts = getAccounts();
const currentUserId = getCurrentUserId();

const accountIndex = accounts.findIndex(
    function(account) {
        return (
            String(account.id) ===
            String(currentUserId)
        );
    }
);

if (accountIndex !== -1) {

    if (
        passed &&
        !accounts[accountIndex].handlerCertified
    ) {
        const certificationDate =
            new Date();

        accounts[accountIndex].handlerCertified =
            true;

        accounts[accountIndex].handlerCertificationDate =
            certificationDate.toLocaleDateString();

        accounts[accountIndex].handlerCertificationTime =
            certificationDate.toLocaleTimeString(
                [],
                {
                    hour: "numeric",
                    minute: "2-digit"
                }
            );

        saveAccounts(accounts);
    }
}

const alreadyCertified =
    accountIndex !== -1 &&
    accounts[accountIndex].handlerCertified === true;

    let resultContent = "";

    if (passed) {
        resultContent = `
            <h1>🎉 Congratulations!</h1>

            <h2>You passed the ESSAzLife Handler Certification Exam!</h2>

            <div class="handler-score">
                ${handlerExamScore}/${totalQuestions} — ${percentage}%
            </div>

            <p>
                Your <strong>Handler Certificate</strong> and
                <strong>Handler Badge</strong> have been unlocked.
            </p>

            <p>
                You can <strong>view and download them anytime</strong>
                at the top of your <strong>Profile menu</strong>.
            </p>

            <p>
                <strong>
                    As a Certified Handler, you can now get your ESSAs
                    fully certified!
                </strong> 🐾
            </p>

            <p>
                Your ESSAs can now take the
                <strong>ESSA Certification Exam</strong>
                to earn their own certification.
            </p>
        `;
    } else {
        resultContent = `
            <h1>Uh-Oh!</h1>

            <h2>Looks like you forgot some of the material!</h2>

            <div class="handler-score">
                ${handlerExamScore}/${totalQuestions} — ${percentage}%
            </div>

            <p>
                Come back later and retake the exam!
                <strong>You've got this!</strong>
            </p>
        `;
    }

    let certificationMessage = "";

    if (alreadyCertified) {
        certificationMessage = `
            <p class="handler-certified-message">
                You can retake the exam as many times as you'd like,
                but you've already passed, so your
                <strong>Handler Certificate</strong> and
                <strong>Handler Badge</strong> will not go away!
            </p>
        `;
    }

    document.body.insertAdjacentHTML(
        "beforeend",
        `
        <div class="handler-results-overlay">
            <div class="handler-results-popup">

                ${resultContent}
                
                ${passed ? `
    <div class="handler-award-buttons">

        <button
            class="handler-action-button primary"
            onclick="openHandlerAward('Handler.Certificate.png', 'Handler Certificate')"
        >
            🏆 View & Download Certificate
        </button>

        <button
            class="handler-action-button primary"
            onclick="openHandlerAward('Handler.ID.Card.png', 'Handler ID Badge')"
        >
            🪪 View & Download Badge
        </button>

    </div>
` : ""}

                <button
                    class="handler-action-button primary"
                    onclick="reviewHandlerExamAnswers()"
                >
                    Review Your Answers
                </button>

                ${certificationMessage}

                <button
                    class="handler-results-close"
                    onclick="closeHandlerExamResults()"
                >
                    Close
                </button>

            </div>
        </div>
        `
    );
}

function closeHandlerExamResults() {
    const popup = document.querySelector(".handler-results-overlay");

    if (popup) {
        popup.remove();
    }
}

function reviewHandlerExamAnswers() {
    closeHandlerExamResults();

    let reportHTML = "";

    handlerExamAnswers.forEach(function(answerRecord, index) {
        const question = handlerExamQuestions[answerRecord.questionIndex];

        const selectedLetter =
            String.fromCharCode(65 + answerRecord.selectedAnswer);

        const selectedText =
            question.answers[answerRecord.selectedAnswer];

        const correctAnswers = question.correct.map(function(answerIndex) {
            const letter = String.fromCharCode(65 + answerIndex);
            const text = question.answers[answerIndex];

            return letter + ". " + text;
        }).join(" OR ");

        const resultClass = answerRecord.correct
            ? "correct"
            : "incorrect";

        const resultText = answerRecord.correct
            ? "✓ Correct"
            : "✕ Incorrect";

        reportHTML += `
            <div class="handler-review-card ${resultClass}">
                <div class="handler-review-heading">
                    <strong>Question ${index + 1}</strong>
                    <span>${resultText}</span>
                </div>

                <h3>${question.question}</h3>

                <p>
                    <strong>Your Answer:</strong><br>
                    ${selectedLetter}. ${selectedText}
                </p>

                <p>
                    <strong>Accepted Answer${question.correct.length > 1 ? "s" : ""}:</strong><br>
                    ${correctAnswers}
                </p>
            </div>
        `;
    });

    document.querySelector("main").innerHTML = `
        <div class="handler-exam handler-review">
            <h1>Handler Certification Exam Report</h1>

            <p>
                Review your answers from this exam attempt.
            </p>

            <div class="handler-review-list">
                ${reportHTML}
            </div>

            <button
                class="handler-action-button primary"
                onclick="startHandlerCertificationExam()"
            >
                Retake Exam
            </button>
        </div>
    `;
}

const handlerExamQuestions = [
    {
        question: "Your ESSA is distracted by something nearby, what should you do?",
        answers: [
            "Yell at them",
            "Pick Them Up",
            "Give them a treat",
            "Redirect their attention back to you"
        ],
        correct: [1, 3]
    },
    {
        question: "Your ESSA is dirty after an outdoor training session, what should you do?",
        answers: [
            "Nothing",
            "Wash them and dry them completely so they don't get moldy",
            "Put them under your bed",
            "Order a new one"
        ],
        correct: [1]
    },
    {
        question: "Someone wants to pet your ESSA, but you aren't comfortable, what should you do?",
        answers: [
            "Say no thank you",
            "Yell at the person \"Stranger Danger!\"",
            "Pick up your ESSA and have them growl at the person.",
            "Run away"
        ],
        correct: [0]
    },
    {
        question: "Your ESSA is hungry, and wants some food. What should you feed them?",
        answers: [
            "Whatever you are eating.",
            "Real pet food",
            "Recycled materials (plastic, paper, cardboard, clay, etc)",
            "All of the Above"
        ],
        correct: [2]
    },
    {
        question: "You are training a new ESSA and they refuse to put on their collar, what is the safest thing to do?",
        answers: [
            "Hold them steady and put it on them",
            "Cry and beg them to do it",
            "Allow them to sniff the collar to investigate",
            "Put the collar away and try again later or in a few days"
        ],
        correct: [2, 3]
    },
    {
        question: "Your ESSA needs to be brushed. They have long hair. Which brush should you use?",
        answers: [
            "A plastic brush",
            "A wire pet brush",
            "A fork",
            "My hands"
        ],
        correct: [1, 3]
    },
    {
        question: "You are not allowed to bring your ESSA out of your backpack in class, what is your best move?",
        answers: [
            "Keep them in your backpack and out of sight",
            "Argue with the teacher about why you should have it out",
            "Pass it around the room so everyone gets to pet it",
            "All of these are good options"
        ],
        correct: [0]
    },
    {
        question: "Your ESSA broke out of its collar and is running away. You are not in a dangerous place. What should you do?",
        answers: [
            "Run after them",
            "Call for help",
            "Stay where you are and call their name",
            "Yell angrily at them until they run back"
        ],
        correct: [2]
    },
    {
        question: "You brought your ESSA to the store with you on a leash and now you have to use the restroom...",
        answers: [
            "Put them on the floor",
            "Hang them on a coat hook",
            "Hold them",
            "Leave them outside the restroom"
        ],
        correct: [1, 2]
    },
    {
        question: "Someone barks or makes fun of your ESSA, what should you do?",
        answers: [
            "Walk away",
            "Scream for help",
            "Argue with the person",
            "Hold your ESSA tightly and ignore the person."
        ],
        correct: [0, 3]
    }
];

function openHandlerAward(imageFile, awardName) {

    const user = getCurrentUser();

    if (!user) {
        return;
    }

    if (!user.handlerCertified) {
        alert(
            "You must pass the Handler Certification Exam first."
        );
        return;
    }

    if (imageFile === "Handler.Certificate.png") {
        openHandlerCertificate(user);
        return;
    }

    if (imageFile === "Handler.ID.Card.png") {
        openHandlerBadge(user);
        return;
    }
}

function openHandlerCertificate(user) {

    const overlay =
        document.createElement("div");

    overlay.className =
        "handler-award-overlay";


    const popup =
        document.createElement("div");

    popup.className =
        "handler-award-popup";


    popup.innerHTML = `
        <h2>🏆 Handler Certificate</h2>

        <canvas
            id="handler-certificate-canvas"
        ></canvas>

        <div class="handler-award-popup-buttons">

            <button
                class="handler-action-button primary"
                onclick="downloadHandlerCertificate()"
            >
                Download Certificate
            </button>

            <button
                class="handler-results-close"
                onclick="closeHandlerAward()"
            >
                Close
            </button>

        </div>
    `;


    overlay.appendChild(
        popup
    );

    document.body.appendChild(
        overlay
    );


    const canvas =
        document.getElementById(
            "handler-certificate-canvas"
        );

    const context =
        canvas.getContext("2d");


    const certificateImage =
        new Image();


    certificateImage.onload =
        function() {

            canvas.width =
                certificateImage.naturalWidth;

            canvas.height =
                certificateImage.naturalHeight;


            context.drawImage(
                certificateImage,
                0,
                0
            );


            drawHandlerCertificateText(
                context,
                canvas,
                user
            );
        };


    certificateImage.src =
        "Handler.Certificate.png";
}

function drawHandlerCertificateText(
    context,
    canvas,
    user
) {

    const handlerName =
    user.handlerAwardName ||
    user.nickname ||
    user.username ||
    "Certified Handler";


const handlerUsername =
    user.handlerAwardUsername ||
    user.username ||
    "";


const handlerDisplayName =
    handlerUsername
        ? `${handlerName} (@${handlerUsername.replace(/^@/, "")})`
        : handlerName;

    const certificationDate =
        user.handlerCertificationDate ||
        "";


    const certificationTime =
        user.handlerCertificationTime ||
        "";


    context.fillStyle =
        "#000000";

    context.textAlign =
        "center";

    context.textBaseline =
        "middle";


    // Certification Date
    context.font =
        "24px Arial";

    context.fillText(
        certificationDate,
        canvas.width * 0.505,
        canvas.height * 0.385
    );


    // Certification Time
    context.fillText(
        certificationTime,
        canvas.width * 0.745,
        canvas.height * 0.385
    );


    // Handler Name
    context.font =
        "bold 27px Arial";

    context.fillText(
    handlerDisplayName,
    canvas.width * 0.345,
    canvas.height * 0.425
);
}

function downloadHandlerCertificate() {

    const canvas =
        document.getElementById(
            "handler-certificate-canvas"
        );

    if (!canvas) {
        return;
    }


    const user =
        getCurrentUser();


    const handlerName =
        user?.handlerAwardName ||
        user?.nickname ||
        user?.username ||
        "Handler";


    const safeName =
        handlerName
            .replace(
                /[^a-z0-9]/gi,
                "-"
            )
            .replace(
                /-+/g,
                "-"
            );


    const downloadLink =
        document.createElement("a");


    downloadLink.download =
        `${safeName}-ESSAzLife-Handler-Certificate.png`;


    downloadLink.href =
        canvas.toDataURL(
            "image/png"
        );


    downloadLink.click();
}

function downloadEssaCertificate(essaId) {

    const canvas =
        document.getElementById(
            "essa-certificate-canvas"
        );

    if (!canvas) {
        return;
    }


    const essa =
    getEssaById(
        essaId
    );

    const essaName =
        essa?.name ||
        "ESSA";


    const safeName =
        essaName
            .replace(
                /[^a-z0-9]/gi,
                "-"
            )
            .replace(
                /-+/g,
                "-"
            );


    const downloadLink =
        document.createElement("a");


    downloadLink.download =
        `${safeName}-ESSAzLife-ESSA-Certificate.png`;


    downloadLink.href =
        canvas.toDataURL(
            "image/png"
        );


    downloadLink.click();
}


function closeHandlerAward() {

    const overlay =
        document.querySelector(
            ".handler-award-overlay"
        );


    if (overlay) {
        overlay.remove();
    }
}

function openHandlerBadge(user) {

    const overlay =
        document.createElement("div");

    overlay.className =
        "handler-award-overlay";


    const popup =
        document.createElement("div");

    popup.className =
        "handler-award-popup";


    popup.innerHTML = `
        <h2>🪪 Handler Badge</h2>

        <canvas
            id="handler-badge-canvas"
        ></canvas>

        <div class="handler-award-popup-buttons">

            <button
                class="handler-action-button primary"
                onclick="downloadHandlerBadge()"
            >
                Download Badge
            </button>

            <button
                class="handler-results-close"
                onclick="closeHandlerAward()"
            >
                Close
            </button>

        </div>
    `;


    overlay.appendChild(
        popup
    );

    document.body.appendChild(
        overlay
    );


    const canvas =
        document.getElementById(
            "handler-badge-canvas"
        );

    const context =
        canvas.getContext("2d");


    const badgeImage =
        new Image();


    badgeImage.onload =
        function() {

            canvas.width =
                badgeImage.naturalWidth;

            canvas.height =
                badgeImage.naturalHeight;


            context.drawImage(
                badgeImage,
                0,
                0
            );


            drawHandlerBadgeText(
                context,
                canvas,
                user
            );
        };


    badgeImage.src =
        "Handler.ID.Card.png";
}

function drawHandlerBadgeText(
    context,
    canvas,
    user
) {

    const handlerName =
        user.handlerAwardName ||
        user.nickname ||
        user.username ||
        "Certified Handler";


    const handlerUsername =
        user.handlerAwardUsername ||
        user.username ||
        "";


    const handlerDisplayName =
        handlerUsername
            ? `${handlerName} (@${handlerUsername.replace(/^@/, "")})`
            : handlerName;


    const pronouns =
        user.pronouns ||
        "Prefer not to say";


    const ageGroup =
        user.ageGroup ||
        "Prefer not to say";


    const certificationDate =
        user.handlerCertificationDate ||
        "";


    const certificationTime =
        user.handlerCertificationTime ||
        "";


    context.fillStyle = "#000000";

    context.textAlign = "center";

    context.textBaseline = "alphabetic";

    context.font = "30px Arial";


    // Name
context.fillText(
    handlerDisplayName,
    canvas.width * 0.685,
    canvas.height * 0.315
);


// Pronouns
context.fillText(
    pronouns,
    canvas.width * 0.705,
    canvas.height * 0.387
);


// Age Group
context.fillText(
    ageGroup,
    canvas.width * 0.71,
    canvas.height * 0.462
);


// Date of Certification
context.fillText(
    certificationDate,
    canvas.width * 0.78,
    canvas.height * 0.539
);


// Time
context.fillText(
    certificationTime,
    canvas.width * 0.68,
    canvas.height * 0.609
);

}

function downloadHandlerBadge() {

    const canvas =
        document.getElementById(
            "handler-badge-canvas"
        );

    if (!canvas) {
        return;
    }


    const user =
        getCurrentUser();


    const handlerName =
        user?.handlerAwardName ||
        user?.nickname ||
        user?.username ||
        "Handler";


    const safeName =
        handlerName
            .replace(
                /[^a-z0-9]/gi,
                "-"
            )
            .replace(
                /-+/g,
                "-"
            );


    const downloadLink =
        document.createElement("a");


    downloadLink.download =
        `${safeName}-ESSAzLife-Handler-Badge.png`;


    downloadLink.href =
        canvas.toDataURL(
            "image/png"
        );


    downloadLink.click();
}

function openEssaIdCard(essaId) {

        currentEssaIdCardId = essaId;

    const essa =
        getEssaById(essaId);

    if (!essa) {
        return;
    }


    const overlay =
        document.createElement("div");

    overlay.className =
        "handler-award-overlay";


    const popup =
        document.createElement("div");

    popup.className =
        "handler-award-popup";


    popup.innerHTML = `
        <h2>🪪 ESSA Certification ID Card</h2>

        <canvas
            id="essa-id-card-canvas"
        ></canvas>

        <div class="handler-award-popup-buttons">

            <button
                class="handler-action-button primary"
                onclick="downloadEssaIdCard()"
            >
                Download ID Card
            </button>

            <button
                class="handler-results-close"
                onclick="closeHandlerAward()"
            >
                Close
            </button>

        </div>
    `;


    overlay.appendChild(
        popup
    );

    document.body.appendChild(
        overlay
    );


    const canvas =
        document.getElementById(
            "essa-id-card-canvas"
        );

    const context =
        canvas.getContext("2d");


    const cardImage =
        new Image();


    cardImage.onload =
        function() {

            canvas.width =
                cardImage.naturalWidth;

            canvas.height =
                cardImage.naturalHeight;


            context.drawImage(
    cardImage,
    0,
    0
);

const user =
    getCurrentUser();


if (essa.photo) {

    const essaPhoto =
        new Image();
    essaPhoto.crossOrigin = "anonymous";

    essaPhoto.onload =
        function() {

            context.save();

            context.beginPath();

            context.roundRect(
    canvas.width * 0.035,
    canvas.height * 0.285,
    canvas.width * 0.295,
    canvas.height * 0.505,
    18
);

            context.clip();


            const photoX =
    canvas.width * 0.035;

const photoY =
    canvas.height * 0.285;

const photoWidth =
    canvas.width * 0.295;

const photoHeight =
    canvas.height * 0.505;


const imageRatio =
    essaPhoto.width /
    essaPhoto.height;

const boxRatio =
    photoWidth /
    photoHeight;


let sourceX = 0;
let sourceY = 0;
let sourceWidth =
    essaPhoto.width;

let sourceHeight =
    essaPhoto.height;


if (imageRatio > boxRatio) {

    sourceWidth =
        essaPhoto.height *
        boxRatio;

    const maxSourceX =
        essaPhoto.width -
        sourceWidth;

    sourceX =
        maxSourceX *
        ((essa.photoPositionX ?? 50) / 100);

} else {

    sourceHeight =
        essaPhoto.width /
        boxRatio;

    const maxSourceY =
        essaPhoto.height -
        sourceHeight;

    sourceY =
        maxSourceY *
        ((essa.photoPositionY ?? 50) / 100);
}


context.drawImage(
    essaPhoto,

    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,

    photoX,
    photoY,
    photoWidth,
    photoHeight
);


            context.restore();


            drawEssaIdCardText(
                context,
                canvas,
                essa,
                user
            );
        };

    essaPhoto.src =
        essa.photo;

} else {

    drawEssaIdCardText(
        context,
        canvas,
        essa,
        user
    );
}
        };


    cardImage.src =
        "ESSA.ID.Card.png";
}

function drawEssaIdCardText(
    context,
    canvas,
    essa,
    user
) {

    const handlerName =
        user?.handlerAwardName ||
        user?.nickname ||
        user?.username ||
        "Handler";


    const handlerUsername =
        user?.handlerAwardUsername ||
        user?.username ||
        "";


    const handlerDisplayName =
        handlerUsername
            ? `${handlerName} (@${handlerUsername.replace(/^@/, "")})`
            : handlerName;


    context.fillStyle =
        "#000000";

    context.textAlign =
    "center";

    context.textBaseline =
        "middle";

    context.font =
        "24px Arial";


    // Plush Name
context.fillText(
    essa.name || "",
    canvas.width * 0.75,
    canvas.height * 0.304
);


// Species
context.fillText(
    essa.species || "",
    canvas.width * 0.75,
    canvas.height * 0.36
);


// Breed
context.fillText(
    essa.breed || "",
    canvas.width * 0.75,
    canvas.height * 0.42
);


// Colors
context.fillText(
    essa.plushColor || "",
    canvas.width * 0.75,
    canvas.height * 0.48
);


// Handler Name
context.fillText(
    handlerDisplayName,
    canvas.width * 0.75,
    canvas.height * 0.54
);


// Date of Certification
context.fillText(
    essa.essaCertificationDate || "",
    canvas.width * 0.75,
    canvas.height * 0.60
);


// Time
context.fillText(
    essa.essaCertificationTime || "",
    canvas.width * 0.75,
    canvas.height * 0.65
);
}

function downloadEssaIdCard() {

    const canvas =
        document.getElementById(
            "essa-id-card-canvas"
        );

    if (!canvas) {
        return;
    }


    const essa =
        getEssaById(
            currentEssaCertificationId
        );


    const essaName =
        essa?.name ||
        "ESSA";


    const safeName =
        essaName
            .replace(
                /[^a-z0-9]/gi,
                "-"
            )
            .replace(
                /-+/g,
                "-"
            );


    const downloadLink =
        document.createElement("a");


    downloadLink.download =
        `${safeName}-ESSAzLife-Certification-ID-Card.png`;


    downloadLink.href =
        canvas.toDataURL(
            "image/png"
        );


    downloadLink.click();
}

function downloadEssaIdCard() {

    const canvas =
        document.getElementById(
            "essa-id-card-canvas"
        );

    if (!canvas) {
        return;
    }


    const essa =
        getEssaById(
            currentEssaIdCardId
        );

    if (!essa) {
        return;
    }


    const safeName =
        (essa.name || "ESSA")
            .replace(
                /[^a-z0-9]/gi,
                "-"
            )
            .replace(
                /-+/g,
                "-"
            );


    const downloadLink =
        document.createElement("a");


    downloadLink.download =
        `${safeName}-ESSAzLife-Certification-ID-Card.png`;


    downloadLink.href =
        canvas.toDataURL(
            "image/png"
        );


    downloadLink.click();
}

function openHandlerAwardEditor() {

    const user =
        getCurrentUser();

    if (!user) {
        return;
    }


    const awardName =
        user.handlerAwardName ||
        user.nickname ||
        user.username ||
        "";


    const awardUsername =
        user.handlerAwardUsername ||
        user.username ||
        "";


    const overlay =
        document.createElement("div");

    overlay.className =
        "handler-award-overlay";


    const popup =
        document.createElement("div");

    popup.className =
        "handler-award-popup";


    popup.innerHTML = `
        <h2>
            ✏️ Edit Certificate & Badge Information
        </h2>

        <p>
            These changes only affect your
            Handler Certificate and Handler Badge.
        </p>

        <label>
            Name
        </label>

        <input
            id="handler-award-name"
            type="text"
            value="${escapeHTML(awardName)}"
        >


        <label>
            Username
        </label>

        <input
            id="handler-award-username"
            type="text"
            value="${escapeHTML(awardUsername)}"
        >


        <div class="handler-award-popup-buttons">

            <button
                class="handler-action-button primary"
                onclick="saveHandlerAwardInformation()"
            >
                Save
            </button>

            <button
                class="profile-handler-edit-button"
                onclick="useProfileHandlerAwardInformation()"
            >
                Use Profile Information
            </button>

            <button
                class="handler-results-close"
                onclick="closeHandlerAward()"
            >
                Cancel
            </button>

        </div>
    `;


    overlay.appendChild(
        popup
    );

    document.body.appendChild(
        overlay
    );
}

function saveHandlerAwardInformation() {

    const accounts =
        getAccounts();

    const currentUserId =
        getCurrentUserId();


    const accountIndex =
        accounts.findIndex(
            function(account) {

                return (
                    String(account.id) ===
                    String(currentUserId)
                );
            }
        );


    if (accountIndex === -1) {
        return;
    }


    const awardName =
        document
            .getElementById(
                "handler-award-name"
            )
            .value
            .trim();


    const awardUsername =
        document
            .getElementById(
                "handler-award-username"
            )
            .value
            .trim();


    accounts[
        accountIndex
    ].handlerAwardName =
        awardName;


    accounts[
        accountIndex
    ].handlerAwardUsername =
        awardUsername.replace(
            /^@/,
            ""
        );


    saveAccounts(
        accounts
    );


    closeHandlerAward();
}


function useProfileHandlerAwardInformation() {

    const accounts =
        getAccounts();

    const currentUserId =
        getCurrentUserId();


    const accountIndex =
        accounts.findIndex(
            function(account) {

                return (
                    String(account.id) ===
                    String(currentUserId)
                );
            }
        );


    if (accountIndex === -1) {
        return;
    }


    delete accounts[
        accountIndex
    ].handlerAwardName;


    delete accounts[
        accountIndex
    ].handlerAwardUsername;


    saveAccounts(
        accounts
    );


    closeHandlerAward();
}

function startEssaCertification(
    essaId
) {

    const user =
        getCurrentUser();

    const essa =
        getEssaById(
            essaId
        );


    if (!user || !essa) {
        return;
    }


    if (!user.handlerCertified) {

        alert(
            "You must become a Certified Handler before certifying an ESSA."
        );

        return;
    }


        const essaVisual =
        essa.photo

            ? `
                <img
                    src="${essa.photo}"
                    alt="${escapeHTML(essa.name)}"
                    style="
                        width:180px;
                        height:180px;
                        object-fit:cover;
                        border-radius:20px;
                        border:1px solid #dbe5e7;
                    "
                >
            `

            : `
                <div
                    style="
                        width:180px;
                        height:180px;
                        margin:auto;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        border-radius:20px;
                        border:1px solid #dbe5e7;
                        background:white;
                        font-size:90px;
                    "
                >
                    ${essa.icon || "🐾"}
                </div>
            `;


    document.querySelector(
        "main"
    ).innerHTML = `

        ${makeAppTabs(
            "Home"
        )}

        <div class="handler-exam">

            <h1>
                ESSAzLife ESSA Certification Exam
            </h1>


            <div class="handler-exam-info">

                <p>
                    <strong>Please Note:</strong>
                    This ESSA Certification Exam is designed
                    for entertainment and roleplay purposes only.
                    Some questions are written realistically to
                    create a more immersive ESSA training experience.
                </p>


                <p>
                    <strong>Directions:</strong>
                    Answer each question based on your ESSA's
                    current training, behavior, and role in
                    supporting you. Your ESSA must score
                    <strong>70% or higher (7/10)</strong>
                    to become ESSAzLife Certified.
                </p>

            </div>


            <div
                style="
                    margin:30px 0 20px;
                    text-align:center;
                "
            >

                ${essaVisual}


                <h3
                    style="
                        margin:18px 0 5px;
                    "
                >
                    ESSA Being Certified:
                </h3>


                <h2
                    style="
                        margin:5px 0 25px;
                    "
                >
                    ${escapeHTML(
                        essa.name
                    )}
                </h2>


                <button
                    class="handler-action-button primary"
                    onclick="
                        beginEssaCertificationExam(
                            '${essa.id}'
                        )
                    "
                >
                    Start Exam
                </button>

            </div>

        </div>
    `;
}

const essaCertificationQuestions = [

    {
        question:
            "Does holding or interacting with this ESSA provide comfort or emotional support when needed?"
    },

    {
        question:
            "Can this ESSA safely perform at least one trained positioning or stopping command, such as “Middle,” “Up,” “Stay,” or another command used by their Handler?"
    },

    {
        question:
            "Does this ESSA respond to their name or another cue used to get their attention?"
    },

    {
        question:
            "Can this ESSA remain calm around other ESSAs without frequently arguing, interfering with them, or causing problems?"
    },

    {
        question:
            "When this ESSA becomes distracted, can their attention usually be redirected back to their Handler or activity?"
    },

    {
        question:
            "Can this ESSA remain calm when someone or another ESSA is near their toys, treats, food, or belongings?"
    },

    {
        question:
            "If this ESSA becomes frightened, can they settle down with reassurance, comfort, or help from their Handler?"
    },

    {
        question:
            "Can this ESSA successfully perform at least one trained task or trick for their Handler?",
        note:
            "Examples may include retrieving an item, sitting, staying, positioning, providing comfort, or another task chosen by the Handler."
    },

    {
        question:
            "Can this ESSA behave appropriately during indoor activities and outings according to the Handler's training rules?"
    },

    {
        question:
            "Is this ESSA's texture, appearance, size, weight, or overall presence comforting to their Handler when emotional support is needed?"
    }

    
];

let currentEssaCertificationId = null;

let currentEssaIdCardId = null;

let currentEssaCertificationQuestion = 0;

let essaCertificationScore = 0;

let essaCertificationAnswers = [];

function beginEssaCertificationExam(essaId) {

    const essa = getEssaById(essaId);

    if (!essa) return;


    currentEssaCertificationId = essaId;

    currentEssaCertificationQuestion = 0;

    essaCertificationScore = 0;

    essaCertificationAnswers = [];


    showEssaCertificationQuestion();
}

function showEssaCertificationQuestion() {

    const essa =
        getEssaById(currentEssaCertificationId);

    if (!essa) return;


    const question =
        essaCertificationQuestions[
            currentEssaCertificationQuestion
        ];


    document.querySelector("main").innerHTML = `

        ${makeAppTabs("Home")}

        <div class="handler-exam">

            <h1>
                🏆 ESSA Certification Exam
            </h1>

            <p
                style="
                    text-align:center;
                    color:#68777b;
                    font-weight:bold;
                "
            >
                ${escapeHTML(essa.name)}
                •
                Question
                ${currentEssaCertificationQuestion + 1}
                of
                ${essaCertificationQuestions.length}
            </p>


            <div class="handler-exam-info">

                <h2>
                    ${question.question}
                </h2>

                ${
                    question.note

                        ? `
                            <p>
                                ${question.note}
                            </p>
                        `

                        : ""
                }

            </div>


            <div class="handler-answer-options">

                <button
                    class="handler-action-button"
                    onclick="
                        answerEssaCertification(
                            'Yes'
                        )
                    "
                >
                    Yes
                </button>


                <button
                    class="handler-action-button"
                    onclick="
                        answerEssaCertification(
                            'No'
                        )
                    "
                >
                    No
                </button>

            </div>

        </div>
    `;
}

function answerEssaCertification(answer) {

    essaCertificationAnswers.push(answer);


    if (answer === "Yes") {

        essaCertificationScore++;

    }


    currentEssaCertificationQuestion++;


    if (
        currentEssaCertificationQuestion <
        essaCertificationQuestions.length
    ) {

        showEssaCertificationQuestion();

    } else {

        showEssaCertificationResults();

    }
}

function showEssaCertificationResults() {

    const essa =
        getEssaById(currentEssaCertificationId);

    if (!essa) return;


    const passed =
        essaCertificationScore >= 7;
    
    if (passed) {

    certifyEssa(currentEssaCertificationId);

}


    document.querySelector("main").innerHTML = `

        ${makeAppTabs("Home")}

        <div class="handler-exam">

            <h1>
                ${
                    passed
                        ? "🎉 Congratulations! Your ESSA Passed!"
                        : "🐾 Oops! Not quite yet!"
                }
            </h1>


            <div class="handler-exam-info">

                <h2
                    style="
                        text-align:center;
                        color:var(--user-theme-color, #4fb5ae);
                    "
                >
                    Score:
                    ${essaCertificationScore} / 10
                </h2>


                ${
                    passed

                        ? `
                            <p>
                                Your ESSA has successfully completed
                                the ESSAzLife Certification Exam and
                                is now considered a Fully Trained and
                                Certified Emotional Support Stuffed Animal!
                            </p>

                            <p>
                                Your ESSA's Certification Card and
                                Training Certificate have been awarded
                                and will remain available from their
                                ESSA Profile. You may view, download,
                                save, or print them whenever you'd like.
                            </p>
                        `

                        : `
                            <p>
                                It looks like this Plush may need a
                                little more time and training before
                                becoming a Fully Trained and Certified
                                Emotional Support Stuffed Animal.
                            </p>

                            <p>
                                Keep practicing and come back later
                                to retry the exam. You've got this!
                            </p>
                        `
                }

            </div>


            <button
                class="handler-action-button primary"
                onclick="
                    showEssaProfile(
                        '${essa.id}'
                    )
                "
            >
                Return to ${escapeHTML(essa.name)}'s Profile
            </button>

        </div>
    `;
}

function certifyEssa(essaId) {

    const essas = getSavedEssas();

    const essa = essas.find(
        item => String(item.id) === String(essaId)
    );

    if (!essa) return;


    // Only set the certification date/time the FIRST time they pass.
    if (!essa.essaCertified) {

        const now = new Date();

        essa.essaCertified = true;

        essa.essaCertificationDate =
            now.toLocaleDateString();

        essa.essaCertificationTime =
            now.toLocaleTimeString();
    }


    saveEssas(essas);
}

function openEssaCertificate(essaId) {

    const essa =
        getEssaById(essaId);

    const user =
        getCurrentUser();


    if (!essa || !user) return;


    if (!essa.essaCertified) {

        alert(
            "This ESSA must pass the ESSA Certification Exam first."
        );

        return;
    }


    const overlay =
        document.createElement("div");

    overlay.className =
        "handler-award-overlay";


    const popup =
        document.createElement("div");

    popup.className =
        "handler-award-popup";


    popup.innerHTML = `

        <h2>
            🏆 ${escapeHTML(essa.name)}'s Training Certificate
        </h2>


        <canvas
    id="essa-certificate-canvas"

    style="
        width:100%;
        max-width:850px;
        height:auto;
        display:block;
        margin:0 auto;
    "
></canvas>


        <div class="handler-award-popup-buttons">

            <button
                class="handler-action-button primary"
                onclick="
                    downloadEssaCertificate(
                        '${essa.id}'
                    )
                "
            >
                Download Certificate
            </button>


            <button
                class="handler-results-close"
                onclick="
                    closeHandlerAward()
                "
            >
                Close
            </button>

        </div>
    `;


    overlay.appendChild(popup);

    document.body.appendChild(overlay);


    const canvas =
        document.getElementById(
            "essa-certificate-canvas"
        );


    const context =
        canvas.getContext("2d");


    const certificateImage =
        new Image();


    certificateImage.onload =
        function() {

            canvas.width =
                certificateImage.naturalWidth;

            canvas.height =
                certificateImage.naturalHeight;


            context.drawImage(
                certificateImage,
                0,
                0
            );


            drawEssaCertificateText(
                context,
                canvas,
                essa,
                user
            );
        };


    certificateImage.src =
        "ESSA.Certificate.png";
}

function drawEssaCertificateText(
    context,
    canvas,
    essa,
    user
) {

    const handlerName =
        user.handlerAwardName ||
        user.nickname ||
        user.username ||
        "Certified Handler";


    const handlerUsername =
        user.handlerAwardUsername ||
        user.username ||
        "";


    const handlerDisplayName =
        handlerUsername
            ? `${handlerName} (@${handlerUsername.replace(/^@/, "")})`
            : handlerName;


    context.fillStyle =
        "#000000";

    context.textAlign =
        "left";

    context.textBaseline =
        "middle";

    context.font =
        "24px Arial";


   // Certification Date
context.font =
    "24px Arial";

context.textAlign =
    "center";

context.fillText(
    essa.essaCertificationDate || "",
    canvas.width * 0.415,
    canvas.height * 0.689
);


// Certification Time
context.fillText(
    essa.essaCertificationTime || "",
    canvas.width * 0.415,
    canvas.height * 0.735
);


// ESSA Name
context.font =
    "bold 25px Arial";

context.fillText(
    essa.name || "",
    canvas.width * 0.43,
    canvas.height * 0.787
);


// Handler Name
context.fillText(
    handlerDisplayName,
    canvas.width * 0.46,
    canvas.height * 0.838
);
}

/* =========================================================
   RETURN TO ESSAZLIFE WORLD
========================================================= */

const worldButton = document.getElementById("world-button");

worldButton.addEventListener("click", function () {
    window.location.href = "../../index.html";
});