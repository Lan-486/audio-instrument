let audioReady = false;

const bubbleSound = new Tone.Player(
  "assets/audio/bubbles-2.wav"
).toDestination();

// Find the welcome dialog and its close button.
const introDialog = document.getElementById("intro-dialog");
const introDialogCloseButton = document.getElementById("intro-dialog-close");

// Show the welcome dialog when the page loads.
introDialog.showModal();

// Close the dialog when the user clicks the button.
introDialogCloseButton.addEventListener("click", async function () {
  await Tone.start();
  await Tone.loaded();

  audioReady = true;

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

  createBubble();
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

  // Play the bubble sound when the visual bubble is created.
if (audioReady && bubbleSound.loaded) {
  bubbleSound.start();
}
}