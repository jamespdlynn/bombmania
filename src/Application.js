import device;
import src.Game as Game;


var baseWidth = 576,
    baseHeight = device.screen.height * (baseWidth / device.screen.width);


exports = Class(GC.Application,function (){

	var game;

  	this.initUI = function() {

  		this.style.scale = device.screen.width / baseWidth;

	  	game = new Game({
	  		superview : this,
	  		width : baseWidth,
	  		height : baseHeight
	  	})

	};


  	this.launchUI = function() {
  		game.start();
  	}		


});

