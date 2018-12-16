export class Marble extends Phaser.GameObjects.Sprite {
  private gravity : integer = 1000;
  constructor(params) {
    super(params.scene, params.x, params.y, params.key, params.frame);
    params.scene.physics.world.enable(this);
    this.body.setGravityY(1000);
    this.body.setAllowRotation(true);
    params.scene.add.existing(this);
  }

  update(): void {
    this.gravity++;
    this.body.setGravityY(this.gravity);
  }

  public flap(just : boolean): void {
    if(just) {
      this.body.setVelocityY(-this.gravity / 2);
    } else {
      this.body.setVelocityY(-1000);
    }
    this.body.setAngularVelocity(Phaser.Math.Between(-360, 360));
  }
}