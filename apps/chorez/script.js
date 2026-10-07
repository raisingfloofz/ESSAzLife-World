// ==========================================
// ESSAzLife Chorez
// script.js
// ==========================================


// ==========================================
// ELEMENTS
// ==========================================


// ---------- TOP NAVIGATION ----------

const worldButton =
    document.getElementById(
        "world-button"
    );

const helpButton =
    document.getElementById(
        "help-button"
    );

const profileButton =
    document.getElementById(
        "profile-button"
    );

const mainChorezDateTime =
    document.getElementById(
        "main-chorez-datetime"
    );
    
// ---------- PROFILE MENU ----------

const profileMenuOverlay =
    document.getElementById(
        "profile-menu-overlay"
    );

const closeProfileMenuButton =
    document.getElementById(
        "close-profile-menu"
    );

const profileMenuUsername =
    document.getElementById(
        "profile-menu-username"
    );

const dateTimeButton =
    document.getElementById(
        "date-time-button"
    );

const backupButton =
    document.getElementById(
        "backup-button"
    );

const restoreButton =
    document.getElementById(
        "restore-button"
    );

const restoreFileInput =
    document.getElementById(
        "restore-file-input"
    );

// ==========================================
// BACK TO ESSAZLIFE WORLD
// ==========================================

worldButton.addEventListener(
    "click",
    () => {

        window.location.href =
            "../../index.html";
    }
);

// ---------- HELP POPUP ----------

const helpOverlay =
    document.getElementById(
        "help-overlay"
    );

const closeHelpButton =
    document.getElementById(
        "close-help"
    );

const watchTutorialButton =
    document.getElementById(
        "watch-tutorial-button"
    );


// ---------- CHORE HISTORY ----------

const historyButton =
    document.getElementById(
        "history-button"
    );

const historyOverlay =
    document.getElementById(
        "history-overlay"
    );

const historyList =
    document.getElementById(
        "history-list"
    );

const closeHistoryButton =
    document.getElementById(
        "close-history"
    );

const historyCalendarView =
    document.getElementById(
        "history-calendar-view"
    );

const historyDayView =
    document.getElementById(
        "history-day-view"
    );

const historyCalendarGrid =
    document.getElementById(
        "history-calendar-grid"
    );

const historyCalendarMonthHeading =
    document.getElementById(
        "history-calendar-month"
    );

const historyPreviousMonthButton =
    document.getElementById(
        "history-previous-month"
    );

const historyNextMonthButton =
    document.getElementById(
        "history-next-month"
    );

const historyBackToCalendarButton =
    document.getElementById(
        "history-back-to-calendar"
    );

const closeHistoryDayButton =
    document.getElementById(
        "close-history-day"
    );

const historySelectedDate =
    document.getElementById(
        "history-selected-date"
    );

const historyAddChoreButton =
    document.getElementById(
        "history-add-chore"
    );

// ---------- CHORE HISTORY ACTION MENU ----------

const historyChoreMenu =
    document.getElementById(
        "history-chore-menu"
    );

const historyChoreMenuName =
    document.getElementById(
        "history-chore-menu-name"
    );

const historyEditChoreButton =
    document.getElementById(
        "history-edit-chore"
    );

const historyCompleteChoreButton =
    document.getElementById(
        "history-complete-chore"
    );

const historyDeleteChoreButton =
    document.getElementById(
        "history-delete-chore"
    );

const historyCancelChoreMenuButton =
    document.getElementById(
        "history-cancel-chore-menu"
    );

let selectedHistoryChoreType = null;
let selectedHistoryChore = null;

// ---------- DELETE CHORE CONFIRMATION ----------

const historyDeleteConfirm =
    document.getElementById(
        "history-delete-confirm"
    );

const historyDeleteConfirmMessage =
    document.getElementById(
        "history-delete-confirm-message"
    );

const historyConfirmDeleteButton =
    document.getElementById(
        "history-confirm-delete"
    );

const historyCancelDeleteButton =
    document.getElementById(
        "history-cancel-delete"
    );

// ---------- DATE & TIME ----------

const dateTimeOverlay =
    document.getElementById(
        "date-time-overlay"
    );

const dateTimeTitle =
    document.getElementById(
        "date-time-title"
    );

const chorezDateInput =
    document.getElementById(
        "chorez-date"
    );

const chorezTimeInput =
    document.getElementById(
        "chorez-time"
    );

const dateTimeError =
    document.getElementById(
        "date-time-error"
    );

const cancelDateTimeButton =
    document.getElementById(
        "cancel-date-time"
    );

const saveDateTimeButton =
    document.getElementById(
        "save-date-time"
    );


// ---------- INTRO ----------

const introOverlay =
    document.getElementById(
        "intro-overlay"
    );

const introMooCow =
    document.getElementById(
        "intro-moocow"
    );

const speechBubble =
    document.getElementById(
        "moocow-speech"
    );

const finishIntroButton =
    document.getElementById(
        "finish-intro"
    );


// ---------- CHORES ----------

const addChoreButton =
    document.getElementById(
        "add-chore"
    );

const chorePopup =
    document.getElementById(
        "chore-popup"
    );

const choreNameInput =
    document.getElementById(
        "chore-name"
    );

    const chorePopupTitle =
    document.getElementById(
        "chore-popup-title"
    );

const saveChoreButton =
    document.getElementById(
        "save-chore"
    );

const cancelChoreButton =
    document.getElementById(
        "cancel-chore"
    );

const choreList =
    document.getElementById(
        "chore-list"
    );

const coinCount =
    document.getElementById(
        "coin-count"
    );


// ---------- MOOCOW ROOM ----------

const visitMooCowButton =
    document.getElementById(
        "visit-moocow"
    );

const mooCowRoomOverlay =
    document.getElementById(
        "moocow-room-overlay"
    );

const closeMooCowRoomButton =
    document.getElementById(
        "close-moocow-room"
    );

const roomCoinCount =
    document.getElementById(
        "room-coin-count"
    );

const mooCowFridge =
    document.getElementById(
        "moocow-fridge"
    );

const mooCowTeddy =
    document.getElementById(
        "moocow-teddy"
    );

const roomMooCow =
    document.getElementById(
        "room-moocow"
    );

const roomMooCowSpeech =
    document.getElementById(
        "room-moocow-speech"
    );

const mooCowSuitcase =
    document.getElementById(
        "moocow-suitcase"
    );

const roomFood =
    document.getElementById(
        "room-food"
    );


// ---------- VOIDY ----------

const voidyScreen =
    document.getElementById(
        "voidy-screen"
    );

const closeVoidyScreenButton =
    document.getElementById(
        "close-voidy-screen"
    );


// ---------- HUNGER ----------

const hungerFill =
    document.getElementById(
        "hunger-fill"
    );

const hungerNumber =
    document.getElementById(
        "hunger-number"
    );

const hungerMessage =
    document.getElementById(
        "hunger-message"
    );


// ---------- FOOD CAROUSEL ----------

const foodCarouselOverlay =
    document.getElementById(
        "food-carousel-overlay"
    );

const closeFoodCarouselButton =
    document.getElementById(
        "close-food-carousel"
    );

const previousFoodButton =
    document.getElementById(
        "previous-food"
    );

const nextFoodButton =
    document.getElementById(
        "next-food"
    );

const carouselFoodImage =
    document.getElementById(
        "carousel-food-image"
    );

const carouselFoodName =
    document.getElementById(
        "carousel-food-name"
    );

const foodCarouselCoinCount =
    document.getElementById(
        "food-carousel-coin-count"
    );

const getFoodButton =
    document.getElementById(
        "get-food-button"
    );


// ---------- MOOCOW MESSAGE ----------

const mooCowMessageOverlay =
    document.getElementById(
        "moocow-message-overlay"
    );

const mooCowMessageTitle =
    document.getElementById(
        "moocow-message-title"
    );

const mooCowMessageText =
    document.getElementById(
        "moocow-message-text"
    );

const closeMooCowMessageButton =
    document.getElementById(
        "close-moocow-message"
    );


// ==========================================
// FOOD
// ==========================================

const foods = [
    {
        name: "Banana Disks",
        image: "chorez-images/banana-disks.png"
    },
    {
        name: "Beef Yarn",
        image: "chorez-images/beef-yarn.png"
    },
    {
        name: "Blueberry Bites",
        image: "chorez-images/blueberry-bites.png"
    },
    {
        name: "Gizm-Os",
        image: "chorez-images/gizm-os.png"
    },
    {
        name: "PB Chicken Rice",
        image: "chorez-images/pb-chicken-rice.png"
    },
    {
        name: "Rainbow Rocks",
        image: "chorez-images/rainbow-rocks.png"
    },
    {
        name: "Classic Rocks",
        image: "chorez-images/rocks-classic.png"
    },
    {
        name: "Spinach Slices",
        image: "chorez-images/spinach-slices.png"
    }
];

let currentFoodIndex = 0;


// ==========================================
// HUNGER SETTINGS
// ==========================================

// RELEASE RATE:
// MooCow loses 1 hunger every 30 minutes.
// Full hunger lasts 50 hours.

const HUNGER_INTERVAL =
    30 * 60 * 1000;

const HUNGER_LOSS =
    1;


// ==========================================
// PROFILE HELPERS
// ==========================================
// ==========================================
// CHORE HISTORY
// ==========================================

const MONTH_NAMES = [
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


const DAY_NAMES = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];


function getHistoryDateKey(parts) {

    return (
        parts.year +
        "-" +
        padClockNumber(parts.month) +
        "-" +
        padClockNumber(parts.day)
    );
}


function formatHistoryDate(entry) {

    /*
       Numeric constructor again!

       We are NOT parsing the stored
       YYYY-MM-DD date key.
    */

    const date =
        new Date(
            entry.year,
            entry.month - 1,
            entry.day
        );


    const dayName =
        DAY_NAMES[
            date.getDay()
        ];


    return (
        dayName +
        ", " +
        MONTH_NAMES[
            entry.month - 1
        ] +
        " " +
        entry.day +
        ", " +
        entry.year
    );
}


function formatHistoryTime(entry) {

    let hour =
        entry.hour;

    const minute =
        padClockNumber(
            entry.minute
        );


    const suffix =
        hour >= 12
            ? "PM"
            : "AM";


    hour =
        hour % 12;


    if (hour === 0) {
        hour = 12;
    }


    return (
        hour +
        ":" +
        minute +
        " " +
        suffix
    );
}

function getChorezProfile() {

    const saved =
        localStorage.getItem("chorezProfile");

    if (!saved) {
        return null;
    }

    try {

        return JSON.parse(saved);

    } catch (error) {

        console.error(
            "Could not read Chorez profile:",
            error
        );

        return null;
    }
}


function saveChorezProfile(profile) {

    localStorage.setItem(
        "chorezProfile",
        JSON.stringify(profile)
    );
}

// ==========================================
// CHOREZ CLOCK
// ==========================================

function openFirstTimeClockSetup() {

    const parts =
        getDeviceDateTimeParts();


    chorezDateInput.value =
        clockPartsToDateInput(
            parts
        );


    chorezTimeInput.value =
        clockPartsToTimeInput(
            parts
        );


    dateTimeTitle.textContent =
        "Set Your Date & Time";


    dateTimeError.textContent = "";

    dateTimeError.classList.add(
        "hidden"
    );


    dateTimeOverlay.dataset.mode =
        "firstSetup";


    // They need to set it before continuing.
    cancelDateTimeButton.classList.add(
        "hidden"
    );


    saveDateTimeButton.textContent =
        "START CHOREZ";


    dateTimeOverlay.classList.remove(
        "hidden"
    );
}

function getDeviceDateTimeParts() {

    const now =
        new Date();

    return {
        year:
            now.getFullYear(),

        month:
            now.getMonth() + 1,

        day:
            now.getDate(),

        hour:
            now.getHours(),

        minute:
            now.getMinutes()
    };
}


function padClockNumber(number) {

    return String(number).padStart(
        2,
        "0"
    );
}


function clockPartsToDateInput(parts) {

    return (
        parts.year +
        "-" +
        padClockNumber(parts.month) +
        "-" +
        padClockNumber(parts.day)
    );
}


function clockPartsToTimeInput(parts) {

    return (
        padClockNumber(parts.hour) +
        ":" +
        padClockNumber(parts.minute)
    );
}


function getCurrentChorezDateTime() {

    const profile =
        getChorezProfile();


    if (
        !profile ||
        !profile.chorezClock
    ) {

        return null;
    }


    const clock =
        profile.chorezClock;


    const elapsedMilliseconds =
        Date.now() -
        clock.realStartedAt;


    /*
       We deliberately construct this using
       numeric components instead of parsing
       a YYYY-MM-DD string.

       That avoids the date-only UTC problem.
    */

    const baseDate =
        new Date(
            clock.year,
            clock.month - 1,
            clock.day,
            clock.hour,
            clock.minute,
            0,
            0
        );


    const currentDate =
        new Date(
            baseDate.getTime() +
            elapsedMilliseconds
        );


    return {
        year:
            currentDate.getFullYear(),

        month:
            currentDate.getMonth() + 1,

        day:
            currentDate.getDate(),

        hour:
            currentDate.getHours(),

        minute:
            currentDate.getMinutes()
    };
}

function updateMainChorezDateTime() {

    if (!mainChorezDateTime) {
        return;
    }


    const currentClock =
        getCurrentChorezDateTime() ||
        getDeviceDateTimeParts();


    const date =
        new Date(
            currentClock.year,
            currentClock.month,
            currentClock.day,
            currentClock.hour || 0,
            currentClock.minute || 0
        );


    const dateText =
        date.toLocaleDateString(
            "en-US",
            {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric"
            }
        );


    const timeText =
        date.toLocaleTimeString(
            "en-US",
            {
                hour: "numeric",
                minute: "2-digit"
            }
        );


    mainChorezDateTime.textContent =
        dateText +
        " • " +
        timeText;
}

updateMainChorezDateTime();

setInterval(
    updateMainChorezDateTime,
    1000
);


// ==========================================
// SUCCESS POPUP
// ==========================================

function showSuccessPopup(
    title,
    message
) {

    successPopupTitle.textContent =
        title;

    successPopupMessage.textContent =
        message;

    successPopupOverlay.classList.remove(
        "hidden"
    );
}

// ==========================================
// PROFILE MENU
// ==========================================

profileButton.addEventListener(
    "click",
    () => {

        const profile =
            getChorezProfile();

        if (profileMenuUsername) {

            profileMenuUsername.textContent =
                profile?.username
                    ? "@" + profile.username
                    : "";
        }

        profileMenuOverlay.classList.remove(
            "hidden"
        );
    }
);


closeProfileMenuButton.addEventListener(
    "click",
    () => {

        profileMenuOverlay.classList.add(
            "hidden"
        );
    }
);


function initializeApp() {

    const worldLoggedIn =
        localStorage.getItem(
            "essazlifeWorldLoggedIn"
        ) === "true";


    const savedWorldAccount =
        localStorage.getItem(
            "essazlifeWorldAccount"
        );


    // Chorez can only be opened through
    // a logged-in ESSAzLife World account.
    if (
        !worldLoggedIn ||
        !savedWorldAccount
    ) {

        window.location.href =
            "../../index.html";

        return;
    }


    let worldAccount;


    try {

        worldAccount =
            JSON.parse(
                savedWorldAccount
            );

    } catch (error) {

        window.location.href =
            "../../index.html";

        return;
    }


    let profile =
        getChorezProfile();


    // First time this World account
    // has opened Chorez.
    if (!profile) {

        profile = {

            username:
                worldAccount.username || "",

            nickname:
                worldAccount.nickname || "",

            coins: 0,

            chores: [],

            choreHistory: [],

            hunger: 100,

            lastHungerUpdate:
                Date.now(),

            mooCowAway: false,

            worldManaged: true

        };


        saveChorezProfile(
            profile
        );
    }


    // Keep World-owned information synced
    // without touching Chorez progress.
    profile.username =
        worldAccount.username || "";

    profile.nickname =
        worldAccount.nickname || "";

    profile.worldManaged =
        true;


    // Remove old standalone Chorez
    // authentication information.
    delete profile.passwordHash;
    delete profile.salt;


    saveChorezProfile(
        profile
    );


    renderChores();

    updateHungerFromTime();

    updateHungerDisplay();

    updateRoomCoinDisplays();


   const hasSeenIntro =
    localStorage.getItem(
        "hasSeenMooCowIntro"
    ) === "true";


if (!hasSeenIntro) {

    startMooCowIntro();

} else {

    introOverlay.classList.add(
        "hidden"
    );
}
}


// ==========================================
// MOOCOW INTRO
// ==========================================

function startMooCowIntro() {

    const introOverlay =
        document.getElementById("intro-overlay");

    const introMooCow =
        document.getElementById("intro-moocow");

    const mooCowSpeech =
        document.getElementById("moocow-speech");

    const finishIntro =
        document.getElementById("finish-intro");


    // Show the intro.
    introOverlay.classList.remove("hidden");


    // Reset everything first.
    introMooCow.classList.remove("walk-in");

    mooCowSpeech.classList.remove("show");

    finishIntro.classList.remove("show");


    // Force the browser to register MooCow
    // in his starting/off-screen position.
    void introMooCow.offsetWidth;


    // MooCow walks in.
    setTimeout(function () {

        introMooCow.classList.add("walk-in");

    }, 100);


    // Speech appears after he walks in.
    setTimeout(function () {

        mooCowSpeech.classList.add("show");

    }, 1400);


    // Got it button appears last.
    setTimeout(function () {

        finishIntro.classList.add("show");

    }, 1800);
}


finishIntroButton.addEventListener(
    "click",
    () => {

        localStorage.setItem(
            "hasSeenMooCowIntro",
            "true"
        );

        introOverlay.classList.add(
            "hidden"
        );
    }
);


// ==========================================
// CHORES
// ==========================================

function renderChores() {

    const profile =
        getChorezProfile();

    if (!profile) {
        return;
    }


    if (!Array.isArray(profile.chores)) {

        profile.chores = [];

        saveChorezProfile(profile);
    }


    coinCount.textContent =
        profile.coins || 0;


    choreList.innerHTML = "";


    const currentClock =
    getCurrentChorezDateTime() ||
    getDeviceDateTimeParts();


const todayDateKey =
    getHistoryDateKey(
        currentClock
    );


const todaysChores =
    profile.chores
        .map(
            (chore, index) => {
                return {
                    chore: chore,
                    originalIndex: index
                };
            }
        )
        .filter(
            item => {

                const chore =
                    item.chore;


                /*
                    Old chores saved before
                    date tracking existed
                    will still appear today.
                */

                if (
                    typeof chore ===
                    "string"
                ) {
                    return true;
                }


                if (
                    !chore.addedDateKey
                ) {
                    return true;
                }


                return (
                    chore.addedDateKey ===
                    todayDateKey
                );
            }
        );


if (todaysChores.length === 0) {

    const emptyMessage =
        document.createElement("p");

    emptyMessage.textContent =
        "No chores for today!";

    choreList.appendChild(
        emptyMessage
    );

    return;
}


todaysChores.forEach(
    itemData => {

        const chore =
            itemData.chore;

        const originalIndex =
            itemData.originalIndex;


        const item =
            document.createElement(
                "div"
            );

        item.className =
            "chore-item";


        const name =
            document.createElement(
                "span"
            );

        name.className =
            "chore-name";

        name.textContent =
            typeof chore === "string"
                ? chore
                : chore.name;


        const doneButton =
            document.createElement(
                "button"
            );

        doneButton.className =
            "complete-chore";

        doneButton.textContent =
            "Done";


        doneButton.addEventListener(
            "click",
            () => {

                completeChore(
                    originalIndex
                );
            }
        );


        item.appendChild(
            name
        );

        item.appendChild(
            doneButton
        );

        choreList.appendChild(
            item
        );
    }
);
}

historyAddChoreButton.addEventListener(
    "click",
    () => {

        if (
            selectedHistoryYear === null ||
            selectedHistoryMonth === null ||
            selectedHistoryDay === null
        ) {
            return;
        }

        choreNameInput.value = "";

        chorePopup.dataset.mode =
            "history";
        
        chorePopupTitle.textContent =
    "Add a Chore";

saveChoreButton.textContent =
    "Add Chore";

        chorePopup.classList.remove(
            "hidden"
        );

        choreNameInput.focus();
    }
);

addChoreButton.addEventListener(
    "click",
    () => {

        chorePopup.dataset.mode =
    "normal";

    chorePopupTitle.textContent =
    "Add a Chore";

saveChoreButton.textContent =
    "Add Chore";

        choreNameInput.value = "";

        chorePopup.classList.remove(
            "hidden"
        );

        choreNameInput.focus();
    }
);


cancelChoreButton.addEventListener(
    "click",
    () => {

        chorePopup.classList.add(
            "hidden"
        );

        chorePopup.dataset.mode =
    "normal";


choreNameInput.value =
    "";


chorePopupTitle.textContent =
    "Add a Chore";


saveChoreButton.textContent =
    "Add Chore";


selectedHistoryChoreType =
    null;

selectedHistoryChore =
    null;
    }
);


saveChoreButton.addEventListener(
    "click",
    () => {

        const name =
            choreNameInput.value.trim();


        if (!name) {
            return;
        }


        const profile =
            getChorezProfile();


        if (!profile) {
            return;
        }

      /*
    EDIT AN EXISTING HISTORY CHORE
*/

if (
    chorePopup.dataset.mode ===
    "historyEdit"
) {

    if (!selectedHistoryChore) {
        return;
    }


   if (
    selectedHistoryChoreType ===
    "done"
) {

    const choreIndex =
        profile.choreHistory.findIndex(
            chore => {

                return (
                    chore.dateKey ===
                        selectedHistoryChore.dateKey &&
                    chore.name ===
                        selectedHistoryChore.name &&
                    chore.hour ===
                        selectedHistoryChore.hour &&
                    chore.minute ===
                        selectedHistoryChore.minute
                );
            }
        );


    if (choreIndex === -1) {
        return;
    }


    profile.choreHistory[
        choreIndex
    ].name = name;

} else {

    const choreIndex =
        profile.chores.findIndex(
            chore => {

                return (
                    typeof chore !== "string" &&
                    chore.addedDateKey ===
                        selectedHistoryChore.addedDateKey &&
                    chore.name ===
                        selectedHistoryChore.name
                );
            }
        );


    if (choreIndex === -1) {
        return;
    }


    profile.chores[
        choreIndex
    ].name = name;
}


    saveChorezProfile(
        profile
    );


    chorePopup.classList.add(
        "hidden"
    );


    choreNameInput.value = "";


    chorePopup.dataset.mode =
        "normal";


    openHistoryDay(
        selectedHistoryYear,
        selectedHistoryMonth,
        selectedHistoryDay
    );


    renderChores();


    selectedHistoryChoreType =
        null;

    selectedHistoryChore =
        null;


    return;
}


        if (!Array.isArray(profile.chores)) {

            profile.chores = [];
        }


        /*
           Remember what day this chore
           was added.

           This lets Chore History know
           that the chore existed on
           this date even if it wasn't
           completed.
        */

        const currentClock =
            getCurrentChorezDateTime();


        let choreDate =
    getCurrentChorezDateTime();


if (
    chorePopup.dataset.mode ===
    "history"
) {

    choreDate = {
        year:
            selectedHistoryYear,

        month:
            selectedHistoryMonth,

        day:
            selectedHistoryDay
    };
}


const newChore = {
    name: name
};


if (choreDate) {

    newChore.addedYear =
        choreDate.year;

    newChore.addedMonth =
        choreDate.month;

    newChore.addedDay =
        choreDate.day;

    newChore.addedDateKey =
        getHistoryDateKey(
            choreDate
        );
}


        profile.chores.push(
            newChore
        );


        saveChorezProfile(
            profile
        );


        chorePopup.classList.add(
            "hidden"
        );


        choreNameInput.value = "";


        renderChores();
        if (
    chorePopup.dataset.mode ===
    "history"
) {

    openHistoryDay(
        selectedHistoryYear,
        selectedHistoryMonth,
        selectedHistoryDay
    );
}


chorePopup.dataset.mode =
    "normal";
    }
);


function completeChore(index) {

    const profile =
        getChorezProfile();


    if (!profile) {
        return;
    }


    if (!Array.isArray(profile.chores)) {
        return;
    }


    if (
        index < 0 ||
        index >= profile.chores.length
    ) {
        return;
    }


    const completedChore =
        profile.chores[index];


    const choreName =
        typeof completedChore === "string"
            ? completedChore
            : completedChore.name;


    /*
       Get Chorez's own current
       calendar date and time.
    */

    const currentClock =
        getCurrentChorezDateTime();


    if (!Array.isArray(profile.choreHistory)) {

        profile.choreHistory = [];
    }


    /*
       Only record history if the
       Chorez Clock has been configured.
    */

    if (currentClock) {

        profile.choreHistory.push({

            name:
                choreName,

            year:
                currentClock.year,

            month:
                currentClock.month,

            day:
                currentClock.day,

            hour:
                currentClock.hour,

            minute:
                currentClock.minute,

            dateKey:
                getHistoryDateKey(
                    currentClock
                )
        });
    }


    profile.chores.splice(
        index,
        1
    );


    profile.coins =
    (profile.coins || 0) + 1;


/*
   If Voidy currently has MooCow,
   completing ONE chore brings
   MooCow home.
*/

if (profile.mooCowAway) {

    profile.mooCowAway = false;

    profile.mooCowJustReturned = true;

    profile.hunger = 25;

    profile.lastHungerUpdate =
        Date.now();
}


saveChorezProfile(profile);


renderChores();

updateRoomCoinDisplays();

updateHungerDisplay();
}

// ==========================================
// CHORE HISTORY CALENDAR
// ==========================================

let historyCalendarYear = null;
let historyCalendarMonth = null;

let selectedHistoryYear = null;
let selectedHistoryMonth = null;
let selectedHistoryDay = null;


function renderChoreHistory() {

    const profile =
        getChorezProfile();


    /*
       Start the calendar on the current
       Chorez month.
    */

    const currentClock =
        getCurrentChorezDateTime() ||
        getDeviceDateTimeParts();


    historyCalendarYear =
        currentClock.year;


    historyCalendarMonth =
        currentClock.month;


    historyCalendarView.classList.remove(
        "hidden"
    );


    historyDayView.classList.add(
        "hidden"
    );


    renderHistoryCalendar();
}



function renderHistoryCalendar() {

    const profile =
        getChorezProfile();


    historyCalendarGrid.innerHTML = "";


    historyCalendarMonthHeading.textContent =
        MONTH_NAMES[
            historyCalendarMonth - 1
        ] +
        " " +
        historyCalendarYear;


    /*
       Find which weekday the first
       day of this month falls on.

       Numeric constructor = no
       YYYY-MM-DD timezone nonsense.
    */

    const firstDay =
        new Date(
            historyCalendarYear,
            historyCalendarMonth - 1,
            1
        ).getDay();


    /*
       Day 0 of the NEXT month gives us
       the final day of this month.
    */

    const daysInMonth =
        new Date(
            historyCalendarYear,
            historyCalendarMonth,
            0
        ).getDate();


    /*
       Get all history entries safely.
    */

    const history =
        profile &&
        Array.isArray(profile.choreHistory)
            ? profile.choreHistory
            : [];


    /*
       Empty spaces before the 1st.
    */

    for (
        let blank = 0;
        blank < firstDay;
        blank++
    ) {

        const emptySpace =
            document.createElement(
                "div"
            );


        emptySpace.className =
            "history-calendar-blank";


        historyCalendarGrid.appendChild(
            emptySpace
        );
    }


    /*
       Actual calendar days.
    */

    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        const dayButton =
            document.createElement(
                "button"
            );


        dayButton.type =
            "button";


        dayButton.className =
            "history-calendar-day";


        dayButton.textContent =
            day;


        const dateKey =
            historyCalendarYear +
            "-" +
            padClockNumber(
                historyCalendarMonth
            ) +
            "-" +
            padClockNumber(
                day
            );

            const currentClock =
    getCurrentChorezDateTime() ||
    getDeviceDateTimeParts();


const todayDateKey =
    getHistoryDateKey(
        currentClock
    );


if (dateKey === todayDateKey) {

    dayButton.classList.add(
        "history-today"
    );
}


        const hasHistory =
            history.some(
                entry =>
                    entry.dateKey ===
                    dateKey
            );


        if (hasHistory) {

            dayButton.classList.add(
                "has-history"
            );
        }

        const hasUnfinishedChores =
    profile.chores.some(
        chore => {

            return (
                typeof chore !== "string" &&
                chore.addedDateKey ===
                    dateKey
            );
        }
    );


if (hasUnfinishedChores) {

    dayButton.classList.add(
        "has-unfinished"
    );
}


        dayButton.addEventListener(
            "click",
            () => {

                openHistoryDay(
                    historyCalendarYear,
                    historyCalendarMonth,
                    day
                );
            }
        );


        historyCalendarGrid.appendChild(
            dayButton
        );
    }
}

function openHistoryChoreMenu(
    type,
    chore
) {

    selectedHistoryChoreType =
        type;

    selectedHistoryChore =
        chore;


    historyChoreMenuName.textContent =
        chore.name || "Chore";
    
    if (type === "notDone") {

    historyCompleteChoreButton.classList.remove(
        "hidden"
    );

} else {

    historyCompleteChoreButton.classList.add(
        "hidden"
    );
}


    historyChoreMenu.classList.remove(
        "hidden"
    );
}

function openHistoryDay(
    year,
    month,
    day
) {

        selectedHistoryYear = year;
    selectedHistoryMonth = month;
    selectedHistoryDay = day;

    const profile =
        getChorezProfile();


    historyList.innerHTML = "";


    const dateKey =
        year +
        "-" +
        padClockNumber(month) +
        "-" +
        padClockNumber(day);


    const history =
        profile &&
        Array.isArray(profile.choreHistory)
            ? profile.choreHistory
            : [];


    const currentChores =
        profile &&
        Array.isArray(profile.chores)
            ? profile.chores
            : [];


    /*
       DONE:
       Chores that were completed
       on this selected date.
    */

    const doneEntries =
        history
            .filter(
                entry =>
                    entry.dateKey ===
                    dateKey
            )
            .reverse();


    /*
       NOT DONE:
       Chores that were added on this
       date and are still unfinished.
    */

    const notDoneEntries =
        currentChores.filter(
            chore =>
                typeof chore !== "string" &&
                chore.addedDateKey ===
                    dateKey
        );


    /*
       Build the selected date safely
       using numeric date parts.
    */

    const selectedDate =
        new Date(
            year,
            month - 1,
            day
        );


    const dayName =
        DAY_NAMES[
            selectedDate.getDay()
        ];


    historySelectedDate.textContent =
        dayName +
        ", " +
        MONTH_NAMES[
            month - 1
        ] +
        " " +
        day +
        ", " +
        year;


    /*
       Switch from calendar
       to selected day.
    */

    historyCalendarView.classList.add(
        "hidden"
    );


    historyDayView.classList.remove(
        "hidden"
    );


    // ======================================
    // NOT DONE SECTION
    // ======================================

    const notDoneSection =
        document.createElement(
            "div"
        );


    notDoneSection.className =
        "history-status-section";


    const notDoneHeading =
        document.createElement(
            "h3"
        );


    notDoneHeading.className =
        "history-status-heading not-done";


    notDoneHeading.textContent =
        "Not Done";


    notDoneSection.appendChild(
        notDoneHeading
    );


    if (
        notDoneEntries.length === 0
    ) {

        const empty =
            document.createElement(
                "div"
            );


        empty.className =
            "history-status-empty";


        empty.textContent =
            "Nothing here! 🎉";


        notDoneSection.appendChild(
            empty
        );

    } else {

        notDoneEntries.forEach(
    chore => {

        const item =
            document.createElement(
                "button"
            );


        item.type =
            "button";


        item.className =
            "history-entry history-not-done-entry history-clickable-entry";


        const name =
            document.createElement(
                "span"
            );


        name.className =
            "history-chore-name";


        name.textContent =
            "☐ " +
            chore.name;


        item.appendChild(
            name
        );


        item.addEventListener(
            "click",
            () => {

                openHistoryChoreMenu(
                    "notDone",
                    chore
                );
            }
        );


        notDoneSection.appendChild(
            item
        );
    }
);
    }


    historyList.appendChild(
        notDoneSection
    );


    // ======================================
    // DONE SECTION
    // ======================================

    const doneSection =
        document.createElement(
            "div"
        );


    doneSection.className =
        "history-status-section";


    const doneHeading =
        document.createElement(
            "h3"
        );


    doneHeading.className =
        "history-status-heading done";


    doneHeading.textContent =
        "Done";


    doneSection.appendChild(
        doneHeading
    );


    if (
        doneEntries.length === 0
    ) {

        const empty =
            document.createElement(
                "div"
            );


        empty.className =
            "history-status-empty";


        empty.textContent =
            "No chores completed.";


        doneSection.appendChild(
            empty
        );

    } else {

       doneEntries.forEach(
    entry => {

        const item =
            document.createElement(
                "button"
            );


        item.type =
            "button";


        item.className =
            "history-entry history-done-entry history-clickable-entry";


        const name =
            document.createElement(
                "span"
            );


        name.className =
            "history-chore-name";


        name.textContent =
            "✓ " +
            entry.name;


        const time =
            document.createElement(
                "span"
            );


        time.className =
            "history-chore-time";


        time.textContent =
            formatHistoryTime(
                entry
            );


        item.appendChild(
            name
        );

        item.appendChild(
            time
        );


        item.addEventListener(
            "click",
            () => {

                openHistoryChoreMenu(
                    "done",
                    entry
                );
            }
        );


        doneSection.appendChild(
            item
        );
    }
);
    }


    historyList.appendChild(
        doneSection
    );
}

// ==========================================
// COIN DISPLAYS
// ==========================================

function updateRoomCoinDisplays() {

    const profile =
        getChorezProfile();

    if (!profile) {
        return;
    }


    const coins =
        profile.coins || 0;


    coinCount.textContent =
        coins;

    roomCoinCount.textContent =
        coins;

    foodCarouselCoinCount.textContent =
        coins;
}


// ==========================================
// HUNGER
// ==========================================

function updateHungerFromTime() {

    const profile =
        getChorezProfile();

    if (!profile) {
        return;
    }


    if (
        typeof profile.hunger !==
        "number"
    ) {

        profile.hunger = 100;
    }


    if (
        typeof profile.lastHungerUpdate !==
        "number"
    ) {

        profile.lastHungerUpdate =
            Date.now();

        saveChorezProfile(profile);

        return;
    }


    const now =
        Date.now();


    const elapsed =
        now -
        profile.lastHungerUpdate;


    const intervals =
        Math.floor(
            elapsed /
            HUNGER_INTERVAL
        );


    if (intervals <= 0) {
        return;
    }


    profile.hunger =
        Math.max(
            0,
            profile.hunger -
            (
                intervals *
                HUNGER_LOSS
            )
        );


    profile.lastHungerUpdate +=
        intervals *
        HUNGER_INTERVAL;


    saveChorezProfile(profile);
}


function updateHungerDisplay() {

    const profile =
        getChorezProfile();

    if (!profile) {
        return;
    }


    const hunger =
        Math.max(
            0,
            Math.min(
                100,
                Number(profile.hunger) ||
                0
            )
        );


    hungerFill.style.width =
        hunger + "%";

    hungerNumber.textContent =
        hunger + "%";
    
    const mooCow =
    document.getElementById(
        "room-moocow"
    );

if (mooCow) {

    if (hunger <= 50) {

        mooCow.classList.add(
            "hungry-bed-rest"
        );

    } else {

        mooCow.classList.remove(
            "hungry-bed-rest"
        );
    }
}


    if (hunger >= 75) {

        hungerMessage.textContent =
            "Full!";

    } else if (hunger >= 50) {

        hungerMessage.textContent =
            "Hungry";

    } else if (hunger >= 25) {

        hungerMessage.textContent =
            "Very Hungry";

    } else if (hunger > 0) {

        hungerMessage.textContent =
            "Feed Me!";

    } else {

        hungerMessage.textContent =
            "...";
    }
}


// ==========================================
// MOOCOW ROOM RESET
// ==========================================

function resetMooCowDepartureScene() {

    roomMooCow.classList.remove(
        "walking-out",
        "returning",
        "no-transition",
        "normal-room-running-in",
        "being-petted"
    );


    mooCowSuitcase.classList.add(
        "hidden"
    );


    mooCowSuitcase.classList.remove(
        "offscreen-left",
        "leaving-with-moocow"
    );


    roomMooCowSpeech.classList.add(
        "hidden"
    );
}


// ==========================================
// NORMAL ROOM ENTRANCE
// ==========================================

function startNormalMooCowEntrance() {

    roomMooCow.classList.remove(
        "walking-out",
        "returning",
        "no-transition",
        "normal-room-running-in"
    );


    roomMooCowSpeech.classList.add(
        "hidden"
    );


    mooCowSuitcase.classList.add(
        "hidden"
    );


    roomMooCow.classList.add(
        "no-transition"
    );


    roomMooCow.classList.add(
        "normal-room-running-in"
    );


    void roomMooCow.offsetWidth;


    setTimeout(() => {

        roomMooCow.classList.remove(
            "no-transition"
        );

        roomMooCow.classList.remove(
            "normal-room-running-in"
        );

    }, 300);


    setTimeout(() => {

    const profile =
        getChorezProfile();


    if (
        profile &&
        profile.mooCowJustReturned
    ) {

        roomMooCowSpeech.textContent =
            "Sniff sniff...";

        roomMooCowSpeech.classList.remove(
            "hidden"
        );


        setTimeout(() => {

            roomMooCowSpeech.textContent =
                "Uh... I smell something good.";

        }, 1800);


        setTimeout(() => {

            roomMooCowSpeech.textContent =
                "I think I'll stay a while.";

        }, 4000);


        setTimeout(() => {

            roomMooCowSpeech.classList.add(
                "hidden"
            );


            

        }, 6500);


    } else {

        roomMooCowSpeech.textContent =
            "I WASN'T UP TO ANYTHING!";

        roomMooCowSpeech.classList.remove(
            "hidden"
        );


        setTimeout(() => {

            roomMooCowSpeech.classList.add(
                "hidden"
            );

        }, 2450);
    }

}, 1050);
}


// ==========================================
// 0% HUNGER DEPARTURE
// ==========================================

function startMooCowSuitcaseSequence() {

    resetMooCowDepartureScene();


    // MooCow leaves without suitcase.

    setTimeout(() => {

        roomMooCow.classList.add(
            "walking-out"
        );

    }, 250);


    // MooCow returns with suitcase.

    setTimeout(() => {

        roomMooCow.classList.add(
            "no-transition"
        );

        roomMooCow.classList.remove(
            "walking-out"
        );

        roomMooCow.classList.add(
            "returning"
        );


        mooCowSuitcase.classList.remove(
            "hidden"
        );

        mooCowSuitcase.classList.add(
            "offscreen-left"
        );


        void roomMooCow.offsetWidth;

        void mooCowSuitcase.offsetWidth;


        roomMooCow.classList.remove(
            "no-transition"
        );


        requestAnimationFrame(() => {

            requestAnimationFrame(() => {

                roomMooCow.classList.remove(
                    "returning"
                );

                mooCowSuitcase.classList.remove(
                    "offscreen-left"
                );
            });
        });

    }, 1700);


    // First line.

    setTimeout(() => {

        roomMooCowSpeech.textContent =
            "See this little suitcase?";

        roomMooCowSpeech.classList.remove(
            "hidden"
        );

    }, 3100);


    // Second line.

    setTimeout(() => {

        roomMooCowSpeech.textContent =
            "We out this phone.";

    }, 5500);


    setTimeout(() => {

        roomMooCowSpeech.classList.add(
            "hidden"
        );

    }, 7200);


    // Leave together.

    setTimeout(() => {

        roomMooCow.classList.add(
            "walking-out"
        );

        mooCowSuitcase.classList.add(
            "leaving-with-moocow"
        );

    }, 7600);


    // Voidy takes over.

    setTimeout(() => {

        const profile =
            getChorezProfile();

        if (profile) {

            profile.mooCowAway =
                true;

            saveChorezProfile(
                profile
            );
        }


        mooCowRoomOverlay.classList.add(
            "hidden"
        );


        voidyScreen.classList.remove(
            "hidden"
        );

    }, 9100);
}


// ==========================================
// VISIT MOOCOW
// ==========================================

visitMooCowButton.addEventListener(
    "click",
    () => {

        const profile =
            getChorezProfile();

        if (!profile) {
            return;
        }


        updateHungerFromTime();


        const updatedProfile =
            getChorezProfile();

        if (!updatedProfile) {
            return;
        }


        updateRoomCoinDisplays();

        updateHungerDisplay();


        // MooCow already left.

        if (updatedProfile.mooCowAway) {

            voidyScreen.classList.remove(
                "hidden"
            );

            return;
        }


        // 0% hunger.

        if (
            updatedProfile.hunger <= 0
        ) {

            mooCowMessageTitle.textContent =
                "MooCow";

            mooCowMessageText.textContent =
                "I haven't been fed.";

            mooCowMessageOverlay.dataset.action =
                "startMooCowDeparture";

            mooCowMessageOverlay.classList.remove(
                "hidden"
            );

            return;
        }


        // 1–24% hunger.

        if (
            updatedProfile.hunger < 25
        ) {

            mooCowMessageTitle.textContent =
                "MooCow is hungry!";

            mooCowMessageText.textContent =
                "MooCow really needs something to eat.";

            mooCowMessageOverlay.dataset.action =
                "openHungryRoom";

            mooCowMessageOverlay.classList.remove(
                "hidden"
            );

            return;
        }


        // Normal room.

        resetMooCowDepartureScene();


        mooCowRoomOverlay.classList.remove(
            "hidden"
        );


        startNormalMooCowEntrance();
    }
);

historyCompleteChoreButton.addEventListener(
    "click",
    () => {

        if (
            !selectedHistoryChore ||
            selectedHistoryChoreType !== "notDone"
        ) {
            return;
        }

        const profile =
            getChorezProfile();

        if (
            !profile ||
            !Array.isArray(profile.chores)
        ) {
            return;
        }

        const choreIndex =
            profile.chores.findIndex(
                chore => {

                    return (
                        typeof chore !== "string" &&
                        chore.addedDateKey ===
                            selectedHistoryChore.addedDateKey &&
                        chore.name ===
                            selectedHistoryChore.name
                    );
                }
            );

        if (choreIndex === -1) {
            return;
        }

        const completedChore =
            profile.chores[choreIndex];

        const currentClock =
            getCurrentChorezDateTime() ||
            getDeviceDateTimeParts();

        if (
            !Array.isArray(
                profile.choreHistory
            )
        ) {
            profile.choreHistory = [];
        }

        profile.choreHistory.push({
            name:
                completedChore.name,

            year:
                currentClock.year,

            month:
                currentClock.month,

            day:
                currentClock.day,

            hour:
                currentClock.hour,

            minute:
                currentClock.minute,

            dateKey:
                getHistoryDateKey(
                    currentClock
                )
        });

        profile.chores.splice(
            choreIndex,
            1
        );

        profile.coins =
            (profile.coins || 0) + 1;

        saveChorezProfile(
            profile
        );

        historyChoreMenu.classList.add(
            "hidden"
        );

        selectedHistoryChoreType =
            null;

        selectedHistoryChore =
            null;

        renderChores();

        openHistoryDay(
            selectedHistoryYear,
            selectedHistoryMonth,
            selectedHistoryDay
        );
    }
);

historyEditChoreButton.addEventListener(
    "click",
    () => {

        if (!selectedHistoryChore) {
            return;
        }


        /*
            Put the current chore name
            into the existing chore popup.
        */

        choreNameInput.value =
            selectedHistoryChore.name;


        /*
            Tell the popup that we're
            EDITING instead of adding.
        */

        chorePopup.dataset.mode =
            "historyEdit";
        
        chorePopupTitle.textContent =
    "Edit Chore";

saveChoreButton.textContent =
    "Save Changes";


        /*
            Close the action menu.
        */

        historyChoreMenu.classList.add(
            "hidden"
        );


        /*
            Open the chore-name popup.
        */

        chorePopup.classList.remove(
            "hidden"
        );


        choreNameInput.focus();
        choreNameInput.select();
    }
);

historyDeleteChoreButton.addEventListener(
    "click",
    () => {

        if (!selectedHistoryChore) {
            return;
        }


        historyDeleteConfirmMessage.textContent =
            'Are you sure you want to delete "' +
            selectedHistoryChore.name +
            '"?';


        historyChoreMenu.classList.add(
            "hidden"
        );


        historyDeleteConfirm.classList.remove(
            "hidden"
        );
    }
);

historyCancelDeleteButton.addEventListener(
    "click",
    () => {

        historyDeleteConfirm.classList.add(
            "hidden"
        );


        historyChoreMenu.classList.remove(
            "hidden"
        );
    }
);


historyConfirmDeleteButton.addEventListener(
    "click",
    () => {

        if (!selectedHistoryChore) {
            return;
        }


        const profile =
            getChorezProfile();


        if (
            !profile ||
            !Array.isArray(
                profile.chores
            )
        ) {
            return;
        }


        if (
    selectedHistoryChoreType ===
    "done"
) {

    const choreIndex =
        profile.choreHistory.findIndex(
            chore => {

                return (
                    chore.dateKey ===
                        selectedHistoryChore.dateKey &&
                    chore.name ===
                        selectedHistoryChore.name &&
                    chore.hour ===
                        selectedHistoryChore.hour &&
                    chore.minute ===
                        selectedHistoryChore.minute
                );
            }
        );


    if (choreIndex === -1) {
        return;
    }


    profile.choreHistory.splice(
        choreIndex,
        1
    );

} else {

    const choreIndex =
        profile.chores.findIndex(
            chore => {

                return (
                    typeof chore !== "string" &&
                    chore.addedDateKey ===
                        selectedHistoryChore.addedDateKey &&
                    chore.name ===
                        selectedHistoryChore.name
                );
            }
        );


    if (choreIndex === -1) {
        return;
    }


    profile.chores.splice(
        choreIndex,
        1
    );
}


        saveChorezProfile(
            profile
        );


        historyDeleteConfirm.classList.add(
            "hidden"
        );


        openHistoryDay(
            selectedHistoryYear,
            selectedHistoryMonth,
            selectedHistoryDay
        );


        renderChores();


        selectedHistoryChoreType =
            null;

        selectedHistoryChore =
            null;
    }
);

// ==========================================
// CHORE HISTORY ACTION MENU CONTROLS
// ==========================================

historyCancelChoreMenuButton.addEventListener(
    "click",
    () => {

        historyChoreMenu.classList.add(
            "hidden"
        );

        selectedHistoryChoreType =
            null;

        selectedHistoryChore =
            null;
    }
);

// ==========================================
// CHORE HISTORY CONTROLS
// ==========================================

historyButton.addEventListener(
    "click",
    () => {

        renderChoreHistory();


        historyOverlay.classList.remove(
            "hidden"
        );
    }
);



closeHistoryButton.addEventListener(
    "click",
    () => {

        historyOverlay.classList.add(
            "hidden"
        );
    }
);



closeHistoryDayButton.addEventListener(
    "click",
    () => {

        historyOverlay.classList.add(
            "hidden"
        );
    }
);



historyBackToCalendarButton.addEventListener(
    "click",
    () => {

        historyDayView.classList.add(
            "hidden"
        );


        historyCalendarView.classList.remove(
            "hidden"
        );


        renderHistoryCalendar();
    }
);



historyPreviousMonthButton.addEventListener(
    "click",
    () => {

        historyCalendarMonth--;


        if (
            historyCalendarMonth < 1
        ) {

            historyCalendarMonth = 12;

            historyCalendarYear--;
        }


        renderHistoryCalendar();
    }
);



historyNextMonthButton.addEventListener(
    "click",
    () => {

        historyCalendarMonth++;


        if (
            historyCalendarMonth > 12
        ) {

            historyCalendarMonth = 1;

            historyCalendarYear++;
        }


        renderHistoryCalendar();
    }
);


// ==========================================
// CLOSE MOOCOW MESSAGE
// ==========================================

closeMooCowMessageButton.addEventListener(
    "click",
    () => {

        const action =
            mooCowMessageOverlay.dataset.action;


        mooCowMessageOverlay.classList.add(
            "hidden"
        );


        mooCowMessageOverlay.dataset.action =
            "";


        if (
            action ===
            "openHungryRoom"
        ) {

            resetMooCowDepartureScene();

            mooCowRoomOverlay.classList.remove(
                "hidden"
            );


            roomMooCowSpeech.textContent =
                "I'm starving dude, good thing I'm stuffed.";


            roomMooCowSpeech.classList.remove(
                "hidden"
            );


            setTimeout(() => {

                roomMooCowSpeech.classList.add(
                    "hidden"
                );

            }, 3500);


            return;
        }


        if (
            action ===
            "startMooCowDeparture"
        ) {

            mooCowRoomOverlay.classList.remove(
                "hidden"
            );


            startMooCowSuitcaseSequence();
        }
    }
);


// ==========================================
// CLOSE MOOCOW ROOM
// ==========================================

closeMooCowRoomButton.addEventListener(
    "click",
    () => {

        mooCowRoomOverlay.classList.add(
            "hidden"
        );

        foodCarouselOverlay.classList.add(
            "hidden"
        );

        resetMooCowDepartureScene();
    }
);


// ==========================================
// PET MOOCOW
// ==========================================

roomMooCow.addEventListener(
    "click",
    () => {

        const profile =
            getChorezProfile();


        if (
            !profile ||
            profile.mooCowAway
        ) {

            return;
        }


        if (
            roomMooCow.classList.contains(
                "walking-out"
            ) ||
            roomMooCow.classList.contains(
                "returning"
            )
        ) {

            return;
        }


        roomMooCowSpeech.textContent =
            "Oh, thanks dude. 💗";


        roomMooCowSpeech.classList.remove(
            "hidden"
        );


        roomMooCow.classList.add(
            "being-petted"
        );


        setTimeout(() => {

            roomMooCow.classList.remove(
                "being-petted"
            );

        }, 400);


        setTimeout(() => {

            roomMooCowSpeech.classList.add(
                "hidden"
            );

        }, 2500);
    }
);


// ==========================================
// VOIDY
// ==========================================

closeVoidyScreenButton.addEventListener(
    "click",
    () => {

        voidyScreen.classList.add(
            "hidden"
        );

        renderChores();
    }
);


// ==========================================
// FOOD CAROUSEL
// ==========================================

function renderFoodCarousel() {

    const food =
        foods[currentFoodIndex];


    carouselFoodImage.src =
        food.image;

    carouselFoodImage.alt =
        food.name;

    carouselFoodName.textContent =
        food.name;


    updateRoomCoinDisplays();
}


mooCowFridge.addEventListener(
    "click",
    () => {

        const profile =
            getChorezProfile();

        if (!profile) {
            return;
        }


        currentFoodIndex = 0;


        renderFoodCarousel();


        foodCarouselOverlay.classList.remove(
            "hidden"
        );
    }
);


closeFoodCarouselButton.addEventListener(
    "click",
    () => {

        foodCarouselOverlay.classList.add(
            "hidden"
        );
    }
);


previousFoodButton.addEventListener(
    "click",
    () => {

        currentFoodIndex--;

        if (currentFoodIndex < 0) {

            currentFoodIndex =
                foods.length - 1;
        }


        renderFoodCarousel();
    }
);


nextFoodButton.addEventListener(
    "click",
    () => {

        currentFoodIndex++;

        if (
            currentFoodIndex >=
            foods.length
        ) {

            currentFoodIndex = 0;
        }


        renderFoodCarousel();
    }
);


getFoodButton.addEventListener(
    "click",
    () => {

        const profile =
            getChorezProfile();

        if (!profile) {
            return;
        }


        if (
            (profile.coins || 0) < 1
        ) {

            mooCowMessageTitle.textContent =
                "Uh oh! 🐄";

            mooCowMessageText.textContent =
                "You need to finish a chore first!";

            mooCowMessageOverlay.dataset.action =
                "";

            mooCowMessageOverlay.classList.remove(
                "hidden"
            );

            return;
        }


        profile.coins -= 1;


        saveChorezProfile(profile);


        const food =
            foods[currentFoodIndex];


        roomFood.src =
            food.image;

        roomFood.alt =
            food.name;


        roomFood.classList.remove(
            "moocow-eating"
        );


        roomFood.classList.remove(
            "hidden"
        );


        foodCarouselOverlay.classList.add(
            "hidden"
        );


        updateRoomCoinDisplays();
    }
);


// ==========================================
// FEED MOOCOW
// ==========================================

roomFood.addEventListener(
    "click",
    () => {

        const profile =
            getChorezProfile();

        if (!profile) {
            return;
        }


        const justReturned =
            profile.mooCowJustReturned ===
            true;
        
        const wasAlreadyFull =
    profile.hunger >= 100;


        roomFood.classList.add(
            "moocow-eating"
        );


        setTimeout(() => {

            roomFood.classList.add(
                "hidden"
            );

            roomFood.classList.remove(
                "moocow-eating"
            );


            profile.hunger =
                Math.min(
                    100,
                    (profile.hunger || 0) +
                    25
                );


            profile.lastHungerUpdate =
                Date.now();


            /*
               First meal after returning
               from Voidy.
            */

            if (justReturned) {

                profile.mooCowJustReturned =
                    false;
            }


            saveChorezProfile(profile);

            updateHungerDisplay();

            if (justReturned) {

    roomMooCowSpeech.textContent =
        "I'm not myself when I'm hungry.";

    roomMooCowSpeech.classList.remove(
        "hidden"
    );


    setTimeout(() => {

        roomMooCowSpeech.textContent =
            "My deepest apologies.";

    }, 2500);


    setTimeout(() => {

        roomMooCowSpeech.classList.add(
            "hidden"
        );

    }, 5000);


} else {

    roomMooCowSpeech.classList.remove(
        "hidden"
    );


    if (wasAlreadyFull) {

    roomMooCowSpeech.textContent =
        "Yuck... I'm full, no more please.";

} else {

    roomMooCowSpeech.textContent =
        "Yummy!";
}


    setTimeout(() => {

        roomMooCowSpeech.classList.add(
            "hidden"
        );

    }, 2500);
}

        }, 550);
    }
);


// ==========================================
// TEDDY
// ==========================================

mooCowTeddy.addEventListener(
    "click",
    () => {

        // Teddy currently has no additional
        // gameplay behavior.
    }
);

// ==========================================
// HELP
// ==========================================

helpButton.addEventListener(
    "click",
    () => {

        helpOverlay.classList.remove(
            "hidden"
        );
    }
);


closeHelpButton.addEventListener(
    "click",
    () => {

        helpOverlay.classList.add(
            "hidden"
        );
    }
);

watchTutorialButton.addEventListener(
    "click",
    () => {

        window.open(
            "https://youtu.be/3q0vpIthi_Q?si=JNqvU1fmYu51jUPd",
            "_blank"
        );
    }
);


// ==========================================
// PROFILE BUTTONS WE HAVEN'T BUILT YET
// ==========================================

// These intentionally do nothing yet.
// We'll build them one at a time.

// ==========================================
// OPEN DATE & TIME FROM PROFILE
// ==========================================

dateTimeButton.addEventListener(
    "click",
    () => {

        profileMenuOverlay.classList.add(
            "hidden"
        );


        dateTimeError.textContent = "";

        dateTimeError.classList.add(
            "hidden"
        );


        const currentClock =
            getCurrentChorezDateTime();


        const parts =
            currentClock ||
            getDeviceDateTimeParts();


        chorezDateInput.value =
            clockPartsToDateInput(
                parts
            );


        chorezTimeInput.value =
            clockPartsToTimeInput(
                parts
            );


        dateTimeTitle.textContent =
            "Date & Time";


        dateTimeOverlay.dataset.mode =
            "settings";


        cancelDateTimeButton.classList.remove(
            "hidden"
        );


        saveDateTimeButton.textContent =
            "Save";


        dateTimeOverlay.classList.remove(
            "hidden"
        );
    }
);

// ==========================================
// SAVE DATE & TIME
// ==========================================

saveDateTimeButton.addEventListener(
    "click",
    () => {

        const profile =
            getChorezProfile();

        if (!profile) {
            return;
        }


        const dateValue =
            chorezDateInput.value;

        const timeValue =
            chorezTimeInput.value;


        if (
            !dateValue ||
            !timeValue
        ) {

            dateTimeError.textContent =
                "Please enter both the current date and time.";

            dateTimeError.classList.remove(
                "hidden"
            );

            return;
        }


        /*
           IMPORTANT:

           We are NOT doing:

           new Date(dateValue)

           We split the literal calendar
           values ourselves.
        */

        const dateParts =
            dateValue.split("-");

        const timeParts =
            timeValue.split(":");


        const year =
            Number(dateParts[0]);

        const month =
            Number(dateParts[1]);

        const day =
            Number(dateParts[2]);

        const hour =
            Number(timeParts[0]);

        const minute =
            Number(timeParts[1]);


        if (
            !Number.isInteger(year) ||
            !Number.isInteger(month) ||
            !Number.isInteger(day) ||
            !Number.isInteger(hour) ||
            !Number.isInteger(minute)
        ) {

            dateTimeError.textContent =
                "That date or time is not valid.";

            dateTimeError.classList.remove(
                "hidden"
            );

            return;
        }


        profile.chorezClock = {

            year: year,

            month: month,

            day: day,

            hour: hour,

            minute: minute,

            realStartedAt:
                Date.now()
        };


        saveChorezProfile(profile);


        const mode =
            dateTimeOverlay.dataset.mode;


        dateTimeOverlay.classList.add(
            "hidden"
        );


        // FIRST-TIME SETUP

        if (
            mode ===
            "firstSetup"
        ) {

            startMooCowIntro();

            return;
        }


        // PROFILE SETTINGS

        showSuccessPopup(
            "Date & Time Saved!",
            "Chorez will use this clock for your chore history."
        );
    }
);


cancelDateTimeButton.addEventListener(
    "click",
    () => {

        dateTimeOverlay.classList.add(
            "hidden"
        );


        profileMenuOverlay.classList.remove(
            "hidden"
        );
    }
);

// ==========================================
// BACKUP CHOREZ
// ==========================================

backupButton.addEventListener(
    "click",
    () => {

        const profile =
            getChorezProfile();

        if (!profile) {

            showSuccessPopup(
                "Backup Failed",
                "No Chorez profile was found to back up."
            );

            return;
        }


        const backupData = {

            app:
                "ESSAzLife Chorez",

            backupVersion:
                1,

            createdAt:
                new Date().toISOString(),

            profile:
                profile,

            hasSeenMooCowIntro:
                localStorage.getItem(
                    "hasSeenMooCowIntro"
                ) === "true"
        };


        const backupText =
            JSON.stringify(
                backupData,
                null,
                2
            );


        const backupBlob =
            new Blob(
                [backupText],
                {
                    type:
                        "application/json"
                }
            );


        const backupUrl =
            URL.createObjectURL(
                backupBlob
            );


        const downloadLink =
            document.createElement(
                "a"
            );


        const safeUsername =
            String(profile.username || "user")
                .replace(
                    /[^a-z0-9_-]/gi,
                    "_"
                );


        downloadLink.href =
            backupUrl;

        downloadLink.download =
            "ESSAzLife-Chorez-" +
            safeUsername +
            "-Backup.json";


        document.body.appendChild(
            downloadLink
        );


        downloadLink.click();


        downloadLink.remove();


        URL.revokeObjectURL(
            backupUrl
        );


        showSuccessPopup(
            "Backup Created! 💾",
            "Your Chorez backup has been downloaded. Keep it somewhere safe!"
        );
    }
);


// ==========================================
// RESTORE CHOREZ BACKUP
// ==========================================

restoreButton.addEventListener(
    "click",
    () => {

        // Open the hidden file picker.
        restoreFileInput.value = "";

        restoreFileInput.click();
    }
);


restoreFileInput.addEventListener(
    "change",
    async () => {

        const file =
            restoreFileInput.files[0];


        if (!file) {
            return;
        }


        try {

            const fileText =
                await file.text();


            const backupData =
                JSON.parse(fileText);


            // Make sure this is actually
            // an ESSAzLife Chorez backup.
            if (
                !backupData ||
                backupData.app !==
                    "ESSAzLife Chorez" ||
                !backupData.profile
            ) {

                throw new Error(
                    "Invalid Chorez backup."
                );
            }


            const restoredProfile =
                backupData.profile;


            // Basic profile validation.
            if (
                typeof restoredProfile.username !==
                    "string" ||
                typeof restoredProfile.passwordHash !==
                    "string" ||
                typeof restoredProfile.salt !==
                    "string"
            ) {

                throw new Error(
                    "Backup profile is incomplete."
                );
            }


            // Restore the profile.
            saveChorezProfile(
                restoredProfile
            );


            // Restore whether the MooCow
            // introduction was already seen.
            if (
                backupData.hasSeenMooCowIntro ===
                true
            ) {

                localStorage.setItem(
                    "hasSeenMooCowIntro",
                    "true"
                );

            } else {

                localStorage.removeItem(
                    "hasSeenMooCowIntro"
                );
            }


            // Keep the user logged in on
            // this device after restoring.
            sessionStorage.setItem(
                "chorezLoggedIn",
                "true"
            );


            // Close Profile menu.
            profileMenuOverlay.classList.add(
                "hidden"
            );


            // Refresh the visible app data.
            renderChores();

            updateHungerFromTime();

            updateHungerDisplay();

            updateRoomCoinDisplays();


            showSuccessPopup(
                "Backup Restored! 📂",
                "Your Chorez profile and progress have been restored successfully."
            );


        } catch (error) {

            console.error(
                "Could not restore Chorez backup:",
                error
            );


            showSuccessPopup(
                "Restore Failed",
                "That file does not appear to be a valid ESSAzLife Chorez backup."
            );
        }


        // Allows selecting the same
        // backup file again later.
        restoreFileInput.value = "";
    }
);


// ==========================================
// HUNGER TIMER
// ==========================================

setInterval(
    () => {

        const roomOpen =
            !mooCowRoomOverlay.classList.contains(
                "hidden"
            );


        if (!roomOpen) {
            return;
        }


        updateHungerFromTime();

        updateHungerDisplay();

    },
    1000
);


// ==========================================
// START APP
// ==========================================

initializeApp();

