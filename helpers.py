from detect_word import predict_word
import librosa
import soundfile as sf
import os
from time import sleep

word_length_stats = {
    "001": {
        "001/001": {
            "001/001/001": {'min': 0.242, 'max': 0.699, 'avg': 0.45785714285714285},
            "001/001/002": {'min': 0.367, 'max': 0.859, 'avg': 0.5751071428571429},
            "001/001/003": {'min': 0.7, 'max': 1.406, 'avg': 1.0892499999999998},
            "001/001/004": {'min': 0.937, 'max': 2.567, 'avg': 1.6800714285714287} 
        },
        "001/002": {
            "001/002/005": {'min': 0.5, 'max': 1.091, 'avg': 0.7868571428571431},
            "001/002/006": {'min': 0.615, 'max': 1.111, 'avg': 0.83425},
            "001/002/007": {'min': 0.4, 'max': 0.912, 'avg': 0.68875},
            "001/002/008": {'min': 1.161, 'max': 2.709, 'avg': 1.9520357142857143}
        },
        "001/003": {
            "001/003/009": {'min': 0.862, 'max': 1.459, 'avg': 1.167892857142857},
            "001/003/010": {'min': 0.67, 'max': 2.73, 'avg': 1.8099642857142861}
        },
        "001/004": {
            "001/004/011": {'min': 0.554, 'max': 1.0, 'avg': 0.7934642857142858},
            "001/004/012": {'min': 0.461, 'max': 1.032, 'avg': 0.6912142857142856},
            "001/004/013": {'min': 0.8, 'max': 2.46, 'avg': 1.4113928571428571}
        },
        "001/005": {
            "001/005/014": {'min': 0.634, 'max': 1.096, 'avg': 0.9189642857142858},
            "001/005/015": {'min': 0.7, 'max': 1.046, 'avg': 0.8418214285714285},
            "001/005/016": {'min': 0.974, 'max': 1.485, 'avg': 1.2133928571428574},
            "001/005/017": {'min': 1.2, 'max': 2.759, 'avg': 1.8921428571428573}
        },
        "001/006": {
            "001/006/018": {'min': 0.453, 'max': 1.017, 'avg': 0.6553571428571429},
            "001/006/019": {'min': 0.592, 'max': 1.36, 'avg': 0.9681785714285714},
            "001/006/020": {'min': 1.203, 'max': 3.066, 'avg': 2.1166428571428577}
        },
        "001/007": {
            "001/007/021": {'min': 0.648, 'max': 1.286, 'avg': 0.8096071428571426},
            "001/007/022": {'min': 0.7, 'max': 1.382, 'avg': 1.044107142857143},
            "001/007/023": {'min': 0.7, 'max': 1.292, 'avg': 1.0179285714285713},
            '001/007/024': {'min': 0.751, 'max': 1.326, 'avg': 1.0681071428571431}
        },
        "001/008": {
            '001/008/025': {'min': 0.459, 'max': 1.04, 'avg': 0.7361785714285712}, 
            '001/008/026': {'min': 0.7, 'max': 1.53, 'avg': 1.157857142857143},
            '001/008/027': {'min': 0.775, 'max': 1.511, 'avg': 1.0293571428571429}, 
            '001/008/028': {'min': 3.191, 'max': 6.874, 'avg': 4.930428571428572}}
    }
}

surah_ayat_words = {
    "001": {
        "001/001": ["Bis'mi", "Al-lahi", "Al-rahmaani", "Al-raheemi"],
        "001/002": ["Alhamdu", "lillaahi", "Rabbil", "aalameen"],
        "001/003": ["Ar-Rahmaan", "Ar-Raheem"],
        "001/004": ["Maaliki", "Yumid", "Diin"],
        "001/005": ["Iyyaka", "Na'abudu", "Iyyaka", "Nasta'een"],
        "001/006": ["Ihdinas", "Siraatal", "Mustaqeem"],
        "001/007": ["Siraatal", "Ladheena", "An'amta", "Alaihim"],
        "001/008": ["Ghayril", "Maghdubi", "Alaihim", "Wala al-dalina"]
    }
}

# TODO: change logic of following function according to trim_dynamic2.py
def get_ayat_words_accuracy(ayat_audio_path, surah_number: int, ayat_number: int):
    """
    Returns prediction and accuracy of each word in an ayat
    """
    sleep(5000)
    print(f"surah_number: {surah_number}, ayat_number: {ayat_number}")
    return [("A", 3), ("B", 12)]
    surah_ayat_number = f"{str(surah_number).zfill(3)}/{str(ayat_number).zfill(3)}"  # form surah_ayat_number prefix of format 00x/00y where x is surah number and y is ayat number    
    current_ayat_word_length_stats = word_length_stats[str(surah_number).zfill(3)][surah_ayat_number]  # get stats of word lengths in the ayat
    # eg current_ayat_word_length_stats for surah 1 ayat 2 = {"001/002/005": {'min': 0.5, 'max': 1.091, 'avg': 0.7868571428571431}, "001/002/006": {'min': 0.615, 'max': 1.111, 'avg': 0.83425}, "001/002/007": {'min': 0.4, 'max': 0.912, 'avg': 0.68875}, "001/002/008": {'min': 1.161, 'max': 2.709, 'avg': 1.9520357142857143}}
    
    predictions = []  # word, confidence pairs for all predicted words in ayat
    ayat_audio, sample_rate = librosa.load(ayat_audio_path, sr=None)  # load the ayat ayat_audio
    print(f"Ayat audio length: {len(ayat_audio)}")
    stride_len = 0.01  # stride used while chunking each word
    start_index = 0
    chunk_length_samples = 0
    os.makedirs(os.path.join(os.path.dirname(__file__), "audios/temp_trim_chunks"), exist_ok=True)  # make folder to temporarily store ayat_audio chunks for prediction

    for word in current_ayat_word_length_stats:
        print(f"word: {word}, current_ayat_word_length_stats[word]: {current_ayat_word_length_stats[word]}")
        min_len = current_ayat_word_length_stats[word]['min']
        max_len = current_ayat_word_length_stats[word]['max']

        # apply sliding window approach to find trim out word
        current_stride = 0
        end_index = start_index + int((min_len + current_stride) * sample_rate)
        possible_word_chunks = []
        while (end_index <= (start_index + int(max_len * sample_rate))) and (end_index <= len(ayat_audio)): 
            chunk = ayat_audio[start_index : end_index]
            temp_chunk_save_path = os.path.join(os.path.dirname(__file__), "audios/temp_trim_chunks", "temp_chunk.wav").replace("\\", "/")
            sf.write(temp_chunk_save_path, chunk, sample_rate)
            predicted_word, confidence = predict_word(temp_chunk_save_path)
            possible_word_chunks.append((predicted_word, confidence, current_stride))
            current_stride += stride_len
            end_index = start_index + int((min_len + current_stride) * sample_rate)

        # find the chunk with highest confidence
        predicted_word, confidence, current_stride = max(possible_word_chunks, key=lambda x: x[1])

        # trim out the word from the ayat
        chunk = ayat_audio[start_index : start_index + int((min_len + current_stride) * sample_rate)]

        # # predict the word from the trimmed out word
        # predicted_word, confidence = predict_word(chunk)

        predictions.append((predicted_word, confidence))

        # update start index for next word
        chunk_length_samples += int((min_len + current_stride) * sample_rate)
        start_index = chunk_length_samples 

        temp_word_save_path = os.path.join(os.path.dirname(__file__), "audios/temp_trim_chunks", f"{word.split('/')[-1]}.wav").replace("\\", "/")
        sf.write(temp_word_save_path, chunk, sample_rate)

    return predictions


def mark_correctness_levels(surah_number: int, ayat_number: int, predictions):
    return "correctness_levels", "ayat_words"
    
    surah_ayat_number = f"{str(surah_number).zfill(3)}/{str(ayat_number).zfill(3)}"  # form surah_ayat_number prefix of format 00x/00y where x is surah number and y is ayat number    
    ayat_words = surah_ayat_words[str(surah_number).zfill(3)][surah_ayat_number]
    # eg ayat_words for surah 1 ayat 2 = ["Alhamdu", "lillaahi", "Rabbil", "aalameen"]
    
    correctness_levels = []
    for idx, prediction in enumerate(predictions):
        predicted_word, confidence = prediction

        if predicted_word != ayat_words[idx]:
            correctness_levels.append("low")
        
        else:
            if confidence > 93:
                correctness_levels.append("high")
            else:
                correctness_levels.append("medium")

    return correctness_levels, ayat_words


        