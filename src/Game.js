/**
 * Main Game Runner File
 */

import ui.View as View;
import ui.TextView as TextView;
import src.Launcher as Launcher;
import src.Grid as Grid;
import math.geom.Rect as Rect;

var Game = exports = Class(View, function(supr){

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

		this.scoreboard = new TextView({
			superview: this,
			x: 20,
			y: this.style.height-60,
			width: this.launcher.style.x,
			height: 40,
			autoSize: false,
			size: 30,
			verticalAlign: 'middle',
			horizontalAlign: 'left',
			wrap: false,
			color: '#FFFFFF'
		});

		this.bounds = this.getBoundingShape();
		this.canHandleEvents(true);
	};

	this.start = function() {

		this.score = 0;
		this.scoreboard.setText(this.score.toString());

		this.on('InputStart', function (evt, pt) {

			this.launcher.rotate(pt);
			this.on('InputMove', function(evt,pt){
				this.launcher.rotate(pt)
			});

			this.on('InputSelect', function(){

				this.removeAllListeners('InputMove');
				this.removeAllListeners('InputSelect')

				if (!this.activeBomb){
					this.activeBomb = this.launcher.fire();

					var point = this.activeBomb.getPosition(this);
					this.activeBomb.updateOpts({
						superview : this.grid,
						x : point.x,
						y : point.y
					});

					this.activeBomb.startMoving(this.launcher.getAngle());
					this.tick = this._detectCollisions;
				}
			});

		});

		this.grid.on('incrementScore',bind(this,this._incrementScore));
		this.grid.on('gameOver',bind(this,this.end));

	};

	//TODO Add replay button and cleanup/restart functionality
	this.end = function(){
		this.removeAllListeners();
		this.grid.removeAllListeners();
		this.launcher.style.opacity = 0.5;
		this.grid.style.opacity = 0.5;

		new TextView({
			superview: this,
			x : 0,
			y : this.style.height/5,
			width: this.style.width,
			height : 80,
			autoSize: false,
			size: 50,
			verticalAlign: 'middle',
			horizontalAlign: 'center',
			wrap: false,
			text: "Game Over",
			color: '#FFFFFF'
		});
	};

	this._detectCollisions = function(){
		var rightBounds = this.bounds.getSide(Rect.SIDES.RIGHT);
		var leftBounds = this.bounds.getSide(Rect.SIDES.LEFT);

		if (this.activeBomb.hasIntersected(rightBounds) || this.activeBomb.hasIntersected(leftBounds)){
			this.activeBomb.bounce();
		}
		else if (this.grid.hasCollided(this.activeBomb)){
			this.activeBomb = null;
			this.tick = null;
		}
	};

	this._incrementScore = function(value){
		this.score += value;

		if (value && !this._interval){
			this._interval = setInterval(bind(this,function(){
				var current = parseInt(this.scoreboard.getText());
				if (current < this.score){
					this.scoreboard.setText(current+1);
				}else{
					clearInterval(this._interval);
					delete this._interval;
				}
			}),10);
		}

	};
});
