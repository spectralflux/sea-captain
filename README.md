# Sea Captain

A simple game using tensorflow.js as controller input, which you train
yourself. The game uses Phaser.js 3 to run.

The model uses ImageNet with a K-means Nearest Neighbour shallow
model on top to make a two class classifier.

## Dev environment
This project has been developed with Parcel (https://parceljs.org/).

To get this running:
* install Parcel's bundler: `npm install -g parcel-bundler`
* make sure npm has installed packages: `npm install`
* run Bundle's dev server: `parcel src/index.html`
* to get a distributable, run `parcel build src/index.html`

