import device;
import ui.ImageView as ImageView;
import src.Game as Game;


var baseWidth = 576,
    baseHeight = device.screen.height * (baseWidth / device.screen.width);


exports = Class(GC.Application,function (){

  	this.initUI = function() {

  		this.style.scale = device.screen.width / baseWidth;

		/*var background = new ImageView({
			superview: this.view,
			x: 0,
			y: 0,
			width: baseWidth,
			height: baseHeight,
			image: "resources/images/background.png", //576x1024
			zIndex: 0
		});*/

	  	this.game = new Game({
	  		superview : this,
	  		width : baseWidth,
	  		height : baseHeight
	  	})

	};


  	this.launchUI = function() {
  		this.game.start();
  	}		


});

