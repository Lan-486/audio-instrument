const bubbleSound = new Tone.Player(
  "assets/audio/bubbles-2.wav"
).toDestination();

let audioReady = false;

// Find the welcome dialog and its close button.
const introDialog = document.getElementById("intro-dialog");
const introDialogCloseButton = document.getElementById("intro-dialog-close");

// Show the welcome dialog when the page loads.
introDialog.showModal();

// Close the dialog when the user clicks the button.
introDialogCloseButton.addEventListener(
  "click",
  async function () {
    await Tone.start();
    await Tone.loaded();

    audioReady = true;
    introDialog.close();
  }
);

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
  // Play one sound when the Space interaction begins.
  if (audioReady && bubbleSound.loaded) {
  bubbleSound.start();
 }

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
// Drag a UI button into the aquarium to create its creature image.
(() => {
    const tank = document.querySelector(".aquarium");
    const buttons = document.querySelectorAll(".creature-option");

   const creatures = {
    turtle: {
        src: "./images/turtle.png",
        alt: "Sea turtle",
        speed: 22
    },

    jellyfish: {
        src: "./images/jellyfish.PNG",
        alt: "Jellyfish",
        speed: 12
    },

    tropicalfish: {
        src: "./images/tropicalfish.png",
        alt: "Tropical fish",
        speed: 30
    },

    mantaray: {
        src: "./images/mantaray.png",
        alt: "Manta ray",
        speed: 18
    }
};

    // Each creature controls one looping sound.
const creatureSounds = {
    turtle: new Audio("./assets/audio/underwater-ambience.wav"),

    jellyfish: new Audio("./assets/audio/jellyloop.wav"),

    tropicalfish: new Audio("./assets/audio/tropical-fish.wav"),

    mantaray: new Audio("./assets/audio/manta-ray.mp3")
};

Object.values(creatureSounds).forEach((sound) => {
    sound.loop = true;
    sound.volume = 0.5;
    sound.preload = "auto";
});

function playCreatureSound(type) {
    const sound = creatureSounds[type];
    if (!sound) return;

    sound.play().catch((error) => {
        console.error("Could not play creature sound:", error);
    });
}

function stopCreatureSound(type) {
    const sound = creatureSounds[type];
    if (!sound) return;

    sound.pause();
    sound.currentTime = 0;
}

// Prepare audio during the user's OK click.
document.querySelector("#intro-dialog-close")
    .addEventListener("click", () => {
        Object.values(creatureSounds).forEach((sound) => {
            sound.volume = 0;

            sound.play().then(() => {
                sound.pause();
                sound.currentTime = 0;
                sound.volume = 0.5;
            }).catch((error) => {
                sound.volume = 0.5;
                console.error("Could not prepare audio:", error);
            });
        });
    });

    const swimmers = [];
    const addedTypes = new Set();

    let draggingType = null;

    buttons.forEach((button) => {
        button.addEventListener("dragstart", (event) => {
            draggingType = button.dataset.creature;

            event.dataTransfer.setData("text/plain", draggingType);
            event.dataTransfer.effectAllowed = "copy";
        });

        button.addEventListener("dragend", () => {
            draggingType = null;
            tank.classList.remove("drag-over");
        });
    });

    tank.addEventListener("dragover", (event) => {
        if (!draggingType) return;

        // Allow dropping into the aquarium.
        event.preventDefault();
        event.dataTransfer.dropEffect = "copy";
        tank.classList.add("drag-over");
    });

    tank.addEventListener("dragleave", (event) => {
        if (!tank.contains(event.relatedTarget)) {
            tank.classList.remove("drag-over");
        }
    });

    tank.addEventListener("drop", (event) => {
        event.preventDefault();
        tank.classList.remove("drag-over");

        const type = draggingType;
        draggingType = null;

        if (!creatures[type] || addedTypes.has(type)) return;

        const settings = creatures[type];
        const button = document.querySelector(
            `.creature-option[data-creature="${type}"]`
        );

        // Store where the mouse was released.
        const bounds = tank.getBoundingClientRect();
        const dropX = event.clientX - bounds.left - tank.clientLeft;
        const dropY = event.clientY - bounds.top - tank.clientTop;

        addedTypes.add(type);
        button.disabled = true;
        button.draggable = false;
        // Start this creature's loop when dropped into the aquarium.
        playCreatureSound(type);

        // Create the actual artwork only after dropping.
        const image = document.createElement("img");

        image.className = `swimming-creature ${type}`;
        image.alt = settings.alt;
        image.draggable = true;
        image.style.visibility = "hidden";

        image.addEventListener("load", () => {
            const swimmer = {
                image,
                speed: settings.speed,
                x: dropX - image.offsetWidth / 2,
                y: dropY - image.offsetHeight / 2,
                targetX: 0,
                targetY: 0
            };

            keepInside(swimmer);
            chooseTarget(swimmer);
            draw(swimmer);

            image.style.visibility = "visible";
            swimmers.push(swimmer);

           // Pause swimming and highlight the creature while dragging.
image.addEventListener("dragstart", (event) => {
    swimmer.dragging = true;
    image.classList.add("is-dragging");

    event.dataTransfer.setData(
        "application/x-aquarium-creature",
        type
    );

    event.dataTransfer.effectAllowed = "move";
});

// Resume swimming and remove the highlight.
image.addEventListener("dragend", () => {
    swimmer.dragging = false;
    image.classList.remove("is-dragging");

    document.querySelector(".creature-picker")
        .classList.remove("drag-over");
});

        }, { once: true });

        image.addEventListener("error", () => {
            image.remove();
            addedTypes.delete(type);
            button.disabled = false;
            button.draggable = true;

            console.error("Could not load:", settings.src);
        }, { once: true });

        tank.appendChild(image);
        image.src = settings.src;
    });

    function limits(swimmer) {
        return {
            x: Math.max(0, tank.clientWidth - swimmer.image.offsetWidth),
            y: Math.max(0, tank.clientHeight - swimmer.image.offsetHeight)
        };
    }

    function keepInside(swimmer) {
        const max = limits(swimmer);

        swimmer.x = Math.max(0, Math.min(swimmer.x, max.x));
        swimmer.y = Math.max(0, Math.min(swimmer.y, max.y));
    }

    function chooseTarget(swimmer) {
        const max = limits(swimmer);

        swimmer.targetX = Math.random() * max.x;
        swimmer.targetY = Math.random() * max.y;
    }

    function draw(swimmer) {
        swimmer.image.style.transform =
            `translate(${swimmer.x}px, ${swimmer.y}px)`;
    }

    let lastTime = null;

    function animate(time) {
        const seconds = lastTime === null
            ? 0
            : Math.min((time - lastTime) / 1000, 0.05);

        lastTime = time;

        swimmers.forEach((swimmer) => {
    if (swimmer.dragging) return;

    const dx = swimmer.targetX - swimmer.x;
            const dy = swimmer.targetY - swimmer.y;
            const distance = Math.hypot(dx, dy);
            const step = swimmer.speed * seconds;

            if (distance <= step) {
                swimmer.x = swimmer.targetX;
                swimmer.y = swimmer.targetY;
                chooseTarget(swimmer);
            } else {
                swimmer.x += (dx / distance) * step;
                swimmer.y += (dy / distance) * step;
            }

            keepInside(swimmer);
            draw(swimmer);
        });

        requestAnimationFrame(animate);
    }

    window.addEventListener("resize", () => {
        swimmers.forEach((swimmer) => {
            keepInside(swimmer);
            chooseTarget(swimmer);
        });
    });
// Drag a creature back to the bottom bar to remove it.
const picker = document.querySelector(".creature-picker");

picker.addEventListener("dragover", (event) => {
    const isAquariumCreature = Array.from(
        event.dataTransfer.types
    ).includes("application/x-aquarium-creature");

    if (!isAquariumCreature) return;

    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    picker.classList.add("drag-over");
});

picker.addEventListener("dragleave", (event) => {
    if (!picker.contains(event.relatedTarget)) {
        picker.classList.remove("drag-over");
    }
});

picker.addEventListener("drop", (event) => {
    const type = event.dataTransfer.getData(
        "application/x-aquarium-creature"
    );

    if (!type) return;

    event.preventDefault();
    picker.classList.remove("drag-over");

    const index = swimmers.findIndex((swimmer) => {
        return swimmer.image.classList.contains(type);
    });

    if (index === -1) return;

    // Remove the image and its swimming animation.
    swimmers[index].image.remove();
    swimmers.splice(index, 1);
    addedTypes.delete(type);
    // Stop this creature's loop when removed.
    stopCreatureSound(type);

    // Restore the corresponding button.
    const button = document.querySelector(
        `.creature-option[data-creature="${type}"]`
    );

    button.disabled = false;
    button.draggable = true;
});
    requestAnimationFrame(animate);
})();