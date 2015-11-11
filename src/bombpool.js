import ui.ImageView as ImageView;
import ui.ViewPool as ViewPool;
import math.geom.Vec2D as Vec2D;


var images = ['blue.png','green.png','pink.png','purple.png','red.png'];


Bomb = Class(ImageView, function(supr){

    this.init = function(){
        supr(this, 'init', arguments);
        var index = Math.floor(Math.random()*images.length);
        this.setImage('resources/images/bombs/'+images[index]);
    };

    this.fire = function(angle){
        this.isFiring = true;
        this.vector = new Vec2D({angle:angle, magnitude:5});
        console.log(angle,this.vector.x,this.vector.y);
    };

    this.tick = function(dt){
        if (this.isFiring){
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









