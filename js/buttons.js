function hintClicked(elHint) {
    if (gGame.isOn === false || gGame.isTimeOut) return;
    if (elHint.classList.contains('hint')) {
        gGame.isHint = true;
        clearTimeout(gSetTimeOut);
        gSetTimeOut = null;
        elHint.classList.remove('hint');
        elHint.classList.add('hintUsed');
        elHint.innerHTML = '';
    } else return
}

function safeClick() {
    if (gGame.shownCount + gLevel.MINES === gLevel.SIZE * gLevel.SIZE) return;
    if (gGame.isTimeOut === true || gGame.safeClicks === 0) return;
    gGame.isTimeOut = true;

    var elSafeCells = document.querySelectorAll('.safe');
    var elSafeClickCount = document.querySelector('.safeClicks');
    var ranIdx = getRandomIndex(0, elSafeCells.length - 1);
    elSafeCells[ranIdx].classList.add('safeUsed');
    clearTimeout(gSetTimeOut);
    gSetTimeOut = null;
    gGame.safeClicks--;
    elSafeClickCount.innerHTML = `Safe Clicks:${gGame.safeClicks}`;

    gSetTimeOut = setTimeout(() => {
        elSafeCells[ranIdx].classList.remove('safeUsed');
        gGame.isTimeOut = false;
    }, 1000);
    gPrevClicks.push('safe')

}

function undo() {
    if (gPrevClicks.length < 1) return;
    var prevClick = gPrevClicks[gPrevClicks.length - 1];
    gGame.undo = true;
    if (prevClick === 'hint') {
        var elHint = document.querySelector('.hintUsed');

        elHint.classList.remove('hintUsed');
        elHint.classList.add('hint');
    } else if (prevClick === 'safe') {
        var elSafeClickCount = document.querySelector('.safeClicks');
        gGame.safeClicks++;
        elSafeClickCount.innerHTML = `Safe Clicks:${gGame.safeClicks}`;
    } else if (gBoard[prevClick.idx][prevClick.jdx].isMine === true) {
        if (gGame.isOn === false) {
            var smiley = document.querySelector('.smiley');
            smiley.innerHTML = '🙂';
            showMines(gBoard);
            gGame.isOn = true;
        } else {
            var elLife = document.querySelector('.lifeUsed');
            elLife.innerHTML = '';
            elLife.classList.remove('lifeUsed');
            elLife.classList.add('life');
            gGame.lifesCount++;
        }
    } else {
        cellClicked('', prevClick.idx, prevClick.jdx);
    }
    gGame.undo = false;
    gPrevClicks.pop();
}