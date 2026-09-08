// browser loads html > browser loads js > open the dialog >
// user closes dialog > audio system loads > user clicks sound button
// find our dialog
const introDialog = document.getElementById("intro-dialog");
// find the close button
const introDialogCloseButton = document.getElementById("intro-dialog-close");
// show the found element in our browser console
// console.log(introDialog);

// init our synth
// changed this to poly synth
const synth = new Tone.PolySynth();
//is the user currently houlding down a key? (for mouse events)
let mouseButtonDown = false;


//introdialog.showModal();
//document.body.style.backgroundColor = "red";

////// Dialog
// show dialog on page load
introDialog.showModal();
// close dialog when user clicks
introDialogCloseButton.addEventListener("click", function closeIntroDialog() {
    introDialog.close();
});
// whenever dialog closes, initialise the audio system
introDialog.addEventListener("close", toneInit);

// we put the whole function inside the event listener instead as its only called there
//function closeIntroDialog(){

//}

////// Tone
// run to setup our audio system
async function toneInit() {
  await Tone.start();

  synth.connect(Tone.Destination);

  // Create one looping audio player for each block
  Object.entries(layerSettings).forEach(([id, file]) => {
    const volume = new Tone.Volume(-Infinity).toDestination();

    const player = new Tone.Player({
      url: file,
      loop: true
    }).connect(volume);

    audioPlayers[id] = player;
    audioVolumes[id] = volume;
  });

  // Wait for all audio files to load
  await Tone.loaded();

  audioReady = true;
  console.log("Audio is ready");
}

// Each block controls one different audio layer.
const layerSettings = {
  "block-1": "assets/audio/underwater-ambience.wav",
  "block-2": "assets/audio/bubbles-2.wav",
  "block-3": "assets/audio/bubbles-loop.mp3"
};
const target = document.getElementById("target");
// Start or stop the sound when a block enters or leaves the aquarium
function setLayerActive(id, active) {
  if (!audioReady) return;

  const player = audioPlayers[id];
  const volume = audioVolumes[id];

  if (!player || !volume) return;

  if (active) {
    if (player.state !== "started") {
      player.start();
    }

    volume.volume.rampTo(-8, 0.8);
  } else {
    volume.volume.rampTo(-Infinity, 0.8);

    setTimeout(() => {
      if (player.state === "started") {
        player.stop();
      }
    }, 800);
  }
}

const audioPlayers = {};
const audioVolumes = {};
let audioReady = false;


function dragstartHandler(ev) {
  // Add different types of drag data
  ev.dataTransfer.setData("text/plain", ev.target.innerText);
  ev.dataTransfer.setData("text/html", ev.target.outerHTML);
  ev.dataTransfer.setData(
    "text/uri-list",
    ev.target.ownerDocument.location.href,
  );
}

const draggableElements = document.querySelectorAll(".creature");

// Find the drop zone.
const dropZone = document.getElementById("target");

const draggableArea = document.querySelector(".draggable-area");

// Run when a block starts being dragged.
function dragStartHandler(event) {
  // Store the ID of the dragged block.
  event.dataTransfer.setData("text/plain", event.currentTarget.id);
  
  event.dataTransfer.effectAllowed = "move";
}

// Add the dragstart event to every block.
draggableElements.forEach(function (element) {
  element.addEventListener("dragstart", dragStartHandler);
});

// Allow blocks to be dropped inside the drop zone.
dropZone.addEventListener("dragover", function (event) {
  event.preventDefault();

  event.dataTransfer.dropEffect = "move";
});

// Move the block when it is dropped.
dropZone.addEventListener("drop", function (event) {
  event.preventDefault();

  // Read the ID stored during dragstart.
  const draggedElementId =
    event.dataTransfer.getData("text/plain");

  // Find the dragged block using its ID.
  const draggedElement =
    document.getElementById(draggedElementId);

// Move the block into the drop zone.
event.currentTarget.appendChild(draggedElement);

// The block is now inside the aquarium, so start its sound.
setLayerActive(draggedElementId, true);
});

// Allow blocks to be dragged back to the original area.
draggableArea.addEventListener("dragover", function (event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
});

draggableArea.addEventListener("drop", function (event) {
  event.preventDefault();

  const draggedElementId = event.dataTransfer.getData("text/plain");
  const draggedElement = document.getElementById(draggedElementId);

  if (!draggedElement) return;

  event.currentTarget.appendChild(draggedElement);

  // Stop the sound when the block leaves the aquarium.
  setLayerActive(draggedElementId, false);
});