
import os

from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route('/')
def index():
    return "Hello, World!"
    
@app.route('/api/ayat_accuracy', methods=['POST'])
def ayat_accuracy():
    print(request.form)

    # Check if audio file was sent and not empty
    if 'audio_file' not in request.files:
        return jsonify({'error': 'No audio file provided'}), 400
    audio_file = request.files['audio_file']
    if audio_file.filename == '':
        return jsonify({'error': 'No audio file provided'}), 400
    
    surah_number = request.form['surah_number']
    ayat_number = request.form['ayat_number']

    save_path = os.path.join(os.path.dirname(__file__), 'tmp_for_word_prediction.wav')
    audio_file.save(save_path)  # save the file 

    print(f"surah_number: {surah_number}, ayat_number: {ayat_number}")

    # return f"surah_number: {surah_number}, ayat_number: {ayat_number}"
    return jsonify({'success': 'true'}), 200


if __name__ == "__main__":
    app.run(debug=True)