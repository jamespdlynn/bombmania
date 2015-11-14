import ui.View as View;
import src.Launcher as Launcher;
import src.Grid as Grid;
import ui.SpriteView as SpriteView;
import math.geom.Rect as Rect;

exports = Class(View, function(supr){

	this.init = function(){

		supr(this, 'init', arguments);

		this.launcher = new Launcher({
      		superview: this,
      		zIndex : 2
        });

		this.launcher.style.update({
			x : (this.style.width/2) - (this.launcher.style.width/2),
			y : this.style.height - (this.launcher.style.height*0.85)
		});

		this.grid = new Grid({
			superview : this,
			width : this.style.width,
			height : this.launcher.style.y
		});


		this.bounds = this.getBoundingShape();


		this.canHandleEvents(true);
	};


	this.start = function() {
		this.on('InputStart', function (evt, pt) {
			this.launcher.rotate(pt);
			this.addEventListeners();
		});
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
					superview : this.grid,
					x : point.x,
					y : point.y
				});

				this.activeBomb.startMoving(this.launcher.getAngle());


			}

			this.removeEventListeners();
		});

	};

    this.removeEventListeners = function(){
		this.removeAllListeners('InputMove');
		this.removeAllListeners('InputSelect');
    }

	this.tick = function(){
		if (this.activeBomb){

			var rightBounds = this.bounds.getSide(Rect.SIDES.RIGHT);
			var leftBounds = this.bounds.getSide(Rect.SIDES.LEFT);
			var topBounds = this.bounds.getSide(Rect.SIDES.TOP);


			if (this.activeBomb.hasIntersected(rightBounds) || this.activeBomb.hasIntersected(leftBounds)){
				this.activeBomb.bounce();
			}
			else if (this.grid.hasCollided(this.activeBomb)){
				this.activeBomb = null;
			}
			else if (this.activeBomb.hasIntersected(topBounds)){
				this.activeBomb.stop();
				this.activeBomb.style.y = topBounds.start.y;
				this.activeBomb = null;
			}
		}
	};
});
