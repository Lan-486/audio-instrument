// browser loads html > brower loads js > open the dialog > user closes the dialog > 
//  audio system loads > user clicks the sound button
// find our dialog

// find our dialog close button
const introDialog = document.getElementById("intro-dialog");
const introDialogCloseButton =
  document.getElementById("intro-dialog-close");

//show the found element in our beowser console
//console.log(introDialog);
// find out test button
const testButton = document.getElementById("test-button");
// init our synth
const synth= new Tone.Synth().toDestination();

////// dialog
introDialog.showModal();
introDialogCloseButton.addEventListener("click", function () {
  introDialog.close();
});
// whenever dialog closes, initialise the audio system
introDialog.addEventListener("close", toneInit);

// we put the whole function inside the event listener instead
// as it's only called there
// function closeIntroDialog() {
//   introDialog.close();
// }

/////// Tone

// run to setup our audio system
function toneInit() {
  synth.connect(Tone.Destination);
}
//do something when the button is clicked
testButton.addEventListener("click", playnote);

    //fuction to run when the button is clicked
    function playnote() {
        //play a note for a duration
        synth.triggerAttackRelease("C4", "8n");
    }
    