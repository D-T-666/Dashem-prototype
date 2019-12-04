class Game_world{
	constructor(){
		this.map = [];
		this.map_size = nCells;
		for(let i = 0; i < this.map_size; i++){
			this.map[i] = []
			for(let j = 0; j < this.map_size; j++){
				this.map[i][j] = new Cell(j, i)
			}
		}
		this.player = new Player(this.update_map);
		this.player.update_map(this.map);
	}

	update_map(map){
		this.map = map;
	}

	update(){
		this.player.update();
	}

	show(){
		// show world
		for(let i = 0; i < this.map_size; i++){
			for(let j = 0; j < this.map_size; j++){
				this.map[i][j].show()
			}
		}

		// show player
		this.player.show();
	}
}

class Player{
	constructor(map_updater, x=1, y=1){
		this.position = createVector(x, y);
		this.p_position = this.position.copy();
		this.target_position = createVector(x, y);
		this.p_target_position = createVector(x, y);
		this.map;
		this.map_updater = map_updater;
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
				// if there is not then update the target_position
				// and previous target postion and begin the cooldown
				// if there is than qquit the loop
				if(this.map[f_pos.y][f_pos.x].type != 1){
					this.p_target_position = this.target_position.copy();
					this.target_position = f_pos;
				}else{
					no_obstacle = false;
				}
			}
		}
	}

	update(){
		if(!this.position.equals(this.target_position)){
			this.p_position = this.position.copy();
			this.position.add(this.target_position.copy().sub(this.position).normalize().mult(0.5));
			if(floor(this.position.y) != floor(this.p_position.y) || floor(this.position.x) != floor(this.p_position.x)){
				if(this.map[floor(this.p_position.y)][floor(this.p_position.x)].type == 0){
					this.map[floor(this.p_position.y)][floor(this.p_position.x)].type = 2;
				}else if(this.map[floor(this.p_position.y)][floor(this.p_position.x)].type == 2){
					this.map[floor(this.p_position.y)][floor(this.p_position.x)].type = 1;
				}
				this.map_updater(this.map);
			}
		}
	}

	show(){
		noStroke();
		fill(3, 252, 152);
		rect(this.position.x*CELL_SIZE, this.position.y*CELL_SIZE, CELL_SIZE, CELL_SIZE);
	}
}

class Cell{
	constructor(x, y){
		this.position = createVector(x, y);
		this.types = ['empty-space', 'wall']
		this.type = (x == 0 || y == 0 || x == nCells-1 || y == nCells-1 || random(1) < 0.1)? 1 : 0;
		this.solid = (this.type == 0)
	}

	show(){
		if(this.type == 1){
			noStroke();
			fill(51);
			rect(this.position.x*CELL_SIZE, this.position.y*CELL_SIZE, CELL_SIZE, CELL_SIZE)
		}
		if(this.type == 2){
			noStroke();
			fill(110);
			rect(this.position.x*CELL_SIZE, this.position.y*CELL_SIZE, CELL_SIZE, CELL_SIZE)
		}
	}
}