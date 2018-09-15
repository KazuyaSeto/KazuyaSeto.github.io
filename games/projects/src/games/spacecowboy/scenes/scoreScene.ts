import { BackGround } from "../objects/backGround";

export class ScoreScene extends Phaser.Scene {
    private bgm: Phaser.Sound.BaseSound;
    private bg: BackGround;
    private money: integer;
    constructor() {
      super({
        key: "ScoreScene"
      });
    }

    init(data): void {
        this.money = data.money;
    }
  
    create(): void {
      this.bgm = this.sound.add('bgmTitle');
      this.bgm.play('', { loop: true, volume: 0.4 });
      let width = this.sys.canvas.width;
      let height = this.sys.canvas.height;

      this.bg = new BackGround({scrollSpeed: new Phaser.Math.Vector2(0, -2), scene:this, x: width/2, y: height/2, width: width, height: height, texture: 'bg'});
      
      this.add.bitmapText(width/2, (height/6), "font", '$'+this.money, 60)
      .setOrigin(0.5,0.5);

      let frameNames = this.anims.generateFrameNames('atlas', {
        start: 0, end: 4, zeroPad: 1,
        prefix: 'ship/idle/ship', suffix: '.png'
      });
      this.anims.create({ key: 'idle', frames: frameNames, frameRate: 10, repeat: -1 });
      this.add.sprite(width/2, height/2, "atlas", "ship/idle/ship0.png")
      .play('idle');

      this.add.bitmapText(width/2, (height/6)*5, "font", "Tap Restart", 60)
      .setOrigin(0.5,0.5);

      this.input.on("pointerdown", (pointer: Phaser.Geom.Point) => {
        this.bgm.stop();
        this.scene.start("GameScene");
      }, this);

      this.input.keyboard.on('keydown', (event:KeyboardEvent) => {
        this.bgm.stop();
        this.scene.start("GameScene");
      });
    }

    update(): void {
      this.bg.update();
    }
  }
  