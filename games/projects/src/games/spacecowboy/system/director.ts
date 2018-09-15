import { StageCreator } from "./stageCreator";
import { GameScene } from "../scenes/gameScene";

export enum GameState {
    Idle,
    MissionStart,
    Mission,
    MissionClear
}

export enum MissionType {
    AsteroidBelt, // 小惑星帯を抜ける
    Wanted, // お尋ね者を倒す
    ShottingDown // 撃墜ミッション
}

export class MissionData {
    constructor() {

    }
    type : MissionType;
}

/*
ゲーム状態の管理
難易度曲線
一旦ゲームスピードが上がるような設定で作成する
*/
export class Director {
    private stageCreator: StageCreator = new StageCreator();
    private scene: GameScene;
    private bgm : Phaser.Sound.BaseSound;
    private gameState : GameState = GameState.Idle;
    private timerEvent: Phaser.Time.TimerEvent;

    constructor() {

    }

    public init(gameScene:GameScene): void {
        this.scene = gameScene;
        this.stageCreator.init(gameScene);
    }

    public create(): void {
        this.bgm = this.scene.sound.add('bgmMain');
        this.bgm.play('', { loop: true, volume: 0.4 });
        this.createTimer();
    }

    private createTimer() : void {
        this.scene.sound.play('hyperBoost');        
        this.gameState = GameState.Idle;
        this.stageCreator.setGameSpeed(100);        
        this.timerEvent = this.scene.time.addEvent(
            {
                delay: 3000,
                callback: this.timerCallBack,
                callbackScope: this,
                loop: false,
                repeat: 0}
            );
    }

    private timerCallBack() : void {
        this.gameState = GameState.Mission;
        let missionTypes = [MissionType.AsteroidBelt, MissionType.ShottingDown, MissionType.Wanted];
        var type = missionTypes[Math.floor(Math.random() * missionTypes.length)];
        this.stageCreator.startStage(type);
        this.scene.getMainUI().startMission(type);
        
    }

    public update(): void {
        this.stageCreator.update();
        if(this.stageCreator.isCompleted() &&
        this.stageCreator.getEnemies().getChildren().length <= 0 &&
        this.gameState != GameState.Idle) {
            this.scene.getMainUI().clearMission();
            this.scene.addMoney(1000);
            this.createTimer();
        }
    }

    public getStageCreator():StageCreator {
        return this.stageCreator;
    }

    public stopDirection(): void {
        this.bgm.stop();
    }
}