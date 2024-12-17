// // couldnt have in the same file with the config so this is for the forms and extra

function popupSearch() {
  document.getElementById("overlay").style.display = "block";
  document.getElementById("popupDialog").style.display = "block";
}

function closeSearch() {
  document.getElementById("overlay").style.display = "none";
  document.getElementById("popupDialog").style.display = "none";
}

function popupBorrow() {
  document.getElementById("overlayBorrow").style.display = "block";
  document.getElementById("popupDialogBorrow").style.display = "block";
}

function closeBorrow() {
  event.preventDefault(); //to not refresh everything
  document.getElementById("overlayBorrow").style.display = "none";
  document.getElementById("popupDialogBorrow").style.display = "none";
}

document.getElementById("read-more").addEventListener("click", function () {
  var description = document.getElementById("description");
  var button = document.getElementById("read-more");

  if (description.style.maxHeight === "none") {
    // collapse the paragraph back
    description.style.maxHeight = "300px";
    button.innerText = "Read more";
  } else {
    // expand the paragraph to show full text
    description.style.maxHeight = "none";
    button.innerText = "Read less";
  }
});

// for the pickup/delivery
//this is to just click it off
document.getElementById("pickup-button").addEventListener("click", () => {
  const deliveryAddress = document.getElementById("deliveryAddress");
  deliveryAddress.style.display = "none";
});

document.getElementById("delivery-button").addEventListener("click", () => {
  const deliveryAddress = document.getElementById("deliveryAddress");
  deliveryAddress.style.display = "block";
});
