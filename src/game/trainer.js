import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as knnClassifier from '@tensorflow-models/knn-classifier';

var net;
var classifier;
var webcamElement;

export default {
    trainModel: async function () {
        let isDoneTraining = false;
        classifier = knnClassifier.create();
        webcamElement = document.getElementById('webcam');

        console.log('Loading mobilenet..');

        // Load the model.
        net = await mobilenet.load();
        console.log('Successfully loaded model');

        // Create an object from Tensorflow.js data API which could capture image
        // from the web camera as Tensor.
        const webcam = await tf.data.webcam(webcamElement);

        // Reads an image from the webcam and associates it with a specific class
        // index.
        const addExample = async classId => {
            // Capture an image from the web camera.
            const img = await webcam.capture();

            // Get the intermediate activation of MobileNet 'conv_preds' and pass that
            // to the KNN classifier.
            const activation = net.infer(img, 'conv_preds');

            // Pass the intermediate activation to the classifier.
            classifier.addExample(activation, classId);

            // Dispose the tensor to release the memory.
            img.dispose();
        };


        // When clicking a button, add an example for that class.
        document.getElementById('class-port').addEventListener('click', () => addExample(0));
        document.getElementById('class-starboard').addEventListener('click', () => addExample(1));
        document.getElementById('class-done-training').addEventListener('click', () => isDoneTraining = true);


        while (!isDoneTraining) {
            if (classifier.getNumClasses() > 0) {
                const img = await webcam.capture();

                // Get the activation from mobilenet from the webcam.
                const activation = net.infer(img, 'conv_preds');
                // Get the most likely class and confidences from the classifier module.
                const result = await classifier.predictClass(activation);

                const classes = ['Port', 'Starboard'];
                document.getElementById('console').innerText = `
            prediction: ${classes[result.label]}\n
            probability: ${result.confidences[result.label]}
          `;

                // Dispose the tensor to release the memory.
                img.dispose();
            }

            await tf.nextFrame();
        }

        console.log("training complete");
    },

    get_prediction: function() {
        return classifier.predictClass(activation);
    }
}
