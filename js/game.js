var gBoard;
const bomb = '💣';
var gFirstclick;
var gSetTimeOut;
var gSecInterval;
var gPrevClicks = []
var gManualMinesCount;
var gLevel = {
    SIZE: 4,
    MINES: 2,
    mode: 0
};
var gGame = {
    isOn: false,
    isMinesSet: false,
    isHint: false,
    lifesCount: 3,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    undo: false,
    manual: false,
    safeClicks: 3,
    isTimeOut: false,
};

function initGame() {
    var elTime = document.querySelector('.timer');
    if (gGame.manual === true) {
        showMines(gBoard)
        gGame.isOn = true;
        gGame.manual = false;
        setMinesNegsCount(gBoard);
        elTime.innerHTML = gGame.secsPassed;
        gSecInterval = setInterval(secCount, 1000);
        gPrevClicks = []
    } else {
        gBoard = buildBoard(gLevel.SIZE);
        gGame = {
            isOn: false,
            isMinesSet: false,
            isHint: false,
            lifesCount: 3,
            shownCount: 0,
            markedCount: 0,
            secsPassed: 0,
            undo: false,
            manual: false,
            safeClicks: 3,
            isTimeOut: false
        };
        gPrevClicks = []
        renderBoard(gBoard);
        printBottomMenu();
        clearTimeout(gSetTimeOut);
        gSetTimeOut = null;
        clearInterval(gSecInterval);
        gSecInterval;
        var elTime = document.querySelector('.timer');

        elTime.innerHTML = gGame.secsPassed;
        gSecInterval = setInterval(secCount, 1000);
        gGame.shownCount = 0;
        var elSafeClickCount = document.querySelector('.safeClicks');

        elSafeClickCount.innerHTML = `Safe Clicks:${gGame.safeClicks}`;
        if (gLevel.mode === 0) {
            var prevBest = localStorage.getItem('Easy');
            if (prevBest === null) prevBest = 0;
            var elBest = document.querySelector('.best');
            elBest.innerHTML = `Best Time:${prevBest}`;
        }

        gGame.isOn = true;
    }
}

function expandShown(board, idx, jdx) {
    for (var i = idx - 1; i <= idx + 1; i++) {
        for (var j = jdx - 1; j <= jdx + 1; j++) {
            if (i < 0 || j < 0 || i === board.length ||
                j === board[0].length)
                continue;
            if (i === idx && j === jdx) continue;
            if (gBoard[i][j].isMarked === true) continue;
            if (gGame.isHint === false && board[i][j].isShown === true && gGame.undo === false) continue;
            if (gGame.isHint === true && board[i][j].isLegit === true) continue;
            if (board[i][j].isMine === true && gGame.isHint === false) continue;
            if (board[idx][jdx].minesAroundCount > 0 && gGame.isHint === false) continue;
            if (board[i][j].isShown === false && gGame.undo === true) continue;

            toggleCell(i, j, board[i][j].minesAroundCount);
            if (gGame.isHint === false && gGame.undo === false) {
                gGame.shownCount++;
                gBoard[i][j].isLegit = true;
            }
            if (gGame.undo === true) {
                gGame.shownCount--;
                gBoard[i][j].isLegit = false;
            }
            if (board[idx][jdx].minesAroundCount === 0 && gGame.isHint === false) {
                expandShown(board, i, j)
            }
        }
    }

}



function cellClicked(elCell, i, j) {
    if (gGame.isTimeOut === true) return;
    if (!gGame.isOn && gGame.manual === false) return;
    if (gBoard[i][j].isShown === true && gGame.undo === false) return;
    if (gBoard[i][j].isMarked === true) return;

    if (!gGame.isMinesSet) {
        gFirstclick = [i, j];
        gGame.isMinesSet = true;
        randomMines(gBoard, gLevel.MINES);
        setMinesNegsCount(gBoard);
    }
    if (gGame.manual) {
        gBoard[i][j].isMine = true;
        gLevel.MINES++;
        elCell.innerHTML = bomb;
        elCell.classList.add('bomb');

    } else {
        toggleCell(i, j, gBoard[i][j].minesAroundCount);

        if (gBoard[i][j].minesAroundCount === 0 &&
            gBoard[i][j].isMine === false ||
            gGame.isHint === true) {
            expandShown(gBoard, i, j);
            if (gGame.isHint === true) {
                gGame.isTimeOut = true;
                gSetTimeOut = setTimeout(() => {
                    expandShown(gBoard, i, j);
                    toggleCell(i, j, gBoard[i][j].minesAroundCount);
                    gGame.isHint = false;
                    gGame.isTimeOut = false;
                }, 1000);
            }
        }

        if (gBoard[i][j].isMine === true && gGame.isHint === false) {
            if (gGame.lifesCount > 0) {
                removeLife();
                toggleCell(i, j);
                gGame.lifesCount--;
            } else {
                showMines(gBoard);
                gGame.isOn = false;
                elCell.innerHTML = bomb;
                clearInterval(gSecInterval);
                gSecInterval = null;
                var smiley = document.querySelector('.smiley');
                smiley.innerHTML = '😵';
                gPrevClicks.push('game over')
            }
            // var audio = new Audio('sound/boom.aiff');
            // audio.play();
           
        }
        var curClick = {
            idx: i,
            jdx: j
        }
        if (gGame.isHint === true)(curClick = 'hint');
        if (gGame.undo === false) {
            gPrevClicks.push(curClick);
        }
        if (gGame.undo === true) {
            gGame.shownCount--;
            gBoard[i][j].isLegit = false;
        } else if (gGame.isHint === false && gGame.undo === false && gBoard[i][j].isMine === false) {
            gGame.shownCount++;
            gBoard[i][j].isLegit = true;
        }
        checkWin();
    }
}