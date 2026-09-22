// Find the welcome dialog and its close button.
const introDialog = document.getElementById("intro-dialog");
const introDialogCloseButton = document.getElementById("intro-dialog-close");

// Show the welcome dialog when the page loads.
introDialog.showModal();

// Close the dialog when the user clicks the button.
introDialogCloseButton.addEventListener("click", function () {
  introDialog.close();
});

const bubblesContainer = document.querySelector(".bubbles-container");

let spaceHeld = false;
let bubbleTimer;

// Keep creating bubbles while the user holds the space bar.
function createBubbleStream() {
  if (!spaceHeld) return;

  createBubble();

  // Randomise the delay before the next bubble appears.
  const nextDelay = Math.random() * 300 + 180;
  bubbleTimer = setTimeout(createBubbleStream, nextDelay);
}

document.addEventListener("keydown", function (event) {
  if (introDialog.open) return;
  if (event.code !== "Space" || spaceHeld) return;

  // Stop the space bar from scrolling the page.
  event.preventDefault();

  spaceHeld = true;
  createBubbleStream();
});

document.addEventListener("keyup", function (event) {
  if (event.code !== "Space") return;

  spaceHeld = false;
  clearTimeout(bubbleTimer);
});

// Stop the bubble stream if the user switches away from the browser window.
window.addEventListener("blur", function () {
  spaceHeld = false;
  clearTimeout(bubbleTimer);
});

function createBubble() {
  const bubble = document.createElement("span");
  bubble.classList.add("bubble");

  const aquariumWidth = bubblesContainer.clientWidth;

  // Use Math.random() to choose the bubble's size and position.
  const size = Math.random() * 25 + 10;
  const left = Math.random() * (aquariumWidth - size);
  const drift = Math.random() * 100 - 50;
  const duration = Math.random() * 3 + 3;

  bubble.style.width = `${size}px`;
  bubble.style.height = `${size}px`;
  bubble.style.left = `${left}px`;
  bubble.style.setProperty("--drift", `${drift}px`);
  bubble.style.animationDuration = `${duration}s`;

  bubblesContainer.appendChild(bubble);

  // Remove the bubble when its animation ends.
  bubble.addEventListener("animationend", function () {
    bubble.remove();
  });
}