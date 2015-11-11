import ui.ImageView as ImageView;
import src.bombpool as bombpool;

exports = Class(ImageView, function(supr){


    this.updateOpts = function (opts) {

    	
    	this.bomb = null;

        merge(opts,{
        	zIndex: 0,
        	autoSize : true,
        	fixedAspectRatio : true,
        	image : 'resources/images/cannon.png'
        });	
	    return supr(this, 'updateOpts', [opts]);
    };


     this.autoSize = function(){
    	supr(this, 'autoSize');

    	var style = this.style;
    	style.update({
    		x : style.x - style.width/2,
    		anchorX : style.width/2,
    		anchorY : style.height
    	});

   	}

    this.rotate = function(point){
    	var style = this.style;
        point.x = point.x - style.x;
        point.y = style.y - point.y;

        var angle = point.getAngle();
        if(angle > Math.PI*0.3 && angle < Math.PI*0.7){
            style.r = Math.PI/2 - angle;
        }
    };

    this.reload = function(){
    	this.bomb = this._createBomb();
   	}; 	

    this.fire = function(){
    	return this.bomb;
    	this.bomb = null;
    };

    this._createBomb = function(){
    	var style = this.style;
    	var bomb = bombpool.obtainView({
			superview : this,
		});
		bomb.style.update({
			x: style.anchorX - (bomb.style.width/2)-5,
			y: style.anchorY/4
		});
		return bomb;
    };
});


