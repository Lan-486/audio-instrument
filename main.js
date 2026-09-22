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

// Create a bubble when the user presses the space bar.
document.addEventListener("keydown", function (event) {
  // Only create bubbles after the welcome dialog has closed.
  if (introDialog.open) return;
  if (event.code !== "Space" || event.repeat) return;

  // Stop the space bar from scrolling the page.
  event.preventDefault();

// Choose a random number of bubbles, from 3 to 6.
const bubbleCount = Math.floor(Math.random() * 4) + 3;

// Create the bubbles one after another.
for (let i = 0; i < bubbleCount; i++) {
  setTimeout(function () {
    createBubble();
  }, i * 120);
}
});

function createBubble() {
  const bubble = document.createElement("span");
  bubble.classList.add("bubble");

 
  // Use Math.random() to choose the bubble's size and position.
  const size = Math.random() * 25 + 10;

  const drift = 0;
  const duration = Math.random() * 3 + 3;
  const horizontalOffset = Math.random() * 160 - 80;

  bubble.style.width = `${size}px`;
  bubble.style.height = `${size}px`;
  bubble.style.left = `calc(50% + ${horizontalOffset}px)`;
  bubble.style.marginLeft = `${-size / 2}px`;
  bubble.style.setProperty("--drift", `${drift}px`);
  bubble.style.animationDuration = `${duration}s`;

  bubblesContainer.appendChild(bubble);

  // Remove the bubble when its animation ends.
  bubble.addEventListener("animationend", function () {
    bubble.remove();
  });
}