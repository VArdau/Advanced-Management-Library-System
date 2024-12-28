import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  set,
} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCmcT5fG8Nkny7jlFEN9gn3rRZHxyII_as",
  authDomain: "amllibrary.firebaseapp.com",
  databaseURL:
    "https://amllibrary-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "amllibrary",
  storageBucket: "amllibrary.firbase.storage.app",
  messagingSenderId: "612435739543",
  appId: "1:612435739543:web:f22564c7487cc71de47ad2",
  measurementId: "G-T52D62JS9E",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// global variables for MediaID and MediaName
let selectedMediaID = null;
let selectedMediaName = null;
let selectedBranchName = null;

//export { selectedMediaID, selectedBranchName };

const librariesInfo = document.getElementById("libraries-info");
const cityInput = document.getElementById("availability-two");
const townsList = document.getElementById("towns-list");
const mediaNameElement = document.getElementById("media-name");

const branchSelect = document.getElementById("branch-select");
const pickupOptions = document.getElementById("pickup-options");
const pickupFormMediaIdField = document.getElementById(
  "pickupFormMediaIdField"
);
const pickupFormMediaNameField = document.getElementById(
  "pickupFormMediaNameField"
);
const pickupFormBranchNameField = document.getElementById(
  "pickupFormBranchNameField"
);
const deliveryFormMediaIdField = document.getElementById(
  "deliveryFormMediaIdField"
);
const deliveryFormMediaNameField = document.getElementById(
  "deliveryFormMediaNameField"
);
const deliveryFormBranchNameField = document.getElementById(
  "deliveryFormBranchNameField"
);

function initializeMediaValues() {
  const mediaRef = ref(database, "media");

  const urlString = window.location.href;
  const url = new URL(urlString);
  var mediaId = url.searchParams.get("MediaId");
  var firstMedia = null; // to get a specific media
  get(mediaRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        var mediaArray = snapshot.val();
        if (mediaArray && mediaArray.length > 0) {
          if (!mediaId) {
            firstMedia = mediaArray[2];
          } else {
            var mediaIdToInt = Number(mediaId);
            firstMedia = mediaArray[mediaIdToInt - 1]; //media id is 3 but the index is 2, the index starts from zero, but the media ids start from 1
          }

          selectedMediaID = firstMedia.MediaID || "No ID available";
          selectedMediaName = firstMedia.MediaName || "No Name available";
          pickupFormMediaIdField.value = selectedMediaID;
          pickupFormMediaNameField.value = selectedMediaName;
          deliveryFormMediaIdField.value = selectedMediaID;
          deliveryFormMediaNameField.value = selectedMediaName;

          const coverURL = firstMedia.CoverURL || "";

          mediaNameElement.textContent = selectedMediaName;

          const coverUrlElement = document.getElementById("cover-url");
          coverUrlElement.style.backgroundImage = `url('${coverURL}')`;
          coverUrlElement.style.backgroundSize = "cover";
          coverUrlElement.style.backgroundPosition = "center";

          console.log("Media initialized:", selectedMediaName, selectedMediaID);
        }
      } else {
        console.warn("No media data available.");
      }
    })
    .catch((error) => {
      console.error("Error initializing media values:", error);
    });
}

function loadCities() {
  const mediaRef = ref(database, "media");

  get(mediaRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const mediaArray = snapshot.val();
        const cities = new Set();

        for (const media of mediaArray) {
          if (media && media.BranchCity) {
            cities.add(media.BranchCity);
          }
        }

        cities.forEach((city) => {
          const option = document.createElement("option");
          option.value = city;
          townsList.appendChild(option);
        });
      }
    })
    .catch((error) => {
      console.error("Error fetching city data:", error);
    });
}

function searchByCity() {
  const cityName = cityInput.value.trim().toLowerCase(); // Convert input to lowercase
  librariesInfo.innerHTML = "";

  if (!cityName) {
    librariesInfo.innerHTML = `<p>Please enter a city name.</p>`;
    return;
  }

  const mediaRef = ref(database, "media");

  get(mediaRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const mediaArray = snapshot.val();
        const filteredMedia = mediaArray.filter(
          (media) =>
            media &&
            media.BranchCity.toLowerCase() === cityName && // Convert database value to lowercase
            media.MediaName === selectedMediaName
        );

        if (filteredMedia.length > 0) {
          filteredMedia.forEach((media) => {
            const libraryBox = document.createElement("div");
            libraryBox.className = "library-box";

            let stockClass = "";
            let stockText = "";

            if (media.MediaQuantity === 0) {
              stockClass = "low-stock";
              stockText = "Out of stock";
            } else if (media.MediaQuantity <= 3) {
              stockClass = "low-stock";
              stockText = `${media.MediaQuantity} (Low stock)`;
            } else if (media.MediaQuantity <= 5) {
              stockClass = "medium-stock";
              stockText = `${media.MediaQuantity} (Medium stock)`;
            } else {
              stockClass = "high-stock";
              stockText = `${media.MediaQuantity} (High stock)`;
            }

            libraryBox.innerHTML = `
                    <h4>Branch Name: ${media.BranchName}</h4>
                    <p class="${stockClass}"><strong>Stock:</strong> ${stockText}</p>
                  `;

            librariesInfo.appendChild(libraryBox);
          });
        } else {
          librariesInfo.innerHTML = `<p>No media found for "${selectedMediaName}" in ${cityName}.</p>`;
        }
      } else {
        librariesInfo.innerHTML = `<p>No media data available in the database.</p>`;
      }
    })
    .catch((error) => {
      console.error("Error fetching media data:", error);
    });
}

function loadBranches(cityName) {
  const mediaRef = ref(database, "media");

  get(mediaRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const mediaArray = snapshot.val();
        const filteredBranches = mediaArray.filter(
          (media) =>
            media &&
            media.BranchCity.toLowerCase() === cityName.toLowerCase() && // Convert both values to lowercase
            media.MediaName === selectedMediaName &&
            media.MediaQuantity > 0
        );

        branchSelect.innerHTML = "";

        if (filteredBranches.length > 0) {
          filteredBranches.forEach((branch) => {
            const option = document.createElement("option");
            option.value = branch.BranchName;
            option.textContent = branch.BranchName;
            branchSelect.appendChild(option);
          });

          pickupOptions.style.display = "block";
        } else {
          pickupOptions.style.display = "none";
          console.warn(
            `No branches found in ${cityName} with the selected media.`
          );
        }
      } else {
        console.error("No media data available in the database.");
      }
    })
    .catch((error) => {
      console.error("Error fetching branch data:", error);
    });
}

document.getElementById("search-button").addEventListener("click", () => {
  const cityName = cityInput.value.trim();
  if (cityName) {
    loadBranches(cityName.toLowerCase()); // Pass lowercase city name
  } else {
    console.warn("Please enter a city name to search for branches.");
  }
});

document.getElementById("selected-branch").addEventListener("click", () => {
  const selectedBranch = branchSelect.value;
  selectedBranchName = selectedBranch;

  const selectedBranchLabel = document.getElementById("selected-branch-label");
  const selectedBranchLabelContainer = document.getElementById(
    "selected-branch-label-container"
  );

  const selectedBranchBorrowLabel = document.getElementById(
    "selected-branch-borrow-label"
  );

  if (selectedBranch) {
    selectedBranchLabel.textContent = selectedBranch;
    selectedBranchBorrowLabel.textContent = selectedBranch;
    selectedBranchBorrowLabel.style.color = "green";

    selectedBranchLabelContainer.style.display = "block";

    const popupDialog = document.getElementById("popupDialog");
    popupDialog.style.display = "none";
    const overlay = document.getElementById("overlay");
    overlay.style.display = "none";

    pickupFormBranchNameField.value = selectedBranchName;
    deliveryFormBranchNameField.value = selectedBranchName;

    submitPickupButton.disabled = false;
    submitDeliveryButton.disabled = false;
  } else {
    console.warn("No branch selected.");
    selectedBranchBorrowLabel.textContent = "Haven't selected a branch yet";
    selectedBranchBorrowLabel.style.color = "red";

    submitPickupFormButton.disabled = true;
    submitDeliveryButton.disabled = true;
  }
});

const submitPickupButton = document.getElementById("pickup-button");
const submitDeliveryButton = document.getElementById("delivery-button");

document.getElementById("pickupForm").addEventListener("submit", (event) => {
  const selectedBranch = pickupFormBranchNameField.value;
  if (!selectedBranch) {
    event.preventDefault();
    alert("Please select a branch before submitting the form.");
  }
});

document.getElementById("deliveryForm").addEventListener("submit", (event) => {
  const selectedBranch = pickupFormBranchNameField.value;
  if (!selectedBranch) {
    event.preventDefault();
    alert("Please select a branch before submitting the form.");
  }
});

// initialize the app
loadCities();
initializeMediaValues();

document
  .getElementById("search-button")
  .addEventListener("click", searchByCity);
