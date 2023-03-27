const board = [];
const ROWS = 15;
const COLS = 15;
const history = [];

me = 0;
player = 1;
gameOver = 0;
gameMode = 0;
match_found = 0;
room_number = 0;
const GAME_MODE = {
  TWO_PLAYERS: 0,
  PLAYER_VS_COMPUTER: 1,
  ONLINE: 2
};

for (let i = 0; i < ROWS; i++) {
  const row = [];
  for (let j = 0; j < COLS; j++) {
    row.push(0);
  }
  board.push(row);
}

class AI {
  constructor() {
    this.color = 0;
  }

  setColor(color) {
    this.color = color;
  }

  checkWin() {
    const directions = [
      [0, 1], // 水平方向
      [1, 0], // 垂直方向
      [1, 1], // 右下方向
      [-1, 1] // 左下方向
    ];

    function checkDirection(row, col, direction) {
      const piece = board[row][col];
      let count = 0;
      let r = row;
      let c = col;
      while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === piece) {
        count++;
        r += direction[0];
        c += direction[1];
      }
      return count;
    }

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const piece = board[row][col];
        if (piece === 0) {
          continue;
        }
        for (let i = 0; i < directions.length; i++) {
          const direction = directions[i];
          const count = checkDirection(row, col, direction) + checkDirection(row, col, [-direction[0], -direction[1]]) - 1;
          if (count >= 5) {
            return piece === 1 ? 1 : 2;
          }
        }
      }
    }
    return 0;
  }

  static checkDirection(row, col, direction) {
    let piece = 0;
    let r = row;
    let c = col;
    let count = 0;
    let score = 0;
    if (r + direction[0]*5 < 0 || r + direction[0]*5 >= ROWS || c + direction[1]*5 < 0 || c + direction[1]*5 >= COLS) {
      return 0;
    }

    while (r >= 0 && r < ROWS && c >= 0 && c < COLS && (piece === 0 || piece === board[r][c]) && count < 5) {
      if(piece === 0){
        piece = board[r][c];
      }if (board[r][c] === 1) {
        score+=1;
      }else if(board[r][c] === 2){
        score-=1;
      }
      count++;
      r += direction[0];
      c += direction[1];
    }
    if (count < 5) {
        return 0;
    }

    switch(score){
      case -5:
        return -Infinity;
      case -4:
        return -500;
      case -3:
        return -100;
      case -2:
        return -10;
      case -1:
        return -1;
      case 0:
        return 0;
      case 1:
        return 1;
      case 2:
        return 10;
      case 3:
        return 100;
      case 4:
        return 500;
      case 5:
        return Infinity;
      default:
        return 0;
    }

  }

  static evaluate(board) {
    let score = 0;
    const directions = [
      [0, 1], // 水平方向
      [1, 0], // 垂直方向
      [1, 1], // 右下方向
      [-1, 1] // 左下方向
    ];
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
          for (let i = 0; i < directions.length; i++) {
            const count = AI.checkDirection(row, col, directions[i]);
            score += count;
        }
      }
    }
    return score;
  }
  static evaluatePosition(board, row, col) {
    let score = 0;
    const directions = [
      [0, 1], // 水平方向
      [1, 0], // 垂直方向
      [1, 1], // 右下方向
      [-1, 1] // 左下方向
    ];
    for (let i = 0; i < directions.length; i++) {
      let count = 0;
      let r = row - directions[i][0]*4;
      let c = col - directions[i][1]*4;

      while (count <= 5) {
        if (r >= 0 && r < ROWS && c >= 0 && c < COLS ) {
          score += Math.abs(AI.checkDirection(r, c, directions[i]));
          r += directions[i][0];
          c += directions[i][1];
        }
       
        count++;
      }
    }
    return score;
  }


  getNextMove(board, maximizingPlayer, maxDepth) {

    let [row, col, score] = ai.minimax(board, maxDepth, maximizingPlayer, -Infinity , Infinity, 0);
    if(Math.abs(score) >= 500000){
      return [row, col];
    }
    maxDepth = 3;
    [row, col, score] = ai.minimax(board, maxDepth, maximizingPlayer, -Infinity , Infinity, 0);
    if(Math.abs(score) >= 500000){
      return [row, col];
    }
    maxDepth = 5;
    [row, col, score] = ai.minimax(board, maxDepth, maximizingPlayer, -Infinity , Infinity, 0);
    if(Math.abs(score) >= 500000){
      return [row, col];
    }
    return [row, col];
  }

  minimax(board, depth, maximizingPlayer, alpha, beta, nodeCount) {
    nodeCount += 1;
    
    if (depth === 0) {
      return [-1, -1, AI.evaluate(board)];
    }
    if (maximizingPlayer) {
      let maxEval = -Infinity;
      let bestRow = -1;
      let bestCol = -1;
      let evalList = [];
      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          if (board[row][col] === 0) {
            board[row][col] = 1;
            const evaluation = AI.evaluatePosition(board, row, col);
            board[row][col] = 0;
            evalList.push([row, col, evaluation]);
          }
        }
      }
      evalList.sort((a, b) => Math.abs(b[2]) - Math.abs(a[2]));
      evalList = evalList.slice(0, 20);
      for (let i = 0; i < evalList.length; i++) {
        const row = evalList[i][0];
        const col = evalList[i][1];
        board[row][col] = 1;
        const evaluation = this.minimax(board, depth - 1,false, alpha, beta, nodeCount)[2];
        board[row][col] = 0;
        if (evaluation >= maxEval) {
          maxEval = evaluation;
          bestRow = row;
          bestCol = col;
        }
        alpha = Math.max(alpha, evaluation);
        if (beta <= alpha) {
          return [row, col, Infinity, nodeCount];
        }
      }
      return [bestRow, bestCol, maxEval, nodeCount];
    } else {
      let minEval = Infinity;
      let bestRow = -1;
      let bestCol = -1;
      let evalList = [];
      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          if (board[row][col] === 0) {
            board[row][col] = 2;
            const evaluation = AI.evaluatePosition(board, row, col);
            board[row][col] = 0;
            evalList.push([row, col, evaluation]);
          }
        }
      }
      evalList.sort((a, b) => Math.abs(b[2]) - Math.abs(a[2]));
      evalList = evalList.slice(0, 20);
      for (let i = 0; i < evalList.length; i++) {
        const row = evalList[i][0];
        const col = evalList[i][1];
        board[row][col] = 2;
        const evaluation = this.minimax(board, depth - 1, true, alpha, beta, nodeCount)[2];
        board[row][col] = 0;
        if (evaluation <= minEval) {
          minEval = evaluation;
          bestRow = row;
          bestCol = col;
        }
        beta = Math.min(beta, evaluation);
        if (beta <= alpha) {
          return [row, col, -Infinity, nodeCount];
        }
      }
      return [bestRow, bestCol, minEval, nodeCount];
    }
  }
}


let ai = new AI();

let attempts = 0;


let socket;



function setGameMode(mode) {
  if (mode === GAME_MODE.ONLINE) {
    gameMode = mode;
    if(socket){
        socket.close();
    }
    resetGame()
    socket = new WebSocket(`ws://123.194.35.219:8765`);
    
    socket.addEventListener('open', (event) => {
      console.log('Connected to WebSocket server');
      const data = {
        type: 'connect'
      };
      const jsonData = JSON.stringify(data);
      socket.send(jsonData);
      const gameStatus = document.getElementById("game-status");
      gameStatus.innerHTML = "等待對手加入...";
    });
    
    socket.addEventListener('message', (event) => {
      console.log(`Received message: ${event.data}`);
      const data = JSON.parse(event.data);
      
      if(data.type === 'move'){
        const row = data.row;
        const col = data.col;
        board[row][col] = player;
        const square = document.getElementsByClassName("square")[row*15+col];
        square.classList.add(player === 1 ? "black-piece" : "white-piece");
        history.push([row, col]);
        player = player === 1 ? 2 : 1;
        setTimeout(() => {
          const winner = ai.checkWin();
          if (winner !== 0) {
            const gameStatus = document.getElementById("game-status");
            gameStatus.innerHTML = `${winner === 1 ? "黑方" : "白方"}玩家贏了!`;
            gameOver = 1;
          }
        }, 100);
      }else if(data.type === 'restart'){
        resetGameOnline()
      }else if(data.type === 'disconnect'){
        return;
      } else     if(data.type === 'match_found'){
        console.log('match found');
        me = data.player_number;

        room_number = data.room_number;
        match_found = 1;
        const gameStatus = document.getElementById("game-status");
        gameStatus.innerHTML = `配對成功! 你是${me === 1 ? "黑方" : "白方"}玩家。房號: ${room_number}`;

        resetGame()
      }

    });
    socket.addEventListener('close', (event) => {
      console.log('Disconnected from WebSocket server');
      resetOnlineData()
    });
    
    socket.addEventListener('error', (event) => {
      console.error('WebSocket error:', event);
      resetOnlineData()
    });

    
    
  } else {
    if (gameMode === GAME_MODE.ONLINE) {
          resetOnlineData()
      
        }

    gameMode = mode;
    if (mode === GAME_MODE.PLAYER_VS_COMPUTER) {
      ai = new AI();
      ai.setColor(player === 1 ? 2 : 1);
    }
  }
}
function playerMove(row, col) {
  if (gameMode === GAME_MODE.ONLINE && match_found === 0) {
      return;
  }
  if (gameMode === GAME_MODE.ONLINE && me !== player) {
      return;
  }
  if (gameOver) {
    gameOver = 0;
    resetGame();
    return;
  }
  if (gameMode === GAME_MODE.PLAYER_VS_COMPUTER && player === ai.color) {
      return;
  }
  
  if(board[row][col] !== 0) {
    return;
  }
    

  board[row][col] = player;
  const square = document.getElementsByClassName("square")[row*15+col];
  square.classList.add(player === 1 ? "black-piece" : "white-piece");
  history.push([row, col]);
  player = player === 1 ? 2 : 1;
  if(gameMode === GAME_MODE.ONLINE){
      const data = {
        type: 'move',
        row: row,
        col: col,
        player: me,
        room_number: room_number
      };
      const jsonData = JSON.stringify(data);
      socket.send(jsonData);

      console.log(`${player === 1 ? "黑方" : "白方"}玩家下了 (${row}, ${col})`);
      

    }

  setTimeout(() => {
  }, 100);
  if (gameMode === GAME_MODE.PLAYER_VS_COMPUTER && player === ai.color) {
      aiMove();
  }else{
    setTimeout(() => {
      const winner = ai.checkWin();
      if (winner !== 0) {
        const gameStatus = document.getElementById("game-status");
        gameStatus.innerHTML = `${winner === 1 ? "黑方" : "白方"}玩家贏了!`;
        gameOver = 1;
      }
    }, 100);
  }

}

function aiMove() {
  setTimeout(() => {
      
      const [row, col] = ai.getNextMove(board, ai.color === 2, 1);
      board[row][col] = ai.color;

      const square = document.getElementsByClassName("square")[row*15+col];
      square.classList.add(ai.color === 1 ? "black-piece" : "white-piece");
      history.push([row, col]);
      player = player === 1 ? 2 : 1;
  }, 0);
  setTimeout(() => {
    const winner = ai.checkWin();
    if (winner !== 0) {
      const gameStatus = document.getElementById("game-status");
      gameStatus.innerHTML = `${winner === 1 ? "黑方" : "白方"}玩家贏了!`;
      gameOver = 1;
    }
  }, 10);
}

function resetGame() {
  if (gameMode === GAME_MODE.ONLINE && match_found) {
      const data = {
        type: 'restart',
        player: me,
        room_number: room_number
      };
      const jsonData = JSON.stringify(data);
      socket.send(jsonData);
    }

  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      board[i][j] = 0;
      const square = document.getElementsByClassName("square")[i*15+j];
      square.classList.remove("black-piece", "white-piece");
    }
  }  
  history.length = 0;
  player = 1;
  gameOver = 0;
  if (gameMode === GAME_MODE.PLAYER_VS_COMPUTER && player === ai.color) {
    aiMove();
  }
}

function resetGameOnline() {
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      board[i][j] = 0;
      const square = document.getElementsByClassName("square")[i*15+j];
      square.classList.remove("black-piece", "white-piece");
    }
  }  
  history.length = 0;
  player = 1;
  gameOver = 0;
}

function undoMove() {

  if(gameMode !== GAME_MODE.ONLINE){
      if (gameOver) {
        gameOver = 0;
      }
      if (history.length === 0) {
        return;
      }
    const lastMove = history.pop();
    const row = lastMove[0];
    const col = lastMove[1];
    board[row][col] = 0;
    const square = document.getElementsByClassName("square")[row*15+col];
    square.classList.remove("black-piece", "white-piece");
    player = player === 1 ? 2 : 1;
  }
}

function printBoard() {
  for (let i = 0; i < ROWS; i++) {
    let row = "";
    for (let j = 0; j < COLS; j++) {
      row += board[i][j] + " ";
    }
    console.log(row);
  }
}

function resetOnlineData(){
  if(socket){
    socket.close();
  }
  match_found = 0;
  me = 0;
  player = 1;
  gameOver = 0;
  room_number = 0;
  history.length = 0;
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      board[i][j] = 0;
      const square = document.getElementsByClassName("square")[i*15+j];
      square.classList.remove("black-piece", "white-piece");
    }
  }  
  const gameStatus = document.getElementById("game-status");
  gameStatus.innerHTML = "";
  setGameMode(GAME_MODE.TWO_PLAYERS);
  
}
