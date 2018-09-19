export enum EnemyType { ufored, ufogreen, meteo };

export class Enemy extends Phaser.Physics.Arcade.Sprite {

    private anim: Phaser.Tweens.Tween[];
    private isDead: boolean = false;
    private enemyType: EnemyType;

    public getType(): EnemyType {
      return this.enemyType;
    }

    public getDead(): boolean {
      return this.isDead;
    }
  
    public setDead(dead): void {
      this.isDead = dead;
    }

    public getMoney(): integer {
      switch(this.enemyType) {
        case EnemyType.meteo:
        return 1000;
      case EnemyType.ufogreen:
        return 10;
      case EnemyType.ufored:
        return 100;       
      }
    }

    static getFrame(enemyType: EnemyType) : string {
      switch(enemyType) {
        case EnemyType.meteo:
          return "etc/meteo.png";
        case EnemyType.ufogreen:
          return "etc/ufogreen.png";
        case EnemyType.ufored:
          return "etc/ufored.png";
      }
    }
  
    constructor(params) {
      super(params.scene, params.x, params.y, params.key, Enemy.getFrame(params.enemyType));
      this.enemyType = params.enemyType;
      // image
      this.setScale(0.5);
      this.setOrigin(0.5,0.5);
  
      // physics
      params.scene.physics.world.enable(this);
      this.body.setVelocity(0, params.speed*100);
      this.body.setSize(70, 70);
  
      // animations & tweens
      this.anim = [];
      this.anim.push(
        params.scene.tweens.add({
          targets: this,
          duration: 100,
          angle: -20
        })
      );
  
      params.scene.add.existing(this);
    }
  
    update(): void {
      this.handleAngleChange();
      this.isOffTheScreen();
    }

    public gotHurt(): void {
      this.on('animationcomplete', this.animComplete, this);
      this.play('explosionAnim');
    }

    private animComplete(animation, frame) : void {
      this.setActive(false);
      this.setVisible(false);
      this.isDead = true;
      this.destroy();
    }
  
    private handleAngleChange(): void {
      if (this.angle < 20) {
        this.angle += 1;
      }
    }
  
    private isOffTheScreen(): void {
      if (this.y - this.height > this.scene.sys.canvas.height) {
        this.isDead = true;
        this.destroy();
      }
    }
  }
  