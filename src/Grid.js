/**
 * Bomb Grid used to store and attach bombs
 */
import ui.View as View;
import src.Bomb as Bomb;
import animate;

var Grid = exports = Class(View, function(supr){

    this.init = function(opts){
        supr(this, 'init', [opts]);

        var size = Bomb.size();

        this._cols = Math.floor(this.style.width/size)
        this._rows = Math.floor(this.style.height/size);
        this._diff = this.style.width - this._cols*size;

        this._grid=[];

        for (var r=0; r < this._rows; r++){

            this._grid[r]= [];

            for (var c=0; c < this._cols; c++){
                if (r < this._rows/4) {
                    this._attach(Bomb.obtain({superview:this}),r, c);
                }else{
                    this._grid[r][c] = null
                }
            }
        }

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
        var size = shape.radius * 2;
        var row = Math.floor(shape.y / size);
        var col = Math.floor((row % 2 ? shape.x - this._diff : shape.x) / size);

        //game ends if all rows are used up
        if (row >= this._rows){
            bomb.explode();
            this._iterateGrid(function(bomb){
                bomb.explode();
            });
            this.emit('gameOver');
            return;
        }
        //a bomb is already in this position, this should not happen
        else if(this._fetch(row,col)){
            bomb.explode();
            return;
        }

        this._attach(bomb, row, col, true);

        var matching = [];
        this._appendNeighbors(bomb, matching,true);

        if (matching.length >= 3) {
            matching.forEach(bind(this,function(bomb){
                bomb.explode();
                this._detach(bomb);
                this.emit('incrementScore', 10);
            }));
        }

        this._removeStragglers();

    };

    this._iterateGrid = function(fn){
        for (var r=this._rows-1; r >=0; r--) {
            for (var c = 0; c < this._cols; c++) {
                if (this._grid[r][c]) {
                    if (fn.call(this, this._grid[r][c])){
                        return true;
                    };
                }
            }
        }
        return false;
    };

    this._attach = function(bomb,row,col,isAnimation){

        var size = Bomb.size();
        this._grid[row][col] = bomb;

        var style = {
            x : col * size + (row % 2 ? this._diff : 0),
            y : row * size
        };

        if (isAnimation){
            animate(bomb).now(style,50,animate.linear);
        }else{
            bomb.style.x = style.x;
            bomb.style.y = style.y;
        }

        bomb.pos = {r:row,c:col};
    };

    this._detach = function(bomb){
        this._grid[bomb.pos.r][bomb.pos.c] = null;
        bomb.pos = null;
    };

    this._appendNeighbors = function(bomb,neighbors,matchingOnly){
        if (!neighbors.length ||
            (neighbors.indexOf(bomb) < 0 &&
            (!matchingOnly || bomb.matches(neighbors[0])))){

                neighbors.push(bomb);
                this._getNeighbors(bomb).forEach(bind(this,function(value){
                    this._appendNeighbors(value,neighbors,matchingOnly);
                }));
        }

    };

    this._getNeighbors = function(bomb){
        if (!bomb) return [];

        var pos = bomb.pos;
        var i = pos.r % 2 ? 1 : -1;

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

    this._removeStragglers = function(){
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
                    bomb.remove();
                    this.emit('incrementScore', 30);
                }));
            }
        });


    };



});