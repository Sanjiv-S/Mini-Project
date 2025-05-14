/**
 * UI-related functions for the eye disease detection app
 */
class UI {
  constructor() {
    // DOM elements
    this.elements = {
      dropArea: document.getElementById('drop-area'),
      fileInput: document.getElementById('file-input'),
      uploadSection: document.querySelector('.upload-section'),
      processingSection: document.getElementById('processing-section'),
      modelLoading: document.getElementById('model-loading'),
      analyzing: document.getElementById('analyzing'),
      resultsSection: document.getElementById('results-section'),
      previewImage: document.getElementById('preview-image'),
      preprocessingStatus: document.getElementById('preprocessing-status'),
      primaryDiagnosisName: document.getElementById('primary-diagnosis-name'),
      primaryConfidence: document.getElementById('primary-confidence'),
      predictionBars: document.getElementById('prediction-bars'),
      conditionDescription: document.getElementById('condition-description'),
      newScanBtn: document.getElementById('new-scan-btn'),
      downloadReportBtn: document.getElementById('download-report-btn'),
      sampleImages: document.querySelectorAll('.sample-img')
    };
    
    // Initialize event listeners
    this._initEventListeners();
  }
  
  /**
   * Initialize all event listeners
   */
  _initEventListeners() {
    // Drag and drop events
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      this.elements.dropArea.addEventListener(eventName, this._preventDefaults, false);
    });
    
    ['dragenter', 'dragover'].forEach(eventName => {
      this.elements.dropArea.addEventListener(eventName, () => {
        this.elements.dropArea.classList.add('highlight');
      }, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
      this.elements.dropArea.addEventListener(eventName, () => {
        this.elements.dropArea.classList.remove('highlight');
      }, false);
    });
    
    // Handle file drop
    this.elements.dropArea.addEventListener('drop', (e) => {
      const files = e.dataTransfer.files;
      if (files.length) {
        this.elements.fileInput.files = files;
        this._handleFileSelect(files[0]);
      }
    }, false);
    
    // Handle file selection
    this.elements.fileInput.addEventListener('change', (e) => {
      if (e.target.files.length) {
        this._handleFileSelect(e.target.files[0]);
      }
    }, false);
    
    // Handle "New Scan" button
    this.elements.newScanBtn.addEventListener('click', () => {
      this.showUploadSection();
    }, false);
    
    // Handle "Download Report" button
    this.elements.downloadReportBtn.addEventListener('click', () => {
      this._generateReport();
    }, false);
    
    // Sample images
    this.elements.sampleImages.forEach(img => {
      img.addEventListener('click', () => {
        this._handleSampleImage(img.src);
      }, false);
    });
  }
  
  /**
   * Prevent default behavior for events
   * @param {Event} e - The event
   */
  _preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }
  
  /**
   * Handle file selection
   * @param {File} file - The selected file
   */
  _handleFileSelect(file) {
    if (!file.type.match('image.*')) {
      alert('Please select an image file');
      return;
    }
    
    // Notify app.js that a file has been selected
    const event = new CustomEvent('fileSelected', { detail: { file } });
    document.dispatchEvent(event);
  }
  
  /**
   * Handle sample image selection
   * @param {string} imageSrc - The source URL of the sample image
   */
  _handleSampleImage(imageSrc) {
    const event = new CustomEvent('sampleSelected', { detail: { imageSrc } });
    document.dispatchEvent(event);
  }
  
  /**
   * Show the upload section and hide others
   */
  showUploadSection() {
    this.elements.uploadSection.classList.remove('hidden');
    this.elements.processingSection.classList.add('hidden');
    this.elements.resultsSection.classList.add('hidden');
  }
  
  /**
   * Show the processing section and hide others
   */
  showProcessingSection() {
    this.elements.uploadSection.classList.add('hidden');
    this.elements.processingSection.classList.remove('hidden');
    this.elements.resultsSection.classList.add('hidden');
    this.elements.modelLoading.classList.add('hidden');
    this.elements.analyzing.classList.add('hidden');
  }
  
  /**
   * Show model loading indicator
   */
  showModelLoading() {
    this.elements.modelLoading.classList.remove('hidden');
  }
  
  /**
   * Hide model loading indicator
   */
  hideModelLoading() {
    this.elements.modelLoading.classList.add('hidden');
  }
  
  /**
   * Show analyzing indicator
   */
  showAnalyzing() {
    this.elements.analyzing.classList.remove('hidden');
  }
  
  /**
   * Hide analyzing indicator
   */
  hideAnalyzing() {
    this.elements.analyzing.classList.add('hidden');
  }
  
  /**
   * Show the results section and hide others
   */
  showResultsSection() {
    this.elements.uploadSection.classList.add('hidden');
    this.elements.processingSection.classList.add('hidden');
    this.elements.resultsSection.classList.remove('hidden');
  }
  
  /**
   * Update image preview
   * @param {string} src - The image source URL
   */
  updatePreview(src) {
    this.elements.previewImage.src = src;
  }
  
  /**
   * Update preprocessing status
   * @param {string} status - The status message
   */
  updatePreprocessingStatus(status) {
    this.elements.preprocessingStatus.textContent = status;
  }
  
  /**
   * Display the prediction results
   * @param {Array} predictions - Array of prediction objects
   */
  displayResults(predictions) {
    if (!predictions || !predictions.length) return;
    
    // Primary diagnosis (top prediction)
    const primary = predictions[0];
    this.elements.primaryDiagnosisName.textContent = primary.className;
    this.elements.primaryConfidence.textContent = `${Math.round(primary.probability * 100)}%`;
    
    // Set primary diagnosis color based on the condition
    this.elements.primaryDiagnosisName.style.color = this._getConditionColor(primary.className);
    
    // Clear previous prediction bars
    this.elements.predictionBars.innerHTML = '';
    
    // Create prediction bars for all conditions
    predictions.forEach(prediction => {
      const barElement = this._createPredictionBar(prediction);
      this.elements.predictionBars.appendChild(barElement);
    });
    
    // Display information about the primary condition
    this._displayConditionInfo(primary.className);
  }
  
  /**
   * Create a prediction bar element
   * @param {Object} prediction - The prediction object
   * @returns {HTMLElement} - The prediction bar element
   */
  _createPredictionBar(prediction) {
    const probabilityPercent = Math.round(prediction.probability * 100);
    const color = this._getConditionColor(prediction.className);
    
    const barElement = document.createElement('div');
    barElement.className = 'prediction-bar';
    barElement.dataset.condition = prediction.className;
    barElement.innerHTML = `
      <div class="prediction-label">
        <span class="prediction-name">${prediction.className}</span>
        <span class="prediction-value">${probabilityPercent}%</span>
      </div>
      <div class="prediction-progress">
        <div class="prediction-fill" style="width: ${probabilityPercent}%; background-color: ${color};"></div>
      </div>
    `;
    
    // Add click event to show condition info
    barElement.addEventListener('click', () => {
      this._displayConditionInfo(prediction.className);
    });
    
    return barElement;
  }
  
  /**
   * Display information about a condition
   * @param {string} conditionName - The name of the condition
   */
  _displayConditionInfo(conditionName) {
    const info = eyeDiseaseModel.getConditionInfo(conditionName);
    
    this.elements.conditionDescription.innerHTML = `
      <h4>${conditionName}</h4>
      <p><strong>Description:</strong> ${info.description}</p>
      <p><strong>Recommendations:</strong> ${info.recommendations}</p>
    `;
  }
  
  /**
   * Get color associated with a condition
   * @param {string} conditionName - The name of the condition
   * @returns {string} - The color for the condition
   */
  _getConditionColor(conditionName) {
    const colors = {
      'Normal': '#06D6A0', // success green
      'Diabetic Retinopathy': '#FF6B6B', // accent red
      'Glaucoma': '#FFD166', // warning yellow
      'Cataract': '#2C6BED' // primary blue
    };
    
    return colors[conditionName] || '#BFC0C0'; // default to neutral gray
  }
  
  /**
   * Generate a PDF report (simplified for demo)
   */
  _generateReport() {
    alert('Report download functionality would be implemented here. In a real application, this would generate a PDF with detailed analysis results.');
  }
}

// Create and export a singleton instance
const ui = new UI();