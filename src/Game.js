import ui.View as View;
import src.Launcher as Launcher;
import math.geom.intersect as intersect;
import math.geom.Rect as Rect;

exports = Class(View, function(supr){

	this.init = function(){


		supr(this, 'init', arguments);
		
	
        this.launcher = new Launcher({
      		superview: this,
      		height: this.style.height * 0.2,
      		x : this.style.width * 0.5,
      		y : this.style.height * 0.83,
      		zIndex : 2
        });

		this.canHandleEvents(true);
		this.bounds = this.getBoundingShape();
	};


	this.start = function(){
		this.on('InputStart', function(evt,pt){
			this.launcher.rotate(pt);
			this.addEventListeners();
		});
	};


	this.tick = function(){
		if (this.activeBomb){

			var rightBounds = this.bounds.getSide(Rect.SIDES.RIGHT);
			var leftBounds = this.bounds.getSide(Rect.SIDES.LEFT);
			var topBounds = this.bounds.getSide(Rect.SIDES.TOP);

			var circle = this.activeBomb.getBoundingShape();

			var collide = intersect.circleAndLine;

			if (collide(circle, rightBounds) || collide(circle, leftBounds) ) {
				this.activeBomb.bounce();
			}
			else if (collide(circle, topBounds)){
				this.activeBomb.stop();
				this.activeBomb = null;
			}
		}
	};


	this.addEventListeners = function(){

		this.on('InputMove', function(evt,pt){
            this.launcher.rotate(pt)
		});

		this.on('InputSelect', function(){

			if (!this.activeBomb){
				this.activeBomb = this.launcher.fire();

				var point = this.activeBomb.getPosition(this);
				this.activeBomb.updateOpts({
					superview : this,
					x : point.x,
					y : point.y
				});

				this.activeBomb.move(this.launcher.getAngle());
			}

			this.removeEventListeners();
		});

	};



    this.removeEventListeners = function(){
		this.removeAllListeners('InputMove');
		this.removeAllListeners('InputSelect');
    }

});
