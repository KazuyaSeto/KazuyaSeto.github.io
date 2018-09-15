import { GameScene } from "../scenes/gameScene";
import { Enemy, EnemyType } from "../objects/enemy";
import { BackGround } from "../objects/backGround";
import { MissionType } from "./director";

// 敵キャラや障害物の生成
export class StageCreator {
    private bg : BackGround = null;
    private gameSpeed: number = 10;
    
    private gameScene:GameScene = null;
    private timerEvent:Phaser.Time.TimerEvent;
    private enemies: Phaser.GameObjects.Group;

    private missionType:MissionType;
    
    constructor() {
        this.timerEvent = null;
    }

    public init(gameScene:GameScene) : void {
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
        this.gameSpeed = speed;
        this.bg.setScrollSpeed(new Phaser.Math.Vector2(0, -speed));
        this.getEnemies().getChildren().forEach( (gameobject, index) => {
            let enemy = gameobject as Enemy;
            enemy.setVelocity(0, speed * 100);
        } );
    }

    public startStage(missionType:MissionType): void {
        this.missionType = missionType;
        if(missionType == MissionType.AsteroidBelt) {
            this.setGameSpeed(6);
        } else if(missionType == MissionType.ShottingDown) {
            this.setGameSpeed(5);
        } else {
            this.setGameSpeed(3);
        }

        if(this.timerEvent != null){
            this.timerEvent.destroy();
            this.timerEvent = null;
        }

        this.timerEvent = this.gameScene.time.addEvent(
            {
                delay: 2000/this.getGameSpeed(),
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
        if(this.missionType == MissionType.ShottingDown) {
            let enemyTypes = [EnemyType.ufored, EnemyType.ufogreen, EnemyType.meteo];
            var type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
            let select = Phaser.Math.RND.integerInRange(0,2);
            for(let index = 0; index < 3; index++) {
                if(select == index) {
                    this.createEnemy(index,type);
                }
            }
        } else if(this.missionType == MissionType.AsteroidBelt) {
            let enemyTypes = [EnemyType.meteo];
            var type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
            let select = Phaser.Math.RND.integerInRange(0,2);
            for(let index = 0; index < 3; index++) {
                if(select != index) {
                    this.createEnemy(index,type);
                }
            }
        } else {
            let enemyTypes = [EnemyType.ufored, EnemyType.ufogreen];
            var type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
            let select = Phaser.Math.RND.integerInRange(0,2);
            for(let index = 0; index < 3; index++) {
                if(select != index) {
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