var deck = null;

window.onload = function() {
    deck = new cardDeck;
    deck.loadValues();
    jumpLeft();
}

window.onresize = function() {
    if (deck.input.style.visibility === "visible") {
        window.setTimeout(function() {
            moveCenter();
        }, 200);
    }
}

class cardDeck {
    constructor() {
        this.type = 0;
        this.flip = false;
    }

    loadValues() {
        this.container = document.getElementById("testing_container");
        this.card = document.getElementById("flip-container");
        this.display = document.getElementById("flipper");
        this.front = document.getElementById("front");
        this.back = document.getElementById("back");
        this.input = document.getElementById("input_container");
        this.textInput = document.getElementById("textInput");
        this.button = document.getElementById("continue");

        this.prevButton = document.getElementById("prev");
        this.nextButton = document.getElementById("next");

        var tempCopy = this;
        this.textInput.addEventListener("keydown", function(e) {
            if (e.keyCode == 13) {
                tempCopy.reviewNext();
            }
        });
    }

    loadDeck(list) {
        this.list = list;
        this.index = 0;

        this.textInput.placeholder = this.list[this.index][1];

        moveLeft();
        var tempCopy = this;
        window.setTimeout(function() {
            showFront();
            tempCopy.front.innerHTML = tempCopy.list[tempCopy.index][0];
            tempCopy.back.innerHTML = tempCopy.list[tempCopy.index][1];
            moveCenter();
        }, 200);
    }

    prev() {
        moveLeft();

        this.index -= 1;
        var tempCopy = this;

        window.setTimeout(function() {
            showFront();
            jumpRight();
            tempCopy.front.innerHTML = tempCopy.list[tempCopy.index][0];
            tempCopy.back.innerHTML = tempCopy.list[tempCopy.index][1];
            window.setTimeout(function() {
                moveCenter();
            }, 100);
        }, 100);

        alert(this.index);
        if (this.index != 0) {
            this.prevButton.disabled = true;
        } else {
            this.prevButton.disabled = false;
        }
    }

    next() {
        moveRight();

        this.index += 1;
        var tempCopy = this;

        window.setTimeout(function() {
            showFront();
            jumpLeft();
            tempCopy.front.innerHTML = tempCopy.list[tempCopy.index][0];
            tempCopy.back.innerHTML = tempCopy.list[tempCopy.index][1];
            window.setTimeout(function() {
                moveCenter();
            }, 100);
        }, 100);
    }

    reviewNext() {
        showBack();
        lockInput();

        var correct = compare(this.textInput.value, this.list[this.index][1]);

        if (correct) {
            this.back.style.backgroundColor = "#006400";
        } else {
            this.back.style.backgroundColor = "#B22222";
        }

        var tempCopy = this;

        window.setTimeout(function() {
            if (correct) {
                moveRight();
                if (tempCopy.list[tempCopy.index][2] >= 3) {
                    tempCopy.list.splice(tempCopy.index, 1);
                } else {
                    tempCopy.list[tempCopy.index][2] += 1;
                    if (tempCopy.list[tempCopy.index][2] == 2) {
                        let temp = tempCopy.list[tempCopy.index][0];
                        tempCopy.list[tempCopy.index][0] = tempCopy.list[tempCopy.index][1];
                        tempCopy.list[tempCopy.index][1] = temp;
                    }
                }
            } else {
                moveLeft();
            }

            // If there are still levels in the card
            if (tempCopy.list.length !== 0) {
                window.setTimeout(function() {
                    jumpLeft();
                    showFront();
                    tempCopy.index = Math.floor(Math.random() * (tempCopy.list.length));
                    tempCopy.front.innerHTML = tempCopy.list[tempCopy.index][0];
                    tempCopy.back.innerHTML = tempCopy.list[tempCopy.index][1];
                    window.setTimeout(function() {
                        moveCenter();
                        unlockInput();
                        tempCopy.textInput.focus();
                        tempCopy.back.style.backgroundColor = "#1C86EE";
                        if (tempCopy.list[tempCopy.index][2] == 0 || tempCopy.list[tempCopy.index][2] == 2) {
                            tempCopy.textInput.placeholder = tempCopy.list[tempCopy.index][1];
                        } else {
                            tempCopy.textInput.placeholder = "";
                        }
                    }, 200);
                }, 200);
            } else {
                // Win here
                window.setTimeout(function() {
                    jumpLeft();
                    showFront();
                }, 200);
                unlockInput();
                hideInput();
            }
        }, 1000);
    }
}

function compare(txt1, txt2) {
    return txt1 === txt2;
}

function learn() {
    deck.loadDeck([["Deutschland", "Germany", 0], ["Hallo", "hello", 0]]);
    showInput();
    deck.textInput.focus();
}

function study() {
    deck.loadDeck([["Deutschland", "Germany", 0], ["Hallo", "hello", 0]]);
    showInput();
}

function review() {
    deck.review();
}

function prev() {
    deck.prev();
}

function next() {
    deck.next();
}

function reviewNext() {
    deck.reviewNext();
}

function moveLeft() {
    deck.display.style.transition = "0.15s"
    deck.display.style.left = -deck.container.clientWidth + "px";
}

function moveCenter() {
    deck.display.style.transition = "0.15s"
    deck.display.style.left = (deck.container.clientWidth / 2) - (deck.card.clientWidth / 2) + "px";
}

function moveRight() {
    deck.display.style.transition = "0.15s"
    deck.display.style.left = (deck.container.clientWidth + 15) + "px";
}

function jumpLeft() {
    deck.display.style.transition = "0s"
    deck.display.style.left = -deck.container.clientWidth + "px";
}

function jumpRight() {
    deck.display.style.transition = "0s"
    deck.display.style.left = (deck.container.clientWidth + 15) + "px";
}

function showFront() {
    deck.display.style.transition = "0.25s"
    deck.display.style.transform = "rotateY(0deg)";
    deck.flip = true;
}

function showBack() {
    deck.display.style.transition = "0.25s"
    deck.display.style.transform = "rotateY(180deg)";
    deck.flip = false;
}

function flip() {
    if (deck.flip) {
        showBack();
    } else {
        showFront();
    }
}

function showInput() {
    deck.input.style.visibility = "visible";
}

function hideInput() {
    deck.input.style.visibility = "hidden";
}

function lockInput() {
    deck.textInput.disabled = true;
    deck.button.disabled = true;
}

function unlockInput() {
    deck.textInput.disabled = false;
    deck.button.disabled = false;
    deck.textInput.value = "";
}