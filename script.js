let fields = [];
let currentPlayer = 'circle';
let isGameActive = true;
let scoreCircle = 0;
let scoreCross = 0;

function init() {
    fields = [
        null, null, null,
        null, null, null,
        null, null, null
    ];
    currentPlayer = 'circle';
    isGameActive = true;
    
    document.getElementById('indicator-circle').classList.remove('winner-highlight');
    document.getElementById('indicator-cross').classList.remove('winner-highlight');
    
    updateScoreDisplay();
    updateIndicators();
    render();
}

function render() {
    let html = '<div class="board-wrapper"><table class="game-board">';
    
    for (let i = 0; i < 3; i++) {
        html += '<tr>';
        for (let j = 0; j < 3; j++) {
            let index = i * 3 + j;
            let symbol = '';
            
            if (fields[index] === 'circle') {
                symbol = generateCircleSVG();
            } else if (fields[index] === 'cross') {
                symbol = generateCrossSVG();
            }
            
            html += `<td onclick="cellClicked(${index})">${symbol}</td>`;
        }
        html += '</tr>';
    }
    
    html += '</table>';
    
    html += `
        <svg id="winning-line-canvas" viewBox="0 0 100 100">
            <line class="winning-line h-line-0" x1="10" y1="16.66" x2="90" y2="16.66" />
            <line class="winning-line h-line-1" x1="10" y1="50" x2="90" y2="50" />
            <line class="winning-line h-line-2" x1="10" y1="83.33" x2="90" y2="83.33" />
            <line class="winning-line v-line-0" x1="16.66" y1="10" x2="16.66" y2="90" />
            <line class="winning-line v-line-1" x1="50" y1="10" x2="50" y2="90" />
            <line class="winning-line v-line-2" x1="83.33" y1="10" x2="83.33" y2="90" />
            <line class="winning-line d-line-0" x1="10" y1="10" x2="90" y2="90" />
            <line class="winning-line d-line-1" x1="90" y1="10" x2="10" y2="90" />
        </svg>
    `;

    html += `<div id="draw-message" style="display: none;">Unentschieden</div>`;

    html += '</div>'; 

    document.getElementById('concent').innerHTML = html;
}

function cellClicked(index) {
    if (!isGameActive || fields[index] !== null) {
        return;
    }
    
    fields[index] = currentPlayer;
    render();
    
    if (checkForWin()) {
        isGameActive = false;
        if (currentPlayer === 'circle') {
            scoreCircle++;
            document.getElementById('indicator-circle').classList.add('winner-highlight');
        } else {
            scoreCross++;
            document.getElementById('indicator-cross').classList.add('winner-highlight');
        }
        updateScoreDisplay();
        return;
    }
    
    if (checkForDraw()) {
        isGameActive = false;
        document.getElementById('draw-message').style.display = 'block';
        return;
    }
    
    currentPlayer = currentPlayer === 'circle' ? 'cross' : 'circle';
    updateIndicators();
}

function updateIndicators() {
    let circleIndicator = document.getElementById('indicator-circle');
    let crossIndicator = document.getElementById('indicator-cross');
    
    if (currentPlayer === 'circle') {
        circleIndicator.classList.add('active-player');
        crossIndicator.classList.remove('active-player');
    } else {
        crossIndicator.classList.add('active-player');
        circleIndicator.classList.remove('active-player');
    }
}

function updateScoreDisplay() {
    document.getElementById('score-circle-display').innerText = scoreCircle;
    document.getElementById('score-cross-display').innerText = scoreCross;
}

function checkForWin() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    
    for (let i = 0; i < winningCombinations.length; i++) {
        const combo = winningCombinations[i];
        const [a, b, c] = combo;
        
        if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
            drawWinningLine(combo, i);
            return true;
        }
    }
    return false;
}

function checkForDraw() {
    return fields.every(field => field !== null);
}

function drawWinningLine(winningCombo, comboIndex) {
    const winningLineClasses = [
        'h-line-0', 'h-line-1', 'h-line-2',
        'v-line-0', 'v-line-1', 'v-line-2',
        'd-line-0', 'd-line-1'
    ];
    
    const canvas = document.getElementById('winning-line-canvas');
    if (!canvas) return; 

    const lineElements = canvas.querySelectorAll('.winning-line');
    lineElements.forEach(line => line.style.display = 'none');

    const winningLineElement = canvas.querySelector('.' + winningLineClasses[comboIndex]);
    if (winningLineElement) {
        winningLineElement.style.display = 'block';
    }
}

function generateCircleSVG() {
    return `<svg class="cell-symbol-svg" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="35" stroke="#00B0EF" stroke-width="10" fill="none" />
    </svg>`;
}

function generateCrossSVG() {
    return `<svg class="cell-symbol-svg" viewBox="0 0 100 100">
        <line x1="20" y1="20" x2="80" y2="80" stroke="#FDB827" stroke-width="14" stroke-linecap="round" />
        <line x1="80" y1="20" x2="20" y2="80" stroke="#FDB827" stroke-width="14" stroke-linecap="round" />
    </svg>`;
}