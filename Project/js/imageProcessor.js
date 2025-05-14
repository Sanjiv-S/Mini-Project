/**
 * Image processing utility functions for the eye disease detection app
 */
class ImageProcessor {
  constructor() {
    // Model input dimensions
    this.MODEL_WIDTH = 224;
    this.MODEL_HEIGHT = 224;
  }

  /**
   * Load an image from a file input or URL
   * @param {File|String} input - The image file or URL
   * @returns {Promise<HTMLImageElement>} - The loaded image element
   */
  async loadImage(input) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load image'));
      
      if (typeof input === 'string') {
        // Input is a URL
        img.src = input;
      } else {
        // Input is a File object
        const reader = new FileReader();
        reader.onload = (e) => { img.src = e.target.result; };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(input);
      }
    });
  }

  /**
   * Resize an image to the dimensions required by the model
   * @param {HTMLImageElement} img - The image to resize
   * @returns {HTMLCanvasElement} - Canvas with the resized image
   */
  resizeImage(img) {
    const canvas = document.createElement('canvas');
    canvas.width = this.MODEL_WIDTH;
    canvas.height = this.MODEL_HEIGHT;
    
    const ctx = canvas.getContext('2d');
    
    // Draw the image with a white background (important for medical images)
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Calculate scaling to maintain aspect ratio
    const scale = Math.min(
      this.MODEL_WIDTH / img.width,
      this.MODEL_HEIGHT / img.height
    );
    
    const scaledWidth = img.width * scale;
    const scaledHeight = img.height * scale;
    
    // Center the image
    const offsetX = (this.MODEL_WIDTH - scaledWidth) / 2;
    const offsetY = (this.MODEL_HEIGHT - scaledHeight) / 2;
    
    ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);
    
    return canvas;
  }

  /**
   * Preprocess the image for the TensorFlow model
   * @param {HTMLCanvasElement} canvas - The canvas with the image
   * @returns {tf.Tensor3D} - The preprocessed image as a tensor
   */
  preprocessImage(canvas) {
    // Convert image to tensor
    return tf.tidy(() => {
      // Read image data
      const imgData = canvas.getContext('2d').getImageData(
        0, 0, canvas.width, canvas.height
      );
      
      // Convert to tensor
      let tensor = tf.browser.fromPixels(imgData);
      
      // Normalize values to [-1, 1]
      tensor = tensor.toFloat().div(tf.scalar(127.5)).sub(tf.scalar(1));
      
      // Add batch dimension
      return tensor.expandDims(0);
    });
  }
  
  /**
   * Enhance contrast for better visualization (not used for model input)
   * @param {HTMLCanvasElement} canvas - The canvas with the image
   * @returns {HTMLCanvasElement} - Canvas with enhanced image
   */
  enhanceContrast(canvas) {
    const ctx = canvas.getContext('2d');
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    
    // Simple contrast enhancement
    const factor = 1.2; // Contrast factor
    
    for (let i = 0; i < data.length; i += 4) {
      data[i] = this._clamp((data[i] - 128) * factor + 128);     // R
      data[i + 1] = this._clamp((data[i + 1] - 128) * factor + 128); // G
      data[i + 2] = this._clamp((data[i + 2] - 128) * factor + 128); // B
    }
    
    ctx.putImageData(imgData, 0, 0);
    return canvas;
  }
  
  /**
   * Clamp value between 0 and 255
   * @param {number} value - The value to clamp
   * @returns {number} - The clamped value
   */
  _clamp(value) {
    return Math.max(0, Math.min(255, value));
  }
}

// Export the class
const imageProcessor = new ImageProcessor();