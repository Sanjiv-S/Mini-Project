/**
 * Main application logic for the eye disease detection app
 */
class App {
  constructor() {
    this.currentImage = null;
    this.preprocessedCanvas = null;
    this.predictions = null;
    
    // Initialize event listeners
    this._initEventListeners();
  }
  
  /**
   * Initialize event listeners
   */
  _initEventListeners() {
    // Listen for file selection
    document.addEventListener('fileSelected', async (e) => {
      const file = e.detail.file;
      await this._processImage(file);
    });
    
    // Listen for sample image selection
    document.addEventListener('sampleSelected', async (e) => {
      const imageSrc = e.detail.imageSrc;
      await this._processSampleImage(imageSrc);
    });
  }
  
  /**
   * Process an uploaded image file
   * @param {File} file - The image file
   */
  async _processImage(file) {
    try {
      // Show processing section
      ui.showProcessingSection();
      
      // Load and display the image
      this.currentImage = await imageProcessor.loadImage(file);
      ui.updatePreview(this.currentImage.src);
      ui.updatePreprocessingStatus('Processing...');
      
      // Continue with processing
      await this._analyzeImage();
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Error processing image: ' + error.message);
      ui.showUploadSection();
    }
  }
  
  /**
   * Process a sample image from URL
   * @param {string} imageSrc - The image URL
   */
  async _processSampleImage(imageSrc) {
    try {
      // Show processing section
      ui.showProcessingSection();
      
      // Load and display the image
      this.currentImage = await imageProcessor.loadImage(imageSrc);
      ui.updatePreview(this.currentImage.src);
      ui.updatePreprocessingStatus('Processing...');
      
      // Continue with processing
      await this._analyzeImage();
    } catch (error) {
      console.error('Error processing sample image:', error);
      alert('Error processing sample image: ' + error.message);
      ui.showUploadSection();
    }
  }
  
  /**
   * Analyze the current image with the model
   */
  async _analyzeImage() {
    try {
      // Resize the image for the model
      this.preprocessedCanvas = imageProcessor.resizeImage(this.currentImage);
      ui.updatePreprocessingStatus('Preprocessing complete');
      
      // Load the model if not already loaded
      if (!eyeDiseaseModel.isModelLoaded()) {
        ui.showModelLoading();
        await eyeDiseaseModel.loadModel();
        ui.hideModelLoading();
      }
      
      // Analyze the image
      ui.showAnalyzing();
      
      // Convert to tensor and make prediction
      const tensor = imageProcessor.preprocessImage(this.preprocessedCanvas);
      this.predictions = await eyeDiseaseModel.predict(tensor);
      
      // Dispose of the tensor to free memory
      tensor.dispose();
      
      ui.hideAnalyzing();
      
      // Display results
      ui.displayResults(this.predictions);
      ui.showResultsSection();
    } catch (error) {
      console.error('Error analyzing image:', error);
      alert('Error analyzing image: ' + error.message);
      ui.showUploadSection();
    }
  }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Create app instance
  window.app = new App();
  
  // Show loader if needed while resources load
  window.addEventListener('load', () => {
    document.body.classList.add('loaded');
  });
});