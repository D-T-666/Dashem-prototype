let move = {'up': 0,
			'down': 0,
			'left': 0,
			'right': 0}

const WORLD_SIZE = 480;
const nCells = 8;
const CELL_SIZE = WORLD_SIZE/nCells;

let Game;

function setup(){
	createCanvas(480, 480);
	move.up = createVector(0, -1);
	move.down = createVector(0, 1);
	move.right = createVector(1, 0);
	move.left = createVector(-1, 0);
	Game = new Game_world();
}

function draw(){
	// main
	background(220);
	Game.show();
	Game.update();

	// controls
	if(keyIsPressed){
		if(keyCode == LEFT_ARROW){
			Game.player.move(move.left);
		}
		if(keyCode == RIGHT_ARROW){
			Game.player.move(move.right);
		}
		if(keyCode == UP_ARROW){
			Game.player.move(move.up);
		}
		if(keyCode == DOWN_ARROW){
			Game.player.move(move.down);
		}
	}
}
