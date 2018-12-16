
export class MainMenuScene extends Phaser.Scene {
    private bgm: Phaser.Sound.BaseSound;
    private timer : integer = 0;
    constructor() {
      super({
        key: "MainMenuScene"
      });
    }
  
    create(): void {
      this.timer = 0;
      this.bgm = this.sound.add('bgmTitle');
      this.bgm.play('', { loop: true, volume: 0.4 });
      let width = this.sys.canvas.width;
      let height = this.sys.canvas.height;
      this.cameras.main.setBackgroundColor(0xffffff);

      this.add.sprite(width/2, height/4, "atlas", "title/title1.png").setScale(0.5);
      this.add.sprite(width/2, height/4 - 45, "atlas", "title/title0.png").setScale(0.5);
      this.add.sprite(width/2, height/2, "atlas", "concon/concon1.png").setScale(0.5);
      this.add.sprite(width/2, height/4 * 3, "atlas", "piston/piston3.png").setScale(0.5);

      this.input.on("pointerdown", (pointer: Phaser.Geom.Point) => {
        if(this.timer < 10) return ; 
        this.bgm.stop();
        this.scene.start("GameScene");
      }, this);

      this.input.keyboard.on('keydown', (event:KeyboardEvent) => {
        this.bgm.stop();
        this.scene.start("GameScene");
      });
    }

    update(): void {
      if(this.timer < 10) {
        this.timer++;
      }
    }
  }
  