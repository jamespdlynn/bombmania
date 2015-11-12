import ui.ImageView as ImageView;
import ui.ViewPool as ViewPool;
import math.geom.Vec2D as Vec2D;
import math.geom.Circle as Circle;


var COLORS = ['blue','green','pink','purple','red','yellow'];
var VELOCITY = 20;

 Bomb = Class(ImageView, function(supr){

	this.init = function(){

		supr(this, 'init', arguments);

		this.color = Math.floor(Math.random()*COLORS.length);
		this.setImage('resources/images/bombs/'+COLORS[this.color]+'.png');
	};

    this.getBoundingShape = function(){
		 var rect = supr(this, 'getBoundingShape');
		 return new Circle(merge(rect.getCenter(),{radius:rect.width/2}));
	};


    this.move = function(angle){
        this.vector = new Vec2D({angle:angle, magnitude:VELOCITY});
        console.log(angle,this.vector.x,this.vector.y);
    };

	this.stop = function(){
		this.vector = null;
	}

	this.bounce = function(){
		if (this.vector){
			console.log('bounce');
			this.vector.x = -this.vector.x;
		}
	}

    this.tick = function(dt){
        if (this.vector){
            this.style.x += this.vector.x;
            this.style.y -= this.vector.y;
        }
    };

});

exports = new ViewPool({
	ctor: Bomb,
	initCount : 100,
	initOpts: {
		width: 52,
		height: 52,
		visible : true
	}
});









