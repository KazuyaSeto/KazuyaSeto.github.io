import { BackGround } from "../../gameSystem/backGround";

export class ScoreScene extends Phaser.Scene {
    private bgm: Phaser.Sound.BaseSound;
    private bg: BackGround;
    private money: integer;
    private rankingKey: string[] = ['1st', '2nd', '3rd'];
    private rankingIndex = -1;
    private debtKey : string = 'debt';
    private counter : integer = 0;
    private debtText : Phaser.GameObjects.BitmapText = null;
    constructor() {
      super({
        key: "ScoreScene"
      });
    }

    init(data): void {
        this.debtText = null;
        this.rankingIndex = -1;
        this.money = data.money;
        this.counter = 120;

        if(!this.data.has(this.debtKey)) {
          this.data.set(this.debtKey, 100000);
        }

        let debt = this.data.get(this.debtKey) - this.money;
        if(debt < 0) {
          debt = 0;
        }
        this.data.set(this.debtKey, debt);

        for(let index: integer = 0; index < this.rankingKey.length; index++) {
          if(!this.data.has(this.rankingKey[index])){
            this.data.set(this.rankingKey[index], 0);
          }
        }

        let ranking : integer[] = [];
        for(let index: integer = 0; index < this.rankingKey.length; index++) {
          ranking.push(this.data.get(this.rankingKey[index]));
        }

        ranking.push(this.money);
        ranking.sort((n1,n2) => n2 - n1);
        for(let index: integer = 0; index < ranking.length; index++) {
          this.data.set(this.rankingKey[index],ranking[index]);
        }
    }
  
    create(): void {
      this.bgm = this.sound.add('bgmTitle');
      this.bgm.play('', { loop: true, volume: 0.4 });
      let width = this.sys.canvas.width;
      let height = this.sys.canvas.height;

      this.bg = new BackGround({scrollSpeed: new Phaser.Math.Vector2(0, -2), scene:this, x: width/2, y: height/2, width: width, height: height, texture: 'bg'});
      
      for(let index: integer = 0; index < this.rankingKey.length; index++) {
        let ranking = this.data.get(this.rankingKey[index]);
        let text = this.add.bitmapText(width/2, (height/8) + index*60, "font", this.rankingKey[index] + ' $'+ ranking, 40)
        .setOrigin(0.5,0.5).setDepth(1000);
        if(this.money == ranking) {
          text.setTint(0x00ff00);
        }
      }

      this.add.bitmapText(width/2, (height/8) + this.rankingKey.length*60 + 30, "font", 'Get $'+this.money, 40)
      .setOrigin(0.5,0.5).setDepth(1000).setTint(0x00ff00);

      this.debtText = this.add.bitmapText(width/2, (height/8) + this.rankingKey.length*60 + 80, "font", '- $'+this.money, 40)
      .setOrigin(0.5,0.5).setDepth(1000).setTint(0xffff00);


      let frameNames = this.anims.generateFrameNames('atlas', {
        start: 0, end: 4, zeroPad: 1,
        prefix: 'ship/idle/ship', suffix: '.png'
      });
      this.anims.create({ key: 'idle', frames: frameNames, frameRate: 10, repeat: -1 });
      this.add.sprite(width/2, height/2, "atlas", "ship/idle/ship0.png")
      .play('idle');

      this.add.bitmapText(width/2, (height/6)*5, "font", "Tap Restart", 40)
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
      let debt = this.data.get(this.debtKey) - (Math.floor(this.money / 120) * (1 - this.counter));
      if(this.counter >= 0) {
        if(this.counter == 0) debt = this.data.get(this.debtKey) ;
        this.debtText.text = '- $' + debt;
        this.debtText.setOrigin(0.5,0.5);
        this.counter--;
      }
    }
  }
  