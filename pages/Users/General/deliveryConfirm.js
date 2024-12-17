import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCmcT5fG8Nkny7jlFEN9gn3rRZHxyII_as",
  authDomain: "amllibrary.firebaseapp.com",
  databaseURL:
    "https://amllibrary-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "amllibrary",
  storageBucket: "amllibrary.firebasestorage.app",
  messagingSenderId: "612435739543",
  appId: "1:612435739543:web:f22564c7487cc71de47ad2",
  measurementId: "G-T52D62JS9E",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const urlString = window.location.href;
const url = new URL(urlString);
const mediaId = url.searchParams.get("mediaId");
const mediaName = url.searchParams.get("mediaName");
const userName = url.searchParams.get("userName");
const branchName = url.searchParams.get("branchName");
var dateToBorrow = "";
var dueDate = "";

const mn = document.getElementById("mediaName");
const bn = document.getElementById("mediaAddress");
const ad = document.getElementById("branchName");

settingValues();

function settingValues() {
  mn.innerHTML = mediaName;
  bn.innerHTML = branchName;
  ad.innerHTML = branchName;
}

const deliveryDateInput = document.getElementById("delivery-date");
const today = new Date();
const formattedDate = today.toISOString().split("T")[0];
deliveryDateInput.value = formattedDate;
deliveryDateInput.min = formattedDate;
dateToBorrow = deliveryDateInput.value;

var dateToBorrowDateTime = new Date(dateToBorrow);
var dueDateDateTime = dateToBorrowDateTime.setDate(
  dateToBorrowDateTime.getDate() + 14
);
var dueDate = new Date(dueDateDateTime).toISOString().split("T")[0];
const dueDateElement = document.getElementById("dueDate");
dueDateElement.innerHTML = dueDate;

document
  .getElementById("deliveryForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    var streetline1 = event.target.elements[1].value;
    var streetline2 = event.target.elements[2].value;
    var city = event.target.elements[3].value;
    var country = event.target.elements[4].value;
    var postcode = event.target.elements[5].value;

    console.log(branchName, mediaId);
    await addDoc(collection(db, "deliveryMedia"), {
      BorrowedDate: dateToBorrow,
      BranchName: branchName,
      DueDate: dueDate,
      MediaID: mediaId,
      MediaName: mediaName,
      StreetLine1: streetline1,
      StreetLine2: streetline2,
      City: city,
      Country: country,
      Postcode: postcode,
    });
    var redirectUrl = urlString.split("/deliveryConfirm")[0];
    redirectUrl +=
      "/stockUpdate.html?" + "MediaId=" + mediaId + "&BranchName=" + branchName;
    window.location.replace(redirectUrl);

    alert("You will shortly recieve an email on instuctions and details!");
  });

deliveryDateInput.addEventListener("change", (event) => {
  dateToBorrow = event.target.value;
  var dateToBorrowDateTime = new Date(dateToBorrow);
  var dueDateDateTime = dateToBorrowDateTime.setDate(
    dateToBorrowDateTime.getDate() + 14
  );
  dueDate = new Date(dueDateDateTime).toISOString().split("T")[0];
  document.getElementById("dueDate").innerText = dueDate;
});
