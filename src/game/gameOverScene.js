let gameOverText;

export default {

    key: 'gameOver',

    create: function () {
        gameOverText = this.add.text(240, 200, "That's it, we've sunk!", {
            fontSize: '24px',
            fill: '#FFF1E8'
        });

    },

    update: function () {

    }
};
