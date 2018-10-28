/*
Class
*/

class Word {
    constructor(english, target) {
        this.english = english
        this.target = target
        this.streak = true
        this.flip = false
    }
}


/*
Variables
*/

var back = document.getElementById("back");

var display = document.getElementById("flipper");
var container = document.getElementById("card_container");
var textInput = document.getElementById("textInput");
var progress = document.getElementById("progress");

var state = 0;
var currentDeckIndex = 0
var review = 0

var notUsed = [];
var currentList = [null, null, null, null, null];
var used = [];


/*
Setup
*/
for (item of getList()) {
    notUsed.push(new Word(item[0], item[1]));
}

setNext();

textInput.addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        checkNext();
    }
});


/*
Progress functions
*/

function compare(txt1, txt2) {
    return txt1.toLowerCase() === txt2.toLowerCase();
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

    back.style.backgroundColor = "#1C86EE";

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


/*
Move card
!!! Make these first !!!
*/

// Jump to the left
function jumpLeft() {
    state = 0;

    display.style.transition = "0s"
    display.style.left = (-container.clientWidth - 15) + "px";
}

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
    display.style.left = (container.clientWidth / 2) - (display.clientWidth / 2) + "px";
}

// Move to the right
function moveRight() {
    state = 2;

    display.style.transition = "0.25s"
    display.style.left = (container.clientWidth + 15) + "px";
}

// Show front of card
function showFront() {
    display.style.transition = "0.35s"
    display.style.transform = "rotateY(0deg)";
    display.style.webkitTransform = "rotateY(0deg)";
}

// Show back of card
function showBack(correct, hint = false) {
    display.style.transition = "0.35s"
    display.style.transform = "rotateY(180deg)";
    display.style.webkitTransform = "rotateY(180deg)";

    if (hint) {
        back.style.backgroundColor = "#1C86EE";
        currentList[currentDeckIndex].streak = false;
    } else if (correct) {
        back.style.backgroundColor = "green";
    } else {
        back.style.backgroundColor = "red";
    }
}

// Lock input
function lockInput() {
    textInput.disabled = true;
}

// Unlock input
function unlockInput() {
    textInput.disabled = false;
    textInput.value = "";
    textInput.focus();
}

function addLetter(letter) {
    textInput.value += letter;
    showFront();
}


/*
Don't need
*/

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
