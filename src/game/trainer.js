import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as knnClassifier from '@tensorflow-models/knn-classifier';

const CLASSES = ['port', 'starboard'];

var net;
var classifier;
var webcamElement;
var isDoneTraining;
var isDoneAddingToModel;
var webcam;

var currentPredictionText;

async function addEx(model, classifier, classId) {
     // Capture an image from the web camera.
    const img = await webcam.capture();

    // Get the intermediate activation of MobileNet 'conv_preds' and pass that
    // to the KNN classifier.
    const activation = model.infer(img, 'conv_preds');

    // Pass the intermediate activation to the classifier.
    classifier.addExample(activation, classId);

    // Dispose the tensor to release the memory.
    img.dispose();
}

export default {
    addExample: async function(classId) {
        addEx(net, classifier, classId);
    },

    doneAddingExamples: function() {
        isDoneAddingToModel = true;
    },

    getPredictionText: function() {
       return currentPredictionText;
    },

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

        while (!isDoneAddingToModel) {
            if (classifier.getNumClasses() > 0) {
                const img = await webcam.capture();

                // Get the activation from mobilenet from the webcam.
                const activation = net.infer(img, 'conv_preds');
                // Get the most likely class and confidences from the classifier module.
                const result = await classifier.predictClass(activation);

                currentPredictionText = `The sailors are ${result.confidences[result.label] * 100}% sure that you are signaling ${CLASSES[result.label]}!`;
          
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
