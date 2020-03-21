function easy() {
    gLevel.SIZE = 4;
    gLevel.MINES = 2;
    gLevel.mode = 0;
    var elMode = document.querySelector('.mode');
    elMode.innerHTML = 'Current Mode:Easy';
    var prevBest = localStorage.getItem('Easy');
    if (prevBest === null) prevBest = 0;
    var elBest = document.querySelector('.best');
    elBest.innerHTML = `Best Time:${prevBest}`;

    initGame();
}

function medium() {
    gLevel.SIZE = 8;
    gLevel.MINES = 12;
    gLevel.mode = 1;
    var elMode = document.querySelector('.mode');
    elMode.innerHTML = 'Current Mode:Medium';
    var prevBest = localStorage.getItem('Medium');
    if (prevBest === null) prevBest = 0;
    var elBest = document.querySelector('.best');
    elBest.innerHTML = `Best Time:${prevBest}`;
    initGame();
}

function hard() {
    gLevel.SIZE = 12;
    gLevel.MINES = 30;
    gLevel.mode = 2;
    var elMode = document.querySelector('.mode');
    elMode.innerHTML = 'Current Mode:Hard';
    var prevBest = localStorage.getItem('Hard');
    if (prevBest === null) prevBest = 0
    var elBest = document.querySelector('.best');
    elBest.innerHTML = `Best Time:${prevBest}`;
    initGame();
}

function manual() {
    initGame();
    gGame.isOn = false;
    gGame.manual = true;
    gLevel.MINES = 0;
    gLevel.mode = 3;
    clearInterval(gSecInterval);
    gSecInterval = null;
    var elMode = document.querySelector('.mode');
    elMode.innerHTML = 'Current Mode:Manual';
    var prevBest = localStorage.getItem('Manual');
    if (prevBest === null) prevBest = 0;
    var elBest = document.querySelector('.best');
    elBest.innerHTML = `Best Time:${prevBest}`;

}