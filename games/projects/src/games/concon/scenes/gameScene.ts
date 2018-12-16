import { Marble } from "../objects/marble";

export class GameScene extends Phaser.Scene {
  private scoreText: Phaser.GameObjects.BitmapText;

  private piston : Phaser.GameObjects.Sprite;
  private conSes : Phaser.Sound.BaseSound[];
  private conJustSe : Phaser.Sound.BaseSound;
  private missSe : Phaser.Sound.BaseSound;
  
  private count : integer = 0;
  private marble : Marble;
  private gameOver : boolean = false;
  private nextScene : boolean = false;
  
  constructor() {
    super({
      key: "GameScene"
    });
  }

  init() : void {
    this.conSes = [];
  }

  create(): void {
    this.gameOver = false;
    this.nextScene = false;
    this.count = 0;

    let width = this.sys.canvas.width;
    let height = this.sys.canvas.height;

    this.conSes.push(this.sound.add('con0'));
    this.conSes.push(this.sound.add('con1'));
    this.conJustSe = this.sound.add('conJust');
    this.missSe = this.sound.add('miss');

    this.cameras.main.setBackgroundColor(0xffffff);

    this.scoreText = this.add.bitmapText(width/2, height/2 - 40, "font", "0", 80).setOrigin(0.5,0.5).setTint(0x0f3391);

    this.piston = this.add.sprite(width/2, height/4 * 3, "atlas", "piston/piston3.png").setScale(0.5);

    this.marble = new Marble({
      scene: this,
      x: width/2,
      y: height/2,
      key: "atlas",
      frame: "concon/concon1.png"
    });
    this.marble.setScale(0.5);

    let frameNames = this.anims.generateFrameNames('atlas', {
      start: 0, end: 3, zeroPad: 1,
      prefix: 'piston/piston', suffix: '.png'
    });

    this.anims.create({ key: 'action', frames: frameNames, frameRate: 30, repeat: 0 });

    frameNames = this.anims.generateFrameNames('atlas', {
      start: 0, end: 1, zeroPad: 1,
      prefix: 'concon/concon', suffix: '.png'
    });

    this.anims.create({ key: 'flap', frames: frameNames, frameRate: 3, repeat: 0 });

    this.input.on("pointerdown", (pointer: Phaser.Geom.Point) => {
      this.tapScreen();
    }, this);

    this.input.keyboard.on('keydown', (event:KeyboardEvent) => {
      this.tapScreen();
    });
  }

  update(): void {
    this.marble.update();
    if(!this.gameOver && this.marble.y > this.sys.canvas.height + 100) {
      this.gameOver = true;
      this.missSe.play();
    }
    if(this.nextScene){
      this.scene.start("MainMenuScene");
    }
  }

  tapScreen(): void {
    if(this.gameOver && !this.nextScene) {
      this.nextScene = true;
    }
    this.piston.play('action');
    if(Phaser.Math.Distance.Between(0, this.marble.y, 0, this.piston.y - 50) < 50) {
      this.count++;
      let just : boolean = (this.count%10 == 0) && this.count >= 10;
      let se : Phaser.Sound.BaseSound = just ? this.conJustSe : this.conSes[this.count%2];
      se.play();
      this.marble.flap(just);
      this.marble.play('flap');
      this.scoreText.setText(this.count.toString());
    }
  }

}
