/**
 * Main Application Launcher
 */
import device;
import ui.ImageView as ImageView;
import ui.resource.loader as loader;
import src.Game as Game;

var baseWidth = 576,
    baseHeight = device.screen.height * (baseWidth / device.screen.width);

var Application = exports = Class(GC.Application, function () {

    this.initUI = function () {

        //preload assets
        loader.preload(['resources/images', 'resources/sounds']);

        this.style.scale = device.screen.width / baseWidth;

        var background = new ImageView({
            superview: this,
            width: baseWidth,
            height: baseHeight,
            image: "resources/images/background.png",
            zIndex: 0
        });

        var startButton = new ImageView({
            superview: this,
            x: baseWidth / 2 - 75,
            y: baseHeight / 4,
            width: 150,
            height: 150,
            image: "resources/images/start.png",
            zIndex: 1
        });

        //Don't add game view as a child yet
        var game = new Game({
            width: baseWidth,
            height: baseHeight,
            zIndex: 1
        });

        //When start button is clicked replace button with game view
        startButton.on('InputSelect', bind(this, function () {
            this.removeSubview(startButton);
            this.addSubview(game);
            game.start();
        }));

        //When game ends replace game view with start button
        game.on('game:end', bind(this, function () {
            this.removeSubview(game);
            this.addSubview(startButton);
        }));

    };

});

