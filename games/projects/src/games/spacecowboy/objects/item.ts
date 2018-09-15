export class Item extends Phaser.Physics.Arcade.Sprite {
    private anim: Phaser.Tweens.Tween[];
    private isDead: boolean = false;

    public getDead(): boolean {
      return this.isDead;
    }
  
    public setDead(dead): void {
      this.isDead = dead;
    }

    constructor(params) {
      super(params.scene, params.x, params.y, params.key, params.frame);
      // image
      this.setScale(0.7);
  
      // physics
      params.scene.physics.world.enable(this);
      this.body.setVelocity(0, 100);
      this.body.setSize(100, 100);
  
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
      this.isOffTheScreen();
    }

    public gotHurt(): void {
        
      this.setActive(false);
      this.setVisible(false);      
    }
  
    private isOffTheScreen(): void {
      if (this.y + this.height > this.scene.sys.canvas.height) {
        this.isDead = true;
      }
    }
  }
  