export default class VirtualPad {
    constructor(game) {
        const _name = 'controller';
        this.buttonType = {
            a: "a",
            b: "b",
            start: "start",
            select: "select"
        }
        this.atlasSettings = {
            name: _name,
            path: "assets/sprites/" + _name + '/',
            
            fileName: _name + '.png',
            jsonName: _name + '.json',
            axis: 'axis',
            cell: 'cell',
            startselect: 'startselect',
            startselectDowm: 'startselect_down',
            a: 'button_a',
            aDown: 'button_adown',
            b: 'button_b',
            bDown: 'button_bdown',
            body: 'body',
        }
        this.game = game;
        this.inputCount = 0;
        this.objectScale = 1.8;
    }

    preload(game) {
        this.game.load.atlasJSONHash(
            this.atlasSettings.name,
            this.atlasSettings.path + this.atlasSettings.fileName,
            this.atlasSettings.path + this.atlasSettings.jsonName);
    }

    create(phaserState) {
        this.layer = this.game.add.group();
        let center = { x: this.game.world.centerX, y: this.game.world.centerY }
        let offset = 200;
        this.setupBody(phaserState, center.x, center.y, this.atlasSettings.atlasName, this.atlasSettings.body);
        this.setupAxisButton(phaserState, -200 + center.x, offset + center.y, this.atlasSettings.name, this.atlasSettings.cell, this.atlasSettings.cell);
        this.setupButton(phaserState, center.x + 130, offset + center.y, this.atlasSettings.name, this.atlasSettings.b, this.atlasSettings.bDown, this.buttonType.b, 0);
        this.setupButton(phaserState, center.x + 250, offset - 50 + center.y, this.atlasSettings.name, this.atlasSettings.a, this.atlasSettings.aDown, this.buttonType.a, 0);
        this.setupButton(phaserState, center.x - 100, offset + 180 + center.y, this.atlasSettings.name, this.atlasSettings.startselect, this.atlasSettings.startselectDowm, this.buttonType.select, -30);
        this.setupButton(phaserState, center.x + 20, offset + 180 + center.y, this.atlasSettings.name, this.atlasSettings.startselect, this.atlasSettings.startselectDowm, this.buttonType.start, -30);
        
        this.onButtonClick = (buttonType) => { };
        this.onButtonDown = (buttonType) => { };
        this.onButtonUp = (buttonType) => { };
        
        this.game.stage.addChild(this.layer);

    }

    render() {
        // デバック表示
    }

    setupBody(state, x, y, atlasName, spriteName) {
        this.body = state.game.add.sprite(x, y, this.atlasSettings.name, this.atlasSettings.body);
        this.body.anchor.set(0.5);
        this.body.scale.set(2);
        this.layer.add(this.body);
    }

    setupAxisButton(state, x, y, atlasName, buttonName, downButtonName) {
        this.axis = state.game.add.sprite(x, y, this.atlasSettings.name, this.atlasSettings.axis + '/0004');
        this.axis.animations.add(this.atlasSettings.axis, Phaser.Animation.generateFrameNames(this.atlasSettings.axis + '/', 0, 8, '', 4), 10, true, false);
        this.axis.animations.frame = 4;
        //axis.animations.play(this.atlasSettings.axis);
        this.axis.anchor.set(0.5);
        this.axis.scale.set(this.objectScale);
        this.layer.add(this.axis);
        
        let size = 80;
        for(let index = 0; index < 9; index++) {
            let button = state.game.add.button(
                x + (size * (index%3 - 1)),
                y + (size * (Math.floor(index/3) - 1)),
                atlasName,
                () => {},
                this,
                buttonName,
                buttonName,
                downButtonName,
                buttonName);
            
            button.events.onInputOver.add(() => {
                this.axis.frame = index;
                this.inputCount += 1;
                //console.log('over ' + index + "count " + this.inputCount);
            },
            this);

            button.events.onInputDown.add(() => {
                this.axis.frame = index;
                //console.log('down ' + index);
            },
            this);

            let countDown = () => {
                this.inputCount -= 1;
                if(this.inputCount <= 0 ) {
                    this.axis.frame = 4;
                    this.inputCount = 0;
                }
                //console.log('up ' + index + "count " + this.inputCount);
            }

            button.events.onInputOut.add(countDown,this);
            button.events.onInputUp.add(countDown,this);
 
            button.anchor.set(0.5);
            button.alpha = 0;
            this.layer.add(button);
            
        }
    }

    setupButton(state, x, y, atlasName, buttonName, downButtonName, buttonType, rotate) {
        let button = state.game.add.button(
            x,
            y,
            atlasName,
            () => this.actionOnClick(buttonType),
            this,
            buttonName,
            buttonName,
            downButtonName,
            buttonName);
        
        button.events.onInputDown.add(() => this.onInputDown(buttonType));
        button.events.onInputUp.add(() => this.onInputUp(buttonType));
        button.anchor.set(0.5);
        button.angle = rotate;
        button.scale.set(this.objectScale);   
        this.layer.add(button);
    }

    actionOnClick(buttonType) {
        console.log('push button ' + buttonType);
        this.onButtonClick(buttonType);
    }

    onInputDown(buttonType) {
        console.log('down button ' + buttonType);
        this.onButtonDown(buttonType);
    }

    onInputUp(buttonType) {
        console.log('up button ' + buttonType);
        this.onButtonUp(buttonType);     
    }

    update() {

    }

    renderer() {

    }

    horizontal () {
        return (this.axis.frame%3 - 1);
    }

    vertical () {
        return -(Math.floor(this.axis.frame/3) - 1);
    }
}