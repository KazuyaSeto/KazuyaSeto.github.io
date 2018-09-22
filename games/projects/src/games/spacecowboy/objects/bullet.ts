export enum BulletType { Bullet, Laser };

export class Bullet extends Phaser.GameObjects.Sprite {
  private currentScene: Phaser.Scene;
  private bulletSpeed: number;
  private bulletType: BulletType;

  constructor(params) {
    super(params.scene, params.x, params.y, params.texture, params.frame);
    this.initVariables(params);
    this.initImage(params.bulletProperties.bulletType);
    this.initPhysics(params.bulletProperties.bulletType);
    if(this.bulletType == BulletType.Bullet) {
      this.play(params.animName, true, Phaser.Math.RND.integerInRange(0,3));
    } else {
      this.play(params.animName, true, 0);
    }
    this.currentScene.add.existing(this);
  }

  public getBulletType(): BulletType {
    return this.bulletType;
  }

  private initVariables(params): void {
    this.currentScene = params.scene;
    this.bulletSpeed = params.bulletProperties.speed;
    this.bulletType = params.bulletProperties.bulletType;
  }

  private initImage(bulletType:BulletType): void {
    if(bulletType == BulletType.Bullet) this.setOrigin(0.5, 1);
    else {
      this.setOrigin(0.5, 1);
      this.setScale(1, 1.5);
    }
  }

  private initPhysics(bulletType:BulletType): void {
    this.currentScene.physics.world.enable(this);
    this.body.setVelocityY(this.bulletSpeed);
    if(bulletType == BulletType.Bullet) this.body.setSize(30, 60);
    else this.body.setSize(30, 800);
  }

  update(): void {
    if(!this.anims.isPlaying) this.destroy();
    if (this.y < 0 || this.y > this.currentScene.sys.canvas.height) {
      this.destroy();
    }
  }
}
  