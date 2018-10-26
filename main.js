var display;
var container;
var textInput;
var button;
var langList;

var progress;

var state = 0;

function compare(txt1, txt2) {
    txt1.replace(/\u00dc/g, "u");   // u00dc = Ü
    txt1.replace(/\u00fc/g, "u");   // u00fc = ü
    return txt1.toLowerCase() === txt2.toLowerCase();
}

var currentDeckIndex = 0
var review = 0

// Move to the left
function moveLeft() {
    state = 0;
    
    display.style.transition = "0.25s"
    display.style.left = (-container.clientWidth - 15) + "px";
}

// Move to the center
function moveCenter() {
    state = 1;

    display.style.transition = "0.25s"
    display.style.left = (container.clientWidth / 2) - (display.clientWidth / 2) - 30 + "px";
}

// Move to the right
function moveRight() {
    state = 2;

    display.style.transition = "0.25s"
    display.style.left = (container.clientWidth + 15) + "px";
}

// Jump to the left
function jumpLeft() {
    state = 0;

    display.style.transition = "0s"
    display.style.left = (-container.clientWidth - 15) + "px";
}

// Show front of card
function showFront() {
    display.style.transition = "0.35s"
    display.style.transform = "rotateY(0deg)";
}

// Show back of card
function showBack(correct) {
    display.style.transition = "0.35s"
    display.style.transform = "rotateY(180deg)";

    if (correct) {
        display.style.backgroundColor = "green";
    } else {
        display.style.backgroundColor = "red";
    }
}

// Lock input
function lockInput() {
    textInput.disabled = true;
    button.disabled = true;
}

// Unlock input
function unlockInput() {
    textInput.disabled = false;
    button.disabled = false;
    textInput.value = "";
    textInput.focus();
}

class Word {
    constructor(english, target) {
        this.english = english
        this.target = target
        this.streak = true
        this.flip = false
    }
}

// Card decks
var notUsed = []
var currentList = [null, null, null, null, null]
var used = []

window.onresize = function() {
    switch (state) {
        case 0:
            moveLeft();
            break;
        case 1:
            moveCenter();
            break;
        case 2:
            moveRight();
            break;
    }
}

function checkNext() {
    if (!currentList[currentDeckIndex].flip) {
        let userInput = textInput.value;

        if (compare(userInput, currentList[currentDeckIndex].target)) {
            showBack(true);

            if (currentList[currentDeckIndex].streak) {
                currentList[currentDeckIndex].flip = true;
            } else {
                currentList[currentDeckIndex].streak = true;
            }

            window.setTimeout(function() {
                moveRight();
            }, 1250);
        } else {
            showBack(false);

            currentList[currentDeckIndex].streak = false;

            window.setTimeout(function() {
                moveLeft();
            }, 1250);
        }
    } else {
        let userInput = textInput.value;

        if (compare(userInput, currentList[currentDeckIndex].english)) {
            showBack(true);

            if (currentList[currentDeckIndex].streak) {
                used.push(currentList[currentDeckIndex]);
                currentList[currentDeckIndex] = null;
            } else {
                currentList[currentDeckIndex].streak = true;
            }

            window.setTimeout(function() {
                moveRight();
            }, 1250);
        } else {
            showBack(false);

            currentList[currentDeckIndex].streak = false;

            window.setTimeout(function() {
                moveLeft();
            }, 1250);
        }
    }

    lockInput();
    textInput.value = back.innerHTML;

    currentDeckIndex = (currentDeckIndex + 1) % currentList.length;

    window.setTimeout(function() {
        setNext();
    }, 1500);
}

function setNext() {
    showFront();
    jumpLeft();

    display.style.backgroundColor = "#1C86EE";

    if (currentList[currentDeckIndex] === null) {
        if ((5 <= review && 0 < used.length) || notUsed.length === 0) {
            used[0].flip = false;
            currentList[currentDeckIndex] = used[0];
            used.splice(0, 1);
            review = 0;
        } else {
            currentList[currentDeckIndex] = notUsed[0];
            notUsed.splice(0, 1);
            review += 1;
        }
    }

    if (currentList[currentDeckIndex].flip) {
        front.innerHTML = currentList[currentDeckIndex].target;
        back.innerHTML = currentList[currentDeckIndex].english;
    } else {
        front.innerHTML = currentList[currentDeckIndex].english;
        back.innerHTML = currentList[currentDeckIndex].target;
    }

    window.setTimeout(function() {
        moveCenter();
        unlockInput();
    }, 200);

    progress.innerHTML = "Progress: " + used.length;
}

window.onload = function() {
    display = document.getElementById("flipper");               // Card container
    container = document.getElementById("card_container");
    button = document.getElementById("continue");
    textInput = document.getElementById("textInput");

    progress = document.getElementById("progress");

    textInput.addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            checkNext();
        }
    });

    fetch("german.json").then(function(response) {
        response.json().then(function(data) {
            for (var i = 0; i < data.length; i++) {
                notUsed.push(new Word(data[i][0], data[i][1]));
            }
            setNext();
        });
    });
};
