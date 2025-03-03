class World {
    constructor() {
        this.nice_looking = false;
        this.space = [];
        this.width = 32;
        this.height = 32;
        this.depth = 32;
        this.world = [
            [1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 2, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 3, 3, 2, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 1],
            [1, 1, 1, 2, 2, 3, 3, 3, 3, 4, 4, 3, 3, 3, 2, 2, 1, 1, 1, 1, 2, 2, 2, 3, 3, 2, 2, 2, 1, 1, 1, 1],
            [1, 1, 1, 1, 2, 2, 3, 3, 4, 5, 4, 3, 3, 2, 2, 1, 1, 1, 1, 1, 2, 3, 3, 3, 3, 3, 2, 2, 1, 1, 1, 1],
            [1, 1, 1, 1, 2, 3, 3, 3, 4, 5, 4, 3, 3, 2, 2, 1, 1, 1, 1, 1, 2, 3, 3, 3, 3, 3, 2, 2, 1, 1, 1, 1],
            [1, 1, 1, 2, 2, 3, 4, 4, 4, 4, 4, 4, 4, 3, 3, 2, 2, 2, 2, 1, 2, 3, 3, 3, 3, 3, 2, 2, 2, 1, 1, 1],
            [1, 1, 1, 2, 3, 3, 4, 4, 5, 4, 4, 3, 3, 3, 3, 3, 2, 2, 2, 1, 2, 3, 3, 3, 3, 2, 2, 2, 1, 1, 1, 1],
            [1, 1, 1, 2, 3, 3, 4, 5, 4, 4, 4, 4, 3, 3, 3, 3, 3, 2, 2, 2, 2, 3, 3, 3, 3, 3, 2, 2, 1, 1, 1, 1],
            [1 ,1 ,1 ,2 ,2 ,2 ,3 ,4 ,3 ,3 ,3 ,3 ,2 ,2 ,2 ,2 ,2 ,1 ,1 ,1 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,1 ,1 ,1 ,1 ,1],
            [1 ,1 ,1 ,1 ,1 ,2 ,3 ,3 ,3 ,2 ,2 ,2 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1],
            [1 ,1 ,1 ,1 ,1 ,2 ,2 ,2 ,2 ,2 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1],
            [1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1],
            [1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1],
            [1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1],
            [1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,2 ,1 ,2 ,2 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1],
            [1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1],
            [1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1],
            [1 ,1 ,1 ,1 ,1 ,1 ,2 ,2 ,2 ,2 ,2 ,2 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1],
            [1 ,1 ,1 ,1 ,1 ,1 ,2 ,3 ,3 ,3 ,3 ,2 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,2 ,2 ,2 ,2 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1],
            [1, 1, 1, 1, 1, 2, 3, 3, 4, 4, 3, 3, 2, 2, 2, 2, 1, 1, 1, 2, 3, 3, 3, 2, 2, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 2, 2, 2, 3, 3, 4, 4, 3, 3, 3, 2, 2, 1, 1, 2, 3, 3, 3, 3, 2, 2, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 2, 3, 3, 4, 4, 3, 3, 2, 2, 2, 2, 1, 1, 1, 2, 2, 3, 3, 3, 3, 2, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 2, 2, 2, 3, 3, 4, 4, 3, 3, 3, 2, 2, 1, 1, 2, 3, 3, 3, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 2, 2, 3, 3, 4, 4, 4, 4, 3, 3, 3, 3, 2, 2, 2, 2, 3, 3, 3, 3, 2, 2, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 2, 2, 2, 3, 3, 4, 4, 3, 3, 3, 2, 2, 2, 1, 2, 3, 3, 3, 4, 3, 2, 2, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 2, 2, 3, 3, 4, 4, 3, 3, 2, 2, 2, 2, 2, 2, 3, 3, 4, 3, 3, 3, 2, 2, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 2, 3, 3, 4, 4, 3, 3, 2, 2, 1, 2, 3, 3, 3, 3, 3, 3, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 2, 3, 3, 4, 4, 3, 3, 2, 2, 2, 2, 2, 2, 3, 3, 4, 3, 3, 3, 2, 2, 2, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 2, 3, 3, 4, 4, 3, 3, 2, 2, 1, 1, 1, 1, 2, 3, 3, 3, 3, 2, 2, 2, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 2, 3, 3, 4, 4, 3, 3, 3, 2, 2, 1, 1, 1, 2, 3, 3, 3, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 2, 3, 3, 4, 4, 3, 3, 2, 2, 2, 1, 2, 2, 2, 3, 3, 3, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 2, 3, 3, 4, 4, 3, 3, 2, 2, 1, 2, 3, 3, 3, 3, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ];



        for (let x = 0; x < this.width; x++) {
            this.space.push([]);
            for (let z = 0; z < this.depth; z++) {
                this.space[x].push([]);
                for (let y = 0; y < this.height; y++) {
                    this.space[x][z].push(0);
                };
            };
        };
        this.space[4][5][4] = 1;
        this.space[4][5][5] = 1;
        this.space[4][5][6] = 1;
        this.space[5][5][7] = 1;
        this.space[5][5][8] = 1;
        this.space[6][5][9] = 1;
        this.space[6][5][10] = 1;

        this.space[7][5][11] = 2;
        this.space[5][5][11] = 2;
        this.space[6][4][11] = 2;
        this.space[6][6][11] = 2;

        this.space[8][5][12] = 2;
        this.space[4][5][12] = 2;
        this.space[6][3][12] = 2;
        this.space[6][7][12] = 2;
        
        this.space[9][5][11] = 2;
        this.space[3][5][11] = 2;
        this.space[6][2][11] = 2;
        this.space[6][8][11] = 2;

        this.space[9][5][10] = 2;
        this.space[3][5][10] = 2;
        this.space[6][2][10] = 2;
        this.space[6][8][10] = 2;



        //second tree

        this.space[24][25][3] = 1;
        this.space[24][25][4] = 1;
        this.space[24][25][5] = 1;
        this.space[25][25][6] = 1;
        this.space[25][25][7] = 1;
        this.space[26][25][8] = 1;
        this.space[26][25][9] = 1;

        this.space[27][25][10] = 2;
        this.space[25][25][10] = 2;
        this.space[26][24][10] = 2;
        this.space[26][26][10] = 2;

        this.space[28][25][11] = 2;
        this.space[24][25][11] = 2;
        this.space[26][23][11] = 2;
        this.space[26][27][11] = 2;

        this.space[29][25][10] = 2;
        this.space[23][25][10] = 2;
        this.space[26][22][10] = 2;
        this.space[26][28][10] = 2;

        this.space[29][25][9] = 2;
        this.space[23][25][9] = 2;
        this.space[26][22][9] = 2;
        this.space[26][28][9] = 2;


    }

    drawMap() {
        let cube = new Cube();
        cube.color = [0.5, 0.5, 0.5, 0.5];
        for (let x = 0; x < this.width; x++) {
            for (let z = 0; z < this.depth; z++) {
                    let y = this.world[x][z];
                    if (y > 3){
                        cube.textureNum = [3,3,3,2,1,3];
                        cube.textureNumberPlain = 2; 
                    }else{
                        cube.textureNum = [4,4,4,5,5,4]; 
                        cube.textureNumberPlain = 5; 
                    }
                    cube.matrix.setTranslate(x * 0.25 - 4,y * 0.25 - .855,z * 0.25 - 4);
                    cube.matrix.scale(0.25,0.25,0.25);
                    if( this.nice_looking){
                        cube.render();
                    }else{
                        cube.renderfaster();
                    }
            }
        }
    }

    drawSpace() {
        let cube = new Cube();
        cube.textureNum = [0,0,0,0,0,0];
        for(let x = 0; x < this.width; x++) {
            for(let z = 0; z < this.depth; z++) {
                for(let y = 0; y < this.height; y++) {
                    if (this.space[x][z][y] === 2) {
                        cube.color = [0.5, 0.9, 0.0, 1];
                        cube.matrix.setTranslate(x * 0.25 - 4,y * 0.25 - .855,z * 0.25 - 4);
                        cube.matrix.scale(0.25,0.25,0.25);
                        cube.renderfaster();
                    }else if (this.space[x][z][y] === 1){
                        cube.color = [0.5, 0.2, 0.0, 0.7];
                        cube.matrix.setTranslate(x * 0.25 - 4,y * 0.25 - .855,z * 0.25 - 4);
                        cube.matrix.scale(0.25,0.25,0.25);
                        cube.renderfaster();
                    }else if (this.space[x][z][y] === 3){
                        cube.color = [0.5, 0.2, 0.0, 0.7];
                        cube.matrix.setTranslate(x * 0.25 - 4,y * 0.25 - .855,z * 0.25 - 4);
                        cube.matrix.scale(0.25,0.25,0.25);
                        cube.renderfaster();
                    }
                }
            }
        }
    }


    placeBlock() {
        let x_eye = Math.floor((camera.eye.elements[0] + 3) * 4);
        let y_eye = Math.floor((camera.eye.elements[1] + 1) * 4);
        let z_eye = Math.floor((camera.eye.elements[2] + 3) * 4);
        
        console.log(`Placing block at (x: ${x_eye}, z: ${z_eye}, y: ${Math.floor(y_eye)})`);
        console.log(this.space);
        this.space[x_eye][z_eye][y_eye] = 3;
        console.log(this.space);
    }
    

    removeBlock() {
        let x_eye = Math.floor((camera.eye.elements[0] + 3) * 4);
        let y_eye = Math.floor((camera.eye.elements[1] + 1) * 4);
        let z_eye = Math.floor((camera.eye.elements[2] + 3) * 4);
        
        console.log(`Placing block at (x: ${x_eye}, z: ${z_eye}, y: ${Math.floor(y_eye)})`);
        console.log(this.space);
        this.space[x_eye][z_eye][y_eye] = 0;
        console.log(this.space);
    }


}