import device;
import ui.View as View
import ui.TextView as TextView;
import ui.ImageView as ImageView;
import ui.ImageScaleView as ImageScaleView
from event.input.dispatch import eventTypes;


var boundsWidth = 576,
    boundsHeight = 1024,
    baseWidth = boundsWidth,
    baseHeight = device.screen.height * (boundsWidth / device.screen.width); //864
    scale = device.screen.width / baseWidth;


var Game = Class(View, function(supr){

	var self, cannon;

	this.init = function(){
		supr(this, 'init', arguments);  

		this.canHandleEvents(true);

		cannon = new ImageView({
			superview: this,
			image: 'resources/images/cannon.png',
			fixedAspectRatio: true,
			autoSize: true,
			height: baseHeight*0.2
		});

		(function(cs){
			cs.x = baseWidth/2 - cs.width*0.5;
			cs.y = baseHeight - cs.height*0.8;
			cs.anchorX = cs.width*0.5;
			cs.anchorY = cs.height;
		})(cannon.style);

		self = this;
	};


	this.start = function(){
		self.on('InputStart', function(evt,pt){
			rotateCannon(pt);
			addEventListeners();
		});
	}


	function rotateCannon(pt){
		pt.x -= baseWidth/2;
		pt.y = baseHeight - pt.y;
		var angle = pt.getAngle();
		if(angle > Math.PI*0.25 && angle < Math.PI*0.75){
			cannon.style.r = Math.PI/2 - angle;
		}
	}


	function addEventListeners(){

		self.on('InputMove', function(evt,pt){
			rotateCannon(pt);
		});

		self.on('InputSelect', removeEventListeners);
	}


    function removeEventListeners(){
		self.removeAllListeners('InputMove');
		self.removeAllListeners('InputSelect');
	}





});    


exports = Class(GC.Application, function () {

	var game;

  	this.initUI = function() {

  		this.style.scale = scale

  		game = new Game({
  			superview : this,
  			width : baseWidth,
  			height : baseHeight
  		});


	};

	this.launchUI = function(){
		game.start();
	}



});

