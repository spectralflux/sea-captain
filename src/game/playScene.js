import Phaser from 'phaser';
import trainer from './trainer';

var isGameOver;
var score;
var boat;

export default {
    key: 'play',

    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },

    init: function () {
        isGameOver = false;
        score = 0;
    },

    create: function () {
        trainer.trainModel();

        boat = this.physics.add.sprite(400, 450, 'boat').setSize(16, 48);
        boat.setCollideWorldBounds(true);
    },

    update: function () {
        if (isGameOver) {
            this.scene.stop().run('end');
            return;
        }

        if (trainer.isDoneTraining()) {
            trainer.getPrediction().then(function(prediction) {
                console.log("prediction: ", prediction)
                if(prediction.label === "0") {
                    boat.setVelocityX(-20);
                } else if(prediction.label === "1") {
                    boat.setVelocityX(20);
                }
            });
        }
    }
};