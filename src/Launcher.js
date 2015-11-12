import ui.View as View;
import ui.ImageView as ImageView;
import src.bombpool as bombpool;
import animate;

exports = Class(View, function(supr){


	this.init = function(opts){
		
	    supr(this, 'init', [opts]);

		this.cannon = new ImageView({
			superview : this,
			height : this.style.height,
			zIndex: 1,
        	autoSize : true,
        	fixedAspectRatio : true,
        	image : 'resources/images/cannon.png'
		});

		this.style.width = this.cannon.style.width;

    	this.style.update({
    		x : this.style.x - (this.style.width/2),
    		anchorX : this.style.width/2,
    		anchorY : this.style.height
    	});

		this.bombs = [this._createBomb(), this._createBomb()];
		
		var height = this.bombs[0].style.height;
	    this.bombs[0].style.y -= 2*height
	    this.bombs[1].style.y -= height
			    

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

		return bomb;
    };

	this.getAngle = function(){
		return Math.PI/2 - this.style.r;
	};


    this._createBomb = function(opts){
    	var style = this.style;
    	var bomb = bombpool.obtainView({
			superview : this,
		});
		bomb.style.update({
			x: style.anchorX - (bomb.style.width/2)-5,
			y: style.height - bomb.style.height,
			zIndex : 0
		});
		return bomb;
    };
});


