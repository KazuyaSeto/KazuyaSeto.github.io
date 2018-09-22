import { MissionType } from "../system/director";

export class MainUI extends Phaser.GameObjects.Group {
    private missionStartText: Phaser.GameObjects.BitmapText;
    private missionText: Phaser.GameObjects.BitmapText;
    private missionCounter: number = 0;
    
    private moneyText: Phaser.GameObjects.BitmapText;
    private addMoneyText: Phaser.GameObjects.BitmapText;
    private addMoneyAmount: number = 0;
    private addMoneyCounter: number = 0;

    constructor(params) {
        super(params.scene);
    }

    public create() : void {
        this.createMoneyUI();
    }

    public update() : void {
        this.addMoneyCounter--;
        if(this.addMoneyCounter <= 0) { 
          this.addMoneyAmount = 0;
          this.addMoneyCounter = 0;
          this.addMoneyText.setVisible(false);
        }

        this.missionCounter--;
        if(this.missionCounter <= 0) {
            this.missionCounter = 0;
            this.missionStartText.setVisible(false);
            this.missionText.setVisible(false);
        }
    }

    private createMoneyUI(): void {
        let width = this.scene.sys.canvas.width;
        let height = this.scene.sys.canvas.height;
        this.moneyText = this.scene.add.bitmapText(width, 0, "font", '$'+0, 40);
        this.moneyText.setOrigin(1,0);
        this.moneyText.setDepth(1000);
        this.addMoneyText = this.scene.add.bitmapText(width, 40, "font", '+'+0, 40);
        this.addMoneyText.setOrigin(1,0);
        this.addMoneyText.setTint(0x00ff00);
        this.addMoneyText.setDepth(1000);
        this.missionStartText = this.scene.add.bitmapText(width/2, height/2 - 40, "font", '', 40);
        this.missionStartText.setOrigin(0.5,1);
        this.missionStartText.setTint(0xff00ff);
        this.missionStartText.setDepth(1000);
        this.missionText = this.scene.add.bitmapText(width/2, height/2, "font", '', 40);
        this.missionText.setOrigin(0.5,1);
        this.missionText.setTint(0xff00ff);
        this.missionText.setDepth(1000);
    }

    public setMoneyText(money:number, addMoney:number) : void {
        this.addMoneyCounter = 60;
        this.addMoneyAmount += addMoney;
        this.addMoneyText.setVisible(true);
        this.moneyText.setText('$'+money);
        this.addMoneyText.setText('+'+ this.addMoneyAmount);
    }

    public startMission(missionType:MissionType, missionCount:integer) {
        this.missionCounter = 120;
        this.missionStartText.text = 'Mission ' + missionCount;
        this.missionStartText.setVisible(true);
        this.missionStartText.setOrigin(0.5,1);  
        if(missionType == MissionType.AsteroidBelt) {
            this.missionText.text = 'Avoid Asteroids';
        } else if(missionType == MissionType.ShottingDown) {
            this.missionText.text = 'Shoot Down';
        } else if(missionType == MissionType.Wanted) {
            this.missionText.text = 'Wanted';
        }
        this.missionText.setVisible(true);
        this.missionText.setOrigin(0.5,1);    
    }

    public clearMission() : void {
        this.missionCounter = 120;
        this.missionStartText.text = 'Mission Clear';
        this.missionStartText.setVisible(true);  
        this.missionStartText.setOrigin(0.5,1);    
    }

    public failureMission() : void {
        this.missionCounter = 120;
        this.missionStartText.text = 'Mission Failure';
        this.missionStartText.setVisible(true);  
        this.missionStartText.setOrigin(0.5,1);  
    }
} 