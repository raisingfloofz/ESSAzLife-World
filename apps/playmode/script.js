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
   ESSAzLife
   FULL SCRIPT.JS
========================================================= */


/* =========================================================
   GLOBAL STORAGE
========================================================= */

const ACCOUNTS_KEY = "essazLifeAccounts";
const SESSION_KEY = "essazLifeCurrentUser";

let pendingWelcomeCredentials = null;



/* =========================================================
   PLAYABLE ESSAs
========================================================= */

const playableEssas = [

    {
        id: "moocow",
        name: "MooCow",
        image: "play-essas/MooCow.png",
        fallbackIcon: "🐮",
        unlockLevel: 1
    },

    {
        id: "daisybelle",
        name: "DaisyBelle",
        image: "play-essas/daisybelle.png",
        fallbackIcon: "🐮",
        unlockLevel: 10
    },

    {
        id: "oreo",
        name: "Oreo",
        image: "play-essas/oreo.png",
        fallbackIcon: "🐶",
        unlockLevel: 20
    },

    {
        id: "stormy",
        name: "Stormy",
        image: "play-essas/stormy.png",
        fallbackIcon: "🐶",
        unlockLevel: 30
    },

    {
        id: "mudpie",
        name: "Mudpie",
        image: "play-essas/mudpie.png",
        fallbackIcon: "🐶",
        unlockLevel: 40
    },

    {
        id: "mocha",
        name: "Mocha",
        image: "play-essas/mocha.png",
        fallbackIcon: "🐶",
        unlockLevel: 50
    },

    {
        id: "moose",
        name: "Moose",
        image: "play-essas/moose.png",
        fallbackIcon: "🐶",
        unlockLevel: 60
    },

    {
        id: "lily",
        name: "Lily",
        image: "play-essas/lily.png",
        fallbackIcon: "🐶",
        unlockLevel: 70
    }



];

/* =========================================================
   STARTER ESSAs
========================================================= */

const starterEssaIds = [
    "moocow",
    "daisybelle"
];

/* =========================================================
   CHOOSE STARTER ESSA
========================================================= */

function renderStarterEssaSelection() {

    resetPageTheme();


    const starterEssas =
        playableEssas.filter(
            function(essa) {

                return starterEssaIds.includes(
                    essa.id
                );

            }
        );


    const cards =
        starterEssas
            .map(
                function(essa) {

                    return `

                        <div
                            style="
                                padding:22px;
                                background:white;
                                border:1px solid #dbe5e7;
                                border-radius:20px;
                                text-align:center;
                                box-shadow:
                                    0 4px 14px
                                    rgba(0,0,0,.06);
                            "
                        >

                            ${makePlayableEssaVisual(
                                essa,
                                false
                            )}

                            <h2>
                                ${escapeHTML(
                                    essa.name
                                )}
                            </h2>

                            <button
                                class="
                                    play-action-button
                                    primary
                                "

                                onclick="
                                    chooseStarterEssa(
                                        '${essa.id}'
                                    )
                                "
                            >
                                Choose
                                ${escapeHTML(
                                    essa.name
                                )}
                            </button>

                        </div>

                    `;

                }
            )
            .join("");


    document.querySelector(
        "main"
    ).innerHTML = `

        <div
            style="
                max-width:700px;
                margin:0 auto;
            "
        >

            <h1
                style="
                    color:
                        var(
                            --page-text-color,
                            #17313a
                        );
                "
            >
                🐾 Choose Your Starter ESSA
            </h1>

            <p
                style="
                    color:
                        var(
                            --page-text-color,
                            #68777b
                        );

                    line-height:1.5;
                "
            >
                Choose the ESSA who will
                start your Play Mode
                adventure with you!
            </p>

            <div
                style="
                    display:grid;

                    grid-template-columns:
                        repeat(
                            2,
                            minmax(0, 1fr)
                        );

                    gap:20px;

                    margin-top:25px;
                "
            >
                ${cards}
            </div>

        </div>

    `;
}

/* =========================================================
   CHOOSE STARTER ESSA
========================================================= */

function chooseStarterEssa(essaId) {

    if (
        !starterEssaIds.includes(
            essaId
        )
    ) {
        return;
    }


    const essa =
        playableEssas.find(
            function(item) {

                return item.id === essaId;

            }
        );


    if (!essa) {
        return;
    }


    const playData =
        getSavedPlayData();


    const houseData =
        getSavedPlayHouseData();


    /*
        A starter can only be chosen once.
    */
    if (
        playData.hasChosenStarterEssa
    ) {
        return;
    }


    /*
        Give the player ONLY
        their chosen starter.
    */
    playData.unlockedEssaIds = [
        essaId
    ];


    playData.selectedEssaId =
        essaId;


    playData.hasChosenStarterEssa =
        true;


    /*
        Create the starter's needs/stats.
    */
    getPlayEssaStats(
        playData,
        essaId
    );


    /*
        Start in the Playroom.
    */
    houseData.currentRoomId =
        "playroom";


    /*
        Put the chosen starter
        in the Playroom.
    */
    houseData.essaRooms[
        essaId
    ] =
        "playroom";


    /*
        Give the starter an initial
        position in the room.
    */
    if (
        !houseData.essaPositions[
            essaId
        ]
    ) {

       houseData.essaPositions[
    essaId
] = {

    x: 50,

    floor: 4

};
    }


    savePlayData(
        playData
    );


    savePlayHouseData(
        houseData
    );


    renderPlayRoom();
}

/* =========================================================
   PLAY HOUSE ROOMS
========================================================= */

const playRooms = [

    {
        id: "playroom",
        name: "Playroom",
        icon: "🛋️",
        background: "play-room/playroom.png"
    },

    {
        id: "kitchen",
        name: "Kitchen",
        icon: "🍳",
        background: "play-room/kitchen.png"
    },

    {
        id: "bathroom",
        name: "Bathroom",
        icon: "🛁",
        background: "play-room/bathroom.png"
    },

    {
        id: "bedroom",
        name: "Bedroom",
        icon: "🛏️",
        background: "play-room/bedroom.png"
    },

    {
        id: "backyard",
        name: "Backyard",
        icon: "🌳",
        background: "play-room/backyard.png"
    },

    {
        id: "arcade",
        name: "Arcade",
        icon: "🕹️",
        background: "play-room/arcade.png"
    }

];


/* =========================================================
   PLAY MODE ITEMS
========================================================= */

const playFoods = [

    {
        id: "apple",
        name: "Apple",
        icon: "🍎",
        food: 18,
        happiness: 2,
        xp: 4
    },

    {
        id: "carrot",
        name: "Carrot",
        icon: "🥕",
        food: 16,
        happiness: 1,
        xp: 4
    },

    {
        id: "sandwich",
        name: "Sandwich",
        icon: "🥪",
        food: 24,
        happiness: 3,
        xp: 5
    },

    {
        id: "pizza",
        name: "Pizza",
        icon: "🍕",
        food: 28,
        happiness: 5,
        xp: 6
    },

    {
        id: "cookie",
        name: "Cookie",
        icon: "🍪",
        food: 12,
        happiness: 8,
        xp: 5
    },

    {
        id: "strawberry",
        name: "Strawberry",
        icon: "🍓",
        food: 15,
        happiness: 4,
        xp: 4
    }
];


const playDrinks = [

    {
        id: "water",
        name: "Water",
        icon: "💧",
        water: 25,
        happiness: 1,
        xp: 10
    },

    {
        id: "milk",
        name: "Milk",
        icon: "🥛",
        water: 20,
        happiness: 3,
        xp: 5
    },

    {
        id: "juice",
        name: "Fruit Juice",
        icon: "🧃",
        water: 22,
        happiness: 5,
        xp: 5
    },

    {
        id: "lemonade",
        name: "Lemonade",
        icon: "🍋",
        water: 22,
        happiness: 6,
        xp: 5
    },

    {
        id: "hot-cocoa",
        name: "Hot Cocoa",
        icon: "☕",
        water: 16,
        happiness: 8,
        xp: 6
    },

    {
        id: "smoothie",
        name: "Smoothie",
        icon: "🥤",
        water: 20,
        happiness: 7,
        xp: 6
    }
];


const playSoaps = [

    {
        id: "teal",
        name: "Teal Soap",
        color: "#4fb5ae",
        cleanliness: 30,
        xp: 6
    },

    {
        id: "pink",
        name: "Pink Soap",
        color: "#f59ab2",
        cleanliness: 30,
        xp: 6
    },

    {
        id: "purple",
        name: "Purple Soap",
        color: "#a98be8",
        cleanliness: 30,
        xp: 6
    },

    {
        id: "blue",
        name: "Blue Soap",
        color: "#79b8f3",
        cleanliness: 30,
        xp: 6
    },

    {
        id: "green",
        name: "Green Soap",
        color: "#8acb88",
        cleanliness: 30,
        xp: 6
    },

    {
        id: "yellow",
        name: "Yellow Soap",
        color: "#f4d76b",
        cleanliness: 30,
        xp: 6
    }
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

/* =========================================================
   CONNECT WORLD ACCOUNT TO PLAYMODE
========================================================= */

function connectWorldAccountToPlayMode() {

    const worldAccount =
        getWorldAccount();

    if (!worldAccount) {
        return null;
    }

    const accounts =
        getAccounts();

    /*
        Preserve the existing PlayMode account ID
        whenever possible because PlayMode data is
        stored using that internal ID.
    */
    const currentPlayModeId =
        getCurrentUserId();

    let playModeAccount =
        accounts.find(
            function(account) {

                return (
                    String(account.id) ===
                    String(currentPlayModeId)
                );
            }
        );


    /*
        If there is no current PlayMode account,
        look for one with the same username.
    */
    if (!playModeAccount) {

        playModeAccount =
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
        If this World user has never used
        PlayMode before, create a local
        PlayMode data profile.
    */
    if (!playModeAccount) {

        playModeAccount = {

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
            playModeAccount
        );
    }


    /*
        World owns nickname and username.
    */
    playModeAccount.username =
        worldAccount.username || "";

    playModeAccount.nickname =
        worldAccount.nickname ||
        worldAccount.username ||
        "";


    /*
        World handles authentication.
    */
    delete playModeAccount.email;
    delete playModeAccount.passwordSalt;
    delete playModeAccount.passwordHash;
    delete playModeAccount.recoveryBirthMonth;
    delete playModeAccount.recoveryBirthDay;
    delete playModeAccount.recoveryMiddleName;
    delete playModeAccount.recoveryLastName;

    playModeAccount.worldManaged =
        true;


    saveAccounts(
        accounts
    );

    setCurrentUserId(
        playModeAccount.id
    );

    return playModeAccount;
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

function getDefaultPlayData() {

    return {

        trainerXP: 0,

        trainerLevel: 1,

        coins: 0,

        pendingCoins: 0,

        playroomCoins: [],

        unlockedEssaIds: [],

        selectedEssaId: null,

        hasChosenStarterEssa: false,

        hasSeenPlayIntro: false,

        ownedVoidyPets: [],

        essaStats: {}

    };
}

/* =========================================================
   TEMPORARY PLAY MODE TEST RESET
========================================================= */

function resetPlayModeForTesting() {

    const key =
        userStorageKey(
            "play"
        );


    if (!key) {
        return;
    }


    localStorage.removeItem(
        key
    );


    renderPlayTab();
}

function normalizePlayStatValue(
    value
) {

    const number =
        Number(
            value
        );

    if (
        !Number.isFinite(
            number
        )
    ) {

        return 0;
    }

    return Math.max(
        0,
        Math.min(
            100,
            number
        )
    );
}


function makeDefaultPlayEssaStats() {

    return {

        food: 80,

        water: 80,

        cleanliness: 80,

        happiness: 90,

        lastFoodId: null,

        lastDrinkId: null,

        lastSoapId: null

    };
}

/* =========================================================
   BEDROOM SLEEP POSITIONS
========================================================= */

const playBedroomSleepPositions = [

    // TOP ROW
    { x: 13.5, floor: 28 },
    { x: 21.5, floor: 25 },
    { x: 34.2, floor: 25 },
    { x: 46.8, floor: 25 },
    { x: 59.5, floor: 25 },
    { x: 72.0, floor: 25 },
    { x: 84.7, floor: 25 },

    // BOTTOM ROW
    { x: 8.5,  floor: 11 },
    { x: 21.5, floor: 11 },
    { x: 34.2, floor: 11 },
    { x: 46.8, floor: 11 },
    { x: 59.5, floor: 11 },
    { x: 72.0, floor: 11 },
    { x: 84.7, floor: 11 }

];

/* =========================================================
   ESSA NEGLECT TIME
========================================================= */

const PLAY_ESSA_NEGLECT_HOURS = 24;

/* =========================================================
   VOIDY NEGLECT POPUP
========================================================= */

function showVoidyNeglectPopup(
    essa
) {

    if (!essa) {
        return;
    }


    const oldPopup =
        document.getElementById(
            "voidy-neglect-popup"
        );


    if (oldPopup) {
        oldPopup.remove();
    }


    const overlay =
        document.createElement(
            "div"
        );


    overlay.id =
        "voidy-neglect-popup";


    overlay.style.cssText = `
        position:fixed;
        inset:0;
        background:rgba(0,0,0,.55);
        display:flex;
        align-items:center;
        justify-content:center;
        padding:20px;
        box-sizing:border-box;
        z-index:999999;
    `;


    overlay.innerHTML = `

        <div
            style="
                width:min(460px, 100%);
                max-height:90vh;
                overflow:auto;

                background:white;

                border-radius:24px;

                padding:16px 24px;

                box-sizing:border-box;

                text-align:center;

                box-shadow:
                    0 15px 50px
                    rgba(0,0,0,.30);
            "
        >

            <img
                src="ESSAzLife.Images/PlayModeAssets/Voidy/relieved-voidy-door.png"

                alt="Voidy"

                style="
                   width:250px;
height:125px;

object-fit:cover;
object-position:center 35%;

margin:
    -5px auto
    2px auto;
display:block;
                "
            >


            <h2
                style="
                    margin:
                        0 0 20px 0;

                    color:#17313a;
                "
            >
                Fine, I'll take care of this one
            </h2>


            <img
                src="${essa.image}"

                alt="${escapeHTML(
                    essa.name
                )}"

                style="
                    width:110px;
                    height:110px;

                    object-fit:contain;

                    margin:
                        5px auto 15px auto;

                    display:block;
                "
            >


            <p
                style="
                    margin:
                        0 0 22px 0;

                    color:#53666d;

                    font-size:17px;
                    font-weight:bold;

                    line-height:1.5;
                "
            >
                ${escapeHTML(
                    essa.name
                )} has been moved to the kennel.
            </p>


            <button
                type="button"

               onclick="
    document
        .getElementById(
            'voidy-neglect-popup'
        )
        ?.remove();

    renderPlayRoom();
"

                style="
                    padding:
                        12px 24px;

                    border:none;

                    border-radius:999px;

                    background:
                        var(
                            --user-theme-color,
                            #4fb5ae
                        );

                    color:white;

                    font-size:16px;
                    font-weight:bold;

                    cursor:pointer;
                "
            >
                Okay
            </button>

        </div>

    `;


    const popupHost =
    document.fullscreenElement ||
    document.body;

popupHost.appendChild(
    overlay
);
}

   /* =========================================================
   CHECK IF ALL ESSA NEEDS ARE ZERO
========================================================= */

function arePlayEssaNeedsAtZero(
    stats
) {

    if (!stats) {
        return false;
    }


    return (
        stats.food <= 0 &&
        stats.water <= 0 &&
        stats.cleanliness <= 0 &&
        stats.happiness <= 0
    );
}

function getPlayEssaStats(
    playData,
    essaId
) {

    if (
        !playData.essaStats ||
        typeof playData.essaStats !==
            "object"
    ) {

        playData.essaStats = {};
    }


    if (
        !playData.essaStats[
            essaId
        ]
    ) {

        playData.essaStats[
            essaId
        ] =
            makeDefaultPlayEssaStats();
    }


    const stats =
        playData.essaStats[
            essaId
        ];


    stats.food =
        normalizePlayStatValue(
            stats.food
        );


    stats.water =
        normalizePlayStatValue(
            stats.water
        );


    stats.cleanliness =
        normalizePlayStatValue(
            stats.cleanliness
        );


    stats.happiness =
        normalizePlayStatValue(
            stats.happiness
        );


    return stats;
}


function getSavedPlayData() {

    const key =
        userStorageKey(
            "play"
        );


    const defaults =
        getDefaultPlayData();


    if (!key) {

        return defaults;
    }


    const saved =
        safeJSON(
            key,
            defaults
        );


    const playData = {

        trainerXP:
            Number(
                saved.trainerXP
            ) || 0,

        trainerLevel:
            Number(
                saved.trainerLevel
            ) || 1,

        coins:
            Number(
                saved.coins
            ) || 0,

        pendingCoins:
            Number(
                saved.pendingCoins
            ) || 0,

        playroomCoins:
            Array.isArray(
                saved.playroomCoins
            )

                ? saved.playroomCoins

                : [],

        unlockedEssaIds:
            Array.isArray(
                saved.unlockedEssaIds
            )

                ? saved.unlockedEssaIds

                : [],

        selectedEssaId:
            saved.selectedEssaId ||
            null,

        hasChosenStarterEssa:
            Boolean(
                saved.hasChosenStarterEssa
            ),

        hasSeenPlayIntro:
            Boolean(
                saved.hasSeenPlayIntro
            ),

        essaStats:
    (
        saved.essaStats &&
        typeof saved.essaStats ===
            "object"
    )

        ? saved.essaStats

        : {},

ownedVoidyPets:
    Array.isArray(
        saved.ownedVoidyPets
    )

        ? saved.ownedVoidyPets

        : []
    };


    playData.unlockedEssaIds.forEach(
        function(essaId) {

            getPlayEssaStats(
                playData,
                essaId
            );

        }
    );


    savePlayData(
        playData
    );


    return playData;
}


function savePlayData(
    playData
) {

    const key =
        userStorageKey(
            "play"
        );


    if (!key) {

        return;
    }


    localStorage.setItem(
        key,
        JSON.stringify(
            playData
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

    const worldButton =
        document.getElementById("world-button");

    const homeButton =
        document.getElementById("home-button");

    const helpButton =
        document.getElementById("help-button");

    const profileButton =
        document.getElementById("profile-button");


    if (worldButton) {

    worldButton.onclick =
        function() {

            if (
                screen.orientation &&
                typeof screen.orientation.unlock === "function"
            ) {
                screen.orientation.unlock();
            }

            window.location.href =
                "../../index.html";
        };
}


    if (homeButton) {

        homeButton.onclick =
            function() {

                renderPlayRoom();
            };
    }


    if (helpButton) {

        helpButton.onclick =
            function() {

                showHelp();
            };
    }


    if (profileButton) {

        profileButton.onclick =
            function() {

                renderProfile();
            };
    }
}

function resetPageTheme() {

    const user =
        getCurrentUser();


    const themeColor =
        user?.themeColor ||
        "#4fb5ae";


    document.documentElement.style.setProperty(
        "--user-theme-color",
        themeColor
    );

    const pageTextColor =
    themeColor.toLowerCase() === "#000000"
        ? "white"
        : "#17313a";


document.documentElement.style.setProperty(
    "--page-text-color",
    pageTextColor
);


    document.body.style.background =
    themeColor.toLowerCase() === "#000000"
        ? "#000000"
        : hexToRGBA(
            themeColor,
            0.12
        );

    document.body.style.color =
    "";


    const main =
        document.querySelector(
            "main"
        );


    if (main) {

       main.style.background =
    themeColor.toLowerCase() === "#000000"
        ? "#000000"
        : hexToRGBA(
            themeColor,
            0.12
        );

      main.style.color =
    "";
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
   PLAY MODE HELP
========================================================= */

function showHelp() {

    const oldPopup =
        document.getElementById(
            "play-help-popup"
        );


    if (oldPopup) {
        oldPopup.remove();
    }


    const overlay =
        document.createElement(
            "div"
        );


    overlay.id =
        "play-help-popup";


    overlay.style.cssText = `
        position:fixed;
        inset:0;

        background:
            rgba(0,0,0,.55);

        display:flex;
        align-items:center;
        justify-content:center;

        padding:20px;

        box-sizing:border-box;

        z-index:999999;
    `;


    overlay.innerHTML = `

        <div
            style="
                width:min(520px, 100%);
                max-height:90vh;
                overflow:auto;

                background:white;

                border-radius:24px;

                padding:26px;

                box-sizing:border-box;

                text-align:center;

                box-shadow:
                    0 15px 50px
                    rgba(0,0,0,.30);
            "
        >

            <h2
                style="
                    margin:
                        0 0 10px 0;

                    color:
                        var(
                            --user-theme-color,
                            #4fb5ae
                        );

                    font-size:28px;
                "
            >
                ❓ ESSAzLife Play Mode Help
            </h2>


            <p
                style="
                    margin:
                        0 0 22px 0;

                    color:#68777b;

                    line-height:1.5;
                "
            >
                Welcome to ESSAzLife Play Mode!
                Care for your ESSAs, explore the house,
                play games, earn Trainer XP and coins,
                and unlock new things as you level up.
            </p>


            <div
                style="
                    padding:18px;

                    background:#f5fbfa;

                    border:
                        1px solid #d7ebe8;

                    border-radius:18px;

                    text-align:left;

                    color:#40545a;

                    line-height:1.65;

                    margin-bottom:22px;
                "
            >

                <strong>🐾 Your ESSAs</strong>
                <br>
                Keep an eye on your ESSAs' food,
                water, cleanliness, and happiness.

                <br><br>

                <strong>🏠 Explore the House</strong>
                <br>
                Move between rooms and interact
                with your ESSAs throughout the house.

                <br><br>

                <strong>🕹️ Arcade & Games</strong>
                <br>
                Play games to earn Trainer XP
                and MooCow Coins.

                <br><br>

                <strong>🪙 MooCow Coins</strong>
                <br>
                Game rewards appear in the Playroom.
                Collect your coins and spend them
                on items in Voidy's store.

                <br><br>

                <strong>🚪 The Void</strong>
                <br>
                Visit Voidy to discover pets,
                items, and other things that become
                available as your Trainer Level grows.

            </div>


            <div
                style="
                    display:flex;

                    justify-content:center;

                    gap:12px;

                    flex-wrap:wrap;
                "
            >

            <strong>Note:</strong> Tutorial is in reference to
                        the main PlayMode App,
                        <strong>not</strong> the version you've accessed
                        through ESSAzLife World. Watching can help you
                        understand the main layout, but not all features
                        are available in this version.




                <button
                    type="button"

                    onclick="
                        window.open(
                            'https://youtu.be/yJ1litdaLB4?si=Dgbb3xaKTKCA3KQF',
                            '_blank'
                        )
                    "

                    style="
                        padding:
                            12px 22px;

                        border:none;

                        border-radius:14px;

                        background:
                            var(
                                --user-theme-color,
                                #4fb5ae
                            );

                        color:white;

                        font-size:16px;
                        font-weight:bold;

                        cursor:pointer;
                    "
                >
                    ▶️ Watch Tutorial
                </button>

                <button
    type="button"

    onclick="
        openEmergencyBypass()
    "

    style="
        padding:
            12px 22px;

        border:
            2px solid #b83232;

        border-radius:14px;

        background:white;

        color:#b83232;

        font-size:16px;
        font-weight:bold;

        cursor:pointer;
    "
>
🎟️ Enter Code
</button>


                <button
                    type="button"

                    onclick="
                        document
                            .getElementById(
                                'play-help-popup'
                            )
                            ?.remove()
                    "

                    style="
                        padding:
                            12px 22px;

                        border:
                            1px solid #d3dde0;

                        border-radius:14px;

                        background:white;

                        color:#344349;

                        font-size:16px;
                        font-weight:bold;

                        cursor:pointer;
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

function openEmergencyBypass() {

    document
        .getElementById(
            "play-emergency-bypass-popup"
        )
        ?.remove();


    const overlay =
        document.createElement(
            "div"
        );


    overlay.id =
        "play-emergency-bypass-popup";


    overlay.style.cssText = `
        position:fixed;
        inset:0;

        background:
            rgba(0,0,0,.72);

        display:flex;
        align-items:center;
        justify-content:center;

        padding:20px;

        box-sizing:border-box;

        z-index:1000001;
    `;


    overlay.innerHTML = `

        <div
            style="
                width:
                    min(
                        430px,
                        92vw
                    );

                background:white;

                border-radius:24px;

                padding:28px;

                box-sizing:border-box;

                text-align:center;

                box-shadow:
                    0 18px 50px
                    rgba(0,0,0,.4);
            "
        >

           <div
    style="
        font-size:42px;

        margin-bottom:8px;
    "
>
    🎟️
</div>


<h2
    style="
        margin:
            0 0 10px;

        color:#4fb5ae;
    "
>
    Enter Code
</h2>


            <p
                style="
                    margin:
                        0 0 20px;

                    color:#68777b;

                    line-height:1.5;
                "
            >
                Enter your
                ESSAzLife code.
            </p>


            <input
                id="emergency-bypass-code"

                type="password"

                placeholder="Enter Your Code Here"

                autocomplete="off"

                style="
                    width:100%;

                    padding:12px;

                    margin-bottom:14px;

                    box-sizing:border-box;

                    border:
                        2px solid #d3dde0;

                    border-radius:12px;

                    font-size:16px;
                "
            >


            <div
                id="emergency-bypass-message"

                style="
                    min-height:22px;

                    margin-bottom:14px;

                    color:#b83232;

                    font-size:14px;

                    font-weight:bold;
                "
            ></div>


            <div
                style="
                    display:flex;

                    gap:10px;

                    justify-content:center;

                    flex-wrap:wrap;
                "
            >

                <button
                    type="button"

                    onclick="
                        validateEmergencyBypassCode()
                    "

                    style="
                        padding:
                            12px 22px;

                        border:none;

                        border-radius:14px;

                        background:#b83232;

                        color:white;

                        font-size:16px;

                        font-weight:bold;

                        cursor:pointer;
                    "
                >
                    🔓 Continue
                </button>


                <button
                    type="button"

                    onclick="
                        document
                            .getElementById(
                                'play-emergency-bypass-popup'
                            )
                            ?.remove()
                    "

                    style="
                        padding:
                            12px 22px;

                        border:none;

                        border-radius:14px;

                        background:#eef3f4;

                        color:#17313a;

                        font-size:16px;

                        font-weight:bold;

                        cursor:pointer;
                    "
                >
                    Cancel
                </button>

            </div>

        </div>

    `;


    const popupHost =
        document.fullscreenElement ||
        document.body;


    popupHost.appendChild(
        overlay
    );
}

function validateEmergencyBypassCode() {

    const codeInput =
        document.getElementById(
            "emergency-bypass-code"
        );


    const message =
        document.getElementById(
            "emergency-bypass-message"
        );


    if (
        !codeInput ||
        !message
    ) {

        return;
    }


    const enteredCode =
        codeInput.value.trim();


    /* =========================================
       ADMIN CODE
    ========================================= */

    if (
        enteredCode ===
        "ELPMMooCowDaisyBelle"
    ) {

        message.style.color =
            "#2d8a57";


        message.textContent =
            "✅ Admin access granted.";


        setTimeout(
            function() {

                showEmergencyBypassAdminControls();

            },
            400
        );


        return;
    }


    /* =========================================
       TESTER CODE
    ========================================= */

   if (
    enteredCode ===
    "ESSAzLifeTesters2026"
) {

    const playData =
        getSavedPlayData();


    playData.coins =
        (Number(
            playData.coins
        ) || 0) +
        100000;


    savePlayData(
        playData
    );


    document
        .getElementById(
            "play-emergency-bypass-popup"
        )
        ?.remove();


    const testerMessageKey =
        userStorageKey(
            "testerThankYouMessageSeen"
        );


    const hasSeenTesterMessage =
        testerMessageKey
            ? localStorage.getItem(
                testerMessageKey
            ) === "true"
            : false;


    if (
        !hasSeenTesterMessage
    ) {

        localStorage.setItem(
            testerMessageKey,
            "true"
        );


        showTesterCodeThankYouPopup();

    } else {

        renderPlayRoom();

    }


    return;
}
    /* =========================================
       WRONG CODE
    ========================================= */

    message.style.color =
        "#b83232";


    message.textContent =
        "❌ Unrecognized ESSAzLife code.";
}

function showTesterCodeThankYouPopup() {

    document
        .getElementById(
            "tester-code-thank-you-popup"
        )
        ?.remove();


    const overlay =
        document.createElement(
            "div"
        );


    overlay.id =
        "tester-code-thank-you-popup";


    overlay.style.cssText = `
        position:fixed;
        inset:0;

        background:
            rgba(0,0,0,.72);

        display:flex;
        align-items:center;
        justify-content:center;

        padding:20px;

        box-sizing:border-box;

        z-index:1000002;
    `;


    overlay.innerHTML = `

        <div
            style="
                width:
                    min(
                        500px,
                        92vw
                    );

                max-height:90vh;
                overflow-y:auto;

                background:white;

                border-radius:24px;

                padding:28px;

                box-sizing:border-box;

                text-align:center;

                box-shadow:
                    0 18px 50px
                    rgba(0,0,0,.4);
            "
        >

            <div
                style="
                    font-size:46px;
                    margin-bottom:8px;
                "
            >
                🪙
            </div>


            <h2
                style="
                    margin:
                        0 0 16px;

                    color:#4fb5ae;
                "
            >
                A Message From Raising Floofz
            </h2>


            <p
                style="
                    margin:
                        0 0 22px;

                    color:#58686e;

                    font-size:16px;
                    line-height:1.65;

                    text-align:left;
                "
            >
                September 29, 2026
                <br><br>
                Hey, It's me, Raising Floofz.
                I just wanted to thank you for
                being a tester. Here's 100,000
                coins to use as you please.
                You can reuse this code as many
                times as you want throughout
                the game.

                <br><br>

                But remember you will still
                have to earn the levels to
                unlock items on your own.

                <br><br>

                Please don't share this code
                with <strong>ANYONE</strong>
                who is not a tester.

                <br><br>

                Thanks,<br>
                <strong>Bia</strong>
            </p>


            <button
                type="button"

                onclick="
                    document
                        .getElementById(
                            'tester-code-thank-you-popup'
                        )
                        ?.remove();

                    renderPlayRoom();
                "

                style="
                    padding:
                        12px 24px;

                    border:none;
                    border-radius:14px;

                    background:#4fb5ae;
                    color:white;

                    font-size:16px;
                    font-weight:bold;

                    cursor:pointer;
                "
            >
                Thanks! 🐾
            </button>

        </div>

    `;


    const popupHost =
        document.fullscreenElement ||
        document.body;


    popupHost.appendChild(
        overlay
    );
}

function showEmergencyBypassAdminControls() {

    const popup =
        document.getElementById(
            "play-emergency-bypass-popup"
        );


    if (!popup) {
        return;
    }


    const card =
        popup.firstElementChild;


    if (!card) {
        return;
    }


    card.innerHTML = `

        <div
            style="
                font-size:42px;
                margin-bottom:8px;
            "
        >
            🐮
        </div>


        <h2
            style="
                margin:
                    0 0 10px;

                color:#4fb5ae;
            "
        >
            Admin Code Accepted
        </h2>


        <p
            style="
                margin:
                    0 0 20px;

                color:#68777b;

                line-height:1.5;
            "
        >
            Choose your Trainer Level
            and Coin Balance.
        </p>


        <input
            id="emergency-bypass-level"

            type="number"

            min="1"

            step="1"

            placeholder="Trainer Level"

            style="
                width:100%;

                padding:12px;

                margin-bottom:12px;

                box-sizing:border-box;

                border:
                    2px solid #d3dde0;

                border-radius:12px;

                font-size:16px;
            "
        >


        <input
            id="emergency-bypass-coins"

            type="number"

            min="0"

            step="1"

            placeholder="Coin Balance"

            style="
                width:100%;

                padding:12px;

                margin-bottom:14px;

                box-sizing:border-box;

                border:
                    2px solid #d3dde0;

                border-radius:12px;

                font-size:16px;
            "
        >


        <div
            id="emergency-bypass-message"

            style="
                min-height:22px;

                margin-bottom:14px;

                color:#b83232;

                font-size:14px;

                font-weight:bold;
            "
        ></div>


        <div
            style="
                display:flex;

                gap:10px;

                justify-content:center;

                flex-wrap:wrap;
            "
        >

            <button
                type="button"

                onclick="
                    activateEmergencyBypass()
                "

                style="
                    padding:
                        12px 22px;

                    border:none;

                    border-radius:14px;

                    background:#4fb5ae;

                    color:white;

                    font-size:16px;

                    font-weight:bold;

                    cursor:pointer;
                "
            >
                Apply
            </button>


            <button
                type="button"

                onclick="
                    document
                        .getElementById(
                            'play-emergency-bypass-popup'
                        )
                        ?.remove()
                "

                style="
                    padding:
                        12px 22px;

                    border:none;

                    border-radius:14px;

                    background:#eef3f4;

                    color:#17313a;

                    font-size:16px;

                    font-weight:bold;

                    cursor:pointer;
                "
            >
                Cancel
            </button>

        </div>

    `;
}

function activateEmergencyBypass() {

    const levelInput =
        document.getElementById(
            "emergency-bypass-level"
        );


    const coinsInput =
        document.getElementById(
            "emergency-bypass-coins"
        );


    const message =
        document.getElementById(
            "emergency-bypass-message"
        );


    if (
        !levelInput ||
        !coinsInput ||
        !message
    ) {

        return;
    }


    const requestedLevel =
        Number(
            levelInput.value
        );


    const requestedCoins =
        Number(
            coinsInput.value
        );


    /* -------------------------
       CHECK TRAINER LEVEL
    ------------------------- */

    if (
        !Number.isInteger(
            requestedLevel
        ) ||
        requestedLevel < 1
    ) {

        message.style.color =
            "#b83232";

        message.textContent =
            "❌ Enter a valid Trainer Level.";

        return;
    }


    /* -------------------------
       CHECK COIN BALANCE
    ------------------------- */

    if (
        !Number.isInteger(
            requestedCoins
        ) ||
        requestedCoins < 0
    ) {

        message.style.color =
            "#b83232";

        message.textContent =
            "❌ Enter a valid Coin Balance.";

        return;
    }


    /* -------------------------
       APPLY ADMIN CHANGES
    ------------------------- */

    const playData =
        getSavedPlayData();


    playData.trainerLevel =
        requestedLevel;


    playData.trainerXP =
        0;


    playData.coins =
        requestedCoins;


    savePlayData(
        playData
    );


    /* -------------------------
       SUCCESS
    ------------------------- */

    message.style.color =
        "#2d8a57";


    message.textContent =
        "✅ Admin changes applied!";


    setTimeout(
        function() {

            document
                .getElementById(
                    "play-emergency-bypass-popup"
                )
                ?.remove();


            renderPlayRoom();

        },
        700
    );
}

/* =========================================================
   AUTH HOME
========================================================= */

function renderAuthHome() {

    resetPageTheme();

    showHeaderButtons(
        false
    );


    document.querySelector(
        "main"
    ).innerHTML = `

        <div
            style="
                max-width:650px;
                margin:70px auto;
                text-align:center;
                padding:30px;
                background:white;
                border-radius:24px;
                box-shadow:0 8px 30px rgba(0,0,0,.08);
            "
        >

            <img
                src="MooCow.Icon.2.png"
                alt="ESSAzLife PlayMode cow icon"

                style="
                    width:100px;
                    height:100px;
                    object-fit:cover;
                    border-radius:24px;
                    margin-bottom:15px;
                "
            >

            <h1>
                Welcome to ESSAzLife!
            </h1>

            <p
                style="
                    color:#68777b;
                    line-height:1.6;
                "
            >
                A fun place to care for,
                train, track, and bond with
                your ESSAs.
            </p>

            <div
                style="
                    display:flex;
                    gap:12px;
                    justify-content:center;
                    flex-wrap:wrap;
                    margin-top:25px;
                "
            >

                <button
                    onclick="
                        showCreateAccountForm()
                    "

                    style="
                        padding:12px 22px;
                        border:none;
                        border-radius:12px;
                        background:#4fb5ae;
                        color:white;
                        cursor:pointer;
                        font-weight:bold;
                    "
                >
                    Create Account
                </button>

                <button
                    onclick="
                        showLoginForm()
                    "

                    style="
                        padding:12px 22px;
                        border:1px solid #4fb5ae;
                        border-radius:12px;
                        background:white;
                        color:#3b9f99;
                        cursor:pointer;
                        font-weight:bold;
                    "
                >
                    Log In
                </button>

            </div>

        </div>

    `;
}


/* =========================================================
   PROFILE
========================================================= */

function renderProfile() {

    resetPageTheme();


    const user =
        getCurrentUser();


    if (!user) {

        renderAuthHome();

        return;
    }


    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];


    let monthOptions =
        `<option value="">Choose Month</option>`;


    months.forEach(
        function(month, index) {

            const monthNumber =
                index + 1;


            monthOptions += `

                <option
                    value="${monthNumber}"

                    ${
                        Number(
                            user.recoveryBirthMonth
                        ) === monthNumber

                            ? "selected"

                            : ""
                    }
                >

                    ${month}

                </option>

            `;
        }
    );


    let dayOptions =
        `<option value="">Choose Day</option>`;


    for (
        let day = 1;
        day <= 31;
        day++
    ) {

        dayOptions += `

            <option
                value="${day}"

                ${
                    Number(
                        user.recoveryBirthDay
                    ) === day

                        ? "selected"

                        : ""
                }
            >

                ${day}

            </option>

        `;
    }


    document.querySelector(
        "main"
    ).innerHTML = `


        <div
            class="essa-form"
        >


            <h1>
                👤 Profile
            </h1>

            <p> 
            <b>Looking for Something?</b>
            Username and Password are now managed by ESSAzLife World.
            This setting only appears through the Standalone app.
            </p>
            
            <label>
                App Background Color
            </label>


            <input
                id="profile-theme"

                type="color"

                value="${user.themeColor || "#ffffff"}"

                style="
                    height:50px;
                "
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
    onclick="
        renderPlayTab()
    "
>

    Cancel

</button>


                <button
                    onclick="
                        saveProfile()
                    "
                >

                    Save Profile

                </button>


            </div>



            <hr
                style="
                    margin:30px 0;
                    border:none;
                    border-top:
                        1px solid
                        #dbe5e7;
                "
            >

            <div
    style="
        padding:22px;
        background:#f5fbfa;
        border:1px solid #cce9e6;
        border-radius:18px;
        margin-bottom:25px;
    "
>

    <h2
        style="
            margin-top:0;
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
        Save a backup of your ESSAzLife Play Mode data
        so you can restore your progress later or move
        it to another device.
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
            onclick="
                backupPlayModeData()
            "
        >
            💾 Create Backup
        </button>


        <button
            onclick="
                document
                    .getElementById(
                        'play-mode-restore-file'
                    )
                    .click()
            "
        >
            📂 Restore Backup
        </button>

    </div>


    <input
        id="play-mode-restore-file"

        type="file"

        accept=".json,application/json"

        onchange="
            restorePlayModeData(
                this.files[0]
            )
        "

        style="
            display:none;
        "
    >


    <p
        style="
            color:#8a969a;
            font-size:12px;
            margin:15px 0 0 0;
        "
    >
        Backups are saved as a file on your device.
        Keep your backup somewhere safe.
    </p>

</div>

        </div>

    `;

}

function backupPlayModeData() {

    const user =
        getCurrentUser();


    if (!user) {

        alert(
            "You must be logged in to create a backup."
        );

        return;
    }


    const playData =
        getSavedPlayData();


    const backup = {

        app:
            "ESSAzLife Play Mode",

        backupVersion:
            1,

        createdAt:
            new Date()
                .toISOString(),

        playData:
            playData
    };


    const file =
        new Blob(
            [
                JSON.stringify(
                    backup,
                    null,
                    2
                )
            ],
            {
                type:
                    "application/json"
            }
        );


    const url =
        URL.createObjectURL(
            file
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;

    link.download =
        "ESSAzLife-PlayMode-Backup.json";


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();


    URL.revokeObjectURL(
        url
    );
}

function restorePlayModeData(
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
                        "ESSAzLife Play Mode" ||
                    !backup.playData
                ) {

                    alert(
                        "This is not a valid ESSAzLife Play Mode backup."
                    );

                    return;
                }


                const oldPopup =
                    document.getElementById(
                        "play-restore-confirm-popup"
                    );


                if (oldPopup) {

                    oldPopup.remove();
                }


                const overlay =
                    document.createElement(
                        "div"
                    );


                overlay.id =
                    "play-restore-confirm-popup";


                overlay.style.cssText = `
                    position:fixed;
                    inset:0;
                    background:rgba(0,0,0,0.35);
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    z-index:999999;
                    padding:20px;
                    box-sizing:border-box;
                `;


                overlay.innerHTML = `

                    <div
                        style="
                            width:min(460px, 100%);
                            background:white;
                            border:2px solid var(--user-theme-color, #4fb5ae);
                            border-radius:22px;
                            padding:30px;
                            box-sizing:border-box;
                            text-align:center;
                            box-shadow:0 15px 45px rgba(0,0,0,0.18);
                        "
                    >

                        <div
                            style="
                                font-size:48px;
                                margin-bottom:10px;
                            "
                        >
                            💾
                        </div>


                        <h2
                            style="
                                margin:0 0 14px 0;
                                color:var(--user-theme-color, #4fb5ae);
                                font-size:27px;
                            "
                        >
                            Restore Backup?
                        </h2>


                        <p
                            style="
                                color:#58686e;
                                font-size:16px;
                                line-height:1.5;
                                margin:0 0 8px 0;
                            "
                        >
                            Are you sure you want to restore
                            this Play Mode backup?
                        </p>


                        <p
                            style="
                                color:#8a5b28;
                                font-size:14px;
                                line-height:1.5;
                                margin:0 0 24px 0;
                                font-weight:bold;
                            "
                        >
                            Your current Play Mode progress
                            will be replaced.
                        </p>


                        <div
                            style="
                                display:flex;
                                justify-content:center;
                                gap:12px;
                                flex-wrap:wrap;
                            "
                        >

                            <button
                                onclick="

                                style="
    padding:12px 22px;
    border:1px solid #d3dde0;
    border-radius:14px;
    background:white;
    color:#344349;
    font-size:15px;
    font-weight:bold;
    cursor:pointer;
"
                                    document
                                        .getElementById(
                                            'play-restore-confirm-popup'
                                        )
                                        .remove()
                                "
                            >
                                Cancel
                            </button>


                           <button
    id="confirm-play-backup-restore"

    style="
        padding:12px 22px;
        border:none;
        border-radius:14px;
        background:var(--user-theme-color, #4fb5ae);
        color:white;
        font-size:15px;
        font-weight:bold;
        cursor:pointer;
        box-shadow:0 4px 10px rgba(0,0,0,0.10);
    "
>
                                💾 Restore Backup
                            </button>

                        </div>

                    </div>

                `;


                document.body.appendChild(
                    overlay
                );


                const restoreButton =
                    document.getElementById(
                        "confirm-play-backup-restore"
                    );


                restoreButton.onclick =
                    function() {

                        const key =
                            userStorageKey(
                                "play"
                            );


                        if (!key) {

                            overlay.remove();

                            alert(
                                "You must be logged in to restore a backup."
                            );

                            return;
                        }


                        localStorage.setItem(
                            key,
                            JSON.stringify(
                                backup.playData
                            )
                        );


                        overlay.remove();


                       const successOverlay =
    document.createElement(
        "div"
    );


successOverlay.id =
    "play-restore-success-popup";


successOverlay.style.cssText = `
    position:fixed;
    inset:0;
    background:rgba(0,0,0,0.35);
    display:flex;
    align-items:center;
    justify-content:center;
    z-index:999999;
    padding:20px;
    box-sizing:border-box;
`;


successOverlay.innerHTML = `

    <div
        style="
            width:min(440px, 100%);
            background:white;
            border:2px solid var(--user-theme-color, #4fb5ae);
            border-radius:22px;
            padding:30px;
            box-sizing:border-box;
            text-align:center;
            box-shadow:0 15px 45px rgba(0,0,0,0.18);
        "
    >

        <div
            style="
                font-size:48px;
                margin-bottom:10px;
            "
        >
            ✅
        </div>


        <h2
            style="
                margin:0 0 14px 0;
                color:var(--user-theme-color, #4fb5ae);
                font-size:27px;
            "
        >
            Backup Restored!
        </h2>


        <p
            style="
                color:#58686e;
                font-size:16px;
                line-height:1.5;
                margin:0 0 24px 0;
            "
        >
            Your ESSAzLife Play Mode progress
            has been restored successfully.
        </p>


        <button
            onclick="
                document
                    .getElementById(
                        'play-restore-success-popup'
                    )
                    .remove();

                renderPlayRoom();
            "

            style="
                padding:12px 22px;
                border:none;
                border-radius:14px;
                background:var(--user-theme-color, #4fb5ae);
                color:white;
                font-size:15px;
                font-weight:bold;
                cursor:pointer;
                box-shadow:0 4px 10px rgba(0,0,0,0.10);
            "
        >
            🏠 Return to House
        </button>

    </div>

`;


document.body.appendChild(
    successOverlay
);
                    };


            } catch (error) {

                console.error(
                    "Play Mode restore failed:",
                    error
                );


                alert(
                    "That backup file could not be restored."
                );
            }
        };


    reader.readAsText(
        file
    );
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


    const username =
        document
            .getElementById(
                "profile-username"
            )
            .value
            .trim();


    const email =
        document
            .getElementById(
                "profile-email"
            )
            .value
            .trim()
            .toLowerCase();


    if (
        username.length <
        3
    ) {

        alert(
            "Username must be at least 3 characters."
        );

        return;
    }


    if (
        !email ||
        !email.includes(
            "@"
        )
    ) {

        alert(
            "Please enter a valid email."
        );

        return;
    }


    const accounts =
        getAccounts();


    const duplicate =
        accounts.some(
            function(account) {

                if (
                    String(
                        account.id
                    ) ===
                    String(
                        current.id
                    )
                ) {

                    return false;
                }


                return (

                    String(
                        account.username ||
                        ""
                    )
                        .toLowerCase() ===
                    username
                        .toLowerCase()

                    ||

                    String(
                        account.email ||
                        ""
                    )
                        .toLowerCase() ===
                    email

                );

            }
        );


    if (duplicate) {

        alert(
            "That username or email is already being used by another account."
        );

        return;
    }


    const index =
        accounts.findIndex(
            function(account) {

                return (
                    String(
                        account.id
                    ) ===
                    String(
                        current.id
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


    accounts[
        index
    ].username =
        username;


    accounts[
        index
    ].email =
        email;


    accounts[
        index
    ].nickname =
        document
            .getElementById(
                "profile-nickname"
            )
            .value
            .trim();


    accounts[
        index
    ].genderIdentity =
        document
            .getElementById(
                "profile-gender"
            )
            .value
            .trim();


    accounts[
        index
    ].ageGroup =
        document
            .getElementById(
                "profile-age-group"
            )
            .value;


    accounts[
        index
    ].themeColor =
        document
            .getElementById(
                "profile-theme"
            )
            .value;


    saveAccounts(
        accounts
    );


   renderPlayTab();
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
   PLAY MODE — HELPERS
========================================================= */

function getPlayableEssaById(
    essaId
) {

    return (
        playableEssas.find(
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
   TRAINER PROGRESS
========================================================= */

function getTrainerProgress(
    playData
) {

    const xpNeeded =
        100;


    const currentXP =
        Math.max(
            0,
            Number(
                playData.trainerXP
            ) || 0
        );


    const percentage =
        Math.min(
            100,
            (
                currentXP /
                xpNeeded
            ) *
            100
        );


    return {

        xpNeeded:
            xpNeeded,

        currentXP:
            currentXP,

        percentage:
            percentage

    };
}

/* =========================================================
   VOID UNLOCK POPUP
========================================================= */

function showVoidUnlockPopup() {

    const oldPopup =
        document.getElementById(
            "void-unlock-popup"
        );


    if (oldPopup) {

        oldPopup.remove();
    }


    const overlay =
        document.createElement(
            "div"
        );


    overlay.id =
        "void-unlock-popup";


    overlay.style.cssText = `
        position:fixed;
        inset:0;
        width:100vw;
        height:100vh;
        background:#000000;
        display:flex;
        align-items:center;
        justify-content:center;
        z-index:9999999;
        padding:30px;
        box-sizing:border-box;
        cursor:pointer;
    `;


    overlay.innerHTML = `

        <div
            style="
                color:white;
                text-align:center;
                font-size:clamp(22px, 4vw, 38px);
                font-weight:bold;
                line-height:1.5;
            "
        >
            Something new awaits you
            <br>
            in the void...
        </div>

    `;


    overlay.onclick =
        function() {

            overlay.remove();
        };


    const popupParent =
        document.fullscreenElement ||
        document.body;


    popupParent.appendChild(
        overlay
    );
}

function didVoidItemUnlockBetweenLevels(
    oldLevel,
    newLevel
) {

    return voidyPetStoreItems.some(
        function(item) {

            if (
                item.limitedEdition === true
            ) {

                return false;
            }


            const unlockLevel =
                Number(
                    item.level
                );


            if (
                !Number.isFinite(
                    unlockLevel
                )
            ) {

                return false;
            }


            return (
                unlockLevel > oldLevel &&
                unlockLevel <= newLevel
            );
        }
    );
}

/* =========================================================
   ADD TRAINER XP
========================================================= */

function addTrainerXP(
    playData,
    amount
) {

    let xp =
        Math.max(
            0,
            Number(
                playData.trainerXP
            ) || 0
        );


    let level =
        Math.max(
            1,
            Number(
                playData.trainerLevel
            ) || 1
        );


    const oldLevel =
        level;


    xp +=
        Math.max(
            0,
            Number(
                amount
            ) || 0
        );


    let leveledUp =
        false;


    while (
        xp >=
        100
    ) {

        xp -=
            100;


        level +=
            1;


        leveledUp =
            true;
    }


    playData.trainerXP =
        xp;


    playData.trainerLevel =
        level;
    
    if (
    level > oldLevel &&
    didVoidItemUnlockBetweenLevels(
        oldLevel,
        level
    )
) {

    setTimeout(
        function() {

            showVoidUnlockPopup();

        },
        100
    );
}


    if (
        !Array.isArray(
            playData.unlockedEssaIds
        )
    ) {

        playData.unlockedEssaIds =
            [];
    }


    return {

        leveledUp:
            leveledUp,

        oldLevel:
            oldLevel,

        newLevel:
            level,

        newlyUnlocked:
            []

    };
}

/* =========================================================
   PLAY MODE — ADD COINS
========================================================= */

function addPlayCoins(
    amount
) {

    const playData =
        getSavedPlayData();


    const coinsToAdd =
        Math.max(
            0,
            Number(amount) || 0
        );


    playData.coins =
        (
            Number(
                playData.coins
            ) || 0
        ) +
        coinsToAdd;


    savePlayData(
        playData
    );


    return {
        amountAdded:
            coinsToAdd,

        totalCoins:
            playData.coins
    };
}

/* =========================================================
   PLAY MODE — ADD PENDING COINS
========================================================= */

function addPendingPlayCoins(
    amount
) {

    const playData =
        getSavedPlayData();


    const coinsToAdd =
        Math.max(
            0,
            Number(amount) || 0
        );


    playData.pendingCoins =
        (
            Number(
                playData.pendingCoins
            ) || 0
        ) +
        coinsToAdd;


    savePlayData(
        playData
    );


    return {
        amountAdded:
            coinsToAdd,

        pendingCoins:
            playData.pendingCoins
    };
}

/* =========================================================
   PLAY MODE — COLLECT PENDING COINS
========================================================= */

function collectPendingPlayCoins() {

    const playData =
        getSavedPlayData();


    const coinsToCollect =
        Math.max(
            0,
            Number(
                playData.pendingCoins
            ) || 0
        );


    if (
        coinsToCollect <= 0
    ) {

        return {
            amountCollected: 0,
            totalCoins:
                playData.coins
        };
    }


    playData.coins =
        (
            Number(
                playData.coins
            ) || 0
        ) +
        coinsToCollect;


    playData.pendingCoins = 0;


    savePlayData(
        playData
    );


    return {
        amountCollected:
            coinsToCollect,

        totalCoins:
            playData.coins
    };
}

/* =========================================================
   PLAY MODE — SPAWN PENDING PLAYROOM COINS
========================================================= */

function spawnPendingPlayroomCoins() {

    const playData =
        getSavedPlayData();


    const pendingCoins =
        Math.max(
            0,
            Number(
                playData.pendingCoins
            ) || 0
        );


    if (pendingCoins <= 0) {
        return;
    }


    if (
        !Array.isArray(
            playData.playroomCoins
        )
    ) {

        playData.playroomCoins = [];
    }


    let coinsRemaining =
        pendingCoins;


    while (
        coinsRemaining > 0
    ) {

        const coinValue =
            Math.min(
                5,
                coinsRemaining
            );


        playData.playroomCoins.push(
            {
                id:
                    "playroom-coin-" +
                    Date.now() +
                    "-" +
                    Math.random()
                        .toString(36)
                        .slice(2),

                value:
                    coinValue,

                x:
                    15 +
                    Math.floor(
                        Math.random() * 70
                    ),

                y:
                    65 +
                    Math.floor(
                        Math.random() * 20
                    )
            }
        );


        coinsRemaining -=
            coinValue;
    }


    playData.pendingCoins = 0;


    savePlayData(
        playData
    );
}

/* =========================================================
   PLAY MODE — COLLECT PLAYROOM COIN
========================================================= */

function collectPlayroomCoin(
    coinId
) {

    const playData =
        getSavedPlayData();


    if (
        !Array.isArray(
            playData.playroomCoins
        )
    ) {

        return;
    }


    const coinIndex =
        playData.playroomCoins
            .findIndex(
                function(coin) {

                    return (
                        coin.id ===
                        coinId
                    );

                }
            );


    if (
        coinIndex === -1
    ) {

        return;
    }


    const coin =
        playData.playroomCoins[
            coinIndex
        ];


    const coinValue =
        Math.max(
            0,
            Number(
                coin.value
            ) || 0
        );


    playData.coins =
        (
            Number(
                playData.coins
            ) || 0
        ) +
        coinValue;


    playData.playroomCoins.splice(
        coinIndex,
        1
    );


    savePlayData(
        playData
    );


    renderPlayRoom();
}

/* =========================================================
   TRAINER LEVEL BAR
   Hidden in ESSAzLife World
========================================================= */

function makeTrainerLevelBar(
    playData
) {

    return "";
}

/* =========================================================
   PLAYABLE ESSA VISUAL
========================================================= */

function makePlayableEssaVisual(
    essa,
    locked = false,
    size = "normal"
) {

    if (!essa) {

        return "";
    }


    const maxWidth =
    size === "focus"

        ? "430px"

        : size === "collection"

            ? "110px"

            : "220px";


    const fontSize =
    size === "focus"

        ? "150px"

        : size === "collection"

            ? "45px"

            : "85px";


    return `

       <div
    ${
        size === "focus" && !locked
            ? `
                data-pet-essa="${essa.id}"

                onpointerdown="
                    startEssaPetting(
                        event,
                        '${essa.id}'
                    )
                "

                onpointermove="
                    continueEssaPetting(
                        event,
                        '${essa.id}'
                    )
                "

                onpointerup="
                    stopEssaPetting(
                        event,
                        '${essa.id}'
                    )
                "

                onpointercancel="
                    stopEssaPetting(
                        event,
                        '${essa.id}'
                    )
                "
            `
            : ""
    }

    style="
        width:100%;

        max-width:
            ${maxWidth};

        aspect-ratio:
            1 / 1;

        margin:auto;

        display:flex;

        align-items:center;

        justify-content:center;

        overflow:hidden;

        position:relative;

        ${
            size === "focus" && !locked
                ? `
                    cursor:grab;
                    touch-action:none;
                    user-select:none;
                `
                : ""
        }
    "
>


    <img
        src="${essa.image}"

        draggable="false"

        alt="${escapeHTML(
            essa.name
        )}"

        onerror="
            this.style.display='none';

            this.nextElementSibling.style.display='flex';
        "

        style="
            width:100%;

            height:100%;

            object-fit:contain;

            ${
                locked

                    ? `
                        filter:
                            grayscale(
                                1
                            );

                        opacity:.45;
                    `

                    : ""
            }
        "
    >


    <div
        style="
            display:none;

            width:100%;

            height:100%;

            align-items:center;

            justify-content:center;

            font-size:
                ${fontSize};

            ${
                locked

                    ? `
                        filter:
                            grayscale(
                                1
                            );

                        opacity:.45;
                    `

                    : ""
            }
        "
    >

        ${essa.fallbackIcon}

    </div>

            ${
                locked

                    ? `

                        <div
                            style="
                                position:absolute;

                                inset:0;

                                display:flex;

                                align-items:center;

                                justify-content:center;

                                font-size:45px;
                            "
                        >

                            🔒

                        </div>

                    `

                    : ""
            }


        </div>

    `;
}

/* =========================================================
   SWIPE TO PET ESSA
========================================================= */

let essaPetting = {
    active: false,
    essaId: null,
    lastX: 0,
    lastY: 0,
    distance: 0
};


function startEssaPetting(
    event,
    essaId
) {

    essaPetting.active =
        true;

    essaPetting.essaId =
        essaId;

    essaPetting.lastX =
        event.clientX;

    essaPetting.lastY =
        event.clientY;

    essaPetting.distance =
        0;

    event.currentTarget
        .setPointerCapture(
            event.pointerId
        );
}


function continueEssaPetting(
    event,
    essaId
) {

    if (
        !essaPetting.active ||
        essaPetting.essaId !== essaId
    ) {
        return;
    }


    const moveX =
        event.clientX -
        essaPetting.lastX;

    const moveY =
        event.clientY -
        essaPetting.lastY;


    const movement =
        Math.sqrt(
            moveX * moveX +
            moveY * moveY
        );


    essaPetting.distance +=
        movement;


    essaPetting.lastX =
        event.clientX;

    essaPetting.lastY =
        event.clientY;


    if (
    essaPetting.distance >= 100
) {

    essaPetting.distance =
        0;

    petPlayableEssa(
        essaId
    );
}
}


function stopEssaPetting(
    event,
    essaId
) {

    if (
        essaPetting.essaId !== essaId
    ) {
        return;
    }


    essaPetting.active =
        false;

    essaPetting.essaId =
        null;

    essaPetting.distance =
        0;
}


/* =========================================================
   PLAY MODE ENTRY
========================================================= */

function renderPlayTab() {

    resetPageTheme();


    const playData =
        getSavedPlayData();


    /*
        Brand-new player:
        show the Play Mode intro first.
    */
    if (
        !playData.hasSeenPlayIntro
    ) {

        renderPlayIntro();

        return;
    }


    /*
        Intro completed,
        but starter has not been chosen yet.
    */
    if (
        !playData.hasChosenStarterEssa
    ) {

        renderStarterEssaSelection();

        return;
    }


    /*
        Starter already chosen:
        enter the house.
    */
    renderPlayRoom();
}

/* =========================================================
   PLAY INTRO
========================================================= */

function renderPlayIntro() {

    resetPageTheme();


    const playData =
        getSavedPlayData();


    document.querySelector(
        "main"
    ).innerHTML = `

       


        <div
            style="
                max-width:850px;

                margin:0 auto;

                text-align:center;
            "
        >


            <h1>
                🎮 Welcome to Play!
            </h1>


            <p
                style="
                    font-size:18px;

                    line-height:1.6;

                    color:#68777b;
                "
            >

                Meet the ESSAs who live
                inside the ESSAzLife house!

                Care for them,
                spend time with them,
                explore the rooms,
                and earn Trainer XP.

            </p>


            <div
    style="
        max-width:500px;
        margin:30px auto;
        padding:25px;
        background:white;
        border:1px solid #dbe5e7;
        border-radius:24px;
        box-shadow:0 5px 18px rgba(0,0,0,.07);
    "
>

    <h2>
        🐾 Choose Your Starter ESSA!
    </h2>

    <p
        style="
            line-height:1.6;
            color:#68777b;
        "
    >
        When you enter the house,
        you'll choose your first ESSA:
        MooCow or DaisyBelle!
    </p>

</div>

            ${makeTrainerLevelBar(
                playData
            )}


            <button
                onclick="
                    enterPlayRoomForFirstTime()
                "

                style="
                    margin-top:28px;

                    padding:
                        16px
                        30px;

                    border:none;

                    border-radius:14px;

                    background:#4fb5ae;

                    color:white;

                    font-size:19px;

                    font-weight:bold;

                    cursor:pointer;
                "
            >

                Enter the House 🐾

            </button>


        </div>

    `;
}


/* =========================================================
   ENTER PLAY FOR FIRST TIME
========================================================= */

function enterPlayRoomForFirstTime() {

    const playData =
        getSavedPlayData();


    playData.hasSeenPlayIntro =
        true;


    savePlayData(
        playData
    );


    renderStarterEssaSelection();
}

/* =========================================================
   PLAYABLE ESSA COLLECTION
========================================================= */

function renderPlayableEssaCollection() {

    resetPageTheme();


    const playData =
    getSavedPlayData();


const houseData =
    getSavedPlayHouseData();


const unlockedEssas =
    getAllPlayableEssas()
        .filter(
            function(essa) {

                const isUnlocked =
                    playData
                        .unlockedEssaIds
                        .includes(
                            essa.id
                        );


                const isInKennel =
                    houseData
                        .essaRooms[
                            essa.id
                        ] ===
                    "kennel";


                return (
                    isUnlocked &&
                    !isInKennel
                );
            }
        );

    const cards =
        unlockedEssas
            .map(
                function(essa) {

                    return `

                        <div
    style="
        padding:10px;
        background:white;
        border:1px solid #dbe5e7;
        border-radius:14px;
        text-align:center;
        box-shadow:
            0 3px 10px
            rgba(0,0,0,.06);

        min-width:0;
    "
>

                            ${makePlayableEssaVisual(
    essa,
    false,
    "collection"
)}


                            <h2
    style="
        margin:6px 0 2px;
        color:#17313a;
        font-size:18px;
        line-height:1.1;
    "
>
                                ${escapeHTML(
                                    essa.name
                                )}
                            </h2>


                           <p
    style="
        margin:4px 0 8px;
        color:#3b9f99;
        font-weight:bold;
        font-size:13px;
        line-height:1.2;
    "
>
                                🐾 Play Mode ESSA
                            </p>


                            <button
                                class="
                                    play-action-button
                                    primary
                                "

                                    style="
        padding:7px 10px;
        font-size:12px;
        border-radius:9px;
        margin-top:2px;
    "

                                onclick="
                                    closePlayableEssaCollection();

                                    focusPlayableEssa(
                                        '${essa.id}'
                                    );
                                "
                            >
                                Play with
                                ${escapeHTML(
                                    essa.name
                                )}
                            </button>

                        </div>

                    `;
                }
            )
            .join("");


    const oldPopup =
        document.getElementById(
            "play-collection-popup"
        );


    if (oldPopup) {

        oldPopup.remove();

    }


    const popup =
        document.createElement(
            "div"
        );


    popup.id =
        "play-collection-popup";


    popup.innerHTML = `

        <div
            onclick="
                closePlayableEssaCollection()
            "

            style="
                position:fixed;
                inset:0;
                background:rgba(0,0,0,.35);
                z-index:9998;
            "
        ></div>


        <div
            style="
                position:fixed;
                left:50%;
                top:50%;
                transform:translate(-50%,-50%);

                width:
                    min(
                        900px,
                        calc(100% - 40px)
                    );

                max-height:80vh;
                overflow-y:auto;
                box-sizing:border-box;

                padding:25px;
                background:white;
                border-radius:24px;

                box-shadow:
                    0 12px 40px
                    rgba(0,0,0,.25);

                z-index:9999;
            "
        >


            <button
                onclick="
                    closePlayableEssaCollection()
                "

                aria-label="Close"

                style="
                    position:absolute;
                    right:16px;
                    top:16px;

                    width:38px;
                    height:38px;

                    border:none;
                    border-radius:50%;

                    background:#eef3f4;
                    color:#26343b;

                    font-size:20px;
                    font-weight:bold;

                    cursor:pointer;
                "
            >
                ×
            </button>


            <h1
                style="
                    margin-top:0;
                    padding-right:50px;
                    color:#17313a;
                "
            >
                🐾 My Play ESSAs
            </h1>


            <p
                style="
                    color:#68777b;
                    line-height:1.5;
                "
            >
                Your unlocked ESSAs.
            </p>


            ${
                unlockedEssas.length > 0

                    ? `

                        <div
                            style="
                                display:grid;

                                grid-template-columns:
                                    repeat(
                                        auto-fit,
                                       minmax(
    140px,
    1fr
)
                                    );

                                gap:18px;
                                margin-top:18px;
                            "
                        >
                            ${cards}
                        </div>

                    `

                    : `

                        <div
                            style="
                                padding:30px;
                                margin-top:18px;

                                background:#f7fafb;
                                border:1px solid #dbe5e7;
                                border-radius:20px;

                                text-align:center;
                                color:#68777b;
                            "
                        >

                            <div
                                style="
                                    font-size:55px;
                                "
                            >
                                🐾
                            </div>


                            <h2
                                style="
                                    color:#17313a;
                                "
                            >
                                No ESSAs Yet
                            </h2>


                            <p>
                                Your unlocked ESSAs
                                will appear here.
                            </p>

                        </div>

                    `
            }

        </div>

    `;


    const popupParent =
        document.fullscreenElement ||
        document.body;


    popupParent.appendChild(
        popup
    );
}

/* =========================================================
   CLOSE PLAYABLE ESSA COLLECTION
========================================================= */

function closePlayableEssaCollection() {

    const popup =
        document.getElementById(
            "play-collection-popup"
        );


    if (popup) {
        popup.remove();
    }
}

/* =========================================================
   PLAY MODE — FOCUS ESSA
========================================================= */

function focusPlayableEssa(
    essaId
) {

    const playData =
        getSavedPlayData();


    const essa =
        getPlayableEssaById(
            essaId
        );


    if (!essa) {

        return;
    }


    if (
        !playData
            .unlockedEssaIds
            .includes(
                essa.id
            )
    ) {

        alert(
            `${essa.name} unlocks at Trainer Level ${essa.unlockLevel}.`
        );

        return;
    }


    playData.selectedEssaId =
        essa.id;


    getPlayEssaStats(
        playData,
        essa.id
    );


    savePlayData(
        playData
    );


    renderPlayableEssaFocus(
        essa.id
    );
}


/* =========================================================
   PLAY STAT BAR
========================================================= */

function makePlayStatBar(
    label,
    icon,
    value
) {

    const amount =
        normalizePlayStatValue(
            value
        );


    return `

        <div
            style="
                margin-bottom:12px;
            "
        >


            <div
                style="
                    display:flex;

                    justify-content:
                        space-between;

                    gap:10px;

                    margin-bottom:5px;

                    font-size:13px;

                    font-weight:bold;

                    color:#26343b;
                "
            >


                <span>

                    ${icon}

                    ${escapeHTML(
                        label
                    )}

                </span>


                <span>

                    ${Math.round(
                        amount
                    )}%

                </span>


            </div>


            <div
                style="
                    width:100%;

                    height:12px;

                    background:
                        rgba(
                            225,
                            233,
                            234,
                            .95
                        );

                    border-radius:999px;

                    overflow:hidden;
                "
            >


                <div
                    style="
                        width:
                            ${amount}%;

                        height:100%;

                        background:#4fb5ae;

                        border-radius:999px;

                        transition:
                            width
                            .3s
                            ease;
                    "
                ></div>


            </div>


        </div>

    `;
}


/* =========================================================
   PLAY NEED STATUS
========================================================= */

function getPlayNeedStatus(
    stats
) {

    const needs = [

        {
            name:
                "Food",

            icon:
                "🍎",

            value:
                stats.food
        },

        {
            name:
                "Water",

            icon:
                "💧",

            value:
                stats.water
        },

        {
            name:
                "Cleanliness",

            icon:
                "🛁",

            value:
                stats.cleanliness
        },

        {
            name:
                "Happiness",

            icon:
                "💚",

            value:
                stats.happiness
        }

    ];


    needs.sort(
        function(a, b) {

            return (
                a.value -
                b.value
            );
        }
    );


    return needs[0];
}


/* =========================================================
   PLAY ESSA STATUS MESSAGE
========================================================= */

function getPlayStatusMessage(
    essa,
    stats
) {

    const lowest =
        getPlayNeedStatus(
            stats
        );


    if (
        lowest.value <=
        20
    ) {

        return (
            `${essa.name} really needs ` +
            `${lowest.name.toLowerCase()}!`
        );
    }


    if (
        lowest.value <=
        40
    ) {

        return (
            `${essa.name} could use some ` +
            `${lowest.name.toLowerCase()}.`
        );
    }


    if (
        lowest.value <=
        65
    ) {

        return (
            `${essa.name} is starting to want ` +
            `${lowest.name.toLowerCase()}.`
        );
    }


    return (
        `${essa.name} is doing pretty good!`
    );
}


/* =========================================================
   PLAY LEVEL-UP / XP MESSAGE
========================================================= */

function showPlayRewardMessage(
    xpAmount,
    rewardResult
) {

    const oldPopup =
        document.getElementById(
            "play-reward-popup"
        );

    if (oldPopup) {
        oldPopup.remove();
    }


    let extraMessage = "";


    if (
        rewardResult?.leveledUp
    ) {

        extraMessage += `
            <div
                style="
                    margin-top:10px;
                    font-size:20px;
                    font-weight:800;
                "
            >
                🎉 Trainer Level ${rewardResult.newLevel || ""} Reached!
            </div>
        `;
    }


    if (
        rewardResult?.newlyUnlocked?.length
    ) {

        rewardResult
            .newlyUnlocked
            .forEach(
                function(essa) {

                    extraMessage += `
                        <div
                            style="
                                margin-top:10px;
                                font-weight:700;
                            "
                        >
                            🔓 ${escapeHTML(essa.name)} has been unlocked!
                        </div>
                    `;

                }
            );
    }


    const popup =
        document.createElement(
            "div"
        );


    popup.id =
        "play-reward-popup";


    popup.innerHTML = `

        <div
            style="
                width:min(88vw,380px);
                padding:26px 24px;
                border-radius:24px;

                background:
                    rgba(255,255,255,.98);

                color:#26343b;

                text-align:center;

                box-shadow:
                    0 12px 40px
                    rgba(0,0,0,.25);

                border:
                    3px solid
                    var(
                        --user-theme-color,
                        #4fb5ae
                    );
            "
        >

            <div
                style="
                    font-size:42px;
                    margin-bottom:6px;
                "
            >
                ⭐
            </div>


            <div
                style="
                    font-size:24px;
                    font-weight:900;
                "
            >
                +${xpAmount} Trainer XP!
            </div>


            ${extraMessage}


            <button
                onclick="
                    document
                        .getElementById(
                            'play-reward-popup'
                        )
                        ?.remove()
                "

                class="play-action-button primary"

                style="
                    margin-top:20px;
                    min-width:110px;
                "
            >
                Awesome!
            </button>

        </div>
    `;


    Object.assign(
        popup.style,
        {
            position:
                "fixed",

            inset:
                "0",

            display:
                "flex",

            alignItems:
                "center",

            justifyContent:
                "center",

            padding:
                "20px",

            boxSizing:
                "border-box",

            background:
                "rgba(0,0,0,.40)",

            zIndex:
                "999999"
        }
    );


    const popupParent =
        document.fullscreenElement ||
        document.body;


    popupParent.appendChild(
        popup
    );

}

/* =========================================================
   PLAY MODE — FOCUS
========================================================= */

function renderPlayableEssaFocus(
    essaId
) {

    resetPageTheme();

    const playData =
        getSavedPlayData();

    const essa =
        getPlayableEssaById(
            essaId
        );

    if (
        !essa ||
        !playData
            .unlockedEssaIds
            .includes(
                essa.id
            )
    ) {

        renderPlayRoom();

        return;
    }

    const stats =
        getPlayEssaStats(
            playData,
            essa.id
        );

    document.querySelector(
        "main"
    ).innerHTML = `

      

        <div
            style="
                max-width:1000px;
                margin:0 auto;
            "
        >

            <div
                style="
                    position:relative;
                    min-height:680px;
                    overflow:hidden;
                    border-radius:28px;
                    border:1px solid #dbe5e7;
                    box-shadow:0 8px 28px rgba(0,0,0,.12);
                    background-color:#eaf6f4;
                    background-image:
                        linear-gradient(
                            rgba(255,255,255,.10),
                            rgba(255,255,255,.10)
                        ),
                        url('play-room/playroom.png');
                    background-size:cover;
                    background-position:center;
                "
            >

                <div
                    style="
                        position:absolute;
                        top:18px;
                        left:18px;
                        z-index:20;
                    "
                >

                    <button
                        onclick="renderPlayRoom()"
                        style="
                            padding:10px 15px;
                            border:none;
                            border-radius:12px;
                            background:rgba(255,255,255,.94);
                            color:#26343b;
                            font-weight:bold;
                            cursor:pointer;
                            box-shadow:0 3px 12px rgba(0,0,0,.12);
                        "
                    >
                        ← The Room
                    </button>

                </div>

                <div
                    style="
                        position:absolute;
                        top:18px;
                        left:50%;
                        transform:translateX(-50%);
                        width:min(70%,650px);
                        z-index:15;
                    "
                >
                    ${makeTrainerLevelBar(
                        playData
                    )}
                </div>

                <div
                    style="
                        position:absolute;
                        top:105px;
                        left:50%;
                        transform:translateX(-50%);
                        width:min(54%,470px);
                        z-index:5;
                    "
                >

                    ${makePlayableEssaVisual(
                        essa,
                        false,
                        "focus"
                    )}

                    <div
                        style="
                            display:inline-block;
                            padding:7px 16px;
                            margin-top:-5px;
                            background:rgba(255,255,255,.92);
                            border-radius:999px;
                            font-size:22px;
                            font-weight:bold;
                            box-shadow:0 3px 12px rgba(0,0,0,.12);
                        "
                    >
                        ${escapeHTML(
                            essa.name
                        )}
                    </div>

                </div>

                <div
                    id="play-message"
                    style="
                        position:absolute;
                        left:50%;
                        bottom:205px;
                        transform:translateX(-50%);
                        min-width:220px;
                        max-width:70%;
                        padding:10px 16px;
                        background:rgba(255,255,255,.94);
                        border-radius:999px;
                        font-weight:bold;
                        color:#26343b;
                        opacity:0;
                        pointer-events:none;
                        transition:opacity .2s ease;
                        z-index:20;
                        box-shadow:0 3px 12px rgba(0,0,0,.12);
                    "
                ></div>

                <div
                    style="
                        position:absolute;
                        left:18px;
                        top:115px;
                        width:210px;
                        padding:14px;
                        background:rgba(255,255,255,.93);
                        border-radius:18px;
                        box-shadow:0 4px 16px rgba(0,0,0,.12);
                        z-index:15;
                        text-align:left;
                    "
                >

                    ${makePlayStatBar(
                        "🍖",
                        "Food",
                        stats.food
                    )}

                    ${makePlayStatBar(
                        "💧",
                        "Drink",
                        stats.water
                    )}

                    ${makePlayStatBar(
                        "🛁",
                        "Clean",
                        stats.cleanliness
                    )}

                    ${makePlayStatBar(
                        "💚",
                        "Happy",
                        stats.happiness
                    )}

                </div>

                <div
                    style="
                        position:absolute;
                        left:50%;
                        bottom:18px;
                        transform:translateX(-50%);
                        width:calc(100% - 36px);
                        display:grid;
                        grid-template-columns:repeat(4,1fr);
                        gap:12px;
                        z-index:20;
                    "
                >

                    <button
                        onclick="showPlayFoodMenu('${essa.id}')"
                        style="
                            padding:15px 8px;
                            border:none;
                            border-radius:18px;
                            background:rgba(255,255,255,.96);
                            cursor:pointer;
                            box-shadow:0 4px 15px rgba(0,0,0,.15);
                            font-size:16px;
                            font-weight:bold;
                        "
                    >
                        <div
                            style="
                                font-size:34px;
                            "
                        >
                            🍖
                        </div>

                        Food
                    </button>

                    <button
                        onclick="showPlayDrinkMenu('${essa.id}')"
                        style="
                            padding:15px 8px;
                            border:none;
                            border-radius:18px;
                            background:rgba(255,255,255,.96);
                            cursor:pointer;
                            box-shadow:0 4px 15px rgba(0,0,0,.15);
                            font-size:16px;
                            font-weight:bold;
                        "
                    >
                        <div
                            style="
                                font-size:34px;
                            "
                        >
                            🥤
                        </div>

                        Drinks
                    </button>

                    <button
                        onclick="showPlayBathMenu('${essa.id}')"
                        style="
                            padding:15px 8px;
                            border:none;
                            border-radius:18px;
                            background:rgba(255,255,255,.96);
                            cursor:pointer;
                            box-shadow:0 4px 15px rgba(0,0,0,.15);
                            font-size:16px;
                            font-weight:bold;
                        "
                    >
                        <div
                            style="
                                font-size:34px;
                            "
                        >
                            🛁
                        </div>

                        Bathe
                    </button>

                    <button
                        onclick="petPlayableEssa('${essa.id}')"
                        style="
                            padding:15px 8px;
                            border:none;
                            border-radius:18px;
                            background:rgba(255,255,255,.96);
                            cursor:pointer;
                            box-shadow:0 4px 15px rgba(0,0,0,.15);
                            font-size:16px;
                            font-weight:bold;
                        "
                    >
                        <div
                            style="
                                font-size:34px;
                            "
                        >
                            💚
                        </div>

                        Pet
                    </button>

                </div>

            </div>

        </div>
    `;
}


function makePlayStatBar(
    icon,
    label,
    value
) {

    const safeValue =
        normalizePlayStatValue(
            value
        );

    return `
        <div
            style="
                margin-bottom:12px;
            "
        >

            <div
                style="
                    display:flex;
                    justify-content:space-between;
                    gap:8px;
                    margin-bottom:5px;
                    font-size:13px;
                    font-weight:bold;
                "
            >

                <span>
                    ${icon}
                    ${label}
                </span>

                <span>
                    ${Math.round(
                        safeValue
                    )}%
                </span>

            </div>

            <div
                style="
                    height:10px;
                    background:#e8eeee;
                    border-radius:999px;
                    overflow:hidden;
                "
            >

                <div
                    style="
                        width:${safeValue}%;
                        height:100%;
                        background:#4fb5ae;
                        border-radius:999px;
                    "
                ></div>

            </div>

        </div>
    `;
}


/* =========================================================
   PLAY MODE — ITEM MENU SHELL
========================================================= */

function makePlayItemMenuShell(
    essa,
    title,
    subtitle,
    itemsHTML
) {

    return `



        <div
            style="
                max-width:1000px;
                margin:0 auto;
            "
        >

            <div
                style="
                    min-height:680px;
                    position:relative;
                    overflow:hidden;
                    border-radius:28px;
                    border:1px solid #dbe5e7;
                    box-shadow:0 8px 28px rgba(0,0,0,.12);
                    background-color:#eaf6f4;
                    background-image:
                        linear-gradient(
                            rgba(255,255,255,.12),
                            rgba(255,255,255,.12)
                        ),
                        url('play-room/playroom.png');
                    background-size:cover;
                    background-position:center;
                "
            >

                <button
                    onclick="renderPlayableEssaFocus('${essa.id}')"
                    style="
                        position:absolute;
                        top:18px;
                        left:18px;
                        z-index:20;
                        padding:10px 15px;
                        border:none;
                        border-radius:12px;
                        background:rgba(255,255,255,.94);
                        color:#26343b;
                        font-weight:bold;
                        cursor:pointer;
                    "
                >
                    ← Back
                </button>

                <div
                    style="
                        position:absolute;
                        top:55px;
                        left:50%;
                        transform:translateX(-50%);
                        width:min(42%,330px);
                    "
                >
                    ${makePlayableEssaVisual(
                        essa,
                        false,
                        "focus"
                    )}
                </div>

                <div
                    style="
                        position:absolute;
                        left:20px;
                        right:20px;
                        bottom:20px;
                        padding:22px;
                        background:rgba(255,255,255,.97);
                        border-radius:24px;
                        box-shadow:0 5px 22px rgba(0,0,0,.16);
                        z-index:20;
                    "
                >

                    <h2
                        style="
                            margin-top:0;
                        "
                    >
                        ${title}
                    </h2>

                    <p
                        style="
                            color:#68777b;
                        "
                    >
                        ${subtitle}
                    </p>

                    <div
                        style="
                            display:grid;
                            grid-template-columns:repeat(auto-fit,minmax(115px,1fr));
                            gap:12px;
                            margin-top:18px;
                        "
                    >
                        ${itemsHTML}
                    </div>

                </div>

            </div>

        </div>
    `;
}


/* =========================================================
   PLAY MODE — FOOD
========================================================= */

function showPlayFoodMenu(
    essaId
) {

    const essa =
        getPlayableEssaById(
            essaId
        );

    if (!essa) {
        return;
    }

    const itemsHTML =
        playFoods
            .map(
                function(food) {

                    return `
                        <button
                            onclick="givePlayFood('${essa.id}', '${food.id}')"
                            style="
                                padding:15px 8px;
                                border:1px solid #dbe5e7;
                                border-radius:16px;
                                background:white;
                                cursor:pointer;
                            "
                        >

                            <div
                                style="
                                    font-size:40px;
                                "
                            >
                                ${food.icon}
                            </div>

                            <strong>
                                ${escapeHTML(
                                    food.name
                                )}
                            </strong>

                        </button>
                    `;
                }
            )
            .join("");

    document.querySelector(
        "main"
    ).innerHTML =
        makePlayItemMenuShell(
            essa,
            "🍖 Choose Food",
            `What would you like to feed ${escapeHTML(
                essa.name
            )}?`,
            itemsHTML
        );
}


function givePlayFood(
    essaId,
    foodId
) {

    const playData =
        getSavedPlayData();

    const essa =
        getPlayableEssaById(
            essaId
        );

    const food =
        playFoods.find(
            function(item) {

                return (
                    item.id ===
                    foodId
                );
            }
        );

    if (
        !essa ||
        !food
    ) {
        return;
    }

    const stats =
        getPlayEssaStats(
            playData,
            essa.id
        );

    stats.food =
        normalizePlayStatValue(
            stats.food +
            food.food
        );

    stats.happiness =
        normalizePlayStatValue(
            stats.happiness +
            food.happiness
        );

    stats.lastFoodId =
        food.id;

    const result =
        addTrainerXP(
            playData,
            food.xp
        );

    savePlayData(
        playData
    );

    renderPlayableEssaFocus(
        essa.id
    );

    showPlayMessage(
        `${food.icon} ${essa.name} enjoyed the ${food.name}! +${food.xp} XP`
    );

    showPlayUnlockMessages(
        result
    );
}


/* =========================================================
   PLAY MODE — DRINKS
========================================================= */

function showPlayDrinkMenu(
    essaId
) {

    const essa =
        getPlayableEssaById(
            essaId
        );

    if (!essa) {
        return;
    }

    const itemsHTML =
        playDrinks
            .map(
                function(drink) {

                    return `
                        <button
                            onclick="givePlayDrink('${essa.id}', '${drink.id}')"
                            style="
                                padding:15px 8px;
                                border:1px solid #dbe5e7;
                                border-radius:16px;
                                background:white;
                                cursor:pointer;
                            "
                        >

                            <div
                                style="
                                    font-size:40px;
                                "
                            >
                                ${drink.icon}
                            </div>

                            <strong>
                                ${escapeHTML(
                                    drink.name
                                )}
                            </strong>

                        </button>
                    `;
                }
            )
            .join("");

    document.querySelector(
        "main"
    ).innerHTML =
        makePlayItemMenuShell(
            essa,
            "🥤 Choose a Drink",
            `What would ${escapeHTML(
                essa.name
            )} like to drink?`,
            itemsHTML
        );
}


function givePlayDrink(
    essaId,
    drinkId
) {

    const playData =
        getSavedPlayData();


    const essa =
        getAnyPlayableEssaById(
            essaId
        );


    const drink =
        playDrinks.find(
            function(item) {

                return (
                    item.id ===
                    drinkId
                );
            }
        );


    if (
        !essa ||
        !drink
    ) {

        return;
    }


    const stats =
        getPlayEssaStats(
            playData,
            essa.id
        );


    stats.water =
        normalizePlayStatValue(
            stats.water +
            drink.water
        );


    stats.happiness =
        normalizePlayStatValue(
            stats.happiness +
            drink.happiness
        );


    stats.lastDrinkId =
        drink.id;


    const result =
        addTrainerXP(
            playData,
            drink.xp
        );


    savePlayData(
        playData
    );


    renderPlayableEssaFocus(
        essa.id
    );


    showPlayMessage(
        `${drink.icon} ${essa.name} had some ${drink.name}! +${drink.xp} XP`
    );


    showPlayUnlockMessages(
        result
    );
}

/* =========================================================
   PLAY MODE — BATH / SOAP
========================================================= */

function showPlayBathMenu(
    essaId
) {

    const essa =
        getPlayableEssaById(
            essaId
        );

    if (!essa) {
        return;
    }

    const itemsHTML =
        playSoaps
            .map(
                function(soap) {

                    return `
                        <button
                            onclick="bathePlayableEssa('${essa.id}', '${soap.id}')"
                            style="
                                padding:15px 8px;
                                border:1px solid #dbe5e7;
                                border-radius:16px;
                                background:white;
                                cursor:pointer;
                            "
                        >

                            <div
                                style="
                                    width:48px;
                                    height:48px;
                                    margin:0 auto 8px auto;
                                    border-radius:14px;
                                    background:${soap.color};
                                    border:3px solid white;
                                    box-shadow:0 0 0 1px #cbd9dc;
                                "
                            ></div>

                            <strong>
                                ${escapeHTML(
                                    soap.name
                                )}
                            </strong>

                        </button>
                    `;
                }
            )
            .join("");

    document.querySelector(
        "main"
    ).innerHTML =
        makePlayItemMenuShell(
            essa,
            "🛁 Choose Soap",
            `Pick a soap color for ${escapeHTML(
                essa.name
            )}'s bath.`,
            itemsHTML
        );
}


/* =========================================================
   PLAY MODE — BATHE
========================================================= */

function bathePlayableEssa(
    essaId,
    soapId
) {

    const playData =
        getSavedPlayData();

    const essa =
        getPlayableEssaById(
            essaId
        );

    const soap =
        playSoaps.find(
            function(item) {

                return (
                    item.id ===
                    soapId
                );
            }
        );

    if (
        !essa ||
        !soap
    ) {
        return;
    }

    const stats =
        getPlayEssaStats(
            playData,
            essa.id
        );

    stats.cleanliness =
        normalizePlayStatValue(
            stats.cleanliness +
            soap.cleanliness
        );

    stats.happiness =
        normalizePlayStatValue(
            stats.happiness +
            4
        );

    stats.lastSoapId =
        soap.id;

    const result =
        addTrainerXP(
            playData,
            soap.xp
        );

    savePlayData(
        playData
    );

    renderPlayableEssaFocus(
        essa.id
    );

    showPlayMessage(
        `🫧 ${essa.name} is squeaky clean with ${soap.name}! +${soap.xp} XP`
    );

    showPlayUnlockMessages(
        result
    );
}


/* =========================================================
   PLAY MODE — PET
========================================================= */

function petPlayableEssa(
    essaId
) {

    const playData =
        getSavedPlayData();

    const essa =
        getPlayableEssaById(
            essaId
        );

    if (!essa) {
        return;
    }

    const stats =
        getPlayEssaStats(
            playData,
            essa.id
        );

    stats.happiness =
        normalizePlayStatValue(
            stats.happiness +
            12
        );

    const result =
        addTrainerXP(
            playData,
            4
        );

    savePlayData(
        playData
    );

    showPlayMessage(
        `💚 ${essa.name} loved the pets! +4 XP`
    );

    showPlayUnlockMessages(
        result
    );
}


/* =========================================================
   PLAY MODE — MESSAGES
========================================================= */

let playMessageTimer =
    null;


function showPlayMessage(
    message
) {

    const box =
        document.getElementById(
            "play-message"
        );

    if (!box) {
        return;
    }

    box.textContent =
        message;

    box.style.opacity =
        "1";

    if (
        playMessageTimer
    ) {

        clearTimeout(
            playMessageTimer
        );
    }

    playMessageTimer =
        setTimeout(
            function() {

                const currentBox =
                    document.getElementById(
                        "play-message"
                    );

                if (
                    currentBox
                ) {

                    currentBox.style.opacity =
                        "0";
                }

            },
            2600
        );
}


/* =========================================================
   PLAY LEVEL-UP MESSAGE
========================================================= */

function showPlayUnlockMessages(
    result
) {

    if (!result) {
        return;
    }


    if (!result.leveledUp) {
        return;
    }


    const playData =
        getSavedPlayData();


    setTimeout(
        function() {

            const oldPopup =
                document.getElementById(
                    "play-level-up-popup"
                );

            if (oldPopup) {
                oldPopup.remove();
            }


            const popup =
                document.createElement(
                    "div"
                );


            popup.id =
                "play-level-up-popup";


            popup.innerHTML = `

                <div
                    style="
                        width:min(85vw,360px);

                        padding:28px 24px;

                        background:white;

                        border:
                            3px solid
                            var(
                                --user-theme-color,
                                #4fb5ae
                            );

                        border-radius:26px;

                        box-shadow:
                            0 14px 45px
                            rgba(0,0,0,.28);

                        text-align:center;

                        color:#26343b;
                    "
                >

                    <div
                        style="
                            font-size:48px;
                            line-height:1;
                            margin-bottom:10px;
                        "
                    >
                        ⭐
                    </div>


                    <div
                        style="
                            font-size:16px;
                            font-weight:700;
                            color:#68777b;
                            margin-bottom:4px;
                        "
                    >
                        Trainer Level
                    </div>


                    <div
                        style="
                            font-size:42px;
                            line-height:1;
                            font-weight:900;

                            color:
                                var(
                                    --user-theme-color,
                                    #4fb5ae
                                );
                        "
                    >
                        ${playData.trainerLevel}
                    </div>


                    <div
                        style="
                            margin-top:10px;
                            font-size:18px;
                            font-weight:800;
                        "
                    >
                        Reached! 🎉
                    </div>


                    <button
                        class="
                            play-action-button
                            primary
                        "

                        onclick="
                            document
                                .getElementById(
                                    'play-level-up-popup'
                                )
                                ?.remove()
                        "

                        style="
                            margin-top:20px;
                            min-width:120px;
                        "
                    >
                        Awesome!
                    </button>

                </div>
            `;


            Object.assign(
                popup.style,
                {
                    position:
                        "fixed",

                    inset:
                        "0",

                    display:
                        "flex",

                    alignItems:
                        "center",

                    justifyContent:
                        "center",

                    padding:
                        "20px",

                    boxSizing:
                        "border-box",

                    background:
                        "rgba(0,0,0,.45)",

                    zIndex:
                        "999999"
                }
            );


            const popupParent =
                document.fullscreenElement ||
                document.body;


            popupParent.appendChild(
                popup
            );

        },
        300
    );

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
   PLAY HOUSE SYSTEM
   ---------------------------------------------------------
   Rooms:
   Playroom
   Kitchen
   Bathroom
   Bedroom
   Backyard
   Arcade
========================================================= */


/* =========================================================
   HOUSE SETTINGS
========================================================= */

const PLAY_NEED_INTERVAL_MINUTES =
    10;


const PLAY_MAX_OFFLINE_DECAY_HOURS =
    4;


const PLAY_NEED_DECAY = {

    food:
        0.7,

    water:
        0.8,

    cleanliness:
        1.5,

    happiness:
        2.5

};

/* =========================================================
   HOUSE STORAGE KEY
========================================================= */

function getPlayHouseStorageKey() {

    return userStorageKey(
        "playHouse"
    );
}


/* =========================================================
   DEFAULT HOUSE DATA
========================================================= */

function makeDefaultPlayHouseData() {

    return {

        currentRoomId:
            "playroom",

        essaRooms:
            {},

        essaPositions:
            {},

        lastNeedUpdate:
            Date.now()

    };
}

/* =========================================================
   SAVE HOUSE DATA
========================================================= */

function savePlayHouseData(
    houseData
) {

    const key =
        getPlayHouseStorageKey();


    if (!key) {

        return;
    }


    try {

        localStorage.setItem(
            key,
            JSON.stringify(
                houseData
            )
        );

    } catch (error) {

        console.error(
            "Could not save Play house data:",
            error
        );
    }
}

/* =========================================================
   CALL ESSA MENU
========================================================= */

function openCallEssaMenu() {

    const houseData =
        getSavedPlayHouseData();


    const currentRoomId =
        houseData.currentRoomId;


    const currentRoom =
        playRooms.find(
            function(room) {

                return (
                    room.id ===
                    currentRoomId
                );
            }
        );


    const playData =
        getSavedPlayData();


    const availableEssas =
    getAllPlayableEssas().filter(
        function(essa) {

                const essaRoom =
                    houseData
                        .essaRooms[
                            essa.id
                        ];


                const alreadyHere =
                    essaRoom ===
                    currentRoomId;


                return (
                    playData
                        .unlockedEssaIds
                        .includes(
                            essa.id
                        )
                    &&
                    !alreadyHere
                );
            }
        );


    let cards = "";


    if (
        availableEssas.length ===
        0
    ) {

        cards = `

            <div
                style="
                    padding:24px;
                    text-align:center;
                    background:white;
                    border-radius:18px;
                    border:
                        1px solid
                        #dbe5e7;
                "
            >

                <p
                    style="
                        margin:0;
                        color:#68777b;
                    "
                >
                    🐾 There are no other ESSAs
                    available to call into this room.
                </p>

            </div>

        `;

    } else {

        cards =
            availableEssas
                .map(
                    function(essa) {

                        const roomId =
                            houseData
                                .essaRooms[
                                    essa.id
                                ];


                        const room =
                            playRooms.find(
                                function(room) {

                                    return (
                                        room.id ===
                                        roomId
                                    );
                                }
                            );


                        return `

                            <button
                                onclick="
                                    callEssaToCurrentRoom(
                                        '${essa.id}'
                                    )
                                "

                                style="
                                    padding:14px;
                                    background:white;
                                    border:
                                        1px solid
                                        #dbe5e7;
                                    border-radius:18px;
                                    cursor:pointer;
                                    text-align:center;
                                "
                            >

                                ${
                                    makePlayableEssaVisual(
                                        essa,
                                        false
                                    )
                                }


                                <div
                                    style="
                                        margin-top:8px;
                                        font-weight:bold;
                                    "
                                >
                                    ${
                                        escapeHTML(
                                            essa.name
                                        )
                                    }
                                </div>


                                <div
                                    style="
                                        margin-top:5px;
                                        color:#68777b;
                                        font-size:13px;
                                    "
                                >
                                    Currently in:
                                    ${
                                        room
                                            ? (
                                                room.icon +
                                                " " +
                                                escapeHTML(
                                                    room.name
                                                )
                                            )
                                            : "House"
                                    }
                                </div>

                            </button>

                        `;
                    }
                )
                .join("");
    }


    const oldPopup =
        document.getElementById(
            "call-essa-popup"
        );


    if (oldPopup) {

        oldPopup.remove();

    }


    const popup =
        document.createElement(
            "div"
        );


    popup.id =
        "call-essa-popup";


    popup.innerHTML = `

        <div
            onclick="
                closeCallEssaMenu()
            "
            style="
                position:fixed;
                inset:0;
                background:rgba(0,0,0,.35);
                z-index:9998;
            "
        ></div>


        <div
            style="
                position:fixed;
                left:50%;
                top:50%;
                transform:
                    translate(-50%, -50%);
                width:min(
                    700px,
                    calc(100% - 40px)
                );
                max-height:80vh;
                overflow-y:auto;
                box-sizing:border-box;
                padding:25px;
                background:white;
                border-radius:24px;
                box-shadow:
                    0 12px 40px
                    rgba(0,0,0,.25);
                z-index:9999;
            "
        >

            <button
                onclick="
                    closeCallEssaMenu()
                "
                aria-label="Close"
                style="
                    position:absolute;
                    right:16px;
                    top:16px;
                    width:38px;
                    height:38px;
                    border:none;
                    border-radius:50%;
                    background:#eef3f4;
                    color:#26343b;
                    font-size:20px;
                    font-weight:bold;
                    cursor:pointer;
                "
            >
                ×
            </button>


            <h1
                style="
                    margin-top:0;
                    padding-right:45px;
                    color:#17313a;
                "
            >
                📣 Call ESSA
            </h1>


            <p
                style="
                    color:#68777b;
                    line-height:1.5;
                "
            >
                Choose an ESSA to call into
                ${
                    currentRoom
                        ? escapeHTML(
                            currentRoom.name
                        )
                        : "this room"
                }.
            </p>


            <div
                style="
                    display:grid;
                    grid-template-columns:
                        repeat(
                            auto-fit,
                            minmax(
                                150px,
                                1fr
                            )
                        );
                    gap:14px;
                    margin-top:18px;
                "
            >
                ${cards}
            </div>

        </div>

    `;


    const popupParent =
        document.fullscreenElement ||
        document.body;


    popupParent.appendChild(
        popup
    );
}


function closeCallEssaMenu() {

    const popup =
        document.getElementById(
            "call-essa-popup"
        );


    if (popup) {

        popup.remove();

    }
}

/* =========================================================
   CALL ESSA TO CURRENT ROOM
========================================================= */

function callEssaToCurrentRoom(
    essaId
) {

    const houseData =
        getSavedPlayHouseData();


    const currentRoomId =
        houseData.currentRoomId;


    const playData =
        getSavedPlayData();


   const essa =
    getAllPlayableEssas().find(
        function(essa) {

            return (
                essa.id ===
                essaId
            );
        }
    );


    if (!essa) {

        return;
    }


    const unlocked =
        playData
            .unlockedEssaIds
            .includes(
                essa.id
            );


    if (!unlocked) {

        return;
    }


    houseData
        .essaRooms[
            essa.id
        ] =
        currentRoomId;


    houseData
        .essaPositions[
            essa.id
        ] = {

            x: -8,

            floor: 4,

            calledIn: true

        };


    savePlayHouseData(
        houseData
    );


    renderPlayRoom();


    window.setTimeout(
        function() {

            animateCalledEssaIntoRoom(
                essa.id
            );

        },

        80
    );
}


/* =========================================================
   ANIMATE CALLED ESSA INTO ROOM
========================================================= */

function animateCalledEssaIntoRoom(
    essaId
) {

    const houseData =
        getSavedPlayHouseData();


    const essaElement =
    document.querySelector(
        '[data-play-house-essa="' +
        essaId +
        '"]'
    );


    if (!essaElement) {

        return;
    }


    const finalX =
        15 +
        Math.random() *
        25;


    essaElement.style.transition =
        "left 1.2s ease-out";


    essaElement.style.left =
        finalX +
        "%";


    window.setTimeout(
        function() {

            const latestHouseData =
                getSavedPlayHouseData();


            if (
                latestHouseData
                    .essaPositions[
                        essaId
                    ]
            ) {

                latestHouseData
                    .essaPositions[
                        essaId
                    ]
                    .x =
                    finalX;


                latestHouseData
                    .essaPositions[
                        essaId
                    ]
                    .calledIn =
                    false;


                savePlayHouseData(
                    latestHouseData
                );
            }

        },

        1250
    );
}

/* =========================================================
   LOAD HOUSE DATA
========================================================= */

function getSavedPlayHouseData() {

    const key =
        getPlayHouseStorageKey();


    const defaults =
        makeDefaultPlayHouseData();


    if (!key) {

        return defaults;
    }


    try {

        const saved =
            JSON.parse(
                localStorage.getItem(
                    key
                ) ||
                "null"
            );


        if (
            !saved ||
            typeof saved !==
                "object"
        ) {

            return defaults;
        }


        const result = {

            ...defaults,
            ...saved,

            essaRooms: {

                ...defaults.essaRooms,
                ...(
                    saved.essaRooms ||
                    {}
                )

            },

            essaPositions: {

                ...defaults.essaPositions,
                ...(
                    saved.essaPositions ||
                    {}
                )

            }

        };


        if (
            !playRooms.some(
                function(room) {

                    return (
                        room.id ===
                        result.currentRoomId
                    );

                }
            )
        ) {

            result.currentRoomId =
                "playroom";
        }


        getSavedCustomPlayEssas().forEach( 
            function(essa) {

                const roomId =
                    result
                        .essaRooms[
                            essa.id
                        ];


                const validRoom =
    roomId ===
        "kennel" ||
    playRooms.some(
        function(room) {

            return (
                room.id ===
                roomId
            );

        }
    );


                if (!validRoom) {

                    result
                        .essaRooms[
                            essa.id
                        ] =
                        "playroom";
                }

            }
        );


        if (
            !result.lastNeedUpdate
        ) {

            result.lastNeedUpdate =
                Date.now();
        }


        return result;

    } catch (error) {

        console.error(
            "Could not load Play house data:",
            error
        );


        return defaults;
    }
}



/* =========================================================
   FIND ROOM
========================================================= */

function getPlayRoomById(
    roomId
) {

    return (
        playRooms.find(
            function(room) {

                return (
                    room.id ===
                    roomId
                );

            }
        ) ||
        playRooms[0]
    );
}


/* =========================================================
   GET ESSA ROOM
========================================================= */

function getEssaRoom(
    houseData,
    essaId
) {

    const roomId =
        houseData
            ?.essaRooms
            ?.[
                essaId
            ];


    return getPlayRoomById(
        roomId ||
        "playroom"
    );
}


/* =========================================================
   GET CURRENT HOUSE ROOM
========================================================= */

function getCurrentPlayRoom() {

    const houseData =
        getSavedPlayHouseData();


    return getPlayRoomById(
        houseData.currentRoomId
    );
}


/* =========================================================
   CHANGE CURRENT ROOM
========================================================= */

function goToPlayRoom(
    roomId
) {

    const room =
        getPlayRoomById(
            roomId
        );


    if (!room) {

        return;
    }


    const houseData =
        getSavedPlayHouseData();


    houseData.currentRoomId =
        room.id;


    savePlayHouseData(
        houseData
    );


    renderPlayRoom();
}


/* =========================================================
   MOVE LEFT / RIGHT THROUGH ROOMS
========================================================= */

function changePlayRoom(
    direction
) {

    const houseData =
        getSavedPlayHouseData();


    let currentIndex =
        playRooms.findIndex(
            function(room) {

                return (
                    room.id ===
                    houseData.currentRoomId
                );

            }
        );


    if (
        currentIndex ===
        -1
    ) {

        currentIndex =
            0;
    }


    let nextIndex =
        currentIndex +
        Number(
            direction
        );


    if (
        nextIndex <
        0
    ) {

        nextIndex =
            playRooms.length -
            1;
    }


    if (
        nextIndex >=
        playRooms.length
    ) {

        nextIndex =
            0;
    }


    houseData.currentRoomId =
        playRooms[
            nextIndex
        ].id;


    savePlayHouseData(
        houseData
    );


    renderPlayRoom();
}


/* =========================================================
   ROOM PICKER
========================================================= */

function showPlayRoomPicker() {

    const oldPicker =
        document.getElementById(
            "play-room-picker"
        );


    if (oldPicker) {

        oldPicker.remove();
    }


    const houseData =
        getSavedPlayHouseData();


    const picker =
        document.createElement(
            "div"
        );


    picker.id =
        "play-room-picker";


    const buttons =
        playRooms
            .map(
                function(room) {

                    const active =
                        room.id ===
                        houseData.currentRoomId;


                    return `

                        <button
                            onclick="
                                goToPlayRoom(
                                    '${room.id}'
                                );

                                closePlayRoomPicker();
                            "

                            style="
                                padding:
                                    14px
                                    18px;

                                border:
                                    ${
                                        active
                                            ? "2px solid #4fb5ae"
                                            : "1px solid #dbe5e7"
                                    };

                                border-radius:
                                    16px;

                                background:
                                    ${
                                        active
                                            ? "#edf9f8"
                                            : "white"
                                    };

                                color:#26343b;

                                font-size:
                                    16px;

                                font-weight:
                                    bold;

                                cursor:
                                    pointer;
                            "
                        >

                            <div
                                style="
                                    font-size:
                                        30px;

                                    margin-bottom:
                                        5px;
                                "
                            >
                                ${room.icon}
                            </div>

                            ${escapeHTML(
                                room.name
                            )}

                        </button>

                    `;

                }
            )
            .join("");


    picker.innerHTML = `

        <div
            style="
                position:
                    fixed;

                inset:0;

                z-index:
                    9999;

                display:
                    flex;

                align-items:
                    center;

                justify-content:
                    center;

                padding:
                    20px;

                background:
                    rgba(
                        0,
                        0,
                        0,
                        .5
                    );

                box-sizing:
                    border-box;
            "

            onclick="
                if (
                    event.target ===
                    this
                ) {

                    closePlayRoomPicker();
                }
            "
        >

            <div
                style="
                    width:
                        min(
                            100%,
                            650px
                        );

                    max-height:
                        90vh;

                    overflow:
                        auto;

                    padding:
                        24px;

                    background:
                        white;

                    border-radius:
                        24px;

                    box-shadow:
                        0
                        12px
                        38px
                        rgba(
                            0,
                            0,
                            0,
                            .25
                        );
                "
            >

                <div
                    style="
                        display:
                            flex;

                        justify-content:
                            space-between;

                        align-items:
                            center;

                        gap:
                            15px;

                        margin-bottom:
                            20px;
                    "
                >

                    <h2
                        style="
                            margin:
                                0;
                        "
                    >
                        🏠 Choose a Room
                    </h2>


                    <button
                        onclick="
                            closePlayRoomPicker()
                        "

                        style="
                            width:
                                40px;

                            height:
                                40px;

                            padding:
                                0;

                            border-radius:
                                50%;
                        "
                    >
                        ×
                    </button>

                </div>


                <div
                    style="
                        display:
                            grid;

                        grid-template-columns:
                            repeat(
                                auto-fit,
                                minmax(
                                    150px,
                                    1fr
                                )
                            );

                        gap:
                            12px;
                    "
                >

                    ${buttons}

                </div>

            </div>

        </div>

    `;


    document.body.appendChild(
        picker
    );
}


/* =========================================================
   CLOSE ROOM PICKER
========================================================= */

function closePlayRoomPicker() {

    const picker =
        document.getElementById(
            "play-room-picker"
        );


    if (picker) {

        picker.remove();
    }
}


/* =========================================================
   NEED DECAY
========================================================= */

function applyPlayNeedsDecay() {

    const playData =
        getSavedPlayData();


    const houseData =
        getSavedPlayHouseData();


    const now =
        Date.now();


    let lastUpdate =
        Number(
            houseData.lastNeedUpdate
        ) ||
        now;


    if (
        lastUpdate >
        now
    ) {

        lastUpdate =
            now;
    }


    let elapsedMilliseconds =
        now -
        lastUpdate;


    const maxMilliseconds =
        PLAY_MAX_OFFLINE_DECAY_HOURS *
        60 *
        60 *
        1000;


    elapsedMilliseconds =
        Math.min(
            elapsedMilliseconds,
            maxMilliseconds
        );


    const intervalMilliseconds =
        PLAY_NEED_INTERVAL_MINUTES *
        60 *
        1000;


    const intervalsPassed =
        elapsedMilliseconds /
        intervalMilliseconds;


    let changed =
        false;


    playData
        .unlockedEssaIds
        .forEach(
            function(essaId) {

                const stats =
                    getPlayEssaStats(
                        playData,
                        essaId
                    );


                const oldFood =
                    stats.food;


                const oldWater =
                    stats.water;


                const oldCleanliness =
                    stats.cleanliness;


                const oldHappiness =
                    stats.happiness;


                stats.food =
                    normalizePlayStatValue(
                        stats.food -
                        (
                            PLAY_NEED_DECAY.food *
                            intervalsPassed
                        )
                    );


                stats.water =
                    normalizePlayStatValue(
                        stats.water -
                        (
                            PLAY_NEED_DECAY.water *
                            intervalsPassed
                        )
                    );


                stats.cleanliness =
                    normalizePlayStatValue(
                        stats.cleanliness -
                        (
                            PLAY_NEED_DECAY.cleanliness *
                            intervalsPassed
                        )
                    );


                stats.happiness =
                    normalizePlayStatValue(
                        stats.happiness -
                        (
                            PLAY_NEED_DECAY.happiness *
                            intervalsPassed
                        )
                    );


                if (
                    oldFood !==
                        stats.food

                    ||

                    oldWater !==
                        stats.water

                    ||

                    oldCleanliness !==
                        stats.cleanliness

                    ||

                    oldHappiness !==
                        stats.happiness
                ) {

                    changed =
                        true;
                }


                /* ==============================
                   ALL NEEDS AT ZERO
                ============================== */

                if (
                    arePlayEssaNeedsAtZero(
                        stats
                    )
                ) {

                        if (
        houseData
            .essaRooms[
                essaId
            ] ===
        "kennel"
    ) {
        return;
    }

                    // START THE 24-HOUR CLOCK
                    // ONLY THE FIRST TIME THEY
                    // REACH ALL ZERO

                    if (
                        !stats.allNeedsZeroSince
                    ) {

                        stats.allNeedsZeroSince =
                            now;

                        changed =
                            true;
                    }

                    const neglectMilliseconds =
    PLAY_ESSA_NEGLECT_HOURS *
    60 *
    60 *
    1000;


const hasBeenNeglected =
    !stats.neglectHandled &&
    stats.allNeedsZeroSince &&
    (
        now -
        stats.allNeedsZeroSince
    ) >=
    neglectMilliseconds;

    if (
    hasBeenNeglected
) {

    houseData
        .essaRooms[
            essaId
        ] =
        "kennel";

        stats.neglectHandled =
        true;

        stats.kennelReason =
    "voidy";


    houseData
        .essaPositions[
            essaId
        ] = {

            x:
                25 +
                Math.random() *
                50,

            floor:
                8 +
                Math.random() *
                18

        };


    changed =
        true;

    const neglectedEssa =
    getAnyPlayableEssaById(
        essaId
    );


if (
    neglectedEssa
) {

    showVoidyNeglectPopup(
        neglectedEssa
    );
}


    return;
}


                    // MOVE THEM TO THE BEDROOM

                    if (
                        houseData
                            .essaRooms[
                                essaId
                            ] !==
                        "bedroom"
                    ) {

                        houseData
                            .essaRooms[
                                essaId
                            ] =
                            "bedroom";


                  const sleepingEssaIds =
    Object.keys(
        houseData.essaRooms
    ).filter(
        function(id) {

            return (
                id !== essaId &&
                houseData.essaRooms[id] ===
                    "bedroom" &&
                arePlayEssaNeedsAtZero(
                    getPlayEssaStats(
                        playData,
                        id
                    )
                )
            );
        }
    );


const bedIndex =
    sleepingEssaIds.length %
    playBedroomSleepPositions.length;


const bedPosition =
    playBedroomSleepPositions[
        bedIndex
    ];


houseData
    .essaPositions[
        essaId
    ] = {

        x:
            bedPosition.x,

        floor:
            bedPosition.floor

    };
                    }

                }

                else {

                    // THEY RECEIVED CARE,
                    // SO CANCEL THE 24-HOUR CLOCK

                    if (
                        stats.allNeedsZeroSince
                    ) {

                        stats.allNeedsZeroSince =
                            null;

                        changed =
                            true;
                    }

                }

            }
        );


    houseData.lastNeedUpdate =
        now;


    savePlayHouseData(
        houseData
    );


    if (changed) {

        savePlayData(
            playData
        );
    }
}

/* =========================================================
   BIGGEST ESSA NEED
========================================================= */

function getEssaBiggestNeed(
    stats
) {

    const needs = [

        {

            id:
                "food",

            value:
                normalizePlayStatValue(
                    stats.food
                ),

            roomId:
                "kitchen",

            icon:
                "🍎"

        },

        {

            id:
                "water",

            value:
                normalizePlayStatValue(
                    stats.water
                ),

            roomId:
                "kitchen",

            icon:
                "💧"

        },

        {

            id:
                "cleanliness",

            value:
                normalizePlayStatValue(
                    stats.cleanliness
                ),

            roomId:
                "bathroom",

            icon:
                "🛁"

        },

        {

            id:
                "happiness",

            value:
                normalizePlayStatValue(
                    stats.happiness
                ),

            roomId:
                "playroom",

            icon:
                "💚"

        }

    ];


    needs.sort(
        function(a, b) {

            return (
                a.value -
                b.value
            );

        }
    );


    return needs[0];
}


/* =========================================================
   NEED SPEECH
========================================================= */

function getEssaNeedMessage(
    essa,
    stats
) {

    if (
    stats.justReturnedFromVoidy ===
    true
) {

    return "I had fun with Voidy, he's nice. But I missed you. 💗";
}

if (
    stats.hasBeenWithVoidy === true &&
    stats.justReturnedFromVoidy !== true &&
    stats.food >= 99 &&
stats.water >= 99 &&
stats.cleanliness >= 99 &&
stats.happiness >= 99
) {

    return "VITBDE! 🙂";
}

    const need =
        getEssaBiggestNeed(
            stats
        );


    if (
        need.value >
        80
    ) {

        return "";
    }


    if (
        need.id ===
        "food"
    ) {

        if (
            need.value <=
            35
        ) {

            return "I'm REALLY hungry! 🍎";
        }


        if (
            need.value <=
            60
        ) {

            return "Can I have something to eat? 🥕";
        }


        return "I'm getting a little hungry. 🍪";
    }


    if (
        need.id ===
        "water"
    ) {

        if (
            need.value <=
            35
        ) {

            return "I'm soooo thirsty! 💧";
        }


        if (
            need.value <=
            60
        ) {

            return "Can I have a drink? 🥤";
        }


        return "I could use a drink. 💧";
    }


    if (
        need.id ===
        "cleanliness"
    ) {

        if (
            need.value <=
            35
        ) {

            return "Ewww! I need a bath! 🛁";
        }


        if (
            need.value <=
            60
        ) {

            return "I think I'm getting dirty. 🫧";
        }


        return "Maybe bath time soon? 🧼";
    }


    if (
        need.id ===
        "happiness"
    ) {

        if (
            need.value <=
            35
        ) {

            return "Please play with me! 🥺";
        }


        if (
            need.value <=
            60
        ) {

            return "Can we do something fun? 💚";
        }


        return "I want some attention! 🐾";
    }


    return "";
}


/* =========================================================
   SPEECH BUBBLE
========================================================= */

function makeEssaNeedBubble(
    essa,
    stats
) {

        if (
        arePlayEssaNeedsAtZero(
            stats
        )
    ) {
        return "";
    }

    const message =
        getEssaNeedMessage(
            essa,
            stats
        );


    if (!message) {

        return "";
    }


    const need =
        getEssaBiggestNeed(
            stats
        );


    const urgent =
        need.value <=
        35;


    return `

        <div
            class="
                play-house-speech
                ${
                    urgent
                        ? "play-house-speech-urgent"
                        : ""
                }
            "

            style="
                position:
                    absolute;

                left:
                    50%;

                bottom:
                    calc(
                        100% +
                        5px
                    );

                transform:
                    translateX(
                        -50%
                    );

                min-width:
                    125px;

                max-width:
                    190px;

                padding:
                    8px
                    11px;

                background:
                    rgba(
                        255,
                        255,
                        255,
                        .96
                    );

                border:
                    ${
                        urgent
                            ? "2px solid #e97b7b"
                            : "1px solid #dbe5e7"
                    };

                border-radius:
                    15px;

                color:
                    #26343b;

                font-size:
                    12px;

                font-weight:
                    bold;

                text-align:
                    center;

                line-height:
                    1.35;

                box-shadow:
                    0
                    3px
                    12px
                    rgba(
                        0,
                        0,
                        0,
                        .14
                    );

                pointer-events:
                    none;

                z-index:
                    30;
            "
        >

            ${escapeHTML(
                message
            )}

            <div
                style="
                    position:
                        absolute;

                    left:
                        50%;

                    top:
                        100%;

                    transform:
                        translateX(
                            -50%
                        );

                    width:
                        0;

                    height:
                        0;

                    border-left:
                        7px solid
                        transparent;

                    border-right:
                        7px solid
                        transparent;

                    border-top:
                        8px solid
                        white;
                "
            ></div>

        </div>

    `;
}


/* =========================================================
   REFRESH SPEECH BUBBLES
========================================================= */

function refreshPlayHouseNeedBubbles() {

    const playData =
        getSavedPlayData();


    document
        .querySelectorAll(
            "[data-play-house-essa]"
        )
        .forEach(
            function(wrapper) {

                const essaId =
                    wrapper
                        .dataset
                        .playHouseEssa;


                const essa =
                    getPlayableEssaById(
                        essaId
                    );


                if (!essa) {

                    return;
                }


                const stats =
                    getPlayEssaStats(
                        playData,
                        essa.id
                    );


                const oldBubble =
                    wrapper.querySelector(
                        ".play-house-speech"
                    );


                if (oldBubble) {

                    oldBubble.remove();
                }


                const bubbleHTML =
                    makeEssaNeedBubble(
                        essa,
                        stats
                    );


                if (!bubbleHTML) {

                    return;
                }


                wrapper.insertAdjacentHTML(
                    "afterbegin",
                    bubbleHTML
                );

            }
        );
}


/* =========================================================
   CHOOSE ESSA DESTINATION ROOM
========================================================= */

function chooseEssaDestinationRoom(
    essaId
) {

    const playData =
        getSavedPlayData();

    const stats =
        getPlayEssaStats(
            playData,
            essaId
        );

    if (
        arePlayEssaNeedsAtZero(
            stats
        )
    ) {
        return "bedroom";
    }

    const need =
        getEssaBiggestNeed(
            stats
        );

    /*
        The needier they are,
        the more likely they are
        to walk toward the room
        that can help them.
    */

    if (
        need.value <=
            45

        &&

        Math.random() <
            0.88
    ) {

        return need.roomId;
    }


    if (
        need.value <=
            65

        &&

        Math.random() <
            0.72
    ) {

        return need.roomId;
    }


    if (
        need.value <=
            80

        &&

        Math.random() <
            0.55
    ) {

        return need.roomId;
    }


    /*
        Otherwise they can wander
        into another room just because
        they feel like it.
    */

    if (
        Math.random() <
        0.20
    ) {

        const randomRoom =
            playRooms[
                Math.floor(
                    Math.random() *
                    playRooms.length
                )
            ];


        return randomRoom.id;
    }


    return null;
}


/* =========================================================
   MOVE ESSAS BETWEEN ROOMS
========================================================= */

function moveEssasBetweenRooms() {

    const playData =
        getSavedPlayData();


    const houseData =
        getSavedPlayHouseData();


    let changed =
        false;


    playData
        .unlockedEssaIds
        .forEach(
            function(essaId) {

                const essa =
                    getAnyPlayableEssaById(
                        essaId
                    );


                if (!essa) {

                    return;
                }


                /* ==============================
                   KENNEL ESSAS STAY IN KENNEL
                ============================== */

                if (
                    houseData
                        .essaRooms[
                            essaId
                        ] ===
                    "kennel"
                ) {

                    return;
                }


                const stats =
                    getPlayEssaStats(
                        playData,
                        essaId
                    );


                /* ==============================
                   ALL-ZERO ESSAS STAY ASLEEP
                   IN THE BEDROOM
                ============================== */

                if (
                    arePlayEssaNeedsAtZero(
                        stats
                    )
                ) {

                    return;
                }


                /*
                    Not every ESSA considers
                    changing rooms every cycle.
                */

                if (
                    Math.random() >
                    0.38
                ) {

                    return;
                }


                const destination =
                    chooseEssaDestinationRoom(
                        essaId
                    );


                if (!destination) {

                    return;
                }


                const current =
                    houseData
                        .essaRooms[
                            essaId
                        ] ||
                    "playroom";


                if (
                    destination ===
                    current
                ) {

                    return;
                }


                houseData
                    .essaRooms[
                        essaId
                    ] =
                    destination;


                /*
                    Give them a fresh position
                    when entering a new room.
                */

                houseData
                    .essaPositions[
                        essaId
                    ] = {

                        x:
                            14 +
                            Math.random() *
                            72,

                        y:
                            48 +
                            Math.random() *
                            34

                    };


                changed =
                    true;

            }
        );


    if (!changed) {

        return;
    }


    savePlayHouseData(
        houseData
    );


    /*
        Only redraw if the user
        is currently looking at
        the house.
    */

    if (
        document.getElementById(
            "play-house-room"
        )
    ) {

        renderPlayRoom();
    }
}

/* =========================================================
   WANDER INSIDE ROOM
========================================================= */

function wanderPlayHouseEssas() {

    const houseData =
        getSavedPlayHouseData();


    let changed =
        false;


    document
        .querySelectorAll(
            "[data-play-house-essa]"
        )
        .forEach(
            function(wrapper) {

                /*
                    Most cycles cause a small
                    movement, so the room
                    feels alive.
                */

                if (
                    Math.random() >
                    0.78
                ) {

                    return;
                }


                const essaId =
                    wrapper
                        .dataset
                        .playHouseEssa;
                
                        const playData =
    getSavedPlayData();

const stats =
    getPlayEssaStats(
        playData,
        essaId
    );

if (
    arePlayEssaNeedsAtZero(
        stats
    )
) {
    return;
}

                const currentPosition =
    houseData
        .essaPositions[
            essaId
        ];


if (
    currentPosition &&
    currentPosition.calledIn
) {

    return;
}


                let position =
                    houseData
                        .essaPositions[
                            essaId
                        ];


                if (!position) {

                    position = {

                        x:
                            15 +
                            Math.random() *
                            70,

                        y:
                            50 +
                            Math.random() *
                            30

                    };
                }


                const movementAmount =
                    7;


                position.x +=
                    (
                        Math.random() *
                        movementAmount *
                        2
                    ) -
                    movementAmount;


                position.y +=
                    (
                        Math.random() *
                        4
                    ) -
                    2;


                position.x =
                    Math.max(
                        8,
                        Math.min(
                            88,
                            position.x
                        )
                    );


                position.y =
                    Math.max(
                        48,
                        Math.min(
                            82,
                            position.y
                        )
                    );


                houseData
                    .essaPositions[
                        essaId
                    ] =
                    position;


                wrapper.style.left =
                    position.x +
                    "%";


                wrapper.style.top =
                    position.y +
                    "%";


                /*
                    Face the direction
                    of movement sometimes.
                */

                const image =
                    wrapper.querySelector(
                        ".play-house-essa-image"
                    );


                if (image) {

                    if (
                        Math.random() >
                        .5
                    ) {

                        image.style.transform =
                            "scaleX(1)";

                    } else {

                        image.style.transform =
                            "scaleX(-1)";
                    }
                }


                changed =
                    true;

            }
        );


    if (changed) {

        savePlayHouseData(
            houseData
        );
    }
}


/* =========================================================
   HOUSE TIMERS
========================================================= */

let playHouseNeedTimer =
    null;


let playHouseWanderTimer =
    null;


let playHouseRoomMoveTimer =
    null;

let partyPawsEnergyTimer =
    null;


/* =========================================================
   START HOUSE TIMERS
========================================================= */

function startPlayHouseTimers() {

    stopPlayHouseTimers();

    partyPawsEnergyTimer =
    setInterval(
        function() {

            if (
                document.getElementById(
                    "play-house-room"
                )
            ) {

                runPartyPawsSuperEnergy();
            }

        },
        80
    );


    playHouseNeedTimer =
        setInterval(
            function() {

                applyPlayNeedsDecay();


                if (
                    document.getElementById(
                        "play-house-room"
                    )
                ) {

                    refreshPlayHouseNeedBubbles();
                }

            },
            60 *
            1000
        );


    playHouseWanderTimer =
        setInterval(
            function() {

                if (
                    document.getElementById(
                        "play-house-room"
                    )
                ) {

                    wanderPlayHouseEssas();
                }

            },
            5000
        );


    playHouseRoomMoveTimer =
        setInterval(
            function() {

                if (
                    document.getElementById(
                        "play-house-room"
                    )
                ) {

                    moveEssasBetweenRooms();
                }

            },
            25000
        );
}


/* =========================================================
   STOP HOUSE TIMERS
========================================================= */

function stopPlayHouseTimers() {

    if (
    partyPawsEnergyTimer
) {

    clearInterval(
        partyPawsEnergyTimer
    );

    partyPawsEnergyTimer =
        null;
}

    if (
        playHouseNeedTimer
    ) {

        clearInterval(
            playHouseNeedTimer
        );


        playHouseNeedTimer =
            null;
    }


    if (
        playHouseWanderTimer
    ) {

        clearInterval(
            playHouseWanderTimer
        );


        playHouseWanderTimer =
            null;
    }


    if (
        playHouseRoomMoveTimer
    ) {

        clearInterval(
            playHouseRoomMoveTimer
        );


        playHouseRoomMoveTimer =
            null;
    }
}

  /* =========================================================
   FLOOR-BASED ESSA POSITIONING
========================================================= */

function getPlayHouseEssaPosition(
    houseData,
    essaId,
    index = 0
) {

    let position =
        houseData
            .essaPositions[
                essaId
            ];


    if (
        !position ||
        typeof position.x !== "number" ||
        typeof position.floor !== "number"
    ) {

        const startingX = [
            12,
            25,
            38,
            51,
            64,
            77,
            88
        ];


        position = {

            x:
                startingX[
                    index %
                    startingX.length
                ],

            /*
                Distance upward from
                the bottom of the room.

                Small number =
                closer to the floor.
            */
            floor:
                4 +
                (
                    index %
                    2
                ) *
                2

        };


        houseData
            .essaPositions[
                essaId
            ] =
            position;


        savePlayHouseData(
            houseData
        );
    }


    return position;
}


/* =========================================================
   CHECK IF A POSITION IS TOO CLOSE
========================================================= */

function isPlayHousePositionTooClose(
    houseData,
    essaId,
    x,
    floor
) {

    const currentRoom =
        houseData
            .essaRooms[
                essaId
            ] ||
        "playroom";


    const allEssas =
    getSavedCustomPlayEssas();


    for (
        const otherEssa
        of allEssas
    ) {

        if (
            String(
                otherEssa.id
            ) ===
            String(
                essaId
            )
        ) {

            continue;
        }


        const otherRoom =
            houseData
                .essaRooms[
                    otherEssa.id
                ] ||
            "playroom";


        if (
            otherRoom !==
            currentRoom
        ) {

            continue;
        }


        const otherPosition =
            houseData
                .essaPositions[
                    otherEssa.id
                ];


        if (
            !otherPosition ||
            typeof otherPosition.x !==
                "number"
        ) {

            continue;
        }


        const otherFloor =
            typeof otherPosition.floor ===
                "number"

                ? otherPosition.floor

                : 5;


        const horizontalDistance =
            Math.abs(
                x -
                otherPosition.x
            );


        const floorDistance =
            Math.abs(
                floor -
                otherFloor
            );


        /*
            Bigger horizontal spacing
            prevents the giant cuddle pile.
        */
        if (
            horizontalDistance <
                13

            &&

            floorDistance <
                8
        ) {

            return true;
        }
    }


    return false;
}


/* =========================================================
   FIND SAFE ROAMING POSITION
========================================================= */

function findSafePlayHousePosition(
    houseData,
    essaId
) {

    let attempts =
        0;


    while (
        attempts <
        30
    ) {

        /*
            Spread across most of
            the room horizontally.
        */
        const x =
            8 +
            Math.random() *
            84;


        /*
            Keep feet near the floor.

            Slight depth variation gives
            the room some movement without
            making ESSAs float halfway up
            the wall.
        */
        const floor =
            2 +
            Math.random() *
            12;


        if (
            !isPlayHousePositionTooClose(
                houseData,
                essaId,
                x,
                floor
            )
        ) {

            return {

                x:
                    x,

                floor:
                    floor

            };
        }


        attempts++;
    }


    /*
        Emergency fallback if the room
        is crowded.
    */
    return {

        x:
            8 +
            Math.random() *
            84,

        floor:
            3 +
            Math.random() *
            8

    };
}

function getPlayEssaAge(
    essa
) {

    const joinedAt =
        essa.purchasedAt ||
        essa.createdAt;


    if (!joinedAt) {
        return "";
    }


    const joinedDate =
        new Date(
            joinedAt
        );


    const now =
        new Date();


    const milliseconds =
        now - joinedDate;


    const days =
        Math.max(
            0,
            Math.floor(
                milliseconds /
                (
                    1000 *
                    60 *
                    60 *
                    24
                )
            )
        );


    if (days < 365) {

        return (
            days === 1
                ? "1 day old"
                : days + " days old"
        );
    }


    const years =
        Math.floor(
            days / 365
        );


    return (
        years === 1
            ? "1 y.o."
            : years + " y.o."
    );
}


/* =========================================================
   MAKE ROAMING ESSA
========================================================= */

function makePlayHouseEssa(
    essa,
    stats,
    position
) {

    const isSleeping =
    arePlayEssaNeedsAtZero(
        stats
    );

const bubble =
    isSleeping
        ? ""
        : makeEssaNeedBubble(
            essa,
            stats
        );

const ageText =
    getPlayEssaAge(
        essa
    );


    return `

        <button
            data-play-house-essa="${essa.id}"

            onclick="
                focusPlayableEssa(
                    '${essa.id}'
                )
            "

            aria-label="
                Play with
                ${escapeHTML(
                    essa.name
                )}
            "

            style="
                position:absolute;

                left:
                    ${position.x}%;

                bottom:
                    ${position.floor}%;

                transform:
                    translateX(-50%);

                width:
                    6%;

                min-width:
                    38px;

                max-width:
                    68px;

                padding:
                    0;

                margin:
                    0;

                border:
                    none;

                background:
                    transparent;

                box-shadow:
                    none;

                cursor:
                    pointer;

                transition:
                    left 3.2s ease,
                    bottom 3.2s ease;

               z-index:
    500;
            "
        >

            ${bubble}


                  
            


            <img
                class="play-house-essa-image"

                src="${essa.image}"

                alt="${escapeHTML(
                    essa.name
                )}"

                onerror="
                    this.style.display='none';
                    this.nextElementSibling.style.display='flex';
                "

                style="
                    width:100%;
                    height:auto;

                    display:block;

                    object-fit:contain;

                    transform:
    ${isSleeping
        ? "rotate(90deg)"
        : "rotate(0deg)"};

transition:
    transform 0.8s ease;

                    filter:
                        drop-shadow(
                            0 4px 3px
                            rgba(
                                0,
                                0,
                                0,
                                .20
                            )
                        );

                    transform-origin:
                        center bottom;

                    transition:
                        transform .25s ease;
                "
            >


            <div
                style="
                    display:none;

                    align-items:center;
                    justify-content:center;

                    width:100%;

                    aspect-ratio:1/1;

                    font-size:42px;
                "
            >
                ${essa.fallbackIcon}
            </div>


            <div
                style="
                    position:absolute;

                    left:50%;

                    top:
                        calc(
                            100% +
                            2px
                        );

                    transform:
                        translateX(-50%);

                    padding:
                        3px 7px;

                    white-space:
                        nowrap;

                    border-radius:
                        999px;

                    background:
                        rgba(
                            255,
                            255,
                            255,
                            .90
                        );

                    color:
                        #26343b;

                    font-size:
                        10px;

                    font-weight:
                        bold;

                    pointer-events:
                        none;
                "
            >

                <div
                    style="
                        font-size:10px;
                        font-weight:bold;
                        line-height:1.1;
                    "
                >

                    ${escapeHTML(
                        essa.name
                    )}

                    ${essa.gender || ""}

                </div>


                ${
                    ageText
                        ? `
                            <div
                                style="
                                    margin-top:2px;

                                    font-size:8px;

                                    font-weight:
                                        normal;

                                    opacity:.75;

                                    line-height:1;
                                "
                            >

                                ${escapeHTML(
                                    ageText
                                )}

                            </div>
                        `
                        : ""
                }

            </div>

        </button>

    `;
}

/* =========================================================
   BETTER ESSA WANDERING
========================================================= */

function wanderPlayHouseEssas() {

    const houseData =
        getSavedPlayHouseData();


    let changed =
        false;


    document
        .querySelectorAll(
            "[data-play-house-essa]"
        )
        .forEach(
            function(wrapper) {

                /*
                    Most ESSAs move during
                    each wandering cycle.
                */
                if (
    !hasSuperEnergy &&
    Math.random() >
    0.82
) {

    return;
}


                const essaId =
                    wrapper
                        .dataset
                        .playHouseEssa;
                
                const playData =
    getSavedPlayData();

const stats =
    getPlayEssaStats(
        playData,
        essaId
    );

    const hasSuperEnergy =
    Number(
        stats.superEnergyUntil
    ) > Date.now();

if (
    arePlayEssaNeedsAtZero(
        stats
    )
) {
    return;
}


                const oldPosition =
                    houseData
                        .essaPositions[
                            essaId
                        ];


                const newPosition =
    hasSuperEnergy
        ? {
            x:
                8 +
                Math.random() *
                84,

            floor:
                5 +
                Math.random() *
                65
        }
        : findSafePlayHousePosition(
            houseData,
            essaId
        );


                houseData
                    .essaPositions[
                        essaId
                    ] =
                    newPosition;


                wrapper.style.left =
                    newPosition.x +
                    "%";


                wrapper.style.bottom =
                    newPosition.floor +
                    "%";


                wrapper.style.top =
                    "auto";


                const image =
                    wrapper.querySelector(
                        ".play-house-essa-image"
                    );


                if (
                    image &&
                    oldPosition
                ) {

                    if (
                        newPosition.x <
                        oldPosition.x
                    ) {

                        image.style.transform =
                            "scaleX(-1)";

                    } else {

                        image.style.transform =
                            "scaleX(1)";
                    }
                }


                changed =
                    true;

            }
        );


    if (changed) {

        savePlayHouseData(
            houseData
        );
    }
}

/* =========================================================
   PARTY PAWS SUPER ENERGY
========================================================= */

function runPartyPawsSuperEnergy() {

    const playData =
        getSavedPlayData();

    document
        .querySelectorAll(
            "[data-play-house-essa]"
        )
        .forEach(
            function(wrapper) {

                const essaId =
                    wrapper
                        .dataset
                        .playHouseEssa;

                const stats =
                    getPlayEssaStats(
                        playData,
                        essaId
                    );

                const hasSuperEnergy =
                    Number(
                        stats.superEnergyUntil
                    ) > Date.now();


                if (!hasSuperEnergy) {

                    wrapper.style.filter =
                        "";

                    return;
                }


                /* SUPER FAST MOVEMENT */

                wrapper.style.transition =
                    "left 0.07s linear, bottom 0.07s linear";

                wrapper.style.left =
                    (
                        5 +
                        Math.random() *
                        90
                    ) +
                    "%";

                wrapper.style.bottom =
                    (
                        3 +
                        Math.random() *
                        75
                    ) +
                    "%";


                /* BLUR FROM EXTREME SPEED */

                wrapper.style.filter =
                    "blur(2px)";
            }
        );
}

/* =========================================================
   WEEKEND GAME REWARDS
========================================================= */

function isPlayModeWeekend() {

    const today =
        new Date();

    const day =
        today.getDay();

    return (
        day === 0 ||
        day === 6
    );
}

function getPlayGameCoinReward(
    normalCoins
) {

    if (
        isPlayModeWeekend()
    ) {

        return 100;
    }


    return normalCoins;
}

/* =========================================================
   ESSA CHASES ROOM CLICK
========================================================= */

function chasePlayHouseClick(event) {

    const room =
        document.getElementById(
            "play-house-room"
        );

    if (!room) {
        return;
    }


    const essas =
        Array.from(
            room.querySelectorAll(
                "[data-play-house-essa]"
            )
        );


    if (essas.length === 0) {
        return;
    }


    /*
        Pick one random ESSA
        currently inside the room.
    */
    const wrapper =
        essas[
            Math.floor(
                Math.random() *
                essas.length
            )
        ];


    const rect =
        room.getBoundingClientRect();


    const clickX =
        (
            (
                event.clientX -
                rect.left
            ) /
            rect.width
        ) *
        100;


    const clickY =
        (
            (
                rect.bottom -
                event.clientY
            ) /
            rect.height
        ) *
        100;


    const essaId =
    wrapper.dataset.playHouseEssa;


/*
    Keep the ESSA on the usable
    floor area.
*/
const targetX =
    Math.max(
        8,
        Math.min(
            88,
            clickX
        )
    );


const targetFloor =
    Math.max(
        5,
        Math.min(
            38,
            clickY
        )
    );


/*
    Face toward the click.
*/
const image =
    wrapper.querySelector(
        ".play-house-essa-image"
    );


const currentX =
    parseFloat(
        wrapper.style.left
    ) || targetX;


if (image) {

    if (targetX < currentX) {

        image.style.transform =
            "scaleX(-1)";

    } else {

        image.style.transform =
            "scaleX(1)";
    }
}


/*
    Chase the click.
*/
wrapper.style.transition =
    "left .75s ease-out, bottom .75s ease-out";


wrapper.style.left =
    targetX + "%";


wrapper.style.bottom =
    targetFloor + "%";


wrapper.style.top =
    "auto";


/*
    Save the new position so normal
    wandering continues from here.
*/
const houseData =
    getSavedPlayHouseData();


houseData.essaPositions[essaId] = {

    ...(
        houseData.essaPositions[
            essaId
        ] || {}
    ),

    x: targetX,
    floor: targetFloor

};


savePlayHouseData(
    houseData
);
}


/* =========================================================
   MAKE ROAMING ESSA
========================================================= */




/* =========================================================
   EMPTY ROOM MESSAGE
========================================================= */

/* =========================================================
   ROOM-SPECIFIC CONTROLS
========================================================= */
function makePlayRoomSpecialControls(

    room
) { 
   

if (room.id === "bathroom") {

    return `
        <button
            id="play-bathroom-shower"
            type="button"
            aria-label="Use shower head"
            onclick="
    openPlayBathEssaChooser()
"
            style="
                position:absolute;
                left:55%;
bottom:40%;
                width:95px;
                padding:0;
                border:none;
                background:transparent;
                box-shadow:none;
                cursor:pointer;
                z-index:4;
            "
        >
            <img
                src="ESSAzLife.Images/PlayModeAssets/Bath/shower-head.png"
                alt="Shower head"
                draggable="false"
                style="
                    display:block;
                    width:100%;
                    height:auto;
                    object-fit:contain;
                    pointer-events:none;
                "
            >
        </button>
    `;
}
  
       if (
    room.id ===
    "kitchen"
) {

    return `

        <button
        id="play-kitchen-fridge"
        class="play-kitchen-fridge"
            onclick="
                openPlayFridge()
            "

            aria-label="
                Open fridge
            "

            style="
                position:absolute;
                right:25%;
right:23%;
bottom:22%;
height:285px;
                padding:0;
                border:none;
                background:transparent;
                cursor:pointer;
                z-index:5;
            "
        >

            <img
                src="ESSAzLife.Images/PlayModeAssets/Fridge/closed-fridge.png"
                alt="Closed fridge"

               style="
    display:block;
    width:100%;
    height:100%;
    object-fit:fill;
"
            >

        </button>

        <button
    id="play-voidy-door"
    type="button"

    onclick="
        startEnteringTheVoid()
    "

    aria-label="Enter the Void"

    style="
        position:absolute;
       right:-7%;
        bottom:15%;

        width:445px;
height:528px;
        padding:0;
        border:none;
        background:transparent;
        box-shadow:none;

        cursor:pointer;
        z-index:4;
    "
>

    <img
    src="${
    localStorage.getItem(
        'essazlife-has-visited-voidy'
    ) === 'true'
        ? 'ESSAzLife.Images/PlayModeAssets/Voidy/exhausted-voidy-door.png'
        : 'ESSAzLife.Images/PlayModeAssets/Voidy/empty-voidy-door.png'
}"
        alt="The Void door"
        draggable="false"

        style="
            display:block;
            width:100%;
            height:100%;
            object-fit:fill;
            pointer-events:none;
        "
    >

</button>

    `;
}
    
       if (
        room.id ===
        "arcade"
    ) {

        return `
            <div
             class="play-arcade-machines"
                style="
                    position:absolute;
                    left:50%;
                    bottom:175px;
                    transform:translateX(-50%);

                    width:min(
                        94%,
                        960px
                    );

                    display:grid;

                    grid-template-columns:
                        repeat(
                            5,
                            minmax(
                                0,
                                1fr
                            )
                        );

                    gap:12px;

                    align-items:end;

                    z-index:90;
                "
            >


                <button
                    onclick="
                        openESSATwist()
                    "

                    aria-label="
                        Play ESSATwist
                    "

                    style="
                        padding:0;
                        border:none;
                        background:transparent;
                        box-shadow:none;
                        cursor:pointer;
                    "
                >

                    <img
                        src="arcade-machines/essatwist.png"

                        alt="ESSATwist arcade machine"

                        style="
                            display:block;
                            width:100%;
                            height:auto;
                            max-height:235px;
                            object-fit:contain;
                        "
                    >

                </button>


                <button
                    onclick="
                        openESSAMemory()
                    "

                    aria-label="
                        Play ESSA Memory
                    "

                    style="
                        padding:0;
                        border:none;
                        background:transparent;
                        box-shadow:none;
                        cursor:pointer;
                    "
                >

                    <img
                        src="arcade-machines/memory-game.png"

                        alt="ESSA Memory arcade machine"

                        style="
                            display:block;
                            width:100%;
                            height:auto;
                            max-height:235px;
                            object-fit:contain;
                        "
                    >

  <button
    type="button"

    onclick="openESSATiles()"

    aria-label="Play ESSA Tiles"

    style="
        padding:0;
        border:none;
        background:transparent;
        box-shadow:none;
        cursor:pointer;
        position:relative;
        z-index:100;
    "
>
    <img
        src="arcade-machines/essa-tiles.png"
        alt="ESSA Tiles arcade machine"

        style="
            display:block;
            width:100%;
            height:auto;
            max-height:235px;
            object-fit:contain;
            pointer-events:none;
        "
    >
</button>

                </button>


                <button
                   onclick="
                   openESSATicTacToe()
                  "

                    aria-label="
                        ESSA Tic-Tac-Toe
                    "

                    style="
                        padding:0;
                        border:none;
                        background:transparent;
                        box-shadow:none;
                        cursor:pointer;
                    "
                >

                    <img
                        src="arcade-machines/essa-tictactoe.png"

                        alt="ESSA Tic-Tac-Toe arcade machine"

                        style="
                            display:block;
                            width:100%;
                            height:auto;
                            max-height:235px;
                            object-fit:contain;
                        "
                    >

                </button>


                <button
                    onclick="
                        showPlayMessage(
                            '🔎 Find My ESSA is coming soon!'
                        )
                    "

                    aria-label="
                        Find My ESSA
                    "

                    style="
                        padding:0;
                        border:none;
                        background:transparent;
                        box-shadow:none;
                        cursor:pointer;
                    "
                >

                    <img
                        src="arcade-machines/find-my-essa.png"
                        
                        onclick="
                        openFindMyEssa()
                        "

                        alt="Find My ESSA arcade machine"

                        style="
                            display:block;
                            width:100%;
                            height:auto;
                            max-height:235px;
                            object-fit:contain;
                        "
                    >

                </button>


            </div>
        `;

}




    if (
        room.id ===
        "backyard"
    ) {

        return `

            <div
                style="
                    position:
                        absolute;

                    right:
                        16px;

                    bottom:
                        18px;

                    z-index:
                        100;

                    display:
                        flex;

                    gap:
                        8px;

                    flex-wrap:
                        wrap;

                    justify-content:
                        flex-end;
                "
            >


              <button
    onclick="
        openBackyardFrisbee()
    "
    style="
        padding:12px 20px;
        border:none;
        border-radius:14px;

        background:
            var(
                --user-theme-color,
                #4fb5ae
            );

        color:white;
        font-weight:bold;
        font-size:16px;
        cursor:pointer;

        box-shadow:
            0 4px 12px
            rgba(0,0,0,.18);
    "
>
    🥏 Frisbee
</button>


            </div>

        `;
    }


    return "";
 }

 function startEnteringTheVoid() {
    const hasVisitedVoidy =
    localStorage.getItem(
        "essazlife-has-visited-voidy"
    ) === "true";

    const existing =
        document.getElementById(
            "play-entering-void-overlay"
        );

    if (existing) {
        existing.remove();
    }


    const overlay =
        document.createElement(
            "div"
        );


    overlay.id =
        "play-entering-void-overlay";


    overlay.style.cssText = `
        position:fixed;
        inset:0;
        background:black;
        z-index:99999;

        display:flex;
        align-items:center;
        justify-content:center;
    `;


    const parent =
        document.fullscreenElement ||
        document.body;


    parent.appendChild(
        overlay
    );

    if (hasVisitedVoidy) {

    overlay.innerHTML = `

        <div
            style="
                position:absolute;
                inset:0;
                background:black;

                display:flex;
                align-items:center;
                justify-content:center;
            "
        >

            <img
                src="ESSAzLife.Images/PlayModeAssets/Voidy/tired-black-voidy.png"

                alt="Tired Voidy"

                draggable="false"

                style="
                    width:100%;
                    height:100%;
                    object-fit:contain;
                "
            >


            <div
                style="
                    position:absolute;
                    left:50%;
                    bottom:10%;

                    transform:
                        translateX(-50%);

                    width:90%;

                    color:white;

                    font-size:26px;
                    font-weight:bold;
                    text-align:center;

                    text-shadow:
                        0 2px 5px
                        rgba(0,0,0,.9);

                    z-index:10;
                    pointer-events:none;
                "
            >
                The developer doesn't pay me enough
                to babysit you users...
                Just don't click anything
                that is still locked.
            </div>

        </div>

    `;


    setTimeout(
        function() {

            openVoidyStorePage(
                "pets"
            );

        },
        5000
    );


    return;
}


    /*
        Sit in complete darkness
        for a moment...
    */

    setTimeout( 
        
        function() {

            overlay.innerHTML = `

                <img
                    src="ESSAzLife.Images/PlayModeAssets/VoidyStore/entering-the-void.png"

                    alt="Entering the Void"

                    draggable="false"

                    style="
                        width:100%;
                        height:100%;
                        object-fit:contain;
                    "
                >

            `;

        },
        3000
    );

    setTimeout(
    function() {

        overlay.innerHTML = `

            <img
                src="ESSAzLife.Images/PlayModeAssets/VoidyStore/calling-voidy.png"

                alt="Calling Voidy"

                draggable="false"

                style="
                    width:100%;
                    height:100%;
                    object-fit:contain;
                "
            >

        `;

    },
    6000
);

setTimeout(
    function() {

        overlay.innerHTML = `

            <div
                style="
                    position:absolute;
                    inset:0;
                    background:black;

                    display:flex;
                    align-items:center;
                    justify-content:center;
                "
            >

                <img
                    src="ESSAzLife.Images/PlayModeAssets/Voidy/tired-black-voidy.png"

                    alt="Voidy"

                    draggable="false"

                    style="
                        width:100%;
                        height:100%;
                        object-fit:contain;
                    "
                >


            
                    <div
    style="
        position:absolute;
        left:50%;
        bottom:10%;

        transform:translateX(-50%);

        width:90%;

        color:white;

        font-size:26px;
        font-weight:bold;
        text-align:center;

        text-shadow:
            0 2px 5px
            rgba(0,0,0,.9);

        z-index:10;
        pointer-events:none;
    "
>
    What do you want?
</div>
            

            </div>

        `;

    },
    9000
);

setTimeout(
    function() {

        overlay.innerHTML = "";

        overlay.style.background =
            "black";

    },
    12000
);

setTimeout(
    function() {

        overlay.innerHTML = `

            <div
                style="
                    position:absolute;
                    inset:0;
                    background:black;

                    display:flex;
                    align-items:center;
                    justify-content:center;
                "
            >

                <img
                    src="ESSAzLife.Images/PlayModeAssets/Voidy/annoyed-black-voidy.png"

                    alt="Annoyed Voidy"

                    draggable="false"

                    style="
                        width:100%;
                        height:100%;
                        object-fit:contain;
                    "
                >


                <div
                    id="voidy-intro-dialogue"

                    style="
                        position:absolute;
                        left:50%;
                        bottom:10%;

                        transform:
                            translateX(-50%);

                        width:90%;

                        color:white;

                        font-size:26px;
                        font-weight:bold;
                        text-align:center;

                        text-shadow:
                            0 2px 5px
                            rgba(0,0,0,.9);

                        z-index:10;
                        pointer-events:none;
                    "
                >
                    Oh, it's you...
                </div>

            </div>

        `;

    },
    13000
);

setTimeout(
    function() {

        const dialogue =
            document.getElementById(
                "voidy-intro-dialogue"
            );


        if (dialogue) {

            dialogue.textContent =
                "Welcome to The Void.";
        }

    },
    17000
);

setTimeout(
    function() {

        overlay.innerHTML = "";

        overlay.style.background =
            "black";

    },
    20000
);

setTimeout(
    function() {

        overlay.innerHTML = `

            <div
                style="
                    position:absolute;
                    inset:0;
                    background:black;

                    display:flex;
                    align-items:center;
                    justify-content:center;
                "
            >

                <img
                    src="ESSAzLife.Images/PlayModeAssets/Voidy/tired-black-voidy.png"

                    alt="Tired Voidy"

                    draggable="false"

                    style="
                        width:100%;
                        height:100%;
                        object-fit:contain;
                    "
                >


                <div
                    style="
                        position:absolute;
                        left:50%;
                        bottom:10%;

                        transform:
                            translateX(-50%);

                        width:90%;

                        color:white;

                        font-size:26px;
                        font-weight:bold;
                        text-align:center;

                        text-shadow:
                            0 2px 5px
                            rgba(0,0,0,.9);

                        z-index:10;
                        pointer-events:none;
                    "
                >

                    Just... don't touch anything
                    you haven't unlocked yet,
                    alright?

                </div>

            </div>

        `;

    },
    21000
);

setTimeout(
    function() {

        localStorage.setItem(
    "essazlife-has-visited-voidy",
    "true"
);

        openVoidyStorePage(
            "pets"
        );

    },
    25000
);

}

function closePlayVoid() {

    const overlay =
        document.getElementById(
            "play-entering-void-overlay"
        );


    if (overlay) {
        overlay.remove();
    }
}

const voidyPetStoreItems = [

    {
    id: "moocow",
    name: "MooCow",
    image: "play-essas/MooCow.png",
    species: "Cow",
    breed: "Holstein",
    gender: "♂️",
    level: 5,
    price: 100
},

   {
    id: "daisybelle",
    name: "DaisyBelle",
    image: "play-essas/daisybelle.png",
    species: "Cow",
    breed: "Holstein",
    gender: "♀️",
    level: 5,
    price: 100
},
   {
    id: "stormy",
    name: "Stormy",
    image: "play-essas/stormy.png",
    species: "Dog",
    breed: "Siberian Husky",
    gender: "♂️",
    level: 10,
    price: 200
},

{
    id: "oreo",
    name: "Oreo",
    image: "play-essas/oreo.png",
    species: "Dog",
    breed: "Border Collie",
    gender: "♂️",
    level: 10,
    price: 200
},

{
    id: "mudpie",
    name: "Mudpie",
    image: "play-essas/mudpie.png",
    species: "Dog",
    breed: "English Springer Spaniel",
    gender: "♀️",
    level: 20,
    price: 200
},

{
    id: "mocha",
    name: "Mocha",
    image: "play-essas/mocha.png",
    species: "Dog",
    breed: "German Shorthaired Pointer",
    gender: "♀️",
    level: 20,
    price: 200
},

{
    id: "moose",
    name: "Moose",
    image: "play-essas/moose.png",
    species: "Dog",
    breed: "Golden Retriever",
    gender: "♂️",
    level: 25,
    price: 200
},

{
    id: "maple",
    name: "Maple",
    image: "play-essas/Maple.png",
    species: "Dog",
    breed: "Yellow Labrador Retriever",
    gender: "♀️",
    level: 26,
    price: 200
},

{
    id: "lily",
    name: "Lily",
    image: "play-essas/lily.png",
    species: "Dog",
    breed: "Beagle",
    gender: "♀️",
    level: 30,
    price: 300
},

{
    id: "brisket",
    name: "Brisket",
    image: "play-essas/brisket.png",
    species: "Dog",
    breed: "Duck Tolling Retriever",
    gender: "♂️",
    level: 40,
    price: 500
},

{
    id: "boba",
    name: "Boba",
    image: "play-essas/boba.png",
    species: "Dog",
    breed: "German Shepherd x Golden Retriever",
    gender: "♂️",
    level: 50,
    price: 500
},

{
    id: "trouble",
    name: "Trouble",
    image: "play-essas/trouble.png",
    species: "Dog",
    breed: "German Shepherd x Border Collie",
    gender: "♀️",
    level: 60,
    price: 800
},

{
    id: "tracker",
    name: "Tracker",
    image: "play-essas/tracker.png",
    species: "Dog",
    breed: "Golden Retriever x Beagle",
    gender: "♂️",
    level: 65,
    price: 100
},

{
    id: "coolant",
    name: "Coolant",
    image: "play-essas/coolant.png",
    species: "Cat",
    breed: "Grey Tabby",
    gender: "♂️",
    level: 70,
    price: 800
},

{
    id: "pumpkin",
    name: "Pumpkin",
    image: "play-essas/pumpkin.png",
    species: "Dog",
    breed: "Doodle (Cocker Spaniel x Poodle)",
    gender: "♀️",
    level: 80,
    price: 900
},

{
    id: "pepper",
    name: "Pepper",
    image: "play-essas/pepper.png",
    species: "Ailurid",
    breed: "Red Panda",
    gender: "♂️",
    level: 100,
    price: 900
},

{
    id: "wilbur",
    name: "Wilbur",
    image: "play-essas/wilbur.png",
    species: "Pig",
    breed: "Pietrain Piglet",
    gender: "♂️",
    level: 101,
    price: 900
},

{
    id: "tiny",
    name: "Tiny",
    image: "play-essas/tiny.png",
    species: "Deer",
    breed: "Whitetail Fawn",
    gender: "♀️",
    level: 150,
    price: 150
},
   {
    id: "custom-essa-1",
    name: "+ Custom ESSA",
    image: null,
    level: 160,
    price: 0,
    customEssaSlot: true
},
{
    id: "custom-essa-2",
    name: "+ Custom ESSA",
    image: null,
    level: 161,
    price: 0,
    customEssaSlot: true
},
{
    id: "custom-essa-3",
    name: "+ Custom ESSA",
    image: null,
    level: 162,
    price: 0,
    customEssaSlot: true
},
{
    id: "custom-essa-4",
    name: "+ Custom ESSA",
    image: null,
    level: 163,
    price: 0,
    customEssaSlot: true
},
{
    id: "custom-essa-5",
    name: "+ Custom ESSA",
    image: null,
    level: 164,
    price: 0,
    customEssaSlot: true
},
{
    id: "custom-essa-6",
    name: "+ Custom ESSA",
    image: null,
    level: 165,
    price: 0,
    customEssaSlot: true
},
{
    id: "custom-essa-7",
    name: "+ Custom ESSA",
    image: null,
    level: 166,
    price: 0,
    customEssaSlot: true
},
{
    id: "custom-essa-8",
    name: "+ Custom ESSA",
    image: null,
    level: 167,
    price: 0,
    customEssaSlot: true
},
{
    id: "custom-essa-9",
    name: "+ Custom ESSA",
    image: null,
    level: 168,
    price: 0,
    customEssaSlot: true
},
{
    id: "custom-essa-10",
    name: "+ Custom ESSA",
    image: null,
    level: 169,
    price: 0,
    customEssaSlot: true
},
{
    id: "custom-essa-11",
    name: "+ Custom ESSA",
    image: null,
    level: 170,
    price: 0,
    customEssaSlot: true
},
{
    id: "custom-essa-12",
    name: "+ Custom ESSA",
    image: null,
    level: 171,
    price: 0,
    customEssaSlot: true
},
{
    id: "custom-essa-13",
    name: "+ Custom ESSA",
    image: null,
    level: 172,
    price: 0,
    customEssaSlot: true
},
{
    id: "custom-essa-14",
    name: "+ Custom ESSA",
    image: null,
    level: 173,
    price: 0,
    customEssaSlot: true
},
{
    id: "custom-essa-15",
    name: "+ Custom ESSA",
    image: null,
    level: 174,
    price: 0,
    customEssaSlot: true
},
{
    id: "custom-essa-16",
    name: "+ Custom ESSA",
    image: null,
    level: 175,
    price: 0,
    customEssaSlot: true
},
{
    id: "custom-essa-17",
    name: "+ Custom ESSA",
    image: null,
    level: 176,
    price: 0,
    customEssaSlot: true
},
{
    id: "custom-essa-18",
    name: "+ Custom ESSA",
    image: null,
    level: 177,
    price: 0,
    customEssaSlot: true
},






    {
    id: "voidy-halloween-2026",
    name: "Halloween 2026 Voidy Dog",
    image: "ESSAzLife.Images/PlayModeAssets/Voidy/voidy-dog-halloween-2026.png",
    level: null,
    price: 1000,
    limitedEdition: true,
    availableFrom: "2026-10-01",
    availableUntil: "2026-11-01"
},

{
    id: "voidy-thanksgiving-2026",
    name: "Thanksgiving 2026 Voidy Dog",
    image: "ESSAzLife.Images/PlayModeAssets/Voidy/voidy-dog-thanksgiving.png",
    level: null,
    price: 1000,
    limitedEdition: true,
    availableFrom: "2026-11-01",
    availableUntil: "2026-11-30"
},

{
    id: "voidy-santa-2026",
    name: "Christmas 2026 Voidy Dog",
    image: "ESSAzLife.Images/PlayModeAssets/Voidy/voidy-dog-santa.png",
    level: null,
    price: 1000,
    limitedEdition: true,
    availableFrom: "2026-12-01",
    availableUntil: "2027-01-01"
}



];

const voidyLockedItemImage =
    "ESSAzLife.Images/PlayModeAssets/VoidyStore/locked-item.png";

function makeVoidyPetShelfItems() {

    return voidyPetStoreItems

        .filter(
            function(item) {

                return (
                    item.limitedEdition !== true &&
                    item.customEssaSlot !== true
                );
            }
        )

        .map(
            function(item, index) {

                const playData =
                    getSavedPlayData();

                const trainerLevel =
                    playData.trainerLevel || 1;

                const isUnlocked =
                    trainerLevel >= item.level;

                const shelfImage =
                    isUnlocked
                        ? item.image
                        : voidyLockedItemImage;


                let rowTop = "0px";

                if (index < 6) {
                    rowTop = "30px";
                }
                else if (index >= 12) {
                    rowTop = "-12px";
                }


                return `

                    <div
                        class="voidy-pet-shelf-item"

                        data-pet-id="${item.id}"

                    onclick="${isUnlocked ? `openVoidyPetDetails('${item.id}')` : `showVoidyLockedItemMessage()`}"

                        style="
                            position:relative;

                            top:${rowTop};

                            width:90px;
                            height:105px;

                            display:flex;
                            align-items:flex-end;
                            justify-content:center;

                            pointer-events:auto;
                        "
                    >

                        <img
                            src="${shelfImage}"
                            alt="${item.name}"

                            draggable="false"

                            style="
                                display:block;

                                max-width:85px;
                                max-height:95px;

                                object-fit:contain;

                               pointer-events:auto; 
cursor:${isUnlocked ? "pointer" : "default"};
                            "
                        >

                    </div>

                `;

            }
        )

        .join("");
}

function getUnlockedVoidyPets() {

    const playData =
        getSavedPlayData();

    const trainerLevel =
        playData.trainerLevel || 1;


    return voidyPetStoreItems.filter(
        function(item) {

            return (
                item.limitedEdition !== true &&
                item.customEssaSlot !== true &&
                trainerLevel >= item.level
            );
        }
    );
}

function openVoidyPetDetails(
    petId
) {

    const item =
        voidyPetStoreItems.find(
            function(pet) {

                return (
                    pet.id === petId
                );
            }
        );


    if (!item) {
        return;
    }

    const unlockedPets =
    getUnlockedVoidyPets();


const currentIndex =
    unlockedPets.findIndex(
        function(pet) {

            return (
                pet.id === item.id
            );
        }
    );


const previousPet =
    unlockedPets[
        (
            currentIndex -
            1 +
            unlockedPets.length
        ) %
        unlockedPets.length
    ];


const nextPet =
    unlockedPets[
        (
            currentIndex + 1
        ) %
        unlockedPets.length
    ];


    const existing =
        document.getElementById(
            "voidy-pet-details-popup"
        );


    if (existing) {
        existing.remove();
    }


    const overlay =
        document.createElement(
            "div"
        );


    overlay.id =
        "voidy-pet-details-popup";


    overlay.style.cssText = `
        position:fixed;
        inset:0;
        background:rgba(0,0,0,.65);
        display:flex;
        align-items:center;
        justify-content:center;
        padding:20px;
        box-sizing:border-box;
        z-index:100002;
    `;


    overlay.innerHTML = `

        <div
            style="
                position:relative;
                width:min(480px, 92vw);
                background:white;
                border-radius:24px;
                padding:28px;
                box-sizing:border-box;
                text-align:center;
                box-shadow:
                    0 18px 50px
                    rgba(0,0,0,.35);
            "
        >

            <button
                type="button"

                onclick="
                    document
                        .getElementById(
                            'voidy-pet-details-popup'
                        )
                        ?.remove()
                "

                style="
                    position:absolute;
                    top:14px;
                    right:14px;
                    width:40px;
                    height:40px;
                    border:none;
                    border-radius:50%;
                    background:#eef3f4;
                    font-size:22px;
                    font-weight:bold;
                    cursor:pointer;
                "
            >
                ×
            </button>

            <button
    type="button"

    onclick="
        openVoidyPetDetails(
            '${previousPet.id}'
        )
    "

    aria-label="Previous ESSA"

    style="
        position:absolute;
        left:18px;
        top:45%;

        width:46px;
        height:46px;

        border:none;
        border-radius:50%;

        background:#eef3f4;
        color:#17313a;

        font-size:28px;
        font-weight:bold;

        cursor:pointer;
        z-index:5;
    "
>
    ‹
</button>


<button
    type="button"

    onclick="
        openVoidyPetDetails(
            '${nextPet.id}'
        )
    "

    aria-label="Next ESSA"

    style="
        position:absolute;
        right:18px;
        top:45%;

        width:46px;
        height:46px;

        border:none;
        border-radius:50%;

        background:#eef3f4;
        color:#17313a;

        font-size:28px;
        font-weight:bold;

        cursor:pointer;
        z-index:5;
    "
>
    ›
</button>


            <img
                src="${item.image}"

                alt="${escapeHTML(item.name)}"

                draggable="false"
style="
    width:140px;
    max-width:55%;
    height:140px;
    object-fit:contain;
"
            >


            <h2
                style="
                    margin:
                        12px 0 0;
                    color:#17313a;
                "
            >
               ${escapeHTML(item.name)}
${item.gender || ""}
            </h2>
        
        <div
    style="
        margin-top:8px;
        color:#58686e;
        font-size:15px;
        line-height:1.5;
    "
>
    <div>
        <strong>Species:</strong>
        ${escapeHTML(item.species)}
    </div>

    <div>
        <strong>Breed:</strong>
        ${escapeHTML(item.breed)}
    </div>
</div>

        <p
    style="
        margin:10px 0 4px;
        color:#68777b;
        font-size:15px;
    "
>
    Unlocks at Trainer Level
    ${item.level}
</p>


<div
    style="
        margin-top:12px;
        color:#17313a;
        font-size:20px;
        font-weight:bold;
    "
>
    🪙 ${item.price}
</div>

<button
    type="button"

    onclick="
        openVoidyPetCustomization(
            '${item.id}'
        )
    "

    style="
        margin-top:20px;
        min-width:150px;
        padding:13px 22px;

        border:none;
        border-radius:14px;

        background:
            var(
                --user-theme-color,
                #4fb5ae
            );

        color:white;

        font-size:17px;
        font-weight:bold;

        cursor:pointer;
    "
>
    This One! 🐾
</button>

        </div>

    `;


    (
        document.fullscreenElement ||
        document.body
    ).appendChild(
        overlay
    );
}

function openVoidyPetCustomization(
    petId
) {

    const item =
        voidyPetStoreItems.find(
            function(pet) {

                return (
                    pet.id === petId
                );
            }
        );


    if (!item) {
        return;
    }


    document
        .getElementById(
            "voidy-pet-details-popup"
        )
        ?.remove();


    document
        .getElementById(
            "voidy-pet-customization-popup"
        )
        ?.remove();


    const overlay =
        document.createElement(
            "div"
        );


    overlay.id =
        "voidy-pet-customization-popup";


    overlay.dataset.selectedGender =
        item.gender || "⁉️";


    overlay.style.cssText = `
        position:fixed;
        inset:0;

        background:
            rgba(12, 25, 29, .72);

        display:flex;
        align-items:center;
        justify-content:center;

        padding:12px;

        box-sizing:border-box;

        z-index:100002;
    `;


    overlay.innerHTML = `

        <div
            style="
                position:relative;

                width:min(390px, 90vw);

                background:
                    linear-gradient(
                        180deg,
                        white 0%,
                        color-mix(
                            in srgb,
                            var(
                                --user-theme-color,
                                #4fb5ae
                            ) 12%,
                            white
                        ) 100%
                    );

                border:
                    3px solid
                    var(
                        --user-theme-color,
                        #4fb5ae
                    );

                border-radius:22px;

                padding:
                    15px
                    22px
                    18px;

                box-sizing:border-box;

                text-align:center;

                box-shadow:
                    0 16px 40px
                    rgba(0,0,0,.32);
            "
        >


            <!-- CLOSE BUTTON -->

            <button
                type="button"

                onclick="
                    document
                        .getElementById(
                            'voidy-pet-customization-popup'
                        )
                        ?.remove()
                "

                style="
                    position:absolute;

                    top:9px;
                    right:9px;

                    width:34px;
                    height:34px;

                    border:
                        2px solid
                        var(
                            --user-theme-color,
                            #4fb5ae
                        );

                    border-radius:50%;

                    background:white;

                    color:#17313a;

                    font-size:18px;
                    font-weight:bold;

                    cursor:pointer;
                "
            >
                ×
            </button>


            <!-- PET IMAGE -->

            <div
                style="
                    width:112px;
                    height:112px;

                    margin:
                        0 auto 2px;

                    display:flex;
                    align-items:center;
                    justify-content:center;

                    border-radius:50%;

                    background:
                        color-mix(
                            in srgb,
                            var(
                                --user-theme-color,
                                #4fb5ae
                            ) 10%,
                            white
                        );
                "
            >

                <img
                    src="${item.image}"

                    alt="${escapeHTML(item.name)}"

                    draggable="false"

                    style="
                        display:block;

                        width:100px;
                        height:100px;

                        object-fit:contain;
                    "
                >

            </div>


            <!-- TITLE -->

            <h2
                style="
                    margin:
                        2px 0 2px;

                    color:#17313a;

                    font-size:22px;
                    line-height:1.2;
                "
            >
                Make Them Yours!
            </h2>


            <div
                style="
                    margin-bottom:10px;

                    color:
                        var(
                            --user-theme-color,
                            #4fb5ae
                        );

                    font-size:13px;
                    font-weight:bold;
                "
            >
                🐾 ESSAzLife Adoption
            </div>


            <!-- NAME -->

            <label
                for="voidy-pet-custom-name"

                style="
                    display:block;

                    margin-bottom:4px;

                    color:#17313a;

                    font-size:14px;
                    font-weight:bold;
                "
            >
                What should we call them?
            </label>


            <input
                id="voidy-pet-custom-name"

                type="text"

                placeholder="${escapeHTML(item.name)}"

                maxlength="30"

                style="
                    width:100%;

                    padding:
                        9px 12px;

                    box-sizing:border-box;

                    border:
                        2px solid
                        color-mix(
                            in srgb,
                            var(
                                --user-theme-color,
                                #4fb5ae
                            ) 45%,
                            white
                        );

                    border-radius:12px;

                    outline:none;

                    background:white;

                    color:#17313a;

                    font-size:16px;

                    text-align:center;
                "
            >


            <p
                style="
                    margin:
                        4px 0 9px;

                    color:#68777b;

                    font-size:11px;
                "
            >
                Leave blank to keep
                ${escapeHTML(item.name)}.
            </p>


            <!-- GENDER -->

            <div>

                <div
                    style="
                        margin-bottom:5px;

                        color:#17313a;

                        font-size:14px;
                        font-weight:bold;
                    "
                >
                    Gender
                </div>


                <div
                    style="
                        display:flex;

                        justify-content:center;

                        gap:8px;
                    "
                >


                    <button
                        type="button"

                        data-voidy-gender="♀️"

                        onclick="
                            selectVoidyPetGender(
                                this,
                                '♀️'
                            )
                        "

                        style="
                            width:50px;
                            height:40px;

                            border:
                                2px solid
                                ${item.gender === "♀️"
                                    ? "var(--user-theme-color, #4fb5ae)"
                                    : "#dbe5e7"};

                            border-radius:11px;

                            background:
                                ${item.gender === "♀️"
                                    ? "color-mix(in srgb, var(--user-theme-color, #4fb5ae) 15%, white)"
                                    : "white"};

                            font-size:18px;

                            cursor:pointer;
                        "
                    >
                        ♀️
                    </button>


                    <button
                        type="button"

                        data-voidy-gender="♂️"

                        onclick="
                            selectVoidyPetGender(
                                this,
                                '♂️'
                            )
                        "

                        style="
                            width:50px;
                            height:40px;

                            border:
                                2px solid
                                ${item.gender === "♂️"
                                    ? "var(--user-theme-color, #4fb5ae)"
                                    : "#dbe5e7"};

                            border-radius:11px;

                            background:
                                ${item.gender === "♂️"
                                    ? "color-mix(in srgb, var(--user-theme-color, #4fb5ae) 15%, white)"
                                    : "white"};

                            font-size:18px;

                            cursor:pointer;
                        "
                    >
                        ♂️
                    </button>


                    <button
                        type="button"

                        data-voidy-gender="⁉️"

                        onclick="
                            selectVoidyPetGender(
                                this,
                                '⁉️'
                            )
                        "

                        style="
                            width:50px;
                            height:40px;

                            border:
                                2px solid
                                ${item.gender === "⁉️"
                                    ? "var(--user-theme-color, #4fb5ae)"
                                    : "#dbe5e7"};

                            border-radius:11px;

                            background:
                                ${item.gender === "⁉️"
                                    ? "color-mix(in srgb, var(--user-theme-color, #4fb5ae) 15%, white)"
                                    : "white"};

                            font-size:18px;

                            cursor:pointer;
                        "
                    >
                        ⁉️
                    </button>

                </div>

            </div>


            <!-- ADOPT -->

            <button
                type="button"

                onclick="
                    purchaseVoidyPet(
                        '${item.id}'
                    )
                "

                style="
                    margin-top:12px;

                    min-width:180px;

                    padding:
                        10px 20px;

                    border:
                        2px solid
                        color-mix(
                            in srgb,
                            var(
                                --user-theme-color,
                                #4fb5ae
                            ) 80%,
                            #17313a
                        );

                    border-radius:13px;

                    background:
                        var(
                            --user-theme-color,
                            #4fb5ae
                        );

                    color:white;

                    font-size:16px;
                    font-weight:bold;

                    cursor:pointer;
                "
            >
                Adopt for 🪙 ${item.price}
            </button>


            <div
                style="
                    margin-top:6px;

                    color:#68777b;

                    font-size:11px;
                "
            >
                🐾 They'll join your Play house!
            </div>


        </div>

    `;


    (
        document.fullscreenElement ||
        document.body
    ).appendChild(
        overlay
    );
}

function selectVoidyPetGender(
    button,
    gender
) {

    const popup =
        document.getElementById(
            "voidy-pet-customization-popup"
        );


    if (!popup) {
        return;
    }


    const buttons =
        popup.querySelectorAll(
            "[data-voidy-gender]"
        );


    buttons.forEach(
        function(genderButton) {

            genderButton.style.border =
                "2px solid #dbe5e7";

            genderButton.style.background =
                "white";

        }
    );


    button.style.border =
        "2px solid var(--user-theme-color, #4fb5ae)";

    button.style.background =
        "rgba(79,181,174,.12)";


    popup.dataset.selectedGender =
        gender;
}

function purchaseVoidyPet(
    petId
) {

    // FIND THE STORE PET

    const item =
        voidyPetStoreItems.find(
            function(pet) {

                return (
                    pet.id === petId
                );
            }
        );


    if (!item) {
        return;
    }


    // GET PLAY DATA

    const playData =
        getSavedPlayData();


    const currentCoins =
        Number(
            playData.coins || 0
        );


    // GET CUSTOMIZATION POPUP

    const popup =
        document.getElementById(
            "voidy-pet-customization-popup"
        );


    if (!popup) {
        return;
    }


    // GET CUSTOM NAME

    const nameInput =
        document.getElementById(
            "voidy-pet-custom-name"
        );


    const customName =
        nameInput?.value.trim() ||
        item.name;


    // GET SELECTED GENDER

    const selectedGender =
        popup.dataset.selectedGender ||
        item.gender ||
        "⁉️";


    // CHECK COINS

    if (
        currentCoins <
        item.price
    ) {

        showVoidyNotEnoughCoinsPopup(
            item
        );

        return;
    }


    // CREATE THIS UNIQUE COPY

    const ownedPet = {

        id:
            makeId(
                "voidy-pet"
            ),

        originalPetId:
            item.id,

        name:
            customName,

        gender:
            selectedGender,

        species:
            item.species,

        breed:
            item.breed,

        image:
            item.image,

        purchasedAt:
            new Date()
                .toISOString()

    };


    // CHARGE THE PLAYER

    playData.coins =
        currentCoins -
        item.price;


    // SAVE OWNERSHIP

    playData.ownedVoidyPets.push(
        ownedPet
    );

    playData.unlockedEssaIds.push(
    ownedPet.id
);


    // CREATE THIS ESSA'S OWN NEEDS/STATS

    getPlayEssaStats(
        playData,
        ownedPet.id
    );


    // SAVE PLAY DATA

    savePlayData(
        playData
    );


    // PUT THE NEW ESSA IN THE PLAYROOM

    const houseData =
        getSavedPlayHouseData();


    houseData.essaRooms[
        ownedPet.id
    ] = "playroom";


    houseData.essaPositions[
        ownedPet.id
    ] = {

        x:
            30 +
            Math.random() * 40,

        floor: 4

    };


    savePlayHouseData(
        houseData
    );


    // TEST OUTPUT

    document
    .getElementById(
        "voidy-pet-customization-popup"
    )
    ?.remove();


showVoidyAdoptionSuccessPopup(
    ownedPet,
    playData.coins
);
}

function showVoidyNotEnoughCoinsPopup(
    item
) {

    const playData =
        getSavedPlayData();


    const currentCoins =
        Number(
            playData.coins || 0
        );


    const coinsNeeded =
        Math.max(
            0,
            item.price - currentCoins
        );


    document
        .getElementById(
            "voidy-not-enough-coins-popup"
        )
        ?.remove();


    const overlay =
        document.createElement(
            "div"
        );


    overlay.id =
        "voidy-not-enough-coins-popup";


    overlay.style.cssText = `
        position:fixed;
        inset:0;

        background:
            rgba(12,25,29,.72);

        display:flex;
        align-items:center;
        justify-content:center;

        padding:12px;

        box-sizing:border-box;

        z-index:100003;
    `;


    overlay.innerHTML = `

        <div
            style="
                position:relative;

                width:min(360px, 90vw);

                background:
                    linear-gradient(
                        180deg,
                        white 0%,
                        color-mix(
                            in srgb,
                            var(
                                --user-theme-color,
                                #4fb5ae
                            ) 12%,
                            white
                        ) 100%
                    );

                border:
                    3px solid
                    var(
                        --user-theme-color,
                        #4fb5ae
                    );

                border-radius:22px;

                padding:
                    18px 22px;

                box-sizing:border-box;

                text-align:center;

                box-shadow:
                    0 16px 40px
                    rgba(0,0,0,.32);
            "
        >


            <div
                style="
                    font-size:34px;
                    line-height:1;
                "
            >
                🪙
            </div>


            <h2
                style="
                    margin:
                        8px 0 6px;

                    color:#17313a;

                    font-size:21px;
                "
            >
                Not Enough Coins!
            </h2>


            <p
                style="
                    margin:
                        0 0 12px;

                    color:#58686e;

                    font-size:14px;
                    line-height:1.4;
                "
            >
                You need
                <strong>
                    🪙 ${item.price}
                </strong>
                to adopt
                <strong>
                    ${escapeHTML(item.name)}
                </strong>.
            </p>


            <div
                style="
                    display:flex;

                    justify-content:center;

                    gap:10px;

                    margin-bottom:14px;
                "
            >

                <div
                    style="
                        padding:
                            8px 12px;

                        background:white;

                        border-radius:12px;

                        color:#17313a;

                        font-size:13px;
                    "
                >
                    You have:
                    <strong>
                        🪙 ${currentCoins}
                    </strong>
                </div>


                <div
                    style="
                        padding:
                            8px 12px;

                        background:white;

                        border-radius:12px;

                        color:#17313a;

                        font-size:13px;
                    "
                >
                    Need:
                    <strong>
                        🪙 ${coinsNeeded} more
                    </strong>
                </div>

            </div>


            <button
                type="button"

                onclick="
                    document
                        .getElementById(
                            'voidy-not-enough-coins-popup'
                        )
                        ?.remove()
                "

                style="
                    min-width:140px;

                    padding:
                        10px 18px;

                    border:none;

                    border-radius:12px;

                    background:
                        var(
                            --user-theme-color,
                            #4fb5ae
                        );

                    color:white;

                    font-size:15px;
                    font-weight:bold;

                    cursor:pointer;
                "
            >
                Got It! 🐾
            </button>


        </div>

    `;


    (
        document.fullscreenElement ||
        document.body
    ).appendChild(
        overlay
    );
}

function showVoidyAdoptionSuccessPopup(
    ownedPet,
    coinsRemaining
) {

    document
        .getElementById(
            "voidy-adoption-success-popup"
        )
        ?.remove();


    const overlay =
        document.createElement(
            "div"
        );


    overlay.id =
        "voidy-adoption-success-popup";


    overlay.style.cssText = `
        position:fixed;
        inset:0;

        background:
            rgba(12,25,29,.78);

        display:flex;
        align-items:center;
        justify-content:center;

        padding:12px;

        box-sizing:border-box;

        z-index:100004;
    `;


    overlay.innerHTML = `

        <div
            style="
                position:relative;

                width:min(360px, 90vw);

                background:
                    linear-gradient(
                        180deg,
                        white 0%,
                        color-mix(
                            in srgb,
                            var(
                                --user-theme-color,
                                #4fb5ae
                            ) 12%,
                            white
                        ) 100%
                    );

                border:
                    3px solid
                    var(
                        --user-theme-color,
                        #4fb5ae
                    );

                border-radius:22px;

                padding:
                    18px 22px;

                box-sizing:border-box;

                text-align:center;

                box-shadow:
                    0 16px 40px
                    rgba(0,0,0,.32);
            "
        >


            <div
                style="
                    width:105px;
                    height:105px;

                    margin:
                        0 auto 4px;

                    display:flex;
                    align-items:center;
                    justify-content:center;

                    border-radius:50%;

                    background:
                        color-mix(
                            in srgb,
                            var(
                                --user-theme-color,
                                #4fb5ae
                            ) 10%,
                            white
                        );
                "
            >

                <img
                    src="${ownedPet.image}"

                    alt="${escapeHTML(ownedPet.name)}"

                    draggable="false"

                    style="
                        width:95px;
                        height:95px;

                        object-fit:contain;
                    "
                >

            </div>


            <div
                style="
                    color:
                        var(
                            --user-theme-color,
                            #4fb5ae
                        );

                    font-size:12px;
                    font-weight:bold;
                "
            >
                🐾 ESSAzLife Adoption
            </div>


            <h2
                style="
                    margin:
                        3px 0 5px;

                    color:#17313a;

                    font-size:22px;
                "
            >
                Welcome Home! 🎉
            </h2>


            <p
                style="
                    margin:
                        0 0 10px;

                    color:#58686e;

                    font-size:14px;
                    line-height:1.4;
                "
            >
                <strong>
                    ${escapeHTML(ownedPet.name)}
                    ${ownedPet.gender || ""}
                </strong>

                has joined your
                Play house!
            </p>


            <div
                style="
                    display:inline-block;

                    margin-bottom:12px;

                    padding:
                        7px 13px;

                    border-radius:12px;

                    background:white;

                    color:#17313a;

                    font-size:13px;
                "
            >
                Coins remaining:
                <strong>
                    🪙 ${coinsRemaining}
                </strong>
            </div>


            <br>


            <button
                type="button"

                onclick="
                    goToPlayroomAfterVoidyAdoption()
                "

                style="
                    min-width:170px;

                    padding:
                        10px 18px;

                    border:none;

                    border-radius:12px;

                    background:
                        var(
                            --user-theme-color,
                            #4fb5ae
                        );

                    color:white;

                    font-size:15px;
                    font-weight:bold;

                    cursor:pointer;
                "
            >
                Go See Them! 🐾
            </button>


        </div>

    `;


    (
        document.fullscreenElement ||
        document.body
    ).appendChild(
        overlay
    );
}

function goToPlayroomAfterVoidyAdoption() {

    // CLOSE ADOPTION SUCCESS POPUP

    document
        .getElementById(
            "voidy-adoption-success-popup"
        )
        ?.remove();


    // CLOSE ANY LEFTOVER VOIDY POPUPS

    document
        .getElementById(
            "voidy-pet-customization-popup"
        )
        ?.remove();


    document
        .getElementById(
            "voidy-pet-details-popup"
        )
        ?.remove();


    document
        .getElementById(
            "play-entering-void-overlay"
        )
        ?.remove();


    // SET CURRENT ROOM TO PLAYROOM

    const houseData =
        getSavedPlayHouseData();


    houseData.currentRoomId =
        "playroom";


    savePlayHouseData(
        houseData
    );


    // RENDER PLAYROOM

    renderPlayRoom();
}

function showVoidyAlreadyOwnedPopup(
    item
) {

    document
        .getElementById(
            "voidy-already-owned-popup"
        )
        ?.remove();


    const overlay =
        document.createElement(
            "div"
        );


    overlay.id =
        "voidy-already-owned-popup";


    overlay.style.cssText = `
        position:fixed;
        inset:0;

        background:
            rgba(12,25,29,.72);

        display:flex;
        align-items:center;
        justify-content:center;

        padding:12px;

        box-sizing:border-box;

        z-index:100003;
    `;


    overlay.innerHTML = `

        <div
            style="
                position:relative;

                width:min(340px, 90vw);

                background:
                    linear-gradient(
                        180deg,
                        white 0%,
                        color-mix(
                            in srgb,
                            var(
                                --user-theme-color,
                                #4fb5ae
                            ) 12%,
                            white
                        ) 100%
                    );

                border:
                    3px solid
                    var(
                        --user-theme-color,
                        #4fb5ae
                    );

                border-radius:22px;

                padding:
                    18px 22px;

                box-sizing:border-box;

                text-align:center;

                box-shadow:
                    0 16px 40px
                    rgba(0,0,0,.32);
            "
        >


            <div
                style="
                    width:90px;
                    height:90px;

                    margin:
                        0 auto 4px;

                    display:flex;
                    align-items:center;
                    justify-content:center;

                    border-radius:50%;

                    background:
                        color-mix(
                            in srgb,
                            var(
                                --user-theme-color,
                                #4fb5ae
                            ) 10%,
                            white
                        );
                "
            >

                <img
                    src="${item.image}"

                    alt="${escapeHTML(item.name)}"

                    draggable="false"

                    style="
                        width:80px;
                        height:80px;

                        object-fit:contain;
                    "
                >

            </div>


            <h2
                style="
                    margin:
                        5px 0 5px;

                    color:#17313a;

                    font-size:20px;
                "
            >
                Already Adopted! 🐾
            </h2>


            <p
                style="
                    margin:
                        0 0 13px;

                    color:#58686e;

                    font-size:14px;
                    line-height:1.4;
                "
            >
                You already own
                <strong>
                    ${escapeHTML(item.name)}
                </strong>!
            </p>


            <button
                type="button"

                onclick="
                    document
                        .getElementById(
                            'voidy-already-owned-popup'
                        )
                        ?.remove()
                "

                style="
                    min-width:140px;

                    padding:
                        10px 18px;

                    border:none;

                    border-radius:12px;

                    background:
                        var(
                            --user-theme-color,
                            #4fb5ae
                        );

                    color:white;

                    font-size:15px;
                    font-weight:bold;

                    cursor:pointer;
                "
            >
                Got It! 🐾
            </button>


        </div>

    `;


    (
        document.fullscreenElement ||
        document.body
    ).appendChild(
        overlay
    );
}

function makeVoidyCustomEssaShelfItems() {

    const playData =
        getSavedPlayData();

    const trainerLevel =
        playData.trainerLevel || 1;

    const customEssas =
        getSavedCustomPlayEssas();


    return voidyPetStoreItems

        .filter(function(item) {

            return (
                item.customEssaSlot === true
            );

        })

        .map(function(item) {

            const slotNumber =
                Number(
                    item.id.replace(
                        "custom-essa-",
                        ""
                    )
                );


            const savedEssa =
                customEssas.find(
                    function(essa) {

                        return (
                            Number(
                                essa.slotNumber
                            ) === slotNumber
                        );

                    }
                );


            const isUnlocked =
                trainerLevel >= item.level;


            // LOCKED SLOT
            if (!isUnlocked) {

                return `

                    <div
                        onclick="
                            showVoidyLockedItemMessage()
                        "

                        style="
                            width:90px;
                            height:80px;

                            display:flex;
                            align-items:center;
                            justify-content:center;

                            cursor:pointer;
                        "
                    >

                        <img
                            src="${voidyLockedItemImage}"

                            alt="Locked Custom ESSA"

                            draggable="false"

                            style="
                                display:block;

                                max-width:75px;
                                max-height:75px;

                                object-fit:contain;

                                pointer-events:none;
                            "
                        >

                    </div>

                `;

            }


            // OCCUPIED SLOT
           if (savedEssa) {

    return `

        <div
            onclick="
                openVoidyCustomEssaDetails(
                    '${savedEssa.id}'
                )
            "

            style="
                width:90px;
                height:80px;

                display:flex;
                align-items:center;
                justify-content:center;

                cursor:pointer;
            "
        >

            <img
                src="${savedEssa.image}"

                alt="${escapeHTML(savedEssa.name)}"

                title="${escapeHTML(savedEssa.name)}"

                draggable="false"

                style="
                    display:block;

                    max-width:85px;
                    max-height:75px;

                    object-fit:contain;

                    pointer-events:none;
                "
            >

        </div>

    `;

}


            // UNLOCKED + EMPTY SLOT
            return `

                <button
                    type="button"

                    onclick="
    showCustomPlayEssaForm();
"

                    style="
                        width:90px;
                        min-height:58px;

                        padding:8px;

                        border:
                            2px dashed white;

                        border-radius:12px;

                        background:
                            rgba(
                                0,
                                0,
                                0,
                                .45
                            );

                        color:white;

                        font-size:13px;
                        font-weight:bold;

                        cursor:pointer;
                    "
                >
                    + Custom ESSA
                </button>

            `;

        })

        .join("");

}

function openVoidyCustomEssaDetails(
    essaId
) {

    const customEssas =
        getSavedCustomPlayEssas();


    if (
        customEssas.length === 0
    ) {

        return;
    }


    const currentIndex =
        customEssas.findIndex(
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
        );


    if (
        currentIndex === -1
    ) {

        return;
    }


    const essa =
        customEssas[
            currentIndex
        ];


    const previousEssa =
        customEssas[
            (
                currentIndex -
                1 +
                customEssas.length
            ) %
            customEssas.length
        ];


    const nextEssa =
        customEssas[
            (
                currentIndex +
                1
            ) %
            customEssas.length
        ];


    document
        .getElementById(
            "voidy-custom-essa-details-popup"
        )
        ?.remove();


    const overlay =
        document.createElement(
            "div"
        );


    overlay.id =
        "voidy-custom-essa-details-popup";


    overlay.style.cssText = `
        position:fixed;
        inset:0;

        background:
            rgba(0,0,0,.65);

        display:flex;
        align-items:center;
        justify-content:center;

        padding:20px;

        box-sizing:border-box;

        z-index:100002;
    `;


    overlay.innerHTML = `

        <div
            style="
                position:relative;

                width:
                    min(
                        480px,
                        92vw
                    );

                background:white;

                border-radius:24px;

                padding:28px;

                box-sizing:border-box;

                text-align:center;

                box-shadow:
                    0 18px 50px
                    rgba(0,0,0,.35);
            "
        >


            <button
                type="button"

                onclick="
                    document
                        .getElementById(
                            'voidy-custom-essa-details-popup'
                        )
                        ?.remove()
                "

                style="
                    position:absolute;

                    top:14px;
                    right:14px;

                    width:40px;
                    height:40px;

                    border:none;
                    border-radius:50%;

                    background:#eef3f4;

                    font-size:22px;
                    font-weight:bold;

                    cursor:pointer;
                "
            >
                ×
            </button>


            <button
                type="button"

                onclick="
                    openVoidyCustomEssaDetails(
                        '${previousEssa.id}'
                    )
                "

                aria-label="Previous Custom ESSA"

                style="
                    position:absolute;

                    left:18px;
                    top:45%;

                    width:46px;
                    height:46px;

                    border:none;
                    border-radius:50%;

                    background:#eef3f4;
                    color:#17313a;

                    font-size:28px;
                    font-weight:bold;

                    cursor:pointer;

                    z-index:5;
                "
            >
                ‹
            </button>


            <button
                type="button"

                onclick="
                    openVoidyCustomEssaDetails(
                        '${nextEssa.id}'
                    )
                "

                aria-label="Next Custom ESSA"

                style="
                    position:absolute;

                    right:18px;
                    top:45%;

                    width:46px;
                    height:46px;

                    border:none;
                    border-radius:50%;

                    background:#eef3f4;
                    color:#17313a;

                    font-size:28px;
                    font-weight:bold;

                    cursor:pointer;

                    z-index:5;
                "
            >
                ›
            </button>


            <img
                src="${essa.image}"

                alt="${escapeHTML(
                    essa.name
                )}"

                draggable="false"

                style="
                    width:180px;

                    max-width:55%;

                    height:180px;

                    object-fit:contain;
                "
            >


            <h2
                style="
                    margin:
                        12px 0 4px;

                    color:#17313a;
                "
            >
                ${escapeHTML(
                    essa.name
                )}

                ${essa.gender || ""}
            </h2>


            <div
                style="
                    margin-top:8px;

                    color:#58686e;

                    font-size:15px;

                    line-height:1.6;
                "
            >

                <div>
                    <strong>
                        Custom ESSA
                    </strong>
                </div>


                <div>
                    Slot
                    #${Number(
                        essa.slotNumber
                    ) || "?"}
                </div>

            </div>


        </div>

    `;


    const popupHost =
        document.fullscreenElement ||
        document.body;


    popupHost.appendChild(
        overlay
    );
}

function makeVoidyHolidayPetShelfItems() {

    const today =
        new Date();

    const todayString =
        [
            today.getFullYear(),

            String(
                today.getMonth() + 1
            ).padStart(2, "0"),

            String(
                today.getDate()
            ).padStart(2, "0")
        ].join("-");


    const holidayPets =
        voidyPetStoreItems.filter(
            function(item) {

                if (
                    item.limitedEdition !== true
                ) {
                    return false;
                }


                if (
                    !item.availableFrom ||
                    !item.availableUntil
                ) {
                    return false;
                }


                return (
                    todayString >=
                        item.availableFrom
                    &&
                    todayString <=
                        item.availableUntil
                );
            }
        );


    return holidayPets
        .map(
            function(item) {

                return `

                   <div
    class="voidy-holiday-pet-item"

    data-pet-id="${item.id}"

    onclick="
        openVoidyPetCustomization(
            '${item.id}'
        )
    "

    style="
        position:relative;

        width:90px;
        height:105px;

        display:flex;
        align-items:flex-end;
        justify-content:center;

        cursor:pointer;
        pointer-events:auto;
    "
>
                        <img
                            src="${item.image}"

                            alt="${item.name}"

                            draggable="false"

                            style="
                                display:block;

                                max-width:85px;
                                max-height:95px;

                                object-fit:contain;

                                pointer-events:none;
                            "
                        >

                    </div>

                `;

            }
        )
        .join("");
}

function openVoidyStorePage(
    pageName
) {

    const overlay =
        document.getElementById(
            "play-entering-void-overlay"
        );


    if (!overlay) {
        return;
    }


    const pages = [
        "pets",
        "custom-pets",
        "downloadables",
        "kennel"
    ];


    const currentIndex =
        pages.indexOf(
            pageName
        );


    if (currentIndex === -1) {
        return;
    }


    const imagePaths = {
        pets:
            "ESSAzLife.Images/PlayModeAssets/VoidyStore/voidy-store-pets.png",

        "custom-pets":
            "ESSAzLife.Images/PlayModeAssets/VoidyStore/voidy-store-pets.png",

        downloadables:
            "ESSAzLife.Images/PlayModeAssets/VoidyStore/voidy-store-downloadables.png",

        kennel:
            "ESSAzLife.Images/PlayModeAssets/VoidyStore/voidy-kennel.png"
    };


    const previousPage =
        currentIndex > 0
            ? pages[
                currentIndex - 1
            ]
            : null;


    const nextPage =
        currentIndex <
            pages.length - 1
            ? pages[
                currentIndex + 1
            ]
            : null;


    overlay.innerHTML = `

        <div
            id="play-voidy-store"

            data-void-page="${pageName}"

            style="
                position:absolute;
                inset:0;
                background:black;
            "
        >

            <img
                src="${
                    imagePaths[
                        pageName
                    ]
                }"

                alt="Voidy Store"

                draggable="false"

                style="
                    display:block;
                    width:100%;
                    height:100%;
                    object-fit:contain;
                    pointer-events:none;
                "
            >


            ${
                (
                    pageName === "pets" ||
                    pageName === "custom-pets"
                )
                    ? `

                        <div
                            id="voidy-pet-shelves"

                            style="
                                position:absolute;

                                left:50%;
                                top:50%;

                                transform:
                                    translate(
                                        -50%,
                                        -50%
                                    );

                                width:70%;
                                height:65%;

                                display:grid;

                                grid-template-columns:
                                    repeat(
                                        6,
                                        1fr
                                    );

                                grid-template-rows:
                                    repeat(
                                        3,
                                        1fr
                                    );

                                align-items:center;
                                justify-items:center;

                                z-index:10;

                                pointer-events:auto;
                            "
                        >

                            ${
                                pageName ===
                                "custom-pets"
                                    ? makeVoidyCustomEssaShelfItems()
                                    : makeVoidyPetShelfItems()
                            }

                        </div>


                        <div
                            id="voidy-holiday-pet-shelf"

                            style="
                                position:absolute;

                                left:48%;
                                top:5%;

                                transform:
                                    translateX(-50%);

                                width:45%;
                                height:110px;

                                display:grid;

                                grid-template-columns:
                                    repeat(
                                        3,
                                        1fr
                                    );

                                align-items:flex-end;
                                justify-items:center;

                                z-index:11;

                                pointer-events:auto;
                            "
                        >

                            ${
                                makeVoidyHolidayPetShelfItems()
                            }

                        </div>

                    `
                    : ""
            }


            ${
                pageName === "downloadables"
                    ? `

                        <button
                            type="button"

                            onclick="
                                showVoidyDownloadablesMessage()
                            "

                            aria-label="
                                Locked Downloadables
                            "

                            style="
                                position:absolute;

                                left:50%;
                                top:50%;

                                transform:
                                    translate(
                                        -50%,
                                        -50%
                                    );

                                width:min(
                                    300px,
                                    45vw
                                );

                                height:min(
                                    300px,
                                    55vh
                                );

                                padding:0;

                                border:none;
                                background:transparent;

                                cursor:pointer;

                                z-index:50;
                            "
                        >

                            <img
                                src="ESSAzLife.Images/PlayModeAssets/VoidyStore/locked-item.png"

                                alt="Locked"

                                draggable="false"

                                style="
                                    display:block;

                                    width:100%;
                                    height:100%;

                                    object-fit:contain;

                                    pointer-events:none;
                                "
                            >

                        </button>

                    `
                    : ""
            }


            ${
                pageName === "kennel"
                    ? `

                        <button
                            type="button"

                            onclick="
                                openVoidyStashMenu()
                            "

                            style="
                                position:absolute;

                                top:10px;
                                right:10%;

                                transform:none;

                                padding:
    8px 14px;

                                border:
                                    3px solid
                                    var(
                                        --user-theme-color,
                                        #4fb5ae
                                    );

                                border-radius:
                                    999px;

                                background:
                                    rgba(
                                        255,
                                        255,
                                        255,
                                        .94
                                    );

                                color:
                                    #17313a;

                                font-size:
    12px;

                                font-weight:
                                    900;

                                cursor:pointer;

                                z-index:100;
                            "
                        >
                            🐾 Stash-an-ESSA
                        </button>

                        <button
    type="button"

    onclick="
        openVoidyKennelHeadCount()
    "

    style="
        position:absolute;

        top:52px;
right:10%;

        transform:none;

        padding:
    8px 14px;

        border:
            3px solid
            var(
                --user-theme-color,
                #4fb5ae
            );

        border-radius:
            999px;

        background:
            rgba(
                255,
                255,
                255,
                .94
            );

        color:#17313a;

        font-size:
    12px;
        font-weight:900;

        cursor:pointer;

        z-index:100;
    "
>
    📋 Head-Count
</button>

                    `
                    : ""
            }


            ${
                previousPage
                    ? `

                        <button
                            type="button"

                            onclick="
                                openVoidyStorePage(
                                    '${previousPage}'
                                )
                            "

                            aria-label="
                                Previous Void store
                            "

                            style="
                                position:absolute;

                                left:3%;
                                top:50%;

                                transform:
                                    translateY(-50%);

                                width:55px;
                                height:55px;

                                border:none;
                                border-radius:50%;

                                background:
                                    rgba(
                                        255,
                                        255,
                                        255,
                                        .92
                                    );

                                color:#17313a;

                                font-size:34px;
                                font-weight:bold;

                                cursor:pointer;

                                z-index:100;
                            "
                        >
                            ‹
                        </button>

                    `
                    : ""
            }


            ${
                pageName === "kennel"
                    ? `

                        <div
                            id="voidy-kennel-essas"

                            style="
                                position:absolute;
                                inset:0;

                                z-index:20;

                                pointer-events:auto;
                            "
                        >

                            ${
                                makeVoidyKennelEssas()
                            }

                        </div>

                    `
                    : ""
            }


            ${
                nextPage
                    ? `

                        <button
                            type="button"

                            onclick="
                                openVoidyStorePage(
                                    '${nextPage}'
                                )
                            "

                            aria-label="
                                Next Void store
                            "

                            style="
                                position:absolute;

                                right:3%;
                                top:50%;

                                transform:
                                    translateY(-50%);

                                width:55px;
                                height:55px;

                                border:none;
                                border-radius:50%;

                                background:
                                    rgba(
                                        255,
                                        255,
                                        255,
                                        .92
                                    );

                                color:#17313a;

                                font-size:34px;
                                font-weight:bold;

                                cursor:pointer;

                                z-index:100;
                            "
                        >
                            ›
                        </button>

                    `
                    : ""
            }


            <button
                type="button"

                onclick="
                    closePlayVoid()
                "

                aria-label="
                    Leave The Void
                "

                style="
                    position:absolute;

                    top:18px;
                    right:18px;

                    width:48px;
                    height:48px;

                    padding:0;

                    border:none;
                    border-radius:50%;

                    background:white;
                    color:#17313a;

                    font-size:24px;
                    font-weight:bold;

                    cursor:pointer;

                    z-index:100;
                "
            >
                ×
            </button>

        </div>

    `;


    if (
        pageName === "kennel"
    ) {

        startVoidyKennelEssaWandering();

    }

}

function getVoidyStashableEssas() {

    const playData =
        getSavedPlayData();


    const houseData =
        getSavedPlayHouseData();


    const allEssas =
        getAllPlayableEssas();


    return allEssas.filter(
        function(essa) {

            const isOwned =
                playData
                    .unlockedEssaIds
                    .includes(
                        essa.id
                    );


            const isInKennel =
                houseData
                    .essaRooms[
                        essa.id
                    ] ===
                    "kennel";


            return (
                isOwned &&
                !isInKennel
            );
        }
    );
}

function makeVoidyStashEssaCards() {

    const essas =
        getVoidyStashableEssas();


    if (essas.length === 0) {

        return `
            <div
                style="
                    padding:14px;
                    font-size:13px;
                    color:#68777b;
                "
            >
                No ESSAs available to stash.
            </div>
        `;
    }


    return essas
        .map(
            function(essa) {

                const ageText =
                    getPlayEssaAge(
                        essa
                    );


                return `

                    <button
                        type="button"
                        
                        onclick="
    openVoidyStashEssaOptions(
        '${essa.id}'
    )
"

                        style="
                            width:90px;

                            padding:
                                8px 5px;

                            border:
                                2px solid #dbe5e7;

                            border-radius:
                                14px;

                            background:white;

                            color:#17313a;

                            cursor:pointer;

                            text-align:center;
                        "
                    >

                        <img
                            src="${essa.image}"

                            alt="${escapeHTML(
                                essa.name
                            )}"

                            draggable="false"

                            style="
                                display:block;

                                width:45px;
                                height:45px;

                                margin:
                                    0 auto 4px;

                                object-fit:contain;
                            "
                        >


                        <div
                            style="
                                font-size:11px;
                                font-weight:900;

                                white-space:nowrap;
                                overflow:hidden;
                                text-overflow:ellipsis;
                            "
                        >
                            ${escapeHTML(
                                essa.name
                            )}
                            ${essa.gender || ""}
                        </div>


                        ${
                            ageText
                                ? `
                                    <div
                                        style="
                                            margin-top:2px;
                                            font-size:8px;
                                            opacity:.7;
                                        "
                                    >
                                        ${escapeHTML(
                                            ageText
                                        )}
                                    </div>
                                `
                                : ""
                        }

                    </button>

                `;
            }
        )
        .join("");
}

function openVoidyStashEssaOptions(
    essaId
) {

    const essa =
        getAllPlayableEssas()
            .find(
                function(item) {
                    return (
                        item.id ===
                        essaId
                    );
                }
            );


    if (!essa) {
        return;
    }


    const stashPopup =
        document.getElementById(
            "voidy-stash-popup"
        );


    if (!stashPopup) {
        return;
    }


    const ageText =
        getPlayEssaAge(
            essa
        );


    document
        .getElementById(
            "voidy-stash-options-popup"
        )
        ?.remove();


    const overlay =
        document.createElement(
            "div"
        );


    overlay.id =
        "voidy-stash-options-popup";


    overlay.innerHTML = `

        <div
            style="
                width:min(330px, 85vw);

                padding:20px;

                border:
                    3px solid
                    var(
                        --user-theme-color,
                        #4fb5ae
                    );

                border-radius:22px;

                background:white;

                color:#17313a;

                text-align:center;

                box-shadow:
                    0 12px 35px
                    rgba(0,0,0,.28);
            "
        >

            <img
                src="${essa.image}"

                alt="${escapeHTML(
                    essa.name
                )}"

                draggable="false"

                style="
                    width:75px;
                    height:75px;

                    object-fit:contain;

                    margin-bottom:6px;
                "
            >


            <div
                style="
                    font-size:19px;
                    font-weight:900;
                "
            >
                ${escapeHTML(
                    essa.name
                )}
                ${essa.gender || ""}
            </div>


            ${
                ageText
                    ? `
                        <div
                            style="
                                margin-top:2px;

                                font-size:10px;

                                opacity:.65;
                            "
                        >
                            ${escapeHTML(
                                ageText
                            )}
                        </div>
                    `
                    : ""
            }


            <div
                style="
                    display:flex;

                    justify-content:center;

                    gap:10px;

                    margin-top:18px;
                "
            >

                <button
                    type="button"

                    onclick="
                        storeEssaInVoidyKennel(
                            '${essa.id}'
                        )
                    "

                    style="
                        padding:10px 16px;

                        border:none;

                        border-radius:999px;

                        background:
                            var(
                                --user-theme-color,
                                #4fb5ae
                            );

                        color:white;

                        font-weight:900;

                        cursor:pointer;
                    "
                >
                    📦 Store
                </button>


                <button
                    type="button"

                    onclick="
                        confirmVoidyEssaSurrender(
                            '${essa.id}'
                        )
                    "

                    style="
                        padding:10px 16px;

                        border:2px solid #b94a48;

                        border-radius:999px;

                        background:white;

                        color:#b94a48;

                        font-weight:900;

                        cursor:pointer;
                    "
                >
                    Surrender
                </button>

            </div>


            <button
                type="button"

                onclick="
                    document
                        .getElementById(
                            'voidy-stash-options-popup'
                        )
                        ?.remove()
                "

                style="
                    margin-top:14px;

                    border:none;

                    background:transparent;

                    color:#68777b;

                    font-size:12px;

                    cursor:pointer;
                "
            >
                ← Back
            </button>

        </div>

    `;


    Object.assign(
        overlay.style,
        {
            position:
                "absolute",

            inset:
                "0",

            display:
                "flex",

            alignItems:
                "center",

            justifyContent:
                "center",

            background:
                "rgba(12,25,29,.65)",

            zIndex:
                "510"
        }
    );


    stashPopup.appendChild(
        overlay
    );
}

function confirmVoidyEssaSurrender(
    essaId
) {

    const essa =
        getAllPlayableEssas()
            .find(
                function(item) {

                    return (
                        item.id ===
                        essaId
                    );
                }
            );


    if (!essa) {
        return;
    }


    document
        .getElementById(
            "voidy-surrender-confirm-popup"
        )
        ?.remove();


    const popup =
        document.createElement(
            "div"
        );


    popup.id =
        "voidy-surrender-confirm-popup";


    popup.style.cssText = `
        position:absolute;
        inset:0;
        display:flex;
        align-items:center;
        justify-content:center;
        padding:20px;
        background:rgba(0,0,0,.72);
        z-index:520;
    `;


    popup.innerHTML = `

        <div
            style="
                width:min(330px, 88vw);
                padding:18px;
                border:3px solid
                    var(
                        --user-theme-color,
                        #4fb5ae
                    );
                border-radius:22px;
                background:white;
                color:#17313a;
                text-align:center;
                box-shadow:
                    0 12px 35px
                    rgba(0,0,0,.28);
            "
        >

            <img
                src="${essa.image}"
                alt="${escapeHTML(
                    essa.name
                )}"
                draggable="false"
                style="
                    width:80px;
                    height:80px;
                    object-fit:contain;
                    margin-bottom:8px;
                "
            >


            <h2
                style="
                    margin:
                        0 0 8px;
                "
            >
                Surrender
                ${escapeHTML(
                    essa.name
                )}?
            </h2>


            <p
                style="
                    margin:
                        0 0 6px;
                    font-weight:800;
                "
            >
                This will permanently
                delete this ESSA.
            </p>


            <p
                style="
                    margin:
                        0 0 16px;
                    font-size:12px;
                    color:#68777b;
                "
            >
                This cannot be undone.
            </p>


            <div
                style="
                    display:flex;
                    justify-content:center;
                    gap:10px;
                "
            >

                <button
                    type="button"
                    onclick="
                        surrenderVoidyEssa(
                            '${essa.id}'
                        )
                    "
                    style="
                        padding:10px 16px;
                        border:none;
                        border-radius:999px;
                        background:#b83232;
                        color:white;
                        font-weight:900;
                        cursor:pointer;
                    "
                >
                    Yes, Surrender
                </button>


                <button
                    type="button"
                    onclick="
                        document
                            .getElementById(
                                'voidy-surrender-confirm-popup'
                            )
                            ?.remove()
                    "
                    style="
                        padding:10px 16px;
                        border:2px solid #dbe5e7;
                        border-radius:999px;
                        background:white;
                        color:#17313a;
                        font-weight:900;
                        cursor:pointer;
                    "
                >
                    No, Keep Them
                </button>

            </div>

        </div>
    `;


    document
        .getElementById(
            "voidy-stash-popup"
        )
        ?.appendChild(
            popup
        );
}

function surrenderVoidyEssa(
    essaId
) {

    const playData =
        getSavedPlayData();

    const houseData =
        getSavedPlayHouseData();

    const essa =
        getAllPlayableEssas()
            .find(
                function(item) {
                    return (
                        item.id ===
                        essaId
                    );
                }
            );

    if (!essa) {
        return;
    }

    // REMOVE FROM CUSTOM ESSA STORAGE

if (
    essa.custom === true
) {

    const customEssas =
        getSavedCustomPlayEssas()
            .filter(
                function(item) {

                    return (
                        item.id !==
                        essaId
                    );
                }
            );


    saveCustomPlayEssas(
        customEssas
    );
}


    // REMOVE FROM OWNED VOIDY PETS

    if (
        Array.isArray(
            playData.ownedVoidyPets
        )
    ) {

        playData.ownedVoidyPets =
            playData
                .ownedVoidyPets
                .filter(
                    function(item) {
                        return (
                            item.id !==
                            essaId
                        );
                    }
                );
    }


    // REMOVE FROM UNLOCKED / OWNED ESSAS

    playData.unlockedEssaIds =
        playData
            .unlockedEssaIds
            .filter(
                function(id) {
                    return (
                        id !==
                        essaId
                    );
                }
            );


    // DELETE THEIR SAVED STATS

    if (
        playData.essaStats
    ) {

        delete playData
            .essaStats[
                essaId
            ];
    }


    // IF THEY WERE THE SELECTED ESSA,
    // CLEAR THE SELECTION

    if (
        playData.selectedEssaId ===
        essaId
    ) {

        playData.selectedEssaId =
            null;
    }


    // REMOVE THEM FROM HOUSE / KENNEL DATA

    if (
        houseData.essaRooms
    ) {

        delete houseData
            .essaRooms[
                essaId
            ];
    }


    if (
        houseData.essaPositions
    ) {

        delete houseData
            .essaPositions[
                essaId
            ];
    }


    savePlayData(
        playData
    );


    savePlayHouseData(
        houseData
    );


    // CLOSE THE POPUPS

    document
        .getElementById(
            "voidy-surrender-confirm-popup"
        )
        ?.remove();

    document
        .getElementById(
            "voidy-stash-options-popup"
        )
        ?.remove();

    document
        .getElementById(
            "voidy-stash-popup"
        )
        ?.remove();


    // REFRESH THE KENNEL

    openVoidyStorePage(
        "kennel"
    );
}

function storeEssaInVoidyKennel(
    essaId
) {

    const playData =
        getSavedPlayData();


    const houseData =
        getSavedPlayHouseData();


    const essa =
    getAllPlayableEssas()
        .find(
            function(item) {

                return (
                    String(
                        item.id
                    ) ===
                    String(
                        essaId
                    )
                );
            }
        );


    if (!essa) {
        return;
    }


    // MAKE SURE THE USER OWNS THIS ESSA

    if (
    !playData
        .unlockedEssaIds
        .includes(
            essaId
        ) &&
    !isCustomPlayEssa(
        essaId
    )
) {
    return;
}


    // MOVE ESSA OUT OF THE HOUSE
    // AND INTO VOIDY'S KENNEL

    houseData.essaRooms[
        essaId
    ] = "kennel";


    // GIVE THEM A KENNEL POSITION

    houseData.essaPositions[
        essaId
    ] = {

        x:
            25 +
            Math.random() * 50,

        floor:
            8 +
            Math.random() * 18

    };


    savePlayHouseData(
        houseData
    );


    // CLOSE BOTH STASH POPUPS

    document
        .getElementById(
            "voidy-stash-options-popup"
        )
        ?.remove();


    document
        .getElementById(
            "voidy-stash-popup"
        )
        ?.remove();


    // REFRESH THE KENNEL

    openVoidyStorePage(
        "kennel"
    );
}

/* =========================================================
   VOIDY KENNEL RETRIEVAL MESSAGE
========================================================= */

function showVoidyRetrievalMessage(
    essaId
) {

    const overlay =
        document.createElement(
            "div"
        );


    overlay.id =
        "voidy-retrieval-message";


    overlay.style.cssText = `
        position:fixed;
        inset:0;
        z-index:1000000;

        display:flex;
        align-items:center;
        justify-content:center;

        background:black;
    `;


    overlay.innerHTML = `

        <div
            style="
                position:relative;

                width:100%;
                height:100%;

                display:flex;
                align-items:center;
                justify-content:center;

                overflow:hidden;
            "
        >

            <img
                src="ESSAzLife.Images/PlayModeAssets/Voidy/tired-black-voidy.png"

                alt="Voidy"

                style="
                    width:100%;
                    height:100%;

                    object-fit:contain;

                    display:block;
                "
            >


            <div
                style="
                    position:absolute;

                    left:50%;
                    bottom:10%;

                    transform:
                        translateX(-50%);

                    width:90%;
                    max-width:700px;

                    color:white;

                    font-size:
                        clamp(
                            22px,
                            4vw,
                            34px
                        );

                    font-weight:bold;

                    text-align:center;

                    text-shadow:
                        0 3px 8px
                        rgba(0,0,0,.95);
                "
            >
                Take care of them, okay?
            </div>

        </div>

    `;


    const popupHost =
    document.fullscreenElement ||
    document.body;

popupHost.appendChild(
    overlay
);


    setTimeout(
        function() {

            overlay.remove();


            openVoidyStorePage(
                "kennel"
            );

        },
        3000
    );
}

/* =========================================================
   VOIDY LOCKED ITEM MESSAGE
========================================================= */

function showVoidyLockedItemMessage() {

    const overlay =
        document.createElement(
            "div"
        );

    overlay.id =
        "voidy-locked-item-message";

    overlay.style.cssText = `
        position:fixed;
        inset:0;
        z-index:1000000;

        display:flex;
        align-items:center;
        justify-content:center;

        background:black;
    `;

    overlay.innerHTML = `
        <div
            style="
                position:relative;
                width:100%;
                height:100%;

                display:flex;
                align-items:center;
                justify-content:center;

                overflow:hidden;
            "
        >

            <img
                src="ESSAzLife.Images/PlayModeAssets/Voidy/annoyed-black-voidy.png"

                alt="Voidy"

                style="
                    width:100%;
                    height:100%;

                    object-fit:contain;

                    display:block;
                "
            >


            <div
                style="
                    position:absolute;

                    left:50%;
                    bottom:10%;

                    transform:
                        translateX(-50%);

                    width:90%;
                    max-width:700px;

                    color:white;

                    font-size:
                        clamp(
                            22px,
                            4vw,
                            34px
                        );

                    font-weight:bold;

                    text-align:center;

                    text-shadow:
                        0 3px 8px
                        rgba(0,0,0,.95);
                "
            >
                WHY WOULD YOU EVEN TRY THAT?
            </div>

        </div>
    `;


    const popupHost =
    document.fullscreenElement ||
    document.body;

popupHost.appendChild(
    overlay
);


    setTimeout(
        function() {

            overlay.remove();

        },
        3000
    );
}

/* =========================================================
   VOIDY DOWNLOADABLES LOCKED MESSAGE
========================================================= */
function showVoidyDownloadablesMessage() {

    const existing =
        document.getElementById(
            "voidy-downloadables-message"
        );

    if (existing) {
        existing.remove();
    }


    const overlay =
        document.createElement(
            "div"
        );

    overlay.id =
        "voidy-downloadables-message";


    overlay.style.cssText = `
        position:fixed;
        inset:0;

        display:flex;
        align-items:center;
        justify-content:center;

        padding:20px;
        box-sizing:border-box;

        background:rgba(0,0,0,.65);

        z-index:1000000;
    `;


    overlay.innerHTML = `

        <div
            style="
                width:min(500px, 90vw);

                padding:28px;

                box-sizing:border-box;

                background:white;

                border:
                    4px solid
                    var(
                        --user-theme-color,
                        #4fb5ae
                    );

                border-radius:24px;

                text-align:center;

                box-shadow:
                    0 18px 50px
                    rgba(0,0,0,.45);
            "
        >

            <div
                style="
                    font-size:22px;
                    font-weight:900;

                    color:#17313a;

                    line-height:1.5;
                "
            >
                This page will eventually contain toys for ESSAs to play with.
                The artwork is made by testers and used with permission from them.
            </div>


            <button
                type="button"

                onclick="
                    document
                        .getElementById(
                            'voidy-downloadables-message'
                        )
                        ?.remove()
                "

                style="
                    margin-top:24px;

                    padding:10px 28px;

                    border:none;
                    border-radius:999px;

                    background:
                        var(
                            --user-theme-color,
                            #4fb5ae
                        );

                    color:white;

                    font-size:17px;
                    font-weight:900;

                    cursor:pointer;
                "
            >
                Okay
            </button>

        </div>

    `;


    const popupHost =
    document.fullscreenElement ||
    document.body;

popupHost.appendChild(
    overlay
);

}

/* =========================================================
   RETRIEVE ESSA FROM VOIDY'S KENNEL
========================================================= */

function retrieveVoidyKennelEssa(
    essaId
) {

    const playData =
        getSavedPlayData();


    const essa =
        getAnyPlayableEssaById(
            essaId
        );


    if (!essa) {
        return;
    }


    const stats =
        getPlayEssaStats(
            playData,
            essaId
        );


    const placedByVoidy =
        stats.kennelReason ===
        "voidy";


    if (placedByVoidy) {

        const retrievalCost =
            500;


        if (
            Number(
                playData.coins
            ) <
            retrievalCost
        ) {

            alert(
                "You don't have enough coins."
            );

            return;
        }


        playData.coins =
            Number(
                playData.coins
            ) -
            retrievalCost;


        savePlayData(
            playData
        );

    }

    /* RESTORE THE ESSA */

stats.food = 100;
stats.water = 100;
stats.cleanliness = 100;
stats.happiness = 100;

stats.allNeedsZeroSince = null;
stats.neglectHandled = false;
stats.kennelReason = null;
stats.hasBeenWithVoidy =
    true;
stats.justReturnedFromVoidy =
    true;

setTimeout(
    function() {

        const updatedPlayData =
            getSavedPlayData();

        const updatedStats =
            getPlayEssaStats(
                updatedPlayData,
                essaId
            );

        updatedStats.justReturnedFromVoidy =
            false;

        savePlayData(
            updatedPlayData
        );

        renderPlayRoom();

    },
    120000
);


/* RETURN THEM TO THE PLAYROOM */

const houseData =
    getSavedPlayHouseData();


houseData
    .essaRooms[
        essaId
    ] =
    "playroom";


houseData
    .essaPositions[
        essaId
    ] = {
        x:
            30 +
            Math.random() *
            40,

        floor:
            8 +
            Math.random() *
            15
    };


savePlayData(
    playData
);


savePlayHouseData(
    houseData
);


    console.log(
        "Retrieval payment successful:",
        essa.name,
        "| coins:",
        getSavedPlayData().coins
    );

    document
    .getElementById(
        "voidy-kennel-retrieve-popup"
    )
    ?.remove();


showVoidyRetrievalMessage(
    essaId
);
}

/* =========================================================
   VOIDY KENNEL RETRIEVAL POPUP
========================================================= */

function openVoidyKennelRetrievePopup(
    essaId
) {

    const essa =
        getAnyPlayableEssaById(
            essaId
        );


    if (!essa) {
        return;
    }


    const playData =
        getSavedPlayData();


    const stats =
        getPlayEssaStats(
            playData,
            essaId
        );


    const placedByVoidy =
        stats.kennelReason ===
        "voidy";


    const oldPopup =
        document.getElementById(
            "voidy-kennel-retrieve-popup"
        );


    if (oldPopup) {
        oldPopup.remove();
    }


    const overlay =
        document.createElement(
            "div"
        );


    overlay.id =
        "voidy-kennel-retrieve-popup";


    overlay.style.cssText = `
        position:fixed;
        inset:0;
        z-index:999999;

        display:flex;
        align-items:center;
        justify-content:center;

        padding:20px;
        box-sizing:border-box;

        background:
            rgba(0,0,0,.55);
    `;


    const retrieveText =
        placedByVoidy
            ? `Retrieve ${escapeHTML(
                essa.name
            )} for 🪙 500 coins?`
            : `Retrieve ${escapeHTML(
                essa.name
            )}?`;


    overlay.innerHTML = `

        <div
            style="
                width:min(420px, 100%);

                padding:24px;
                box-sizing:border-box;

                background:white;

                border-radius:24px;

                text-align:center;

                box-shadow:
                    0 15px 50px
                    rgba(0,0,0,.30);
            "
        >

            <img
                src="${essa.image}"

                alt="${escapeHTML(
                    essa.name
                )}"

                style="
                    display:block;

                    width:140px;
                    height:140px;

                    margin:
                        0 auto 12px auto;

                    object-fit:contain;
                "
            >


            <h2
                style="
                    margin:
                        0 0 18px 0;

                    color:#17313a;

                    font-size:22px;
                    line-height:1.3;
                "
            >
                ${retrieveText}
            </h2>


            <div
                style="
                    display:flex;

                    gap:12px;

                    justify-content:center;
                "
            >

                <button
                    type="button"

                    onclick="
                       retrieveVoidyKennelEssa(
    '${essa.id}'
)
                    "

                    style="
                        min-width:110px;

                        padding:
                            12px 20px;

                        border:none;
                        border-radius:999px;

                        background:
                            var(
                                --user-theme-color,
                                #4fb5ae
                            );

                        color:white;

                        font-size:16px;
                        font-weight:bold;

                        cursor:pointer;
                    "
                >
                    Yes
                </button>


                <button
                    type="button"

                    onclick="
                        document
                            .getElementById(
                                'voidy-kennel-retrieve-popup'
                            )
                            ?.remove()
                    "

                    style="
                        min-width:110px;

                        padding:
                            12px 20px;

                        border:none;
                        border-radius:999px;

                        background:#e8eef0;

                        color:#17313a;

                        font-size:16px;
                        font-weight:bold;

                        cursor:pointer;
                    "
                >
                    No
                </button>

            </div>

        </div>
    `;


   const popupHost =
    document.fullscreenElement ||
    document.body;

popupHost.appendChild(
    overlay
);
}

function openVoidyKennelHeadCount() {

    document
        .getElementById(
            "voidy-kennel-head-count-popup"
        )
        ?.remove();


    const houseData =
        getSavedPlayHouseData();


    const playData =
        getSavedPlayData();


    /* =============================================
       GET CURRENT OWNED COLLECTION
    ============================================= */

    const collectionEssas =
        getAllPlayableEssas()
            .filter(
                function(essa) {

                    const isCustom =
                        essa.custom === true;


                    const isOwned =
                        playData
                            .unlockedEssaIds
                            .some(
                                function(id) {

                                    return (
                                        String(id) ===
                                        String(essa.id)
                                    );
                                }
                            );


                    return (
                        isCustom ||
                        isOwned
                    );
                }
            );


    /* =============================================
       RARITY RULES
    ============================================= */

    const rarityOrder = {

        "Common": 1,

        "Rare": 2,

        "Ultra Rare": 3,

        "Legendary": 4

    };


    function getHeadCountRarity(
        essa
    ) {

        const isCustom =
            essa.custom === true;


        const isHoliday =
    essa.limitedEdition === true ||
    (
        typeof essa.originalPetId ===
        "string" &&
        (
            essa.originalPetId ===
                "voidy-halloween-2026" ||
            essa.originalPetId ===
                "voidy-thanksgiving-2026" ||
            essa.originalPetId ===
                "voidy-santa-2026"
        )
    );

if (
    isCustom ||
    isHoliday
) {

    return "Legendary";
}


        const level =
            Number(
                essa.unlockLevel
            ) || 1;


        if (
            level >= 80
        ) {

            return "Ultra Rare";
        }


        if (
            level >= 40
        ) {

            return "Rare";
        }


        return "Common";
    }


    /* =============================================
       SORT COMMON → LEGENDARY
    ============================================= */

    collectionEssas.sort(
        function(a, b) {

            const rarityA =
                getHeadCountRarity(
                    a
                );


            const rarityB =
                getHeadCountRarity(
                    b
                );


            const rarityDifference =
                rarityOrder[
                    rarityA
                ] -
                rarityOrder[
                    rarityB
                ];


            if (
                rarityDifference !== 0
            ) {

                return rarityDifference;
            }


            return String(
                a.name || ""
            ).localeCompare(
                String(
                    b.name || ""
                )
            );
        }
    );


    /* =============================================
       BUILD TABLE ROWS
    ============================================= */

    const rows =
        collectionEssas
            .map(
                function(essa) {

                    const stats =
                        getPlayEssaStats(
                            playData,
                            essa.id
                        );


                    const isCustom =
                        essa.custom === true;


                    const type =
                        isCustom
                            ? "Custom"
                            : "Permanent";


                    const isInKennel =
                        houseData
                            .essaRooms[
                                essa.id
                            ] ===
                        "kennel";


                    const location =
                        isInKennel
                            ? "Kennel"
                            : "House";


                    const reason =
                        isInKennel
                            ? (
                                stats.kennelReason ===
                                "voidy"
                                    ? "Placed by Voidy"
                                    : "Stored by User"
                            )
                            : "—";


                    const rarity =
                        getHeadCountRarity(
                            essa
                        );


                    return `

                        <div
                            style="
                                display:grid;

                                grid-template-columns:
                                    65px
                                    minmax(90px, 1.1fr)
                                    minmax(80px, .9fr)
                                    minmax(80px, .9fr)
                                    minmax(120px, 1.3fr)
                                    minmax(85px, .9fr);

                                align-items:center;

                                gap:8px;

                                padding:
                                    9px 12px;

                                border-bottom:
                                    1px solid #dbe5e7;
                            "
                        >

                            <div>

                                <img
                                    src="${essa.image}"

                                    alt="${escapeHTML(
                                        essa.name
                                    )}"

                                    draggable="false"

                                    style="
                                        display:block;

                                        width:48px;
                                        height:48px;

                                        margin:auto;

                                        object-fit:contain;
                                    "
                                >

                            </div>


                            <div
                                style="
                                    font-weight:900;
                                "
                            >

                                ${escapeHTML(
                                    essa.name
                                )}

                            </div>


                            <div>

                                ${type}

                            </div>


                            <div
                                style="
                                    font-weight:900;
                                "
                            >

                                ${location}

                            </div>


                            <div>

                                ${reason}

                            </div>


                            <div
                                style="
                                    font-weight:900;
                                "
                            >

                                ${rarity}

                            </div>

                        </div>

                    `;
                }
            )
            .join("");


    /* =============================================
       CREATE POPUP
    ============================================= */

    const overlay =
        document.createElement(
            "div"
        );


    overlay.id =
        "voidy-kennel-head-count-popup";


    overlay.style.cssText = `
        position:absolute;

        inset:0;

        display:flex;

        align-items:center;

        justify-content:center;

        padding:20px;

        box-sizing:border-box;

        background:
            rgba(
                0,
                0,
                0,
                .65
            );

        z-index:1000001;
    `;


    /* =============================================
       POPUP CONTENT
    ============================================= */

    overlay.innerHTML = `

        <div
            style="
                width:min(
                    980px,
                    94vw
                );

                max-height:82vh;

                display:flex;

                flex-direction:column;

                overflow:hidden;

                border:
                    3px solid
                    var(
                        --user-theme-color,
                        #4fb5ae
                    );

                border-radius:22px;

                background:white;

                color:#17313a;

                box-shadow:
                    0 15px 50px
                    rgba(
                        0,
                        0,
                        0,
                        .35
                    );
            "
        >


            <!-- HEADER -->

            <div
                style="
                    position:relative;

                    padding:
                        16px
                        55px
                        12px;

                    text-align:center;

                    border-bottom:
                        2px solid
                        #dbe5e7;
                "
            >

                <div
                    style="
                        font-size:20px;

                        font-weight:900;
                    "
                >

                    📋 Voidy has taken a Head-Count...

                </div>


                <div
                    style="
                        margin-top:4px;

                        font-size:13px;

                        color:#68777b;
                    "
                >

                    Here is your current collection.

                </div>


                <button
                    type="button"

                    onclick="
                        document
                            .getElementById(
                                'voidy-kennel-head-count-popup'
                            )
                            ?.remove()
                    "

                    style="
                        position:absolute;

                        top:10px;

                        right:12px;

                        width:36px;

                        height:36px;

                        padding:0;

                        border:none;

                        border-radius:50%;

                        background:#e8eef0;

                        color:#17313a;

                        font-size:20px;

                        font-weight:900;

                        cursor:pointer;
                    "
                >

                    ×

                </button>

            </div>


            <!-- TABLE -->

            <div
                style="
                    overflow:auto;
                "
            >


                <!-- COLUMN HEADERS -->

                <div
                    style="
                        display:grid;

                        grid-template-columns:
                            65px
                            minmax(90px, 1.1fr)
                            minmax(80px, .9fr)
                            minmax(80px, .9fr)
                            minmax(120px, 1.3fr)
                            minmax(85px, .9fr);

                        gap:8px;

                        padding:
                            10px
                            12px;

                        background:#eef5f5;

                        font-size:10px;

                        font-weight:900;

                        text-transform:uppercase;
                    "
                >

                    <div>
                        ESSA
                    </div>


                    <div>
                        Name
                    </div>


                    <div>
                        Type
                    </div>


                    <div>
                        Location
                    </div>


                    <div>
                        Reason In-Kennel
                    </div>


                    <div>
                        Rarity
                    </div>

                </div>


                ${
                    rows ||
                    `

                        <div
                            style="
                                padding:
                                    35px
                                    20px;

                                text-align:center;

                                color:#68777b;
                            "
                        >

                            No ESSAs are currently
                            in your collection.

                        </div>

                    `
                }

            </div>

        </div>

    `;


    /* =============================================
       FULLSCREEN-SAFE POPUP HOST
    ============================================= */

    const popupHost =
        document.fullscreenElement ||
        document.body;


    popupHost.appendChild(
        overlay
    );
}

function makeVoidyKennelEssas() {

    const houseData =
        getSavedPlayHouseData();


    const allEssas =
        getAllPlayableEssas();


    const kennelEssas =
        allEssas.filter(
            function(essa) {

                return (
                    houseData
                        .essaRooms[
                            essa.id
                        ] ===
                    "kennel"
                );
            }
        );


    return kennelEssas
        .map(
            function(
                essa,
                index
            ) {

                const position =
                    houseData
                        .essaPositions[
                            essa.id
                        ] ||
                    {
                        x:
                            30 +
                            (
                                index *
                                12
                            ),

                        floor:12
                    };


                const ageText =
                    getPlayEssaAge(
                        essa
                    );


                return `

                    <button
                        type="button"

                        data-voidy-kennel-essa="
                            ${essa.id}
                        "

                        onclick="
    openVoidyKennelRetrievePopup(
        '${essa.id}'
    )
"

                        style="
                            position:absolute;

                            left:
                                ${position.x}%;

                            bottom:
                                ${position.floor}%;

                            transform:
                                translateX(-50%);

                            width:6%;

                            min-width:38px;
                            max-width:68px;

                            padding:0;

                            border:none;

                            background:
                                transparent;

                            box-shadow:none;

                            cursor:pointer;

                            z-index:
                                ${Math.round(
                                    100 -
                                    position.floor
                                )};
                        "
                    >

                        <img
                            src="${essa.image}"

                            alt="${escapeHTML(
                                essa.name
                            )}"

                            draggable="false"

                            style="
                                display:block;

                                width:100%;
                                height:auto;

                                object-fit:contain;

                                filter:
                                    drop-shadow(
                                        0 4px 3px
                                        rgba(
                                            0,
                                            0,
                                            0,
                                            .20
                                        )
                                    );
                            "
                        >


                        <div
                            style="
                                position:absolute;

                                left:50%;
                                top:calc(100% + 2px);

                                transform:
                                    translateX(-50%);

                                padding:
                                    3px 7px;

                                white-space:nowrap;

                                border-radius:
                                    999px;

                                background:
                                    rgba(
                                        255,
                                        255,
                                        255,
                                        .90
                                    );

                                color:#26343b;

                                pointer-events:none;
                            "
                        >

                            <div
                                style="
                                    font-size:10px;
                                    font-weight:bold;
                                "
                            >
                                ${escapeHTML(
                                    essa.name
                                )}
                                ${essa.gender || ""}
                            </div>

                          ${
    getPlayEssaStats(
        getSavedPlayData(),
        essa.id
    ).kennelReason === "voidy"
        ? `
            <div
                style="
                    margin-top:2px;
                    color:#d60000;
                    font-size:8px;
                    font-weight:900;
                    letter-spacing:.4px;
                    white-space:nowrap;
                "
            >
                PLACED BY VOIDY
            </div>
        `
        : ""
}


                            ${
                                ageText
                                    ? `
                                        <div
                                            style="
                                                margin-top:2px;
                                                font-size:8px;
                                                font-weight:normal;
                                                opacity:.75;
                                            "
                                        >
                                            ${escapeHTML(
                                                ageText
                                            )}
                                        </div>
                                    `
                                    : ""
                            }

                        </div>

                    </button>

                `;
            }
        )
        .join("");
}

function startVoidyKennelEssaWandering() {

    // STOP AN OLD KENNEL TIMER FIRST

    if (
        window.voidyKennelWanderTimer
    ) {

        clearInterval(
            window.voidyKennelWanderTimer
        );
    }


    window.voidyKennelWanderTimer =
        setInterval(
            function() {

                const kennel =
                    document.getElementById(
                        "voidy-kennel-essas"
                    );


                if (!kennel) {

                    clearInterval(
                        window.voidyKennelWanderTimer
                    );

                    window.voidyKennelWanderTimer =
                        null;

                    return;
                }


                const houseData =
                    getSavedPlayHouseData();


                const kennelEssas =
                    kennel.querySelectorAll(
                        "[data-voidy-kennel-essa]"
                    );


                kennelEssas.forEach(
                    function(element) {

                        const essaId =
                            element
                                .dataset
                                .voidyKennelEssa;


                        const x =
                            20 +
                            Math.random() * 60;


                        const floor =
                            8 +
                            Math.random() * 20;


                        element.style.left =
                            x + "%";


                        element.style.bottom =
                            floor + "%";


                        element.style.transition =
                            "left 3.2s ease, bottom 3.2s ease";


                        houseData
                            .essaPositions[
                                essaId
                            ] = {
                                x: x,
                                floor: floor
                            };

                    }
                );


                savePlayHouseData(
                    houseData
                );

            },
            4000
        );
}

function openVoidyStashMenu() {

    // REMOVE OLD POPUP IF ONE EXISTS

    document
        .getElementById(
            "voidy-stash-popup"
        )
        ?.remove();


    const overlay =
        document.createElement(
            "div"
        );


    overlay.id =
        "voidy-stash-popup";


    overlay.innerHTML = `

        <div
            style="
                width:
                    min(430px, 90vw);

                max-height:
                    85vh;

                overflow-y:auto;

                padding:
                    22px;

                border:
                    3px solid
                    var(
                        --user-theme-color,
                        #4fb5ae
                    );

                border-radius:
                    22px;

                background:
                    linear-gradient(
                        145deg,
                        white,
                        color-mix(
                            in srgb,
                            var(
                                --user-theme-color,
                                #4fb5ae
                            ) 12%,
                            white
                        )
                    );

                box-shadow:
                    0 12px 35px
                    rgba(0,0,0,.28);

                text-align:center;

                color:#17313a;
            "
        >

            <div
    style="
        width:150px;
        height:95px;

        margin:
            0 auto 8px;

        overflow:hidden;

        border-radius:16px;

        position:relative;
    "
>

    <img
        src="ESSAzLife.Images/PlayModeAssets/Voidy/exhausted-voidy-door.png"

        alt="Voidy"

        draggable="false"

        style="
            position:absolute;

            width:300px;
            height:auto;

            left:50%;
           top:80%;

            transform:
                translate(
                    -50%,
                    -42%
                );

            object-fit:contain;
        "
    >

</div>
            >


            <div
                style="
                    font-size:13px;
                    font-weight:900;
                    opacity:.65;
                    margin-bottom:3px;
                "
            >
                🐾 ESSAzLife Kennel
            </div>


            <h2
                style="
                    margin:
                        0 0 14px;

                    font-size:24px;
                "
            >
                Select an ESSA
            </h2>


            <div
                style="
                    padding:12px;

                    border-radius:14px;

                    background:
                        rgba(
                            255,
                            255,
                            255,
                            .72
                        );

                    text-align:left;

                    font-size:13px;

                    line-height:1.45;

                    margin-bottom:16px;
                "
            >

                <strong>
                    Store
                </strong>

                — Let your ESSA run around
                the Kennel until you want
                to bring it back out.

                <br><br>

                <strong>
                    Surrender
                </strong>

                — Delete your ESSA
                permanently from your
                account.

                <strong>
                    This cannot be undone.
                </strong>

            </div>


          <div
    id="voidy-stash-essa-list"

    style="
        display:flex;

        flex-wrap:wrap;

        justify-content:center;

        gap:8px;

        max-height:155px;

        overflow-y:auto;

        padding:4px;
    "
>

    ${
        makeVoidyStashEssaCards()
    }

</div>


            <button
                type="button"

                onclick="
                    document
                        .getElementById(
                            'voidy-stash-popup'
                        )
                        ?.remove()
                "

                style="
                    margin-top:14px;
                    padding:10px 20px;
                    border:none;
                    border-radius:999px;
                    font-weight:900;
                    cursor:pointer;
                "
            >
                Never Mind
            </button>

        </div>

    `;


    Object.assign(
        overlay.style,
        {
            position:
                "absolute",

            inset:
                "0",

            display:
                "flex",

            alignItems:
                "center",

            justifyContent:
                "center",

            background:
                "rgba(12,25,29,.72)",

            zIndex:
                "500"
        }
    );


    const voidStore =
        document.getElementById(
            "play-voidy-store"
        );


    if (!voidStore) {
        return;
    }


    voidStore.appendChild(
        overlay
    );
}

 function openPlayFridge() {


    const existing =
        document.getElementById(
            "play-fridge-overlay"
        );

    if (existing) {
        existing.remove();
    }


    const overlay =
        document.createElement(
            "div"
        );

    overlay.id =
        "play-fridge-overlay";


    overlay.style.cssText = `
        position:fixed;
        inset:0;
        background:rgba(0,0,0,.65);
        display:flex;
        align-items:center;
        justify-content:center;
        z-index:99999;
        padding:20px;
        box-sizing:border-box;
    `;


    overlay.innerHTML = `

        <div
            style="
                position:relative;
                height:min(130vh, 1150px);
                max-width:90vw;
            "
        >

            <img
                src="ESSAzLife.Images/PlayModeAssets/Fridge/open-fridge.png"
                alt="Open fridge"

                style="
                    display:block;
                    height:100%;
                    max-width:90vw;
                    object-fit:contain;
                "
            >

            <button
   onclick="
    confirmPlayFridgeItem(
        'ESSA Milk',
        'ESSAzLife.Images/PlayModeAssets/Drinks/essa-milk.png'
    )
"

    aria-label="ESSA Milk"

    style="
        position:absolute;
        left:25%;
        top:27%;
       width:85px;
height:75px;
        padding:0;
        border:none;
        background:transparent;
        cursor:pointer;
        z-index:10;
    "
>
    <img
        src="ESSAzLife.Images/PlayModeAssets/Drinks/essa-milk.png"
        alt="ESSA Milk"
        style="
            width:100%;
            height:100%;
            object-fit:contain;
            display:block;
        "
    >
</button>

<button
    onclick="
    confirmPlayFridgeItem(
        'Water for ESSAs',
        'ESSAzLife.Images/PlayModeAssets/Drinks/water-for-essas.png'
    )
"

    aria-label="Water for ESSAs"

    style="
        position:absolute;
        left:33%;
        top:27%;
       width:80px;
height:68px;
        padding:0;
        border:none;
        background:transparent;
        cursor:pointer;
        z-index:10;
    "
>
    <img
        src="ESSAzLife.Images/PlayModeAssets/Drinks/water-for-essas.png"
        alt="Water for ESSAs"

        style="
            width:100%;
            height:100%;
            object-fit:contain;
            display:block;
        "
    >
</button>

<button
    onclick="
    confirmPlayFridgeItem(
        'Lemonade',
        'ESSAzLife.Images/PlayModeAssets/Drinks/lemonade.png'
    )
"

    aria-label="Lemonade"

    style="
        position:absolute;
        left:39%;
        top:27%;
        width:80px;
        height:68px;
        padding:0;
        border:none;
        background:transparent;
        cursor:pointer;
        z-index:10;
    "
>
    <img
        src="ESSAzLife.Images/PlayModeAssets/Drinks/lemonade.png"
        alt="Lemonade"

        style="
            width:100%;
            height:100%;
            object-fit:contain;
            display:block;
        "
    >
</button>

<button
    onclick="
    confirmPlayFridgeItem(
        'Orange Soda',
        'ESSAzLife.Images/PlayModeAssets/Drinks/orange-soda.png'
    )
"

    aria-label="Orange Soda"

    style="
        position:absolute;
        left:45%;
        top:27%;
        width:80px;
        height:68px;
        padding:0;
        border:none;
        background:transparent;
        cursor:pointer;
        z-index:10;
    "
>
    <img
        src="ESSAzLife.Images/PlayModeAssets/Drinks/orange-soda.png"
        alt="Orange Soda"

        style="
            width:100%;
            height:100%;
            object-fit:contain;
            display:block;
        "
    >
</button>

<button
    onclick="
    confirmPlayFridgeItem(
        'Strawberry Soda',
        'ESSAzLife.Images/PlayModeAssets/Drinks/strawberry-soda.png'
    )
"

    aria-label="Strawberry Soda"

    style="
        position:absolute;
        left:51%;
        top:27%;
        width:80px;
        height:68px;
        padding:0;
        border:none;
        background:transparent;
        cursor:pointer;
        z-index:10;
    "
>
    <img
        src="ESSAzLife.Images/PlayModeAssets/Drinks/strawberry-soda.png"
        alt="Strawberry Soda"

        style="
            width:100%;
            height:100%;
            object-fit:contain;
            display:block;
        "
    >
</button>

<button
    onclick="
    confirmPlayFridgeItem(
        'ESSA Doo',
        'ESSAzLife.Images/PlayModeAssets/Drinks/essa-doo.png'
    )
"

    aria-label="ESSA Doo"

    style="
        position:absolute;
        left:57%;
        top:27%;
        width:80px;
        height:68px;
        padding:0;
        border:none;
        background:transparent;
        cursor:pointer;
        z-index:10;
    "
>
    <img
        src="ESSAzLife.Images/PlayModeAssets/Drinks/essa-doo.png"
        alt="ESSA Doo"

        style="
            width:100%;
            height:100%;
            object-fit:contain;
            display:block;
        "
    >
</button>

<button
    onclick="
    confirmPlayFridgeItem(
        'ESSAccino',
        'ESSAzLife.Images/PlayModeAssets/Drinks/essa-ccino.png'
    )
"

    aria-label="ESSAccino"

   style="
    position:absolute;
    left:26%;
    top:63%;
    width:65px;
    height:55px;
    padding:0;
    border:none;
    background:transparent;
    cursor:pointer;
    z-index:10;
"
>
   <img
    src="ESSAzLife.Images/PlayModeAssets/Drinks/essa-ccino.png"
    alt="ESSAccino"

    style="
        width:100%;
        height:100%;
        object-fit:contain;
        display:block;
    "
>
</button>

<button
    onclick="
    confirmPlayFridgeItem(
        'Hot Cocoa',
        'ESSAzLife.Images/PlayModeAssets/Drinks/hot-cocoa.png'
    )
"

    aria-label="Hot Cocoa"

   style="
    position:absolute;
    left:33%;
    top:63%;
    width:65px;
    height:55px;
    padding:0;
    border:none;
    background:transparent;
    cursor:pointer;
    z-index:10;
"
>
    <img
        src="ESSAzLife.Images/PlayModeAssets/Drinks/hot-cocoa.png"
        alt="Hot Cocoa"

        style="
            width:100%;
            height:100%;
            object-fit:contain;
            display:block;
        "
    >
</button>

<button
    onclick="
    confirmPlayFridgeItem(
        'Party Paws Energy',
        'ESSAzLife.Images/PlayModeAssets/Drinks/party-paws-energy.png'
    )
"

    aria-label="Party Paws Energy"

    style="
        position:absolute;
        left:39%;
        top:64%;
        width:65px;
        height:43px;
        padding:0;
        border:none;
        background:transparent;
        cursor:pointer;
        z-index:10;
    "
>
    <img
        src="ESSAzLife.Images/PlayModeAssets/Drinks/party-paws-energy.png"
        alt="Party Paws Energy"

        style="
            width:100%;
            height:100%;
            object-fit:contain;
            display:block;
        "
    >
</button>

${(() => {

    const today =
        new Date();

    const startDate =
        new Date(2026, 9, 1);

    const endDate =
        new Date(2026, 10, 30, 23, 59, 59);

    return (
        today >= startDate &&
        today <= endDate
    );

})() ? `

<button
    onclick="
    confirmPlayFridgeItem(
        'Apple Cider',
        'ESSAzLife.Images/PlayModeAssets/Drinks/apple-cider.png'
    )
"

    aria-label="Apple Cider"

    style="
        position:absolute;
        left:48%;
        top:63%;
        width:65px;
        height:55px;
        padding:0;
        border:none;
        background:transparent;
        cursor:pointer;
        z-index:10;
    "
>
    <img
        src="ESSAzLife.Images/PlayModeAssets/Drinks/apple-cider.png"
        alt="Apple Cider"

        style="
            width:100%;
            height:100%;
            object-fit:contain;
            display:block;
        "
    >
</button>

` : ""}


${(() => {

    const today =
        new Date();

    const startDate =
        new Date(2026, 9, 1);

    const endDate =
        new Date(2026, 10, 30, 23, 59, 59);

    return (
        today >= startDate &&
        today <= endDate
    );

})() ? `

<button
    onclick="
    confirmPlayFridgeItem(
        'Pumpkin Spice',
        'ESSAzLife.Images/PlayModeAssets/Drinks/pumpkin-spice.png'
    )
"

    aria-label="Pumpkin Spice"

    style="
        position:absolute;
        left:54%;
        top:63%;
        width:65px;
        height:55px;
        padding:0;
        border:none;
        background:transparent;
        cursor:pointer;
        z-index:10;
    "
>
    <img
        src="ESSAzLife.Images/PlayModeAssets/Drinks/pumpkin-spice.png"
        alt="Pumpkin Spice"

        style="
            width:100%;
            height:100%;
            object-fit:contain;
            display:block;
        "
    >
</button>

` : ""}

<button
   onclick="
    confirmPlayFridgeItem(
        'Banana Disks',
        'ESSAzLife.Images/PlayModeAssets/Food/banana-disks.png'
    )
"

    aria-label="Banana Disks"

    style="
        position:absolute;
        left:26%;
        top:40%;
        width:80px;
        height:70px;
        padding:0;
        border:none;
        background:transparent;
        cursor:pointer;
        z-index:10;
    "
>
    <img
        src="ESSAzLife.Images/PlayModeAssets/Food/banana-disks.png"
        alt="Banana Disks"

        style="
            width:100%;
            height:100%;
            object-fit:contain;
            display:block;
        "
    >
</button>

<button
    onclick="
    confirmPlayFridgeItem(
        'Beef Yarn',
        'ESSAzLife.Images/PlayModeAssets/Food/beef-yarn.png'
    )
"

    aria-label="Beef Yarn"

    style="
        position:absolute;
        left:36%;
        top:40%;
        width:80px;
        height:70px;
        padding:0;
        border:none;
        background:transparent;
        cursor:pointer;
        z-index:10;
    "
>
    <img
        src="ESSAzLife.Images/PlayModeAssets/Food/beef-yarn.png"
        alt="Beef Yarn"

        style="
            width:100%;
            height:100%;
            object-fit:contain;
            display:block;
        "
    >
</button>

<button
    onclick="
    confirmPlayFridgeItem(
        'Blueberry Bites',
        'ESSAzLife.Images/PlayModeAssets/Food/blueberry-bites.png'
    )
"

    aria-label="Blueberry Bites"

    style="
        position:absolute;
        left:46%;
        top:40%;
        width:80px;
        height:70px;
        padding:0;
        border:none;
        background:transparent;
        cursor:pointer;
        z-index:10;
    "
>
    <img
        src="ESSAzLife.Images/PlayModeAssets/Food/blueberry-bites.png"
        alt="Blueberry Bites"

        style="
            width:100%;
            height:100%;
            object-fit:contain;
            display:block;
        "
    >
</button>

<button
   onclick="
    confirmPlayFridgeItem(
        &quot;Gizm-o's&quot;,
        'ESSAzLife.Images/PlayModeAssets/Food/gizm-os.png'
    )
"

    aria-label="Gizm-os"

    style="
        position:absolute;
        left:57%;
        top:39%;
        width:80px;
        height:70px;
        padding:0;
        border:none;
        background:transparent;
        cursor:pointer;
        z-index:10;
    "
>
    <img
        src="ESSAzLife.Images/PlayModeAssets/Food/gizm-os.png"
        alt="Gizm-os"

        style="
            width:100%;
            height:100%;
            object-fit:contain;
            display:block;
        "
    >
</button>

<button
    onclick="
    confirmPlayFridgeItem(
        'PB Chicken & Rice',
        'ESSAzLife.Images/PlayModeAssets/Food/pb-chicken-rice.png'
    )
"

    aria-label="PB Chicken & Rice"

    style="
        position:absolute;
        left:25%;
        top:50%;
        width:80px;
        height:70px;
        padding:0;
        border:none;
        background:transparent;
        cursor:pointer;
        z-index:10;
    "
>
    <img
        src="ESSAzLife.Images/PlayModeAssets/Food/pb-chicken-rice.png"
        alt="PB Chicken & Rice"

        style="
            width:100%;
            height:100%;
            object-fit:contain;
            display:block;
        "
    >
</button>

<button
    onclick="
    confirmPlayFridgeItem(
        'Rainbow Rocks',
        'ESSAzLife.Images/PlayModeAssets/Food/rainbow-rocks.png'
    )
"

    aria-label="Rainbow Rocks"

    style="
        position:absolute;
        left:35%;
        top:50%;
        width:80px;
        height:70px;
        padding:0;
        border:none;
        background:transparent;
        cursor:pointer;
        z-index:10;
    "
>
    <img
        src="ESSAzLife.Images/PlayModeAssets/Food/rainbow-rocks.png"
        alt="Rainbow Rocks"

        style="
            width:100%;
            height:100%;
            object-fit:contain;
            display:block;
        "
    >
</button>

<button
    onclick="
    confirmPlayFridgeItem(
        'Rocks Classic',
        'ESSAzLife.Images/PlayModeAssets/Food/rocks-classic.png'
    )
"

    aria-label="Rocks Classic"

    style="
        position:absolute;
        left:45%;
        top:50%;
        width:80px;
        height:70px;
        padding:0;
        border:none;
        background:transparent;
        cursor:pointer;
        z-index:10;
    "
>
    <img
        src="ESSAzLife.Images/PlayModeAssets/Food/rocks-classic.png"
        alt="Rocks Classic"

        style="
            width:100%;
            height:100%;
            object-fit:contain;
            display:block;
        "
    >
</button>

<button
    onclick="
    confirmPlayFridgeItem(
        'Spinach Slices',
        'ESSAzLife.Images/PlayModeAssets/Food/spinach-slices.png'
    )
"

    aria-label="Spinach Slices"

    style="
        position:absolute;
        left:55%;
        top:50%;
        width:80px;
        height:70px;
        padding:0;
        border:none;
        background:transparent;
        cursor:pointer;
        z-index:10;
    "
>
    <img
        src="ESSAzLife.Images/PlayModeAssets/Food/spinach-slices.png"
        alt="Spinach Slices"

        style="
            width:100%;
            height:100%;
            object-fit:contain;
            display:block;
        "
    >
</button>
            <button
                onclick="
                    document
                        .getElementById(
                            'play-fridge-overlay'
                        )
                        .remove()
                "

                aria-label="Close fridge"

                style="
                   position:fixed;
top:12px;
right:12px;
                    width:42px;
                    height:42px;
                    border:none;
                    border-radius:50%;
                    background:rgba(0,0,0,.8);
                    color:white;
                    font-size:24px;
                    font-weight:bold;
                    cursor:pointer;
                "
            >
                ×
            </button>

        </div>

    `;


    const parent =
        document.fullscreenElement ||
        document.body;


    parent.appendChild(
        overlay
    );
}

const playFridgeItems = [

    {
        name: "ESSA Milk",
        image:
            "ESSAzLife.Images/PlayModeAssets/Drinks/essa-milk.png"
    },

    {
        name: "Water for ESSAs",
        image:
            "ESSAzLife.Images/PlayModeAssets/Drinks/water-for-essas.png"
    },

    {
        name: "Lemonade",
        image:
            "ESSAzLife.Images/PlayModeAssets/Drinks/lemonade.png"
    },

    {
        name: "Orange Soda",
        image:
            "ESSAzLife.Images/PlayModeAssets/Drinks/orange-soda.png"
    },

    {
        name: "Strawberry Soda",
        image:
            "ESSAzLife.Images/PlayModeAssets/Drinks/strawberry-soda.png"
    },

    {
        name: "ESSA Doo",
        image:
            "ESSAzLife.Images/PlayModeAssets/Drinks/essa-doo.png"
    },

    {
        name: "Banana Disks",
        image:
            "ESSAzLife.Images/PlayModeAssets/Food/banana-disks.png"
    },

    {
        name: "Beef Yarn",
        image:
            "ESSAzLife.Images/PlayModeAssets/Food/beef-yarn.png"
    },

    {
        name: "Blueberry Bites",
        image:
            "ESSAzLife.Images/PlayModeAssets/Food/blueberry-bites.png"
    },

    {
        name: "Gizm-o's",
        image:
            "ESSAzLife.Images/PlayModeAssets/Food/gizm-os.png"
    },

    {
        name: "PB Chicken & Rice",
        image:
            "ESSAzLife.Images/PlayModeAssets/Food/pb-chicken-rice.png"
    },

    {
        name: "Rainbow Rocks",
        image:
            "ESSAzLife.Images/PlayModeAssets/Food/rainbow-rocks.png"
    },

    {
        name: "Rocks Classic",
        image:
            "ESSAzLife.Images/PlayModeAssets/Food/rocks-classic.png"
    },

    {
        name: "Spinach Slices",
        image:
            "ESSAzLife.Images/PlayModeAssets/Food/spinach-slices.png"
    },

    {
        name: "ESSAccino",
        image:
            "ESSAzLife.Images/PlayModeAssets/Drinks/essa-ccino.png"
    },

    {
        name: "Hot Cocoa",
        image:
            "ESSAzLife.Images/PlayModeAssets/Drinks/hot-cocoa.png"
    },

    {
        name: "Party Paws Energy",
        image:
            "ESSAzLife.Images/PlayModeAssets/Drinks/party-paws-energy.png"
    },

    {
        name: "Apple Cider",
        image:
            "ESSAzLife.Images/PlayModeAssets/Drinks/apple-cider.png"
    },

    {
        name: "Pumpkin Spice",
        image:
            "ESSAzLife.Images/PlayModeAssets/Drinks/pumpkin-spice.png"
    }

];

function browsePlayFridgeItem(
    currentItemName,
    direction
) {

    const currentIndex =
        playFridgeItems.findIndex(
            function(item) {
                return (
                    item.name ===
                    currentItemName
                );
            }
        );


    if (currentIndex === -1) {
        return;
    }


    let newIndex =
        currentIndex + direction;


    if (newIndex < 0) {
        newIndex =
            playFridgeItems.length - 1;
    }


    if (
        newIndex >=
        playFridgeItems.length
    ) {
        newIndex = 0;
    }


    const newItem =
        playFridgeItems[newIndex];


    confirmPlayFridgeItem(
        newItem.name,
        newItem.image
    );
}

function confirmPlayFridgeItem(itemName, imagePath) {

    const existing =
        document.getElementById(
            "play-fridge-confirm-overlay"
        );

    if (existing) {
        existing.remove();
    }


    const overlay =
        document.createElement("div");

    overlay.id =
        "play-fridge-confirm-overlay";


    overlay.style.cssText = `
        position:fixed;
        inset:0;
        background:rgba(0,0,0,.55);
        display:flex;
        align-items:center;
        justify-content:center;
        z-index:100000;
        padding:20px;
        box-sizing:border-box;
    `;


    overlay.innerHTML = `
        <div
            style="
            position:relative;
                width:min(340px, 90vw);
                background:white;
                border-radius:24px;
                padding:25px;
                box-sizing:border-box;
                text-align:center;
                box-shadow:
                    0 18px 50px
                    rgba(0,0,0,.35); 
            "
        >

            <button
        onclick="
    browsePlayFridgeItem(
        this.dataset.itemName,
        -1
    )
"
data-item-name="${itemName}"
    aria-label="Previous fridge item"
    style="
        position:absolute;
        left:15px;
        top:50%;
        transform:translateY(-50%);
        width:44px;
        height:44px;
        border:none;
        border-radius:50%;
        background:#eef3f4;
        color:#26343b;
        font-size:28px;
        font-weight:bold;
        cursor:pointer;
    "
>
    ‹
</button>


<button
    onclick="
    browsePlayFridgeItem(
        this.dataset.itemName,
        1
    )
"
data-item-name="${itemName}"
    aria-label="Next fridge item"
    style="
        position:absolute;
        right:15px;
        top:50%;
        transform:translateY(-50%);
        width:44px;
        height:44px;
        border:none;
        border-radius:50%;
        background:#eef3f4;
        color:#26343b;
        font-size:28px;
        font-weight:bold;
        cursor:pointer;
    "
>
    ›

                </button>

<img
    src="${imagePath}"
    alt="${itemName}"
    style="
        display:block;
        width:180px;
                    height:180px;
                    object-fit:contain;
                    margin:0 auto 10px;
                "
            >

            <h2
                style="
                    margin:5px 0;
                    color:#26343b;
                "
            >
                ${itemName}
            </h2>

            <p
                style="
                    margin:10px 0 20px;
                    font-size:20px;
                    font-weight:600;
                    color:#26343b;
                "
            >
                This one?
            </p>


            <div
                style="
                    display:flex;
                    gap:12px;
                    justify-content:center;
                "
            >

               <button
    class="play-action-button primary"
    data-item-name="${itemName}"
    data-image-path="${imagePath}"
    onclick="
        choosePlayFridgeItem(
            this.dataset.itemName,
            this.dataset.imagePath
        )
    "
>
    Yes
</button>

                <button
                    class="play-action-button"
                    onclick="
                        document
                            .getElementById(
                                'play-fridge-confirm-overlay'
                            )
                            .remove()
                    "
                >
                    No
                </button>

            </div>

        </div>
    `;


    const parent =
        document.fullscreenElement ||
        document.body;

    parent.appendChild(overlay);
}

function choosePlayFridgeItem(
    itemName,
    imagePath
) {

    if (
        playFridgeFeedingBasket.length > 0
    ) {

        const essaId =
            playFridgeFeedingBasket[0]
                .essaId;


        playFridgeFeedingBasket.push({
            essaId: essaId,
            itemName: itemName,
            imagePath: imagePath
        });


        const confirmOverlay =
            document.getElementById(
                "play-fridge-confirm-overlay"
            );

        if (confirmOverlay) {
            confirmOverlay.remove();
        }


        showPlayFridgeAddAnotherPopup(
            essaId
        );

        return;
    }


    openPlayFridgeEssaChooser(
        itemName,
        imagePath
    );
}

function openPlayFridgeEssaChooser(
    itemName,
    imagePath
) {

    const playData =
    getSavedPlayData();


const houseData =
    getSavedPlayHouseData();


const availableEssas =
    getAllPlayableEssas().filter(
        function(essa) {

            const isUnlocked =
                playData
                    .unlockedEssaIds
                    .includes(
                        essa.id
                    );


            const isInKennel =
                houseData
                    .essaRooms[
                        essa.id
                    ] ===
                "kennel";


            return (
                isUnlocked &&
                !isInKennel
            );
        }
    );


    const existing =
        document.getElementById(
            "play-fridge-essa-chooser"
        );


    if (existing) {
        existing.remove();
    }


    const overlay =
        document.createElement("div");


    overlay.id =
        "play-fridge-essa-chooser";


    overlay.style.cssText = `
        position:fixed;
        inset:0;
        background:rgba(0,0,0,.65);
        display:flex;
        align-items:center;
        justify-content:center;
        z-index:100001;
        padding:20px;
        box-sizing:border-box;
    `;


    const cards =
        availableEssas
            .map(
                function(essa) {

                    return `

                        <button
                            class="play-action-button"

                            data-essa-id="${essa.id}"
                            data-item-name="${itemName}"
data-image-path="${imagePath}"

                          onclick="
    console.log(
        'ABOUT TO START FEEDING'
    );

    startPlayFridgeFeeding(
        this.dataset.essaId,
        this.dataset.itemName,
        this.dataset.imagePath
    );
"

                            style="
                                background:white;
                                padding:14px;
                                border-radius:18px;
                                cursor:pointer;
                            "
                        >

                            ${
                                makePlayableEssaVisual(
                                    essa,
                                    false
                                )
                            }

                            <div
                                style="
                                    margin-top:8px;
                                    font-weight:bold;
                                    color:#26343b;
                                "
                            >
                                ${
                                    escapeHTML(
                                        essa.name
                                    )
                                }
                            </div>

                        </button>

                    `;
                }
            )
            .join("");


    overlay.innerHTML = `

        <div
            style="
                position:relative;
                width:min(650px, 90vw);
                max-height:80vh;
                overflow-y:auto;
                background:white;
                border-radius:24px;
                padding:25px;
                box-sizing:border-box;
                text-align:center;
                box-shadow:
                    0 18px 50px
                    rgba(0,0,0,.35);
            "
        >

            <button
                onclick="
                    document
                        .getElementById(
                            'play-fridge-essa-chooser'
                        )
                        .remove()
                "

                aria-label="Close"

                style="
                    position:absolute;
                    top:15px;
                    right:15px;
                    width:40px;
                    height:40px;
                    border:none;
                    border-radius:50%;
                    background:#eef3f4;
                    color:#26343b;
                    font-size:22px;
                    font-weight:bold;
                    cursor:pointer;
                "
            >
                ×
            </button>


            <img
                src="${imagePath}"
                alt="${itemName}"

                style="
                    width:100px;
                    height:100px;
                    object-fit:contain;
                "
            >


            <h2
                style="
                    margin:5px 45px 5px;
                    color:#26343b;
                "
            >
                Who gets the
                ${escapeHTML(itemName)}?
            </h2>


            <p
                style="
                    margin:5px 0 20px;
                    color:#68777b;
                "
            >
                Choose an ESSA
            </p>


            <div
                style="
                    display:grid;
                    grid-template-columns:
                        repeat(
                            auto-fit,
                            minmax(150px, 1fr)
                        );
                    gap:14px;
                "
            >
                ${cards}
            </div>

        </div>

    `;


    const parent =
        document.fullscreenElement ||
        document.body;


    parent.appendChild(
        overlay
    );
}

function openPlayBathEssaChooser() {

    const playData =
        getSavedPlayData();


    const availableEssas =
    getAllPlayableEssas().filter(
            function(essa) {

                return (
                    playData
                        .unlockedEssaIds
                        .includes(
                            essa.id
                        )
                );
            }
        );


    const existing =
        document.getElementById(
            "play-bath-essa-chooser"
        );

    if (existing) {
        existing.remove();
    }


    const overlay =
        document.createElement("div");


    overlay.id =
        "play-bath-essa-chooser";


    overlay.style.cssText = `
        position:fixed;
        inset:0;
        background:rgba(0,0,0,.55);
        display:flex;
        align-items:center;
        justify-content:center;
        z-index:99999;
        padding:20px;
        box-sizing:border-box;
    `;


    const cards =
        availableEssas
            .map(
                function(essa) {

                    return `

                        <button
                            type="button"

                            onclick="
                                startPlayBathMode(
                                    '${essa.id}'
                                )
                            "

                            style="
                                width:140px;
                                padding:14px;
                                border:1px solid #dbe5e7;
                                border-radius:18px;
                                background:white;
                                cursor:pointer;
                            "
                        >

                            ${
                                makePlayableEssaVisual(
                                    essa,
                                    false
                                )
                            }

                            <div
                                style="
                                    margin-top:8px;
                                    color:#17313a;
                                    font-weight:bold;
                                "
                            >
                                ${
                                    escapeHTML(
                                        essa.name
                                    )
                                }
                            </div>

                        </button>

                    `;
                }
            )
            .join("");


    overlay.innerHTML = `

        <div
            style="
                width:min(650px, 92vw);
                max-height:85vh;
                overflow:auto;
                padding:26px;
                background:white;
                border-radius:24px;
                text-align:center;
                box-shadow:
                    0 15px 40px
                    rgba(0,0,0,.3);
            "
        >

            <h2
                style="
                    margin-top:0;
                    color:#17313a;
                "
            >
                🛁 Who needs a bath?
            </h2>


            <div
                style="
                    display:flex;
                    flex-wrap:wrap;
                    justify-content:center;
                    gap:14px;
                    margin-top:20px;
                "
            >
                ${cards}
            </div>


            <button
                class="play-action-button"

                onclick="
                    document
                        .getElementById(
                            'play-bath-essa-chooser'
                        )
                        .remove()
                "

                style="
                    margin-top:22px;
                "
            >
                Cancel
            </button>

        </div>
    `;


    (
        document.fullscreenElement ||
        document.body
    ).appendChild(
        overlay
    );
}

function startPlayBathMode(
    essaId
) {

    const essa =
        getAnyPlayableEssaById(
            essaId
        );


    if (!essa) {
        return;
    }

    window.playBathState = {
    essaId: essaId,
    stage: "rinse",
    rinseProgress: 0,
    secondRinseProgress: 0,
};


    const chooser =
        document.getElementById(
            "play-bath-essa-chooser"
        );

    if (chooser) {
        chooser.remove();
    }


    const existing =
        document.getElementById(
            "play-bath-mode-overlay"
        );

    if (existing) {
        existing.remove();
    }


    const overlay =
        document.createElement("div");


    overlay.id =
        "play-bath-mode-overlay";


    overlay.style.cssText = `
        position:fixed;
        inset:0;
        background:rgba(0,0,0,.75);
        display:flex;
        align-items:center;
        justify-content:center;
        z-index:99999;
        padding:12px;
        box-sizing:border-box;
    `;


    overlay.innerHTML = `

        <div
            id="play-bath-mode-scene"

            style="
                position:relative;

                width:min(
                    1200px,
                    96vw
                );

                aspect-ratio:12 / 7;

                max-height:94vh;

                overflow:hidden;

                background-image:
                    url(
                        'ESSAzLife.Images/PlayModeAssets/Bath/bathtime.png'
                    );

                background-size:contain;
background-position:center;
background-repeat:no-repeat;
background-color:#b9dddd;
                border-radius:20px;

                box-shadow:
                    0 15px 50px
                    rgba(0,0,0,.45);
            "
        >


            <button
                type="button"

                onclick="
                    document
                        .getElementById(
                            'play-bath-mode-overlay'
                        )
                        .remove()
                "

                aria-label="Close Bath Mode"

                style="
                    position:absolute;
                    top:14px;
                    right:14px;
                    width:44px;
                    height:44px;
                    border:none;
                    border-radius:50%;
                    background:white;
                    color:#17313a;
                    font-size:22px;
                    font-weight:bold;
                    cursor:pointer;
                    z-index:200;
                "
            >
                ×
            </button>


            <div
                id="play-bath-essa"

                data-bath-essa-id="${essa.id}"

                style="
                    position:absolute;

                    left:50%;
                    top:40%;

                    transform:
                        translate(
                            -50%,
                            -50%
                        );

                    width:230px;

                    z-index:20;
                "
            >

                ${
                    makePlayableEssaVisual(
                        essa,
                        false
                    )
                }

            </div>
        
           <button
    type="button"
   onclick="
    showPlayBathInstructions()
"
    aria-label="Bath instructions"

    style="
        position:absolute;
        top:14px;
        right:68px;

        width:44px;
        height:44px;

        padding:0;
        border:none;
        border-radius:50%;

        background:white;
        color:#17313a;

        font-size:24px;
        font-weight:bold;

        cursor:pointer;
        z-index:200;
    "
>
    ?
</button>

            <div
    id="play-bath-shower-head"

    onpointerdown="
    startPlayBathShowerDrag(event)
"

    style="
        position:absolute;
        left:28%;
        top:8%;
        width:95px;
        z-index:50;
        cursor:grab;
        touch-action:none;
    "
>

    <img
        src="ESSAzLife.Images/PlayModeAssets/Bath/shower-head.png"
        alt="Shower head"
        draggable="false"

        style="
            display:block;
            width:100%;
            height:auto;
            object-fit:contain;
            pointer-events:none;
        "
    >

</div>


        </div>

    `;


    (
        document.fullscreenElement ||
        document.body
    ).appendChild(
        overlay
    );
}

function showPlayBathInstructions() {

    const existing =
        document.getElementById(
            "play-bath-instructions-popup"
        );

    if (existing) {
        existing.remove();
    }


    const popup =
        document.createElement("div");


    popup.id =
        "play-bath-instructions-popup";


    popup.style.cssText = `
        position:absolute;
        inset:0;
        display:flex;
        align-items:center;
        justify-content:center;
        background:rgba(0,0,0,.45);
        z-index:500;
    `;


    popup.innerHTML = `

        <div
            style="
                width:min(420px, 80%);
                padding:24px;
                background:white;
                border-radius:20px;
                text-align:center;
                color:#17313a;
                box-shadow:
                    0 10px 35px
                    rgba(0,0,0,.3);
            "
        >

            <h2 style="margin-top:0;">
                🛁 BathTime
            </h2>

            <p>
                <strong>Step 1:</strong>
                Rinse with the shower head.
            </p>

            <p>
                <strong>Step 2:</strong>
                Tap the Group of Soaps. Pick up a bar of soap and swipe it over your ESSA.
            </p>

            <p>
                <strong>Step 3:</strong>
                Rinse the bubbles off, then Click Next to go to the fur drying station.
            </p>

            <button
                class="play-action-button primary"

                onclick="
                    document
                        .getElementById(
                            'play-bath-instructions-popup'
                        )
                        .remove()
                "
            >
                Got it!
            </button>

        </div>

    `;


    const bathScene =
        document.getElementById(
            "play-bath-mode-scene"
        );


    if (bathScene) {

        bathScene.appendChild(
            popup
        );
    }
}

function startPlayBathShowerDrag(
    event
) {

    const showerHead =
        event.currentTarget;


    const bathScene =
        document.getElementById(
            "play-bath-mode-scene"
        );


    if (
        !showerHead ||
        !bathScene
    ) {
        return;
    }


    event.preventDefault();


    const showerRect =
        showerHead
            .getBoundingClientRect();


    const sceneRect =
        bathScene
            .getBoundingClientRect();


    const grabOffsetX =
        event.clientX -
        showerRect.left;

    const grabOffsetY =
        event.clientY -
        showerRect.top;


    showerHead.style.left =
        (
            showerRect.left -
            sceneRect.left
        ) + "px";

    showerHead.style.top =
        (
            showerRect.top -
            sceneRect.top
        ) + "px";

    showerHead.style.right =
        "auto";

    showerHead.style.bottom =
        "auto";

    showerHead.style.transform =
        "none";

    showerHead.style.zIndex =
        "150";


    showerHead.setPointerCapture(
        event.pointerId
    );


    function moveShower(
        moveEvent
    ) {

        const currentSceneRect =
            bathScene
                .getBoundingClientRect();


        let newLeft =
            moveEvent.clientX -
            currentSceneRect.left -
            grabOffsetX;


        let newTop =
            moveEvent.clientY -
            currentSceneRect.top -
            grabOffsetY;

            const bathEssa =
    document.getElementById(
        "play-bath-essa"
    );


if (
    bathEssa &&
    window.playBathState &&
    (
    window.playBathState.stage ===
        "rinse" ||
    window.playBathState.stage ===
        "second-rinse"
)
) {

    const showerBox =
        showerHead
            .getBoundingClientRect();

    const essaBox =
        bathEssa
            .getBoundingClientRect();


    const touchingEssa =
        showerBox.right >=
            essaBox.left &&

        showerBox.left <=
            essaBox.right &&

        showerBox.bottom >=
            essaBox.top &&

        showerBox.top <=
            essaBox.bottom;


  if (touchingEssa) {

    if (
        window.playBathState.stage ===
            "rinse"
    ) {

        window.playBathState
            .rinseProgress =
            Math.min(
                100,
                window.playBathState
                    .rinseProgress + 0.5
            );


        updatePlayBathRinseProgress();
    }


    if (
        window.playBathState.stage ===
            "second-rinse"
    ) {

        window.playBathState
            .secondRinseProgress =
            Math.min(
                100,
                window.playBathState
                    .secondRinseProgress + 0.5
            );


        updatePlayBathSecondRinseProgress();
    }
}
}


        const maxLeft =
            currentSceneRect.width -
            showerHead.offsetWidth;

        const maxTop =
            currentSceneRect.height -
            showerHead.offsetHeight;


        newLeft =
            Math.max(
                0,
                Math.min(
                    maxLeft,
                    newLeft
                )
            );


        newTop =
            Math.max(
                0,
                Math.min(
                    maxTop,
                    newTop
                )
            );


        showerHead.style.left =
            newLeft + "px";

        showerHead.style.top =
            newTop + "px";
    }


    function stopShowerDrag() {

        showerHead.removeEventListener(
            "pointermove",
            moveShower
        );

        showerHead.removeEventListener(
            "pointerup",
            stopShowerDrag
        );

        showerHead.removeEventListener(
            "pointercancel",
            stopShowerDrag
        );
    }


    showerHead.addEventListener(
        "pointermove",
        moveShower
    );

    showerHead.addEventListener(
        "pointerup",
        stopShowerDrag
    );

    showerHead.addEventListener(
        "pointercancel",
        stopShowerDrag
    );
}

function updatePlayBathRinseProgress() {

    const state =
        window.playBathState;


    if (!state) {
        return;
    }


    let progress =
        document.getElementById(
            "play-bath-rinse-progress"
        );


    if (!progress) {

        progress =
            document.createElement(
                "div"
            );


        progress.id =
            "play-bath-rinse-progress";


        progress.style.cssText = `
            position:absolute;
            left:50%;
            bottom:4%;
            transform:translateX(-50%);
            width:280px;
            max-width:70%;
            padding:10px 14px;
            background:rgba(255,255,255,.92);
            border-radius:16px;
            text-align:center;
            color:#17313a;
            font-weight:bold;
            z-index:180;
        `;


        const scene =
            document.getElementById(
                "play-bath-mode-scene"
            );


        if (scene) {
            scene.appendChild(
                progress
            );
        }
    }


    progress.innerHTML = `

        <div>
            ${
                state.rinseProgress >= 100
                    ? "💦 Rinse Complete!"
                    : "🚿 Rinsing..."
            }
        </div>

        <div
            style="
                height:12px;
                margin-top:7px;
                background:#dbe5e7;
                border-radius:999px;
                overflow:hidden;
            "
        >

            <div
                style="
                    width:${
                        state.rinseProgress
                    }%;
                    height:100%;
                    background:#4fb5ae;
                    border-radius:999px;
                "
            ></div>

        </div>

    `;


   if (
    state.rinseProgress >= 100
) {

    state.stage =
        "soap";

    showPlayBathSoaps();
}
}

function showPlayBathSoaps() {

    const scene =
        document.getElementById(
            "play-bath-mode-scene"
        );


    if (!scene) {
        return;
    }


    if (
        document.getElementById(
            "play-bath-soaps"
        )
    ) {
        return;
    }


    const soaps =
        document.createElement(
            "div"
        );


    soaps.id =
        "play-bath-soaps";


   soaps.style.cssText = `
    position:absolute;
    top:9%;
    right:20%;

    display:grid;
    grid-template-columns:
        repeat(2, 80px);

    gap:10px;
    column-gap:2px;
row-gap:4px;

    z-index:100;
`;


    soaps.innerHTML = `

        <img
            src="ESSAzLife.Images/PlayModeAssets/Bath/blue-soap.png"
            onpointerdown="
    startPlayBathSoapDrag(event)
"
            alt="Blue soap"
            draggable="false"
            style="
                width:80px;
                height:auto;
                object-fit:contain;
                cursor:grab;
touch-action:none;
            "
        >

        <img
            src="ESSAzLife.Images/PlayModeAssets/Bath/pink-soap.png"
            onpointerdown="
    startPlayBathSoapDrag(event)
"
            alt="Pink soap"
            draggable="false"
            style="
                width:80px;
                height:auto;
                object-fit:contain;
                cursor:grab;
touch-action:none;
            "
        >

        <img
            src="ESSAzLife.Images/PlayModeAssets/Bath/purple-soap.png"
            onpointerdown="
    startPlayBathSoapDrag(event)
"
            alt="Purple soap"
            draggable="false"
            style="
                width:80px;
                height:auto;
                object-fit:contain;
                transform:translateY(-35px);
                cursor:grab;
touch-action:none;
            "
        >

        <img
            src="ESSAzLife.Images/PlayModeAssets/Bath/yellow-soap.png"
            onpointerdown="
    startPlayBathSoapDrag(event)
"
            alt="Yellow soap"
            draggable="false"
            style="
               width:80px;
                height:auto;
                object-fit:contain;
                transform:translateY(-35px);
                cursor:grab;
touch-action:none;
            "
        >

    `;


    scene.appendChild(
        soaps
    );
}

function startPlayBathSoapDrag(
    event
) {

    if (
        !window.playBathState ||
        window.playBathState.stage !==
            "soap"
    ) {
        return;
    }


    const soap =
        event.currentTarget;

    const scene =
        document.getElementById(
            "play-bath-mode-scene"
        );

    const bathEssa =
        document.getElementById(
            "play-bath-essa"
        );


    if (
        !soap ||
        !scene ||
        !bathEssa
    ) {
        return;
    }


    event.preventDefault();


    if (
        typeof window.playBathState
            .soapProgress !==
        "number"
    ) {

        window.playBathState
            .soapProgress = 0;
    }


    const soapRect =
        soap.getBoundingClientRect();

    const sceneRect =
        scene.getBoundingClientRect();


    const grabOffsetX =
        event.clientX -
        soapRect.left;

    const grabOffsetY =
        event.clientY -
        soapRect.top;


    /*
        Move the chosen soap out of
        the grid so it can travel
        freely around BathTime.
    */

    scene.appendChild(
        soap
    );


    soap.style.position =
        "absolute";

    soap.style.left =
        (
            soapRect.left -
            sceneRect.left
        ) + "px";

    soap.style.top =
        (
            soapRect.top -
            sceneRect.top
        ) + "px";

    soap.style.right =
        "auto";

    soap.style.bottom =
        "auto";

    soap.style.transform =
        "none";

    soap.style.zIndex =
        "160";


    soap.setPointerCapture(
        event.pointerId
    );


    function moveSoap(
        moveEvent
    ) {

        const currentSceneRect =
            scene.getBoundingClientRect();


        let newLeft =
            moveEvent.clientX -
            currentSceneRect.left -
            grabOffsetX;


        let newTop =
            moveEvent.clientY -
            currentSceneRect.top -
            grabOffsetY;


        newLeft =
            Math.max(
                0,
                Math.min(
                    currentSceneRect.width -
                        soap.offsetWidth,
                    newLeft
                )
            );


        newTop =
            Math.max(
                0,
                Math.min(
                    currentSceneRect.height -
                        soap.offsetHeight,
                    newTop
                )
            );


        soap.style.left =
            newLeft + "px";

        soap.style.top =
            newTop + "px";


        const soapBox =
            soap.getBoundingClientRect();

        const essaBox =
            bathEssa.getBoundingClientRect();


        const touchingEssa =
            soapBox.right >=
                essaBox.left &&

            soapBox.left <=
                essaBox.right &&

            soapBox.bottom >=
                essaBox.top &&

            soapBox.top <=
                essaBox.bottom;


        if (
            touchingEssa &&
            window.playBathState.stage ===
                "soap"
        ) {

            window.playBathState
                .soapProgress =
                Math.min(
                    100,
                    window.playBathState
                        .soapProgress +
                        0.35
                );


            updatePlayBathSoapProgress();
        }
    }


    function stopSoapDrag() {

        soap.removeEventListener(
            "pointermove",
            moveSoap
        );

        soap.removeEventListener(
            "pointerup",
            stopSoapDrag
        );

        soap.removeEventListener(
            "pointercancel",
            stopSoapDrag
        );
    }


    soap.addEventListener(
        "pointermove",
        moveSoap
    );

    soap.addEventListener(
        "pointerup",
        stopSoapDrag
    );

    soap.addEventListener(
        "pointercancel",
        stopSoapDrag
    );
}

function updatePlayBathSoapProgress() {

    const state =
        window.playBathState;


    if (!state) {
        return;
    }


    const progress =
        document.getElementById(
            "play-bath-rinse-progress"
        );


    if (!progress) {
        return;
    }


    progress.innerHTML = `

        <div>
            ${
                state.soapProgress >= 100
                    ? "🫧 All Soaped Up!"
                    : "🧼 Soaping..."
            }
        </div>

        <div
            style="
                height:12px;
                margin-top:7px;
                background:#dbe5e7;
                border-radius:999px;
                overflow:hidden;
            "
        >

            <div
                style="
                    width:${
                        state.soapProgress
                    }%;
                    height:100%;
                    background:#4fb5ae;
                    border-radius:999px;
                "
            ></div>

        </div>

    `;


    if (
        state.soapProgress >= 100
    ) {

        state.stage =
            "second-rinse";
    }

    showPlayBathBubbles();
}

function showPlayBathBubbles() {

    const bathEssa =
        document.getElementById(
            "play-bath-essa"
        );


    if (!bathEssa) {
        return;
    }


    if (
        document.getElementById(
            "play-bath-bubbles"
        )
    ) {
        return;
    }


    const bubbles =
        document.createElement(
            "div"
        );


    bubbles.id =
        "play-bath-bubbles";


    bubbles.style.cssText = `
        position:absolute;
        inset:0;
        z-index:30;
        pointer-events:none;
    `;


    bubbles.innerHTML = `

        <span style="
            position:absolute;
            left:10%;
            top:18%;
            font-size:42px;
        ">🫧</span>

        <span style="
            position:absolute;
            right:5%;
            top:30%;
            font-size:34px;
        ">🫧</span>

        <span style="
            position:absolute;
            left:22%;
            top:48%;
            font-size:38px;
        ">🫧</span>

        <span style="
            position:absolute;
            right:18%;
            top:55%;
            font-size:46px;
        ">🫧</span>

        <span style="
            position:absolute;
            left:38%;
            top:68%;
            font-size:32px;
        ">🫧</span>

    `;


    bathEssa.appendChild(
        bubbles
    );
}

function updatePlayBathSecondRinseProgress() {

    const state =
        window.playBathState;


    if (!state) {
        return;
    }


    const progress =
        document.getElementById(
            "play-bath-rinse-progress"
        );


    if (!progress) {
        return;
    }


    progress.innerHTML = `

        <div>
            ${
                state.secondRinseProgress >= 100
                    ? "✨ All Rinsed Off!"
                    : "🚿 Rinsing Off Bubbles..."
            }
        </div>

        <div
            style="
                height:12px;
                margin-top:7px;
                background:#dbe5e7;
                border-radius:999px;
                overflow:hidden;
            "
        >

            <div
                style="
                    width:${
                        state.secondRinseProgress
                    }%;
                    height:100%;
                    background:#4fb5ae;
                    border-radius:999px;
                "
            ></div>

        </div>

    `;


    if (
        state.secondRinseProgress >= 100
    ) {

        const bubbles =
            document.getElementById(
                "play-bath-bubbles"
            );


        if (bubbles) {
            bubbles.remove();
        }


        state.stage =
            "ready-to-dry";
        showPlayBathNextButton();
    }
}

function showPlayBathNextButton() {

    const progress =
        document.getElementById(
            "play-bath-rinse-progress"
        );


    if (!progress) {
        return;
    }


    if (
        document.getElementById(
            "play-bath-next-button"
        )
    ) {
        return;
    }


    const nextButton =
        document.createElement(
            "button"
        );


    nextButton.id =
        "play-bath-next-button";


    nextButton.type =
        "button";


    nextButton.textContent =
        "Next →";


    nextButton.className =
        "play-action-button primary";


    nextButton.style.cssText = `
        margin-top:10px;
        padding:9px 22px;
        cursor:pointer;
    `;


    nextButton.onclick =
        function() {

            openPlayBathDryingStation();
        };


    progress.appendChild(
        nextButton
    );
}

function openPlayBathDryingStation() {

    const state =
        window.playBathState;


    if (!state) {
        return;
    }


    const essa =
        getAnyPlayableEssaById(
            state.essaId
        );


    const scene =
        document.getElementById(
            "play-bath-mode-scene"
        );


    if (
        !essa ||
        !scene
    ) {
        return;
    }


    state.stage =
        "drying";
    state.dryingProgress = 0;

    scene.style.backgroundImage =
        "url('ESSAzLife.Images/PlayModeAssets/Bath/drying-station.png')";


    scene.innerHTML = `

        <button
            type="button"

            onclick="
                document
                    .getElementById(
                        'play-bath-mode-overlay'
                    )
                    ?.remove()
            "

            aria-label="Close BathTime"

            style="
                position:absolute;
                top:14px;
                right:14px;
                width:48px;
                height:48px;
                padding:0;
                border:none;
                border-radius:50%;
                background:white;
                color:#17313a;
                font-size:24px;
                font-weight:bold;
                cursor:pointer;
                z-index:200;
            "
        >
            ×
        </button>


        <div
            id="play-bath-drying-essa"

            data-bath-essa-id="${essa.id}"

            style="
                position:absolute;
                left:50%;
                top:75%;
                transform:
                    translate(
                        -50%,
                        -50%
                    );
                width:230px;
                z-index:20;
            "
        >

            ${makePlayableEssaVisual(
                essa,
                false
            )}

        </div>

        <div
    id="play-bath-fur-dryer"

    onpointerdown="
        startPlayBathDryerDrag(event)
    "

    style="
        position:absolute;
        left:24%;
        top:25%;
        width:120px;
        z-index:50;
        cursor:grab;
        touch-action:none;
    "
>
    <img
        src="ESSAzLife.Images/PlayModeAssets/Bath/fur-dryer.png"
        alt="Fur dryer"
        draggable="false"

        style="
            display:block;
            width:100%;
            height:auto;
            object-fit:contain;
            pointer-events:none;
        "
    >
</div>

    `;
}

function startPlayBathDryerDrag(
    event
) {

    const dryer =
        event.currentTarget;

    const scene =
        document.getElementById(
            "play-bath-mode-scene"
        );

    const bathEssa =
        document.getElementById(
            "play-bath-drying-essa"
        );

    const state =
        window.playBathState;


    if (
        !dryer ||
        !scene ||
        !bathEssa ||
        !state ||
        state.stage !== "drying"
    ) {
        return;
    }


    event.preventDefault();


    if (
        typeof state.dryingProgress !==
        "number"
    ) {
        state.dryingProgress = 0;
    }


    const dryerRect =
        dryer.getBoundingClientRect();

    const sceneRect =
        scene.getBoundingClientRect();


    const grabOffsetX =
        event.clientX -
        dryerRect.left;

    const grabOffsetY =
        event.clientY -
        dryerRect.top;


    dryer.style.left =
        (
            dryerRect.left -
            sceneRect.left
        ) + "px";

    dryer.style.top =
        (
            dryerRect.top -
            sceneRect.top
        ) + "px";

    dryer.style.right =
        "auto";

    dryer.style.bottom =
        "auto";

    dryer.style.transform =
        "none";

    dryer.style.zIndex =
        "160";


    dryer.setPointerCapture(
        event.pointerId
    );


    function moveDryer(
        moveEvent
    ) {

        const currentSceneRect =
            scene.getBoundingClientRect();


        let newLeft =
            moveEvent.clientX -
            currentSceneRect.left -
            grabOffsetX;


        let newTop =
            moveEvent.clientY -
            currentSceneRect.top -
            grabOffsetY;


        newLeft =
            Math.max(
                0,
                Math.min(
                    currentSceneRect.width -
                        dryer.offsetWidth,
                    newLeft
                )
            );


        newTop =
            Math.max(
                0,
                Math.min(
                    currentSceneRect.height -
                        dryer.offsetHeight,
                    newTop
                )
            );


        dryer.style.left =
            newLeft + "px";

        dryer.style.top =
            newTop + "px";


        const dryerBox =
            dryer.getBoundingClientRect();

        const essaBox =
            bathEssa.getBoundingClientRect();


        const touchingEssa =
            dryerBox.right >=
                essaBox.left &&

            dryerBox.left <=
                essaBox.right &&

            dryerBox.bottom >=
                essaBox.top &&

            dryerBox.top <=
                essaBox.bottom;


        if (touchingEssa) {

            state.dryingProgress =
                Math.min(
                    100,
                    state.dryingProgress +
                        0.25
                );


            updatePlayBathDryingProgress();
        }
    }


    function stopDryerDrag() {

        dryer.removeEventListener(
            "pointermove",
            moveDryer
        );

        dryer.removeEventListener(
            "pointerup",
            stopDryerDrag
        );

        dryer.removeEventListener(
            "pointercancel",
            stopDryerDrag
        );
    }


    dryer.addEventListener(
        "pointermove",
        moveDryer
    );

    dryer.addEventListener(
        "pointerup",
        stopDryerDrag
    );

    dryer.addEventListener(
        "pointercancel",
        stopDryerDrag
    );
}

function updatePlayBathDryingProgress() {

    const state =
        window.playBathState;


    if (!state) {
        return;
    }


    const scene =
        document.getElementById(
            "play-bath-mode-scene"
        );


    if (!scene) {
        return;
    }


    let progress =
        document.getElementById(
            "play-bath-drying-progress"
        );


    if (!progress) {

        progress =
            document.createElement(
                "div"
            );


        progress.id =
            "play-bath-drying-progress";


        progress.style.cssText = `
            position:absolute;
            left:50%;
            bottom:4%;
            transform:translateX(-50%);
            width:280px;
            max-width:70%;
            padding:10px 14px;
            background:rgba(255,255,255,.92);
            border-radius:16px;
            text-align:center;
            color:#17313a;
            font-weight:bold;
            z-index:180;
        `;


        scene.appendChild(
            progress
        );
    }


    progress.innerHTML = `

        <div>
            ${
                state.dryingProgress >= 100
                    ? "✨ All Dry!"
                    : "💨 Drying..."
            }
        </div>

        <div
            style="
                height:12px;
                margin-top:7px;
                background:#dbe5e7;
                border-radius:999px;
                overflow:hidden;
            "
        >

            <div
                style="
                    width:${
                        state.dryingProgress
                    }%;
                    height:100%;
                    background:#4fb5ae;
                    border-radius:999px;
                "
            ></div>

        </div>

    `;


    if (
        state.dryingProgress >= 100 &&
        state.stage === "drying"
    ) {

        finishPlayBathDrying();
    }
}

function finishPlayBathDrying() {

    const state =
        window.playBathState;


    if (
        !state ||
        state.stage !== "drying"
    ) {
        return;
    }


    /*
        Change the stage FIRST so
        the reward cannot fire twice.
    */

    state.stage =
        "complete";


    const playData =
        getSavedPlayData();


    const stats =
        getPlayEssaStats(
            playData,
            state.essaId
        );


    stats.cleanliness = 100;


    savePlayData(
        playData
    );


    const dryer =
        document.getElementById(
            "play-bath-fur-dryer"
        );


    if (dryer) {

        dryer.style.pointerEvents =
            "none";

        dryer.style.cursor =
            "default";
    }
}

let playFridgeFeedingBasket = [];

function startPlayFridgeFeeding(
    essaId,
    itemName,
    imagePath
) {
    console.log(
    "INSIDE START FEEDING",
    essaId,
    itemName,
    imagePath
);

   playFridgeFeedingBasket = [
    {
        essaId: essaId,
        itemName: itemName,
        imagePath: imagePath
    }
];

console.log(
    "FRIDGE BASKET:",
    playFridgeFeedingBasket
);
    
    const chooser =
    document.getElementById(
        "play-fridge-essa-chooser"
    );

if (chooser) {
    chooser.remove();
}

const confirmation =
    document.getElementById(
        "play-fridge-confirm-overlay"
    );

if (confirmation) {
    confirmation.remove();
}

const fridge =
    document.getElementById(
        "play-fridge-overlay"
    );

if (fridge) {
    fridge.remove();
}
    /*
    renderPlayableEssaFocus(
        essaId
    );
    */
   showPlayFridgeAddAnotherPopup(
    essaId
);
}

function showPlayFridgeAddAnotherPopup(
    essaId
) {

    const existing =
        document.getElementById(
            "play-fridge-add-another-overlay"
        );

    if (existing) {
        existing.remove();
    }


    const overlay =
        document.createElement("div");

    overlay.id =
        "play-fridge-add-another-overlay";


    overlay.style.cssText = `
        position:fixed;
        inset:0;
        background:rgba(0,0,0,.55);
        display:flex;
        align-items:center;
        justify-content:center;
        z-index:99999;
    `;


    overlay.innerHTML = `

        <div
            style="
                background:white;
                border-radius:22px;
                padding:28px;
                width:min(360px, 85vw);
                text-align:center;
                box-shadow:0 15px 40px rgba(0,0,0,.3);
            "
        >

            <h2
                style="
                    margin-top:0;
                    color:#17313a;
                "
            >
                Add another item?
            </h2>


            <p
                style="
                    color:#68777b;
                    line-height:1.5;
                "
            >
                Would you like to grab
                another food or drink?
            </p>


            <div
                style="
                    display:flex;
                    gap:12px;
                    justify-content:center;
                    margin-top:20px;
                "
            >

                <button
                    class="play-action-button primary"
                    onclick="
    document
        .getElementById(
            'play-fridge-add-another-overlay'
        )
        .remove();

    openPlayFridge();
"
                >
                    Yes
                </button>


                <button
                    class="play-action-button"
                    onclick="
    finishPlayFridgeShopping(
        '${essaId}'
    );
"
                >
                    No
                </button>

            </div>

        </div>
    `;


    (
        document.fullscreenElement ||
        document.body
    ).appendChild(
        overlay
    );
}

function finishPlayFridgeShopping(
    essaId
) {

    const addAnotherOverlay =
        document.getElementById(
            "play-fridge-add-another-overlay"
        );

    if (addAnotherOverlay) {
        addAnotherOverlay.remove();
    }


    const fridgeOverlay =
        document.getElementById(
            "play-fridge-overlay"
        );

    if (fridgeOverlay) {
        fridgeOverlay.remove();
    }


    const confirmOverlay =
        document.getElementById(
            "play-fridge-confirm-overlay"
        );

    if (confirmOverlay) {
        confirmOverlay.remove();
    }


    renderPlayableEssaFocus(
        essaId
    );
}


function getPlayFridgeItemType(
    imagePath
) {

    if (
        imagePath.includes(
            "/Food/"
        )
    ) {
        return "food";
    }


    if (
        imagePath.includes(
            "/Drinks/"
        )
    ) {
        return "drink";
    }


    return null;
}

/* =========================================================
   PARTY PAWS ENERGY WARNING
========================================================= */

function showPartyPawsEnergyWarning(
    onYes,
    onNo
) {

    const oldPopup =
        document.getElementById(
            "party-paws-energy-warning"
        );

    if (oldPopup) {
        oldPopup.remove();
    }


    const overlay =
        document.createElement(
            "div"
        );

    overlay.id =
        "party-paws-energy-warning";


    overlay.style.cssText = `
        position:fixed;
        inset:0;
        background:rgba(0,0,0,.55);
        display:flex;
        align-items:center;
        justify-content:center;
        padding:20px;
        box-sizing:border-box;
        z-index:999999;
    `;


    overlay.innerHTML = `

        <div
            style="
                width:min(480px, 100%);
                background:white;
                border:
                    2px solid
                    var(
                        --user-theme-color,
                        #4fb5ae
                    );
                border-radius:24px;
                padding:28px;
                box-sizing:border-box;
                text-align:center;
                box-shadow:
                    0 15px 50px
                    rgba(0,0,0,.30);
            "
        >

            <div
                style="
                    font-size:48px;
                    margin-bottom:8px;
                "
            >
                ⚠️
            </div>


            <h2
                style="
                    margin:0 0 16px 0;
                    color:
                        var(
                            --user-theme-color,
                            #4fb5ae
                        );
                    font-size:27px;
                "
            >
                Party Paws Energy Effect
            </h2>


            <p
                style="
                    margin:0 0 14px 0;
                    color:#53666d;
                    font-size:17px;
                    line-height:1.5;
                "
            >
                Party Paws causes very fast
                movement and visual effects
                for 10 seconds.
            </p>


            <p
                style="
                    margin:0 0 24px 0;
                    color:#53666d;
                    font-size:17px;
                    line-height:1.5;
                    font-weight:bold;
                "
            >
                This effect may be uncomfortable
                or potentially trigger seizures
                in people with photosensitivity.
            </p>


            <p
                style="
                    margin:0 0 22px 0;
                    color:#17313a;
                    font-size:18px;
                    font-weight:bold;
                "
            >
                Use the energy effect?
            </p>


            <div
                style="
                    display:flex;
                    justify-content:center;
                    gap:14px;
                    flex-wrap:wrap;
                "
            >

                <button
                    id="party-paws-no-button"
                    type="button"

                    style="
                        padding:12px 22px;
                        border:1px solid #d3dde0;
                        border-radius:14px;
                        background:white;
                        color:#344349;
                        font-size:16px;
                        font-weight:bold;
                        cursor:pointer;
                    "
                >
                    No — Drink Without Effect
                </button>


                <button
                    id="party-paws-yes-button"
                    type="button"

                    style="
                        padding:12px 22px;
                        border:none;
                        border-radius:14px;
                        background:
                            var(
                                --user-theme-color,
                                #4fb5ae
                            );
                        color:white;
                        font-size:16px;
                        font-weight:bold;
                        cursor:pointer;
                    "
                >
                    Yes — Enable Effect
                </button>

            </div>

        </div>

    `;


    const popupHost =
    document.fullscreenElement ||
    document.body;

popupHost.appendChild(
    overlay
);


    document
        .getElementById(
            "party-paws-yes-button"
        )
        .onclick =
        function() {

            overlay.remove();

            if (onYes) {
                onYes();
            }
        };


    document
        .getElementById(
            "party-paws-no-button"
        )
        .onclick =
        function() {

            overlay.remove();

            if (onNo) {
                onNo();
            }
        };
}

function startPlayFridgeItemDrag(
    event,
    basketIndex
) {

    const item =
        event.currentTarget;


    const pendingItem =
        playFridgeFeedingBasket[
            basketIndex
        ];


    if (
        !item ||
        !pendingItem
    ) {
        return;
    }


    event.preventDefault();


    const itemRect =
        item.getBoundingClientRect();


    const grabOffsetX =
        event.clientX -
        itemRect.left;

    const grabOffsetY =
        event.clientY -
        itemRect.top;


    item.style.position =
        "fixed";

    item.style.left =
        itemRect.left + "px";

    item.style.top =
        itemRect.top + "px";

    item.style.right =
        "auto";

    item.style.bottom =
        "auto";

    item.style.transform =
        "none";

    item.style.margin =
        "0";

    item.style.zIndex =
        "99999";


    item.setPointerCapture(
        event.pointerId
    );


    function moveItem(
        moveEvent
    ) {

        item.style.left =
            (
                moveEvent.clientX -
                grabOffsetX
            ) + "px";

        item.style.top =
            (
                moveEvent.clientY -
                grabOffsetY
            ) + "px";
    }


    function stopDragging(
        event
    ) {

        const essaTarget =
            document.querySelector(
                '[data-pet-essa]'
            );


        let wasEaten = false;


        if (essaTarget) {

            const draggedRect =
                item.getBoundingClientRect();

            const essaRect =
                essaTarget
                    .getBoundingClientRect();


            const itemCenterX =
                draggedRect.left +
                draggedRect.width / 2;

            const itemCenterY =
                draggedRect.top +
                draggedRect.height / 2;


            const droppedOnEssa =
                itemCenterX >=
                    essaRect.left &&
                itemCenterX <=
                    essaRect.right &&
                itemCenterY >=
                    essaRect.top &&
                itemCenterY <=
                    essaRect.bottom;


            if (droppedOnEssa) {

                const itemType =
                    getPlayFridgeItemType(
                        pendingItem.imagePath
                    );


                const playData =
                    getSavedPlayData();


                const stats =
                    getPlayEssaStats(
                        playData,
                        pendingItem.essaId
                    );


                if (
                    itemType === "food"
                ) {

                    stats.food =
                        Math.min(
                            100,
                            stats.food + 50
                        );
                }


                if (
                    itemType === "drink"
                ) {

                    stats.water =
                        Math.min(
                            100,
                            stats.water + 50
                        );
                }


                if (
                    pendingItem.itemName ===
                    "Party Paws Energy"
                ) {

                    showPartyPawsEnergyWarning(

                        function() {

                            stats.superEnergyUntil =
                                Date.now() +
                                (
                                    10 *
                                    1000
                                );


                            savePlayData(
                                playData
                            );


                            playFridgeFeedingBasket
                                .splice(
                                    basketIndex,
                                    1
                                );


                            renderPlayableEssaFocus(
                                pendingItem.essaId
                            );
                        },

                        function() {

                            savePlayData(
                                playData
                            );


                            playFridgeFeedingBasket
                                .splice(
                                    basketIndex,
                                    1
                                );


                            renderPlayableEssaFocus(
                                pendingItem.essaId
                            );
                        }

                    );


                    wasEaten = true;

                    return;
                }


                savePlayData(
                    playData
                );


                playFridgeFeedingBasket
                    .splice(
                        basketIndex,
                        1
                    );


                wasEaten = true;


                renderPlayableEssaFocus(
                    pendingItem.essaId
                );
            }
        }


        if (!wasEaten) {

            renderPlayableEssaFocus(
                pendingItem.essaId
            );
        }


        item.removeEventListener(
            "pointermove",
            moveItem
        );

        item.removeEventListener(
            "pointerup",
            stopDragging
        );

        item.removeEventListener(
            "pointercancel",
            stopDragging
        );
    }


    item.addEventListener(
        "pointermove",
        moveItem
    );

    item.addEventListener(
        "pointerup",
        stopDragging
    );

    item.addEventListener(
        "pointercancel",
        stopDragging
    );
}

 /* =========================================================
   BACKYARD FRISBEE
========================================================= */

const BACKYARD_GAME_BACKGROUND =
    "backyard-backgrounds/backyard-games-bg.png";


let backyardFrisbeeState = null;

let backyardFrisbeeSwipeStartY = null;

let backyardFrisbeeTimers = [];


/* =========================================================
   CLEAR FRISBEE TIMERS
========================================================= */

function clearBackyardFrisbeeTimers() {

    backyardFrisbeeTimers.forEach(
        function(timer) {

            clearTimeout(
                timer
            );
        }
    );


    backyardFrisbeeTimers = [];
}


/* =========================================================
   GET ESSAS CURRENTLY IN BACKYARD
========================================================= */

function getBackyardFrisbeeEssaRoster() {

    const houseData =
        getSavedPlayHouseData();


    const playData =
        getSavedPlayData();


    return getAllPlayableEssas().filter(
        function(essa) {

            const unlocked =
                playData
                    .unlockedEssaIds
                    .includes(
                        essa.id
                    );


            const inBackyard =
                houseData
                    .essaRooms[
                        essa.id
                    ] ===
                "backyard";


            return (
                unlocked &&
                inBackyard
            );
        }
    );
}


/* =========================================================
   OPEN BACKYARD FRISBEE
========================================================= */

function openBackyardFrisbee() {

    stopPlayHouseTimers();

    clearBackyardFrisbeeTimers();


    const backyardEssas =
        getBackyardFrisbeeEssaRoster();


    if (
        backyardEssas.length ===
        0
    ) {

        showBackyardFrisbeeNeedsEssa();

        return;
    }


    startBackyardFrisbee(
        backyardEssas
    );
}


/* =========================================================
   NO ESSAS IN BACKYARD
========================================================= */

function showBackyardFrisbeeNeedsEssa() {

    const oldPopup =
        document.getElementById(
            "backyard-frisbee-popup"
        );

    if (oldPopup) {
        oldPopup.remove();
    }


    const popup =
        document.createElement(
            "div"
        );

    popup.id =
        "backyard-frisbee-popup";


    popup.style.cssText = `
        position:fixed;
        inset:0;
        z-index:9000;

        display:flex;
        align-items:center;
        justify-content:center;

        padding:20px;
        box-sizing:border-box;

        background:
            rgba(0,0,0,.55);
    `;


    popup.innerHTML = `

        <div
            style="
                position:relative;

                width:min(
                    600px,
                    100%
                );

                padding:
                    40px
                    30px
                    30px;

                box-sizing:border-box;

                background:white;

                border:
                    1px solid
                    #dbe5e7;

                border-radius:22px;

                text-align:center;

                box-shadow:
                    0 14px 40px
                    rgba(0,0,0,.25);
            "
        >

            <button
                onclick="
                    document
                        .getElementById(
                            'backyard-frisbee-popup'
                        )
                        ?.remove()
                "

                aria-label="Close Frisbee"

                style="
                    position:absolute;
                    top:12px;
                    right:12px;

                    width:38px;
                    height:38px;

                    padding:0;

                    display:flex;
                    align-items:center;
                    justify-content:center;

                    border:none;
                    border-radius:50%;

                    background:#eef3f4;
                    color:#17313a;

                    font-size:20px;
                    font-weight:bold;

                    cursor:pointer;
                "
            >
                ×
            </button>


            <h2
                style="
                    margin:
                        0
                        0
                        18px;

                    color:#17313a;

                    font-size:28px;
                "
            >
                🥏 Frisbee
            </h2>


            <div
                style="
                    font-size:60px;
                "
            >
                🐾
            </div>


            <h2
                style="
                    color:#17313a;
                "
            >
                No ESSAs are in the Backyard!
            </h2>


            <p
                style="
                    color:#68777b;
                    line-height:1.5;
                "
            >
                Call an ESSA into the Backyard
                before starting Frisbee.
            </p>


            <button
                class="play-action-button"

                onclick="
                    openCallEssaMenu()
                "

                style="
                    padding:
                        12px
                        20px;

                    border:none;
                    border-radius:14px;

                    background:
                        var(
                            --user-theme-color,
                            #4fb5ae
                        );

                    color:white;

                    font-family:
                        Arial,
                        sans-serif;

                    font-size:16px;
                    font-weight:bold;

                    cursor:pointer;

                    box-shadow:
                        0 4px 10px
                        rgba(0,0,0,.12);
                "
            >
                📣 Call ESSA
            </button>

        </div>

    `;


    const popupParent =
    document.fullscreenElement ||
    document.body;

popupParent.appendChild(
    popup
);
}

/* =========================================================
   START FRISBEE
========================================================= */

function startBackyardFrisbee(
    backyardEssas
) {

    clearBackyardFrisbeeTimers();


    if (
        !Array.isArray(
            backyardEssas
        ) ||
        backyardEssas.length ===
        0
    ) {

        showBackyardFrisbeeNeedsEssa();

        return;
    }


    backyardFrisbeeState = {

        backyardEssas:
            backyardEssas,

        winnerEssaId:
            null,

        phase:
            "ready",

        retrievals:
            0,

        petted:
            false

    };


    renderBackyardFrisbee();
}


/* =========================================================
   RENDER FRISBEE GAME
========================================================= */

function renderBackyardFrisbee() {

    const siteHeader =
    document.querySelector("header");

if (siteHeader) {
    siteHeader.style.display = "none";
}

    const state =
        backyardFrisbeeState;


    if (
        !state ||
        !Array.isArray(
            state.backyardEssas
        ) ||
        state.backyardEssas.length === 0
    ) {

        showBackyardFrisbeeNeedsEssa();

        return;
    }


    const essas =
        state.backyardEssas;


    const essaImages =
        essas
            .map(
                function(essa, index) {

                    const spacing =
                        100 /
                        (
                            essas.length +
                            1
                        );


                    const startX =
                        spacing *
                        (
                            index +
                            1
                        );


                    return `

                        <img
                            class="backyard-frisbee-essa"

                            data-frisbee-essa-id="${essa.id}"

                            src="${essa.image}"

                            onclick="
                                petBackyardFrisbeeEssa(
                                    '${essa.id}'
                                )
                            "

                            style="
                                position:absolute;

                                left:${startX}%;

                                bottom:70px;

                                width:110px;

                                max-width:20%;

                                max-height:38%;

                                transform:
                                    translateX(-50%);

                                transform-origin:
                                    center bottom;

                                object-fit:contain;

                                user-select:none;

                                -webkit-user-drag:none;

                                cursor:default;

                                z-index:10;
                            "
                        >

                    `;
                }
            )
            .join("");


    document.querySelector(
        "main"
    ).innerHTML = `

        <div
            id="backyard-frisbee-game"

            style="
                width:100%;
                max-width:1150px;

                height:calc(100dvh - 24px);

                margin:0 auto;

                box-sizing:border-box;

                overflow:hidden;

                text-align:center;
            "
        >


            <div
                id="backyard-frisbee-field"

                style="
                    position:relative;

                    width:100%;
                    height:100%;

                    overflow:hidden;

                    box-sizing:border-box;

                    border:
                        1px solid
                        #dbe5e7;

                    border-radius:28px;

                    background-color:#eaf6f4;

                    background-image:
                        url(
                            '${BACKYARD_GAME_BACKGROUND}'
                        );

                    background-size:contain;

                    background-position:center;

                    background-repeat:no-repeat;

                    box-shadow:
                        0 8px 28px
                        rgba(
                            0,
                            0,
                            0,
                            .13
                        );

                    touch-action:none;
                "
            >


                <button
                    onclick="
                        closeBackyardFrisbee()
                    "

                    aria-label="
                        Back to Backyard
                    "

                    style="
                        position:absolute;

                        top:12px;
                        left:12px;

                        z-index:50;

                        width:40px;
                        height:40px;

                        padding:0;

                        border:none;
                        border-radius:50%;

                        background:
                            rgba(
                                255,
                                255,
                                255,
                                .92
                            );

                        color:#17313a;

                        font-size:26px;
                        font-weight:bold;
                        line-height:40px;

                        cursor:pointer;

                        box-shadow:
                            0 3px 12px
                            rgba(
                                0,
                                0,
                                0,
                                .15
                            );
                    "
                >
                    ×
                </button>


                <div
                    id="frisbee-instructions"

                    style="
                        position:absolute;

                        top:12px;

                        left:50%;

                        transform:
                            translateX(-50%);

                        z-index:30;

                        padding:
                            8px
                            14px;

                        background:
                            rgba(
                                255,
                                255,
                                255,
                                .88
                            );

                        border-radius:16px;

                        font-weight:bold;

                        white-space:nowrap;

                        box-shadow:
                            0 3px 12px
                            rgba(
                                0,
                                0,
                                0,
                                .08
                            );
                    "
                >
                    🥏 Swipe the frisbee upward!
                </div>


                <div
                    id="frisbee-heart"

                    style="
                        display:none;

                        position:absolute;

                        left:50%;

                        bottom:150px;

                        transform:
                            translateX(-50%);

                        z-index:40;

                        font-size:55px;

                        pointer-events:none;
                    "
                >
                    ❤️
                </div>


                ${essaImages}


                <img
                    id="backyard-frisbee"

                    src="backyard-games/frisbee.png"

                    style="
                        position:absolute;

                        left:50%;

                        bottom:18px;

                        width:75px;

                        max-width:18%;

                        max-height:22%;

                        transform:
                            translateX(-50%);

                        object-fit:contain;

                        user-select:none;

                        -webkit-user-drag:none;

                        cursor:grab;

                        touch-action:none;

                        z-index:20;
                    "
                >


            </div>


        </div>

    `;


    setupBackyardFrisbeeSwipe();
}

/* =========================================================
   SET UP SWIPE
========================================================= */

function setupBackyardFrisbeeSwipe() {

    const frisbee =
        document.getElementById(
            "backyard-frisbee"
        );


    if (!frisbee) {

        return;
    }


    frisbee.addEventListener(
        "pointerdown",
        startBackyardFrisbeeSwipe
    );


    frisbee.addEventListener(
        "dragstart",

        function(event) {

            event.preventDefault();
        }
    );
}


/* =========================================================
   START SWIPE
========================================================= */

function startBackyardFrisbeeSwipe(
    event
) {

    const state =
        backyardFrisbeeState;


    if (
        !state ||
        state.phase !==
            "ready"
    ) {

        return;
    }


    event.preventDefault();


    backyardFrisbeeSwipeStartY =
        event.clientY;


    window.addEventListener(
        "pointerup",
        endBackyardFrisbeeSwipe,
        {
            once: true
        }
    );


    window.addEventListener(
        "pointercancel",

        cancelBackyardFrisbeeSwipe,

        {
            once: true
        }
    );
}


/* =========================================================
   CANCEL SWIPE
========================================================= */

function cancelBackyardFrisbeeSwipe() {

    backyardFrisbeeSwipeStartY =
        null;
}


/* =========================================================
   END SWIPE
========================================================= */

function endBackyardFrisbeeSwipe(
    event
) {

    const state =
        backyardFrisbeeState;


    if (
        !state ||
        state.phase !==
            "ready"
    ) {

        backyardFrisbeeSwipeStartY =
            null;

        return;
    }


    if (
        backyardFrisbeeSwipeStartY ===
        null
    ) {

        return;
    }


    const swipeDistance =
        backyardFrisbeeSwipeStartY -
        event.clientY;


    backyardFrisbeeSwipeStartY =
        null;


    if (
        swipeDistance <
        15
    ) {

        const message =
            document.getElementById(
                "backyard-frisbee-message"
            );


        if (message) {

            message.textContent =
                "Swipe upward a little to toss the frisbee! 🥏";
        }


        return;
    }


    throwBackyardFrisbee(
        swipeDistance
    );
}

/* =========================================================
   THROW FRISBEE
========================================================= */

function throwBackyardFrisbee(
    swipeDistance
) {

    const state =
        backyardFrisbeeState;


    if (
        !state ||
        state.phase !==
            "ready"
    ) {

        return;
    }


    state.phase =
        "throwing";

    state.petted =
        false;


    const frisbee =
        document.getElementById(
            "backyard-frisbee"
        );


    const message =
        document.getElementById(
            "backyard-frisbee-message"
        );


    const instructions =
        document.getElementById(
            "frisbee-instructions"
        );


    if (!frisbee) {

        return;
    }


    if (instructions) {

        instructions.textContent =
            "🥏 There it goes!";
    }


   if (message) {

    if (
        state.backyardEssas.length ===
        1
    ) {

        message.textContent =
            state.backyardEssas[0].name +
            " is watching the frisbee!";

    } else {

        message.textContent =
            "The ESSAs are watching the frisbee! 👀🥏";
    }
}


    const strength =
        Math.min(
            Math.max(
                swipeDistance,
                20
            ),
            140
        );


    const strengthPercent =
        (
            strength -
            20
        ) /
        120;


    const landingX =
        25 +
        Math.random() *
        50;


    const landingY =
        46 -
        (
            strengthPercent *
            27
        );


    const landingSize =
        44 -
        (
            strengthPercent *
            12
        );


    state.landingX =
        landingX;

    state.landingY =
        landingY;


    frisbee.style.transition =
        "left .8s ease-out, " +
        "top .8s ease-out, " +
        "width .8s ease-out, " +
        "transform .8s ease-out";


    frisbee.style.bottom =
        "auto";


    frisbee.style.left =
        landingX +
        "%";


    frisbee.style.top =
        landingY +
        "%";


    frisbee.style.width =
        landingSize +
        "px";


    frisbee.style.transform =
        "translate(-50%, -50%) rotate(720deg)";


    const timer =
        window.setTimeout(
            function() {

                chaseBackyardFrisbee();

            },

            700
        );


    backyardFrisbeeTimers.push(
        timer
    );
}


/* =========================================================
   ALL ESSAS CHASE FRISBEE
========================================================= */

function chaseBackyardFrisbee() {

    const state =
        backyardFrisbeeState;


    if (
        !state ||
        !Array.isArray(
            state.backyardEssas
        ) ||
        state.backyardEssas.length ===
        0
    ) {

        return;
    }


    state.phase =
        "chasing";


    const message =
        document.getElementById(
            "backyard-frisbee-message"
        );


    const instructions =
        document.getElementById(
            "frisbee-instructions"
        );


    const winnerIndex =
        Math.floor(
            Math.random() *
            state.backyardEssas.length
        );


    const winner =
        state.backyardEssas[
            winnerIndex
        ];


    state.winnerEssaId =
        winner.id;


    if (message) {

        if (
            state.backyardEssas.length ===
            1
        ) {

            message.textContent =
                winner.name +
                " is running after it! 🐾";

        } else {

            message.textContent =
                "Everybody is running after it! 🐾🐾🐾";
        }
    }


    if (instructions) {

        instructions.textContent =
            state.backyardEssas.length ===
            1

                ? "🐾 Go " +
                  winner.name +
                  "!"

                : "🐾 Go, ESSAs, go!";
    }


    const essaElements =
        document.querySelectorAll(
            ".backyard-frisbee-essa"
        );


    essaElements.forEach(
        function(essaElement, index) {

            const essaId =
                essaElement.dataset
                    .frisbeeEssaId;


            const isWinner =
                String(
                    essaId
                ) ===
                String(
                    winner.id
                );


            const direction =
                state.landingX <
                50

                    ? -1

                    : 1;


            const offset =
                isWinner

                    ? 0

                    : (
                        index % 2 === 0
                            ? -7
                            : 7
                    );


            const targetX =
                Math.max(
                    8,
                    Math.min(
                        92,
                        state.landingX +
                        offset
                    )
                );


            const targetY =
                state.landingY +
                (
                    isWinner
                        ? 7
                        : 11
                );


            essaElement.style.transition =
                "left 1.3s ease-in, " +
                "top 1.3s ease-in, " +
                "width 1.3s ease-in, " +
                "transform .2s ease";


            essaElement.style.bottom =
                "auto";


            essaElement.style.left =
                targetX +
                "%";


            essaElement.style.top =
                targetY +
                "%";


            essaElement.style.width =
                isWinner
                    ? "55px"
                    : "50px";


            essaElement.style.transform =
                "translate(-50%, -50%) " +
                "scaleX(" +
                direction +
                ")";
        }
    );


    const timer =
        window.setTimeout(
            function() {

                pickupBackyardFrisbee();

            },

            1400
        );


    backyardFrisbeeTimers.push(
        timer
    );
}


/* =========================================================
   WINNER PICKS UP FRISBEE
========================================================= */

function pickupBackyardFrisbee() {

    const state =
        backyardFrisbeeState;


    if (
        !state ||
        !state.winnerEssaId
    ) {

        return;
    }


    const winner =
        state.backyardEssas.find(
            function(essa) {

                return (
                    String(
                        essa.id
                    ) ===
                    String(
                        state.winnerEssaId
                    )
                );
            }
        );


    if (!winner) {

        return;
    }


    const frisbee =
        document.getElementById(
            "backyard-frisbee"
        );


    const message =
        document.getElementById(
            "backyard-frisbee-message"
        );


    if (message) {

        message.textContent =
            winner.name +
            " got the frisbee! 🥏";
    }


    if (frisbee) {

        frisbee.style.width =
            "25px";


        frisbee.style.left =
            (
                state.landingX +
                2
            ) +
            "%";


        frisbee.style.top =
            (
                state.landingY +
                8
            ) +
            "%";


        frisbee.style.transform =
            "translate(-50%, -50%)";
    }


    const timer =
        window.setTimeout(
            function() {

                returnBackyardFrisbee();

            },

            450
        );


    backyardFrisbeeTimers.push(
        timer
    );
}


/* =========================================================
   ALL ESSAS RETURN
========================================================= */

function returnBackyardFrisbee() {

    const state =
        backyardFrisbeeState;


    if (
        !state ||
        !state.winnerEssaId
    ) {

        return;
    }


    state.phase =
        "returning";


    const winner =
        state.backyardEssas.find(
            function(essa) {

                return (
                    String(
                        essa.id
                    ) ===
                    String(
                        state.winnerEssaId
                    )
                );
            }
        );


    if (!winner) {

        return;
    }


    const frisbee =
        document.getElementById(
            "backyard-frisbee"
        );


    const message =
        document.getElementById(
            "backyard-frisbee-message"
        );


    const instructions =
        document.getElementById(
            "frisbee-instructions"
        );


    if (!frisbee) {

        return;
    }


    if (message) {

        message.textContent =
            winner.name +
            " is bringing it back!";
    }


    if (instructions) {

        instructions.textContent =
            "🥏 Here they come!";
    }


    const essaElements =
        document.querySelectorAll(
            ".backyard-frisbee-essa"
        );


    const totalEssas =
        essaElements.length;


    essaElements.forEach(
        function(essaElement, index) {

            const essaId =
                essaElement.dataset
                    .frisbeeEssaId;


            const isWinner =
                String(
                    essaId
                ) ===
                String(
                    winner.id
                );


            const spacing =
                100 /
                (
                    totalEssas +
                    1
                );


            const returnX =
                spacing *
                (
                    index +
                    1
                );


            const returnDirection =
                state.landingX <
                50

                    ? 1

                    : -1;


            essaElement.style.transition =
                "left 1.5s ease-out, " +
                "top 1.5s ease-out, " +
                "width 1.5s ease-out, " +
                "transform .2s ease";


            essaElement.style.left =
                isWinner
                    ? "50%"
                    : returnX +
                      "%";


            essaElement.style.top =
                isWinner
                    ? "76%"
                    : "78%";


            essaElement.style.width =
                isWinner
                    ? "120px"
                    : "105px";


            essaElement.style.transform =
                "translate(-50%, -50%) " +
                "scaleX(" +
                returnDirection +
                ")";
        }
    );


    frisbee.style.transition =
        "left 1.5s ease-out, " +
        "top 1.5s ease-out, " +
        "width 1.5s ease-out";


    frisbee.style.left =
        "52%";


    frisbee.style.top =
        "76%";


    frisbee.style.width =
        "42px";


    const timer =
        window.setTimeout(
            function() {

                finishBackyardFrisbeeRetrieve();

            },

            1550
        );


    backyardFrisbeeTimers.push(
        timer
    );
}

/* =========================================================
   RETRIEVE FINISHED
========================================================= */

function finishBackyardFrisbeeRetrieve() {

    const state =
        backyardFrisbeeState;


    if (
        !state ||
        !state.winnerEssaId
    ) {

        return;
    }


    const winner =
        state.backyardEssas.find(
            function(essa) {

                return (
                    String(
                        essa.id
                    ) ===
                    String(
                        state.winnerEssaId
                    )
                );
            }
        );


    if (!winner) {

        return;
    }


    state.phase =
        "pet";


    const winnerElement =
        document.querySelector(
            '[data-frisbee-essa-id="' +
            winner.id +
            '"]'
        );


    const frisbee =
        document.getElementById(
            "backyard-frisbee"
        );


    const message =
        document.getElementById(
            "backyard-frisbee-message"
        );


    const instructions =
        document.getElementById(
            "frisbee-instructions"
        );


    document
        .querySelectorAll(
            ".backyard-frisbee-essa"
        )
        .forEach(
            function(essaElement) {

                const isWinner =
                    String(
                        essaElement.dataset
                            .frisbeeEssaId
                    ) ===
                    String(
                        winner.id
                    );


                essaElement.style.cursor =
                    isWinner
                        ? "pointer"
                        : "default";
            }
        );


    if (winnerElement) {

        winnerElement.style.cursor =
            "pointer";
    }


    if (frisbee) {

        frisbee.style.transition =
            "none";

        frisbee.style.left =
            "50%";

        frisbee.style.top =
            "auto";

        frisbee.style.bottom =
            "28px";

        frisbee.style.width =
            "90px";

        frisbee.style.transform =
            "translateX(-50%)";
    }


    if (instructions) {

        instructions.textContent =
            "❤️ Pet " +
            winner.name +
            "!";
    }


    if (message) {

        message.textContent =
            "Tap " +
            winner.name +
            " to reward them for bringing the frisbee back!";
    }
}


/* =========================================================
   PET WINNING ESSA
========================================================= */

function petBackyardFrisbeeEssa(
    essaId
) {

    const state =
        backyardFrisbeeState;


    if (
        !state ||
        state.phase !==
            "pet" ||
        state.petted
    ) {

        return;
    }


    if (
        String(
            essaId
        ) !==
        String(
            state.winnerEssaId
        )
    ) {

        return;
    }


    const winner =
        state.backyardEssas.find(
            function(essa) {

                return (
                    String(
                        essa.id
                    ) ===
                    String(
                        state.winnerEssaId
                    )
                );
            }
        );


    if (!winner) {

        return;
    }


    state.petted =
        true;


    const playData =
        getSavedPlayData();


    const oldLevel =
        Number(
            playData.trainerLevel
        ) || 1;


    const xpEarned =
        2;


    addTrainerXP(
        playData,
        xpEarned
    );


    const newLevel =
        Number(
            playData.trainerLevel
        ) || 1;


    /*
        FRISBEE REWARD

        Each completed retrieval adds
        100 coins to the Playroom.
    */

    playData.pendingCoins =
        (
            Number(
                playData.pendingCoins
            ) || 0
        ) +
        getPlayGameCoinReward(
            100
        );


    savePlayData(
        playData
    );


    state.retrievals++;


    const heart =
        document.getElementById(
            "frisbee-heart"
        );


    const message =
        document.getElementById(
            "backyard-frisbee-message"
        );


    const instructions =
        document.getElementById(
            "frisbee-instructions"
        );


    const winnerElement =
        document.querySelector(
            '[data-frisbee-essa-id="' +
            winner.id +
            '"]'
        );


    if (heart) {

        heart.style.display =
            "block";


        heart.animate(
            [
                {
                    transform:
                        "translateX(-50%) scale(.5)",

                    opacity:
                        0
                },

                {
                    transform:
                        "translateX(-50%) scale(1.2)",

                    opacity:
                        1
                },

                {
                    transform:
                        "translateX(-50%) translateY(-45px) scale(1)",

                    opacity:
                        0
                }
            ],

            {
                duration:
                    900,

                easing:
                    "ease-out"
            }
        );
    }


    if (winnerElement) {

        winnerElement.animate(
            [
                {
                    transform:
                        "translate(-50%, -50%) scale(1)"
                },

                {
                    transform:
                        "translate(-50%, -50%) scale(1.08)"
                },

                {
                    transform:
                        "translate(-50%, -50%) scale(1)"
                }
            ],

            {
                duration:
                    450
            }
        );
    }


    if (instructions) {

        instructions.textContent =
            "❤️ Good ESSA!";
    }


    if (message) {

        if (
            newLevel >
            oldLevel
        ) {

            message.textContent =
                "❤️ " +
                winner.name +
                " loved the praise! +2 Trainer XP — LEVEL UP! ⭐ Level " +
                newLevel +
                "!";

        } else {

            message.textContent =
                "❤️ " +
                winner.name +
                " loved the praise! +2 Trainer XP";
        }
    }


    const timer =
        window.setTimeout(
            function() {

                state.phase =
                    "ready";


                state.petted =
                    false;


                state.winnerEssaId =
                    null;


                renderBackyardFrisbee();

            },

            1200
        );


    backyardFrisbeeTimers.push(
        timer
    );
}

/* =========================================================
   CLOSE FRISBEE
========================================================= */

function closeBackyardFrisbee() {

    const siteHeader =
    document.querySelector("header");

if (siteHeader) {
    siteHeader.style.display = "";
}

    clearBackyardFrisbeeTimers();


    backyardFrisbeeState =
        null;


    renderPlayRoom();
}

    /* =========================================================
   ESSA MEMORY
========================================================= */

const ESSA_MEMORY_CARD_BACKS = [
    {
        id: "classic",
        name: "Classic",
        image: "memory-card-backs/classic.png"
    },
    {
        id: "cow",
        name: "Cow",
        image: "memory-card-backs/cow.png"
    },
    {
        id: "puppy",
        name: "Puppy",
        image: "memory-card-backs/puppy.png"
    },
    {
        id: "stpatty",
        name: "St. Patrick's Day",
        image: "memory-card-backs/stpatty.png"
    },
    {
        id: "easter",
        name: "Easter",
        image: "memory-card-backs/easter.png"
    },
    {
        id: "mothersday",
        name: "Mother's Day",
        image: "memory-card-backs/mothersday.png"
    },
    {
        id: "fathersday",
        name: "Father's Day",
        image: "memory-card-backs/fathersday.png"
    },
    {
        id: "4thofjuly",
        name: "4th of July",
        image: "memory-card-backs/4thofjuly.png"
    },
    {
        id: "summer",
        name: "Summer",
        image: "memory-card-backs/summer.png"
    },
    {
        id: "halloween",
        name: "Halloween",
        image: "memory-card-backs/halloween.png"
    },
    {
        id: "thanksgiving",
        name: "Thanksgiving",
        image: "memory-card-backs/thanksgiving.png"
    },
    {
        id: "christmas",
        name: "Christmas",
        image: "memory-card-backs/christmas.png"
    },
    {
        id: "newyears",
        name: "New Year's",
        image: "memory-card-backs/newyears.png"
    },
    {
        id: "valentines",
        name: "Valentine's Day",
        image: "memory-card-backs/valentines.png"
    },
    {
        id: "pencils",
        name: "Pencils",
        image: "memory-card-backs/pencils.png"
    }
];


let essaMemoryState = null;


/* =========================================================
   OPEN MEMORY
========================================================= */

function openESSAMemory() {

    stopPlayHouseTimers();

    showESSAMemorySetup();
}


/* =========================================================
   MEMORY SETUP
========================================================= */

function showESSAMemorySetup() {

    resetPageTheme();

    let cardBackHTML = "";


    ESSA_MEMORY_CARD_BACKS.forEach(
        function(cardBack) {

            cardBackHTML += `

                <button
                    class="memory-card-back-option"

                    onclick="
                        startESSAMemory(
                            '${cardBack.id}'
                        )
                    "

                    style="
                        padding:10px;
                        background:white;
                        border:2px solid #dbe5e7;
                        border-radius:18px;
                        cursor:pointer;
                        box-shadow:
                            0 4px 12px
                            rgba(0,0,0,.08);
                    "
                >

                    <img
                        src="${cardBack.image}"

                        alt="${escapeHTML(
                            cardBack.name
                        )}"

                        style="
                            display:block;
                            width:100%;
                            max-width:125px;
                            aspect-ratio:3/4;
                            object-fit:contain;
                            margin:auto;
                            border-radius:12px;
                        "
                    >

                    <div
                        class="memory-card-back-name"

                        style="
                            margin-top:8px;
                            font-weight:bold;
                            color:#26343b;
                        "
                    >
                        ${escapeHTML(
                            cardBack.name
                        )}
                    </div>

                </button>

            `;
        }
    );


    document.querySelector(
        "main"
    ).innerHTML = `

        <div
            class="memory-setup-wrapper"

            style="
                max-width:1050px;
                margin:0 auto;
                text-align:center;
            "
        >


            <button
                type="button"

                class="
                    play-action-button
                    primary
                    memory-back-button
                "

                onclick="
                    renderPlayRoom()
                "
            >
                ← 🎮 Back to Arcade
            </button>


            <div
                class="memory-setup-panel"

                style="
                    margin-top:12px;
                    padding:28px;
                    border-radius:28px;

                    background-image:
                        linear-gradient(
                            rgba(255,255,255,.88),
                            rgba(255,255,255,.88)
                        ),
                        url(
                            'arcade-backgrounds/essa-memory-bg.png'
                        );

                    background-size:cover;
                    background-position:center;
                    background-repeat:no-repeat;

                    border:
                        1px solid
                        #dbe5e7;

                    box-shadow:
                        0 8px 28px
                        rgba(0,0,0,.12);

                    box-sizing:border-box;
                "
            >


                <h1
                    class="memory-setup-title"

                    style="
                        margin-top:0;
                    "
                >
                    🧠 ESSA Memory
                </h1>


                <p
                    class="memory-setup-description"

                    style="
                        color:#68777b;
                        font-size:17px;
                    "
                >
                    Choose your card design!
                </p>


                <div
                    class="memory-card-back-grid"

                    style="
                        display:grid;

                        grid-template-columns:
                            repeat(
                                auto-fit,
                                minmax(
                                    120px,
                                    1fr
                                )
                            );

                        gap:14px;
                        margin-top:25px;
                    "
                >

                    ${cardBackHTML}

                </div>


            </div>

        </div>

    `;
}

/* =========================================================
   FIND MEMORY CARD BACK
========================================================= */

function getESSAMemoryCardBack(
    cardBackId
) {

    return (
        ESSA_MEMORY_CARD_BACKS.find(
            function(cardBack) {

                return (
                    cardBack.id ===
                    cardBackId
                );
            }
        ) ||
        ESSA_MEMORY_CARD_BACKS[0]
    );
}


/* =========================================================
   SHUFFLE MEMORY CARDS
========================================================= */

function shuffleESSAMemoryCards(
    cards
) {

    const shuffled =
        cards.slice();


    for (
        let i =
            shuffled.length - 1;

        i > 0;

        i--
    ) {

        const j =
            Math.floor(
                Math.random() *
                (i + 1)
            );


        const temporary =
            shuffled[i];

        shuffled[i] =
            shuffled[j];

        shuffled[j] =
            temporary;
    }


    return shuffled;
}


/* =========================================================
   START MEMORY GAME
========================================================= */

function startESSAMemory(
    cardBackId
) {

    const cardBack =
        getESSAMemoryCardBack(
            cardBackId
        );


    /*
        Use the eight official ESSAs.

        Two cards per ESSA =
        16 cards total.
    */

    const memoryEssas =
        playableEssas.slice(
            0,
            8
        );


    let cards =
        [];


    memoryEssas.forEach(
        function(essa) {

            cards.push({
                uniqueId:
                    essa.id +
                    "-a-" +
                    Math.random(),

                essaId:
                    essa.id,

                matched:
                    false
            });


            cards.push({
                uniqueId:
                    essa.id +
                    "-b-" +
                    Math.random(),

                essaId:
                    essa.id,

                matched:
                    false
            });
        }
    );


    cards =
        shuffleESSAMemoryCards(
            cards
        );


    essaMemoryState = {

        cardBackId:
            cardBack.id,

        cards:
            cards,

        firstCardIndex:
            null,

        secondCardIndex:
            null,

        moves:
            0,

        matches:
            0,

        locked:
            false,

        finished:
            false
    };


    renderESSAMemory();
}


/* =========================================================
   GET MEMORY ESSA
========================================================= */

function getESSAMemoryEssa(
    essaId
) {

    return playableEssas.find(
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
    );
}


/* =========================================================
   RENDER MEMORY
========================================================= */

function renderESSAMemory() {

    if (!essaMemoryState) {

        showESSAMemorySetup();
        return;
    }


    resetPageTheme();


    const cardBack =
        getESSAMemoryCardBack(
            essaMemoryState.cardBackId
        );


    let cardsHTML = "";


    essaMemoryState.cards.forEach(
        function(
            card,
            index
        ) {

            const essa =
                getESSAMemoryEssa(
                    card.essaId
                );


            if (!essa) {
                return;
            }


            const faceUp =
                card.matched ||

                essaMemoryState
                    .firstCardIndex ===
                    index ||

                essaMemoryState
                    .secondCardIndex ===
                    index;


            cardsHTML += `

                <button
                    class="essa-memory-card"

                    onclick="
                        flipESSAMemoryCard(
                            ${index}
                        )
                    "

                    ${card.matched
                        ? "disabled"
                        : ""
                    }

                    aria-label="Memory card"

                    style="
                        position:relative;
                        width:100%;
                        aspect-ratio:3/4;
                        padding:0;

                        border:
                            2px solid
                            ${
                                card.matched
                                    ? "#4fb5ae"
                                    : "#dbe5e7"
                            };

                        border-radius:16px;

                        background:white;

                        overflow:hidden;

                        cursor:
                            ${
                                card.matched
                                    ? "default"
                                    : "pointer"
                            };

                        box-shadow:
                            0 4px 12px
                            rgba(0,0,0,.10);
                    "
                >

                    ${
                        faceUp

                            ? `

                                <div
                                    class="essa-memory-card-face"

                                    style="
                                        position:absolute;
                                        inset:0;

                                        display:flex;
                                        flex-direction:column;

                                        align-items:center;
                                        justify-content:center;

                                        padding:8px;

                                        background:white;
                                    "
                                >

                                    <img
                                        src="${essa.image}"

                                        alt="${escapeHTML(
                                            essa.name
                                        )}"

                                        style="
                                            width:88%;
                                            height:78%;
                                            object-fit:contain;
                                        "
                                    >


                                    <div
                                        class="essa-memory-card-name"

                                        style="
                                            font-size:12px;
                                            font-weight:bold;
                                            color:#26343b;
                                        "
                                    >

                                        ${escapeHTML(
                                            essa.name
                                        )}

                                    </div>

                                </div>

                            `

                            : `

                                <img
                                    src="${cardBack.image}"

                                    alt="Face-down memory card"

                                    style="
                                        position:absolute;
                                        inset:0;

                                        width:100%;
                                        height:100%;

                                        object-fit:cover;
                                    "
                                >

                            `
                    }

                </button>

            `;
        }
    );


    document.querySelector(
        "main"
    ).innerHTML = `

        <div
            class="essa-memory-screen"

            style="
                min-height:0;
                padding:20px;
                box-sizing:border-box;

                background-image:
                    url(
                        'arcade-backgrounds/essa-memory-bg.png'
                    );

                background-size:cover;
                background-position:center;
                background-repeat:no-repeat;
            "
        >

            <div
                class="essa-memory-wrapper"

                style="
                    max-width:850px;
                    margin:0 auto;
                "
            >


                <!-- TOP BUTTONS -->

                <div
                    class="essa-memory-top-buttons"

                    style="
                        display:flex;
                        align-items:center;
                        justify-content:space-between;
                        gap:10px;
                    "
                >

                    <button
                        type="button"

                        class="
                            play-action-button
                            primary
                            essa-memory-back
                        "

                        onclick="
                            renderPlayRoom()
                        "
                    >
                        ← 🎮 Back to Arcade
                    </button>


                    <button
                        type="button"

                        class="
                            play-action-button
                            primary
                            essa-memory-change
                        "

                        onclick="
                            showESSAMemorySetup()
                        "
                    >
                        🎴 Change Card Back
                    </button>

                </div>


                <!-- GAME PANEL -->

                <div
                    class="essa-memory-game-panel"

                    style="
                        margin-top:15px;
                        padding:24px;

                        border-radius:28px;

                        background-image:
                            linear-gradient(
                                rgba(255,255,255,.25),
                                rgba(255,255,255,.25)
                            ),
                            url(
                                'arcade-backgrounds/essa-memory-bg.png'
                            );

                        background-size:cover;
                        background-position:center;

                        border:
                            1px solid
                            #dbe5e7;

                        box-shadow:
                            0 8px 28px
                            rgba(0,0,0,.12);

                        box-sizing:border-box;
                    "
                >


                    <!-- GAME HEADER -->

                    <div
                        class="essa-memory-game-header"

                        style="
                            display:flex;
                            align-items:center;
                            justify-content:space-between;
                            gap:12px;
                            flex-wrap:wrap;
                            margin-bottom:18px;
                        "
                    >

                        <h1
                            class="essa-memory-title"

                            style="
                                margin:0;
                            "
                        >
                            🧠 ESSA Memory
                        </h1>


                        <div
                            class="essa-memory-score"

                            style="
                                display:flex;
                                gap:10px;
                                flex-wrap:wrap;
                            "
                        >

                            <div
                                class="essa-memory-score-pill"

                                style="
                                    padding:8px 13px;
                                    border-radius:999px;
                                    background:white;
                                    font-weight:bold;
                                "
                            >
                                🎯 Matches:
                                ${essaMemoryState.matches}/8
                            </div>


                            <div
                                class="essa-memory-score-pill"

                                style="
                                    padding:8px 13px;
                                    border-radius:999px;
                                    background:white;
                                    font-weight:bold;
                                "
                            >
                                👣 Moves:
                                ${essaMemoryState.moves}
                            </div>

                        </div>

                    </div>


                    <!-- CARDS -->

                    <div
                        class="essa-memory-grid"

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

                            gap:12px;
                        "
                    >

                        ${cardsHTML}

                    </div>


                </div>

            </div>

        </div>

    `;
}

/* =========================================================
   FLIP MEMORY CARD
========================================================= */

function flipESSAMemoryCard(
    cardIndex
) {

    if (
        !essaMemoryState ||
        essaMemoryState.locked ||
        essaMemoryState.finished
    ) {

        return;
    }


    const card =
        essaMemoryState
            .cards[
                cardIndex
            ];


    if (
        !card ||
        card.matched
    ) {

        return;
    }


    if (
        essaMemoryState
            .firstCardIndex ===
        cardIndex
    ) {

        return;
    }


    if (
        essaMemoryState
            .firstCardIndex ===
        null
    ) {

        essaMemoryState
            .firstCardIndex =
            cardIndex;

        renderESSAMemory();

        return;
    }


    essaMemoryState
        .secondCardIndex =
        cardIndex;


    essaMemoryState.moves++;


    renderESSAMemory();


    checkESSAMemoryMatch();
}


/* =========================================================
   CHECK MEMORY MATCH
========================================================= */

function checkESSAMemoryMatch() {

    if (!essaMemoryState) {
        return;
    }


    const firstIndex =
        essaMemoryState
            .firstCardIndex;


    const secondIndex =
        essaMemoryState
            .secondCardIndex;


    if (
        firstIndex === null ||
        secondIndex === null
    ) {

        return;
    }


    const firstCard =
        essaMemoryState
            .cards[
                firstIndex
            ];


    const secondCard =
        essaMemoryState
            .cards[
                secondIndex
            ];


    essaMemoryState.locked =
        true;


    if (
        firstCard.essaId ===
        secondCard.essaId
    ) {

        window.setTimeout(
            function() {

                firstCard.matched =
                    true;

                secondCard.matched =
                    true;


                essaMemoryState
                    .matches++;


                essaMemoryState
                    .firstCardIndex =
                    null;

                essaMemoryState
                    .secondCardIndex =
                    null;

                essaMemoryState.locked =
                    false;


                if (
                    essaMemoryState
                        .matches >=
                    8
                ) {

                    finishESSAMemory();

                    return;
                }



                renderESSAMemory();

            },
            450
        );

    } else {

        window.setTimeout(
            function() {

                essaMemoryState
                    .firstCardIndex =
                    null;

                essaMemoryState
                    .secondCardIndex =
                    null;

                essaMemoryState.locked =
                    false;


                renderESSAMemory();

            },
            900
        );
    }
}


/* =========================================================
   MEMORY XP
========================================================= */

function awardESSAMemoryXP() {

    const playData =
        getSavedPlayData();


    /*
        Base reward for completing
        the entire Memory board.
    */

    const xpReward =
        20;


    addTrainerXP(
    playData,
    xpReward
);


    savePlayData(
        playData
    );


    return xpReward;
}


/* =========================================================
   FINISH MEMORY
========================================================= */

function finishESSAMemory() {

    if (!essaMemoryState) {
        return;
    }


    essaMemoryState.finished =
        true;


    const moves =
        essaMemoryState.moves;


    const cardBackId =
        essaMemoryState
            .cardBackId;


    const xpReward =
        awardESSAMemoryXP();


    /*
        Coin reward:
        Weekdays = 40 coins
        Weekends = 100 coins
    */

    const coinReward =
        getPlayGameCoinReward(
            40
        );


    addPendingPlayCoins(
        coinReward
    );


    resetPageTheme();


    document.querySelector(
        "main"
    ).innerHTML = `

        <div
            style="
                max-width:700px;
                margin:0 auto;
                text-align:center;
            "
        >

            <div
                style="
                    padding:35px;

                    border-radius:28px;

                    background-image:
                        linear-gradient(
                            rgba(255,255,255,.88),
                            rgba(255,255,255,.88)
                        ),
                        url(
                            'arcade-backgrounds/essa-memory-bg.png'
                        );

                    background-size:cover;
                    background-position:center;

                    border:
                        1px solid
                        #dbe5e7;

                    box-shadow:
                        0 8px 28px
                        rgba(0,0,0,.12);
                "
            >

                <div
                    style="
                        font-size:70px;
                    "
                >
                    🎉
                </div>


                <h1>
                    You matched every ESSA!
                </h1>


                <p
                    style="
                        font-size:18px;
                        color:#68777b;
                    "
                >
                    You finished in
                    <strong>
                        ${moves}
                    </strong>
                    moves.
                </p>


                <p
                    style="
                        font-size:18px;
                        font-weight:bold;
                        color:#3b9f99;
                    "
                >
                    ⭐ +${xpReward}
                    Trainer XP
                </p>


                <p
                    style="
                        font-size:18px;
                        font-weight:bold;
                    "
                >
                    🪙 +${coinReward}
                    Coins Earned!
                </p>


                <div
                    style="
                        display:flex;
                        justify-content:center;
                        gap:12px;
                        flex-wrap:wrap;
                        margin-top:25px;
                    "
                >

                    <button
                        onclick="
                            startESSAMemory(
                                '${cardBackId}'
                            )
                        "
                    >
                        🔄 Play Again
                    </button>


                    <button
                        onclick="
                            showESSAMemorySetup()
                        "
                    >
                        🎴 Choose Card Back
                    </button>


                    <button
                        type="button"

                        onclick="
                            renderPlayRoom()
                        "

                        style="
                            display:flex;
                            align-items:center;
                            gap:8px;

                            padding:10px 16px;

                            border:none;
                            border-radius:14px;

                            background:
                                var(
                                    --user-theme-color,
                                    #4fb5ae
                                );

                            color:white;

                            font-weight:600;
                            font-size:14px;

                            cursor:pointer;
                            white-space:nowrap;
                        "
                    >
                        <span
                            style="
                                font-size:18px;
                                line-height:1;
                            "
                        >
                            ←
                        </span>

                        <span>
                            🎮
                        </span>

                        <span>
                            Back to Arcade
                        </span>
                    </button>

                </div>

            </div>

        </div>
    `;
}

/* =========================================================
   ESSA TILES
========================================================= */
var ESSA_TILES_TRAY_LIMIT = 7;

let essaTilesState = null;

function openESSATiles() {
    stopPlayHouseTimers();
    startESSATiles();
}

function startESSATiles() {

    const tileEssas =
        playableEssas.slice(0, 8);

    const tiles = [];

    let tileNumber = 0;

    tileEssas.forEach(function(essa) {

        for (let i = 0; i < 6; i++) {

            tiles.push({
                id: "essa-tile-" + tileNumber,
                essaId: essa.id,
                name: essa.name,
                image: essa.image,
                layer: 0,
                x: 0,
                y: 0,
                removed: false
            });

            tileNumber++;
        }
    });

    shuffleESSATilesArray(tiles);

    const positions =
        makeESSATilesPositions();

    tiles.forEach(function(tile, index) {

        tile.layer =
            positions[index].layer;

        tile.x =
            positions[index].x;

        tile.y =
            positions[index].y;
    });

    essaTilesState = {
        tiles: tiles,
        tray: [],
        matches: 0,
        moves: 0,
        gameOver: false
    };

    renderESSATiles();
}
function makeESSATilesPositions() {

    const positions = [];

    const bottomX = [
        12,
        27,
        42,
        57,
        72,
        87
    ];

    const bottomY = [
        13,
        31,
        49,
        67
    ];

    bottomY.forEach(function(y) {

        bottomX.forEach(function(x) {

            positions.push({
                layer: 0,
                x: x,
                y: y
            });
        });
    });


    const middleX = [
        20,
        35,
        50,
        65,
        80
    ];

    const middleY = [
        22,
        40,
        58
    ];

    middleY.forEach(function(y) {

        middleX.forEach(function(x) {

            positions.push({
                layer: 1,
                x: x,
                y: y
            });
        });
    });


    const topX = [
        35,
        50,
        65
    ];

    const topY = [
        28,
        43,
        58
    ];

    topY.forEach(function(y) {

        topX.forEach(function(x) {

            positions.push({
                layer: 2,
                x: x,
                y: y
            });
        });
    });


    return positions;
}


function shuffleESSATilesArray(array) {

    for (
        let i = array.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() *
                (i + 1)
            );

        const temp =
            array[i];

        array[i] =
            array[j];

        array[j] =
            temp;
    }

    return array;
}
function isESSATileCovered(tile) {

    if (
        !essaTilesState ||
        tile.removed
    ) {
        return true;
    }

    return essaTilesState.tiles.some(
        function(otherTile) {

            if (otherTile.removed) {
                return false;
            }

            if (
                otherTile.layer <=
                tile.layer
            ) {
                return false;
            }

            const horizontalDistance =
                Math.abs(
                    otherTile.x -
                    tile.x
                );

            const verticalDistance =
                Math.abs(
                    otherTile.y -
                    tile.y
                );

            return (
                horizontalDistance < 14 &&
                verticalDistance < 17
            );
        }
    );
}


function renderESSATiles() {

    if (!essaTilesState) {
        return;
    }

    resetPageTheme();

    const main =
        document.querySelector(
            "main"
        );

    if (!main) {
        return;
    }

    const activeTiles =
        essaTilesState.tiles.filter(
            function(tile) {
                return !tile.removed;
            }
        );

    const sortedTiles =
        [...activeTiles].sort(
            function(a, b) {
                return (
                    a.layer -
                    b.layer
                );
            }
        );

    let tileHTML = "";

    sortedTiles.forEach(
        function(tile) {

            const covered =
                isESSATileCovered(
                    tile
                );

            tileHTML += `
                <button
                    type="button"

                    onclick="
                        selectESSATile(
                            '${tile.id}'
                        )
                    "

                    ${covered ? "disabled" : ""}

                    style="
                        position:absolute;
                        left:${tile.x}%;
                        top:${tile.y}%;
                        transform:translate(-50%, -50%);

                        width:72px;
                        height:72px;

                        padding:5px;

                        border:3px solid white;
                        border-radius:12px;

                        background:
                            ${covered
                                ? "#d8dfe1"
                                : "#ffffff"
                            };

                        box-shadow:
                            0 5px 10px
                            rgba(0,0,0,.25);

                        cursor:
                            ${covered
                                ? "default"
                                : "pointer"
                            };

                        opacity:
                            ${covered
                                ? ".65"
                                : "1"
                            };

                        z-index:
                            ${20 + tile.layer};

                        overflow:hidden;
                    "
                >

                    <img
                        src="${tile.image}"
                        alt="${escapeHTML(tile.name)}"

                        draggable="false"

                        style="
                            width:100%;
                            height:100%;
                            object-fit:contain;
                            pointer-events:none;
                        "
                    >

                </button>
            `;
        }
    );

    const trayHTML =
        makeESSATilesTrayHTML();

    main.innerHTML = `
        <div
            style="
                min-height:
                    calc(100vh - 120px);

                padding:18px;

                box-sizing:border-box;

                background-image:
                    url(
                        'arcade-backgrounds/essa-tiles-bg.png'
                    );

                background-size:cover;
                background-position:center;
            "
        >

            <div
                style="
                    max-width:900px;
                    margin:0 auto;
                "
            >

                <div
                    style="
                        display:flex;
                        justify-content:space-between;
                        align-items:center;
                        gap:12px;
                        flex-wrap:wrap;

                        margin-bottom:12px;

                        padding:12px 15px;

                        background:
                            rgba(255,255,255,.92);

                        border-radius:16px;
                    "
                >

                   <button
    type="button"

    onclick="
        renderPlayRoom()
    "

    style="
        display:flex;
        align-items:center;
        gap:8px;

        padding:10px 16px;

        border:none;
        border-radius:14px;

        background:
            var(
                --user-theme-color,
                #4fb5ae
            );

        color:white;

        font-weight:600;
        font-size:14px;

        cursor:pointer;
        white-space:nowrap;
    "
>
    <span
        style="
            font-size:18px;
            line-height:1;
        "
    >
        ←
    </span>

    <span>🎮</span>

    <span>
        Back to Arcade
    </span>
</button>
                    <strong>
                        🧩 ESSA Tiles
                    </strong>

                    <strong>
                        Tiles:
                        ${activeTiles.length}
                    </strong>

                </div>

                <div
                    style="
                        position:relative;

                        width:100%;
                        height:220px;

                        background:
                            rgba(255,255,255,.12);

                        border:
                            3px solid
                            rgba(255,255,255,.75);

                        border-radius:22px;

                        overflow:hidden;
                    "
                >

                    ${tileHTML}

                </div>

                ${trayHTML}

            </div>

        </div>
    `;
}
/* =========================================================
   ESSA TILES - TRAY
========================================================= */

function makeESSATilesTrayHTML() {

    if (!essaTilesState) {
        return "";
    }

    let slotsHTML = "";

    for (
        let i = 0;
        i < ESSA_TILES_TRAY_LIMIT;
        i++
    ) {

        const tile =
            essaTilesState.tray[i];

        if (tile) {

            slotsHTML += `
                <div
                    style="
                        width:38px;
height:38px;

                        display:flex;
                        align-items:center;
                        justify-content:center;

                        background:white;

                        border:
                            2px solid
                            #cfd9dc;

                        border-radius:12px;

                        box-shadow:
                            0 3px 8px
                            rgba(0,0,0,.15);

                        overflow:hidden;
                    "
                >

                    <img
                        src="${tile.image}"

                        alt="${escapeHTML(
                            tile.name
                        )}"

                        draggable="false"

                        style="
                            width:90%;
                            height:90%;
                            object-fit:contain;
                        "
                    >

                </div>
            `;

        } else {

            slotsHTML += `
                <div
                    style="
                       width:38px;
height:38px;

                        background:
                            rgba(
                                255,
                                255,
                                255,
                                .55
                            );

                        border:
                            2px dashed
                            rgba(
                                255,
                                255,
                                255,
                                .9
                            );

                        border-radius:12px;
                    "
                >
                </div>
            `;
        }
    }


    return `
        <div
            style="
                margin-top:5px;

padding:5px;

                background:
                    rgba(
                        38,
                        52,
                        59,
                        .85
                    );

                border-radius:18px;
            "
        >

            <div
                style="
                    color:white;
                    font-weight:bold;
                    text-align:center;
                    margin-bottom:3px;
                "
            >
                Tile Tray
                (${essaTilesState.tray.length}/${ESSA_TILES_TRAY_LIMIT})
            </div>


            <div
                style="
                    display:flex;
                    justify-content:center;
                    gap:7px;
                    flex-wrap:wrap;
                "
            >

                ${slotsHTML}

            </div>

        </div>
    `;
}


/* =========================================================
   ADD TILE TO TRAY
========================================================= */

function insertESSATileIntoTray(tile) {

    const tray =
        essaTilesState.tray;


    let lastMatchingIndex =
        -1;


    for (
        let i = 0;
        i < tray.length;
        i++
    ) {

        if (
            tray[i].essaId ===
            tile.essaId
        ) {

            lastMatchingIndex =
                i;
        }
    }


    if (
        lastMatchingIndex ===
        -1
    ) {

        tray.push(
            tile
        );

    } else {

        tray.splice(
            lastMatchingIndex + 1,
            0,
            tile
        );
    }
}
/* =========================================================
   ESSA TILES - SELECT TILE
========================================================= */

function selectESSATile(tileId) {

    if (
        !essaTilesState ||
        essaTilesState.gameOver
    ) {
        return;
    }


    const tile =
        essaTilesState.tiles.find(
            function(item) {

                return (
                    item.id ===
                    tileId
                );
            }
        );


    if (
        !tile ||
        tile.removed
    ) {
        return;
    }


    if (
        isESSATileCovered(
            tile
        )
    ) {
        return;
    }


    tile.removed =
        true;


    essaTilesState.moves++;


    insertESSATileIntoTray(
        tile
    );


    clearESSATilesTrayMatch();


    const remainingTiles =
        essaTilesState.tiles.filter(
            function(item) {

                return (
                    !item.removed
                );
            }
        );


    if (
        remainingTiles.length === 0 &&
        essaTilesState.tray.length === 0
    ) {

        finishESSATiles(
            true
        );

        return;
    }


    if (
        essaTilesState.tray.length >=
        ESSA_TILES_TRAY_LIMIT
    ) {

        finishESSATiles(
            false
        );

        return;
    }


    renderESSATiles();
}


/* =========================================================
   ESSA TILES - CLEAR 3 MATCHING
========================================================= */

function clearESSATilesTrayMatch() {

    if (!essaTilesState) {
        return;
    }


    const tray =
        essaTilesState.tray;


    const counts = {};


    tray.forEach(
        function(tile) {

            if (
                !counts[
                    tile.essaId
                ]
            ) {

                counts[
                    tile.essaId
                ] = [];
            }


            counts[
                tile.essaId
            ].push(
                tile
            );
        }
    );


    const matchingEssaId =
        Object.keys(
            counts
        ).find(
            function(essaId) {

                return (
                    counts[
                        essaId
                    ].length >= 3
                );
            }
        );


    if (!matchingEssaId) {
        return;
    }


    let removedCount =
        0;


    for (
        let i = tray.length - 1;
        i >= 0;
        i--
    ) {

        if (
            tray[i].essaId ===
                matchingEssaId &&
            removedCount < 3
        ) {

            tray.splice(
                i,
                1
            );

            removedCount++;
        }
    }


    essaTilesState.matches++;
}
/* =========================================================
   ESSA TILES - XP REWARD
========================================================= */

function awardESSATilesXP(won) {

    const playData =
        getSavedPlayData();


    const xpAmount =
        won
            ? 25
            : 5;


    playData.trainerXP =
        Number(
            playData.trainerXP
        ) || 0;


    addTrainerXP(
    playData,
    xpAmount
);


    if (
        !Array.isArray(
            playData.unlockedEssaIds
        )
    ) {

        playData.unlockedEssaIds = [
            "moocow"
        ];
    }



    savePlayData(
        playData
    );


    return xpAmount;
}


/* =========================================================
   ESSA TILES - FINISH GAME
========================================================= */

function finishESSATiles(won) {

    if (!essaTilesState) {
        return;
    }


    essaTilesState.gameOver =
        true;


    const xpEarned =
        awardESSATilesXP(
            won
        );


    /*
        Coin reward:
        Weekdays = 50 coins
        Weekends = 100 coins
    */

    if (
        won
    ) {

        addPendingPlayCoins(
            getPlayGameCoinReward(
                50
            )
        );
    }


    const moves =
        essaTilesState.moves;


    const matches =
        essaTilesState.matches;


    const main =
        document.querySelector(
            "main"
        );


    if (!main) {
        return;
    }


    main.innerHTML = `
        <div
            style="
                min-height:
                    calc(100vh - 120px);

                display:flex;
                align-items:center;
                justify-content:center;

                padding:20px;

                box-sizing:border-box;

                background-image:
                    url(
                        'arcade-backgrounds/essa-tiles-bg.png'
                    );

                background-size:cover;
                background-position:center;
            "
        >

            <div
                style="
                    width:100%;
                    max-width:520px;

                    padding:30px;

                    text-align:center;

                    background:
                        rgba(
                            255,
                            255,
                            255,
                            .94
                        );

                    border-radius:24px;

                    box-shadow:
                        0 8px 30px
                        rgba(0,0,0,.2);
                "
            >

                <h1>
                    ${
                        won
                            ? "🎉 You Cleared the Board!"
                            : "😵 Tray Full!"
                    }
                </h1>


                <p
                    style="
                        font-size:18px;
                        line-height:1.6;
                    "
                >

                    ${
                        won
                            ? "You matched every ESSA tile!"
                            : "The tray filled up before the board was cleared."
                    }

                </p>


                <p>
                    <strong>
                        Moves:
                    </strong>

                    ${moves}
                </p>


                <p>
                    <strong>
                        Matches:
                    </strong>

                    ${matches}
                </p>


                <p>
                    <strong>
                        XP Earned:
                    </strong>

                    +${xpEarned}
                </p>


                ${
                    won

                        ? `

                            <p
                                style="
                                    font-weight:bold;
                                "
                            >
                                🪙 +${getPlayGameCoinReward(
                                    50
                                )} Coins Earned!
                            </p>

                        `

                        : ""
                }


                <div
                    style="
                        display:flex;
                        gap:12px;

                        justify-content:center;
                        flex-wrap:wrap;

                        margin-top:22px;
                    "
                >

                    <button
                        type="button"

                        onclick="
                            startESSATiles()
                        "
                    >
                        🔄 Play Again
                    </button>


                    <button
                        type="button"

                        onclick="
                            renderPlayRoom()
                        "

                        style="
                            display:flex;
                            align-items:center;
                            gap:8px;

                            padding:10px 16px;

                            border:none;
                            border-radius:14px;

                            background:
                                var(
                                    --user-theme-color,
                                    #4fb5ae
                                );

                            color:white;

                            font-weight:600;
                            font-size:14px;

                            cursor:pointer;
                            white-space:nowrap;
                        "
                    >
                        <span
                            style="
                                font-size:18px;
                                line-height:1;
                            "
                        >
                            ←
                        </span>

                        <span>
                            🎮
                        </span>

                        <span>
                            Back to Arcade
                        </span>
                    </button>

                </div>

            </div>

        </div>
    `;
}

/* =========================================================
   ESSA TIC-TAC-TOE
========================================================= */

let essaTicTacToeState = null;

function openESSATicTacToe() {
    onclick="openESSATicTacToe()"
    stopPlayHouseTimers();
    showESSATicTacToeSetup();
}

function showESSATicTacToeSetup() {

    resetPageTheme();

    const main =
        document.querySelector(
            "main"
        );

    if (!main) {
        return;
    }


    const opponentOptions =
        playableEssas
            .slice(0, 8)
            .map(
                function(essa) {

                    return `

                        <button
                            type="button"

                            class="essa-tictactoe-opponent-option"

                            onclick="
                                startESSATicTacToe(
                                    '${essa.id}'
                                )
                            "

                            style="
                                width:130px;
                                padding:12px;

                                background:white;

                                border:
                                    2px solid
                                    #d7e1e4;

                                border-radius:16px;

                                cursor:pointer;
                            "
                        >

                            <img
                                src="${essa.image}"

                                alt="${escapeHTML(
                                    essa.name
                                )}"

                                style="
                                    width:80px;
                                    height:80px;
                                    object-fit:contain;
                                "
                            >

                            <div
                                class="essa-tictactoe-opponent-name"

                                style="
                                    margin-top:6px;
                                    font-weight:bold;
                                "
                            >
                                ${escapeHTML(
                                    essa.name
                                )}
                            </div>

                        </button>

                    `;
                }
            )
            .join("");


    main.innerHTML = `

        <div
            class="essa-tictactoe-setup-screen"

            style="
                min-height:
                    calc(
                        100vh -
                        120px
                    );

                padding:20px;

                box-sizing:border-box;

                background-image:
                    url(
                        'arcade-backgrounds/essa-tictactoe-bg.png'
                    );

                background-size:cover;
                background-position:center;
                background-repeat:no-repeat;
            "
        >

            <div
                class="essa-tictactoe-setup-wrapper"

                style="
                    max-width:760px;
                    margin:0 auto;
                "
            >

                <div
                    class="essa-tictactoe-setup-panel"

                    style="
                        background:
                            rgba(
                                255,
                                255,
                                255,
                                .94
                            );

                        padding:24px;

                        border-radius:22px;

                        text-align:center;
                    "
                >


                    <div
                        class="essa-tictactoe-setup-topbar"
                    >

                        <button
                            type="button"

                            class="
                                play-action-button
                                primary
                                essa-tictactoe-setup-back
                            "

                            onclick="
                                renderPlayRoom()
                            "
                        >
                            ← 🎮 Back to Arcade
                        </button>


                        <h1
                            class="essa-tictactoe-setup-title"

                            style="
                                margin:0;
                            "
                        >
                            ❌⭕ ESSA Tic-Tac-Toe
                        </h1>


                        <div
                            class="essa-tictactoe-setup-spacer"
                        ></div>

                    </div>


                    <p
                        class="essa-tictactoe-setup-description"
                    >
                        Choose the ESSA you want to play against!
                    </p>


                    <div
                        class="essa-tictactoe-opponent-grid"

                        style="
                            display:flex;
                            flex-wrap:wrap;
                            justify-content:center;

                            gap:12px;

                            margin-top:20px;
                        "
                    >

                        ${opponentOptions}

                    </div>


                </div>

            </div>

        </div>

    `;
}

/* =========================================================
   ESSA TIC-TAC-TOE - START GAME
========================================================= */

function startESSATicTacToe(opponentId) {

    const opponent =
        playableEssas.find(
            function(essa) {
                return essa.id === opponentId;
            }
        );

    if (!opponent) {
        return;
    }

    essaTicTacToeState = {
        opponent: opponent,
        board: [
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            ""
        ],
        playerSymbol: "X",
        opponentSymbol: "O",
        currentTurn: "player",
        gameOver: false
    };

    renderESSATicTacToe();
}


/* =========================================================
   ESSA TIC-TAC-TOE - RENDER BOARD
========================================================= */

function renderESSATicTacToe() {

    if (!essaTicTacToeState) {
        return;
    }

    resetPageTheme();

    const main =
        document.querySelector(
            "main"
        );

    if (!main) {
        return;
    }

    const state =
        essaTicTacToeState;

    let boardHTML = "";


    state.board.forEach(
        function(cell, index) {

            boardHTML += `

                <button
                    type="button"

                    class="essa-tictactoe-square"

                    data-square="${index}"

                    onclick="
                        selectESSATicTacToeSquare(
                            ${index}
                        )
                    "

                    ${cell || state.gameOver ? "disabled" : ""}

                    style="
                        width:110px;
                        height:110px;

                        display:flex;
                        align-items:center;
                        justify-content:center;

                        font-size:58px;
                        font-weight:bold;

                        background:
                            rgba(
                                255,
                                255,
                                255,
                                .95
                            );

                        border:
                            3px solid
                            #26343b;

                        border-radius:16px;

                        cursor:
                            ${
                                cell ||
                                state.gameOver
                                    ? "default"
                                    : "pointer"
                            };
                    "
                >
                    ${cell}
                </button>

            `;
        }
    );


    main.innerHTML = `

        <div
            class="essa-tictactoe-screen"

            style="
                min-height:
                    calc(
                        100vh -
                        120px
                    );

                padding:20px;

                box-sizing:border-box;

                background-image:
                    url(
                        'arcade-backgrounds/essa-tictactoe-bg.png'
                    );

                background-size:cover;
                background-position:center;
                background-repeat:no-repeat;
            "
        >

            <div
                class="essa-tictactoe-wrapper"

                style="
                    max-width:760px;
                    margin:0 auto;
                "
            >

                <div
                    class="essa-tictactoe-panel"

                    style="
                        background:
                            rgba(
                                255,
                                255,
                                255,
                                .94
                            );

                        padding:20px;

                        border-radius:22px;

                        text-align:center;
                    "
                >


                    <!-- TOP BAR -->

                    <div
                        class="essa-tictactoe-topbar"
                    >

                        <button
                            type="button"

                            class="
                                play-action-button
                                primary
                                essa-tictactoe-back
                            "

                            onclick="
                                renderPlayRoom()
                            "
                        >
                            ← 🎮 Back to Arcade
                        </button>


                        <h1
                            class="essa-tictactoe-title"

                            style="
                                margin:0;
                            "
                        >
                            ❌⭕ ESSA Tic-Tac-Toe
                        </h1>


                        <button
                            type="button"

                            class="
                                play-action-button
                                primary
                                essa-tictactoe-change
                            "

                            onclick="
                                showESSATicTacToeSetup()
                            "
                        >
                            🐾 Change ESSA
                        </button>

                    </div>


                    <!-- OPPONENT -->

                    <div
                        class="essa-tictactoe-opponent"

                        style="
                            display:flex;
                            align-items:center;
                            justify-content:center;

                            gap:12px;

                            margin-bottom:18px;
                        "
                    >

                        <img
                            class="essa-tictactoe-opponent-image"

                            src="${state.opponent.image}"

                            alt="${escapeHTML(
                                state.opponent.name
                            )}"

                            style="
                                width:70px;
                                height:70px;

                                object-fit:contain;
                            "
                        >


                        <div
                            class="essa-tictactoe-opponent-text"
                        >
                            You're playing against

                            <strong>
                                ${escapeHTML(
                                    state.opponent.name
                                )}
                            </strong>
                        </div>

                    </div>


                    <!-- TURN -->

                    <div
                        class="essa-tictactoe-turn"

                        style="
                            margin-bottom:16px;
                            font-weight:bold;
                        "
                    >

                        ${
                            state.currentTurn ===
                            "player"

                                ? "Your turn — you're X!"

                                : state.opponent.name +
                                  "'s turn!"
                        }

                    </div>


                    <!-- BOARD -->

                    <div
                        id="essa-tictactoe-board"

                        class="essa-tictactoe-board"

                        style="
                            display:grid;

                            grid-template-columns:
                                repeat(
                                    3,
                                    110px
                                );

                            gap:10px;

                            justify-content:center;
                        "
                    >

                        ${boardHTML}

                    </div>


                </div>

            </div>

        </div>

    `;
}

/* =========================================================
   ESSA TIC-TAC-TOE - PLAYER MOVE
========================================================= */

function selectESSATicTacToeSquare(index) {

    if (!essaTicTacToeState) {
        return;
    }

    const state =
        essaTicTacToeState;

    if (
        state.gameOver ||
        state.currentTurn !== "player" ||
        state.board[index] !== ""
    ) {
        return;
    }

    state.board[index] =
        state.playerSymbol;

    const result =
        checkESSATicTacToeResult();

    if (result) {
        finishESSATicTacToe(
            result
        );

        return;
    }

    state.currentTurn =
        "opponent";

    renderESSATicTacToe();

    setTimeout(
        function() {
            makeESSATicTacToeOpponentMove();
        },
        700
    );
}


/* =========================================================
   ESSA TIC-TAC-TOE - CHECK BOARD
========================================================= */

function checkESSATicTacToeResult() {

    if (!essaTicTacToeState) {
        return null;
    }

    const board =
        essaTicTacToeState.board;

    const winningLines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],

        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],

        [0, 4, 8],
        [2, 4, 6]
    ];

    for (
        let i = 0;
        i < winningLines.length;
        i++
    ) {

        const line =
            winningLines[i];

        const a =
            line[0];

        const b =
            line[1];

        const c =
            line[2];

        if (
            board[a] !== "" &&
            board[a] === board[b] &&
            board[a] === board[c]
        ) {

            if (
                board[a] ===
                essaTicTacToeState.playerSymbol
            ) {
                return "player";
            }

            return "opponent";
        }
    }

    const boardFull =
        board.every(
            function(cell) {
                return cell !== "";
            }
        );

    if (boardFull) {
        return "tie";
    }

    return null;
}
/* =========================================================
   ESSA TIC-TAC-TOE - OPPONENT MOVE
========================================================= */

function makeESSATicTacToeOpponentMove() {

    if (!essaTicTacToeState) {
        return;
    }

    const state =
        essaTicTacToeState;

    if (
        state.gameOver ||
        state.currentTurn !== "opponent"
    ) {
        return;
    }


    const emptySquares = [];

    state.board.forEach(
        function(cell, index) {

            if (cell === "") {
                emptySquares.push(
                    index
                );
            }
        }
    );


    if (
        emptySquares.length === 0
    ) {

        finishESSATicTacToe(
            "tie"
        );

        return;
    }


    const randomIndex =
        Math.floor(
            Math.random() *
            emptySquares.length
        );


    const chosenSquare =
        emptySquares[
            randomIndex
        ];


    state.board[
        chosenSquare
    ] =
        state.opponentSymbol;


    const result =
        checkESSATicTacToeResult();


    if (result) {

        renderESSATicTacToe();

        setTimeout(
            function() {

                finishESSATicTacToe(
                    result
                );

            },
            500
        );

        return;
    }


    state.currentTurn =
        "player";


    renderESSATicTacToe();
}
/* =========================================================
   ESSA TIC-TAC-TOE - OPPONENT SCOOT ANIMATION
========================================================= */

function animateESSATicTacToeOpponent(
    chosenSquare,
    callback
) {

    const opponent =
        essaTicTacToeState
            ? essaTicTacToeState.opponent
            : null;

    if (!opponent) {
        callback();
        return;
    }

    const board =
        document.getElementById(
            "essa-tictactoe-board"
        );

    if (!board) {
        callback();
        return;
    }

    const square =
        board.querySelector(
            `[data-square="${chosenSquare}"]`
        );

    if (!square) {
        callback();
        return;
    }

    const tappingEssa =
        document.createElement(
            "img"
        );

    tappingEssa.src =
        opponent.image;

    tappingEssa.alt =
        opponent.name;

    tappingEssa.style.position =
        "absolute";

    tappingEssa.style.width =
        "60px";

    tappingEssa.style.height =
        "60px";

    tappingEssa.style.objectFit =
        "contain";

    tappingEssa.style.left =
        "50%";

    tappingEssa.style.top =
        "50%";

    tappingEssa.style.transform =
        "translate(-50%, -50%) scale(.8)";

    tappingEssa.style.opacity =
        "0";

    tappingEssa.style.zIndex =
        "50";

    tappingEssa.style.pointerEvents =
        "none";

    tappingEssa.style.transition =
        "transform .2s ease, opacity .2s ease";

    square.style.position =
        "relative";

    square.appendChild(
        tappingEssa
    );

    requestAnimationFrame(
        function() {

            tappingEssa.style.opacity =
                "1";

            tappingEssa.style.transform =
                "translate(-50%, -50%) scale(1)";
        }
    );

    setTimeout(
        function() {

            callback();

            tappingEssa.style.opacity =
                "0";

            tappingEssa.style.transform =
                "translate(-50%, -50%) scale(.8)";

            setTimeout(
                function() {
                    tappingEssa.remove();
                },
                250
            );

        },
        500
    );
}
/* =========================================================
   ESSA TIC-TAC-TOE - ANIMATED OPPONENT MOVE
========================================================= */

function makeESSATicTacToeOpponentMove() {

    if (!essaTicTacToeState) {
        return;
    }

    const state =
        essaTicTacToeState;

    if (
        state.gameOver ||
        state.currentTurn !== "opponent"
    ) {
        return;
    }


    const emptySquares = [];

    state.board.forEach(
        function(cell, index) {

            if (cell === "") {
                emptySquares.push(index);
            }
        }
    );


    if (emptySquares.length === 0) {

        finishESSATicTacToe(
            "tie"
        );

        return;
    }


    const randomIndex =
        Math.floor(
            Math.random() *
            emptySquares.length
        );


    const chosenSquare =
        emptySquares[randomIndex];


    animateESSATicTacToeOpponent(
        chosenSquare,

        function() {

            state.board[
                chosenSquare
            ] =
                state.opponentSymbol;


            const result =
                checkESSATicTacToeResult();


            if (result) {

                renderESSATicTacToe();

                setTimeout(
                    function() {

                        finishESSATicTacToe(
                            result
                        );

                    },
                    500
                );

                return;
            }


            state.currentTurn =
                "player";


            renderESSATicTacToe();
        }
    );
}

/* =========================================================
   ESSA TIC-TAC-TOE - XP
========================================================= */

function awardESSATicTacToeXP(
    result
) {

    const playData =
        getSavedPlayData();


    let xpAmount = 0;


    if (
        result === "player"
    ) {

        xpAmount = 20;

    } else if (
        result === "tie"
    ) {

        xpAmount = 10;

    } else {

        xpAmount = 5;
    }


    const oldLevel =
        Number(
            playData.trainerLevel
        ) || 1;


    addTrainerXP(
        playData,
        xpAmount
    );


    const newLevel =
        Number(
            playData.trainerLevel
        ) || 1;


    /*
        Tic Tac Toe reward:
        5 coins for every
        Trainer Level reached.
    */

    if (
        newLevel >
        oldLevel
    ) {

        const levelsReached =
            newLevel -
            oldLevel;


        playData.pendingCoins =
            (
                Number(
                    playData.pendingCoins
                ) || 0
            ) +
            (
                levelsReached *
                5
            );
    }


    savePlayData(
        playData
    );


    return xpAmount;
}

/* =========================================================
   ESSA TIC-TAC-TOE - FINISH GAME
========================================================= */

function finishESSATicTacToe(
    result
) {

    if (!essaTicTacToeState) {
        return;
    }


    essaTicTacToeState.gameOver =
        true;


    const opponent =
        essaTicTacToeState.opponent;


    const xpEarned =
        awardESSATicTacToeXP(
            result
        );


    /*
        Player wins:
        earn 5 MooCow Coins normally.

        On Saturday and Sunday,
        the game reward becomes
        100 MooCow Coins.

        These go into pendingCoins
        so they appear physically
        on the Playroom floor.
    */

    if (
        result === "player"
    ) {

        addPendingPlayCoins(
            getPlayGameCoinReward(
                5
            )
        );
    }


    let title = "";

    let message = "";


    if (
        result === "player"
    ) {

        title =
            "🎉 You Won!";

        message =
            "You beat " +
            opponent.name +
            "!";

    } else if (
        result === "opponent"
    ) {

        title =
            "🐶 " +
            opponent.name +
            " Won!";

        message =
            opponent.name +
            " got three in a row!";

    } else {

        title =
            "🤝 It's a Tie!";

        message =
            "Nobody got three in a row!";
    }


    const main =
        document.querySelector(
            "main"
        );


    if (!main) {
        return;
    }


    main.innerHTML = `

        <div
            style="
                min-height:
                    calc(
                        100vh - 120px
                    );

                display:flex;
                align-items:center;
                justify-content:center;

                padding:20px;

                box-sizing:border-box;

                background-image:
                    url(
                        'arcade-backgrounds/essa-tictactoe-bg.png'
                    );

                background-size:cover;
                background-position:center;
            "
        >

            <div
                style="
                    width:100%;
                    max-width:520px;

                    padding:30px;

                    text-align:center;

                    background:
                        rgba(
                            255,
                            255,
                            255,
                            .95
                        );

                    border-radius:24px;

                    box-shadow:
                        0 8px 30px
                        rgba(0,0,0,.2);
                "
            >

                <img
                    src="${opponent.image}"

                    alt="${escapeHTML(
                        opponent.name
                    )}"

                    style="
                        width:130px;
                        height:130px;
                        object-fit:contain;
                    "
                >


                <h1>
                    ${title}
                </h1>


                <p
                    style="
                        font-size:18px;
                    "
                >
                    ${escapeHTML(
                        message
                    )}
                </p>


                <p>
                    <strong>
                        XP Earned:
                    </strong>

                    +${xpEarned}
                </p>


                ${
                    result === "player"

                        ? `

                            <p
                                style="
                                    font-weight:bold;
                                "
                            >
                                🪙 +${getPlayGameCoinReward(
                                    5
                                )} Coins Earned!
                            </p>

                        `

                        : ""
                }


                <div
                    style="
                        display:flex;
                        justify-content:center;
                        gap:12px;
                        flex-wrap:wrap;

                        margin-top:22px;
                    "
                >

                    <button
                        type="button"

                        onclick="
                            startESSATicTacToe(
                                '${opponent.id}'
                            )
                        "

                        style="
                            padding:10px 16px;

                            border:none;
                            border-radius:14px;

                            background:
                                var(
                                    --user-theme-color,
                                    #4fb5ae
                                );

                            color:white;

                            font-weight:600;
                            font-size:14px;

                            cursor:pointer;
                            white-space:nowrap;
                        "
                    >
                        🔄 Play Again
                    </button>


                    <button
                        type="button"

                        onclick="
                            showESSATicTacToeSetup()
                        "

                        style="
                            padding:10px 16px;

                            border:none;
                            border-radius:14px;

                            background:
                                var(
                                    --user-theme-color,
                                    #4fb5ae
                                );

                            color:white;

                            font-weight:600;
                            font-size:14px;

                            cursor:pointer;
                            white-space:nowrap;
                        "
                    >
                        🐶 Choose ESSA
                    </button>


                    <button
                        type="button"

                        onclick="
                            renderPlayRoom()
                        "

                        style="
                            display:flex;
                            align-items:center;
                            gap:8px;

                            padding:10px 16px;

                            border:none;
                            border-radius:14px;

                            background:
                                var(
                                    --user-theme-color,
                                    #4fb5ae
                                );

                            color:white;

                            font-weight:600;
                            font-size:14px;

                            cursor:pointer;
                            white-space:nowrap;
                        "
                    >

                        <span
                            style="
                                font-size:18px;
                                line-height:1;
                            "
                        >
                            ←
                        </span>

                        <span>
                            🎮
                        </span>

                        <span>
                            Back to Arcade
                        </span>

                    </button>

                </div>

            </div>

        </div>

    `;
}

/* =========================================================
   FIND MY ESSA
========================================================= */

let findMyEssaState = null;

let findMyEssaMoveTimer = null;


function openFindMyEssa() {

    stopPlayHouseTimers();

    startFindMyEssa();
}


function startFindMyEssa() {

    stopFindMyEssaMovement();

    findMyEssaState = {
        round: 1,
        score: 0,
        target: null,
        crowd: [],
        gameOver: false
    };

    makeFindMyEssaRound();
}


/* =========================================================
   FIND MY ESSA - ROUND SETUP
========================================================= */

function makeFindMyEssaRound() {

    if (!findMyEssaState) {
        return;
    }

    stopFindMyEssaMovement();

    const state =
        findMyEssaState;

    const availableEssas =
        playableEssas.slice(0, 8);


    const targetIndex =
        Math.floor(
            Math.random() *
            availableEssas.length
        );


    state.target =
        availableEssas[targetIndex];


    let crowdSize = 6;


if (state.round >= 4) {
    crowdSize = 12;
}


if (state.round >= 7) {
    crowdSize = 16;
}


if (state.round >= 10) {
    crowdSize = 20;
}


if (state.round >= 13) {
    crowdSize = 24;
}


if (state.round >= 16) {
    crowdSize = 28;
}


if (state.round >= 20) {
    crowdSize = 32;
}


if (state.round >= 25) {
    crowdSize = 36;
}


if (state.round >= 30) {
    crowdSize = 40;
}


if (state.round >= 35) {
    crowdSize = 44;
}


if (state.round >= 40) {
    crowdSize = 48;
}


if (state.round >= 45) {
    crowdSize = 52;
}


    const crowd = [];


    crowd.push({
        id: "find-target",
        essa: state.target,
        isTarget: true,
        x: 50,
        y: 50
    });


    while (
        crowd.length <
        crowdSize
    ) {

        let randomEssa = null;


do {

    randomEssa =
        availableEssas[
            Math.floor(
                Math.random() *
                availableEssas.length
            )
        ];

} while (
    randomEssa.id ===
    state.target.id
);


crowd.push({
    id:
        "find-crowd-" +
        crowd.length,

    essa: randomEssa,

    isTarget: false,

    x: 50,

    y: 50
});
    }


    shuffleFindMyEssaArray(
        crowd
    );


    state.crowd =
        crowd;


    placeFindMyEssaCrowd();


    renderFindMyEssa();
}
/* =========================================================
   FIND MY ESSA - SHUFFLE
========================================================= */

function shuffleFindMyEssaArray(array) {

    for (
        let i = array.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() *
                (i + 1)
            );

        const temp =
            array[i];

        array[i] =
            array[j];

        array[j] =
            temp;
    }

    return array;
}


/* =========================================================
   FIND MY ESSA - PLACE CROWD
========================================================= */

function placeFindMyEssaCrowd() {

    if (!findMyEssaState) {
        return;
    }


    const crowd =
        findMyEssaState.crowd;


    const placedPositions = [];


    crowd.forEach(
        function(member) {

            let position = null;

            let attempts = 0;


            while (
                !position &&
                attempts < 150
            ) {

                attempts++;


                const candidate = {
                    x:
                        8 +
                        Math.random() *
                        84,

                    y:
                        12 +
                        Math.random() *
                        72
                };


                const tooClose =
                    placedPositions.some(
                        function(other) {

                            const xDistance =
                                candidate.x -
                                other.x;

                            const yDistance =
                                candidate.y -
                                other.y;


                            const distance =
                                Math.sqrt(
                                    (
                                        xDistance *
                                        xDistance
                                    ) +
                                    (
                                        yDistance *
                                        yDistance
                                    )
                                );


                            return (
                                distance < 12
                            );
                        }
                    );


                if (!tooClose) {

                    position =
                        candidate;
                }
            }


            if (!position) {

                position = {
                    x:
                        10 +
                        Math.random() *
                        80,

                    y:
                        15 +
                        Math.random() *
                        65
                };
            }


            member.x =
                position.x;


            member.y =
                position.y;


            placedPositions.push(
                position
            );
        }
    );
}


/* =========================================================
   FIND MY ESSA - STOP MOVEMENT
========================================================= */

function stopFindMyEssaMovement() {

    if (findMyEssaMoveTimer) {

        clearInterval(
            findMyEssaMoveTimer
        );

        findMyEssaMoveTimer =
            null;
    }
}
/* =========================================================
   FIND MY ESSA - RENDER GAME
========================================================= */

function renderFindMyEssa() {

    if (!findMyEssaState) {
        return;
    }


    resetPageTheme();


    const main =
        document.querySelector(
            "main"
        );


    if (!main) {
        return;
    }


    const state =
        findMyEssaState;


    let crowdHTML = "";


    state.crowd.forEach(
        function(member) {

            let essaSize = 95;


            if (state.round >= 4) {
                essaSize = 82;
            }


            if (state.round >= 7) {
                essaSize = 72;
            }


            if (state.round >= 10) {
                essaSize = 62;
            }


            if (state.round >= 13) {
                essaSize = 55;
            }


            crowdHTML += `

                <button
                    type="button"

                    class="find-my-essa-member"

                    data-member-id="${member.id}"

                    onclick="
                        selectFindMyEssa(
                            '${member.id}'
                        )
                    "

                    style="
                        position:absolute;

                        left:${member.x}%;
                        top:${member.y}%;

                        transform:
                            translate(
                                -50%,
                                -50%
                            );

                        width:${essaSize}px;
                        height:${essaSize}px;

                        padding:0;

                        background:transparent;

                        border:none;

                        cursor:pointer;

                        transition:
                            left 1.8s ease,
                            top 1.8s ease;

                        z-index:10;
                    "
                >

                    <img
                        src="${member.essa.image}"

                        alt="${escapeHTML(
                            member.essa.name
                        )}"

                        draggable="false"

                        style="
                            width:100%;
                            height:100%;

                            object-fit:contain;

                            pointer-events:none;
                        "
                    >

                </button>

            `;
        }
    );


    main.innerHTML = `

        <div
            class="find-my-essa-screen"

            style="
                min-height:
                    calc(
                        100vh -
                        120px
                    );

                padding:18px;

                box-sizing:border-box;

                background-image:
                    url(
                        'arcade-backgrounds/find-my-essa-bg.png'
                    );

                background-size:cover;
                background-position:center;
                background-repeat:no-repeat;
            "
        >

            <div
                class="find-my-essa-wrapper"

                style="
                    max-width:950px;
                    margin:0 auto;
                "
            >


                <!-- TOP PANEL -->

                <div
                    class="find-my-essa-top-panel"

                    style="
                        padding:14px 18px;

                        background:
                            rgba(
                                255,
                                255,
                                255,
                                .94
                            );

                        border-radius:20px;

                        text-align:center;

                        margin-bottom:14px;
                    "
                >


                    <div
                        class="find-my-essa-topbar"

                        style="
                            display:flex;

                            justify-content:
                                space-between;

                            align-items:center;

                            gap:10px;

                            flex-wrap:wrap;
                        "
                    >


                        <button
                            type="button"

                            class="
                                play-action-button
                                primary
                                find-my-essa-back
                            "

                            onclick="
                                renderPlayRoom()
                            "
                        >
                            ← 🎮 Back to Arcade
                        </button>


                        <strong
                            class="find-my-essa-title"
                        >
                            🔎 Find My ESSA
                        </strong>


                        <strong
                            class="find-my-essa-score"
                        >
                            Round ${state.round}
                            •
                            Score ${state.score}
                        </strong>


                    </div>


                    <!-- TARGET -->

                    <div
                        class="find-my-essa-target"
                    >

                        <div
                            class="find-my-essa-target-text"

                            style="
                                margin-top:12px;

                                font-size:20px;

                                font-weight:bold;
                            "
                        >
                            Find
                            ${escapeHTML(
                                state.target.name
                            )}!
                        </div>


                        <img
                            class="find-my-essa-target-image"

                            src="${state.target.image}"

                            alt="${escapeHTML(
                                state.target.name
                            )}"

                            style="
                                width:90px;
                                height:90px;

                                object-fit:contain;

                                margin-top:6px;
                            "
                        >

                    </div>


                </div>


                <!-- CROWD -->

                <div
                    id="find-my-essa-crowd"

                    class="find-my-essa-crowd"

                    style="
                        position:relative;

                        width:100%;
                        height:520px;

                        overflow:hidden;

                        background:
                            rgba(
                                255,
                                255,
                                255,
                                .16
                            );

                        border:
                            3px solid
                            rgba(
                                255,
                                255,
                                255,
                                .8
                            );

                        border-radius:24px;

                        box-sizing:border-box;
                    "
                >

                    ${crowdHTML}

                </div>


            </div>

        </div>

    `;


    if (state.round >= 7) {

        startFindMyEssaMovement();

    } else {

        stopFindMyEssaMovement();
    }
}

/* =========================================================
   FIND MY ESSA - CROWD MOVEMENT
========================================================= */
function startFindMyEssaMovement() {

    stopFindMyEssaMovement();


    if (
        !findMyEssaState ||
        findMyEssaState.round < 7
    ) {
        return;
    }


    let movementSpeed = 2200;


    if (findMyEssaState.round >= 16) {
        movementSpeed = 1800;
    }


    if (findMyEssaState.round >= 20) {
        movementSpeed = 1500;
    }


    if (findMyEssaState.round >= 25) {
        movementSpeed = 1250;
    }


    if (findMyEssaState.round >= 30) {
        movementSpeed = 1050;
    }


    if (findMyEssaState.round >= 35) {
        movementSpeed = 900;
    }


    if (findMyEssaState.round >= 40) {
        movementSpeed = 750;
    }


    if (findMyEssaState.round >= 45) {
        movementSpeed = 600;
    }


    findMyEssaMoveTimer =
        setInterval(
            function() {

                moveFindMyEssaCrowd();

            },
            movementSpeed
        );
}

/* =========================================================
   FIND MY ESSA - CLICKING
========================================================= */

function selectFindMyEssa(memberId) {

    if (
        !findMyEssaState ||
        findMyEssaState.gameOver
    ) {
        return;
    }


    const state =
        findMyEssaState;


    const selectedMember =
        state.crowd.find(
            function(member) {

                return (
                    member.id ===
                    memberId
                );
            }
        );


    if (!selectedMember) {
        return;
    }


    if (
        selectedMember.isTarget
    ) {

        state.score +=
            10;


        /*
            Coin reward:
            Weekdays = 10 coins
            Weekends = 100 coins
        */

        addPendingPlayCoins(
            getPlayGameCoinReward(
                10
            )
        );


        state.round++;


        stopFindMyEssaMovement();


        if (
            state.round > 50
        ) {

            finishFindMyEssa();

            return;
        }


        setTimeout(
            function() {

                makeFindMyEssaRound();

            },
            350
        );


    } else {

        state.score =
            Math.max(
                0,
                state.score - 2
            );


        showFindMyEssaWrongGuess(
            selectedMember
        );
    }
}


/* =========================================================
   FIND MY ESSA - WRONG GUESS
========================================================= */

function showFindMyEssaWrongGuess(
    member
) {

    const element =
        document.querySelector(
            `[data-member-id="${member.id}"]`
        );


    if (!element) {
        return;
    }


    const oldTransform =
        element.style.transform;


    element.style.transform =
        "translate(-50%, -50%) scale(.85)";


    element.style.opacity =
        ".55";


    setTimeout(
        function() {

            element.style.transform =
                oldTransform ||
                "translate(-50%, -50%)";


            element.style.opacity =
                "1";

        },
        300
    );
}

/* =========================================================
   FIND MY ESSA - MOVE CROWD
========================================================= */

function moveFindMyEssaCrowd() {

    if (
        !findMyEssaState ||
        findMyEssaState.gameOver
    ) {
        return;
    }


    const state =
        findMyEssaState;


    if (state.round < 7) {
        return;
    }


    const newPositions = [];


    state.crowd.forEach(
        function(member) {

            let newPosition = null;

            let attempts = 0;


            while (
                !newPosition &&
                attempts < 80
            ) {

                attempts++;


                let moveAmountX = 18;

let moveAmountY = 14;


if (state.round >= 16) {
    moveAmountX = 22;
    moveAmountY = 18;
}


if (state.round >= 25) {
    moveAmountX = 26;
    moveAmountY = 22;
}


if (state.round >= 35) {
    moveAmountX = 30;
    moveAmountY = 26;
}


if (state.round >= 45) {
    moveAmountX = 34;
    moveAmountY = 30;
}


const moveX =
    (
        Math.random() *
        moveAmountX
    ) -
    (
        moveAmountX / 2
    );


const moveY =
    (
        Math.random() *
        moveAmountY
    ) -
    (
        moveAmountY / 2
    );


                let candidateX =
                    member.x +
                    moveX;


                let candidateY =
                    member.y +
                    moveY;


                candidateX =
                    Math.max(
                        7,
                        Math.min(
                            93,
                            candidateX
                        )
                    );


                candidateY =
                    Math.max(
                        10,
                        Math.min(
                            88,
                            candidateY
                        )
                    );


                const tooClose =
                    newPositions.some(
                        function(other) {

                            const xDistance =
                                candidateX -
                                other.x;


                            const yDistance =
                                candidateY -
                                other.y;


                            const distance =
                                Math.sqrt(
                                    (
                                        xDistance *
                                        xDistance
                                    ) +
                                    (
                                        yDistance *
                                        yDistance
                                    )
                                );


                            return (
                                distance < 10
                            );
                        }
                    );


                if (!tooClose) {

                    newPosition = {
                        x: candidateX,
                        y: candidateY
                    };
                }
            }


            if (!newPosition) {

                newPosition = {
                    x: member.x,
                    y: member.y
                };
            }


            member.x =
                newPosition.x;


            member.y =
                newPosition.y;


            newPositions.push(
                newPosition
            );


            const element =
                document.querySelector(
                    `[data-member-id="${member.id}"]`
                );


            if (element) {

                element.style.left =
                    member.x + "%";


                element.style.top =
                    member.y + "%";
            }
        }
    );
}

/* =========================================================
   FIND MY ESSA - GAME COMPLETE
========================================================= */

function finishFindMyEssa() {

    if (!findMyEssaState) {
        return;
    }

    stopFindMyEssaMovement();

    findMyEssaState.gameOver =
        true;

    const xpEarned =
        awardFindMyEssaXP();

    const main =
        document.querySelector(
            "main"
        );

    if (!main) {
        return;
    }

    main.innerHTML = `
        <div
            style="
                min-height:
                    calc(100vh - 120px);

                display:flex;
                align-items:center;
                justify-content:center;

                padding:20px;

                box-sizing:border-box;

                background-image:
                    url(
                        'arcade-backgrounds/find-my-essa-bg.png'
                    );

                background-size:cover;
                background-position:center;
            "
        >

            <div
                style="
                    width:100%;
                    max-width:520px;

                    padding:30px;

                    text-align:center;

                    background:
                        rgba(
                            255,
                            255,
                            255,
                            .95
                        );

                    border-radius:24px;

                    box-shadow:
                        0 8px 30px
                        rgba(0,0,0,.2);
                "
            >

                <h1>
                    🎉 Great Job!
                </h1>

                <p
                    style="
                        font-size:18px;
                    "
                >
                    You completed Find My ESSA!
                </p>

                <p>
                    <strong>
                        Final Score:
                    </strong>

                    ${findMyEssaState.score}
                </p>

                <p>
                    <strong>
                        XP Earned:
                    </strong>

                    +${xpEarned}
                </p>

                <div
                    style="
                        display:flex;
                        gap:12px;

                        justify-content:center;
                        flex-wrap:wrap;

                        margin-top:22px;
                    "
                >

                   <button
    type="button"

    onclick="
        startFindMyEssa()
    "

    style="
        padding:10px 16px;

        border:none;
        border-radius:14px;

        background:
            var(
                --user-theme-color,
                #4fb5ae
            );

        color:white;

        font-weight:600;
        font-size:14px;

        cursor:pointer;
        white-space:nowrap;
    "
>
    🔄 Play Again
</button>

                  <button
    type="button"

    onclick="
        renderPlayRoom()
    "

    style="
        display:flex;
        align-items:center;
        gap:8px;

        padding:10px 16px;

        border:none;
        border-radius:14px;

        background:
            var(
                --user-theme-color,
                #4fb5ae
            );

        color:white;

        font-weight:600;
        font-size:14px;

        cursor:pointer;
        white-space:nowrap;
    "
>
    <span
        style="
            font-size:18px;
            line-height:1;
        "
    >
        ←
    </span>

    <span>🎮</span>

    <span>
        Back to Arcade
    </span>
</button>

                </div>

            </div>

        </div>
    `;
}


/* =========================================================
   FIND MY ESSA - XP
========================================================= */

function awardFindMyEssaXP() {

    const playData =
        getSavedPlayData();

    const xpAmount =
        25;

    addTrainerXP(
    playData,
    xpAmount
);

    savePlayData(
        playData
    );

    return xpAmount;
}





/* =========================================================
   FOCUS ESSA OVERRIDE
========================================================= */

function focusPlayableEssa(
    essaId
) {

    applyPlayNeedsDecay();


    const playData =
        getSavedPlayData();


    const essa =
        getPlayableEssaById(
            essaId
        );


    if (!essa) {

        return;
    }


    if (
        !playData
            .unlockedEssaIds
            .includes(
                essa.id
            )
    ) {

        alert(
            `${essa.name} unlocks at Trainer Level ${essa.unlockLevel}.`
        );

        return;
    }


    playData.selectedEssaId =
        essa.id;


    getPlayEssaStats(
        playData,
        essa.id
    );


    savePlayData(
        playData
    );


    stopPlayHouseTimers();


    renderPlayableEssaFocus(
        essa.id
    );
}


/* =========================================================
   FOCUS SCREEN — CURRENT ROOM VERSION
========================================================= */

function renderPlayableEssaFocus(
    essaId
) {

    resetPageTheme();


    stopPlayHouseTimers();


    applyPlayNeedsDecay();


    const playData =
        getSavedPlayData();


    const houseData =
        getSavedPlayHouseData();


    const essa =
        getPlayableEssaById(
            essaId
        );


    if (
        !essa ||
        !playData
            .unlockedEssaIds
            .includes(
                essa.id
            )
    ) {

        renderPlayRoom();

        return;
    }


    const stats =
        getPlayEssaStats(
            playData,
            essa.id
        );


    const room =
        getEssaRoom(
            houseData,
            essa.id
        );


    const statusMessage =
        getEssaNeedMessage(
            essa,
            stats
        );


    document.querySelector(
        "main"
    ).innerHTML = `

        

        <div
            style="
                max-width:
                    1000px;

                margin:
                    0 auto;
            "
        >


            <div
            class="play-focus-room"
                style="
                    position:
                        relative;

                    min-height:
                        680px;

                    overflow:
                        hidden;

                    border-radius:
                        28px;

                    border:
                        1px solid
                        #dbe5e7;

                    box-shadow:
                        0
                        8px
                        28px
                        rgba(
                            0,
                            0,
                            0,
                            .12
                        );

                    background-color:
                        #eaf6f4;

                    background-image:
                        linear-gradient(
                            rgba(
                                255,
                                255,
                                255,
                                .08
                            ),
                            rgba(
                                255,
                                255,
                                255,
                                .08
                            )
                        ),
                        url(
                            '${room.background}'
                        );

                    background-size:
                        cover;

                    background-position:
                        center;
                "
            >


                <div
                    style="
                        position:
                            absolute;

                        top:
                            18px;

                        left:
                            18px;

                        z-index:
                            30;
                    "
                >

                    <button
                        onclick="
                            renderPlayRoom()
                        "

                        style="
                            background:
                                rgba(
                                    255,
                                    255,
                                    255,
                                    .94
                                );
                        "
                    >

                        ← ${room.icon}
                        ${escapeHTML(
                            room.name
                        )}

                    </button>

                </div>


                <div
                    style="
                        position:
                            absolute;

                        top:
                            18px;

                        left:
                            50%;

                        transform:
                            translateX(
                                -50%
                            );

                        width:
                            min(
                                68%,
                                620px
                            );

                        z-index:
                            20;
                    "
                >

                    ${makeTrainerLevelBar(
                        playData
                    )}

                </div>


                <div
                    style="
                        position:
                            absolute;

                        left:
                            18px;

                        top:
                            115px;

                        width:
                            205px;

                        padding:
                            14px;

                        background:
                            rgba(
                                255,
                                255,
                                255,
                                .93
                            );

                        border-radius:
                            18px;

                        box-shadow:
                            0
                            4px
                            16px
                            rgba(
                                0,
                                0,
                                0,
                                .12
                            );

                        z-index:
                            25;
                    "
                >


                    ${makePlayStatBar(
                        "🍎",
                        "Food",
                        stats.food
                    )}


                    ${makePlayStatBar(
                        "💧",
                        "Drink",
                        stats.water
                    )}


                    ${makePlayStatBar(
                        "🛁",
                        "Clean",
                        stats.cleanliness
                    )}


                    ${makePlayStatBar(
                        "💚",
                        "Happy",
                        stats.happiness
                    )}


                </div>


                <div
                    style="
                        position:
                            absolute;

                        top:
                            105px;

                        left:
                            50%;

                        transform:
                            translateX(
                                -50%
                            );

                        width:
                            min(
                                52%,
                                430px
                            );

                        z-index:
                            10;

                        text-align:
                            center;
                    "
                >


                    ${
                        statusMessage

                            ? `

                                <div
                                    style="
                                        display:
                                            inline-block;

                                        margin-bottom:
                                            -6px;

                                        padding:
                                            10px
                                            15px;

                                        background:
                                            rgba(
                                                255,
                                                255,
                                                255,
                                                .96
                                            );

                                        border-radius:
                                            18px;

                                        font-size:
                                            14px;

                                        font-weight:
                                            bold;

                                        box-shadow:
                                            0
                                            3px
                                            12px
                                            rgba(
                                                0,
                                                0,
                                                0,
                                                .12
                                            );
                                    "
                                >

                                    ${escapeHTML(
                                        statusMessage
                                    )}

                                </div>

                            `

                            : ""
                    }


                    ${makePlayableEssaVisual(
                        essa,
                        false,
                        "focus"
                    )}


                    <div
                        style="
                            display:
                                inline-block;

                            padding:
                                7px
                                16px;

                            margin-top:
                                -5px;

                            background:
                                rgba(
                                    255,
                                    255,
                                    255,
                                    .92
                                );

                            border-radius:
                                999px;

                            font-size:
                                22px;

                            font-weight:
                                bold;

                            box-shadow:
                                0
                                3px
                                12px
                                rgba(
                                    0,
                                    0,
                                    0,
                                    .12
                                );
                        "
                    >

                        ${escapeHTML(
                            essa.name
                        )}

                    </div>


                </div>


                <div
                    id="
                        play-message
                    "

                    style="
                        position:
                            absolute;

                        left:
                            50%;

                        bottom:
                            205px;

                        transform:
                            translateX(
                                -50%
                            );

                        min-width:
                            220px;

                        max-width:
                            70%;

                        padding:
                            10px
                            16px;

                        background:
                            rgba(
                                255,
                                255,
                                255,
                                .94
                            );

                        border-radius:
                            999px;

                        font-weight:
                            bold;

                        color:
                            #26343b;

                        text-align:
                            center;

                        opacity:
                            0;

                        pointer-events:
                            none;

                        transition:
                            opacity
                            .2s
                            ease;

                        z-index:
                            40;

                        box-shadow:
                            0
                            3px
                            12px
                            rgba(
                                0,
                                0,
                                0,
                                .12
                            );
                    "
                ></div>


                <div
                    style="
                        position:
                            absolute;

                        left:
                            50%;

                        bottom:
                            18px;

                        transform:
                            translateX(
                                -50%
                            );

                        width:
                            calc(
                                100% -
                                36px
                            );

                        display:
                            grid;

                        grid-template-columns:
                            repeat(
                                3,
                                1fr
                            );

                        gap:
                            12px;

                        z-index:
                            30;
                    "
                >


                    <button
                        onclick="
                            showPlayFoodMenu(
                                '${essa.id}'
                            )
                        "
                    >

                        <div
                            style="
                                font-size:
                                    32px;
                            "
                        >
                            🍎
                        </div>

                        Food

                    </button>


                    <button
                        onclick="
                            showPlayDrinkMenu(
                                '${essa.id}'
                            )
                        "
                    >

                        <div
                            style="
                                font-size:
                                    32px;
                            "
                        >
                            🥤
                        </div>

                        Drinks

                    </button>


                    <button
                        onclick="
                            showPlayBathMenu(
                                '${essa.id}'
                            )
                        "
                    >

                        <div
                            style="
                                font-size:
                                    32px;
                            "
                        >
                            🛁
                        </div>

                        Bathe

                    </button>


                </div>


            </div>


        </div>

    `;
}


/* =========================================================
   HOUSE-AWARE ITEM MENU
========================================================= */

function makePlayItemMenuShell(
    essa,
    title,
    subtitle,
    itemsHTML
) {

    const houseData =
        getSavedPlayHouseData();

    const room =
        getEssaRoom(
            houseData,
            essa.id
        );

    return `

        <div
            class="play-item-menu-wrapper"
        >

            <div
                class="play-item-menu-room"

                style="
                    background-color:#eaf6f4;

                    background-image:
                        linear-gradient(
                            rgba(255,255,255,.10),
                            rgba(255,255,255,.10)
                        ),
                        url('${room.background}');
                "
            >

                <button
                    class="play-item-menu-back"

                    onclick="
                        renderPlayableEssaFocus(
                            '${essa.id}'
                        )
                    "
                >
                    ← ${escapeHTML(room.name)}
                </button>


                <div
                    class="play-item-menu-essa"
                >
                    ${makePlayableEssaVisual(
                        essa,
                        false,
                        "focus"
                    )}
                </div>


                <div
                    class="play-item-menu-panel"
                >

                    <h2
                        class="play-item-menu-title"
                    >
                        ${title}
                    </h2>


                    <p
                        class="play-item-menu-subtitle"
                    >
                        ${subtitle}
                    </p>


                    <div
                        class="play-item-menu-items"
                    >
                        ${itemsHTML}
                    </div>

                </div>

            </div>

        </div>

    `;
}

/* =========================================================
   SEND ESSA TO A ROOM
========================================================= */

function sendEssaToRoom(
    essaId,
    roomId
) {

    const essa =
        getPlayableEssaById(
            essaId
        );


    const room =
        getPlayRoomById(
            roomId
        );


    if (
        !essa ||
        !room
    ) {

        return;
    }


    const houseData =
        getSavedPlayHouseData();


    houseData
        .essaRooms[
            essa.id
        ] =
        room.id;


    houseData
        .essaPositions[
            essa.id
        ] = {

            x:
                35 +
                Math.random() *
                30,

            y:
                58 +
                Math.random() *
                18

        };


    savePlayHouseData(
        houseData
    );


    showPlayMessage(
        `${essa.name} went to the ${room.name}! ${room.icon}`
    );
}


/* =========================================================
   HOUSE NEED STATUS WINDOW
========================================================= */

function showPlayHouseStatus() {

    applyPlayNeedsDecay();


    const playData =
        getSavedPlayData();


    const houseData =
        getSavedPlayHouseData();


    const oldModal =
        document.getElementById(
            "play-house-status-modal"
        );


    if (oldModal) {

        oldModal.remove();

    }


    const cards =
        playableEssas
            .filter(
                function(essa) {

                    return playData
                        .unlockedEssaIds
                        .includes(
                            essa.id
                        );

                }
            )
            .map(
                function(essa) {

                    const stats =
                        getPlayEssaStats(
                            playData,
                            essa.id
                        );


                    const room =
                        getEssaRoom(
                            houseData,
                            essa.id
                        );


                    const need =
                        getEssaBiggestNeed(
                            stats
                        );


                    return `

                        <div
                            style="
                                padding:14px;
                                background:#f8fbfb;
                                border:1px solid #dbe5e7;
                                border-radius:16px;
                            "
                        >

                            <div
                                style="
                                    display:flex;
                                    justify-content:space-between;
                                    align-items:center;
                                    gap:10px;
                                    margin-bottom:10px;
                                "
                            >

                                <button
                                    onclick="
                                        goToEssaRoom(
                                            '${essa.id}'
                                        )
                                    "
                                    style="
                                        padding:0;
                                        border:none;
                                        background:transparent;
                                        color:#17313a;
                                        font:inherit;
                                        font-weight:bold;
                                        cursor:pointer;
                                        text-decoration:underline;
                                        text-underline-offset:3px;
                                    "
                                >
                                    ${escapeHTML(
                                        essa.name
                                    )}
                                </button>


                                <span
                                    style="
                                        color:#68777b;
                                        font-size:13px;
                                    "
                                >
                                    ${room.icon}

                                    ${escapeHTML(
                                        room.name
                                    )}
                                </span>

                            </div>


                            <div
                                style="
                                    font-size:13px;
                                    line-height:1.7;
                                "
                            >

                                🍎 Food:
                                ${Math.round(
                                    stats.food
                                )}%

                                <br>

                                💧 Water:
                                ${Math.round(
                                    stats.water
                                )}%

                                <br>

                                🛁 Clean:
                                ${Math.round(
                                    stats.cleanliness
                                )}%

                                <br>

                                💚 Happy:
                                ${Math.round(
                                    stats.happiness
                                )}%

                            </div>


                            ${
                                need.value <= 80

                                    ? `

                                        <div
                                            style="
                                                margin-top:8px;
                                                padding:7px 9px;
                                                background:white;
                                                border-radius:10px;
                                                font-size:12px;
                                                font-weight:bold;
                                            "
                                        >

                                            ${escapeHTML(
                                                getEssaNeedMessage(
                                                    essa,
                                                    stats
                                                )
                                            )}

                                        </div>

                                    `

                                    : ""
                            }

                        </div>

                    `;

                }
            )
            .join("");


    const modal =
        document.createElement(
            "div"
        );


    modal.id =
        "play-house-status-modal";


    modal.innerHTML = `

        <div
            style="
                position:fixed;
                inset:0;
                z-index:9999;
                display:flex;
                align-items:center;
                justify-content:center;
                padding:20px;
                box-sizing:border-box;
                background:rgba(0,0,0,.5);
            "

            onclick="
                if (
                    event.target ===
                    this
                ) {
                    closePlayHouseStatus();
                }
            "
        >

            <div
                style="
                    width:min(
                        100%,
                        650px
                    );
                    max-height:88vh;
                    overflow:auto;
                    padding:24px;
                    background:white;
                    border-radius:24px;
                    box-shadow:
                        0 12px 38px
                        rgba(0,0,0,.25);
                "
            >

                <div
                    style="
                        display:flex;
                        justify-content:space-between;
                        align-items:center;
                        gap:12px;
                        margin-bottom:18px;
                    "
                >

                    <h2
                        style="
                            margin:0;
                        "
                    >
                        💚 ESSA Needs
                    </h2>


                    <button
                        onclick="
                            closePlayHouseStatus()
                        "
                        style="
                            width:40px;
                            height:40px;
                            padding:0;
                            border-radius:50%;
                        "
                    >
                        ×
                    </button>

                </div>


                <div
                    style="
                        display:grid;
                        grid-template-columns:
                            repeat(
                                auto-fit,
                                minmax(
                                    200px,
                                    1fr
                                )
                            );
                        gap:12px;
                    "
                >

                    ${cards}

                </div>

            </div>

        </div>

    `;


    const modalParent =
        document.fullscreenElement ||
        document.body;


    modalParent.appendChild(
        modal
    );
}

/* =========================================================
   GO TO ESSA ROOM
========================================================= */

function goToEssaRoom(
    essaId
) {

    const houseData =
        getSavedPlayHouseData();


    const roomId =
        houseData
            .essaRooms[
                essaId
            ];


    if (!roomId) {
        return;
    }


    houseData.currentRoomId =
        roomId;


    savePlayHouseData(
        houseData
    );


    closePlayHouseStatus();


    renderPlayRoom();
}


/* =========================================================
   CLOSE HOUSE STATUS
========================================================= */

function closePlayHouseStatus() {

    const modal =
        document.getElementById(
            "play-house-status-modal"
        );


    if (modal) {

        modal.remove();
    }
}


/* =========================================================
   HOUSE MOBILE STYLES
========================================================= */

function installPlayHouseStyles() {

    if (
        document.getElementById(
            "play-house-dynamic-styles"
        )
    ) {

        return;
    }


    const style =
        document.createElement(
            "style"
        );


    style.id =
        "play-house-dynamic-styles";


    style.textContent = `

        [data-play-house-essa]:hover
        .play-house-essa-image {

            transform:
                scale(1.06);

        }


        .play-house-speech {

            animation:
                playHouseBubbleFloat
                2.2s
                ease-in-out
                infinite;

        }


        .play-house-speech-urgent {

            animation:
                playHouseUrgentBubble
                1.1s
                ease-in-out
                infinite;

        }


        @keyframes
        playHouseBubbleFloat {

            0%,
            100% {

                transform:
                    translateX(-50%)
                    translateY(0);

            }


            50% {

                transform:
                    translateX(-50%)
                    translateY(-4px);

            }

        }


        @keyframes
        playHouseUrgentBubble {

            0%,
            100% {

                transform:
                    translateX(-50%)
                    scale(1);

            }


            50% {

                transform:
                    translateX(-50%)
                    scale(1.04);

            }

        }


        @media
        (
            max-width:
                700px
        ) {

            #play-house-room {

               #play-house-room {
    min-height: 0 !important;
    height: auto !important;
    aspect-ratio: 16 / 11;
}

            


            [data-play-house-essa] {

                width:
                    15%
                    !important;

                min-width:
                    48px
                    !important;

                max-width:
                    82px
                    !important;

            }


            .play-house-speech {

                min-width:
                    100px
                    !important;

                max-width:
                    145px
                    !important;

                font-size:
                    10px
                    !important;

            }

        }

    `;


    document.head.appendChild(
        style
    );
}


/* =========================================================
   INSTALL HOUSE STYLES NOW
========================================================= */

installPlayHouseStyles();

/* =========================================================
   PART 12
   CUSTOM PLAY ESSAS + LEVEL 80 UNLOCK
   ESSATWIST + FINAL PLAY HOOKUPS
========================================================= */


/* =========================================================
   CUSTOM PLAY ESSA SETTINGS
========================================================= */

const CUSTOM_PLAY_ESSA_MAX_IMAGE_SIZE =
    300;


/* =========================================================
   CUSTOM ESSA STORAGE
========================================================= */

function getCustomPlayEssaStorageKey() {

    return userStorageKey(
        "customPlayEssas"
    );
}


function getSavedCustomPlayEssas() {

    const key =
        getCustomPlayEssaStorageKey();


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


        if (
            !Array.isArray(
                saved
            )
        ) {

            return [];
        }


        let changed =
            false;


        const normalizedEssas =
            saved.map(
                function(essa, index) {

                    let slotNumber =
                        Number(
                            essa.slotNumber
                        );


                    if (
                        !Number.isFinite(
                            slotNumber
                        ) ||
                        slotNumber < 1 ||
                        slotNumber > 18
                    ) {

                        slotNumber =
                            index + 1;

                        changed =
                            true;
                    }


                    return {

                        ...essa,

                        slotNumber:
                            slotNumber,

                        custom:
                            true

                    };
                }
            );


        if (changed) {

            localStorage.setItem(
                key,
                JSON.stringify(
                    normalizedEssas
                )
            );
        }


        return normalizedEssas;

    } catch (error) {

        console.error(
            "Could not load custom Play ESSAs:",
            error
        );


        return [];
    }
}

function saveCustomPlayEssas(
    customEssas
) {

    const key =
        getCustomPlayEssaStorageKey();


    if (!key) {

        throw new Error(
            "No custom ESSA storage key."
        );
    }


    localStorage.setItem(
        key,
        JSON.stringify(
            customEssas
        )
    );
}


/* =========================================================
   CHECK CUSTOM ESSA UPLOAD AVAILABILITY
========================================================= */
function canUseCustomPlayEssas() {

    const playData =
        getSavedPlayData();


    const unlockedCustomSlots =
        Math.max(
            0,
            Math.min(
                18,
                playData.trainerLevel - 159
            )
        );


    return (
        getSavedCustomPlayEssas()
            .length <
        unlockedCustomSlots
    );
}

/* =========================================================
   GET ALL PLAY ESSAS
========================================================= */

function getAllPlayableEssas() {

    const custom =
        getSavedCustomPlayEssas();


    const playData =
        getSavedPlayData();


    const ownedVoidyPets =
        Array.isArray(
            playData.ownedVoidyPets
        )

            ? playData.ownedVoidyPets

            : [];


    return [
        ...playableEssas,
        ...custom,
        ...ownedVoidyPets
    ];
}


/* =========================================================
   GET ANY PLAY ESSA BY ID
========================================================= */

function getAnyPlayableEssaById(
    essaId
) {

    return (
        getAllPlayableEssas()
            .find(
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
   IS CUSTOM PLAY ESSA
========================================================= */

function isCustomPlayEssa(
    essaId
) {

    return getSavedCustomPlayEssas()
        .some(
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
        );
}


/* =========================================================
   CUSTOM ESSA UNLOCK CARD
========================================================= */

function makeCustomPlayEssaUnlockCard() {

    const customEssas =
        getSavedCustomPlayEssas();


    const slotsUsed =
        customEssas.length;


    const slotsAvailable =
        Math.max(
            0,
            20 - slotsUsed
        );


    let slotStatusMessage =
        "";


    if (
        slotsAvailable > 0
    ) {

        slotStatusMessage = `

            <p
                style="
                    color:#26343b;
                    font-weight:bold;
                    margin-bottom:4px;
                "
            >
                ${slotsUsed} / 20
                Play Mode ESSAs
            </p>


            <p
                style="
                    color:#3b9f99;
                    font-weight:bold;
                    margin-top:4px;
                "
            >
                ${slotsAvailable}
                ${
                    slotsAvailable === 1
                        ? "space"
                        : "spaces"
                }
                available
            </p>

        `;

    } else {

        slotStatusMessage = `

            <p
                style="
                    color:#26343b;
                    font-weight:bold;
                "
            >
                20 / 20
                Play Mode ESSAs
            </p>


            <p
                style="
                    color:#68777b;
                    font-weight:bold;
                "
            >
                Your Play Mode collection is full.
            </p>

        `;
    }


    let addButton =
        "";


    if (
        slotsAvailable > 0
    ) {

        addButton = `

            <button
            class="play-action-button primary"
                onclick="
                    showCustomPlayEssaForm()
                "
            >
                + Add My ESSA
            </button>

        `;

    } else {

        addButton = `

            <button
                disabled
                style="
                    opacity:.55;
                    cursor:not-allowed;
                "
            >
                ⭐ Maximum 20 ESSAs
            </button>

        `;
    }


    return `

        <div
            style="
                padding:22px;
                background:white;
                border:2px solid #4fb5ae;
                border-radius:20px;
                text-align:center;
                box-shadow:0 4px 14px rgba(0,0,0,.06);
            "
        >

            <div
                style="
                    font-size:65px;
                "
            >
                ✨
            </div>


            <h2>
                My Play ESSAs
            </h2>


            ${slotStatusMessage}

            ${addButton}

        </div>

    `;
}


/* =========================================================
   CUSTOM ESSA FORM
========================================================= */

function showCustomPlayEssaForm() {
    
    if (
        !canUseCustomPlayEssas()
    ) {

        alert(
            "You don't have an available Custom ESSA slot yet!"
        );

        return;
    }


    const existingPopup =
    document.getElementById(
        "custom-play-essa-form-popup"
    );


if (existingPopup) {

    existingPopup.remove();

}


const overlay =
    document.createElement(
        "div"
    );


overlay.id =
    "custom-play-essa-form-popup";


overlay.style.cssText = `
    position:fixed;
    inset:0;

    z-index:1000000;

    display:flex;
    align-items:center;
    justify-content:center;

    padding:20px;
    box-sizing:border-box;

    background:
        rgba(0,0,0,.65);

    overflow-y:auto;
`;


overlay.innerHTML = `


       <div
    class="essa-form"

    style="
        width:min(650px, 100%);
        max-height:90vh;

        padding:26px;
        box-sizing:border-box;

        overflow-y:auto;

        background:white;

        border:
            3px solid
            var(
                --user-theme-color,
                #4fb5ae
            );

        border-radius:24px;

        box-shadow:
            0 18px 55px
            rgba(0,0,0,.45);
    "
>


           <button
    onclick="
        document
            .getElementById(
                'custom-play-essa-form-popup'
            )
            ?.remove()
    "
>
    ✕ Close
</button>


            <h1>
                ✨ Add Your Own Play ESSA
            </h1>


            <p
                style="
                    color:#68777b;
                    line-height:1.6;
                "
            >
                Upload a PNG of your ESSA.

                A transparent background will look
                best because your ESSA will be placed
                directly inside the rooms.
            </p>


            <label>
                ESSA Name
            </label>


            <input
                id="custom-play-essa-name"

                type="text"

                maxlength="40"

                placeholder="Example: Boba"
            >


            <label>
                Gender
            </label>


            <div
                style="
                    display:flex;
                    gap:12px;
                    flex-wrap:wrap;
                    margin-top:8px;
                    margin-bottom:18px;
                "
            >

                <label
                    style="
                        display:flex;
                        align-items:center;
                        gap:7px;

                        padding:10px 16px;

                        border:
                            1px solid #ccd7da;

                        border-radius:12px;

                        background:white;

                        cursor:pointer;
                    "
                >

                    <input
                        type="radio"

                        name="custom-play-essa-gender"

                        value="male"
                    >

                    <span>
                        ♂️ Male
                    </span>

                </label>


                <label
                    style="
                        display:flex;
                        align-items:center;
                        gap:7px;

                        padding:10px 16px;

                        border:
                            1px solid #ccd7da;

                        border-radius:12px;

                        background:white;

                        cursor:pointer;
                    "
                >

                    <input
                        type="radio"

                        name="custom-play-essa-gender"

                        value="female"
                    >

                    <span>
                        ♀️ Female
                    </span>

                </label>

                <label
    style="
        display:flex;
        align-items:center;
        gap:7px;

        padding:10px 16px;

        border:
            1px solid #ccd7da;

        border-radius:12px;

        background:white;

        cursor:pointer;
    "
>

    <input
        type="radio"

        name="custom-play-essa-gender"

        value="none"
    >

    <span>
        ⁉️ None
    </span>

</label>

            </div>


            <label>
                Transparent PNG
            </label>


            <input
                id="custom-play-essa-image"

                type="file"

                accept="image/png"
            >


            <div
                id="custom-play-essa-preview"

                style="
                    display:none;
                    margin-top:18px;
                    padding:18px;
                    min-height:220px;
                    align-items:center;
                    justify-content:center;
                    background:
                        linear-gradient(
                            45deg,
                            #eeeeee 25%,
                            transparent 25%
                        ),
                        linear-gradient(
                            -45deg,
                            #eeeeee 25%,
                            transparent 25%
                        ),
                        linear-gradient(
                            45deg,
                            transparent 75%,
                            #eeeeee 75%
                        ),
                        linear-gradient(
                            -45deg,
                            transparent 75%,
                            #eeeeee 75%
                        );
                    background-size:24px 24px;
                    background-position:
                        0 0,
                        0 12px,
                        12px -12px,
                        -12px 0px;
                    border:1px solid #dbe5e7;
                    border-radius:20px;
                "
            >

                <img
                    id="custom-play-essa-preview-image"

                    alt="Custom ESSA preview"

                    style="
                        max-width:260px;
                        max-height:260px;
                        object-fit:contain;
                    "
                >

            </div>


            <p
                style="
                    color:#68777b;
                    font-size:13px;
                    line-height:1.5;
                "
            >
                Tip: Crop the image fairly close
                around your ESSA before uploading it.
                Large empty transparent areas can make
                the ESSA look tiny in the room.
            </p>


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
        document
            .getElementById(
                'custom-play-essa-form-popup'
            )
            ?.remove()
    "
>
    Cancel
</button>

                <button
                    onclick="
                        saveCustomPlayEssa()
                    "
                >
                    Add to Play Mode 🐾
                </button>

            </div>


        </div>

    `;

    const popupHost =
    document.fullscreenElement ||
    document.body;

popupHost.appendChild(
    overlay
);


    const input =
        document.getElementById(
            "custom-play-essa-image"
        );


    if (input) {

        input.addEventListener(
            "change",
            previewCustomPlayEssaImage
        );
    }
}

function readImageFile(file) {

    return new Promise(
        function(resolve, reject) {

            const reader =
                new FileReader();

            reader.onload =
                function() {

                    resolve(
                        reader.result
                    );
                };

            reader.onerror =
                function() {

                    reject(
                        new Error(
                            "Could not read image file."
                        )
                    );
                };

            reader.readAsDataURL(
                file
            );
        }
    );
}

/* =========================================================
   PREVIEW CUSTOM ESSA IMAGE
========================================================= */

async function previewCustomPlayEssaImage(
    event
) {

    const file =
        event.target
            ?.files
            ?.[0];


    if (!file) {

        return;
    }


    if (
        file.type !==
        "image/png"
    ) {

        alert(
            "Please choose a PNG image."
        );


        event.target.value =
            "";


        return;
    }


    try {

        const imageData =
            await readImageFile(
                file
            );


        const preview =
            document.getElementById(
                "custom-play-essa-preview"
            );


        const image =
            document.getElementById(
                "custom-play-essa-preview-image"
            );


        if (
            preview &&
            image
        ) {

            image.src =
                imageData;


            preview.style.display =
                "flex";
        }

    } catch (error) {

        console.error(
            error
        );


        alert(
            "That image could not be opened."
        );
    }
}


function resizeCustomPlayEssaImage(
    imageData
) {

    return new Promise(
        function(
            resolve,
            reject
        ) {

            const image =
                new Image();


            image.onload =
                function() {

                    let width =
                        image.width;


                    let height =
                        image.height;


                    const scale =
                        Math.min(
                            1,
                            CUSTOM_PLAY_ESSA_MAX_IMAGE_SIZE /
                                width,
                            CUSTOM_PLAY_ESSA_MAX_IMAGE_SIZE /
                                height
                        );


                    width =
                        Math.round(
                            width *
                            scale
                        );


                    height =
                        Math.round(
                            height *
                            scale
                        );


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


                    context.clearRect(
                        0,
                        0,
                        width,
                        height
                    );


                    context.drawImage(
                        image,
                        0,
                        0,
                        width,
                        height
                    );


                    const resized =
                        canvas.toDataURL(
                            "image/webp",
                            0.8
                        );


                    resolve(
                        resized
                    );
                };


            image.onerror =
                function() {

                    reject(
                        new Error(
                            "Could not resize image."
                        )
                    );
                };


            image.src =
                imageData;
        }
    );
}


/* =========================================================
   SAVE CUSTOM PLAY ESSA
========================================================= */

async function saveCustomPlayEssa() {

    const playData =
        getSavedPlayData();


    const unlockedCustomSlots =
    Math.max(
        0,
        Math.min(
            18,
            playData.trainerLevel - 159
        )
    );


    const customEssas =
        getSavedCustomPlayEssas();

    /* ---------------------------------------------------------
       FIND WHICH CUSTOM SLOTS ARE ALREADY BEING USED

       Older custom ESSAs that were created before we added
       slot numbers are treated as Slot 1, Slot 2, etc.
    --------------------------------------------------------- */

    const usedSlots =
        customEssas.map(
            function(essa, index) {

                const savedSlot =
                    Number(
                        essa.slotNumber
                    );


                if (
                    Number.isFinite(
                        savedSlot
                    ) &&
                    savedSlot >= 1 &&
                    savedSlot <= 18
                ) {

                    return savedSlot;
                }


                return index + 1;
            }
        );

    let availableSlot = null;

for (
    let slot = 1;
    slot <= unlockedCustomSlots;
    slot++
) {

    if (
        !usedSlots.includes(
            slot
        )
    ) {

        availableSlot = slot;
        break;
    }
}

    if (
    availableSlot === null
) {

    alert(
        "You already have all 18 Custom ESSA slots filled!"
    );

    return;
}


    /* ---------------------------------------------------------
       GET NAME + IMAGE
    --------------------------------------------------------- */

    const nameField =
        document.getElementById(
            "custom-play-essa-name"
        );


    const imageField =
        document.getElementById(
            "custom-play-essa-image"
        );

    const genderField =
    document.querySelector(
        'input[name="custom-play-essa-gender"]:checked'
    );


    const name =
        nameField
            ?.value
            ?.trim();

    const gender =
    genderField
        ?.value;


    const file =
        imageField
            ?.files
            ?.[0];


    if (!name) {

        alert(
            "Give your ESSA a name first."
        );

        return;
    }

    if (!gender) {

    alert(
        "Choose a gender for your ESSA."
    );

    return;
}


    if (!file) {

        alert(
            "Choose a transparent PNG of your ESSA."
        );

        return;
    }


    if (
        file.type !==
        "image/png"
    ) {

        alert(
            "Custom Play ESSAs need a PNG image."
        );

        return;
    }


    /* ---------------------------------------------------------
       PREPARE IMAGE
    --------------------------------------------------------- */

    let imageData;


    try {

        const original =
            await readImageFile(
                file
            );
        

        imageData =
            await resizeCustomPlayEssaImage(
                original
            );

    } catch (error) {

        console.error(
            error
        );

        alert(
            "That image could not be prepared."
        );

        return;
    }


    /* ---------------------------------------------------------
       CREATE CUSTOM ESSA
    --------------------------------------------------------- */

    const id =
        makeId(
            "custom-play"
        );


    const newEssa = {

        id:
            id,

       name:
    name,

gender:
    gender === "male"
        ? "♂️"
        : gender === "female"
            ? "♀️"
            : "",

image:
    imageData,
        fallbackIcon:
            "🐾",

        slotNumber:
            availableSlot,

        custom:
            true,

        createdAt:
            new Date()
                .toISOString()

    };


    customEssas.push(
        newEssa
    );


    /* ---------------------------------------------------------
       SAVE CUSTOM ESSA
    --------------------------------------------------------- */

    try {

        saveCustomPlayEssas(
            customEssas
        );

    } catch (error) {

        console.error(
            error
        );


        alert(
            "Your ESSA could not be saved. Browser storage may be full."
        );

        return;
    }


    /* ---------------------------------------------------------
       ADD TO PLAY DATA
    --------------------------------------------------------- */

    if (
        !playData
            .unlockedEssaIds
            .includes(
                id
            )
    ) {

        playData
            .unlockedEssaIds
            .push(
                id
            );
    }


    getPlayEssaStats(
        playData,
        id
    );


    savePlayData(
        playData
    );


    /* ---------------------------------------------------------
       PUT NEW ESSA IN PLAYROOM
    --------------------------------------------------------- */

    const houseData =
        getSavedPlayHouseData();


    houseData
        .essaRooms[
            id
        ] =
        "playroom";


    houseData
    .essaPositions[
        id
    ] = {

        x:
            30 +
            Math.random() *
            40,

        floor:
            4

    };
    

    savePlayHouseData(
        houseData
    );


    /* ---------------------------------------------------------
       DONE
    --------------------------------------------------------- */

   showCustomEssaAddedPopup(
    name,
    availableSlot
);

document
    .getElementById(
        "custom-play-essa-form-popup"
    )
    ?.remove();

    openVoidyStorePage(
    "custom-pets"
);
}

function showCustomEssaAddedPopup(
    name,
    slotNumber
) {

    const overlay =
        document.createElement(
            "div"
        );


    overlay.id =
        "custom-essa-added-popup";


    overlay.style.cssText = `
        position:fixed;
        inset:0;
        background:rgba(0,0,0,.45);
        display:flex;
        align-items:center;
        justify-content:center;
        padding:20px;
        box-sizing:border-box;
        z-index:99999;
    `;


    overlay.innerHTML = `

        <div
            style="
                width:min(440px, 100%);
                background:white;
                border:
                    2px solid
                    var(
                        --user-theme-color,
                        #4fb5ae
                    );
                border-radius:22px;
                padding:30px;
                box-sizing:border-box;
                text-align:center;
                box-shadow:
                    0 15px 45px
                    rgba(0,0,0,.20);
            "
        >

            <div
                style="
                    font-size:52px;
                    margin-bottom:10px;
                "
            >
                🐾✨
            </div>


            <h2
                style="
                    margin:
                        0 0 14px 0;

                    color:
                        var(
                            --user-theme-color,
                            #4fb5ae
                        );
                "
            >
                Welcome to Play Mode!
            </h2>


            <p
                style="
                    margin:
                        0 0 8px 0;

                    color:#58686e;
                    font-size:17px;
                    line-height:1.5;
                "
            >
                <strong>
                    ${escapeHTML(name)}
                </strong>

                has joined your Play house!
            </p>


            <p
                style="
                    margin:
                        0 0 24px 0;

                    color:#7a898e;
                    font-size:14px;
                "
            >
                Custom ESSA Slot
                #${slotNumber}
            </p>


            <button
                type="button"

                onclick="
                    document
                        .getElementById(
                            'custom-essa-added-popup'
                        )
                        ?.remove()
                "

                style="
                    min-width:130px;
                    padding:12px 22px;
                    border:none;
                    border-radius:14px;
                    background:
                        var(
                            --user-theme-color,
                            #4fb5ae
                        );
                    color:white;
                    font-size:16px;
                    font-weight:bold;
                    cursor:pointer;
                "
            >
                Awesome! 🐾
            </button>

        </div>

    `;


    const parent =
        document.fullscreenElement ||
        document.body;


    parent.appendChild(
        overlay
    );
}

/* =========================================================
   DELETE CUSTOM PLAY ESSA
========================================================= */

function deleteCustomPlayEssa(
    essaId
) {

    if (
        !isCustomPlayEssa(
            essaId
        )
    ) {

        return;
    }


    const essa =
        getAnyPlayableEssaById(
            essaId
        );


    if (!essa) {

        return;
    }


    const confirmed =
        confirm(
            `Remove ${essa.name} from Play Mode?`
        );


    if (!confirmed) {

        return;
    }


    const customEssas =
        getSavedCustomPlayEssas()
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


    saveCustomPlayEssas(
        customEssas
    );


    const playData =
        getSavedPlayData();


    playData.unlockedEssaIds =
        playData
            .unlockedEssaIds
            .filter(
                function(id) {

                    return (
                        String(
                            id
                        ) !==
                        String(
                            essaId
                        )
                    );

                }
            );


    if (
        playData.essaStats
    ) {

        delete playData
            .essaStats[
                essaId
            ];
    }


    if (
        String(
            playData.selectedEssaId
        ) ===
        String(
            essaId
        )
    ) {

        playData.selectedEssaId =
            "moocow";
    }


    savePlayData(
        playData
    );


    const houseData =
        getSavedPlayHouseData();


    delete houseData
        .essaRooms[
            essaId
        ];


    delete houseData
        .essaPositions[
            essaId
        ];


    savePlayHouseData(
        houseData
    );


    renderPlayableEssaCollection();
}




/* =========================================================
   CUSTOM-AWARE HOUSE ESSA LOOKUP
========================================================= */

function getHousePlayableEssaById(
    essaId
) {

    return getAnyPlayableEssaById(
        essaId
    );
}


/* =========================================================
   CUSTOM-AWARE HOUSE RENDER
========================================================= */

function renderPlayRoom() {

    resetPageTheme();


    applyPlayNeedsDecay();


    let playData =
        getSavedPlayData();


    const houseData =
        getSavedPlayHouseData();


    const room =
        getPlayRoomById(
            houseData.currentRoomId
        );


    /* =====================================================
       SPAWN ARCADE WINNINGS IN PLAYROOM
    ===================================================== */

    if (
        room.id === "playroom" &&
        Number(
            playData.pendingCoins
        ) > 0
    ) {

        spawnPendingPlayroomCoins();

        playData =
            getSavedPlayData();
    }


    const allEssas =
    getAllPlayableEssas();


    playData
        .unlockedEssaIds
        .forEach(
            function(essaId) {

                const essa =
                    getAnyPlayableEssaById(
                        essaId
                    );


                if (!essa) {

                    return;
                }


                getPlayEssaStats(
                    playData,
                    essaId
                );


                if (
                    !houseData
                        .essaRooms[
                            essaId
                        ]
                ) {

                    houseData
                        .essaRooms[
                            essaId
                        ] =
                        "playroom";
                }

            }
        );


    savePlayData(
        playData
    );


    savePlayHouseData(
        houseData
    );


    const roomEssas =
        allEssas
            .filter(
                function(essa) {

                    return (

                        playData
                            .unlockedEssaIds
                            .includes(
                                essa.id
                            )

                        &&

                        (
                            houseData
                                .essaRooms[
                                    essa.id
                                ] ||
                            "playroom"
                        ) ===
                        room.id

                    );

                }
            );


    let essasHTML =
        "";


    roomEssas.forEach(
        function(
            essa,
            index
        ) {

            const stats =
                getPlayEssaStats(
                    playData,
                    essa.id
                );


            const position =
                getPlayHouseEssaPosition(
                    houseData,
                    essa.id,
                    index
                );


            essasHTML +=
                makePlayHouseEssa(
                    essa,
                    stats,
                    position
                );

        }
    );


    /* =====================================================
       PLAYROOM FLOOR COINS
    ===================================================== */

    let playroomCoinsHTML =
        "";


    if (
        room.id === "playroom" &&
        Array.isArray(
            playData.playroomCoins
        )
    ) {

        playData.playroomCoins.forEach(
            function(coin) {

                playroomCoinsHTML += `

                    <div
                        class="playroom-floor-coin"

                        data-coin-id="${coin.id}"

onclick="
    collectPlayroomCoin(
        '${coin.id}'
    )
"

                        style="
                            position:absolute;
                            left:${coin.x}%;
                            top:${coin.y}%;
                            transform:
                                translate(-50%, -50%);
                            z-index:90;
                            display:flex;
                            flex-direction:column;
                            align-items:center;
                            justify-content:center;
                            cursor:pointer;
                        "
                    >

                        <img
                            src="ESSAzLife.Images/PlayModeAssets/Coins/gold-moocow-coin.png"

                            alt="MooCow Coin"

                            draggable="false"

                            style="
                                width:58px;
                                height:58px;
                                object-fit:contain;
                                filter:
                                    drop-shadow(
                                        0 4px 5px
                                        rgba(0,0,0,.28)
                                    );
                            "
                        >

                        <div
                            style="
                                margin-top:2px;
                                padding:2px 7px;
                                background:
                                    rgba(
                                        255,
                                        255,
                                        255,
                                        .92
                                    );
                                border-radius:999px;
                                color:#26343b;
                                font-size:12px;
                                font-weight:900;
                                box-shadow:
                                    0 2px 5px
                                    rgba(0,0,0,.15);
                            "
                        >
                            +${coin.value}
                        </div>

                    </div>

                `;

            }
        );
    }


    document.querySelector(
        "main"
    ).innerHTML = `


        <div
            class="play-room-container"

            style="
                max-width:1150px;
                margin:0 auto;
            "
        >


            <div
                class="trainer-level-wrapper"

                style="
                    display:flex;
                    justify-content:center;
                    margin-bottom:12px;
                "
            >

                ${makeTrainerLevelBar(
                    playData
                )}

            </div>


            <div
                class="play-room-navigation"

                style="
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    gap:10px;
                    margin-bottom:12px;
                "
            >

                <button
                    onclick="
                        changePlayRoom(-1)
                    "

                    style="
                        width:44px;
                        height:44px;
                        padding:0;
                        border-radius:50%;
                        font-size:20px;
                    "
                >
                    ⬅️
                </button>


                <button
                    onclick="
                        showPlayRoomPicker()
                    "

                    style="
                        min-width:180px;
                        padding:11px 18px;
                        border-radius:999px;
                        font-size:16px;
                        font-weight:bold;
                    "
                >
                    ${room.icon}

                    ${escapeHTML(
                        room.name
                    )}
                </button>


                <button
                    onclick="
                        changePlayRoom(1)
                    "

                    style="
                        width:44px;
                        height:44px;
                        padding:0;
                        border-radius:50%;
                        font-size:20px;
                    "
                >
                    ➡️
                </button>

            </div>


            <div
                id="play-house-room"

                data-room-id="${room.id}"

                onclick="
    chasePlayHouseClick(event)
"

                style="
                    position:relative;
                    width:100%;
                    min-height:660px;
                    overflow:hidden;
                    border:1px solid #dbe5e7;
                    border-radius:28px;
                    background-color:#eaf6f4;
                    background-image:
                        url('${room.background}');
                    background-size:cover;
                    background-position:center;
                    box-shadow:
                        0 8px 28px
                        rgba(0,0,0,.13);
                "
            >


               <div
    id="play-room-nav"

    class="${
        localStorage.getItem(
            'essazlife-play-room-nav-closed'
        ) === 'true'
            ? 'play-room-nav-closed'
            : ''
    }"
                    style="
                        position:absolute;
                        top:16px;
                        right:16px;
                        z-index:120;
                        display:flex;
                        gap:8px;
                        flex-wrap:wrap;
                        justify-content:flex-end;
                    "
                >


                    <div
                        class="play-coin-balance"

                        style="
                            display:flex;
                            align-items:center;
                            gap:6px;
                            padding:7px 12px;
                            background:
                                rgba(
                                    255,
                                    255,
                                    255,
                                    .94
                                );
                            border-radius:12px;
                            font-weight:bold;
                            color:#26343b;
                            box-shadow:
                                0 2px 8px
                                rgba(0,0,0,.10);
                        "
                    >

                        <img
                            src="ESSAzLife.Images/PlayModeAssets/Coins/gold-moocow-coin.png"

                            alt="MooCow Coin"

                            style="
                                width:28px;
                                height:28px;
                                object-fit:contain;
                            "
                        >

                        <span>
                            ${playData.coins}
                        </span>

                    </div>


                    <button
                        class="
                            play-action-button
                            primary
                        "

                        onclick="
                            openCallEssaMenu()
                        "
                    >
                        📣 Call ESSA
                    </button>


                    <button
                        class="
                            play-action-button
                            primary
                        "

                        onclick="
                            renderPlayableEssaCollection()
                        "
                    >
                        🐾 Collection
                    </button>


                    <button
                        class="
                            play-action-button
                            primary
                            play-fullscreen-button
                        "

                        onclick="
                            togglePlayMobileFullscreen()
                        "
                    >
                        ⛶ Full Screen
                    </button>
                
                <button
    id="play-room-nav-toggle"

    onclick="
        togglePlayRoomNav()
    "

    aria-label="
        Hide room menu
    "

    style="
        border:none;
        background:transparent;
        color:white;
        font-size:28px;
        font-weight:bold;
        cursor:pointer;
        padding:4px 8px;
        line-height:1;
    "
>
    &gt;
</button>
                </div>


                <div
                    id="play-message"

                    style="
                        position:absolute;
                        top:80px;
                        left:50%;
                        transform:
                            translateX(-50%);
                        max-width:
                            min(80%,500px);
                        padding:9px 14px;
                        background:
                            rgba(
                                255,
                                255,
                                255,
                                .95
                            );
                        border-radius:999px;
                        color:#26343b;
                        font-weight:bold;
                        text-align:center;
                        opacity:0;
                        pointer-events:none;
                        transition:
                            opacity .2s ease;
                        z-index:150;
                    "
                ></div>


                ${essasHTML}


                ${playroomCoinsHTML}


                ${makePlayRoomSpecialControls(
                    room
                )}

            </div>


            <p
                class="
                    play-room-wander-message
                "

                style="
                    margin-top:10px;
                    text-align:center;
                    color:#68777b;
                    font-size:13px;
                "
            >
                ESSAs can wander around
                the house on their own.

                Tap one to play with them.
            </p>

        </div>

    `;


    startPlayHouseTimers();
}


function togglePlayMobileFullscreen() {

    const isPhoneLandscape =
        window.matchMedia(
            "(max-height: 500px) and (orientation: landscape)"
        ).matches;


    /* PHONE LANDSCAPE */

    if (isPhoneLandscape) {

        document.body.classList.toggle(
            "play-mobile-fullscreen"
        );

        return;
    }


    /* DESKTOP */

    if (document.fullscreenElement) {

        document.exitFullscreen();

        return;
    }


    const main =
        document.querySelector(
            "main"
        );


    if (!main) {
        return;
    }


    main
        .requestFullscreen()
        .catch(
            function(error) {

                console.error(
                    "Could not enter fullscreen:",
                    error
                );

            }
        );
}

function togglePlayRoomNav() {

    const nav =
        document.getElementById(
            "play-room-nav"
        );

    if (!nav) {
        return;
    }


    const isClosed =
        nav.classList.contains(
            "play-room-nav-closed"
        );


    if (isClosed) {

        nav.classList.remove(
            "play-room-nav-closed"
        );

        localStorage.setItem(
            "essazlife-play-room-nav-closed",
            "false"
        );

    } else {

        nav.classList.add(
            "play-room-nav-closed"
        );

        localStorage.setItem(
            "essazlife-play-room-nav-closed",
            "true"
        );

    }

}

/* =========================================================
   CUSTOM-AWARE FOCUS
========================================================= */

function focusPlayableEssa(
    essaId
) {

    applyPlayNeedsDecay();


    const playData =
        getSavedPlayData();


    const essa =
        getAnyPlayableEssaById(
            essaId
        );


    if (!essa) {

        return;
    }


    if (
        !playData
            .unlockedEssaIds
            .includes(
                essa.id
            )
    ) {

        if (
            essa.custom
        ) {

            alert(
                "That custom ESSA is not available."
            );

        } else {

            alert(
                `${essa.name} unlocks at Trainer Level ${essa.unlockLevel}.`
            );
        }


        return;
    }


    playData.selectedEssaId =
        essa.id;


    getPlayEssaStats(
        playData,
        essa.id
    );


    savePlayData(
        playData
    );


    stopPlayHouseTimers();


    renderPlayableEssaFocus(
        essa.id
    );
}


/* =========================================================
   CUSTOM-AWARE FOCUS SCREEN
========================================================= */

function renderPlayableEssaFocus(essaId) {

    resetPageTheme();

    stopPlayHouseTimers();

    applyPlayNeedsDecay();


    const playData =
        getSavedPlayData();


    const houseData =
        getSavedPlayHouseData();


    const essa =
        getAnyPlayableEssaById(
            essaId
        );


    if (
        !essa ||
        !playData
            .unlockedEssaIds
            .includes(
                essa.id
            )
    ) {

        renderPlayRoom();

        return;
    }


    const stats =
        getPlayEssaStats(
            playData,
            essa.id
        );


    const room =
        getEssaRoom(
            houseData,
            essa.id
        );


    const statusMessage =
        getEssaNeedMessage(
            essa,
            stats
        );


    document.querySelector(
        "main"
    ).innerHTML = `

        <div
            class="play-focus-wrapper"
            style="
                max-width:1000px;
                margin:0 auto;
            "
        >

            <div
                class="play-focus-room"
                style="
                    position:relative;
                    width:100%;
                    min-height:680px;
                    overflow:hidden;
                    border-radius:28px;
                    border:1px solid #dbe5e7;
                    box-shadow:0 8px 28px rgba(0,0,0,.12);

                    background-color:#eaf6f4;

                    background-image:
                        linear-gradient(
                            rgba(255,255,255,.08),
                            rgba(255,255,255,.08)
                        ),
                        url('${room.background}');

                    background-size:cover;
                    background-position:center;
                    background-repeat:no-repeat;
                "
            >


                <!-- BACK TO ROOM -->

                <div
                    class="play-focus-back"
                    style="
                        position:absolute;
                        top:18px;
                        left:18px;
                        z-index:50;
                    "
                >

                    <button
                        class="play-action-button primary"

                        onclick="
                            renderPlayRoom()
                        "
                    >
                        ← ${room.icon}
                        ${escapeHTML(
                            room.name
                        )}
                    </button>

                </div>


                <!-- NEEDS -->

                <div
                    class="play-focus-needs"
                    style="
                        position:absolute;
                        left:18px;
                        top:115px;
                        width:205px;
                        padding:14px;
                        box-sizing:border-box;
                        background:rgba(255,255,255,.93);
                        border-radius:18px;
                        box-shadow:0 4px 16px rgba(0,0,0,.12);
                        z-index:30;
                    "
                >

                    ${makePlayStatBar(
                        "🍎",
                        "Food",
                        stats.food
                    )}

                    ${makePlayStatBar(
                        "💧",
                        "Drink",
                        stats.water
                    )}

                    ${makePlayStatBar(
                        "🛁",
                        "Clean",
                        stats.cleanliness
                    )}

                    ${makePlayStatBar(
                        "💚",
                        "Happy",
                        stats.happiness
                    )}

                </div>


                <!-- ESSA -->

                <div
                    class="play-focus-essa"
                    style="
                        position:absolute;
                        top:105px;
                        left:50%;
                        transform:translateX(-50%);
                        width:min(52%,430px);
                        z-index:20;
                        text-align:center;
                    "
                >


                   <div
    <div
    class="play-focus-essa-scale"
    style="
       transform:translateY(125px) scale(0.72);
        transform-origin:center top;
    "
>
    ${makePlayableEssaVisual(
        essa,
        false,
        "focus"
    )}
</div>


                    <div
                        class="play-focus-name"
                        style="
                            display:inline-block;
                            padding:7px 16px;
                            margin-top:-5px;
                            background:rgba(255,255,255,.92);
                            border-radius:999px;
                            font-size:22px;
                            font-weight:bold;
                            box-shadow:0 3px 12px rgba(0,0,0,.12);
                        "
                    >
                        ${escapeHTML(
                            essa.name
                        )}
                    </div>

                </div>

                ${
    playFridgeFeedingBasket
        .filter(
            function(item) {
                return (
                    item.essaId ===
                    essa.id
                );
            }
        )
        .map(
            function(item, index) {

                return `

                    <div
                       class="play-fridge-basket-item"
data-basket-index="${index}"

onpointerdown="
    startPlayFridgeItemDrag(
        event,
        Number(
            this.dataset.basketIndex
        )
    )
"

style="
                            position:absolute;
                            right:${
    260 +
    (
        index % 2
    ) * 80
}px;
                            top:${
                                180 +
                                Math.floor(
                                    index / 2
                                ) * 90
                            }px;
                            width:70px;
                            height:70px;
                            z-index:70;
                            cursor:grab;
                            touch-action:none;
                        "
                    >

                        <img
                            src="${item.imagePath}"

                            alt="${
                                escapeHTML(
                                    item.itemName
                                )
                            }"

                            style="
                                width:70px;
                                height:70px;
                                object-fit:contain;
                                display:block;
                                pointer-events:none;
                            "
                        >

                    </div>

                `;
            }
        )
        .join("")
}

                <!-- ACTION MESSAGE -->

                <div
                    id="play-message"
                    style="
                        position:absolute;
                        left:50%;
                        bottom:115px;
                        transform:translateX(-50%);
                        min-width:220px;
                        max-width:70%;
                        padding:10px 16px;
                        box-sizing:border-box;
                        background:rgba(255,255,255,.94);
                        border-radius:999px;
                        font-weight:bold;
                        color:#26343b;
                        text-align:center;
                        opacity:0;
                        pointer-events:none;
                        transition:opacity .2s ease;
                        z-index:60;
                        box-shadow:0 3px 12px rgba(0,0,0,.12);
                    "
                ></div>


                <!-- FOOD / DRINK / BATHE -->

                


            </div>

        </div>

    `;
}

/* =========================================================
   CUSTOM-AWARE FOOD MENU
========================================================= */

function showPlayFoodMenu(
    essaId
) {

    const essa =
        getAnyPlayableEssaById(
            essaId
        );


    if (!essa) {

        return;
    }


    const itemsHTML =
        playFoods
            .map(
                function(food) {

                    return `

                        <button
                            onclick="
                                givePlayFood(
                                    '${essa.id}',
                                    '${food.id}'
                                )
                            "

                            style="
                                padding:15px 8px;
                                border:1px solid #dbe5e7;
                                border-radius:16px;
                                background:white;
                                cursor:pointer;
                            "
                        >

                            <div
                                style="
                                    font-size:40px;
                                "
                            >
                                ${food.icon}
                            </div>


                            <strong>
                                ${escapeHTML(
                                    food.name
                                )}
                            </strong>

                        </button>

                    `;

                }
            )
            .join("");


    document.querySelector(
        "main"
    ).innerHTML =
        makePlayItemMenuShell(
            essa,
            "🍎 Choose Food",
            `What would you like to feed ${escapeHTML(
                essa.name
            )}?`,
            itemsHTML
        );
}


/* =========================================================
   CUSTOM-AWARE DRINK MENU
========================================================= */

function showPlayDrinkMenu(
    essaId
) {

    const essa =
        getAnyPlayableEssaById(
            essaId
        );


    if (!essa) {

        return;
    }


    const itemsHTML =
        playDrinks
            .map(
                function(drink) {

                    return `

                        <button
                            onclick="
                                givePlayDrink(
                                    '${essa.id}',
                                    '${drink.id}'
                                )
                            "

                            style="
                                padding:15px 8px;
                                border:1px solid #dbe5e7;
                                border-radius:16px;
                                background:white;
                                cursor:pointer;
                            "
                        >

                            <div
                                style="
                                    font-size:40px;
                                "
                            >
                                ${drink.icon}
                            </div>


                            <strong>
                                ${escapeHTML(
                                    drink.name
                                )}
                            </strong>

                        </button>

                    `;

                }
            )
            .join("");


    document.querySelector(
        "main"
    ).innerHTML =
        makePlayItemMenuShell(
            essa,
            "🥤 Choose a Drink",
            `What would ${escapeHTML(
                essa.name
            )} like to drink?`,
            itemsHTML
        );
}


/* =========================================================
   CUSTOM-AWARE BATH MENU
========================================================= */

function showPlayBathMenu(
    essaId
) {

    const essa =
        getAnyPlayableEssaById(
            essaId
        );


    if (!essa) {

        return;
    }


    const itemsHTML =
        playSoaps
            .map(
                function(soap) {

                    return `

                        <button
                            onclick="
                                bathePlayableEssa(
                                    '${essa.id}',
                                    '${soap.id}'
                                )
                            "

                            style="
                                padding:15px 8px;
                                border:1px solid #dbe5e7;
                                border-radius:16px;
                                background:white;
                                cursor:pointer;
                            "
                        >

                            <div
                                style="
                                    width:48px;
                                    height:48px;
                                    margin:0 auto 8px auto;
                                    border-radius:14px;
                                    background:${soap.color};
                                    border:3px solid white;
                                    box-shadow:0 0 0 1px #cbd9dc;
                                "
                            ></div>


                            <strong>
                                ${escapeHTML(
                                    soap.name
                                )}
                            </strong>

                        </button>

                    `;

                }
            )
            .join("");


    document.querySelector(
        "main"
    ).innerHTML =
        makePlayItemMenuShell(
            essa,
            "🛁 Choose Soap",
            `Pick a soap color for ${escapeHTML(
                essa.name
            )}'s bath.`,
            itemsHTML
        );
}


/* =========================================================
   CUSTOM-AWARE GIVE FOOD
========================================================= */

function givePlayFood(
    essaId,
    foodId
) {

    const playData =
        getSavedPlayData();


    const essa =
        getAnyPlayableEssaById(
            essaId
        );


    const food =
        playFoods.find(
            function(item) {

                return (
                    item.id ===
                    foodId
                );

            }
        );


    if (
        !essa ||
        !food
    ) {

        return;
    }


    const stats =
        getPlayEssaStats(
            playData,
            essa.id
        );


    stats.food =
        normalizePlayStatValue(
            stats.food +
            food.food
        );


    stats.happiness =
        normalizePlayStatValue(
            stats.happiness +
            food.happiness
        );


    stats.lastFoodId =
        food.id;


    const result =
        addTrainerXP(
            playData,
            food.xp
        );


    savePlayData(
        playData
    );


    renderPlayableEssaFocus(
        essa.id
    );


   if (
    stats.food >= 100
) {

    showPlayMessage(
        `${essa.name}: "Yummy!"`
    );

} else {

    showPlayMessage(
        `${food.icon} ${essa.name} enjoyed the ${food.name}! +${food.xp} XP`
    );

}


    showPlayUnlockMessages(
        result
    );
}

/* =========================================================
   CUSTOM-AWARE GIVE DRINK
========================================================= */

function givePlayDrink(
    essaId,
    drinkId
) {

    const playData =
        getSavedPlayData();


    const essa =
        getAnyPlayableEssaById(
            essaId
        );


    const drink =
        playDrinks.find(
            function(item) {

                return (
                    item.id ===
                    drinkId
                );

            }
        );


    if (
        !essa ||
        !drink
    ) {

        return;
    }


    const stats =
        getPlayEssaStats(
            playData,
            essa.id
        );


    stats.water =
        normalizePlayStatValue(
            stats.water +
            drink.water
        );


    stats.happiness =
        normalizePlayStatValue(
            stats.happiness +
            drink.happiness
        );


    stats.lastDrinkId =
        drink.id;


    const result =
        addTrainerXP(
            playData,
            drink.xp
        );


    savePlayData(
        playData
    );


    renderPlayableEssaFocus(
        essa.id
    );


    if (
    stats.water >= 100
) {

    showPlayMessage(
        `${essa.name}: "That's Enough For Me"`
    );

} else {

    showPlayMessage(
        `${drink.icon} ${essa.name} had some ${drink.name}! +${drink.xp} XP`
    );

}

    showPlayUnlockMessages(
        result
    );
}


/* =========================================================
   CUSTOM-AWARE BATHE
========================================================= */

function bathePlayableEssa(
    essaId,
    soapId
) {

    const playData =
        getSavedPlayData();


    const essa =
        getAnyPlayableEssaById(
            essaId
        );


    const soap =
        playSoaps.find(
            function(item) {

                return (
                    item.id ===
                    soapId
                );

            }
        );


    if (
        !essa ||
        !soap
    ) {

        return;
    }


    const stats =
        getPlayEssaStats(
            playData,
            essa.id
        );


    stats.cleanliness =
        normalizePlayStatValue(
            stats.cleanliness +
            soap.cleanliness
        );


    stats.happiness =
        normalizePlayStatValue(
            stats.happiness +
            4
        );


    stats.lastSoapId =
        soap.id;


    const result =
        addTrainerXP(
            playData,
            soap.xp
        );


    savePlayData(
        playData
    );


    renderPlayableEssaFocus(
        essa.id
    );


   if (
    stats.cleanliness >= 100
) {

    showPlayMessage(
        `${essa.name}: "Squeaky Clean!"`
    );

} else {

    showPlayMessage(
        `🫧 ${essa.name} is squeaky clean with ${soap.name}! +${soap.xp} XP`
    );

}

    showPlayUnlockMessages(
        result
    );
}


/* =========================================================
   CUSTOM-AWARE PET
========================================================= */

function petPlayableEssa(
    essaId
) {

    const playData =
        getSavedPlayData();


    const essa =
        getAnyPlayableEssaById(
            essaId
        );


    if (!essa) {

        return;
    }


    const stats =
        getPlayEssaStats(
            playData,
            essa.id
        );


    stats.happiness =
        normalizePlayStatValue(
            stats.happiness +
            12
        );


    const result =
        addTrainerXP(
            playData,
            4
        );


    savePlayData(
        playData
    );


    renderPlayableEssaFocus(
        essa.id
    );


    if (
    stats.happiness >= 100
) {

    showPlayMessage(
        `${essa.name}: "💗"`
    );

} else {

    showPlayMessage(
        `💚 ${essa.name} loved the pets! +4 XP`
    );

}


    showPlayUnlockMessages(
        result
    );
}


/* =========================================================
   CUSTOM-AWARE NEED BUBBLES
========================================================= */

function refreshPlayHouseNeedBubbles() {

    const playData =
        getSavedPlayData();


    document
        .querySelectorAll(
            "[data-play-house-essa]"
        )
        .forEach(
            function(wrapper) {

                const essaId =
                    wrapper
                        .dataset
                        .playHouseEssa;


                const essa =
                    getAnyPlayableEssaById(
                        essaId
                    );


                if (!essa) {

                    return;
                }


                const stats =
                    getPlayEssaStats(
                        playData,
                        essa.id
                    );


                const oldBubble =
                    wrapper.querySelector(
                        ".play-house-speech"
                    );


                if (oldBubble) {

                    oldBubble.remove();
                }


                const bubbleHTML =
                    makeEssaNeedBubble(
                        essa,
                        stats
                    );


                if (!bubbleHTML) {

                    return;
                }


                wrapper.insertAdjacentHTML(
                    "afterbegin",
                    bubbleHTML
                );

            }
        );
}


/* =========================================================
   CUSTOM-AWARE ROOM MOVEMENT
========================================================= */

function moveEssasBetweenRooms() {

    const playData =
        getSavedPlayData();


    const houseData =
        getSavedPlayHouseData();


    let changed =
        false;


    playData
        .unlockedEssaIds
        .forEach(
            function(essaId) {

                const essa =
                    getAnyPlayableEssaById(
                        essaId
                    );


                if (!essa) {

                    return;
                }

                if (
    houseData
        .essaRooms[
            essaId
        ] ===
    "kennel"
) {

    return;
}


                if (
                    Math.random() >
                    0.38
                ) {

                    return;
                }


                const destination =
                    chooseEssaDestinationRoom(
                        essaId
                    );


                if (!destination) {

                    return;
                }


                const current =
                    houseData
                        .essaRooms[
                            essaId
                        ] ||
                    "playroom";


                if (
                    destination ===
                    current
                ) {

                    return;
                }


                houseData
                    .essaRooms[
                        essaId
                    ] =
                    destination;


                houseData
                    .essaPositions[
                        essaId
                    ] = {

                        x:
                            14 +
                            Math.random() *
                            72,

                        y:
                            48 +
                            Math.random() *
                            34

                    };


                changed =
                    true;

            }
        );


    if (!changed) {

        return;
    }


    savePlayHouseData(
        houseData
    );


    if (
        document.getElementById(
            "play-house-room"
        )
    ) {

        renderPlayRoom();
    }
}


/* =========================================================
   ESSATWIST
========================================================= */

const ESSATWIST_BOARD_SIZE =
    6;


const ESSATWIST_STARTING_MOVES =
    20;


let essaTwistState =
    null;


/* =========================================================
   ESSATWIST GEM PETS
========================================================= */

function getESSATwistPets() {

    /*
        The official eight are always
        available as ESSATwist gems.

        Once users create custom Play ESSAs,
        those can appear as bonus gems too.
    */

    return getAllPlayableEssas();
}


/* =========================================================
   RANDOM ESSATWIST GEM
========================================================= */

function makeRandomESSATwistGem() {

    const pets =
        getESSATwistPets();


    if (
        pets.length ===
        0
    ) {

        return null;
    }


    const pet =
        pets[
            Math.floor(
                Math.random() *
                pets.length
            )
        ];


    return {

        petId:
            pet.id

    };
}


/* =========================================================
   GET ESSATWIST PET
========================================================= */

function getESSATwistPetById(
    petId
) {

    return (
        getESSATwistPets()
            .find(
                function(pet) {

                    return (
                        String(
                            pet.id
                        ) ===
                        String(
                            petId
                        )
                    );

                }
            ) ||
        null
    );
}


/* =========================================================
   CREATE ESSATWIST BOARD
========================================================= */

function createESSATwistBoard() {

    const board =
        [];


    for (
        let row = 0;
        row <
        ESSATWIST_BOARD_SIZE;
        row++
    ) {

        const boardRow =
            [];


        for (
            let column = 0;
            column <
            ESSATWIST_BOARD_SIZE;
            column++
        ) {

            let gem =
                makeRandomESSATwistGem();


            let attempts =
                0;


            while (
                wouldCreateStartingMatch(
                    board,
                    boardRow,
                    row,
                    column,
                    gem
                )

                &&

                attempts <
                50
            ) {

                gem =
                    makeRandomESSATwistGem();


                attempts++;
            }


            boardRow.push(
                gem
            );
        }


        board.push(
            boardRow
        );
    }


    return board;
}


/* =========================================================
   PREVENT STARTING MATCHES
========================================================= */

function wouldCreateStartingMatch(
    board,
    currentRow,
    row,
    column,
    gem
) {

    if (!gem) {

        return false;
    }


    if (
        column >=
        2
    ) {

        const first =
            currentRow[
                column -
                1
            ];


        const second =
            currentRow[
                column -
                2
            ];


        if (
            first &&
            second &&
            first.petId ===
                gem.petId &&
            second.petId ===
                gem.petId
        ) {

            return true;
        }
    }


    if (
        row >=
        2
    ) {

        const first =
            board[
                row -
                1
            ]
            ?.[column];


        const second =
            board[
                row -
                2
            ]
            ?.[column];


        if (
            first &&
            second &&
            first.petId ===
                gem.petId &&
            second.petId ===
                gem.petId
        ) {

            return true;
        }
    }


    return false;
}


/* =========================================================
   OPEN ESSATWIST
========================================================= */

function openESSATwist() {

    stopPlayHouseTimers();


    essaTwistState = {

        board:
            createESSATwistBoard(),

        selected:
            null,

        moves:
            ESSATWIST_STARTING_MOVES,

        score:
            0,

        coinMilestonesPaid:
    0,

        combo:
            1,

        busy:
            false

    };


    renderESSATwist();
}


/* =========================================================
   RENDER ESSATWIST
========================================================= */

function renderESSATwist() {

    if (!essaTwistState) {

        openESSATwist();
        return;
    }


    const boardHTML =
        essaTwistState.board
            .map(
                function(
                    row,
                    rowIndex
                ) {

                    return row
                        .map(
                            function(
                                gem,
                                columnIndex
                            ) {

                                const pet =
                                    gem
                                        ? getESSATwistPetById(
                                            gem.petId
                                        )
                                        : null;


                                const selected =
                                    essaTwistState.selected &&
                                    essaTwistState.selected.row ===
                                        rowIndex &&
                                    essaTwistState.selected.column ===
                                        columnIndex;


                                if (!pet) {

                                    return `

                                        <div
                                            class="essatwist-gem"
                                            style="
                                                aspect-ratio:1/1;
                                            "
                                        ></div>

                                    `;
                                }


                                return `

                                    <button
                                        class="essatwist-gem"

                                        onclick="
                                            selectESSATwistGem(
                                                ${rowIndex},
                                                ${columnIndex}
                                            )
                                        "

                                        style="
                                            aspect-ratio:1/1;

                                            padding:4px;

                                            overflow:hidden;

                                            border:
                                                ${
                                                    selected
                                                        ? "3px solid #4fb5ae"
                                                        : "2px solid rgba(255,255,255,.8)"
                                                };

                                            border-radius:14px;

                                            background:
                                                rgba(
                                                    255,
                                                    255,
                                                    255,
                                                    .88
                                                );

                                            cursor:pointer;

                                            box-shadow:
                                                0 2px 8px
                                                rgba(
                                                    0,
                                                    0,
                                                    0,
                                                    .12
                                                );
                                        "
                                    >

                                        <img
                                            src="${pet.image}"

                                            alt="${escapeHTML(
                                                pet.name
                                            )}"

                                            onerror="
                                                this.style.display='none';
                                                this.nextElementSibling.style.display='flex';
                                            "

                                            style="
                                                width:100%;
                                                height:100%;
                                                object-fit:contain;
                                            "
                                        >


                                        <div
                                            style="
                                                display:none;

                                                width:100%;
                                                height:100%;

                                                align-items:center;
                                                justify-content:center;

                                                font-size:28px;
                                            "
                                        >
                                            ${pet.fallbackIcon}
                                        </div>

                                    </button>

                                `;

                            }
                        )
                        .join("");

                }
            )
            .join("");


    document.querySelector(
        "main"
    ).innerHTML = `

        <div
            class="essatwist-screen"

            style="
                min-height:
                    calc(
                        100vh -
                        120px
                    );

                padding:20px;

                box-sizing:border-box;

                background-image:
                    url(
                        'arcade-backgrounds/essatwist-bg.png'
                    );

                background-size:cover;
                background-position:center;
                background-repeat:no-repeat;
            "
        >

            <div
                class="essatwist-panel"

                style="
                    max-width:760px;

                    margin:0 auto;
                    padding:20px;

                    box-sizing:border-box;
                    text-align:center;

                    background:
                        rgba(
                            255,
                            255,
                            255,
                            .88
                        );

                    border-radius:24px;

                    box-shadow:
                        0 8px 28px
                        rgba(
                            0,
                            0,
                            0,
                            .12
                        );
                "
            >


                <div
                    class="essatwist-topbar"
                >

                    <button
                        type="button"

                        class="
                            play-action-button
                            primary
                            essatwist-back
                        "

                        onclick="
                            renderPlayRoom()
                        "
                    >
                        ← 🎮 Back to Arcade
                    </button>


                    <h1
                        class="essatwist-title"
                        style="margin:0;"
                    >
                        💎 ESSATwist
                    </h1>


                    <button
                        class="
                            play-action-button
                            primary
                            essatwist-restart
                        "

                        onclick="
                            restartESSATwist()
                        "
                    >
                        🔄 Restart
                    </button>

                </div>


                <p
                    class="essatwist-description"

                    style="
                        color:#68777b;
                    "
                >
                    Swap neighboring ESSAs
                    and match 3 or more!
                </p>


                <div
                    class="essatwist-stats"

                    style="
                        display:flex;
                        justify-content:center;

                        gap:14px;
                        flex-wrap:wrap;

                        margin-bottom:18px;
                    "
                >

                    <div
                        class="essatwist-stat"

                        style="
                            padding:9px 15px;

                            background:white;

                            border:
                                1px solid
                                #dbe5e7;

                            border-radius:999px;

                            font-weight:bold;
                        "
                    >
                        🎯 Score:
                        ${essaTwistState.score}
                    </div>


                    <div
                        class="essatwist-stat"

                        style="
                            padding:9px 15px;

                            background:white;

                            border:
                                1px solid
                                #dbe5e7;

                            border-radius:999px;

                            font-weight:bold;
                        "
                    >
                        🔄 Moves:
                        ${essaTwistState.moves}
                    </div>

                </div>


                <div
                    class="essatwist-board"

                    style="
                        width:min(100%,620px);

                        margin:0 auto;

                        display:grid;

                        grid-template-columns:
                            repeat(
                                ${ESSATWIST_BOARD_SIZE},
                                1fr
                            );

                        gap:6px;

                        padding:12px;

                        box-sizing:border-box;

                        background:
                            rgba(
                                79,
                                181,
                                174,
                                .15
                            );

                        border:
                            1px solid
                            #b9d6d3;

                        border-radius:24px;
                    "
                >

                    ${boardHTML}

                </div>


            </div>

        </div>

    `;
}
/* =========================================================
   SELECT ESSATWIST GEM
========================================================= */

function selectESSATwistGem(
    row,
    column
) {

    if (
        !essaTwistState ||
        essaTwistState.busy
    ) {

        return;
    }


    if (
        !essaTwistState.selected
    ) {

        essaTwistState.selected = {

            row:
                row,

            column:
                column

        };


        renderESSATwist();

        return;
    }


    const first =
        essaTwistState.selected;


    const second = {

        row:
            row,

        column:
            column

    };


    if (
        first.row ===
            second.row &&
        first.column ===
            second.column
    ) {

        essaTwistState.selected =
            null;


        renderESSATwist();

        return;
    }


    if (
        !areESSATwistGemsAdjacent(
            first,
            second
        )
    ) {

        essaTwistState.selected =
            second;


        renderESSATwist();

        return;
    }


    essaTwistState.selected =
        null;


    tryESSATwistSwap(
        first,
        second
    );
}


/* =========================================================
   CHECK ADJACENCY
========================================================= */

function areESSATwistGemsAdjacent(
    first,
    second
) {

    const rowDifference =
        Math.abs(
            first.row -
            second.row
        );


    const columnDifference =
        Math.abs(
            first.column -
            second.column
        );


    return (
        rowDifference +
        columnDifference
    ) ===
    1;
}


/* =========================================================
   SWAP GEMS
========================================================= */

function swapESSATwistGems(
    first,
    second
) {

    const board =
        essaTwistState.board;


    const temporary =
        board[
            first.row
        ][
            first.column
        ];


    board[
        first.row
    ][
        first.column
    ] =
        board[
            second.row
        ][
            second.column
        ];


    board[
        second.row
    ][
        second.column
    ] =
        temporary;
}


/* =========================================================
   TRY SWAP
========================================================= */

async function tryESSATwistSwap(
    first,
    second
) {

    if (
        !essaTwistState ||
        essaTwistState.busy
    ) {

        return;
    }


    essaTwistState.busy =
        true;


    swapESSATwistGems(
        first,
        second
    );


    const matches =
        findESSATwistMatches();


    if (
        matches.length ===
        0
    ) {

        swapESSATwistGems(
            first,
            second
        );


        essaTwistState.busy =
            false;


        renderESSATwist();

        return;
    }


    essaTwistState.moves =
        Math.max(
            0,
            essaTwistState.moves -
            1
        );


    essaTwistState.combo =
        1;


    await resolveESSATwistMatches();


    essaTwistState.busy =
        false;


    if (
        essaTwistState.moves <=
        0
    ) {

        finishESSATwistGame();

        return;
    }


    renderESSATwist();
}


/* =========================================================
   FIND MATCHES
========================================================= */

function findESSATwistMatches() {

    if (
        !essaTwistState
    ) {

        return [];
    }


    const board =
        essaTwistState.board;


    const matches =
        new Set();


    for (
        let row = 0;
        row <
        ESSATWIST_BOARD_SIZE;
        row++
    ) {

        let runStart =
            0;


        for (
            let column = 1;
            column <=
            ESSATWIST_BOARD_SIZE;
            column++
        ) {

            const previous =
                board[
                    row
                ][
                    column -
                    1
                ];


            const current =
                column <
                ESSATWIST_BOARD_SIZE

                    ? board[
                        row
                    ][
                        column
                    ]

                    : null;


            if (
                previous &&
                current &&
                previous.petId ===
                    current.petId
            ) {

                continue;
            }


            const runLength =
                column -
                runStart;


            if (
                runLength >=
                3
            ) {

                for (
                    let index =
                        runStart;

                    index <
                        column;

                    index++
                ) {

                    matches.add(
                        `${row},${index}`
                    );
                }
            }


            runStart =
                column;
        }
    }


    for (
        let column = 0;
        column <
        ESSATWIST_BOARD_SIZE;
        column++
    ) {

        let runStart =
            0;


        for (
            let row = 1;
            row <=
            ESSATWIST_BOARD_SIZE;
            row++
        ) {

            const previous =
                board[
                    row -
                    1
                ][
                    column
                ];


            const current =
                row <
                ESSATWIST_BOARD_SIZE

                    ? board[
                        row
                    ][
                        column
                    ]

                    : null;


            if (
                previous &&
                current &&
                previous.petId ===
                    current.petId
            ) {

                continue;
            }


            const runLength =
                row -
                runStart;


            if (
                runLength >=
                3
            ) {

                for (
                    let index =
                        runStart;

                    index <
                        row;

                    index++
                ) {

                    matches.add(
                        `${index},${column}`
                    );
                }
            }


            runStart =
                row;
        }
    }


    return Array
        .from(
            matches
        )
        .map(
            function(value) {

                const parts =
                    value
                        .split(
                            ","
                        );


                return {

                    row:
                        Number(
                            parts[0]
                        ),

                    column:
                        Number(
                            parts[1]
                        )

                };

            }
        );
}


/* =========================================================
   RESOLVE MATCHES + CASCADES
========================================================= */

async function resolveESSATwistMatches() {

    while (true) {

        const matches =
            findESSATwistMatches();


        if (
            matches.length ===
            0
        ) {

            break;
        }


        const clearedCount =
            matches.length;


        const gainedScore =
            clearedCount *
            10 *
            essaTwistState.combo;


        essaTwistState.score +=
            gainedScore;


        const milestonesReached =
            Math.floor(
                essaTwistState.score /
                100
            );


        const newMilestones =
            milestonesReached -
            essaTwistState.coinMilestonesPaid;


        if (
            newMilestones > 0
        ) {

            /*
                Coin reward per milestone:
                Weekdays = 20 coins
                Weekends = 100 coins
            */

            const coinsPerMilestone =
                getPlayGameCoinReward(
                    20
                );


            addPendingPlayCoins(
                newMilestones *
                coinsPerMilestone
            );


            essaTwistState.coinMilestonesPaid =
                milestonesReached;
        }


        awardESSATwistXP(
            clearedCount
        );


        matches.forEach(
            function(position) {

                essaTwistState
                    .board[
                        position.row
                    ][
                        position.column
                    ] =
                    null;

            }
        );


        collapseESSATwistBoard();


        essaTwistState.combo++;


        await new Promise(
            function(resolve) {

                setTimeout(
                    resolve,
                    150
                );

            }
        );
    }
}


/* =========================================================
   COLLAPSE BOARD
========================================================= */

function collapseESSATwistBoard() {

    const board =
        essaTwistState.board;


    for (
        let column = 0;
        column <
        ESSATWIST_BOARD_SIZE;
        column++
    ) {

        const remaining =
            [];


        for (
            let row =
                ESSATWIST_BOARD_SIZE -
                1;

            row >=
                0;

            row--
        ) {

            const gem =
                board[
                    row
                ][
                    column
                ];


            if (gem) {

                remaining.push(
                    gem
                );
            }
        }


        let index =
            0;


        for (
            let row =
                ESSATWIST_BOARD_SIZE -
                1;

            row >=
                0;

            row--
        ) {

            if (
                index <
                remaining.length
            ) {

                board[
                    row
                ][
                    column
                ] =
                    remaining[
                        index
                    ];


                index++;

            } else {

                board[
                    row
                ][
                    column
                ] =
                    makeRandomESSATwistGem();
            }
        }
    }
}


/* =========================================================
   ESSATWIST XP
========================================================= */

function awardESSATwistXP(
    clearedCount
) {

    const playData =
        getSavedPlayData();


    const xp =
        Math.max(
            1,
            Math.floor(
                clearedCount /
                3
            )
        );


    addTrainerXP(
        playData,
        xp
    );


    savePlayData(
        playData
    );
}


/* =========================================================
   FINISH ESSATWIST
========================================================= */

function finishESSATwistGame() {

    if (
        !essaTwistState
    ) {

        return;
    }


    const score =
        essaTwistState.score;


    document.querySelector(
        "main"
    ).innerHTML = `

       

        <div
            style="
                max-width:650px;
                margin:0 auto;
                text-align:center;
            "
        >

            <div
                style="
                    padding:35px;
                    background:white;
                    border:1px solid #dbe5e7;
                    border-radius:26px;
                    box-shadow:0 5px 20px rgba(0,0,0,.08);
                "
            >

                <div
                    style="
                        font-size:65px;
                    "
                >
                    💎
                </div>


                <h1>
                    ESSATwist Complete!
                </h1>


                <p
                    style="
                        font-size:25px;
                        font-weight:bold;
                    "
                >
                    Score:
                    ${score}
                </p>


                <p
                    style="
                        color:#68777b;
                    "
                >
                    Matching ESSAs earned
                    Trainer XP while you played.
                </p>


                <div
                    style="
                        display:flex;
                        gap:10px;
                        justify-content:center;
                        flex-wrap:wrap;
                        margin-top:22px;
                    "
                >

                    <button
    onclick="
        restartESSATwist()
    "

    style="
        margin-top:18px;

        padding:10px 16px;

        border:none;
        border-radius:14px;

        background:
            var(
                --user-theme-color,
                #4fb5ae
            );

        color:white;

        font-weight:600;
        font-size:14px;

        cursor:pointer;
    "
>
    🔄 Restart
</button>


                   <button
    type="button"

    onclick="
        renderPlayRoom()
    "

    style="
        display:flex;
        align-items:center;
        gap:8px;

        padding:10px 16px;

        border:none;
        border-radius:14px;

        background:
            var(
                --user-theme-color,
                #4fb5ae
            );

        color:white;

        font-weight:600;
        font-size:14px;

        cursor:pointer;
        white-space:nowrap;
    "
>
    <span
        style="
            font-size:18px;
            line-height:1;
        "
    >
        ←
    </span>

    <span>🎮</span>

    <span>
        Back to Arcade
    </span>
</button>

                </div>

            </div>

        </div>

    `;
}


/* =========================================================
   RESTART ESSATWIST
========================================================= */

function restartESSATwist() {

    openESSATwist();
}


/* =========================================================
   FINAL CUSTOM ESSA HOUSE INITIALIZATION
========================================================= */

function initializeCustomPlayEssas() {

    const playData =
        getSavedPlayData();


    const houseData =
        getSavedPlayHouseData();


    const customEssas =
        getSavedCustomPlayEssas();


    let changed =
        false;


    customEssas.forEach(
        function(essa) {

            

            if (
                !playData
                    .unlockedEssaIds
                    .includes(
                        essa.id
                    )
            ) {

                playData
                    .unlockedEssaIds
                    .push(
                        essa.id
                    );


                changed =
                    true;
            }


            getPlayEssaStats(
                playData,
                essa.id
            );


            if (
                !houseData
                    .essaRooms[
                        essa.id
                    ]
            ) {

                houseData
                    .essaRooms[
                        essa.id
                    ] =
                    "playroom";


                changed =
                    true;
            }


            if (
                !houseData
                    .essaPositions[
                        essa.id
                    ]
            ) {

                houseData
                    .essaPositions[
                        essa.id
                    ] = {

                        x:
                            25 +
                            Math.random() *
                            50,

                        y:
                            58 +
                            Math.random() *
                            18

                    };


                changed =
                    true;
            }

        }
    );


    if (changed) {

        savePlayData(
            playData
        );


        savePlayHouseData(
            houseData
        );
    }
}


/* =========================================================
   FINAL PLAY INITIALIZATION
========================================================= */

function initializePlaySystems() {

    installPlayHouseStyles();


    initializeCustomPlayEssas();
}


/* =========================================================
   START APP
========================================================= */

function startESSAzLife() {

    setupHeaderButtons();

    /*
        Connect the logged-in World account
        to its PlayMode data profile.
    */
    const user =
        connectWorldAccountToPlayMode();


    if (user) {

        showHeaderButtons(
            true
        );

        initializePlaySystems();

        renderPlayTab();

    } else {

        /*
            PlayMode inside World should only
            be entered through a logged-in
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

/* =========================================================
   PLAYMODE LANDSCAPE ORIENTATION
========================================================= */

async function lockPlayModeLandscape() {

    if (
        screen.orientation &&
        typeof screen.orientation.lock === "function"
    ) {
        try {
            await screen.orientation.lock("landscape");
        } catch (error) {
            console.log(
                "Landscape lock is not supported here:",
                error
            );
        }
    }
}


// Try when PlayMode loads.
window.addEventListener(
    "load",
    function () {
        lockPlayModeLandscape();
    }
);


// Try again after the user's first interaction.
// Some browsers require a user action before orientation can be locked.
document.addEventListener(
    "click",
    function requestLandscapeOnce() {

        lockPlayModeLandscape();

        document.removeEventListener(
            "click",
            requestLandscapeOnce
        );
    }
);
