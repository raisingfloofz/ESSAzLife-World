
/* ==========================================
   ESSAzLife WISHEZ
   Wishlist Foundation
========================================== */

const WISHEZ_DATA_KEY = "essazlife_wishez_data_v1";


const WISHEZ_CLOUD_URL =
  "https://essazlife-world-auth.biawhite1024.workers.dev";


const homeScreen = document.getElementById("homeScreen");
const wishlistScreen = document.getElementById("wishlistScreen");
const wishlistGrid = document.getElementById("wishlistGrid");
const wishGrid = document.getElementById("wishGrid");

const modalOverlay = document.getElementById("modalOverlay");
const modalTitle = document.getElementById("modalTitle");
const modalContent = document.getElementById("modalContent");
const modalActions = document.getElementById("modalActions");

let activeWishlistId = null;

/* ==========================================
   WORLD ACCOUNT IDENTIFICATION
========================================== */

function getWishezAccountId() {
  const mode = localStorage.getItem(
    "essazlifeWorldLoginMode"
  );

  const loggedIn =
    localStorage.getItem("essazlifeWorldLoggedIn") === "true";

  // Separate standalone testing from World accounts.
  if (!loggedIn) return "standalone";

  if (mode === "guest") return "guest";

  if (mode === "cloud") {
    try {
      const account = JSON.parse(
        sessionStorage.getItem("essazlifeWorldCloudAccount") ||
        localStorage.getItem("essazlifeWorldCloudAccount") ||
        "null"
      );

      if (!account?.username) return "standalone";

      return "cloud:" + String(
        account.id || account.userId || account.username
      ).toLowerCase();
    } catch {
      return "standalone";
    }
  }

  if (mode === "local") {
    try {
      const account = JSON.parse(
        localStorage.getItem("essazlifeWorldAccount") ||
        "null"
      );

      if (!account?.username) return "standalone";

      // Reuse Bookz's existing local account ID.
      if (!account.bookzAccountId) {
        account.bookzAccountId =
          crypto.randomUUID?.() ||
          "local-" + Date.now();

        localStorage.setItem(
          "essazlifeWorldAccount",
          JSON.stringify(account)
        );
      }

      return "local:" + account.bookzAccountId;
    } catch {
      return "standalone";
    }
  }

  return "standalone";
}

const WISHEZ_ACCOUNT_ID = getWishezAccountId();

function wishezStorageKey(key) {
  return key + "__" +
    encodeURIComponent(WISHEZ_ACCOUNT_ID);
}

/* ==========================================
   SAVE AND LOAD
========================================== */

function emptyWishezData() {
  return {
    wishlists: [],
    wishes: []
  };
}

function loadWishezData() {
  try {
    const saved = localStorage.getItem(
      wishezStorageKey(WISHEZ_DATA_KEY)
    );

    if (!saved) return emptyWishezData();

    const parsed = JSON.parse(saved);

    if (
      !parsed ||
      !Array.isArray(parsed.wishlists) ||
      !Array.isArray(parsed.wishes)
    ) {
      return emptyWishezData();
    }

    return parsed;
  } catch (error) {
    console.error("Could not load Wishez:", error);
    return emptyWishezData();
  }
}

let wishezData = loadWishezData();

function saveWishezData() {
  try {
    localStorage.setItem(
      wishezStorageKey(WISHEZ_DATA_KEY),
      JSON.stringify(wishezData)
    );

    return true;
  } catch (error) {
    console.error("Could not save Wishez:", error);
    showMessage(
      "Save Failed",
      "Wishez could not save your changes. Your browser storage may be full."
    );
    return false;
  }
}

function makeId() {
  return crypto.randomUUID?.() ||
    Date.now() + "-" + Math.random().toString(36).slice(2);
}

/* ==========================================
   SEASONAL THEMES
========================================== */

const themeIcons = {
  christmas: "Wishez.Christmas.png",
  valentines: "Wishez.Valentines.png",
  regular: "Wishez.Regular.png",
  halloween: "Wishez.Halloween.png",
  birthday: "Wishez.Birthday.png"
};

function getSeasonalTheme() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  if (
    (month === 11 && day >= 2) ||
    month === 12 ||
    (month === 1 && day === 1)
  ) return "christmas";

  if (
    (month === 1 && day >= 2) ||
    (month === 2 && day <= 20)
  ) return "valentines";

  if (
    (month === 10) ||
    (month === 11 && day === 1)
  ) return "halloween";

  return "regular";
}

function applyWishezTheme(theme = getSeasonalTheme()) {
  document.body.className = "theme-" + theme;

  const icon = document.getElementById("seasonalIcon");

  if (icon) {
    icon.src = "icons/" + themeIcons[theme];
  }

  const favicon = document.querySelector(
    'link[rel="icon"]'
  );

  if (favicon) {
    favicon.href = "icons/" + themeIcons[theme];
  }

  const color = getComputedStyle(document.body)
    .getPropertyValue("--header").trim();

  const metaTheme = document.querySelector(
    'meta[name="theme-color"]'
  );

  if (metaTheme && color) {
    metaTheme.content = color;
  }
}

applyWishezTheme();

/* ==========================================
   CUSTOM POPUPS
========================================== */

function closeModal() {
  modalOverlay.classList.add("hidden");
  modalContent.replaceChildren();
  modalActions.replaceChildren();
}

function openModal(title, buildContent, buttons = []) {
    
  // Remove any trashcan left over from View Wish.
  document.querySelector(".modal .wish-trash-button")?.remove();

  modalTitle.textContent = title;
  modalContent.replaceChildren();
  modalActions.replaceChildren();

  if (typeof buildContent === "string") {
    const p = document.createElement("p");
    p.textContent = buildContent;
    modalContent.appendChild(p);
  } else if (typeof buildContent === "function") {
    buildContent(modalContent);
  }

  for (const config of buttons) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = config.primary
      ? "primary-button"
      : "secondary-button";

    button.textContent = config.label;
    button.addEventListener("click", config.action);
    modalActions.appendChild(button);
  }

  modalOverlay.classList.remove("hidden");
}

function showMessage(title, message) {
  openModal(title, message, [
    {
      label: "Okay!",
      primary: true,
      action: closeModal
    }
  ]);
}

function confirmAction(title, message, onConfirm) {
  openModal(title, message, [
    {
      label: "Cancel",
      action: closeModal
    },
    {
      label: "Yes, Continue",
      primary: true,
      action: () => {
        closeModal();
        onConfirm();
      }
    }
  ]);
}

modalOverlay.addEventListener("click", event => {
  if (event.target === modalOverlay) {
    closeModal();
  }
});

/* ==========================================
   FORM HELPERS
========================================== */

function createField(labelText, value = "", multiline = false) {
  const group = document.createElement("div");
  group.className = "form-group";

  const label = document.createElement("label");
  label.textContent = labelText;

  const field = document.createElement(
    multiline ? "textarea" : "input"
  );

  if (!multiline) field.type = "text";

  field.value = value;
  field.maxLength = multiline ? 500 : 80;

  group.append(label, field);

  return { group, field };
}

/* ==========================================
   WISHLIST HOMEPAGE
========================================== */

function renderWishlists() {
  wishlistGrid.replaceChildren();

  // Permanent collection always appears first.
  const receivedCard = document.createElement("div");
  receivedCard.className = "wishlist-card";

  const receivedTitle = document.createElement("h3");
  receivedTitle.textContent = "🎉 I Got It!";

  const receivedDescription = document.createElement("p");
  receivedDescription.textContent =
    "All the wishes that came true!";

  const receivedCount = document.createElement("span");
  receivedCount.className = "wishlist-count";
  receivedCount.textContent =
    wishezData.wishes.filter(wish => wish.received).length +
    " received";

  receivedCard.append(
    receivedTitle,
    receivedDescription,
    receivedCount
  );

  receivedCard.addEventListener("click", () => {
    openWishlist("received");
  });

  wishlistGrid.appendChild(receivedCard);

  for (const wishlist of wishezData.wishlists) {
    const card = document.createElement("div");
    card.className = "wishlist-card";

    const title = document.createElement("h3");
    title.textContent = "🎁 " + wishlist.name;

    const description = document.createElement("p");
    description.textContent =
      wishlist.description || "My wishlist!";

    const count = document.createElement("span");
    count.className = "wishlist-count";

    count.textContent =
      wishezData.wishes.filter(wish =>
        wish.wishlistIds?.includes(wishlist.id)
      ).length + " wishes";

    card.append(title, description, count);

    card.addEventListener("click", () => {
      openWishlist(wishlist.id);
    });

    wishlistGrid.appendChild(card);
  }
}

/* ==========================================
   CREATE AND EDIT WISHLISTS
========================================== */

function showWishlistEditor(existing = null) {
  const name = createField(
    "Wishlist Name",
    existing?.name || ""
  );

  const description = createField(
    "Description",
    existing?.description || "",
    true
  );

  openModal(
    existing ? "Edit Wishlist" : "Create Wishlist",
    container => {
      container.append(
        name.group,
        description.group
      );
    },
    [
      {
        label: "Cancel",
        action: closeModal
      },
      {
        label: existing ? "Save Changes" : "Create!",
        primary: true,
        action: () => {
          const newName = name.field.value.trim();
          const newDescription =
            description.field.value.trim();

          if (!newName) {
            name.field.focus();
            return;
          }

          const previous = structuredClone(wishezData);

          if (existing) {
            const wishlist = wishezData.wishlists.find(
              item => item.id === existing.id
            );

            if (!wishlist) return;

            wishlist.name = newName;
            wishlist.description = newDescription;
          } else {
            wishezData.wishlists.push({
              id: makeId(),
              name: newName,
              description: newDescription
            });
          }

          if (!saveWishezData()) {
            wishezData = previous;
            return;
          }

          closeModal();
          renderWishlists();

          if (existing) openWishlist(existing.id);
        }
      }
    ]
  );
}

/* ==========================================
   DELETE WISHLIST
========================================== */

let wishlistDeletionInProgress = false;

function deleteWishlist(id) {

    
  // Protect the permanent received collection.
  if (id === "received") return;

    
  const cloudAccount = canUseWishezCloud();

  const wishlist = wishezData.wishlists.find(
    item => item.id === id
  );

  if (!wishlist) return;

  confirmAction(
    "Delete Wishlist?",
    'Are you sure you want to delete "' +
      wishlist.name +
      '"? This cannot be undone.',
    
    async () => {
        
      if (wishlistDeletionInProgress) return;
      wishlistDeletionInProgress = true;

      try {

      const previous = structuredClone(wishezData);

      
      let cloudStatusWasPublished = false;


      
      
const isWorldCloudAccount =
  localStorage.getItem("essazlifeWorldLoginMode") === "cloud" ||
  (typeof WISHEZ_ACCOUNT_ID !== "undefined" &&
    String(WISHEZ_ACCOUNT_ID).startsWith("cloud:"));


      if (isWorldCloudAccount && !cloudAccount) {
        showMessage(
          "Cloud Sign-In Needed",
          "Please sign back into World Cloud before deleting this wishlist, so any public sharing link can be disabled."
        );
        return;
      }

      
      if (isWorldCloudAccount) {
        const cloudStatus = await checkWishezPublishedStatus(id);

        if (!cloudStatus.ok) {
          showMessage(
            "Wishlist Not Deleted",
            "Cloudflare couldn't verify whether this wishlist is shared. Your wishlist has been kept. " +
              cloudStatus.reason
          );
          return;
        }

        
        if (cloudStatus.published) {
            
          cloudStatusWasPublished = true;

          const deletionResult =
            await deletePublishedWishezWishlist(id);

          if (!deletionResult.ok) {
            showMessage(
              "Wishlist Not Deleted",
              "Cloudflare couldn't disable the public sharing link. Your wishlist has been kept. " +
                deletionResult.reason
            );
            return;
          }
        }

      }




      wishezData.wishlists =
        wishezData.wishlists.filter(item => item.id !== id);

      // Keep shared wishes that belong to other lists.
      for (const wish of wishezData.wishes) {
        wish.wishlistIds = (wish.wishlistIds || [])
          .filter(listId => listId !== id);
      }

      
      
wishezData.wishes = wishezData.wishes.filter(
  wish =>
    wish.wishlistIds.length > 0 ||
    wish.received
);

    

      

      if (!saveWishezData()) {
        wishezData = previous;

        if (isWorldCloudAccount && cloudStatusWasPublished) {
          clearPublishedWishezId(id);

          showMessage(
            "Wishlist Kept",
            "Your wishlist couldn't be deleted locally, but its public sharing link was disabled. You can publish it again later."
          );
        } else {
          showMessage(
            "Wishlist Not Deleted",
            "Your changes couldn't be saved. Your wishlist has been kept."
          );
        }

        return;
      }


      
      clearPublishedWishezId(id);


      
      activeWishlistId = null;
      showHome();

      } catch (error) {
        console.error("Wishlist deletion failed:", error);

        showMessage(
          "Deletion Error",
          "Something unexpected happened while deleting this wishlist. Please check your wishlists before trying again."
        );

      } finally {
        wishlistDeletionInProgress = false;
      }


    }
  );
}

/* ==========================================
   OPEN WISHLIST
========================================== */

function showHome() {
  wishlistScreen.classList.add("hidden");
  homeScreen.classList.remove("hidden");
  renderWishlists();
}

function openWishlist(id) {
  activeWishlistId = id;

  const title = document.getElementById(
    "currentWishlistTitle"
  );

  const description = document.getElementById(
    "currentWishlistDescription"
  );

  const addButton = document.getElementById(
    "addWishButton"
  );

  if (id === "received") {
    title.textContent = "🎉 I Got It!";
    description.textContent =
      "All the wishes that came true!";

    addButton.classList.add("hidden");
  } else {
    const wishlist = wishezData.wishlists.find(
      item => item.id === id
    );

    if (!wishlist) {
      showHome();
      return;
    }

    title.textContent = wishlist.name;
    description.textContent =
      wishlist.description || "";

    addButton.classList.remove("hidden");
  }

  homeScreen.classList.add("hidden");
  wishlistScreen.classList.remove("hidden");

  wishGrid.replaceChildren();

  if (id === "received") {
    wishGrid.textContent =
      "Your received wishes will appear here!";
  } else {
    const wishlist = wishezData.wishlists.find(
      item => item.id === id
    );

    const actions = document.createElement("div");
    actions.className = "modal-actions";

    const edit = document.createElement("button");
    edit.className = "secondary-button";
    edit.textContent = "✏️ Edit Wishlist";

    edit.addEventListener("click", () => {
      showWishlistEditor(wishlist);
    });

    const remove = document.createElement("button");
    remove.className = "secondary-button";
    remove.textContent = "🗑️ Delete Wishlist";

    remove.addEventListener("click", () => {
      deleteWishlist(id);
    });

    actions.append(edit, remove);

    wishGrid.appendChild(actions);
  }
}

/* ==========================================
   BUTTONS
========================================== */

document.getElementById("createWishlistButton")
  .addEventListener("click", () => {
    showWishlistEditor();
  });

document.getElementById("backToWishlists")
  .addEventListener("click", showHome);

document.getElementById("addWishButton")
  .addEventListener("click", () => {
    showMessage(
      "Coming Next!",
      "We're building the Add Wish feature next!"
    );
  });

document.getElementById("helpButton")
  .addEventListener("click", () => {
    showMessage(
      "How to Use Wishez",
      "Create a wishlist, then add wishes using product screenshots and shopping links. Never include your address or personal information in a wishlist."
    );
  });


document.getElementById("settingsButton")
  .addEventListener("click", showWishezSettings);

function showWishezSettings() {
  openModal(
    "⚙️ Wishez Settings",
    container => {
      const birthdaySection = document.createElement("div");
      birthdaySection.className = "settings-section";

      const birthdayTitle = document.createElement("h3");
      birthdayTitle.textContent = "🎂 Birthday Preferences";

      const birthdayDescription = document.createElement("p");
      birthdayDescription.textContent =
        "Set your birthday to personalize your Wishez theme!";

      const birthdayButton = document.createElement("button");
      birthdayButton.type = "button";
      birthdayButton.className = "secondary-button";
      birthdayButton.textContent = "🎂 Set Birthday";
      birthdayButton.addEventListener(
        "click",
        showBirthdaySettings
      );

      birthdaySection.append(
        birthdayTitle,
        birthdayDescription,
        birthdayButton
      );

      const backupSection = document.createElement("div");
      backupSection.className = "settings-section";

      const backupTitle = document.createElement("h3");
      backupTitle.textContent = "💾 Backup & Restore";

      const backupDescription = document.createElement("p");
      backupDescription.textContent =
        "Keep a backup of your wishes so you can restore them later.";

      const backupButton = document.createElement("button");
      backupButton.type = "button";
      backupButton.className = "secondary-button";
      backupButton.textContent = "💾 Backup Wishez";
      backupButton.addEventListener("click", backupWishez);

      const restoreButton = document.createElement("button");
      restoreButton.type = "button";
      restoreButton.className = "secondary-button";
      restoreButton.textContent = "📂 Restore Wishez";
      restoreButton.addEventListener("click", restoreWishez);

      backupSection.append(
        backupTitle,
        backupDescription,
        backupButton,
        restoreButton
      );

      container.append(birthdaySection, backupSection);
    },
    [
      {
        label: "Close",
        primary: true,
        action: closeModal
      }
    ]
  );
}


document.getElementById("worldButton")
  .addEventListener("click", () => {
    window.location.href = "../../index.html";
  });

/* ==========================================
   START
========================================== */

renderWishlists();


/* ==========================================
   WISHEZ — ADD WISHES
========================================== */

function createWishFormField(labelText, value = "", type = "text") {
  const group = document.createElement("div");
  group.className = "form-group";

  const label = document.createElement("label");
  label.textContent = labelText;

  const input = type === "textarea"
    ? document.createElement("textarea")
    : document.createElement("input");

  if (type !== "textarea") {
    input.type = type;
  }

  input.value = value;

  group.append(label, input);

  return { group, input };
}

function compressWishImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const image = new Image();

      image.onload = () => {
        const canvas = document.createElement("canvas");

        const scale = Math.min(
          1,
          700 / Math.max(image.width, image.height)
        );

        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);

        const context = canvas.getContext("2d");

        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        resolve(canvas.toDataURL("image/jpeg", 0.7));
      };

      image.onerror = () => reject(
        new Error("Unable to read the selected image.")
      );

      image.src = reader.result;
    };

    reader.onerror = () => reject(
      new Error("Unable to read the selected file.")
    );

    reader.readAsDataURL(file);
  });
}

function showAddWishForm() {
  if (!activeWishlistId || activeWishlistId === "received") {
    return;
  }

  const photoGroup = document.createElement("div");
  photoGroup.className = "form-group";

  const photoLabel = document.createElement("label");
  photoLabel.textContent = "Product Photo or Screenshot (Optional)";

  const photoInput = document.createElement("input");
  photoInput.type = "file";
  photoInput.accept = "image/*";

  photoGroup.append(photoLabel, photoInput);

  const warning = document.createElement("p");
  warning.className = "safety-reminder";
  warning.textContent =
    "For your safety, please DO NOT enter your home address, " +
    "phone number, email address, or other personal information " +
    "anywhere in your wishlist. Check screenshots for private details, too.";

  const name = createWishFormField("Item Name *");
  const price = createWishFormField("Estimated Price", "", "number");
  const store = createWishFormField("Store");
  const description = createWishFormField(
    "Why I Want It",
    "",
    "textarea"
  );
  const link = createWishFormField("Product Link", "", "url");

  
const wishlistSelector = createWishlistSelector([
  activeWishlistId
]);


  price.input.min = "0";
  price.input.step = "0.01";

  openModal(
    "🎁 Add a Wish",
    container => {
      
container.append(
  photoGroup,
  warning,
  name.group,
  price.group,
  store.group,
  description.group,
  link.group,
  wishlistSelector.container
);

    },
    [
      {
        label: "Cancel",
        action: closeModal
      },
      {
        label: "Add Wish!",
        primary: true,
        action: async () => {
          const file = photoInput.files?.[0];
          const itemName = name.input.value.trim();

          
const selectedWishlistIds =
  wishlistSelector.getSelectedIds();

if (selectedWishlistIds.length === 0) {
  showMessage(
    "Choose a Wishlist",
    "Please select at least one wishlist for this wish."
  );
  return;
}


          

          if (file && !file.type.startsWith("image/")) {
  showMessage(
    "Invalid Photo",
    "Please select an image file."
  );
  return;
}

          if (!itemName) {
            name.input.focus();
            return;
          }

          const productLink = link.input.value.trim();

          if (productLink) {
            try {
              const parsed = new URL(productLink);

              if (!["http:", "https:"].includes(parsed.protocol)) {
                throw new Error("Invalid protocol");
              }
            } catch {
              showMessage(
                "Invalid Link",
                "Please enter a complete http:// or https:// product link."
              );
              return;
            }
          }

          let photo = "";

if (file) {
  try {
    photo = await compressWishImage(file);
  } catch {
    showMessage(
      "Photo Error",
      "That photo couldn't be processed. Please try another."
    );
    return;
  }
}

          const wish = {
            id: makeId(),
            
wishlistIds: selectedWishlistIds,

            name: itemName,
            photo,
            price: price.input.value.trim(),
            store: store.input.value.trim(),
            description: description.input.value.trim(),
            link: productLink,
            received: false,
            receivedFrom: ""
          };

          const previous = structuredClone(wishezData);
          
      let cloudStatusWasPublished = false;


          wishezData.wishes.push(wish);

          if (!saveWishezData()) {
            wishezData = previous;
            return;
          }

          closeModal();
          openWishlist(activeWishlistId);
        }
      }
    ]
  );
}

/* ==========================================
   WISHEZ — DISPLAY WISHES
========================================== */

function renderWishCards() {
  wishGrid.replaceChildren();

  const visibleWishes = getOrderedWishes();

  if (visibleWishes.length === 0) {
    const empty = document.createElement("p");

    empty.textContent = activeWishlistId === "received"
      ? "No received wishes yet! 🎁"
      : "No wishes yet! Tap + Add Wish to get started.";

    wishGrid.appendChild(empty);
    return;
  }

  for (const wish of visibleWishes) {
    const card = document.createElement("div");
    card.className = "wish-card";

    const photoContainer = document.createElement("div");
    photoContainer.className = "wish-photo";

    if (!wish.photo) {
  photoContainer.style.height = "100px";
  photoContainer.style.display = "flex";
  photoContainer.style.alignItems = "center";
  photoContainer.style.justifyContent = "center";
  photoContainer.style.fontSize = "48px";
}

    const photo = document.createElement("img");
    if (wish.photo) {
  photo.src = wish.photo;
} else {
  photo.alt = "🎁 No product photo";
  photoContainer.textContent = "🎁";
}
    photo.alt = wish.name;

    if (wish.photo) {
  photoContainer.appendChild(photo);
}

    if (wish.received) {
      const overlay = document.createElement("div");
      overlay.className = "received-overlay";
      overlay.textContent = "✓";

      photoContainer.appendChild(overlay);
    }

    const title = document.createElement("h3");
    title.textContent = wish.name;

    const price = document.createElement("p");

    price.textContent = wish.price
      ? "$" + Number(wish.price).toFixed(2)
      : "Price not listed";

    const details = document.createElement("button");
    details.className = "primary-button";
    details.textContent = "View Wish";

    details.addEventListener("click", () => {
      showWishDetails(wish.id);
    });

    
card.append(photoContainer, title, price, details);


wishGrid.appendChild(card);

  }
}

/* ==========================================
   WISHEZ — WISH DETAILS
========================================== */

function showWishDetails(id) {
  const wish = wishezData.wishes.find(item => item.id === id);
  if (!wish) return;

  openModal("🎁 " + wish.name, container => {

    if (wish.photo) {
  const photo = document.createElement("img");
  photo.src = wish.photo;
  photo.alt = wish.name;
  photo.style.width = "100%";
  photo.style.maxHeight = "250px";
  photo.style.objectFit = "contain";

  container.appendChild(photo);
} else {
  const placeholder = document.createElement("p");
  placeholder.textContent = "🎁 No product photo";
  container.appendChild(placeholder);
}

   
const details = [
  ["Estimated Price", wish.price
    ? "$" + Number(wish.price).toFixed(2)
    : "Not listed"],

  ["Store", wish.store || "Not listed"],

  ["Why I Want It", wish.description || "No description"]
];

// Show the gift-giver only to the wishlist owner.
if (wish.received && wish.receivedFrom) {
  details.push([
    "🎁 Gifted By",
    wish.receivedFrom
  ]);
}


    for (const [label, value] of details) {
      const p = document.createElement("p");
      const strong = document.createElement("strong");

      strong.textContent = label + ": ";
      p.append(strong, document.createTextNode(value));

      container.appendChild(p);
    }

    if (wish.link) {
      const linkButton = document.createElement("a");

      linkButton.href = wish.link;
      linkButton.target = "_blank";
      linkButton.rel = "noopener noreferrer";
      linkButton.className = "primary-button";
      linkButton.textContent = "🛍️ Go To Item";
      linkButton.style.display = "inline-block";

      container.appendChild(linkButton);
    }

}, [
  {
    label: "Close",
    action: closeModal
  },
  {
    label: "✏️ Edit Wish",
    action: () => showEditWishForm(id)
  },
  {
    label: wish.received ? "↩️ Undo I Got It!" : "🎉 I Got It!",

      primary: true,
      action: () => {
        if (wish.received) {
          updateWishReceived(id, false, "");
        } else {
          showReceivedForm(id);
        }
      }
    }
  ]);

  
  // Tiny trashcan in the upper-right of the popup.
  const trashButton = document.createElement("button");
  trashButton.type = "button";
  trashButton.className = "wish-trash-button";
  trashButton.textContent = "🗑️";
  trashButton.title = "Delete Wish";
  trashButton.setAttribute(
    "aria-label",
    "Delete " + wish.name
  );

  trashButton.addEventListener("click", () => {
    confirmDeleteWish(wish.id);
  });

  document.querySelector(".modal .wish-trash-button")?.remove();

  document.querySelector(".modal").appendChild(trashButton);

}

/* ==========================================
   WISHEZ — I GOT IT!
========================================== */


function showReceivedForm(id) {
  const wish = wishezData.wishes.find(
    item => item.id === id
  );

  if (!wish) return;

  const giver = createWishFormField(
    "Who Got It For You? (Optional)"
  );

  const removeGroup = document.createElement("div");
  removeGroup.className = "form-group";

  const removeLabel = document.createElement("label");
  removeLabel.className = "wishlist-checkbox-row";

  const removeCheckbox = document.createElement("input");
  removeCheckbox.type = "checkbox";

  const removeText = document.createElement("span");
  removeText.textContent =
    "Remove this wish from my other wishlists";

  removeLabel.append(removeCheckbox, removeText);
  removeGroup.appendChild(removeLabel);

  openModal(
    "🎉 I Got It!",
    container => {
      const message = document.createElement("p");
      message.textContent =
        "YAY! Your wish came true! You can record " +
        "who gave it to you and choose whether to " +
        "keep it in your other wishlists.";

      container.append(
        message,
        giver.group,
        removeGroup
      );
    },
    [
      {
        label: "Cancel",
        action: () => showWishDetails(id)
      },
      {
        label: "🎉 Save!",
        primary: true,
        action: () => {
          const previous = structuredClone(wishezData);

          
wish.received = true;
wish.receivedFrom = giver.input.value.trim();

if (removeCheckbox.checked) {
  // Remember the wishlists this item came from.
  wish.previousWishlistIds = [...wish.wishlistIds];

  // Remove the item from its regular wishlists.
  wish.wishlistIds = [];
}


          if (!saveWishezData()) {
            wishezData = previous;
            return;
          }

          closeModal();
          openWishlist(activeWishlistId);
          renderWishlists();
        }
      }
    ]
  );
}



function updateWishReceived(id, received, receivedFrom) {
  const wish = wishezData.wishes.find(
    item => item.id === id
  );

  if (!wish) return;

  const previous = structuredClone(wishezData);

  wish.received = received;
  wish.receivedFrom = receivedFrom;

  if (!received) {
    // Restore the wishlists saved before receiving.
    if (
      wish.wishlistIds.length === 0 &&
      Array.isArray(wish.previousWishlistIds)
    ) {
      wish.wishlistIds = wish.previousWishlistIds.filter(
        listId => wishezData.wishlists.some(
          list => list.id === listId
        )
      );
    }

    delete wish.previousWishlistIds;

    // Prevent an unreceived wish from disappearing
    // if its original wishlists no longer exist.
    if (wish.wishlistIds.length === 0) {
      wishezData = previous;

      showMessage(
        "Choose a Wishlist",
        "This wish no longer belongs to an existing wishlist. " +
        "Edit the wish and select a wishlist before undoing I Got It!"
      );
      return;
    }
  }

  if (!saveWishezData()) {
    wishezData = previous;
    return;
  }

  closeModal();
  openWishlist(activeWishlistId);
  renderWishlists();
}

/* ==========================================
   CONNECT ADD WISH BUTTON
========================================== */

const newAddWishButton =
  document.getElementById("addWishButton");

newAddWishButton.replaceWith(
  newAddWishButton.cloneNode(true)
);

document.getElementById("addWishButton")
  .addEventListener("click", showAddWishForm);

/* ==========================================
   UPDATE WISHLIST DISPLAY
========================================== */

const originalOpenWishlist = openWishlist;

openWishlist = function(id) {
  originalOpenWishlist(id);

  if (activeWishlistId === id) {
    renderWishCards();
  }
};


/* ==========================================
   WISHEZ — DELETE WISHES
========================================== */


function confirmDeleteWish(id) {
  const wish = wishezData.wishes.find(
    item => item.id === id
  );

  if (!wish) return;

  const currentList = wishezData.wishlists.find(
    list => list.id === activeWishlistId
  );

  // I Got It! is a collection, not a regular wishlist.
  // Only regular wishlists offer "Remove From This Wishlist".
  if (!currentList) {
    confirmPermanentWishDeletion(id);
    return;
  }

  openModal(
    "🗑️ Remove or Delete?",
    container => {
      const message = document.createElement("p");
      message.textContent =
        'What would you like to do with "' +
        wish.name + '"?';

      const explanation = document.createElement("p");
      explanation.textContent =
        'Removing it from "' + currentList.name +
        '" will keep it in other wishlists and in ' +
        '"I Got It!" if you received it.';

      container.append(message, explanation);
    },
    [
      {
        label: "Cancel",
        action: () => showWishDetails(id)
      },
      {
        label: "Remove From " + currentList.name,
        action: () => removeWishFromWishlist(
          id,
          currentList.id
        )
      },
      {
        label: "🗑️ Delete Permanently",
        primary: true,
        action: () => confirmPermanentWishDeletion(id)
      }
    ]
  );
}

function removeWishFromWishlist(id, wishlistId) {
  const wish = wishezData.wishes.find(
    item => item.id === id
  );

  if (!wish) return;

  const previous = structuredClone(wishezData);

  // Remove this wishlist only.
  wish.wishlistIds = (wish.wishlistIds || []).filter(
    id => id !== wishlistId
  );

  // Preserve the original list for a future Undo I Got It.
  if (wish.received) {
    wish.previousWishlistIds = [
      ...new Set([
        ...(wish.previousWishlistIds || []),
        wishlistId
      ])
    ];
  }

  // Don't leave an unreceived wish without any wishlist.
  if (!wish.received && wish.wishlistIds.length === 0) {
    wishezData = previous;

    showMessage(
      "Last Wishlist",
      "This wish isn't received and has no other " +
      "wishlist. Choose Delete Permanently if " +
      "you want to delete it."
    );
    return;
  }

  if (!saveWishezData()) {
    wishezData = previous;
    return;
  }

  closeModal();
  openWishlist(activeWishlistId);
  renderWishlists();
}

function confirmPermanentWishDeletion(id) {
  const wish = wishezData.wishes.find(
    item => item.id === id
  );

  if (!wish) return;

  confirmAction(
    "🗑️ Delete Permanently?",
    'Permanently delete "' + wish.name +
    '" from ALL wishlists, including I Got It!? ' +
    "This cannot be undone.",
    () => {
      const previous = structuredClone(wishezData);

      wishezData.wishes = wishezData.wishes.filter(
        item => item.id !== id
      );

      if (!saveWishezData()) {
        wishezData = previous;
        return;
      }

      closeModal();
      openWishlist(activeWishlistId);
      renderWishlists();
    }
  );
}



/* ==========================================
   WISHEZ — EDIT EXISTING WISHES
========================================== */

function showEditWishForm(id) {
  const wish = wishezData.wishes.find(
    item => item.id === id
  );

  if (!wish) return;

  const photoGroup = document.createElement("div");
  photoGroup.className = "form-group";

  const photoLabel = document.createElement("label");
  photoLabel.textContent = "Replace Product Photo (Optional)";

  const photoInput = document.createElement("input");
  photoInput.type = "file";
  photoInput.accept = "image/*";

  const preview = document.createElement("img");
  preview.src = wish.photo;
  preview.alt = "Current product photo";
  preview.style.width = "110px";
  preview.style.maxHeight = "110px";
  preview.style.objectFit = "contain";
  preview.style.display = wish.photo ? "block" : "none";
  preview.style.marginBottom = "10px";

  photoGroup.append(photoLabel, preview, photoInput);

  const warning = document.createElement("p");
  warning.className = "safety-reminder";
  warning.textContent =
    "For your safety, please DO NOT enter your home address, " +
    "phone number, email address, or other personal information " +
    "anywhere in your wishlist. Check screenshots for private details, too.";

  const name = createWishFormField("Item Name *", wish.name);
  const price = createWishFormField(
    "Estimated Price",
    wish.price,
    "number"
  );
  const store = createWishFormField("Store", wish.store);
  const description = createWishFormField(
    "Why I Want It",
    wish.description,
    "textarea"
  );
  const link = createWishFormField(
    "Product Link",
    wish.link,
    "url"
  );

  
const wishlistSelector = createWishlistSelector(
  wish.wishlistIds || []
);


  price.input.min = "0";
  price.input.step = "0.01";

  openModal(
    "✏️ Edit Wish",
    container => {

container.append(
  photoGroup,
  warning,
  name.group,
  price.group,
  store.group,
  description.group,
  link.group,
  wishlistSelector.container
);

    },
    [
      {
        label: "Cancel",
        action: () => showWishDetails(id)
      },
      {
        label: "💜 Save Changes",
        primary: true,
        action: async () => {
          const newName = name.input.value.trim();

          
const selectedWishlistIds =
  wishlistSelector.getSelectedIds();


if (selectedWishlistIds.length === 0 && !wish.received) {
  showMessage(
    "Choose a Wishlist",
    "A wish that hasn't been received must belong " +
    "to at least one wishlist."
  );
  return;
}



          if (!newName) {
            name.input.focus();
            return;
          }

          const newLink = link.input.value.trim();

          if (newLink) {
            try {
              const parsed = new URL(newLink);

              if (!["http:", "https:"].includes(parsed.protocol)) {
                throw new Error("Invalid protocol");
              }
            } catch {
              showMessage(
                "Invalid Link",
                "Please enter a complete http:// or https:// link."
              );
              return;
            }
          }

          const selectedPhoto = photoInput.files?.[0];
          let newPhoto = wish.photo;

          if (selectedPhoto) {
            if (!selectedPhoto.type.startsWith("image/")) {
              showMessage(
                "Invalid Photo",
                "Please select an image file."
              );
              return;
            }

            try {
              newPhoto = await compressWishImage(selectedPhoto);
            } catch {
              showMessage(
                "Photo Error",
                "That photo couldn't be processed."
              );
              return;
            }
          }

          const previous = structuredClone(wishezData);

          
wish.name = newName;
wish.wishlistIds = selectedWishlistIds;
wish.photo = newPhoto;

          wish.price = price.input.value.trim();
          wish.store = store.input.value.trim();
          wish.description = description.input.value.trim();
          wish.link = newLink;

          if (!saveWishezData()) {
            wishezData = previous;
            return;
          }

          closeModal();
          openWishlist(activeWishlistId);
          showWishDetails(id);
        }
      }
    ]
  );
}


/* ==========================================
   WISHEZ — MULTIPLE WISHLIST SELECTION
========================================== */

function createWishlistSelector(selectedIds = []) {
  const container = document.createElement("div");
  container.className = "form-group wishlist-selector";

  const heading = document.createElement("label");
  heading.textContent = "📋 Add to Wishlists *";

  const hint = document.createElement("p");
  hint.textContent = "Choose one or more wishlists.";

  container.append(heading, hint);

  const checkboxes = [];

  for (const wishlist of wishezData.wishlists) {
    const row = document.createElement("label");
    row.className = "wishlist-checkbox-row";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = wishlist.id;
    checkbox.checked = selectedIds.includes(wishlist.id);

    const text = document.createElement("span");
    text.textContent = wishlist.name;

    row.append(checkbox, text);
    container.appendChild(row);
    checkboxes.push(checkbox);
  }

  return {
    container,
    getSelectedIds() {
      return checkboxes
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);
    }
  };
}


/* ==========================================
   WISHEZ — ORGANIZE MODE
========================================== */

let organizingWishlists = false;
let organizingWishes = false;

const organizeWishlistsButton =
  document.getElementById("organizeWishlistsButton");

const organizeWishesButton =
  document.getElementById("organizeWishesButton");

const createWishlistButton =
  document.getElementById("createWishlistButton");

const addWishButton =
  document.getElementById("addWishButton");

// Preserve the existing rendering functions.
const normalRenderWishlists = renderWishlists;
const normalRenderWishCards = renderWishCards;

function saveOrganizedData(previous) {
  if (!saveWishezData()) {
    wishezData = previous;
    return false;
  }

  return true;
}

/* ==========================================
   DRAGGABLE ROW HELPER
========================================== */

function makeOrganizeRow(label, id) {
  const row = document.createElement("div");
  row.className = "organize-row";
  row.dataset.id = id;

  const text = document.createElement("span");
  text.className = "organize-row-label";
  text.textContent = label;

  const handle = document.createElement("button");
  handle.type = "button";
  handle.className = "organize-handle";
  handle.textContent = "☰";
  handle.setAttribute(
    "aria-label",
    "Drag to rearrange " + label
  );

  row.append(text, handle);

  return row;
}

/* ==========================================
   POINTER-BASED DRAGGING
   Works with mouse and touchscreens
========================================== */

function enableOrganizeDragging(container, onReorder) {
  let active = null;

  container.addEventListener("pointerdown", event => {
    const handle = event.target.closest(".organize-handle");
    if (!handle || !container.contains(handle)) return;

    const row = handle.closest(".organize-row");
    if (!row) return;

    event.preventDefault();

    active = {
      row,
      handle,
      startY: event.clientY,
      moved: false
    };

    handle.setPointerCapture(event.pointerId);
    row.classList.add("dragging");
  });

  container.addEventListener("pointermove", event => {
    if (!active) return;

    const delta = Math.abs(event.clientY - active.startY);

    if (delta > 5) {
      active.moved = true;
    }

    if (!active.moved) return;

    const rows = [
      ...container.querySelectorAll(".organize-row")
    ];

    for (const target of rows) {
      if (target === active.row) continue;

      const rect = target.getBoundingClientRect();
      const midpoint = rect.top + rect.height / 2;

      if (
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom
      ) {
        if (event.clientY < midpoint) {
          container.insertBefore(active.row, target);
        } else {
          container.insertBefore(
            active.row,
            target.nextSibling
          );
        }
        break;
      }
    }
  });

  function finishDragging() {
    if (!active) return;

    active.row.classList.remove("dragging");

    const moved = active.moved;
    active = null;

    if (moved) {
      const ids = [
        ...container.querySelectorAll(".organize-row")
      ].map(row => row.dataset.id);

      onReorder(ids);
    }
  }

  container.addEventListener("pointerup", finishDragging);
  container.addEventListener("pointercancel", finishDragging);
}

/* ==========================================
   ORGANIZE WISHLISTS
========================================== */

function renderOrganizeWishlists() {
  wishlistGrid.replaceChildren();

  // I Got It! remains fixed at the beginning.
  const received = document.createElement("div");
  received.className = "organize-row locked-row";
  received.textContent = "🎉 I Got It! 🔒";
  wishlistGrid.appendChild(received);

  const movable = document.createElement("div");
  movable.className = "organize-list";

  for (const wishlist of wishezData.wishlists) {
    movable.appendChild(
      makeOrganizeRow(wishlist.name, wishlist.id)
    );
  }

  wishlistGrid.appendChild(movable);

  enableOrganizeDragging(movable, ids => {
    const previous = structuredClone(wishezData);

    wishezData.wishlists.sort(
      (a, b) => ids.indexOf(a.id) - ids.indexOf(b.id)
    );

    if (!saveOrganizedData(previous)) {
      renderOrganizeWishlists();
    }
  });
}

/* ==========================================
   ORGANIZE WISHES
========================================== */

function renderOrganizeWishes() {
  wishGrid.replaceChildren();

  const movable = document.createElement("div");
  movable.className = "organize-list";

  
const visibleWishes = getOrderedWishes();


  for (const wish of visibleWishes) {
    movable.appendChild(
      makeOrganizeRow(wish.name, wish.id)
    );
  }

  wishGrid.appendChild(movable);

  enableOrganizeDragging(movable, ids => {
    const previous = structuredClone(wishezData);

    // Save this wishlist's order separately.
    if (!wishezData.wishOrders) {
      wishezData.wishOrders = {};
    }

    wishezData.wishOrders[activeWishlistId] = ids;

    if (!saveOrganizedData(previous)) {
      renderOrganizeWishes();
    }
  });
}

/* ==========================================
   APPLY SAVED WISH ORDER
========================================== */

function getOrderedWishes() {
  const visibleWishes = activeWishlistId === "received"
    ? wishezData.wishes.filter(wish => wish.received)
    : wishezData.wishes.filter(wish =>
        wish.wishlistIds?.includes(activeWishlistId)
      );

  const order = wishezData.wishOrders?.[activeWishlistId] || [];

  return visibleWishes.sort((a, b) => {
    const aIndex = order.indexOf(a.id);
    const bIndex = order.indexOf(b.id);

    if (aIndex === -1 && bIndex === -1) return 0;
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;

    return aIndex - bIndex;
  });
}

/* ==========================================
   OVERRIDE RENDERING FOR ORGANIZE MODE
========================================== */

renderWishlists = function() {
  if (organizingWishlists) {
    renderOrganizeWishlists();
  } else {
    normalRenderWishlists();
  }
};



renderWishCards = function() {
  if (organizingWishes) {
    renderOrganizeWishes();
    return;
  }

  normalRenderWishCards();
};



  
/* ==========================================
   ORGANIZE BUTTONS
========================================== */

organizeWishlistsButton.addEventListener("click", () => {
  organizingWishlists = !organizingWishlists;

  organizeWishlistsButton.textContent =
    organizingWishlists ? "✓ Done" : "☰ Organize";

  organizeWishlistsButton.classList.toggle(
    "organizing",
    organizingWishlists
  );

  createWishlistButton.classList.toggle(
    "hidden",
    organizingWishlists
  );

  renderWishlists();
});

organizeWishesButton.addEventListener("click", () => {
  organizingWishes = !organizingWishes;

  organizeWishesButton.textContent =
    organizingWishes ? "✓ Done" : "☰ Organize";

  organizeWishesButton.classList.toggle(
    "organizing",
    organizingWishes
  );

  addWishButton.classList.toggle(
    "hidden",
    organizingWishes
  );

  renderWishCards();
});


/* ==========================================
   WISHEZ — SETTINGS PLACEHOLDERS
========================================== */


function showBirthdaySettings() {
  const birthday = wishezData.birthday || {};

  openModal(
    "🎂 Birthday Preferences",
    container => {
      const description = document.createElement("p");
      description.textContent =
        "Choose your birthday month and day. Wishez will use " +
        "your birthday month to personalize your theme!";

      const monthLabel = document.createElement("label");
      monthLabel.textContent = "Birthday Month";

      const monthSelect = document.createElement("select");
      monthSelect.id = "birthdayMonth";

      const months = [
        "January", "February", "March", "April",
        "May", "June", "July", "August",
        "September", "October", "November", "December"
      ];

      const blankMonth = document.createElement("option");
      blankMonth.value = "";
      blankMonth.textContent = "Choose a month";
      monthSelect.appendChild(blankMonth);

      months.forEach((month, index) => {
        const option = document.createElement("option");
        option.value = String(index + 1);
        option.textContent = month;
        monthSelect.appendChild(option);
      });

      monthSelect.value = birthday.month || "";

      const dayLabel = document.createElement("label");
      dayLabel.textContent = "Birthday Day";

      const daySelect = document.createElement("select");
      daySelect.id = "birthdayDay";

      for (let day = 1; day <= 31; day++) {
        const option = document.createElement("option");
        option.value = String(day);
        option.textContent = day;
        daySelect.appendChild(option);
      }

      daySelect.value = birthday.day || "1";

      const monthGroup = document.createElement("div");
      monthGroup.className = "form-group";
      monthGroup.append(monthLabel, monthSelect);

      const dayGroup = document.createElement("div");
      dayGroup.className = "form-group";
      dayGroup.append(dayLabel, daySelect);

      container.append(description, monthGroup, dayGroup);
    },
    [
      {
        label: "Cancel",
        action: showWishezSettings
      },
      {
        label: "💜 Save Birthday",
        primary: true,
        action: () => {
          const month = Number(
            document.getElementById("birthdayMonth").value
          );

          const day = Number(
            document.getElementById("birthdayDay").value
          );

          if (!month || !day) {
            showMessage(
              "Birthday Required",
              "Please choose your birthday month and day."
            );
            return;
          }

          const validDate = new Date(2024, month - 1, day);

          if (
            validDate.getMonth() !== month - 1 ||
            validDate.getDate() !== day
          ) {
            showMessage(
              "Invalid Birthday",
              "Please choose a valid month and day."
            );
            return;
          }

          const previous = structuredClone(wishezData);

          wishezData.birthday = { month, day };

          if (!saveWishezData()) {
            wishezData = previous;
            return;
          }

          showMessage(
            "🎂 Birthday Saved!",
            "Your birthday preferences have been saved!"
          );

          applyBirthdayTheme();
        }
      }
    ]
  );
}



/* ==========================================
   WISHEZ — BACKUP & RESTORE
========================================== */

function backupWishez() {
  const backup = {
    app: "ESSAzLife Wishez",
    version: 1,
    createdAt: new Date().toISOString(),
    data: structuredClone(wishezData)
  };

  const blob = new Blob(
    [JSON.stringify(backup, null, 2)],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  const date = new Date().toISOString().slice(0, 10);

  link.href = url;
  link.download = `ESSAzLife-Wishez-Backup-${date}.json`;

  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => URL.revokeObjectURL(url), 1000);

  showMessage(
    "💾 Backup Created!",
    "Your Wishez backup has been prepared for download. " +
    "Keep the file somewhere safe! It contains your " +
    "wishlists, photos, and preferences."
  );
}

function restoreWishez() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json,application/json";

  input.addEventListener("change", async () => {
    const file = input.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      showMessage(
        "Backup Too Large",
        "This backup is larger than 20 MB. " +
        "Please choose a smaller Wishez backup."
      );
      return;
    }

    let backup;

    try {
      backup = JSON.parse(await file.text());
    } catch {
      showMessage(
        "Invalid Backup",
        "Wishez couldn't read this file. " +
        "Please choose a valid JSON backup."
      );
      return;
    }

    if (
      backup?.app !== "ESSAzLife Wishez" ||
      backup.version !== 1 ||
      !backup.data ||
      !Array.isArray(backup.data.wishlists) ||
      !Array.isArray(backup.data.wishes)
    ) {
      showMessage(
        "Invalid Wishez Backup",
        "This file doesn't appear to be a supported " +
        "ESSAzLife Wishez backup."
      );
      return;
    }

    const restoredData = backup.data;

    // Check that the essential wishlist records are valid.
    const validWishlists = restoredData.wishlists.every(
      list =>
        list &&
        typeof list.id === "string" &&
        typeof list.name === "string"
    );

    const validWishes = restoredData.wishes.every(
      wish =>
        wish &&
        typeof wish.id === "string" &&
        typeof wish.name === "string" &&
        typeof wish.photo === "string" &&
        Array.isArray(wish.wishlistIds) &&
        typeof wish.received === "boolean"
    );

    if (!validWishlists || !validWishes) {
      showMessage(
        "Invalid Backup Data",
        "Some wishlist or wish records are missing " +
        "required information. Nothing was changed."
      );
      return;
    }

    const wishlistCount = restoredData.wishlists.length;
    const wishCount = restoredData.wishes.length;

    openModal(
      "⚠️ WARNING: Replace Wishez Data?",
      container => {
        const warning = document.createElement("p");
        warning.style.fontWeight = "bold";
        warning.textContent =
          "Restoring this backup will REPLACE ALL " +
          "current Wishez data for this account!";

        const details = document.createElement("p");
        details.textContent =
          `Selected backup contains ${wishlistCount} ` +
          `wishlists and ${wishCount} wishes.`;

        const explanation = document.createElement("p");
        explanation.textContent =
          "Your current wishlists, wishes, photos, " +
          "birthday preferences, and organization " +
          "settings will be overwritten. " +
          "This cannot be undone unless you have " +
          "another backup.";

        const reminder = document.createElement("p");
        reminder.textContent =
          "We recommend downloading a backup of " +
          "your current data before continuing.";

        container.append(
          warning,
          details,
          explanation,
          reminder
        );
      },
      [
        {
          label: "Cancel",
          action: showWishezSettings
        },
        {
          label: "⚠️ Replace Everything",
          primary: true,
          action: () => {
            const previous = structuredClone(wishezData);

            wishezData = structuredClone(restoredData);

            if (!saveWishezData()) {
              wishezData = previous;
              return;
            }

            // Exit any active organizing modes.
            organizingWishlists = false;
            organizingWishes = false;

            organizeWishlistsButton.textContent = "☰ Organize";
            organizeWishesButton.textContent = "☰ Organize";

            organizeWishlistsButton.classList.remove("organizing");
            organizeWishesButton.classList.remove("organizing");

            createWishlistButton.classList.remove("hidden");
            addWishButton.classList.remove("hidden");

            activeWishlistId = null;

            applyBirthdayTheme();
            showHome();

            showMessage(
              "🎉 Restore Complete!",
              "Your Wishez backup has been restored successfully!"
            );
          }
        }
      ]
    );
  });

  input.click();
}



/* ==========================================
   WISHEZ — BIRTHDAY THEME
========================================== */

function applyBirthdayTheme() {
  const birthday = wishezData.birthday;

  if (!birthday?.month) {
    applyWishezTheme();
    return;
  }

  const currentMonth = new Date().getMonth() + 1;
  const seasonalTheme = getSeasonalTheme();

  if (currentMonth !== birthday.month) {
    applyWishezTheme();
    return;
  }

  // No holiday theme is active.
  if (seasonalTheme === "regular") {
    applyWishezTheme("birthday");
    return;
  }

  // Use the saved preference if one exists.
  if (wishezData.birthdayThemeChoice) {
    applyWishezTheme(
      wishezData.birthdayThemeChoice === "birthday"
        ? "birthday"
        : seasonalTheme
    );
    return;
  }

  openModal(
    "🎂 Choose Your Theme!",
    "It's your birthday month! Would you like the " +
    "Birthday theme or the current seasonal theme?",
    [
      {
        label: "🎂 Birthday Theme",
        primary: true,
        action: () => saveBirthdayThemeChoice("birthday")
      },
      {
        label: "🎉 Seasonal Theme",
        action: () => saveBirthdayThemeChoice("seasonal")
      }
    ]
  );
}

function saveBirthdayThemeChoice(choice) {
  const previous = structuredClone(wishezData);

  wishezData.birthdayThemeChoice = choice;

  if (!saveWishezData()) {
    wishezData = previous;
    return;
  }

  closeModal();
  applyBirthdayTheme();
}

// Apply the saved birthday theme when Wishez loads.
applyBirthdayTheme();


/* ==========================================
   WISHEZ — CLOUD SHARING BUTTON
========================================== */

const shareWishlistButton =
  document.getElementById("shareWishlistButton");

function updateShareWishlistButton() {
  const mode = localStorage.getItem(
    "essazlifeWorldLoginMode"
  );

  const token =
    sessionStorage.getItem("essazlifeWorldCloudToken") ||
    localStorage.getItem("essazlifeWorldCloudToken");

  const canShare =
  canUseWishezCloud() &&
    activeWishlistId !== null &&
    activeWishlistId !== "received" &&
    wishezData.wishlists.some(
      list => list.id === activeWishlistId
    );

  shareWishlistButton.classList.toggle(
    "hidden",
    !canShare
  );
}

// Update visibility whenever a wishlist opens.
const originalWishezOpenForSharing = openWishlist;

openWishlist = function(id) {
  originalWishezOpenForSharing(id);
  updateShareWishlistButton();
};

// Hide the button when returning home.
const originalWishezShowHomeForSharing = showHome;

showHome = function() {
  originalWishezShowHomeForSharing();
  shareWishlistButton.classList.add("hidden");
};


/* ==========================================
   WISHEZ — PREPARE PUBLIC WISHLIST
========================================== */

function preparePublicWishlist(wishlistId) {
  const wishlist = wishezData.wishlists.find(
    list => list.id === wishlistId
  );

  if (!wishlist || wishlistId === "received") {
    return null;
  }

  const wishes = wishezData.wishes
    .filter(wish =>
      wish.wishlistIds?.includes(wishlistId)
    )
    .map(wish => ({
      name: wish.name,
      price: wish.price || "",
      store: wish.store || "",
      description: wish.description || "",
      link: wish.link || ""
    }));

  return {
    wishlistId: wishlist.id,
    name: wishlist.name,
    wishes
  };
}


/* ==========================================
   WISHEZ — PUBLISH WISHLIST
========================================== */

async function publishWishezWishlist(wishlistId) {
  const token =
    sessionStorage.getItem("essazlifeWorldCloudToken") ||
    localStorage.getItem("essazlifeWorldCloudToken");

  if (!token) {
    showMessage(
      "World Cloud Required",
      "Please sign into your World Cloud account to share wishlists."
    );
    return;
  }

  const publicWishlist = preparePublicWishlist(wishlistId);

  if (!publicWishlist) {
    showMessage("Oops!", "This wishlist couldn't be found.");
    return;
  }

  if (publicWishlist.wishes.length > 30) {
    showMessage(
      "Too Many Wishes",
      "You can currently share up to 30 wishes per wishlist."
    );
    return;
  }

  try {
    const response = await fetch(
      `${WISHEZ_CLOUD_URL}/wishez/publish`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(publicWishlist)
      }
    );

    const result = await response.json();

    if (!response.ok || !result.ok) {
      throw new Error(result.error || "Publishing failed.");
    }

    
markWishezPublished(wishlistId, result.shareId);

    return result.shareId;

  } catch (error) {
    showMessage(
      "Sharing Error",
      error.message || "Unable to publish this wishlist."
    );
    return null;
  }
}


/* ==========================================
   WISHEZ — CONFIRM BEFORE SHARING
========================================== */


function confirmWishezSharing() {
  const wishlist = wishezData.wishlists.find(
    list => list.id === activeWishlistId
  );

  if (!wishlist) {
    showMessage("Oops!", "Please open a wishlist first.");
    return;
  }

  openModal(
    "🎁 Share Your Wishlist?",
    container => {
      const message = document.createElement("p");
      message.textContent =
        `You're about to share "${wishlist.name}"!`;
      container.appendChild(message);

      const details = document.createElement("p");
      details.textContent =
        "Anyone with your link can see the wishlist name, " +
        "wish names, prices, stores, descriptions, and product links.";
      container.appendChild(details);

      const privacy = document.createElement("p");
      privacy.textContent =
        "🔒 Product photos stay private and won't appear on the shared page.";
      container.appendChild(privacy);

      const update = document.createElement("p");
      update.textContent =
        "Sharing again will update your existing public link.";
      container.appendChild(update);
    },
    [
      {
        label: "Cancel",
        action: closeModal
      },
      {
        label: "🎁 Share Wishlist!",
        primary: true,
        action: async () => {
          closeModal();

          const shareId = await publishWishezWishlist(wishlist.id);
          if (!shareId) return;

          const shareLink = new URL(
            `shared.html?id=${encodeURIComponent(shareId)}`,
            window.location.href
          ).href;

          openModal(
            "🎉 Wishlist Published!",
            container => {
              const message = document.createElement("p");
              message.textContent =
                "Your wishlist is ready to share!";
              container.appendChild(message);

              const linkInput = document.createElement("input");
              linkInput.type = "text";
              linkInput.value = shareLink;
              linkInput.readOnly = true;
              linkInput.style.width = "100%";
              linkInput.style.boxSizing = "border-box";
              container.appendChild(linkInput);
            },
            [
              {
                label: "Close",
                action: closeModal
              },
              {
                label: "📋 Copy Link",
                primary: true,
                action: async () => {
                  try {
                    await navigator.clipboard.writeText(shareLink);
                    showMessage(
                      "Copied!",
                      "Your wishlist link is on your clipboard! 🎁"
                    );
                  } catch {
                    showMessage(
                      "Copy Manually",
                      "Please select and copy the link from the text box."
                    );
                  }
                }
              }
            ]
          );
        }
      }
    ]
  );
}


/* ==========================================
   WISHEZ — SHARE BUTTON CLICK
========================================== */

shareWishlistButton.addEventListener("click", () => {
  if (!canUseWishezCloud()) {
    showMessage(
      "World Cloud Required",
      "Only World Cloud accounts can share wishlists."
    );
    return;
  }

  confirmWishezSharing();
});


/* ==========================================
   WISHEZ — DELETE PUBLISHED WISHLIST
========================================== */

async function deletePublishedWishezWishlist(wishlistId) {
  const token =
    sessionStorage.getItem("essazlifeWorldCloudToken") ||
    localStorage.getItem("essazlifeWorldCloudToken");

  if (!token) {
    return { ok: false, reason: "no-token" };
  }

  try {
    const response = await fetch(
      `${WISHEZ_CLOUD_URL}/wishez/delete`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ wishlistId })
      }
    );

    const result = await response.json();

    if (response.ok && result.ok) {
      return { ok: true };
    }

    if (response.status === 404) {
      return { ok: true, notPublished: true };
    }

    return {
      ok: false,
      reason: result.error || "Cloud deletion failed."
    };

  } catch (error) {
    return {
      ok: false,
      reason: "Unable to contact Cloudflare."
    };
  }
}


/* ==========================================
   WISHEZ — CLOUD DELETION CHECK
========================================== */

function canUseWishezCloud() {
  const mode = localStorage.getItem(
    "essazlifeWorldLoginMode"
  );

  const loggedIn = localStorage.getItem(
    "essazlifeWorldLoggedIn"
  ) === "true";

  const token =
    sessionStorage.getItem("essazlifeWorldCloudToken") ||
    localStorage.getItem("essazlifeWorldCloudToken");

  
return mode === "cloud" && loggedIn && Boolean(token);

}


/* ==========================================
   WISHEZ — PUBLISHED WISHLIST TRACKING
========================================== */

function getPublishedWishezKey(wishlistId) {
  return wishezStorageKey(
    "wishez_published_" + wishlistId
  );
}

function markWishezPublished(wishlistId, shareId) {
  localStorage.setItem(
    getPublishedWishezKey(wishlistId),
    shareId
  );
}

function getPublishedWishezId(wishlistId) {
  return localStorage.getItem(
    getPublishedWishezKey(wishlistId)
  );
}

function clearPublishedWishezId(wishlistId) {
  localStorage.removeItem(
    getPublishedWishezKey(wishlistId)
  );
}


/* ==========================================
   WISHEZ — CHECK CLOUD PUBLICATION STATUS
========================================== */

async function checkWishezPublishedStatus(wishlistId) {
  const token =
    sessionStorage.getItem("essazlifeWorldCloudToken") ||
    localStorage.getItem("essazlifeWorldCloudToken");

  if (!token) {
    return {
      ok: false,
      reason: "World Cloud authentication required."
    };
  }

  try {
    const response = await fetch(
      `${WISHEZ_CLOUD_URL}/wishez/status`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ wishlistId })
      }
    );

    const result = await response.json();

    if (!response.ok || !result.ok) {
      return {
        ok: false,
        reason: result.error || "Unable to check wishlist status."
      };
    }

    return {
      ok: true,
      published: result.published === true,
      shareId: result.shareId || null
    };

  } catch (error) {
    return {
      ok: false,
      reason: "Unable to contact Cloudflare."
    };
  }
}


/* ==========================================
   WISHEZ — DELETE WISHLIST BUTTON
========================================== */

document.getElementById("deleteWishlistButton")
  ?.addEventListener("click", () => {
    if (!activeWishlistId) return;

    const wishlist = wishezData.wishlists.find(
      item => item.id === activeWishlistId
    );

    if (!wishlist || wishlist.permanent === true) return;

    deleteWishlist(activeWishlistId);
  });

  
/* ==========================================
   WISHEZ — PROTECT RECEIVED COLLECTION
========================================== */

function updateDeleteWishlistButton() {
  const button = document.getElementById("deleteWishlistButton");

  if (!button) return;

  button.classList.toggle(
    "hidden",
    !activeWishlistId || activeWishlistId === "received"
  );
}

const originalOpenWishlistForDelete = openWishlist;

openWishlist = function (...args) {
  const result = originalOpenWishlistForDelete(...args);
  updateDeleteWishlistButton();
  return result;
};
