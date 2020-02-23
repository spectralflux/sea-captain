import Phaser from 'phaser';
import trainer from './trainer';

let trainText;
let predictionText;
let portButtonText;
let starboardButtonText;
let doneButtonText;

let portButton;
let starboardButton;
let doneButton;

let portGraphics;
let starboardGraphics;
let doneGraphics;

export default {
    key: 'train',

    init: function () {
    },

    create: function () {
        portGraphics = this.add.graphics({ lineStyle: { width: 2, color: 0xFFF1E8 }, fillStyle: { color: 0x1D2B53 } });
        starboardGraphics = this.add.graphics({ lineStyle: { width: 2, color: 0xFFF1E8 }, fillStyle: { color: 0x1D2B53 } });
        doneGraphics = this.add.graphics({ lineStyle: { width: 2, color: 0xFFF1E8 }, fillStyle: { color: 0x1D2B53 } });

        trainText = this.add.text(30, 240, 'Captain! The sailors need to know \n your commands for port and starboard!', {
            fontSize: '32px',
            fill: '#FFF1E8'
        });

        this.cameras.main.setBackgroundColor(0x29ADFF);

        portButton = new Phaser.Geom.Rectangle(270, 340, 200, 20);
        starboardButton = new Phaser.Geom.Rectangle(270, 380, 200, 20);
        doneButton = new Phaser.Geom.Rectangle(270, 420, 200, 20);

        portGraphics.fillRectShape(portButton);
        starboardGraphics.fillRectShape(starboardButton);
        doneGraphics.fillRectShape(doneButton);

        portGraphics.strokeRectShape(portButton);
        starboardGraphics.strokeRectShape(starboardButton);
        doneGraphics.strokeRectShape(doneButton);

        portButtonText = this.add.text(280, 344, 'Add Port Example', {
            fontSize: '12px',
            fill: '#FFF1E8'
        });

        starboardButtonText = this.add.text(280, 384, 'Add Starboard Example', {
            fontSize: '12px',
            fill: '#FFF1E8'
        });

        doneButtonText = this.add.text(280, 424, 'Enough! Full speed ahead!', {
            fontSize: '12px',
            fill: '#FFF1E8'
        });

        predictionText = this.add.text(10, 10, '', {
            fontSize: '16px',
            fill: '#FFF1E8'
        });

        portGraphics.setInteractive(portButton, Phaser.Geom.Rectangle.Contains);
        starboardGraphics.setInteractive(starboardButton, Phaser.Geom.Rectangle.Contains);
        doneGraphics.setInteractive(doneButton, Phaser.Geom.Rectangle.Contains);

        portGraphics.on('pointerout', function (pointer) {
        });
    
        portGraphics.on('pointerdown', function (pointer) {
            trainer.addExample(0);
        });

        portGraphics.on('pointerup', function (pointer) {
        });

        starboardGraphics.on('pointerdown', function (pointer) {
            trainer.addExample(1);
        });

        doneGraphics.on('pointerdown', function (pointer) {
            trainer.doneAddingExamples();
        });

        trainer.trainModel();
    },

    update: function () {
        if (trainer.isDoneTraining()) {
            this.scene.start('play');
        } else {
            predictionText.setText(trainer.getPredictionText());
        }
    }
};
