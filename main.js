// browser loads html > browser loads js > open the dialog >
// user closes dialog > audio system loads > user clicks sound button
// find our dialog
const introDialog = document.getElementById("intro-dialog");
// find the close button
const introDialogCloseButton = document.getElementById("intro-dialog-close");
// show the found element in our browser console
// console.log(introDialog);
// find our test button
const testButton = document.getElementById('test-button');
// find my key button for testing
const key = document.getElementById("key-test");
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
function toneInit(){
    synth.connect(Tone.Destination);
}

// do something when this button is clicked
//testButton.addEventListener("click", playNote);

// function that runs when button is clicked
function playNote(){
    //play a note for a duration
    synth.triggerAttackRelease("c4", "8n");
}

function playDataNote(e){
    console.log(e);
    let buttonClicked = e.target;
    console.log(buttonClicked)
    let note = buttonClicked.dataset.note;
    console.log(note);
    synth.triggerAttackRelease(note, "8n");
}

function startNote(e){
    // find key that was pressed
    let keyPressed = e.target;
    // find the note associated with the key
    let note = keyPressed.dataset.note;
    synth.triggerAttack(note);
}

function endNote(e){
    let keyPressed = e.target;
    let note = keyPressed.dataset.note;
    synth.triggerRelease(note);
}

key.addEventListener("mousedown", startNote);
key.addEventListener("mouseup", endNote);
key.addEventListener("mouseleave", endNote);


//key.addEventListener("click", playDataNote);
testButton.addEventListener("click", playDataNote);

const target = document.getElementById("target");


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
});