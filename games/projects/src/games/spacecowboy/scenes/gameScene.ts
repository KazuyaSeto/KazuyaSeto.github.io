import { BackGround } from "../objects/backGround";
import { Bullet, BulletType } from "../objects/bullet";
import { Player } from "../objects/player";
import { Enemy } from "../objects/enemy";
import { EnemyType } from "../objects/enemy";
import { Item } from "../objects/item";
import { StageCreator } from "../system/stageCreator";
import { MainUI } from "../objects/mainUi";
import { Director } from "../system/director";

export class GameScene extends Phaser.Scene {
  
  private tapPoints: Phaser.GameObjects.Sprite[];
  private player: Player;
  private items: Phaser.GameObjects.Group;
  private director : Director = new Director();
  private money: number = 0;
  private mainUi : MainUI = null;
  private isGameOver: boolean = false;

  constructor() {
    super({
      key: "GameScene"
    });
  }

  init() : void {
    this.isGameOver = false;
    this.money = 0;
    this.tapPoints = [];
    this.player = null;
    this.items = this.add.group({ runChildUpdate: true });
    this.director.init(this);
    this.mainUi = new MainUI({scene:this});
  }

  create(): void {
    let frameNames = this.anims.generateFrameNames('atlas', {
          start: 0, end: 4, zeroPad: 1,
          prefix: 'explosion/explosion', suffix: '.png'
    });

    this.anims.create({ key: 'explosionAnim', frames: frameNames, frameRate: 10, repeat: 0 });

    this.createSound();
    this.setupInput();
    this.createTapPoint();
    this.createPlayer();
    this.director.create();    
    this.mainUi.create();
  }

  update(): void {
    if(this.isGameOver) {
      this.scene.start("ScoreScene", { money:this.money });
      return ;
    }
    this.director.update();
    this.mainUi.update();
    this.checkCollisions();
  }

  private createSound(): void {
    this.sound.add('explosion');
    this.sound.add('getItem');
    this.sound.add('hyperBoost');
  }

  private setupInput(): void {
    this.input.keyboard.on('keydown', (event:KeyboardEvent) => {
      switch(event.keyCode){
        case Phaser.Input.Keyboard.KeyCodes.A:
          this.onTap(0);
          break;
        case Phaser.Input.Keyboard.KeyCodes.S:
          this.onTap(1);
          break;
        case Phaser.Input.Keyboard.KeyCodes.D:
          this.onTap(2);
          break;
      }
    });
  }

  private onTap(index:integer) {
    if(this.player.getRowNumber() == index){
      this.player.shot();
      return ;
    }
    this.tapPoints.forEach(element => {
      element.setActive(true);
      element.setVisible(true);          
    });
    this.tapPoints[index].setActive(false);
    this.tapPoints[index].setVisible(false);
    this.player.movePosition(index);
  }

  private createTapPoint(): void {
    let width = this.sys.canvas.width;
    let height = this.sys.canvas.height;

    for(let index = 0; index < 3; index++) {
      let tapPoint = this.add.sprite((width/3)*index+width/6, (height/6)*5, 'atlas', 'ship/tapship.png');
      tapPoint.setInteractive();
      tapPoint.setScale(0.6);
      if(index == 1) {
        tapPoint.setActive(false);
        tapPoint.setVisible(false);
      }
      tapPoint.on('pointerdown',(pointer: Phaser.Geom.Point) => {
        this.onTap(index);
      }, this);
      this.tapPoints.push(tapPoint);
    }
  }

  private createPlayer() : void {
    let width = this.sys.canvas.width;
    let height = this.sys.canvas.height;

    this.player = new Player({
      scene:this, x:(width/3)*1+width/6,
      y:(height/6)*5,
    });
    this.player.setInteractive();
    this.player.setScale(0.8);
    this.player.on('pointerdown',(pointer: Phaser.Geom.Point) => {
      this.player.shot();
    }, this);
  }

  private checkCollisions(): void {
    this.physics.overlap(
      this.player.getBullets(),
      this.director.getStageCreator().getEnemies(),
      this.bulletHitEnemy,
      null,
      this
    );

    this.physics.overlap(
      this.player,
      this.items,
      this.capselHitPlayer,
      null,
      this
    );

    this.physics.overlap(
      this.player.getBullets(),
      this.items,
      this.capselHitBullet,
      null,
      this
    );

    this.physics.overlap(
      this.player,
      this.director.getStageCreator().getEnemies(),
      this.enemyHitPlayer,
      null,
      this
    );
  }

  private bulletHitEnemy(bullet, enemy): void {
    if(bullet.getBulletType() == BulletType.Bullet) {
      bullet.destroy();
      if(enemy.getType() == EnemyType.meteo) return;
    }

    this.addMoney(enemy.getMoney());
       
    this.director.shotDown(enemy);
    
    if(enemy.getType() == EnemyType.ufogreen) {
      this.dropCapsel(enemy);
    }
  }

  private bulletHitPlayer(bullet, player): void {
    bullet.destroy();
    player.gotHurt();
  }

  private enemyHitPlayer(player, enemies): void {
    this.director.stopDirection();
    if(player.getDead()) return;
    player.gotHurt();
    this.time.addEvent(
      {
          delay: 2000,
          callback: this.endScene,
          callbackScope: this,
          loop: false,
          repeat: 0}
      );
  }

  private endScene(): void {
    this.isGameOver = true;
  }

  private capselHitPlayer(player, capsel): void {
    this.items.remove(capsel);
    capsel.destroy();
    player.pickUpItem();
  }

  private capselHitBullet(bullet, capsel): void {
    if(bullet.getBulletType() == BulletType.Bullet) bullet.destroy();    
    this.items.remove(capsel);
    this.sound.play('explosion');
    capsel.destroy();
  }

  private dropCapsel(enemy:Enemy): void {
    this.items.add(
      new Item(
      {
        scene: this,
        x: enemy.x,
        y: enemy.y,
        key: 'atlas',
        frame: 'etc/capsel.png'
      }
    ));
  }

  public addMoney(value:number) : void {
    this.money += value;
    this.mainUi.setMoneyText(this.money, value);
  }

  public getMainUI() : MainUI{
    return this.mainUi;
  }

  public getPlayer() : Player {
    return this.player;
  }

}
