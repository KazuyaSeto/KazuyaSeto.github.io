export class BackGround extends Phaser.GameObjects.TileSprite {
    private scrollSpeed : Phaser.Math.Vector2;
    constructor(params) {
      super(params.scene, params.x, params.y, params.width, params.height, params.texture);
      this.scrollSpeed = params.scrollSpeed;
      params.scene.add.existing(this);
    }
  
    update(): void {
        this.tilePositionX += this.scrollSpeed.x;
        this.tilePositionY += this.scrollSpeed.y;
        if(this.tilePositionX > this.originX) {
            this.tilePositionX -= this.originX;
        }
        if(this.tilePositionX < 0) {
            this.tilePositionX += this.originX;
        }

        if(this.tilePositionY > this.originY) {
            this.tilePositionY -= this.originY;
        }

        if(this.tilePositionY < 0) {
            this.tilePositionY += this.originY;
        }
    }

    public setScrollSpeed(scrollSpeed:Phaser.Math.Vector2): void {
        this.scrollSpeed = scrollSpeed;
    }
  }
  