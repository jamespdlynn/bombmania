/**
 * Bomb Grid used to store and attach bombs
 */
import ui.View as View;
import src.Bomb as Bomb;
import src.audio as audio;
import animate;

var SIZE = Bomb.size();

var Grid = exports = Class(View, function(supr){

    this.init = function(opts){
        supr(this, 'init', [opts]);

        this._collisions = 0;

        this._cols = Math.floor(this.style.width/SIZE);
        this._rows = Math.floor(this.style.height/SIZE);
        this._diff = this.style.width - this._cols*SIZE;

        this._grid=[];

        this._flip = false;
    };

    this.build = function(){
        for (var r=0; r < this._rows; r++){

            this._grid[r]= [];

            for (var c=0; c < this._cols; c++){
                if (r < this._rows/4) {
                    this._attach(Bomb.obtain({
                        superview:this
                    }),r, c);
                }else{
                    this._grid[r][c] = null
                }
            }
        }
    };

    this.destroy = function(){
        this._iterateGrid(function(bomb){
            this._detach(bomb);
            bomb.explode();
        });
    };

    this.hasCollided = function(bomb){

        if (bomb.style.y <= 0){
            this._collide(bomb);
            return true;
        }

        return this._iterateGrid(function(bomb2) {
            if (bomb.hasCollided(bomb2)){
                this._collide(bomb);
                return true;
            }
        });
    };

    this._collide = function(bomb){
        bomb.stopMoving();

        var shape = bomb.getBoundingShape();
        var row = Math.floor(shape.y / SIZE);
        var col = Math.floor((this._isOdd(row)  ? shape.x - this._diff : shape.x) / SIZE);

        if (col >= this._cols){
            col--;
            row++;
        }else if (col < 0){
            col++;
            row++;
        }

        if (this._fetch(row,col)){
            row++;
        }

        //game ends if all rows are used up
        if (row >= this._rows){
            bomb.explode();
            this.emit('game:end');
            return;
        }

        //a bomb is already in this position, this should not happen
        if(this._fetch(row,col)){
            bomb.remove();
            return;
        }

        this._attach(bomb, row, col, {animate:true, duration:25});

        var matching = [];
        this._appendNeighbors(bomb, matching, true);


        if (matching.length >= 3) {
            matching.forEach(bind(this,function(bomb){
                bomb.explode();
                this._detach(bomb);
                this.emit('game:score', 10);
            }));
        }else{
            this._collisions++;
        }

        this._dropStragglers();

        if (this._collisions >= 3){
            this._addRow();
            this._collisions = 0;
        }

    };

    this._iterateGrid = function(fn){
        for (var r=this._rows-1; r >=0; r--) {
            for (var c = 0; c < this._cols; c++) {
                if (this._grid[r][c]) {
                    if (fn.call(this, this._grid[r][c], r, c)){
                        return true;
                    }
                }
            }
        }
        return false;
    };

    this._attach = function(bomb,row,col,opt){

        this._grid[row][col] = bomb;

        var style = {
            x : col * SIZE,
            y : row * SIZE
        };

        if (this._isOdd(row)){
            style.x += this._diff;
        }

        if (opt && opt.animate){
            animate(bomb).now(style, opt.duration, animate.linear);
        }else{
           bomb.style.update(style);
        }

        bomb.pos = {r:row,c:col};
    };

    this._detach = function(bomb){
        this._grid[bomb.pos.r][bomb.pos.c] = null;
        bomb.pos = null;
    };

    this._appendNeighbors = function(bomb,neighbors,matchingOnly){
        if (!neighbors.length || (neighbors.indexOf(bomb) < 0 && (!matchingOnly || bomb.matches(neighbors[0])))){

            neighbors.push(bomb);

            this._getNeighbors(bomb).forEach(bind(this,function(value){
                this._appendNeighbors(value,neighbors,matchingOnly);
            }));
        }

    };

    this._getNeighbors = function(bomb){
        if (!bomb) return [];

        var pos = bomb.pos;
        var i = this._isOdd(pos.r) ? 1 : -1;

        var neighbors = [
            this._fetch(pos.r, pos.c-1),
            this._fetch(pos.r, pos.c+1),
            this._fetch(pos.r-1, pos.c),
            this._fetch(pos.r-1, pos.c+i),
            this._fetch(pos.r+1, pos.c),
            this._fetch(pos.r+1, pos.c+i)
        ];

        return neighbors.filter(function(bomb){
            return bomb != null;
        });
    };

    this._fetch = function(row,col){
        if (row < 0 || row >= this._rows || col < 0 || col >= this._cols){
            return null;
        }
        return this._grid[row][col];
    };

    this._dropStragglers = function(){
        var ancestors = [];
        for (var c=0; c < this._cols; c++) {
            this._appendNeighbors(this._grid[0][c],ancestors,false);
        }

        this._iterateGrid(function(bomb){
            if (ancestors.indexOf(bomb) < 0){
                var height = this.getSuperview().style.height * 1.5;
                var duration = height-bomb.style.y;
                this._detach(bomb);
                animate(bomb).now({y:height},duration,animate.easeIn).then(bind(this,function(){
                    audio.play('ding');
                    bomb.remove();
                    this.emit('game:score', 30);
                }));
            }
        });

    };

    this._addRow = function(){

        this._flip = !this._flip;

        var gameOver = this._iterateGrid(function(bomb,row,col) {
            if (row+1 >= this._rows){
                this.emit('game:end');
                return true;
            }
            this._attach(bomb,row+1,col,{animate:true, duration:200});
            this._grid[row][col] = null;
        });

        if (!gameOver){
            for (var c=0; c < this._cols; c++){
                var newBomb = Bomb.obtain({
                    superview : this,
                    x : c * SIZE,
                    y: -SIZE
                });

                this._attach(newBomb, 0, c, {animate:true, duration:200});
            }
        }
    };

    this._isOdd = function(row){
        var oddRow = (row % 2 === 1);
        return ((!this._flip && oddRow) || (this._flip && !oddRow));
    };

});