
/* ==========================================
   ESSAzLife BOOKZ — DIGITAL LIBRARY
========================================== */

const libraryScreen = document.getElementById("libraryScreen");
const readerScreen = document.getElementById("readerScreen");
const bookLibrary = document.getElementById("bookLibrary");

const readerTitle = document.getElementById("readerTitle");
const readerStatus = document.getElementById("readerStatus");
const bookPage = document.getElementById("bookPage");
const pageIndicator = document.getElementById("pageIndicator");

const previousButton = document.getElementById("previousPage");
const nextButton = document.getElementById("nextPage");
const backButton = document.getElementById("backToLibrary");


/* ==========================================
   BOOKZ — WORLD ACCOUNT STORAGE
========================================== */

function getBookzAccountId() {
  const mode = localStorage.getItem("essazlifeWorldLoginMode");
  const loggedIn =
    localStorage.getItem("essazlifeWorldLoggedIn") === "true";

  if (!loggedIn) return "signed-out";

  if (mode === "guest") {
    return "guest";
  }

  if (mode === "cloud") {
    let account = null;

    try {
      account = JSON.parse(
        sessionStorage.getItem("essazlifeWorldCloudAccount") ||
        localStorage.getItem("essazlifeWorldCloudAccount") ||
        "null"
      );
    } catch (error) {
      console.warn("Could not read cloud account:", error);
    }

    if (!account || !account.username) {
      return "signed-out";
    }

    return "cloud:" + String(
      account.id || account.userId || account.username
    ).toLowerCase();
  }

  if (mode === "local") {
    let account = null;

    try {
      account = JSON.parse(
        localStorage.getItem("essazlifeWorldAccount") || "null"
      );
    } catch (error) {
      console.warn("Could not read local account:", error);
    }

    if (!account || !account.username) {
      return "signed-out";
    }

    if (!account.bookzAccountId) {
      account.bookzAccountId =
        crypto.randomUUID?.() ||
        "local-" + Date.now() + "-" +
        Math.random().toString(36).slice(2);

      localStorage.setItem(
        "essazlifeWorldAccount",
        JSON.stringify(account)
      );
    }

    return "local:" + account.bookzAccountId;
  }

  return "signed-out";
}

const BOOKZ_ACCOUNT_ID = getBookzAccountId();

function bookzStorageKey(baseKey) {
  return baseKey + "__" +
    encodeURIComponent(BOOKZ_ACCOUNT_ID);
}

function bookzRead(baseKey) {
  return localStorage.getItem(
    bookzStorageKey(baseKey)
  );
}

function bookzWrite(baseKey, value) {
  localStorage.setItem(
    bookzStorageKey(baseKey),
    value
  );
}

function bookzRemove(baseKey) {
  localStorage.removeItem(
    bookzStorageKey(baseKey)
  );
}

const PROGRESS_KEY = "essazlife_bookz_progress_v1";


/* ==========================================
   BOOKZ — SAVED BOOKSHELVES
========================================== */

const SHELVES_KEY = "essazlife_bookz_shelves_v1";

let activeShelf = "all";

function getShelfData() {
  try {
    const saved = JSON.parse(
      	bookzRead(SHELVES_KEY)
    );

    return saved && typeof saved === "object"
      ? saved
      : {};
  } catch (error) {
    console.warn("Could not load shelves:", error);
    return {};
  }
}

function saveShelfData(data) {
  try {
    	bookzWrite
      (SHELVES_KEY,
      JSON.stringify(data)
    );
    return true;
  } catch (error) {
    console.error("Could not save shelves:", error);
    alert("Bookz could not save your bookshelf changes.");
    return false;
  }
}

function getBookShelf(bookId) {
  const data = getShelfData();
  return data[bookId]?.shelf || null;
}

function setBookShelf(bookId, shelf) {
  const data = getShelfData();

  const existing = data[bookId] || {};

  data[bookId] = {
    ...existing,
    shelf
  };

  if (saveShelfData(data)) {
    renderLibraryShelf();
  }
}


/* ==========================================
   BOOKZ — READING COMPLETION TRACKING
========================================== */

const READ_PAGES_KEY = "essazlife_bookz_read_pages_v1";

function getReadPages() {
  try {
    const saved = JSON.parse(
      bookzRead(READ_PAGES_KEY)
    );

    return saved && typeof saved === "object"
      ? saved
      : {};
  } catch (error) {
    console.warn("Could not load read pages:", error);
    return {};
  }
}

function recordReadPage(bookId, pageNumber, totalPages) {
  if (
    !bookId ||
    !Number.isInteger(pageNumber) ||
    !Number.isInteger(totalPages) ||
    pageNumber < 1 ||
    totalPages < 1 ||
    pageNumber > totalPages
  ) {
    return;
  }

  const data = getReadPages();

  const existing = Array.isArray(data[bookId])
    ? data[bookId]
    : [];

  const visited = new Set(existing);

  visited.add(pageNumber);

  data[bookId] = [...visited];

  try {
    bookzWrite
    (READ_PAGES_KEY,
      JSON.stringify(data)
    );
  } catch (error) {
    console.warn("Could not save read pages:", error);
    return;
  }

  // All actual PDF pages must have been displayed.
  const finished = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  ).every((page) => visited.has(page));

  if (
    finished &&
    getBookShelf(bookId) !== "finished"
  ) {
    setBookShelf(bookId, "finished");
  }
}



let books = [];
let currentBook = null;
let currentPdf = null;
let currentPage = 1;
let openingId = 0;
let rendering = false;

if (window.pdfjsLib) {
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "vendor/pdfjs/pdf.worker.min.js";
}

function getProgress() {
  try {
    return JSON.parse(bookzRead(PROGRESS_KEY)) || {};
  } catch {
    return {};
  }
}

function saveProgress() {
  if (!currentBook) return;

  const progress = getProgress();
  progress[currentBook.id] = currentPage;

  try {
    bookzWrite(PROGRESS_KEY, JSON.stringify(progress));
  } catch (error) {
    console.warn("Could not save reading progress:", error);
  }
}

function setStatus(message) {
  readerStatus.textContent = message;
}

function updateButtons() {
  const total = currentPdf ? currentPdf.numPages : 0;

  previousButton.disabled =
    rendering || !currentPdf || currentPage <= 1;

  nextButton.disabled =
    rendering || !currentPdf || currentPage >= total;

  pageIndicator.textContent = total
    ? `Page ${currentPage} of ${total}`
    : "Loading...";
}

async function renderPage() {
  if (!currentPdf || rendering) return;

  rendering = true;
  updateButtons();
  setStatus("Loading page...");

  try {
    const pdf = currentPdf;
    const pageNumber = currentPage;
    const page = await pdf.getPage(pageNumber);

    const baseViewport = page.getViewport({ scale: 1 });

    
const isMobile = window.matchMedia("(max-width: 600px)").matches;

const availableWidth = isMobile
  ? window.innerWidth
  : Math.min(window.innerWidth - 65, 850);

const availableHeight = isMobile
  ? window.innerHeight
  : window.innerHeight * 0.85;

const scale = Math.min(
  availableWidth / baseViewport.width,
  availableHeight / baseViewport.height,
  3
);


    const viewport = page.getViewport({ scale });

    const pixelRatio = Math.min(
      window.devicePixelRatio || 1,
      2
    );

    const canvas = bookPage;
    const context = canvas.getContext("2d");

    canvas.width = Math.floor(viewport.width * pixelRatio);
    canvas.height = Math.floor(viewport.height * pixelRatio);

    canvas.style.width = `${viewport.width}px`;
    canvas.style.height = `${viewport.height}px`;

    await page.render({
      canvasContext: context,
      viewport,
      transform: pixelRatio === 1
        ? null
        : [pixelRatio, 0, 0, pixelRatio, 0, 0]
    }).promise;

    
saveProgress();

// Count a page only after it renders successfully.
if (currentBook && currentPdf === pdf) {
  recordReadPage(
    currentBook.id,
    pageNumber,
    pdf.numPages
  );
}

setStatus("");


  } catch (error) {
    console.error(error);
    setStatus("Unable to display this page.");
  } finally {
    rendering = false;
    updateButtons();
  }
}

async function openBook(book) {
  if (!window.pdfjsLib) {
    alert("The PDF reader library could not load.");
    return;
  }

  const requestId = ++openingId;

  currentBook = book;
  currentPdf = null;
  currentPage = 1;

  libraryScreen.hidden = true;
  readerScreen.hidden = false;

  readerTitle.textContent = book.title;
  setStatus("Opening your book...");
  updateButtons();

  try {
    const loadingTask = pdfjsLib.getDocument(
      encodeURI(book.file)
    );

    const pdf = await loadingTask.promise;

    if (requestId !== openingId) {
      await pdf.destroy();
      return;
    }

    currentPdf = pdf;

    const savedPage = Number(getProgress()[book.id]) || 1;

    currentPage = Math.min(
      Math.max(savedPage, 1),
      pdf.numPages
    );

   
await renderPage();

// A successfully opened book belongs on the
// Currently Reading shelf unless already finished.
const shelf = getBookShelf(book.id);

if (shelf !== "finished") {
  setBookShelf(book.id, "reading");
}

} catch (error) {

    console.error(error);
    setStatus(
      "This book could not be opened. Check its PDF filename."
    );
  }
}


/* ==========================================
   BOOKZ — BOOK COVERS
========================================== */

function createBookCard(book) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "book-card";

  const cover = document.createElement("div");
  cover.className = "book-cover";

 
const canvas = document.createElement("canvas");
canvas.setAttribute("aria-label", book.title + " cover");

// Show the placeholder while the real PDF cover loads.
const placeholder = document.createElement("img");
placeholder.src = "icons/Bookz.Placeholder.png";
placeholder.alt = "";
placeholder.className = "cover-placeholder";

cover.appendChild(placeholder);
canvas.hidden = true;
cover.appendChild(canvas);

 button.appendChild(cover);
button.setAttribute("aria-label", `View ${book.title}`);

  button.addEventListener("click", () => showBookPreview(book));

  // Load the first PDF page as the book cover.
  async function loadCover() {
    try {
      const loadingTask = pdfjsLib.getDocument(
        encodeURI(book.file)
      );

      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1);

      const viewport = page.getViewport({ scale: 1 });

      const scale = Math.min(
        300 / viewport.width,
        400 / viewport.height
      );

      const scaledViewport = page.getViewport({ scale });

      canvas.width = Math.ceil(scaledViewport.width);
      canvas.height = Math.ceil(scaledViewport.height);

      await page.render({
        canvasContext: canvas.getContext("2d"),
        viewport: scaledViewport
      }).promise;

      
placeholder.hidden = true;
canvas.hidden = false;


      await pdf.destroy();

    
} catch (error) {
  console.error("Could not load book cover:", error);

  // Keep the custom placeholder visible if loading fails.
  placeholder.hidden = false;
  canvas.hidden = true;
}

  }

  loadCover();

  return button;
}


async function loadLibrary() {
  bookLibrary.textContent = "Loading library...";

  try {
    const response = await fetch("books/catalog.json");

    if (!response.ok) {
      throw new Error("Catalog could not be loaded.");
    }

    const catalog = await response.json();
    books = catalog.books || [];

    
renderLibraryShelf();


  } catch (error) {
    console.error(error);
    bookLibrary.textContent =
      "Unable to load the library. Open Bookz through a local server.";
  }
}

previousButton.addEventListener("click", async () => {
  if (!currentPdf || rendering || currentPage <= 1) return;

  currentPage--;
  await renderPage();
});

nextButton.addEventListener("click", async () => {
  if (
    !currentPdf ||
    rendering ||
    currentPage >= currentPdf.numPages
  ) return;

  currentPage++;
  await renderPage();
});

backButton.addEventListener("click", () => {
  openingId++;

  currentBook = null;
  currentPdf = null;

  readerScreen.hidden = true;
  libraryScreen.hidden = false;
});

loadLibrary();


/* ==========================================
   BOOKZ — MOBILE SWIPE NAVIGATION
========================================== */

const pageContainer = document.querySelector(".page-container");

let touchStartX = 0;
let touchStartY = 0;

pageContainer.addEventListener("touchstart", (event) => {
  if (event.touches.length !== 1) return;

  touchStartX = event.touches[0].clientX;
  touchStartY = event.touches[0].clientY;
}, { passive: true });

pageContainer.addEventListener("touchend", async (event) => {
  if (!currentPdf || rendering) return;
  if (event.changedTouches.length !== 1) return;

  const deltaX =
    event.changedTouches[0].clientX - touchStartX;

  const deltaY =
    event.changedTouches[0].clientY - touchStartY;

  // Ignore short gestures and vertical scrolling.
  if (Math.abs(deltaX) < 50) return;
  if (Math.abs(deltaX) < Math.abs(deltaY) * 1.3) return;

  if (deltaX < 0 && currentPage < currentPdf.numPages) {
    currentPage++;
    await renderPage();
  } else if (deltaX > 0 && currentPage > 1) {
    currentPage--;
    await renderPage();
  }
}, { passive: true });


/* ==========================================
   BOOKZ — TRUE FULLSCREEN READING
========================================== */


/* ==========================================
   BOOKZ — OPTIONAL FULLSCREEN MODE
========================================== */

const fullscreenButton =
  document.getElementById("fullscreenButton");

const originalOpenBook = openBook;

openBook = async function(book) {
  document.body.classList.add("reading-mode");
  await originalOpenBook(book);
};

async function exitBookFullscreen() {
  if (document.fullscreenElement) {
    try {
      await document.exitFullscreen();
    } catch (error) {
      console.warn("Could not exit fullscreen:", error);
    }
  }
}

fullscreenButton.addEventListener("click", async () => {
  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await document.documentElement.requestFullscreen();
    }
  } catch (error) {
    console.warn("Fullscreen is unavailable:", error);
    alert("Fullscreen is not supported in this browser or preview.");
  }
});

document.addEventListener("fullscreenchange", () => {
  fullscreenButton.textContent = document.fullscreenElement
    ? "⛶ Exit Full Screen"
    : "⛶ Full Screen";
});

backButton.addEventListener("click", async () => {
  document.body.classList.remove("reading-mode");
  await exitBookFullscreen();
});


/* ==========================================
   BOOKZ — ACTUAL PDF BACK COVER PREVIEW
========================================== */

const bookPreview = document.getElementById("bookPreview");
const backCoverCanvas = document.getElementById("backCoverCanvas");
const closePreviewButton = document.getElementById("closePreview");
const readNowButton = document.getElementById("readNow");
const wantToReadButton = document.getElementById("wantToRead");

let previewBook = null;
let previewRequestId = 0;

async function showBookPreview(book) {
  const requestId = ++previewRequestId;
  previewBook = book;

  bookPreview.hidden = false;
  backCoverCanvas.hidden = true;
  readNowButton.disabled = true;

  try {
    const loadingTask = pdfjsLib.getDocument(encodeURI(book.file));
    const pdf = await loadingTask.promise;

    if (requestId !== previewRequestId) {
      await pdf.destroy();
      return;
    }

    // The final PDF page is the actual back cover.
    const page = await pdf.getPage(pdf.numPages);
    const viewport = page.getViewport({ scale: 1 });

    const scale = Math.min(
      430 / viewport.width,
      (window.innerHeight * 0.6) / viewport.height,
      2
    );

    const scaled = page.getViewport({ scale });

    backCoverCanvas.width = Math.ceil(scaled.width);
    backCoverCanvas.height = Math.ceil(scaled.height);

    await page.render({
      canvasContext: backCoverCanvas.getContext("2d"),
      viewport: scaled
    }).promise;

    if (requestId === previewRequestId) {
      backCoverCanvas.hidden = false;
      readNowButton.disabled = false;
    }

    await pdf.destroy();

  } catch (error) {
    console.error("Back cover could not load:", error);
    if (requestId === previewRequestId) {
      readNowButton.disabled = false;
    }
  }
}

function closeBookPreview() {
  previewRequestId++;
  bookPreview.hidden = true;
  previewBook = null;
}

closePreviewButton.addEventListener("click", closeBookPreview);

bookPreview.addEventListener("click", (event) => {
  if (event.target === bookPreview) {
    closeBookPreview();
  }
});

readNowButton.addEventListener("click", () => {
  if (!previewBook) return;

  const book = previewBook;
  closeBookPreview();
  openBook(book);
});


/* ==========================================
   BOOKZ — WANT TO READ
========================================== */

wantToReadButton.addEventListener("click", () => {
  if (!previewBook) return;

  const book = previewBook;

  setBookShelf(book.id, "wishlist");

  closeBookPreview();

  switchLibraryShelf("wishlist");
});



/* ==========================================
   BOOKZ — LIBRARY TAB NAVIGATION
========================================== */

const libraryTabs = document.querySelectorAll(
  ".library-tab"
);

function renderLibraryShelf() {
  bookLibrary.replaceChildren();

  const visibleBooks = books.filter((book) => {
    if (activeShelf === "all") {
      return true;
    }

    return getBookShelf(book.id) === activeShelf;
  });

  if (visibleBooks.length === 0) {
    const messages = {
      all: "No books available yet.",
      reading: "📖 You haven't started reading any books yet!",
      finished: "⭐ No finished books yet. Keep reading!",
      wishlist: "💜 Your Want to Read shelf is empty!"
    };

    bookLibrary.textContent =
      messages[activeShelf] || "No books found.";

    return;
  }

  for (const book of visibleBooks) {
    bookLibrary.appendChild(createBookCard(book));
  }
}

function switchLibraryShelf(shelf) {
  const allowed = [
    "all",
    "reading",
    "finished",
    "wishlist"
  ];

  if (!allowed.includes(shelf)) return;

  activeShelf = shelf;

  libraryTabs.forEach((tab) => {
    const selected = tab.dataset.shelf === shelf;

    tab.classList.toggle("active", selected);
    tab.setAttribute("aria-pressed", String(selected));
  });

  renderLibraryShelf();
}

libraryTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    switchLibraryShelf(tab.dataset.shelf);
  });
});


/* ==========================================
   ESSAzLife BOOKZ — BACKUP & RESTORE
========================================== */

/* ==========================================
   BOOKZ — CUSTOM DIALOG FUNCTIONS
========================================== */

const bookzDialog = document.getElementById("bookzDialog");
const bookzDialogTitle = document.getElementById("bookzDialogTitle");
const bookzDialogMessage = document.getElementById("bookzDialogMessage");
const bookzDialogIcon = document.getElementById("bookzDialogIcon");
const bookzDialogCancel = document.getElementById("bookzDialogCancel");
const bookzDialogConfirm = document.getElementById("bookzDialogConfirm");

function showBookzDialog({
  title = "ESSAzLife Bookz",
  message = "",
  icon = "🐮",
  confirmText = "OK",
  cancelText = "Cancel",
  showCancel = false
} = {}) {
  return new Promise((resolve) => {
    bookzDialogTitle.textContent = title;
    bookzDialogMessage.textContent = message;
    bookzDialogIcon.textContent = icon;

    bookzDialogConfirm.textContent = confirmText;
    bookzDialogCancel.textContent = cancelText;

    bookzDialogCancel.hidden = !showCancel;

    let settled = false;

    function finish(result) {
      if (settled) return;
      settled = true;

      bookzDialog.close();
      resolve(result);
    }

    bookzDialogConfirm.onclick = () => finish(true);
    bookzDialogCancel.onclick = () => finish(false);

    bookzDialog.oncancel = (event) => {
      event.preventDefault();
      finish(false);
    };

    bookzDialog.showModal();
  });
}


const downloadBackupButton =
  document.getElementById("downloadBackup");

const restoreBackupButton =
  document.getElementById("restoreBackup");

const restoreFileInput =
  document.getElementById("restoreFile");

// Only these three Bookz storage keys are backed up.
const BOOKZ_BACKUP_KEYS = [
  PROGRESS_KEY,
  SHELVES_KEY,
  READ_PAGES_KEY
];

/* ==========================================
   DOWNLOAD BACKUP
========================================== */

downloadBackupButton.addEventListener("click", () => {
  try {
    const backup = {
      app: "ESSAzLife Bookz",
      
version: 2,
accountId: BOOKZ_ACCOUNT_ID,
createdAt: new Date().toISOString(),
data: {}

    };

    BOOKZ_BACKUP_KEYS.forEach((key) => {
      const saved = bookzRead(key);

      backup.data[key] = saved
        ? JSON.parse(saved)
        : {};
    });

    const json = JSON.stringify(backup, null, 2);

    const blob = new Blob([json], {
      type: "application/json"
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;

    const date = new Date().toISOString().slice(0, 10);

    link.download = `ESSAzLife-Bookz-Backup-${date}.json`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);

  } catch (error) {
    console.error("Backup failed:", error);
    alert("Unable to create your Bookz backup.");
  }
});

/* ==========================================
   CHOOSE BACKUP FILE
========================================== */

restoreBackupButton.addEventListener("click", () => {
  restoreFileInput.value = "";
  restoreFileInput.click();
});

/* ==========================================
   RESTORE BACKUP
========================================== */

restoreFileInput.addEventListener("change", async () => {
  const file = restoreFileInput.files?.[0];

  if (!file) return;

  try {
    const text = await file.text();
    const backup = JSON.parse(text);

    // Reject unrelated or malformed backup files.
    if (
      !backup ||
      backup.app !== "ESSAzLife Bookz" ||
      ![1, 2].includes(backup.version) ||
      !backup.data ||
      typeof backup.data !== "object" ||
      Array.isArray(backup.data)
    ) 
    
    
// Version 2 backups belong to a specific World account.
if (
  backup.version === 2 &&
  backup.accountId !== BOOKZ_ACCOUNT_ID
) {
  throw new Error(
    "This backup belongs to a different World account. " +
    "Please sign into that account to restore it."
  );
}

{
      throw new Error("Not a valid ESSAzLife Bookz backup.");
    }

    // Require every expected key to be present.
    for (const key of BOOKZ_BACKUP_KEYS) {
      const value = backup.data[key];

      if (
        !value ||
        typeof value !== "object" ||
        Array.isArray(value)
      ) {
        throw new Error(`Invalid backup data: ${key}`);
      }
    }

    
const confirmed = await showBookzDialog({
  title: "Restore Your Bookz?",
  icon: "📂",
  message:
    "This will replace your current Bookz reading " +
    "progress and bookshelf choices with the " +
    "information in your selected backup.\n\n" +
    "Your other ESSAzLife apps will not be affected.\n\n" +
    "Would you like to continue?",
  confirmText: "💜 Restore",
  cancelText: "Cancel",
  showCancel: true
});


    if (!confirmed) return;

    // Save current Bookz data first so it can be
    // restored if writing the backup fails.
    const previousData = {};

    BOOKZ_BACKUP_KEYS.forEach((key) => {
      previousData[key] = bookzRead(key);
    });

    try {
      BOOKZ_BACKUP_KEYS.forEach((key) => {
        bookzWrite(
  key,
  JSON.stringify(backup.data[key])
);
      });
    } catch (saveError) {
      // Roll back all Bookz keys if a write fails.
      BOOKZ_BACKUP_KEYS.forEach((key) => {
        try {
          if (previousData[key] === null) {
            localStorage.removeItem(key);
          } else {
            localStorage.setItem(
              key,
              previousData[key]
            );
          }
        } catch (rollbackError) {
          console.error(
            "Could not roll back Bookz data:",
            rollbackError
          );
        }
      });

      throw saveError;
    }

    // Return to Full Library with restored shelves.
    switchLibraryShelf("all");

    
await showBookzDialog({
  title: "Backup Restored!",
  icon: "🐮📚",
  message:
    "Your Bookz reading progress and bookshelves " +
    "have been restored successfully!",
  confirmText: "YAY! 💜"
});


  } catch (error) {
    console.error("Restore failed:", error);

    
await showBookzDialog({
  title: "Oops! Something Went Wrong",
  icon: "📚💔",
  message:
    "Unable to restore this backup.\n\n" +
    error.message +
    "\n\nYour existing Bookz data was not intentionally changed.",
  confirmText: "OK"
});


  } finally {
    restoreFileInput.value = "";
  }
});


/* ==========================================
   BOOKZ — IMPORT OLD READING PROGRESS
========================================== */

async function offerLegacyBookzImport() {
  if (BOOKZ_ACCOUNT_ID === "signed-out") return;

  const legacyKeys = [
    PROGRESS_KEY,
    SHELVES_KEY,
    READ_PAGES_KEY
  ];

  const hasLegacy = legacyKeys.some(
    key => localStorage.getItem(key) !== null
  );

  const hasAccountData = legacyKeys.some(
    key => bookzRead(key) !== null
  );

  const askedKey =
    "essazlife_bookz_legacy_import_prompted__" +
    encodeURIComponent(BOOKZ_ACCOUNT_ID);

  if (
    !hasLegacy ||
    hasAccountData ||
    localStorage.getItem(askedKey)
  ) {
    return;
  }

  const confirmed = await showBookzDialog({
    title: "Import Your Old Bookz Progress?",
    icon: "📚",
    message:
      "Bookz found reading progress saved before " +
      "account-specific bookshelves were added.\n\n" +
      "Would you like to copy that progress into " +
      "your current World account?\n\n" +
      "Your original data will be kept.",
    confirmText: "💜 Import",
    cancelText: "Not Now",
    showCancel: true
  });

  if (!confirmed) {
    localStorage.setItem(askedKey, "dismissed");
    return;
  }

  try {
    const validated = {};

    for (const key of legacyKeys) {
      const value = localStorage.getItem(key);

      if (value === null) continue;

      const parsed = JSON.parse(value);

      if (
        !parsed ||
        typeof parsed !== "object" ||
        Array.isArray(parsed)
      ) {
        throw new Error("Old Bookz data is invalid.");
      }

      validated[key] = JSON.stringify(parsed);
    }

    for (const [key, value] of Object.entries(validated)) {
      bookzWrite(key, value);
    }

    localStorage.setItem(askedKey, "imported");

    renderLibraryShelf();

    await showBookzDialog({
      title: "Progress Imported!",
      icon: "🐮📚",
      message:
        "Your old Bookz progress is now available " +
        "in this World account!",
      confirmText: "YAY! 💜"
    });

  } catch (error) {
    console.error("Bookz import failed:", error);

    await showBookzDialog({
      title: "Import Not Completed",
      icon: "📚",
      message:
        "Your original progress was not deleted.\n\n" +
        error.message,
      confirmText: "OK"
    });
  }
}

offerLegacyBookzImport();

