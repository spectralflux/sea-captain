import Phaser from 'phaser';
import trainer from './trainer';

const BOAT_HEALTH_TEXT = 'Boats Remaining:';
const SCORE_TEXT = 'Score:';
const MOVE_PORT = -20;
const MOVE_STARBOARD = 20;

let isGameOver;
let score;
let boat;
let boatHealth;
let boatSpeed;
let healthText;
let scoreText;
let rockTimerEvent;
let rockGroup;

function makeSteeringPrediction(boat) {
    // make model prediction from webcam, then adjust steering accordingly.
    trainer.getPrediction().then(function (prediction) {
        if (prediction.label === "0") {
            boat.setVelocityX(MOVE_PORT);
        } else if (prediction.label === "1") {
            boat.setVelocityX(MOVE_STARBOARD);
        }
    });
}

function getHealthText(boatHealth) {
    return `${BOAT_HEALTH_TEXT} ${boatHealth}`;
}

function getScoreText(score) {
    return `${SCORE_TEXT} ${score}`;
}

function resetPlayField() {
    rockGroup.clear();
}

function addRock(rockGroup, boatSpeed) {
    let initX = Phaser.Math.Between(16, 800 - 16);
    let rock = Phaser.Math.RND.pick(['bigrock', 'smallrock'])
    rockGroup.create(initX, 0, rock).setVelocity(0, boatSpeed);
}

function hitRock() {
    console.log("Hit!");
    boatHealth--;
    healthText.setText(getHealthText(boatHealth));
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
    },

    create: function () {
        boat = this.physics.add.sprite(400, 450, 'boat').setSize(16, 48);
        boat.setCollideWorldBounds(true);

        this.cameras.main.setBackgroundColor(0x29ADFF)

        healthText = this.add.text(16, 16, getHealthText(boatHealth), {
            fontSize: '16px',
            fill: '#FFFFFF'
        });

        scoreText = this.add.text(16, 40, getScoreText(score), {
            fontSize: '16px',
            fill: '#FFFFFF'
        });

        rockGroup = this.physics.add.group({
            collideWorldBounds: false
        });

        this.physics.add.overlap(boat, rockGroup, hitRock, null, this);

        rockTimerEvent = this.time.addEvent({
            delay: 1500,
            callback: addRock,
            args: [rockGroup, boatSpeed],
            callbackScope: null,
            loop: true
        });

        this.time.addEvent({
            delay: 100,
            callback: makeSteeringPrediction,
            args: [boat],
            callbackScope: null,
            loop: true
        });
    },

    update: function () {
        if (isGameOver) {
            console.log("Game Over!");
            this.scene.stop().run('gameOver');
            return;
        }

        // remove rocks that have left the screen, and add to score
        rockGroup.getChildren().filter(rock => rock.getTopCenter().y >= 600).forEach(rock => {
            rock.destroy();
            score++;
            scoreText.setText(getScoreText(score));

            // if (score % 10) {
            //     rockTimerEvent.delay = rockTimerEvent.delay - 100;
            // }
        });
    }
};
