function buildBoard(size) {
    var board = [];
    for (var i = 0; i < size; i++) {
        board.push([]);
        for (var j = 0; j < size; j++) {
            var cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
                isLegit: false
            }
            board[i].push(cell);
        }
    }
    return board;
}

function localStore() {
    var mode;
    if (gLevel.mode === 0) mode = 'Easy';
    if (gLevel.mode === 1) mode = 'Medium';
    if (gLevel.mode === 2) mode = 'Hard';
    if (gLevel.mode === 3) mode = 'Manual';

    var prevBest = localStorage.getItem(mode);
    if (!prevBest) localStorage.setItem(mode, gGame.secsPassed)
    if (prevBest > gGame.secsPassed) {
        localStorage.setItem(mode, gGame.secsPassed);
    }
}

function cellNegsCount(board, idx, jdx) {
    var currCell = board[idx][jdx];
    for (var i = idx - 1; i <= idx + 1; i++) {

        for (var j = jdx - 1; j <= jdx + 1; j++) {
            if (i === idx && j === jdx ||
                i < 0 || j < 0 || i === board.length ||
                j === board[0].length)
                continue;
            if (board[i][j].isMine === true) {
                currCell.minesAroundCount++;
            }
        }
    }
}

function checkWin() {
    if (gGame.markedCount === gLevel.MINES &&
        gGame.shownCount === gLevel.SIZE * gLevel.SIZE - gLevel.MINES) {
        clearInterval(gSecInterval);
        gSecInterval = null;
        gGame.isOn = false;
        var smiley = document.querySelector('.smiley');
        smiley.innerHTML = '😎';
        localStore();

    }
}

function showMines(board) {
    var elCell;
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j].isMine === true &&
                board[i][j].isShown === false) toggleCell(i, j, bomb);
            if (board[i][j].isMine === true && gGame.manual === true ||
                board[i][j].isMine === true && gGame.undo === true) {

                elCell = document.querySelector(`.cell${i}-${j}`);
                elCell.classList.remove('safe');
                elCell.classList.add('bomb');
                toggleCell(i, j, '');
            }
        }
    }
}

function randomMines(board, numOfMines) {
    var i = 0;
    var elCell;
    while (i < numOfMines) {
        var ranRow = getRandomIndex(0, board.length - 1);
        var ranColl = getRandomIndex(0, board.length - 1);
        if (ranRow === gFirstclick[0] && ranColl === gFirstclick[1]) continue
        if (board[ranRow][ranColl].isMine === false) {
            board[ranRow][ranColl].isMine = true;
            elCell = document.querySelector(`.cell${ranRow}-${ranColl}`);
            elCell.classList.remove('safe');
            elCell.classList.add('bomb');
            i++;
        }
    }
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {

        for (var j = 0; j < board[0].length; j++) {
            cellNegsCount(board, i, j);
        }
    }
}

function getRandomIndex(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}