import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as knnClassifier from '@tensorflow-models/knn-classifier';

var net;
var classifier;
var webcamElement;
var isDoneTraining;
var isDoneAddingToModel;
var webcam;

export default {
    initWebCam: async function() {
        webcamElement = document.getElementById('webcam');
        // Create an object from Tensorflow.js data API which could capture image
        // from the web camera as Tensor.
        webcam = await tf.data.webcam(webcamElement);
    },

    trainModel: async function () {
        isDoneTraining = false;
        isDoneAddingToModel = false;
        classifier = knnClassifier.create();
    
        console.log('Loading mobilenet..');

        // Load the model.
        net = await mobilenet.load();
        console.log('Successfully loaded model');

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
        document.getElementById('class-done-training').addEventListener('click', () => isDoneAddingToModel = true);


        while (!isDoneAddingToModel) {
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
        isDoneTraining = true;
    },

    getPrediction: async function() {
        if (webcam !== 'undefined' && webcam !== null) {
            const img = await webcam.capture();
            const activation = net.infer(img, 'conv_preds');
            let prediction = classifier.predictClass(activation);
            return prediction;
        }
    },

    isDoneTraining: function() {
        return isDoneTraining;
    }

}
