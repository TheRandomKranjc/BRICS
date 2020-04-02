var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var ballRadius = 10;
var x = canvas.width/2;
var y = canvas.height-30;
var dx = Math.round(Math.random()*6-3);
var dy = -5;
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2;
var paddleY = (canvas.height-paddleHeight);
var rightPressed = false;
var leftPressed = false;
var brickRowCount = 7; //7
var brickColumnCount = 2; //3
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 40;
var score = 0;
var stage = 1;
var lives = 3;
var highScore = 0;
var brickColour = ["#b00","#C70","#bb0","#0B0","#07B","#b0b","#b00"];
var gameStatus = false;

var bricks = [];
resetBricks();

function resetBricks(){
	for(var c=0; c<brickColumnCount; c++) {
		bricks[c] = [];
		for(var r=0; r<brickRowCount; r++) {
			bricks[c][r] = { x: 0, y: 0, status: 1 };
		}
	}
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
	if(e.keyCode == 39 || e.keyCode == 68) {
		rightPressed = true;
	}
	else if(e.keyCode == 37 || e.keyCode == 65) {
		leftPressed = true;
	}
	else if((e.keyCode == 13 || e.keyCode == 27) && gameStatus == false) {
		gameStatus = true;
		draw();
	}
	else if(e.keyCode == 27 && gameStatus == true) {
		gameStatus = false;
		drawNextStage();
	}
	else if(e.keyCode == 16) {
		if(dy>0) dy++
		else dy--;
	}
}
function keyUpHandler(e) {
	if(e.keyCode == 39 || e.keyCode == 68) {
		rightPressed = false;
	}
	else if(e.keyCode == 37 ||e.keyCode == 65) {
		leftPressed = false;
	}
}
function resetGame(){
	x = canvas.width/2;
	y = canvas.height-30;
	dx = Math.round(Math.random()*6-3);
	dy = -3;
	paddleX = (canvas.width-paddleWidth)/2;
	paddleY = (canvas.height-paddleHeight);
	score = 0;
	stage = 1;
	lives = 3;
}
function collisionDetection() {
	for(var c=0; c<brickColumnCount; c++) {
		for(var r=0; r<brickRowCount; r++) {
			var b = bricks[c][r];
			if(b.status == 1) {
				if(y+ballRadius > b.y && y-ballRadius < b.y+brickHeight) {
					if(x+ballRadius/1.4 > b.x+4 && x-ballRadius/1.4 < b.x+brickWidth-4){
						dy = -dy;
						b.status = 0;
						score++;
					}
					else if(x+ballRadius/1.4 > b.x && x+ballRadius/1.4 < b.x+4 || x-ballRadius/1.4 < b.x+brickWidth && x+ballRadius/1.4 > b.x+4){
						dx = -dx;
						b.status = 0;
						score++;
					}
					if(score>highScore){
						highScore=score;
					}
					
					if(score % (brickRowCount*brickColumnCount) == 0 && score!=(stage-1)*14) {
						stage++;
						gameStatus = false;
						resetBricks();
						drawBricks();
						drawNextStage();
						dy = -Math.abs(dy+2);
						x = canvas.width/2;
						y = canvas.height-30;
					}
				}
			}
		}
	}
}

function drawBall() {
	ctx.beginPath();
	ctx.arc(x, y, ballRadius, 0, Math.PI*2);
	ctx.fillStyle = "#FA0";
	ctx.fill();
	ctx.closePath();
}
function drawPaddle() {
	ctx.beginPath();
	ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
	ctx.fillStyle = "#fff";
	ctx.fill();
	ctx.closePath();
}
function drawBricks() {
	for(var c=0; c<brickColumnCount; c++) {
		for(var r=0; r<brickRowCount; r++) {
			if(bricks[c][r].status == 1) {
				var brickX = (r*(brickWidth+brickPadding))+brickOffsetLeft;
				var brickY = (c*(brickHeight+brickPadding))+brickOffsetTop;
				bricks[c][r].x = brickX;
				bricks[c][r].y = brickY;
				ctx.beginPath();
				ctx.rect(brickX, brickY, brickWidth, brickHeight);
				ctx.fillStyle = brickColour[r];
				ctx.fill();
				ctx.closePath();
			}
		}
	}
}
function drawScore() {
	ctx.font = "16px minecraft";
	ctx.fillStyle = "#fff";
	ctx.fillText("Stage: "+stage+"   Score: "+score+"   High Score: "+highScore, 8, 20);
}
function drawLives() {
	ctx.font = "16px minecraft";
	ctx.fillStyle = "#fff";
	ctx.fillText("Lives: "+lives, canvas.width-110, 20);
}
function drawStart() {
	ctx.font = "24px minecraft";
	ctx.fillStyle = "#fff";
	ctx.fillText("PRESS ENTER TO START", 125, 300);
}
function drawHighScore() {
	ctx.font = "24px minecraft";
	ctx.fillStyle = "#fff";
	ctx.fillText("New high score: "+highScore, 165, 150);
}
function drawNextStage() {
	ctx.font = "24px minecraft";
	ctx.fillStyle = "#fff";
	ctx.fillText("PRESS ENTER TO CONTINUE", 90, 200);
}
function drawGameOver() {
	ctx.font = "24px minecraft";
	ctx.fillStyle = "#fff";
	ctx.fillText("GAME OVER", 240, 250);
}
function drawIntro() {
	ctx.font = "50px minecraft";
	ctx.fillStyle = "#f00";
	ctx.fillText("KRANJC BRICS", 70, 100);
}

function draw() {
	if(gameStatus){
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawBricks();
		drawBall();
		drawPaddle();
		drawScore();
		drawLives();
		collisionDetection();

		if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
			dx = -dx;
		}
		if(y + dy < ballRadius) {
			dy = -dy;
		}
		else if(y + dy > canvas.height-ballRadius-paddleHeight) {
			if(x+ballRadius/1.5 > paddleX && x-ballRadius/1.5 < paddleX + paddleWidth) {
				dx = (x-(paddleX+paddleWidth/2))/8;;
				dy = -dy;
			}
			else if(y + dy > canvas.height-ballRadius) {
				lives--;
				if(!lives) {
					if(score==highScore){
						highScore = score;
						drawHighScore();
					}
					drawGameOver();
					drawStart();
					resetGame();
					resetBricks();
					gameStatus = false;
				}
				else {
					x = canvas.width/2;
					y = canvas.height-30;
					dx = Math.round(Math.random()*6-3);;
					dy = -Math.abs(dy);
				}
			}
		}

		if(rightPressed && paddleX < canvas.width-paddleWidth-10) {
			paddleX += 7;
		}
		else if(leftPressed && paddleX > 10) {
			paddleX -= 7;
		}

		x += dx;
		y += dy;
		requestAnimationFrame(draw);
	}
}
setTimeout(drawIntro,50);
setTimeout(drawStart,50); //timeout, ker se font ne loada dosti hitro da default font brez timeout
//drawGameOver();
//drawHighScore();
//drawNextStage();