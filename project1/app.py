from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import numpy as np
import io
import os
import tensorflow as tf  # Add your model's required imports

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

# Load your model when the app starts
model = tf.keras.models.load_model('path/to/your/model.h5')  # Replace with your model path

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def process_image(image):
    # Preprocess the image for your model
    # Resize to your model's expected input size
    image = image.resize((224, 224))  # Adjust size according to your model
    
    # Convert to array and preprocess
    img_array = np.array(image)
    img_array = img_array / 255.0  # Normalize pixel values
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
    
    # Make prediction using your model
    predictions = model.predict(img_array)
    
    # Map predictions to disease labels
    diseases = ['Cataract', 'Glaucoma', 'Diabetic Retinopathy', 'Normal']
    return dict(zip(diseases, predictions[0].tolist()))

@app.route('/api/detect', methods=['POST'])
def detect_disease():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    
    file = request.files['image']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
        
    if file and allowed_file(file.filename):
        # Read and process the image
        image_bytes = file.read()
        image = Image.open(io.BytesIO(image_bytes))
        
        # Get predictions
        predictions = process_image(image)
        
        return jsonify({
            'success': True,
            'predictions': predictions
        })
    
    return jsonify({'error': 'Invalid file type'}), 400

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)