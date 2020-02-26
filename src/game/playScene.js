import Phaser from 'phaser';
import trainer from './trainer';

const BOAT_HEALTH_TEXT = 'Boats Remaining:';
const SCORE_TEXT = 'Score:';
const MOVE_PORT = -20;
const MOVE_STARBOARD = 20;
const INIT_BOAT_SPEED = 10;
const BOAT_SPEED_INCREASE_INCREMENT = 10;

let isGameOver;
let score;
let boat;
let boatHealth;
let boatSpeed;
let healthText;
let scoreText;
let rockTimerEvent;
let rockGroup;
let topGraphics;
let topBar;
let boatAngle;
let isBoatSpinning;
let totalBoatSpin;

function makeSteeringPrediction(boat) {
    // make model prediction from webcam, then adjust steering accordingly.
    trainer.getPrediction().then(function (prediction) {
        if (prediction.label === "0") {
            boat.setVelocityX(MOVE_PORT);
            if (!isBoatSpinning) {
                boat.angle = -15.0;
            }
        } else if (prediction.label === "1") {
            boat.setVelocityX(MOVE_STARBOARD);
            if (!isBoatSpinning) {
                boat.angle = 15.0;
            }
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
    rockGroup.clear(true, true);
}

function addRock(rockGroup, boatSpeed) {
    let initX = Phaser.Math.Between(16, 800 - 16);
    let rock = Phaser.Math.RND.pick(['bigrock', 'smallrock'])
    rockGroup.create(initX, 0, rock).setVelocity(0, boatSpeed).setDepth(2);
}

function hitRock() {
    boatHealth--;

    isBoatSpinning = true;
    this.time.addEvent({
        delay: 80,
        callback: spinBoat,
        callbackScope: null,
        repeat: 12
    });

    healthText.setText(getHealthText(boatHealth));
    resetPlayField(rockGroup);
    if (boatHealth <= 0) {
        isGameOver = true;
    }
}

function increaseBoatSpeed() {
    boatSpeed = boatSpeed + BOAT_SPEED_INCREASE_INCREMENT;
    rockGroup.getChildren().forEach(rock => {
        rock.setVelocity(0, boatSpeed);
    });
}

function spinBoat() {
    if (isBoatSpinning) {
        let spin = 60;
        boat.angle = boat.angle + spin;
        totalBoatSpin += spin;
        if (totalBoatSpin >= 600) {
            isBoatSpinning = false;
            totalBoatSpin = 0;
            boat.angle = 0;
        }
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
        boatSpeed = INIT_BOAT_SPEED;
        boatAngle = 0.0;
        isBoatSpinning = false;
        totalBoatSpin = 0;
    },

    create: function () {
        topGraphics = this.add.graphics({ lineStyle: { width: 2, color: 0x000000 }, fillStyle: { color: 0x000000 } });
        topBar = new Phaser.Geom.Rectangle(0, 0, 800, 50);
        topGraphics.fillRectShape(topBar);
        topGraphics.setDepth(4)

        boat = this.physics.add.sprite(400, 450, 'boat').setSize(16, 48).setDepth(3);
        boat.setCollideWorldBounds(true);

        this.cameras.main.setBackgroundColor(0x29ADFF)

        healthText = this.add.text(16, 8, getHealthText(boatHealth), {
            fontSize: '16px',
            fill: '#FFFFFF'
        });

        scoreText = this.add.text(16, 30, getScoreText(score), {
            fontSize: '16px',
            fill: '#FFFFFF'
        });

        healthText.setDepth(5);
        scoreText.setDepth(5);

        rockGroup = this.physics.add.group({
            collideWorldBounds: false
        });

        this.physics.add.overlap(boat, rockGroup, hitRock, null, this);

        rockTimerEvent = this.time.addEvent({
            delay: 1200,
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

        // boat will continuously speed up
        this.time.addEvent({
            delay: 2000,
            callback: increaseBoatSpeed,
            args: [],
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
