import ui.SpriteView as SpriteView;
import ui.ViewPool as ViewPool;
import math.geom.Vec2D as Vec2D;
import math.geom.Circle as Circle;
import math.geom.Circle as Point;
import math.geom.intersect as intersect;

var colors = ['blue','green','pink','purple','red','yellow'];
var velocity = 15;
var size = 50;

var explosionSize = 72;
var explosionFrameRate = 30;
var explosionCols = 8;
var explosionRows = 6;

var animations = [];

for (var r = 0; r < explosionRows; r++) {
    for (var c = 0; c < explosionCols; c++) {
		animations.push([c,r]);
	}
}


var Bomb = exports = Class(SpriteView, function(supr){

	this.init = function(opts){

		//Bit of a hack but ensure bombs is obtained through view pool rather than crated itself
		if (!opts || !opts.obtained){
			throw new Error("Bomb must not be instantiated directly but obtained through the 'Bomb.obtain' call");
		}


        supr(this, 'init', [opts]);


		this.loadFromSheet('explode','resources/images/explosion.png',
							explosionSize, explosionSize,
							explosionSize, explosionSize,
							0, 0, animations);
    };

    this.updateOpts = function(opts){

        merge(opts,{
            width : size,
            height : size,
            frameRate : 1,
            scale : 1,
            loop : false
        });

        supr(this, 'updateOpts', [opts]);


        if (!this._color){
            this._color = colors[Math.floor(Math.random()*colors.length)];
        }

        this.stopMoving();
        this.stopAnimation();
        this.setImage('resources/images/bombs/'+this._color+'.png');
        this.setFramerate(explosionFrameRate);
    };

    this.getBoundingShape = function(){
		 var rect = supr(this, 'getBoundingShape');
		 return new Circle(merge(rect.getCenter(),{radius:rect.width/2}));
	};

    this.startMoving = function(angle){
        this._vector = new Vec2D({angle:angle, magnitude:velocity});
        this.tick = this._updatePosition;
    };

	this.stopMoving = function(){
        this.tick = null;
		this._vector = null;
	};

    this._updatePosition = function(){
        this.style.x += this._vector.x;
        this.style.y -= this._vector.y;
    };

	this.matches = function(bomb){
		return this._color === bomb._color;
	}

	this.bounce = function(){
		this._vector.x *= -1;
	};

	this.hasIntersected= function(line){
		return intersect.circleAndLine(this.getBoundingShape(),line);
	};

	this.hasCollided = function(bomb){
		return intersect.circleAndCircle(this.getBoundingShape(), bomb.getBoundingShape());
	};

	this.explode = function(){
        this.stopMoving();
        this.style.update({
            width : explosionSize,
            height : explosionSize,
        });

        this.style.x -= (explosionSize-Bomb.size())/2;
        this.style.y -= (explosionSize-Bomb.size())/2;

		this.startAnimation('explode',{
            callback:bind(this,this.remove)
        });
	};

	this.remove = function(){
		this.stopMoving();
		this.stopAnimation();
        this._color = null;
		//this.removeFromSuperView();
		Bomb.release(this);
	};



});


var pool = new ViewPool({
	ctor: Bomb,
	initCount : 120,
	initOpts: {
		obtained : true
	}
});


Bomb.obtain = bind(pool,pool.obtainView);
Bomb.release = bind(pool, pool.releaseView);
Bomb.size = function(){
	return size;
};







