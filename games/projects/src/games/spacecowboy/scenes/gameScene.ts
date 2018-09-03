export class GameScene extends Phaser.Scene {
  private bg: Phaser.GameObjects.TileSprite;

  private score: number;
  private scoreText: Phaser.GameObjects.Text[];

  constructor() {
    super({
      key: "GameScene"
    });
  }

  init(): void {
    this.bg = null;
    this.score = -1;
    this.scoreText = [];
  }

  create(): void {
    this.bg = this.add.tileSprite(0, 0, 135, 200, "background");
    this.bg.setScale(6);

    this.scoreText.push(
      this.add.text(this.sys.canvas.width / 2 - 14, 30, "0", {
        fontFamily: "Connection",
        fontSize: "40px",
        fill: "#000"
      })
    );
    this.scoreText.push(
      this.add.text(this.sys.canvas.width / 2 - 16, 30, "0", {
        fontFamily: "Connection",
        fontSize: "40px",
        fill: "#fff"
      })
    );
  }

  update(): void {
  }
}
