import Phaser from 'phaser';
import trainer from './trainer';

var isGameOver;
var score;
var boat;
var boatHealth;
var boatSpeed;
var healthText;

var rockTimer;

var rockGroup;

function resetPlayField() {
    rockGroup.clear();
};

function addRock(rockGroup, boatSpeed) {
    let initX = Phaser.Math.Between(16,800-16);
    rockGroup.create(initX, 0, 'bigrock').setVelocity(0, boatSpeed);
};

function hitRock() {
    console.log("Hit!");
    boatHealth--;
    healthText.setText('Boats Remaining: ' + boatHealth);
    resetPlayField(rockGroup);
    if (boatHealth <= 0) {
        isGameOver = true;
    }
}

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
        boatSpeed = 50;

        rockTimer = 100;
    },

    create: function () {
        trainer.trainModel();

        boat = this.physics.add.sprite(400, 450, 'boat').setSize(16, 48);
        boat.setCollideWorldBounds(true);

        this.cameras.main.setBackgroundColor(0x29ADFF)

        healthText = this.add.text(16, 16, 'Boats Remaining: ' + boatHealth, { fontSize: '32px', fill: '#FFFFFF' });

        rockGroup = this.physics.add.group({
            collideWorldBounds: false
        });

        this.physics.add.overlap(boat, rockGroup, hitRock, null, this);

    },

    update: function () {
        if (isGameOver) {
            console.log("Game Over!");
            this.scene.stop().run('gameOver');
            return;
        }

        if (rockTimer <= 0) {
            addRock(rockGroup, boatSpeed);
            rockTimer = 30;
        } else {
            rockTimer--;
        }

        // remove rocks that have left the screen
        rockGroup.getChildren().filter(rock => rock.getTopCenter().y >= 600).forEach(rock => rock.destroy());

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
