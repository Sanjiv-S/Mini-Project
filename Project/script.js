document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const preview = document.getElementById('preview');
    const uploadContent = document.getElementById('uploadContent');
    const detectBtn = document.getElementById('detectBtn');
    const results = document.getElementById('results');

    // Handle drag and drop
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#2980b9';
        dropZone.style.background = '#f7f9fc';
    });

    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#3498db';
        dropZone.style.background = 'white';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        handleFile(file);
    });

    // Handle click upload
    dropZone.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        handleFile(file);
    });

    function handleFile(file) {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                preview.src = e.target.result;
                preview.style.display = 'block';
                uploadContent.style.display = 'none';
                detectBtn.disabled = false;
            };
            reader.readAsDataURL(file);
        } else {
            alert('Please upload an image file');
        }
    }

    // Handle disease detection
    detectBtn.addEventListener('click', async () => {
        const formData = new FormData();
        formData.append('image', fileInput.files[0]);

        try {
            detectBtn.disabled = true;
            detectBtn.textContent = 'Detecting...';

            const response = await fetch('http://localhost:5000/api/detect', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                results.style.display = 'block';
                updateResults(data.predictions);
            } else {
                throw new Error(data.error || 'Detection failed');
            }
        } catch (error) {
            alert('Error: ' + error.message);
        } finally {
            detectBtn.disabled = false;
            detectBtn.textContent = 'Detect Disease';
        }
    });

    function updateResults(predictions) {
        const bars = document.querySelectorAll('.result-bar');
        bars.forEach(bar => {
            const disease = bar.dataset.disease;
            const probability = predictions[disease] * 100;
            const fillElement = bar.querySelector('.fill');
            const percentageElement = bar.querySelector('.percentage');
            
            fillElement.style.width = `${probability}%`;
            percentageElement.textContent = `${probability.toFixed(1)}%`;
        });
    }
});