class Game_world{
	constructor(){
		this.tot_coins = 0
		// initialize the map as an empty array
		this.map = [];
		// fill it up with cells
		for(let i = 0; i < nCells; i++){
			this.map[i] = []
			for(let j = 0; j < nCells; j++){
				this.map[i][j] = new Cell(j, i)
				if(this.map[i][j].type == 3){
					this.tot_coins += 1;
				}
			}
		}

		if(this.tot_coins == 0){
			restart()
		}

		this.map[1][1].type = 2;

		// initialize the player
		this.player = new Player(this.update_map, this);
		// pass a callback function for updating maps to the player
		this.player.update_map(this.map);
		this.win = {'state': false,
					'counter': 60};

		this.time_limit = {'counter': 240,
						   'counter_max': 240,
						   'state': true};
	}
	// a callback function for player to call when it needs to change the map
	update_map(map){

		this.map = map;
	}

	update(){
		if(this.win.counter <= 0){
			restart();
		}

		if(this.win.state){
			this.win.counter -= 1;
		}

		if(this.tot_coins <= 0 && !this.win.state){
			this.win.state = true
			this.player.reset()
		}

		if(this.time_limit.counter > 0 && !this.win.state){
			this.time_limit.counter -= 1;
		}else{
			this.time_limit.state = false;
			this.player.reset();
			this.win.state = true
		}

		// update the player
		this.player.update();
	}

	show(){
		// show the map
		for(let i = 0; i < nCells; i++){
			for(let j = 0; j < nCells; j++){
				this.map[i][j].show()
			}
		}

		if(this.win.state){
			background(51, map(this.win.counter, 90, 0, 0, 255));
		}

		// show the player
		this.player.show();

		let time = this.time_limit.counter/this.time_limit.counter_max;
		stroke((1-time)*255, (time)*255, 0);
		strokeWeight(6);
		line(3, 3, time*width, 3)
	}
}

class Player{
	constructor(map_updater, parent, x=1, y=1){
		this.position = createVector(x || 1, y || 1);
		this.p_position = this.position.copy();
		this.target_position = createVector(x, y);
		this.p_target_position = createVector(x, y);
		this.map;
		this.map_updater = map_updater;
		this.parent = parent;
		this.number_of_coins = 0;
		this._win = {'state': false, 'move_to_start_step': 1}
	}

	reset(){
		this._win.state = true;
		this._win.move_to_start_step = createVector(1, 1).sub(this.position).div(this.parent.win.counter);
	}

	update_map(map){

		this.map = map;
	}

	move(move_vector){
		if(this.position.equals(this.target_position) && !this._win.state){
			let no_obstacle = true;
			while(no_obstacle){
				// calculate future position
				let f_pos = this.target_position.copy()
				f_pos.add(move_vector)
				// check if there is an obstacle at that position
				if(this.map[f_pos.y][f_pos.x].type != 1){
					// if there is not then update the target_position
					// and previous target postion
					this.p_target_position = this.target_position.copy();
					this.target_position = f_pos;
				}else{
					// if there is than qquit the loop
					no_obstacle = false;
				}
			}
		}
	}

	update(){
		if(!this.parent.win.state){
			this._win.state = false
		}
		// save current position as previous postion for next update() step
		this.p_position = this.position.copy();

		if(!this.position.equals(this.target_position) && !this._win.state){
			// get the step vector
			let step = this.target_position.copy().sub(this.position);
			// size the step vector properly
			step.limit(0.6);
			// step into the *step* direction
			this.position.add(step);

			// check if the current position equals current target postion
			let x_check = floor(this.position.x) != floor(this.p_position.x);
			let y_check = floor(this.position.y) != floor(this.p_position.y);
			if(y_check || x_check){
				// check for every possible cell type other then the type 1 which is a solid
				// wall and we can't ever be standing there.
				if(this.map[floor(this.position.y)][floor(this.position.x)].type == 0){
					// if the cell the player is standing on is an empty space, turn it into 'half-wall'
					this.map[floor(this.position.y)][floor(this.position.x)].type = 2;
				}else if(this.map[floor(this.position.y)][floor(this.position.x)].type == 2){
					// if the cell the player is standing on is a 'half-wall' turn it into a 'wall'
					this.map[floor(this.position.y)][floor(this.position.x)].type = 1;
				}
				if(this.map[floor(this.position.y)][floor(this.position.x)].type == 3){
					this.number_of_coins += 1;
					this.parent.tot_coins -= 1;
					this.map[floor(this.position.y)][floor(this.position.x)].type = 2;
				}
				// update the map
				this.map_updater(this.map);
			}

		}

		if(this._win.state){
			this.position.add(this._win.move_to_start_step);
		}
	}

	show(){
		// draw the player
		// stroke(0, 240);
		// strokeWeight(4);
		noStroke();
		fill(3, 252, 152);
		rect(this.position.x*CELL_SIZE, this.position.y*CELL_SIZE, CELL_SIZE, CELL_SIZE);
		// draw the amount of coins the player is holding
		fill(210, 90, 255);
		textSize(32);
		text(this.number_of_coins, 10, 30);

		if(!this.target_position.equals(this.p_target_position) && !this._win.state){
			fill(3, 252, 152, 210);
			rect(this.p_position.x*CELL_SIZE, this.p_position.y*CELL_SIZE, CELL_SIZE, CELL_SIZE);
		}

	}
}

class Cell{
	constructor(x, y){
		this.position = createVector(x, y);
		this.types = ['empty-space', 'wall', 'half-wall', 'coin']
		this.type = (x == 0 || y == 0 || x == nCells-1 || y == nCells-1 || random(1) < 0.1)? 1 : 0;
		if(!(x == 1 && y == 1)){
			this.type = (x != 0 && y != 0 && x != nCells-1 && y != nCells-1 && random(1) < 0.1)? 3 : this.type;
		}
		this.solid = (this.type == 0)
	}

	show(){
		noStroke();
		if(this.type == 0 /* enpty-space */){
			stroke(0);
			strokeWeight(4);
			fill(220);
		}
		if(this.type == 1 /* wall */){
			fill(51);
		}
		if(this.type == 2 /* half-wall */){
			stroke(0);
			strokeWeight(4);
			fill(110);
		}
		if(this.type == 3 /* coin */){
			stroke(0);
			strokeWeight(4);
			fill(255, 255, 90);
		}
		rect(this.position.x*CELL_SIZE, this.position.y*CELL_SIZE, CELL_SIZE, CELL_SIZE);
	}
}