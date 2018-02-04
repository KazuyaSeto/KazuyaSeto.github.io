export default class BootState extends Phaser.State {
    constructor(nextState) {
        super();
        this.nextState = nextState;
    }

    create() {
        //this.game.scale.forceOrientation(false, true);
        if(!Phaser.Device.desktop){
            this.game.scale.enterIncorrectOrientation.add(function(){
                this.game.paused = true;
                this.document.querySelector("canvas").style.display = "none";
                this.document.getElementById("wrongorientation").style.display = "block";
            })

            this.game.scale.leaveIncorrectOrientation.add(function(){
                this.game.paused = false;
                this.document.querySelector("canvas").style.display = "block";
                this.document.getElementById("wrongorientation").style.display = "none";
            })
        }
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;
        this.game.stage.disableVisibilityChange = true;
        this.game.state.start(this.nextState);
    }
}