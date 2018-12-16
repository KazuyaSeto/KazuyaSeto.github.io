import { GameScene } from "../scenes/gameScene";
import { Enemy, EnemyType } from "../objects/enemy";
import { BackGround } from "../../gameSystem/backGround";
import { MissionType, MissionData } from "./director";

// 敵キャラや障害物の生成
export class StageCreator {
    private bg : BackGround = null;
    private gameSpeed: number = 10;
    
    private gameScene:GameScene = null;
    private timerEvent:Phaser.Time.TimerEvent;
    private enemies: Phaser.GameObjects.Group;
    private counter:integer;

    private missionData:MissionData = null;    
    
    constructor() {
        this.timerEvent = null;
    }

    public init(gameScene:GameScene) : void {
        this.counter = 0;
        this.gameScene = gameScene;
        this.enemies = this.gameScene.add.group({ runChildUpdate: true });
        this.createBackGround();
    }

    public update() : void {
        this.bg.update();
    }

    private getGameSpeed(): number {
        return this.gameSpeed;
    }
    
    public setGameSpeed(speed:number) : void{
        this.counter = 0;        
        this.gameSpeed = speed;
        this.bg.setScrollSpeed(new Phaser.Math.Vector2(0, -speed));
        this.getEnemies().getChildren().forEach( (gameobject, index) => {
            let enemy = gameobject as Enemy;
            enemy.setVelocity(0, speed * 100);
        } );
    }

    public startStage(missionData:MissionData, missionCount:integer): void {
        this.missionData = missionData;
        this.setGameSpeed(this.missionData.speed + missionCount * 0.1);

        if(this.timerEvent != null){
            this.timerEvent.destroy();
            this.timerEvent = null;
        }

        this.timerEvent = this.gameScene.time.addEvent(
            {
                delay: this.missionData.createSpeed - (missionCount * 5),
                callback: this.createEnemies,
                callbackScope: this,
                loop: false,
                repeat: 15
            });
    }

    public isCompleted(): boolean {
        if(this.timerEvent != null) {
            return this.timerEvent.getProgress() >= 1;
        } else {
            return false;
        }
    }

    public getEnemies(): Phaser.GameObjects.Group {
        return this.enemies;
    }

    private createEnemies(): void {
        if(this.missionData.type == MissionType.ShottingDown) {
            var type = this.missionData.enemyTypes[Math.floor(Math.random() * this.missionData.enemyTypes.length)];
            
            let select : integer = Math.floor(this.counter / 5);
            for(let index = 0; index < 3; index++) {
                if(select == index) {
                    this.createEnemy(index,type);
                }
            }
            this.counter++;            
        } else if(this.missionData.type == MissionType.AsteroidBelt) {
            var type = this.missionData.enemyTypes[Math.floor(Math.random() * this.missionData.enemyTypes.length)];
            let select = Phaser.Math.RND.integerInRange(0,2);
            for(let index = 0; index < 3; index++) {
                if(select != index) {
                    this.createEnemy(index,type);
                }
            }
        } else {
            var type = this.missionData.enemyTypes[Math.floor(Math.random() * this.missionData.enemyTypes.length)];
            let select = Phaser.Math.RND.integerInRange(0,2);
            for(let index = 0; index < 3; index++) {
                if(select == index) {
                    this.createEnemy(index,type);
                }
            }            
        }
    }

    private createEnemy(index:number, type:EnemyType): void {
        let width = this.gameScene.sys.canvas.width;
        let height = this.gameScene.sys.canvas.height;
        let enemy = new Enemy({
            scene: this.gameScene,
            x: (width/3)*index+width/6,
            y: -50,
            key: 'atlas',
            speed: this.getGameSpeed(),
            enemyType: type
          });
        this.enemies.add(enemy);
    }

    private createBackGround(): void {
        let width = this.gameScene.sys.canvas.width;
        let height = this.gameScene.sys.canvas.height;
        this.bg = new BackGround({
            scrollSpeed: new Phaser.Math.Vector2(0, -10),
            scene:this.gameScene, 
            x: width/2,
            y: height/2,
            width: width,
            height: height,
            texture: 'bg'});
    }
}