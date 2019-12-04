class Game_world{
	constructor(){
		// initialize the map as an empty array
		this.map = [];
		// fill it up with cells
		for(let i = 0; i < nCells; i++){
			this.map[i] = []
			for(let j = 0; j < nCells; j++){
				this.map[i][j] = new Cell(j, i)
			}
		}

		// initialize the player
		this.player = new Player(this.update_map);
		// pass a callback function for updating maps to the player
		this.player.update_map(this.map);

	}

	// a callback function for player to call when it needs to change the map
	update_map(map){
		this.map = map;
	}

	update(){
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

		// show the player
		this.player.show();
	}
}

class Player{
	constructor(map_updater, x=1, y=1){
		this.position = createVector(x || 1, y || 1);
		this.p_position = this.position.copy();
		this.target_position = createVector(x, y);
		this.p_target_position = createVector(x, y);
		this.map;
		this.map_updater = map_updater;
		this.number_of_coins = 0;
	}

	update_map(map){
		this.map = map;
	}

	move(move_vector){
		if(this.position.equals(this.target_position)){
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
		// save current position as previous postion for next update() step
		this.p_position = this.position.copy();

		if(!this.position.equals(this.target_position)){
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
				if(this.map[floor(this.p_position.y)][floor(this.p_position.x)].type == 0){
					// if the cell the player is standing on is an empty space, turn it into 'half-wall'
					this.map[floor(this.p_position.y)][floor(this.p_position.x)].type = 2;
				}else if(this.map[floor(this.p_position.y)][floor(this.p_position.x)].type == 2){
					// if the cell the player is standing on is a 'half-wall' turn it into a 'wall'
					this.map[floor(this.p_position.y)][floor(this.p_position.x)].type = 1;
				}else if(this.map[floor(this.p_position.y)][floor(this.p_position.x)].type == 3){
					// if the cell tha player is standing on is a 'coin' pick it up and 
					// turn it into a 'half-wall'
					this.number_of_coins += 1;
					this.map[floor(this.p_position.y)][floor(this.p_position.x)].type = 2;
				}
				// update the map
				this.map_updater(this.map);
			}
		}
	}

	show(){
		// draw the player
		noStroke();
		fill(3, 252, 152);
		rect(this.position.x*CELL_SIZE, this.position.y*CELL_SIZE, CELL_SIZE, CELL_SIZE);
		if(!this.target_position.equals(this.p_target_position)){
			fill(3, 252, 152, 160);
			rect(this.p_position.x*CELL_SIZE, this.p_position.y*CELL_SIZE, CELL_SIZE, CELL_SIZE);
		}

		// draw the amount of coins the player is holding
		fill(210, 90, 255);
		textSize(32);
		text(this.number_of_coins, 10, 30);
	}
}

class Cell{
	constructor(x, y){
		this.position = createVector(x, y);
		this.types = ['empty-space', 'wall', 'half-wall', 'coin']
		this.type = (x == 0 || y == 0 || x == nCells-1 || y == nCells-1 || random(1) < 0.1)? 1 : 0;
		this.type = (x != 0 && y != 0 && x != nCells-1 && y != nCells-1 && random(1) < 0.1)? 3 : this.type;
		this.solid = (this.type == 0)
	}

	show(){
		if(this.type == 1 /* wall */){
			noStroke();
			fill(51);
			rect(this.position.x*CELL_SIZE, this.position.y*CELL_SIZE, CELL_SIZE, CELL_SIZE)
		}
		if(this.type == 2 /* half-wall */){
			noStroke();
			fill(110);
			rect(this.position.x*CELL_SIZE, this.position.y*CELL_SIZE, CELL_SIZE, CELL_SIZE)
		}
		if(this.type == 3 /* coin */){
			noStroke();
			fill(255, 255, 90);
			ellipse(this.position.x*CELL_SIZE+CELL_SIZE/2.0, this.position.y*CELL_SIZE+CELL_SIZE/2, CELL_SIZE, CELL_SIZE)
		}
	}
}