import { Bullet, BulletType } from "./bullet";

export class Player extends Phaser.GameObjects.Sprite {
  private isDead: boolean = false;

  private bullets: Phaser.GameObjects.Group;
  private currentScene: Phaser.Scene;

  private seBullet: Phaser.Sound.BaseSound;
  private seLaser: Phaser.Sound.BaseSound;
  
  private seBoostLeft: Phaser.Sound.BaseSound;
  private seBoostRight: Phaser.Sound.BaseSound;

  private rowNumber: number;
  private laserCount: integer = 0;

  public getRowNumber(): number {
    return this.rowNumber;
  }

  public getBullets(): Phaser.GameObjects.Group {
    return this.bullets;
  }

  public pickUpItem(): void {
    this.laserCount++;
    this.scene.sound.play('getItem');
  }

  constructor(params) {
    super(params.scene, params.x, params.y, 'atlas', 'ship/idle/ship0.png');
    this.seBullet = null;
    this.rowNumber = 1;
    this.initVariables(params);
    this.initImage();
    this.initPhysics();

    this.currentScene.add.existing(this);
  }

  private initVariables(params): void {
    this.currentScene = params.scene;

    this.bullets = this.currentScene.add.group({
      maxSize: 10,
      runChildUpdate: true
    });

    this.seBullet = this.currentScene.sound.add('bulletPlayer');
    this.seLaser = this.currentScene.sound.add('laser');
    
    this.seBoostLeft = this.currentScene.sound.add('boostLeft');
    this.seBoostRight = this.currentScene.sound.add('boostRight');

    let frameNames = this.currentScene.anims.generateFrameNames('atlas', {
                        start: 0, end: 4, zeroPad: 1,
                        prefix: 'ship/idle/ship', suffix: '.png'
    });
  
    this.currentScene.anims.create({ key: 'idle', frames: frameNames, frameRate: 10, repeat: -1 });
    this.play('idle');

    this.createAnimation('bullet/bullet', 'bulletFire', 0 ,3);
    this.createAnimation('laser/laser', 'laserFire', 0, 4, 5, 0);
   }

  private createAnimation(
      prefix: string,
      key: string,
      startFrame: integer,
      endFrame: integer,
      frameRate: integer = 10,
      repeat: integer = -1): void{
    let frameNames = this.currentScene.anims.generateFrameNames('atlas', {
        start: startFrame, end: endFrame, zeroPad: 1,
        prefix: prefix, suffix: '.png'
      });
  
    this.currentScene.anims.create({ key: key, frames: frameNames, frameRate: 10, repeat: repeat });
  }

  private initImage(): void {
    this.setScale(0.8);
    this.setOrigin(0.5, 0.5);
  }

  private initPhysics(): void {
    this.currentScene.physics.world.enable(this);
    this.body.setSize(13, 8);
  }

  update(): void {

  }

  public getDead(): boolean {
    return this.isDead;
  }

  public setDead(dead): void {
    this.isDead = dead;
  }

  public shot(): void {
    if(this.getDead()) return;
    if(this.laserCount>0) {
        this.laserCount--;
        this.seLaser.play();
        this.handleShooting(BulletType.Laser);
    }else{
        this.seBullet.play();
        this.handleShooting(BulletType.Bullet);
    }
  }

  public movePosition(index:number) {
    if(this.getDead()) return;      
    let width = this.currentScene.sys.canvas.width;
    let height = this.currentScene.sys.canvas.height;
    this.setPosition((width/3)*index+width/6, (height/6)*5);
    if(index > this.rowNumber) {
        this.seBoostRight.play();
    } else {
        this.seBoostLeft.play();        
    }
    this.rowNumber = index;
  } 

private handleShooting(bulletType:BulletType): void {
      let numberOfBullets = this.bullets.getLength();
      if (numberOfBullets < 10) {
        let frame : string = '';
        let animName : string = '';
        let speed : number = 0;
        let offset : number = 0;
        if(bulletType == BulletType.Bullet) {
            frame = 'bullet/bullet0.png';
            animName = 'bulletFire';
            speed = -3000;
            offset = -50;
        } else if(bulletType == BulletType.Laser) {
            frame = 'laser/laser0.png';
            animName = 'laserFire';
            speed = 0;
            offset = 50;
        }

        this.bullets.add(
          new Bullet({
            scene: this.currentScene,
            x: this.x,
            y: this.y - offset,
            texture: "atlas",
            frame: frame,
            animName:  animName,
            bulletProperties: {
              speed: speed,
              bulletType: bulletType
            }
          })
        );
    }
  }

  public gotHurt(): void {
    this.setDead(true);
    this.scene.sound.play('explosion');
    this.setDepth(100);
    this.play('explosionAnim', true, 0);
    this.on('animationcomplete', this.animComplete, this);
  }

  private animComplete(animation, frame) : void {
    this.setInteractive(false);
    this.setVisible(false);
    this.setActive(false);
  }
}
