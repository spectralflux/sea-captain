import Phaser from 'phaser';
import trainScene from './trainScene';
import playScene from './playScene';

export default {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    pixelArt: true,
    title: 'Sea Captain',
    banner: { text: 'white', background: ['#FD7400', '#FFE11A', '#BEDB39', '#1F8A70', '#004358'] },
    scene: [trainScene, playScene]
};
