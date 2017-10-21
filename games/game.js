var game;
var gameOptions = {
    gameWidth: 800,
    skyColor: 0xeeeeee,
    versionNumber: "1.0",
    spritesPath: "assets/sprites/",
    fontsPath: "assets/fonts/",
    soundPath: "assets/sounds/"
}
window.onload = function() {
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    if(windowWidth > windowHeight){
        windowHeight = windowWidth * 1.8;
    }
    var gameHeight = windowHeight * gameOptions.gameWidth / windowWidth;
    
    game = new Phaser.Game(gameOptions.gameWidth, gameHeight);

    game.state.add("BootGame", bootGame);
    game.state.add("PreloadGame", preloadGame);
    game.state.add("PlayGame", playGame);

    game.state.start("BootGame");
}

var bootGame = function(game){}
bootGame.prototype = {
    create: function(){
        game.stage.backgroundColor = gameOptions.skyColor;
        if(!Phaser.Device.desktop){
            game.scale.forceOrientation(false, true);
            game.scale.enterIncorrectOrientation.add(function(){
                game.paused = true;
                document.querySelector("canvas").style.display = "none";
                document.getElementById("wrongorientation").style.display = "block";
            })

            game.scale.leaveIncorrectOrientation.add(function(){
                game.paused = false;
                document.querySelector("canvas").style.display = "block";
                document.getElementById("wrongorientation").style.display = "none";
            })
        }
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        game.stage.disableVisibilityChange = true;
        
        game.state.start("PreloadGame");
    }
}

var preloadGame = function(game){}
preloadGame.prototype = {
    preload: function(){
        game.load.image("tap", gameOptions.spritesPath + "tap.png");
        game.load.spritesheet('button', 'assets/sprites/button_spritesheet.png', 256, 128, 2);
        game.load.audio("coinsound", gameOptions.soundPath + "coin.wav");
        game.load.audio("upsound", gameOptions.soundPath + "1up.wav");
        game.load.image("text", gameOptions.spritesPath + "pushthebutton.png.png");
        game.load.bitmapFont("font", gameOptions.fontsPath + "font.png", gameOptions.fontsPath + "font.fnt");
    },

    create: function(){
        game.state.start("PlayGame");
    }
}

var playGame = function(game){}
playGame.prototype = {
    create: function(){
        this.coinCount = 0;
        this.coinSound = game.add.audio("coinsound");
        this.upSound = game.add.audio("upsound");
        
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.world.setBounds(0, - 3 * gameOptions.floorGap, game.width, game.height + 3 * gameOptions.floorGap);
        this.createMenu();
    },

    createMenu: function(){
        this.menuGroup = game.add.group();
        
        this.tap = game.add.sprite(game.width / 2, game.height - 300, "tap");
        this.tap.anchor.set(0.5);
        this.menuGroup.add(this.tap);
        
        var button = game.add.button(game.width / 2, game.height / 2, 'button', this.buttonClicked, this, 1, 1, 0, 1);
        button.anchor.set(0.5);
        this.menuGroup.add(button);

        this.tapTween = game.add.tween(this.tap).to({
            alpha: 0
        }, 200, Phaser.Easing.Cubic.InOut, true, 0, -1, true);

        this.titleText = game.add.bitmapText(game.width / 2, 200, "font", "Push the button", 80);
        this.titleText.anchor.set(0.5);
        this.menuGroup.add(this.titleText);
    },

    buttonClicked: function(){
        if(this.menuGroup != null){
            if(this.coinCount >= 100) {
                this.coinCount = 0;
                this.upSound.play();
            } else {
                this.coinCount += 1;
                this.coinSound.play();
            }
            this.titleText.angle += 10;
            var tween = game.add.tween(this.titleText.position).to({ y: 1800 }, 300, Phaser.Easing.Cubic.InOut, true, 0, 0, false);
            this.tapTween.stop(function(){});
            this.tap.alpha = 0;
        }
    },

    update: function(){

    }
}
