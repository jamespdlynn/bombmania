/**
 * Launcher used to aim and shoot bombs
 */
import ui.View as View;
import ui.ImageView as ImageView;
import src.Bomb as Bomb;
import src.audio as audio;
import animate;

var Launcher = exports = Class(View, function(supr){


	this.init = function(opts){
		
	    supr(this, 'init', [opts]);

		this.cannon = new ImageView({
			superview : this,
			width: 120,
			zIndex: 1,
        	autoSize : true,
        	fixedAspectRatio : true,
        	image : 'resources/images/cannon.png'
		});

		var cStyle = this.cannon.style;
    	this.style.update({
    		width : cStyle.width,
			height : cStyle.height,
    		anchorX : cStyle.width/2,
    		anchorY : cStyle.height
    	});

		this.bombs = [this._createBomb(), this._createBomb()];
	    this.bombs[0].style.y -= 2*Bomb.size()
	    this.bombs[1].style.y -= Bomb.size();
			    

	};

    this.rotate = function(point){
    	var style = this.style;
        point.x = point.x - style.x;
        point.y = style.y - point.y;

        var angle = point.getAngle();
        if(angle > Math.PI*0.25 && angle < Math.PI*0.75){
            style.r = Math.PI/2 - angle;
        }
    };

    this.fire = function(){
    	var bomb = this.bombs[0];

		this.bombs[0] = this.bombs[1];
		this.bombs[1] = this._createBomb();

		var height = this.bombs[1].style.height;
		var y0 = this.bombs[0].style.y;
		var y1 = this.bombs[1].style.y;

		animate(this.bombs[0]).now({y:y0-height},500);
		animate(this.bombs[1]).now({y:y1-height},500);

		audio.play('shot');

		return bomb;
    };

	this.getAngle = function(){
		return Math.PI/2 - this.style.r;
	};


    this._createBomb = function(opts){
    	var style = this.style;
    	var bomb = Bomb.obtain({
			superview : this,
			x: style.anchorX - (Bomb.size()/2),
			y: style.height - (Bomb.size()/2)-5,
			zIndex : 0
		});
		return bomb;
    };
});


