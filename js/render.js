
function printBottomMenu() {

    var strHtml = '<table border="1px"><tbody><tr>';
    var elMenu = document.querySelector('.bottomMenu');
    var leftClick = `onclick="hintClicked(this)"`;
    for (var i = 0; i < 3; i++) {
        var className = 'menuCell life';
        strHtml += '<td ' + ' class="' + className + '">' + '' + '</td>';
    }
    strHtml += '<td onclick="initGame()"' + ' class="' + 'menuCell smiley' + '">' + '' + '🙂</td>';
    for (var j = 0; j < 3; j++) {
        className = 'menuCell hint';
        strHtml += '<td ' + leftClick + ' class="' + className + '">' + '' + '</td>';
    }
    strHtml += '</tr>';
    strHtml += '</tbody></table>';
    elMenu.innerHTML = strHtml;
}

function removeLife() {
    var elLife = document.querySelector('.life');
    elLife.innerHTML = '';
    elLife.classList.remove('life');
    elLife.classList.add('lifeUsed');
}

function secCount() {
    gGame.secsPassed += 1;
    var elTime = document.querySelector('.timer');
    elTime.innerHTML = gGame.secsPassed;
}

function toggleCell(i, j, value) {

    var elCell = document.querySelector(`.cell${i}-${j}`);
    if (gBoard[i][j].isShown === false && gGame.undo === false) {
        if (gBoard[i][j].isMine === true) {

            elCell.innerHTML = bomb;
            elCell.classList.remove('cell');
            elCell.classList.remove('safe');
            elCell.classList.add('shown');
            gBoard[i][j].isShown = true;
        } else {
            if (value === 0) {
                value = '';
            }
            elCell.innerHTML = value;
            elCell.classList.remove('cell');
            elCell.classList.remove('safe');
            elCell.classList.add('shown');
            gBoard[i][j].isShown = true;
        }
    } else {
        elCell.innerHTML = '';
        elCell.classList.remove('shown');
        elCell.classList.add('cell');
        elCell.classList.add('safe');
        if (elCell.classList.contains('bomb')) {
            elCell.classList.remove('safe');
            if (gGame.lifesCount > 0 && gGame.isHint === false&&gGame.manual===false) {
                elCell.classList.add('bombed')
                clearTimeout(gSetTimeOut);
                gSetTimeOut = null;
                gGame.isTimeOut = true;
                gSetTimeOut = setTimeout(() => {
                    elCell.classList.remove('bombed');
                    gGame.isTimeOut = false;
                }, 1000);
            }
        }
        gBoard[i][j].isShown = false;
    }

}

function renderBoard(board) {
    var strHtml = '<table border="1px"><tbody>';
    var elBoard = document.querySelector('.board')
    for (var i = 0; i < board.length; i++) {

        strHtml += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            var className = 'cell safe cell' + i + '-' + j;
            var leftClick = `onclick="cellClicked(this,${i},${j})"`;
            var rightClick = `oncontextmenu="cellMarked(this,${i},${j})"`;
            strHtml += '<td ' + leftClick + rightClick + ' class="' + className + '">' + ' ' + '</td>';
        }
        strHtml += '</tr>';
    }
    strHtml += '</tbody></table>';
    elBoard.innerHTML = strHtml;
}

function cellMarked(elCell, i, j) {

    if (gGame.isOn === false || gBoard[i][j].isShown === true) return;
    if (!gBoard[i][j].isMarked) {
        gBoard[i][j].isMarked = true;
        gGame.markedCount++;
        elCell.classList.remove('cell');
        elCell.classList.add('marked');
        checkWin(gBoard);
    } else {
        gBoard[i][j].isMarked = false;
        gGame.markedCount--;
        elCell.classList.remove('marked');
        elCell.classList.add('cell');
    }
}