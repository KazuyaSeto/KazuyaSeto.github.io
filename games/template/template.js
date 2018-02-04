var gameOptions = {
    gameWidth: 640,
    skyColor: 0xdddddd,
    versionNumber: "1.0",
    spritesPath: "assets/sprites/",
    fontsPath: "assets/fonts/",
    soundPath: "assets/sounds/"
}

window.onload = function() {
    const windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    if(windowWidth > windowHeight){
        windowHeight = windowWidth * 1.8;
    }
    const gameHeight = windowHeight * gameOptions.gameWidth / windowWidth;
    console.log(gameOptions.gameWidth);
    console.log(gameHeight);
    new Game(gameOptions.gameWidth, gameHeight);
}


import BootState from "./../common/states/BootState.js";

import GameState from "./states/GameState.js"
class Game extends Phaser.Game {
	constructor(gamewidth, gameheight) {
        super(gamewidth, gameheight);
        const bootState = new BootState("GameState");
		this.state.add("BootState", bootState);
		this.state.add("GameState", new GameState);
        this.state.start("BootState");
	}
}

