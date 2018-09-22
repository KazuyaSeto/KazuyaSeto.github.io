import { StageCreator } from "./stageCreator";
import { GameScene } from "../scenes/gameScene";
import { EnemyType, Enemy } from "../objects/enemy";

export enum GameState {
    Idle,
    MissionStart,
    Mission,
    MissionClear
}

export enum ClearConditions {
    None,
    Target,
    NumKill
}

export enum MissionType {
    AsteroidBelt, // 小惑星帯を抜ける
    Wanted, // お尋ね者を倒す
    ShottingDown // 撃墜ミッション
}

export class MissionData {
    constructor(
        type: MissionType,
        speed: number,
        createCount:integer,
        createSpeed: number,
        enemyTypes:EnemyType[],
        clearConditions:ClearConditions,
        param:integer = 0) {
        this.type = type;
        this.speed = speed;
        this.createCount = createCount;
        this.createSpeed = createSpeed;
        this.enemyTypes = enemyTypes;
        this.clearConditions = clearConditions;
        this.param = param;
        
    }
    type : MissionType;
    speed : number;
    createCount : integer;
    createSpeed : number;
    enemyTypes : EnemyType[];
    clearConditions : ClearConditions;
    param: integer;
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
    private missionCount: integer = 0;
    private missionResult: integer = 1000;
    private missionDatas: MissionData[];
    private nowMissionData: MissionData;
    private killCount: integer = 0;

    constructor() {
        this.missionDatas = [
            new MissionData(
            MissionType.AsteroidBelt,
                6,
                15,
                400,
                [EnemyType.meteo],
                ClearConditions.None),
            new MissionData(
                MissionType.ShottingDown,
                3,
                15,
                400,
                [EnemyType.ufored],
                ClearConditions.NumKill,
                15
            ),
            new MissionData(
                MissionType.Wanted,
                5,
                15,
                300,
                [EnemyType.ufored, EnemyType.ufogreen, EnemyType.meteo],
                ClearConditions.Target
            )
        ];
    }

    public init(gameScene:GameScene): void {
        this.scene = gameScene;
        this.stageCreator.init(gameScene);
        this.missionCount = 0;
        this.missionResult = 1000;
        this.killCount = 0;
        this.nowMissionData = null;
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
        var data = this.missionDatas[Math.floor(Math.random() * this.missionDatas.length)];
        this.nowMissionData = data;
        this.stageCreator.startStage(data, this.missionCount);
        this.scene.getMainUI().startMission(data.type, this.missionCount);
    }

    public update(): void {
        this.stageCreator.update();
        if(this.stageCreator.isCompleted() &&
        this.stageCreator.getEnemies().getChildren().length <= 0 &&
        this.gameState != GameState.Idle) {
            if(this.isMissionClear()) {
                this.scene.getMainUI().clearMission();
                this.scene.addMoney(this.calcMissionResult(this.missionCount));
            } else {
                this.scene.getMainUI().failureMission();
            }
            this.missionCount += 1;
            this.killCount = 0;
            this.createTimer();
        }
    }

    public getStageCreator():StageCreator {
        return this.stageCreator;
    }

    public stopDirection(): void {
        this.bgm.stop();
    }

    public shotDown(enemy:Enemy): void {
        enemy.gotHurt();
        this.scene.sound.play('explosion');
        this.getStageCreator().getEnemies().remove(enemy);
        this.killCount++;
    }

    private isMissionClear(): boolean {
        let player = this.scene.getPlayer();
        if(player == null) return false;
        if(player.getDead()) return false;
        if(this.nowMissionData == null) return false;
        if(this.nowMissionData.clearConditions == ClearConditions.None) return true;
        if(this.nowMissionData.clearConditions == ClearConditions.NumKill) {
            if(this.killCount >= this.nowMissionData.param) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
        
    }

    private calcMissionResult(count:integer): integer {
        if(count == 0) return this.missionResult;
        this.missionResult += count * 100;
        return this.missionResult;
    }
}