import ui.View as View;
import src.Bomb as Bomb;


exports = Class(View, function(supr){


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
                    this._grid[r][c] = Bomb.obtain({
                        superview : this,
                        x : c * size + (r % 2 ? this._diff : 0),
                        y : r * size
                    });
                }else{
                    this._grid[r][c] = null
                }

            }
        }

    };

    this.hasCollided = function(bomb){


        for (var r=0; r < this._rows; r++){
            for (var c=0; c < this._cols; c++){

                if(this._grid[r][c] && this._grid[r][c].hasCollided(bomb)){
                    bomb.stop();
                    this._placeBomb(bomb);
                    return true;
                }

            }
        }

        return false;

    };

    this._placeBomb = function(bomb){
        var shape = bomb.getBoundingShape();
        var size = Bomb.size();
        var row = Math.floor(shape.y / size);
        var col = Math.floor((row%2 ? shape.x-this._diff : shape.x)/size);

        this._grid[row][col] = bomb;
        bomb.style.update({
            x : col * Bomb.size() + (row % 2 ? this._diff : 0),
            y : row * Bomb.size()
        });
    }


});


