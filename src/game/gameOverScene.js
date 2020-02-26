let gameOverText;

export default {

    key: 'gameOver',

    create: function () {
        gameOverText = this.add.text(240, 200, "That's it, we've sunk!", {
            fontSize: '24px',
            fill: '#FFF1E8'
        });

        this.add.text(310, 300, "Click to restart", {
            fontSize: '16px',
            fill: '#FFF1E8'
        });

    },

    update: function () {
        this.input.on('pointerup', function () {
            this.scene.start('play');
        }, this);
    }
};
