import Phaser from 'phaser';
import trainer from './trainer';

var isGameOver;
var score;
var boat;
var boatHealth;
var rocks;

var rockTimer;

function addRock(scene, rockArray) {
    let rock = scene.physics.add.sprite(400, 0, 'bigrock').setSize(16, 48);
    rock.setVelocityY(18);
    rockArray.push(rock);
};

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
        boatHealth = 3;

        rockTimer = 100;
        rocks = [];
    },

    create: function () {
        trainer.trainModel();

        boat = this.physics.add.sprite(400, 450, 'boat').setSize(16, 48);
        boat.setCollideWorldBounds(true);

        this.cameras.main.setBackgroundColor(0x1D2B53)
    },

    update: function () {
        if (isGameOver) {
            this.scene.stop().run('gameOver');
            return;
        }

        if (rockTimer <= 0) {
            addRock(this, rocks);
            rockTimer = 100;
        } else {
            rockTimer--;
        }

        if (trainer.isDoneTraining()) {
            trainer.getPrediction().then(function (prediction) {
                if (prediction.label === "0") {
                    boat.setVelocityX(-20);
                } else if (prediction.label === "1") {
                    boat.setVelocityX(20);
                }
            });
        }
    }
};
