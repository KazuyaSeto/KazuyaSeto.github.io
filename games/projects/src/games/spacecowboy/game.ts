/// <reference path="../../phaser.d.ts"/>

import "phaser";
import { BootScene } from "./scenes/bootScene";
import { MainMenuScene } from "./scenes/mainMenuScene";
import { GameScene } from "./scenes/gameScene";
import { ScoreScene } from "./scenes/scoreScene";


const getHeight = ( width : number) => {
  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;
  if(windowWidth > windowHeight){
      windowHeight = windowWidth * 1.8;
  }
  return windowHeight * width / windowWidth;
}

const gameWidth = 360;

const config: GameConfig = {
  title: "Space Cowboy",
  url: "https://github.com/digitsensitive/phaser3-typescript",
  version: "1.0",
  width: gameWidth,
  height: getHeight(gameWidth),
  zoom: window.innerWidth/gameWidth < 2 ? window.innerWidth/gameWidth : 1,
  type: Phaser.AUTO,
  parent: "game",
  scene: [BootScene, MainMenuScene, GameScene, ScoreScene],
  input: {
    keyboard: true,
    mouse: true,
    touch: true,
    gamepad: false
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: false
    }
  },
  backgroundColor: "#98d687",
  pixelArt: false,
  antialias: false,
};



export class Game extends Phaser.Game {
  constructor(config: GameConfig) {
    super(config);
  }
}

window.onload = () => {
  var game = new Game(config);
};