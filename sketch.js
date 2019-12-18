let move = {'up': 0,
			'down': 0,
			'left': 0,
			'right': 0}

const WORLD_SIZE = 480;
const nCells = 8;
const CELL_SIZE = WORLD_SIZE/nCells;



let Game;

let seed = 55;
let good_seeds = {'seeds':[]};

function setup(){
	createCanvas(480, 480);
	randomSeed(seed);
	move.up = createVector(0, -1);
	move.down = createVector(0, 1);
	move.right = createVector(1, 0);
	move.left = createVector(-1, 0);
	textFont('fantasy');
	textSize(60);
	Game = new Game_world();
}

function draw(){
	// main
	background(0, 255, 0);
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


function restart(){
	seed += 1;
	randomSeed(seed);
	Game = new Game_world();
	Game.player._win.state = false;
	console.log(seed);
}

function save_seed(){
	good_seeds.seeds.push(seed);
}

function show_seeds(){
	console.log(good_seeds.seeds);
}