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
const urlString = window.location.href;
const url = new URL(urlString);
var mediaId = url.searchParams.get("MediaId");
var branchName = url.searchParams.get("BranchName");
const mediaRef = ref(database, "media");

get(mediaRef)
  .then((snapshot) => {
    if (snapshot.exists()) {
      const mediaData = snapshot.val();
      const mediaKey = Object.keys(mediaData).find(
        (key) =>
          mediaData[key].BranchName === branchName &&
          mediaData[key].MediaID === mediaId
      );
      if (!mediaKey) {
        alert("Media not found for the selected branch.");
        return;
      }

      const mediaEntry = mediaData[mediaKey];
      const currentQuantity = mediaEntry.MediaQuantity;

      if (currentQuantity > 0) {
        const newQuantity = currentQuantity - 1;

        const mediaQuantityRef = ref(
          database,
          `media/${mediaKey}/MediaQuantity`
        );
        set(mediaQuantityRef, newQuantity)
          .then(() => {
            alert(
              `Pickup successful! New quantity of Media ID "${mediaId}" at "${branchName}": ${newQuantity}`
            );
            var redirectUrl = urlString.split("/stockUpdate")[0];
            redirectUrl += "/viewMediaDetailsPage.html?" + "MediaId=" + mediaId;
            window.location.replace(redirectUrl); // redirects to the media details
          })
          .catch((error) => {
            console.error("Error updating quantity:", error);
            alert("Failed to update the stock.");
          });
      } else {
        alert(
          `Media ID "${mediaID}" is out of stock at the branch "${branchName}".`
        );
      }
    } else {
      console.error("No media data found.");
      alert("No media data found.");
    }
  })
  .catch((error) => {
    console.error("Error accessing media data:", error);
  });
