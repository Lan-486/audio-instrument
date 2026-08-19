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

const p1 = document.getElementById("p1");
p1.addEventListener("dragstart", dragstartHandler);
// Cancel dragover so that drop can fire
target.addEventListener("dragover", (ev) => {
  ev.preventDefault();
});

target.addEventListener("drop", (ev) => {
  ev.preventDefault();
  const data = ev.dataTransfer.getData("text/plain");
  ev.target.append(data);
});