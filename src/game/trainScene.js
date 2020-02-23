import Phaser from 'phaser';
import trainer from './trainer';

let trainText;

export default {
    key: 'train',

    init: function () {
    },

    create: function () {
        trainText = this.add.text(250, 300, `Train Your Boat!`, {
            fontSize: '32px',
            fill: '#FFFFFF'
        });

        this.cameras.main.setBackgroundColor(0x29ADFF)
        trainer.trainModel();
    },

    update: function () {
        if (trainer.isDoneTraining()) {
            this.scene.start('play');
        }
    }
};
