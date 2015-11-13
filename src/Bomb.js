import ui.ImageView as ImageView;
import ui.ViewPool as ViewPool;
import math.geom.Vec2D as Vec2D;
import math.geom.Circle as Circle;
import math.geom.Circle as Point;
import math.geom.intersect as intersect;

var colors = ['blue','green','pink','purple','red','yellow'];
var velocity = 15;
var size = 50;

exports = Bomb = Class(ImageView, function(supr){

	this.init = function(opts){

		//Bit of a hack but ensure bombs is obtained through view pool rather than crated itself
		if (!opts || !opts.obtained){
			throw new Error("Bomb must not be instantiated directly but obtained through the 'Bomb.obtain' call");
		}

		supr(this, 'init', [opts]);

		this._color = Math.floor(Math.random()*colors.length);
		this.setImage('resources/images/bombs/'+colors[this._color]+'.png');
	};

    this.getBoundingShape = function(){
		 var rect = supr(this, 'getBoundingShape');
		 return new Circle(merge(rect.getCenter(),{radius:rect.width/2}));
	};

    this.start = function(angle){
        this._vector = new Vec2D({angle:angle, magnitude:velocity});
    };

	this.stop = function(){
		this._vector = null;
	};

	this.equals = function(bomb){
		return this._color === bomb._color;
	}

	this.bounce = function(){
		if (this._vector){
			this._vector.x = -this._vector.x;
		}
	};

	this.getAngleDiff = function(bomb){
		var s1 = this.style;
		var s2 = bomb.style;

		return new Point({
			x : s2.x - s1.x,
			y : s2.y - s1.y
		}).getAngle();
	};
	
	this.hasIntersected= function(line){
		return intersect.circleAndLine(this.getBoundingShape(),line);
	};

	this.hasCollided = function(bomb){
		return intersect.circleAndCircle(this.getBoundingShape(), bomb.getBoundingShape());
	};

    this.tick = function(dt){
        if (this._vector){
            this.style.x += this._vector.x;
            this.style.y -= this._vector.y;
        }
    };

});


var pool = new ViewPool({
	ctor: Bomb,
	initCount : 120,
	initOpts: {
		obtained : true,
		width: size,
		height: size,
		visible : true
	}
});


Bomb.obtain = bind(pool,pool.obtainView);
Bomb.destroy = bind(pool, pool.releaseView);
Bomb.size = function(){
	return size;
};







