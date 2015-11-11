import ui.View as View;
//import ui.ImageView as ImageView;
import src.bombpool as bombpool;
import src.Cannon as Cannon;

exports = Class(View, function(supr){

	var self, cannon;

	this.init = function(){


		supr(this, 'init', arguments);
		
	
        cannon = new Cannon({
      		superview: this,
      		height: this.style.height * 0.2,
      		x : this.style.width * 0.5,
      		y : this.style.height * 0.83
        });

		this.canHandleEvents(true);

		self = this;

	};


	this.start = function(){
		cannon.reload();


		self.on('InputStart', function(evt,pt){
			cannon.rotate(pt);
			addEventListeners();
		});
	};


	function addEventListeners(){

		self.on('InputMove', function(evt,pt){
            cannon.rotate(pt)
		});

		self.on('InputSelect', function(){
			var bomb = cannon.fire();
			var point = bomb.getPosition(this);
			bomb.updateOpts({
				superview : this,
				x : point.x,
				y : point.y
			});
			bomb.fire(Math.PI/2-cannon.style.r);
			cannon.reload();

			removeEventListeners();
		});

	}


    function removeEventListeners(){
		self.removeAllListeners('InputMove');
		self.removeAllListeners('InputSelect');
    }

});
