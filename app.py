
import os

from flask import Flask, jsonify, request
from flask_cors import CORS
from helpers import get_ayat_words_accuracy, mark_correctness_levels


app = Flask(__name__)
CORS(app)


@app.route('/')
def index():
    return "Hello, World!"
    
# @app.route('/api/ayat_accuracy', methods=['POST'])
# def ayat_accuracy():
#     print(request.form)

#     # Check if audio file was sent and not empty
#     if 'audio_file' not in request.files:
#         return jsonify({'error': 'No audio file provided'}), 400
#     audio_file = request.files['audio_file']
#     if audio_file.filename == '':
#         return jsonify({'error': 'No audio file provided'}), 400
    
#     surah_number = request.form['surah_number']
#     ayat_number = request.form['ayat_number']

#     save_path = os.path.join(os.path.dirname(__file__), 'tmp_for_word_prediction.wav')
#     audio_file.save(save_path)  # save the file 

#     print(f"surah_number: {surah_number}, ayat_number: {ayat_number}")

#     # return f"surah_number: {surah_number}, ayat_number: {ayat_number}"
#     return jsonify({'success': 'true', 'surah_number': surah_number, "ayat_number": ayat_number}), 200


@app.route('/api/ayat_accuracy', methods=['POST'])
def ayat_accuracy():

    # Check if audio file was sent and not empty
    if 'audio_file' not in request.files:
        return jsonify({'error': 'No audio file provided'}), 400
    audio_file = request.files['audio_file']
    if audio_file.filename == '':
        return jsonify({'error': 'No audio file provided'}), 400
    
    surah_number = int(request.form['surah_number'])
    ayat_number = int(request.form['ayat_number'])

    save_path = os.path.join(os.path.dirname(__file__), 'tmp_for_word_prediction.wav')
    audio_file.save(save_path)  # save the file 

    predictions = get_ayat_words_accuracy(save_path, surah_number, ayat_number)
    predictions = [(predicted_word, float(confidence)) for predicted_word, confidence in predictions]  # converting to float for json serializability which numpy float isn't
    correctness_levels, ayat_words = mark_correctness_levels(surah_number, ayat_number, predictions)
    os.remove(save_path)  # delete temp file

    print(f"Return predictions: {predictions}")
    return jsonify({'predictions': predictions, 'correctness_levels': correctness_levels, 'actual_ayat_words': ayat_words, 'surah_number': surah_number, 'ayat_number': ayat_number}), 200



if __name__ == "__main__":
    app.run(debug=True)