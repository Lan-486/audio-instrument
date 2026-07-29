// find out test button
const testbutton = document.getElementById("test-button");
// init our synth
const synth= new Tone.Synth().toDestination();

//do something when the button is clicked
testbutton.addEventListener("click", playnote);

    //fuction to run when the button is clicked
    function playnote() {
        //play a note for a duration
        synth.triggerAttackRelease('C4', '8n');
    }
    