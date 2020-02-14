export default {

  key: 'boot',

  preload: function () {
    var bg = this.add.rectangle(400, 300, 400, 30, 0x666666);
    var bar = this.add.rectangle(bg.x, bg.y, bg.width, bg.height, 0xffffff).setScale(0, 1);

    this.load.image('boat', require('../assets/boat.png'));

    this.load.on('progress', function (progress) {
      bar.setScale(progress, 1);
    });
  },

  create: function () {
  
  },

  update: function () {
    this.scene.start('play');
  }
};
