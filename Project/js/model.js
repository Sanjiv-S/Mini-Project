/**
 * Model loading and prediction for the eye disease detection app
 */
class EyeDiseaseModel {
  constructor() {
    this.model = null;
    this.isLoading = false;
    this.classes = [
      'Normal',
      'Diabetic Retinopathy',
      'Glaucoma',
      'Cataract'
    ];
    
    this.conditionInfo = {
      'Normal': {
        description: 'No eye disease detected. The eye appears to be healthy with normal structures.',
        recommendations: 'Continue with regular eye check-ups every 1-2 years.'
      },
      'Diabetic Retinopathy': {
        description: 'A diabetes complication that affects the blood vessels in the retina. It can lead to vision loss if not treated.',
        recommendations: 'Consult an ophthalmologist immediately. Control blood sugar levels and follow prescribed treatments.'
      },
      'Glaucoma': {
        description: 'A group of eye conditions that damage the optic nerve, often caused by abnormally high pressure in the eye.',
        recommendations: 'Seek immediate professional care. Early treatment can prevent vision loss.'
      },
      'Cataract': {
        description: 'A clouding of the normally clear lens of the eye, leading to decreased vision.',
        recommendations: 'Consult an ophthalmologist. Cataracts can be surgically removed when they interfere with daily activities.'
      }
    };
  }

  /**
   * Load the TensorFlow.js model
   * @returns {Promise<void>}
   */
  async loadModel() {
    if (this.model) {
      return; // Already loaded
    }

    this.isLoading = true;
    const MODEL_URL = 'https://github.com/suryaprakashdeveloperai/eyediseasemodel/eyediseasepredictionmodel.keras'; // <-- Replace this

    try {
      this.model = await tf.loadLayersModel(MODEL_URL);
      console.log('Model loaded successfully');
    } catch (error) {
      console.error('Failed to load model:', error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Check if the model is loaded
   * @returns {boolean}
   */
  isModelLoaded() {
    return !!this.model;
  }

  /**
   * Make a prediction on an image
   * @param {tf.Tensor} imageTensor - The preprocessed image tensor
   * @returns {Promise<Array>} - Array of prediction objects with class name and probability
   */
  async predict(imageTensor) {
    if (!this.model) {
      throw new Error('Model not loaded');
    }

    const predictionTensor = this.model.predict(imageTensor);
    const predictionArray = await predictionTensor.data();

    const result = predictionArray.map((probability, index) => ({
      className: this.classes[index],
      probability: probability.toFixed(4),
      info: this.conditionInfo[this.classes[index]]
    }));

    return result.sort((a, b) => b.probability - a.probability);
  }

  /**
   * Get information about a specific condition
   * @param {string} conditionName
   * @returns {Object}
   */
  getConditionInfo(conditionName) {
    return this.conditionInfo[conditionName] || {
      description: 'Information not available.',
      recommendations: 'Please consult a healthcare professional.'
    };
  }
}

const eyeDiseaseModel = new EyeDiseaseModel();
