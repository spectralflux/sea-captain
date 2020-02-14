import Phaser from 'phaser';
import trainer from './trainer';

var isGameOver;
var score;

export default {
    key: 'play',

    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },

    init: function () {
        isGameOver = false;
        score = 0;
    },

    create: function () {
        this.add.image(400, 300, 'boat');
        trainer.trainModel();
    },

    update: function () {
        if (isGameOver) {
            this.scene.stop().run('end');
            return;
        }
    }
};