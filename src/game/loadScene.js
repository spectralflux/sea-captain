import trainer from './trainer';

export default {

  key: 'boot',

  preload: function () {
    var bg = this.add.rectangle(400, 300, 400, 30, 0x666666);
    var bar = this.add.rectangle(bg.x, bg.y, bg.width, bg.height, 0xffffff).setScale(0, 1);

    this.load.image('boat', require('../assets/boat.png'));
    this.load.image('bigrock', require('../assets/bigrock.png'));
    this.load.image('smallrock', require('../assets/smallrock.png'));
    this.load.image('sailor', require('../assets/sailor.png'));
    this.load.image('wake', require('../assets/wake1.png'));

    this.load.on('progress', function (progress) {
      bar.setScale(progress, 1);
    });

    trainer.initWebCam();
  },

  create: function () {

  },

  update: function () {
    this.scene.start('train');
  }
};
