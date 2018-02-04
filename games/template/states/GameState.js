import RainbowText from "./../../common/objects/RainbowText.js";
import VirtualPad from "./../../common/objects/VirtualPad.js";

export default class GameState extends Phaser.State {
    preload() {
        this.pad = new VirtualPad(this.game);
        this.pad.preload();
        this.playarName = "playan";
        this.assetPath = "assets/sprites/" + this.playarName + '/';
        this.game.load.atlasJSONHash(
            this.playarName,
            this.assetPath + this.playarName + ".png",
            this.assetPath + this.playarName + ".json");
        this.game.load.image('starfield', 'assets/sprites/background.png');
        this.game.load.image('pause', 'assets/sprites/pause.png');
        
        this.playanAnimation = {
            idle: "idle",
            run: "run",
            stay: "stay",
            jump: "jump",
        }

        this.sounds = {
            jump: "jump",
            pause: "pause",
            dash: "dash",
            bgm: "bgm",
        }

        let soundPath = "assets/sounds/";
        this.game.load.audio(this.sounds.jump, soundPath + this.sounds.jump + ".wav");
        this.game.load.audio(this.sounds.pause, soundPath + this.sounds.pause + ".wav");
        this.game.load.audio(this.sounds.dash, soundPath + this.sounds.dash + ".wav");
        this.game.load.audio(this.sounds.bgm, soundPath + this.sounds.bgm + ".mp3");
        
    }

	create() {
        this.game.stage.backgroundColor = 0x9cb916;
		let center = { x: this.game.world.centerX, y: this.game.world.centerY }
        this.field = this.game.add.tileSprite(center.x, -240+center.y, 320, 300, 'starfield');
        
        this.field.scale.set(1.8);
        this.field.anchor.set(0.5);

        this.pause = this.game.add.image(center.x, -240+center.y, 'pause');
        this.pause.scale.set(1.8);
        this.pause.anchor.set(0.5);
        this.pause.alpha = 0;

        this.player = this.game.add.sprite(center.x, -200+center.y, this.playarName, "idle/0000");
        this.player.animations.add(
            this.playanAnimation.idle,
            Phaser.Animation.generateFrameNames(this.playanAnimation.idle + "/", 0, 4, '', 4), 10, true, false);
        this.player.animations.add(
            this.playanAnimation.run,
            Phaser.Animation.generateFrameNames(this.playanAnimation.run + "/", 0, 2, '', 4), 10, true, false);
        this.player.animations.add(
            this.playanAnimation.stay,
            Phaser.Animation.generateFrameNames(this.playanAnimation.stay + "/", 0, 0, '', 4), 10, true, false);
        this.player.animations.add(
            this.playanAnimation.jump,
            Phaser.Animation.generateFrameNames(this.playanAnimation.jump + "/", 0, 0, '', 4), 10, false, false);
        this.player.anchor.set(0.5, 0);
        this.player.animations.play(this.playanAnimation.idle);
        this.v = 0;
        this.h = 0;

        this.jumpSound = this.game.add.audio(this.sounds.jump);
        this.dashSound = this.game.add.audio(this.sounds.dash);
        this.pauseSound = this.game.add.audio(this.sounds.pause);
        this.bgmSound = this.game.add.audio(this.sounds.bgm);
        this.bgmSound.loopFull();
        
        this.pauseSound.onStop.add((sound) => {
            this.pause.alpha = (this.state.game.paused) ? 0 : 1;
            this.state.game.paused = !this.state.game.paused;
        });

        this.jump = false;   
        this.dash = false;
        this.pad.create(this);
        this.pad.onButtonDown = (buttonType) => {
            if(buttonType == this.pad.buttonType.b) {
                this.dash = true;
                this.dashSound.play();
            }

            if(buttonType == this.pad.buttonType.start) {
                this.pauseSound.play();
            }

            if(buttonType == this.pad.buttonType.a) {
                if(this.state.game.paused) return;
                if(this.jump) return; 
                let anim = this.player.animations.play(this.playanAnimation.jump, 2);
                this.jump = true;
                this.jumpSound.play();
                this.game.add.tween(this.player).to( { y: -400+center.y }, 130, Phaser.Easing.Quartic.Out, true, 0, 0, true)
                .onComplete.add(() => {
                    this.jump = false;
                });
            }
        }

        this.pad.onButtonUp = (buttonType) => {
            if(buttonType == this.pad.buttonType.b) {
                this.dash = false;
            }
        }
    }

    update() {
        this.pad.update();
        // 背景のスクロール処理
        if(this.pad.horizontal() != 0 && this.pad.vertical() > -1) {
            let speed = 4;
            if(this.dash) speed *= 2;
            this.field.tilePosition.x += speed * -this.pad.horizontal();
        }

        // アニメーションの処理
        if(this.jump) return;
        if(this.pad.vertical() < 0) {
            this.player.animations.play(this.playanAnimation.stay);     
            return ;       
        }

        if(this.pad.horizontal() != 0) {
            this.player.scale.set(this.pad.horizontal(),1);
            if(this.player.animations.currentAnim.name != this.playanAnimation.run) {
                this.player.animations.play(this.playanAnimation.run);
            }
        } else {
            this.player.animations.play(this.playanAnimation.idle);
        }
        if(this.v != this.pad.vertical() || this.h != this.pad.horizontal()) {
            this.v = this.pad.vertical();
            this.h = this.pad.horizontal();
        }
    }
}