import ui.View as View;
import src.Bomb as Bomb;


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
                if (r < this._rows/2) {
                    this._place(Bomb.obtain(),r, c);
                }else{
                    this._grid[r][c] = null
                }
            }
        }

    };

    this.hasCollided = function(bomb){

        var grid = this._grid;

        for (var r=0; r < this._rows; r++){
            for (var c=0; c < this._cols; c++){
                if(grid[r][c] && grid[r][c].hasCollided(bomb)){
                    bomb.stopMoving();

                    var shape = bomb.getBoundingShape();
                    var size = shape.radius * 2;
                    var row = Math.floor(shape.y /size);
                    var col = Math.floor((row%2 ? shape.x-this._diff : shape.x)/size);

                    this._place(bomb,row,col);

                    var matching = [];
                    this._appendMatches(bomb,matching);


                    if (matching.length >= 3){
                        matching.forEach(function(bomb){
                            var pos = bomb.pos;
                            grid[pos.r][pos.c] = null;
                            bomb.explode();
                        });

                    }

                    return true;
                }

            }
        }

        return false;

    };

    this._place = function(bomb,row,col){
        var size = Bomb.size();
        this._grid[row][col] = bomb;
        bomb.updateOpts({
            superview : this,
            x : col * size + (row % 2 ? this._diff : 0),
            y : row * size
        });
        bomb.pos = {r:row,c:col};
    };

    this._appendMatches = function(bomb,matching){
        if (!matching.length || (bomb.matches(matching[0]) && matching.indexOf(bomb) < 0)){
            matching.push(bomb);
            this._getNeighbors(bomb).forEach(bind(this,function(value){
                this._appendMatches(value,matching);
            }));
        }
    }

    this._getNeighbors = function(bomb){
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


});