# Mini-Project
# 👁️ Eye Disease Classification with Recommendation System

This project is an AI-powered web application designed to classify retinal fundus images into four categories: **Normal**, **Cataract**, **Glaucoma**, and **Diabetic Retinopathy** using a pre-trained Convolutional Neural Network (CNN) model. Alongside the classification, the system provides relevant **recommendations** for each diagnosed condition to guide users on possible next steps.

---

## 🚀 Project Objective

- Automate the detection of common eye diseases using retinal images.
- Improve early diagnosis and accessibility to eye care services, especially in resource-limited areas.
- Provide actionable recommendations based on the prediction result.
- Offer a user-friendly web interface to interact with the system.

---

## 🧠 Model Details

- The model is a **Convolutional Neural Network (CNN)** trained on labeled retinal image datasets.
- The saved model is provided in `.keras` format (`eyes.keras`) and classifies into 4 categories:
  - `0`: Normal
  - `1`: Cataract
  - `2`: Glaucoma
  - `3`: Diabetic Retinopathy

- A separate file (`eye.pkl`) contains a dictionary mapping each class to a medical **recommendation or treatment guidance**.

---

## ✨ Features

- Upload retinal images in `.jpg`, `.png`, or `.jpeg` formats.
- Classifies the image into one of the four eye disease categories.
- Displays the disease name, confidence score, and personalized recommendation.
- Responsive, clean web UI.
- Handles invalid files and errors gracefully.

---

## 🛠️ Tech Stack

- **Frontend**: HTML, CSS (TailwindCSS / Bootstrap)
- **Backend**: Python, Flask or FastAPI
- **ML Framework**: TensorFlow / Keras
- **Utilities**: Pillow, NumPy, Pickle

---

## 🖼️ Sample Workflow

1. User uploads a retinal fundus image.
2. Image is preprocessed and fed into the CNN model.
3. Model predicts one of the four classes.
4. System fetches a recommendation from `eye.pkl` based on the predicted class.
5. Result and recommendation are displayed on the web page.

---

## 📂 File Structure

📁 project_root/
│
├── eyes.keras # Trained CNN model
├── eye.pkl # Pickle file with recommendation mapping
├── app.py # Flask or FastAPI app
├── templates/
│ └── index.html # Main HTML UI
├── static/
│ └── styles.css # Optional styling
├── README.md # Project overview
└── requirements.txt # Required packages


---

## 📦 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/eye-disease-classifier.git
cd eye-disease-classifier

pip install -r requirements.txt

python app.py

⚠️ Notes
Ensure that the input images are clear and resemble retinal fundus images.

The model was trained on a specific dataset; accuracy may vary on out-of-distribution data.

You can extend the system to include more diseases by retraining the model and updating eye.pkl.
