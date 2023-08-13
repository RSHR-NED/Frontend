import librosa
import tensorflow as tf
import numpy as np
import math
# SAVED_MODEL_PATH = "./model_spect_cnn_98.h5"
SAVED_MODEL_PATH = "./model_cnn_aug_90.h5"
SAMPLE_RATE = 22050
TRACK_DURATION = 2 # measured in seconds
SAMPLES_PER_TRACK = SAMPLE_RATE * TRACK_DURATION

class _Keyword_Spotting_Service:
    """Singleton class for keyword spotting inference with trained models.

    :param model: Trained model
    """
    
    model = None
    _mapping = [
    "Bis'mi",
    "Al-lahi",
    "Al-rahmaani",
    "Al-raheemi",
    "Alhamdu",
    "lillaahi",
    "Rabbil",
    "aalameen",
    "Ar-Rahmaan",
    "Ar-Raheem",
    "Maaliki",
    "Yumid",
    "Diin",
    "Iyyaka",
    "Na'abudu",
    "Iyyaka",
    "Nasta'een",
    "Ihdinas",
    "Siraatal",
    "Mustaqeem",
    "Siraatal",
    "Ladheena",
    "An'amta",
    "Alaihim",
    "Ghayril",
    "Maghdubi",
    "Alaihim",
    "Wala al-dalina"
    ]
    _instance = None


    def predict(self, file_path):
        """

        :param file_path (str): Path to audio file to predict
        :return predicted_keyword (str): Keyword predicted by the model
        """

        # extract MFCC
        # MFCCs = np.array([[-208.88369750976562, 173.29107666015625, -13.837435722351074, 14.191682815551758, -63.53321838378906, 9.908905029296875, -34.52302932739258, -7.0630083084106445, -11.072137832641602, 7.897786617279053, 12.635082244873047, -1.260940670967102, -14.440847396850586], [-175.98480224609375, 167.88204956054688, -30.289634704589844, 16.558849334716797, -79.59504699707031, 20.788333892822266, -40.25474548339844, -13.491707801818848, -13.442451477050781, 3.592095375061035, 10.45197868347168, -4.956630706787109, -13.133575439453125], [-177.2965545654297, 140.26446533203125, -42.05194091796875, 15.591264724731445, -79.16682434082031, 35.215572357177734, -48.15814971923828, -7.50286865234375, -7.240591049194336, 2.553539276123047, 9.138029098510742, -3.4423742294311523, -6.37964391708374], [-185.95509338378906, 124.90979766845703, -38.33936309814453, 22.440292358398438, -72.64540100097656, 47.9068717956543, -48.2619514465332, 1.8480926752090454, -3.999704360961914, -0.6501009464263916, 5.425509929656982, -6.084258079528809, -1.652677059173584], [-208.18551635742188, 112.87013244628906, -27.377513885498047, 31.67277717590332, -69.78677368164062, 45.79389953613281, -52.503211975097656, 0.9649603962898254, -7.219353199005127, -0.7659001350402832, 2.2723073959350586, -12.100591659545898, 0.217118501663208], [-190.88275146484375, 135.42083740234375, -31.51664924621582, 30.064231872558594, -69.34258270263672, 30.436262130737305, -56.083526611328125, -15.316060066223145, -16.722349166870117, 1.2809876203536987, -9.884056091308594, -20.502822875976562, -3.5870373249053955], [-207.81170654296875, 148.36880493164062, -37.037811279296875, 37.063602447509766, -56.117095947265625, 16.19550132751465, -35.421043395996094, -21.73065948486328, -18.389490127563477, 2.5057411193847656, -17.75062370300293, -18.73059844970703, -5.083065509796143], [-245.4512939453125, 137.54977416992188, -36.500579833984375, 54.88190841674805, -53.14923095703125, 13.605981826782227, -8.012560844421387, -28.28583526611328, -8.899959564208984, -3.0852625370025635, -13.78553581237793, -14.101425170898438, -10.775411605834961], [-236.1332244873047, 140.26885986328125, -4.87683629989624, 55.43954086303711, -48.025421142578125, 16.675363540649414, 1.0351996421813965, -34.397491455078125, -10.365550994873047, -0.5815303325653076, -10.888479232788086, -3.4156363010406494, -5.683342933654785]])
        # MFCCs = np.array(save_mfcc(file_path))
        mfc = self.save_mfcc(file_path)
        x= mfc[0]
        y= mfc[1]
        MFCCs = np.array(y)
        # we need a 4-dim array to feed to the model for prediction: (# samples, # time steps, # coefficients, 1)
        MFCCs = MFCCs[np.newaxis, ..., np.newaxis]

        # get the predicted label
        predictions = self.model.predict(MFCCs, verbose=0)   # a 2d array [[]]
        predicted_index = np.argmax(predictions)
        # print("predicted_index",predicted_index)
        confs = tf.nn.softmax(predictions)
        # Get corresponding probability value for predicted class
        confidence_score = predictions[0][predicted_index]
        # index return the index which has highest score
        predicted_keyword = self._mapping[predicted_index]
        # print('prediction',predicted_index,predicted_keyword)
        return predicted_keyword, confidence_score


    def save_mfcc(self,file_path,num_mfcc=40, n_fft=2048, hop_length=512, num_segments=10):
      mfcc_lst = []
      # we divide the track into 5 segments
      # to calculate sample per segment - we need to know the number of samples per track (which is the sample rate * the track duration )
      samples_per_segment = int(SAMPLES_PER_TRACK / num_segments)
      num_mfcc_vectors_per_segment = math.ceil(samples_per_segment / hop_length)

      signal, sample_rate = librosa.load(file_path, sr=SAMPLE_RATE)

      # process all segments of audio file
      for d in range(num_segments):

          # calculate start and finish sample for current segment
          start = samples_per_segment * d
          finish = start + samples_per_segment

          spec = librosa.stft(signal[start:finish], n_fft=2048, hop_length=512)
          spec_power = librosa.power_to_db(np.abs(spec)**2, ref=np.max)

          # extract mfcc - for each segment of signal
          mfcc = librosa.feature.mfcc(S=spec_power, n_mfcc=num_mfcc)
          mfcc = mfcc.T
          # store only mfcc feature with expected number of vectors
          if len(mfcc) == num_mfcc_vectors_per_segment:
              mfcc_lst.append(mfcc.tolist())
      return mfcc_lst

def Keyword_Spotting_Service():
    """Factory function for Keyword_Spotting_Service class.

    :return _Keyword_Spotting_Service._instance (_Keyword_Spotting_Service):
    """

    # ensure an instance is created only the first time the factory function is called
    if _Keyword_Spotting_Service._instance is None:
        _Keyword_Spotting_Service._instance = _Keyword_Spotting_Service()
        _Keyword_Spotting_Service.model = tf.keras.models.load_model(SAVED_MODEL_PATH)
    return _Keyword_Spotting_Service._instance


def predict_word(file_path):

    # create 2 instances of the keyword spotting service
    kss = Keyword_Spotting_Service()
    kss1 = Keyword_Spotting_Service()

    # check that different instances of the keyword spotting service point back to the same object (singleton)
    assert kss is kss1

    # make a prediction
    keyword, conf = kss.predict(file_path)
    return keyword, conf


# example use
if __name__ == "__main__":
    file_path = "./audios/Alameen.wav"
    # file_path = "./audios/001002 - Abdullah Basfar.mp3"
    keyword, conf = predict_word(file_path)
    print(f"Predicted keyword: {keyword}")
    print(f"Confidence: {conf}")