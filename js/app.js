// ======== Navbar color change=========
var myNav = document.getElementById("web_navbar");
const getStartedBtn = document.getElementById("getStartedBtn");

/**
 * Changes the background color of the navigation bar and
 * the "Get Started" button based on the scroll position of
 * the window.
 *
 * @return {void} No return value.
 */
const changeBackground = () => {
  if (window.scrollY >= 80) {
    myNav.style.backgroundColor = "#ff9822";
    getStartedBtn.style.backgroundColor = "white";
    getStartedBtn.style.color = "#ff9822";
  } else {
    myNav.style.backgroundColor = "transparent";
    getStartedBtn.style.backgroundColor = "#ff9822";
    getStartedBtn.style.color = "white";
  }
};

window.addEventListener("scroll", changeBackground);

// ============ Toggle upload and record ================
const recordBtn = document.querySelector("#record_btn");
const uploadBtn = document.querySelector("#upload_btn");
const uploadFileDiv = document.querySelector("#upload-file-div");
const recordFileDiv = document.querySelector("#record-file-div");

/**
 * Toggles the display of the upload and record buttons and file divs based on the given isUpload parameter.
 * @param {boolean} isUpload - A boolean value indicating whether the upload button should be displayed.
 * @return {undefined} There is no return value for this function.
 * This code defines a function called toggleUpload that takes a boolean parameter isUpload. If isUpload is true, it modifies the HTML elements by adding and removing CSS classes and changing the display style of certain elements. If isUpload is false, it performs the opposite modifications.
 */
const toggleUpload = (isUpload) => {
  if (isUpload === true) {
    uploadBtn.classList.remove("visible-btn-color");
    recordBtn.classList.add("visible-btn-color");
    uploadFileDiv.style.display = "block";
    recordFileDiv.style.display = "none";
  } else {
    uploadBtn.classList.add("visible-btn-color");
    recordBtn.classList.remove("visible-btn-color");
    recordFileDiv.style.display = "block";
    uploadFileDiv.style.display = "none";
  }
};

toggleUpload(true);

// ============ Record Audio ================
/*
  * This code snippet is using the navigator.mediaDevices.getUserMedia() method to prompt the user for permission to access their audio. If permission is granted, it then calls the handlerFunction() with the audio stream as an argument. The handlerFunction() creates a new MediaRecorder object and sets its ondataavailable property to a function that pushes the audio data to the audioChunks array. It then calls the start() method on the MediaRecorder object to begin recording the audio stream. When the user clicks the stop button, the handlerFunction() calls the stop() method on the MediaRecorder object to stop recording the audio stream. The MediaRecorder object then fires the ondataavailable event and the handlerFunction() pushes the audio data to the audioChunks array. The handlerFunction() then creates a new Blob object from the audioChunks array and sets the src property of the recordedAudio audio element to a URL created from the Blob object.
*/
var recordAudioBlob;

navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
  handlerFunction(stream);
});
var isRecording = document.getElementById("isRecording");

/**
 * Handles the stream and records audio chunks.
 * @param {MediaStream} stream - The stream object.
 */
function handlerFunction(stream) {
  rec = new MediaRecorder(stream);
  rec.ondataavailable = (e) => {
    audioChunks.push(e.data);
    if (rec.state == "inactive") {
      let blob = new Blob(audioChunks, { type: "audio/mpeg-3" });
      recordedAudio.src = URL.createObjectURL(blob);
      recordedAudio.controls = true;
      recordedAudio.autoplay = true;
      console.log("this is recordedAudio", recordedAudio.src);
      sendData(blob);
    }
  };
}

/**
 * Sends the provided data to the server.
 * @param {type} data - The data to be sent.
 * @return {undefined} This function does not return a value.
 */

function sendData(data) {
  recordAudioBlob = data;
  console.log(data);
}


/**
 * Sets up the onclick event handler for the record button.
 * @param {Event} e - The click event.
 * @return {void} No return value.
 */
record.onclick = (e) => {
  isRecording.style.visibility = "visible";
  record.disabled = true;
  record.style.backgroundColor = "red";
  stopRecord.disabled = false;
  audioChunks = [];
  rec.start();
};

/**
 * Handles the click event for the stopRecord button.
 * @param {Event} e - The click event object.
 * @return {undefined} This function does not return a value.
 */
stopRecord.onclick = (e) => {
  isRecording.style.visibility = "hidden";
  record.disabled = false;
  stop.disabled = true;
  record.style.backgroundColor = "red";
  rec.stop();
};

// ============== Get user input ================
const arabic_ayats = document.getElementById("arabic-ayats-div");
const spinner_border = document.getElementById("spinner-border");
spinner_border.style.display = "none";

const surahSelect = document.querySelector("#surah");
const ayatSelect = document.querySelector("#ayat");
const fileInput = document.getElementById("file");
const formSubmit = document.querySelector("#formSubmit");

const displayPrediction = document.getElementById("display_prediction");
displayPrediction.style.display = "none";

const reset_btn = document.getElementById("reset_btn");
reset_btn.style.display = "none";

const errorResponse = document.getElementById("error");
errorResponse.style.display = "none";

let isRest = false;
reset_btn.addEventListener("click", () => {
  displayPrediction.style.display = "none";
  arabic_ayats.style.display = "block";
  errorResponse.style.display = "none";
  reset_btn.style.display = "none";
});

if ((arabic_ayats.style.display = "block")) {
  reset_btn.style.display = "none";
}
var loading = false;
let apiResult;

// Event listener for form submit button click
formSubmit.addEventListener("click", async (e) => {
  e.preventDefault(); // prevent default submit behavior

  loading = true;
  arabic_ayats.style.display = "none";
  spinner_border.style.display = "block";

  console.log("loading", loading);
  let selectedSurah = surahSelect.options[surahSelect.selectedIndex].value;
  let selectedAyat =
    parseInt(ayatSelect.options[ayatSelect.selectedIndex].value) + 1;

  let audioData;

  if (recordAudioBlob != undefined) {
    audioData = recordAudioBlob;
  } else {
    audioData = fileInput.files[0]; // Get the selected file
  }

  // if no audio file is selected, return
  if (audioData == undefined) {
    alert("Please select an audio file");
    return;
  }

  console.log({
    selectedSurah,
    selectedAyat,
    audioData,
  });

  let formData = new FormData();
  formData.append("surah_number", selectedSurah);
  formData.append("ayat_number", selectedAyat);
  formData.append("audio_file", audioData);

  try {
    const response = await axios.post(
      "https://ayat-accuracy-llwal2h6eq-uc.a.run.app/api/ayat_accuracy",
      formData,
      {
        headers: { "content-type": "multipart/form-data" },
      }
    );
    const data = response.data;
    apiResult = data;
    console.log(data);
    calculatedResult(apiResult);

    console.log(apiResult, "apiResult");

    displayPrediction.style.display = "block";

    // correc
  } catch (error) {
    console.log(error);
    errorResponse.style.display = "block";
  } finally {
    loading = false;
    console.log("loading", loading);
    arabic_ayats.style.display = "none";
    spinner_border.style.display = "none";
    reset_btn.style.display = "block";
  }
});


const predictionUl = document.getElementById("prediction-ul");

/**
 * Translates an English word into Arabic.
 * @param {string} word - The English word to be translated.
 * @return {string} The Arabic translation of the word.
 */
const wordInArabic = (word) => {
  let arabicWord = "";
  if (word === "Alhamdu") {
    arabicWord = "اَلْحَمْدُ";
  } else if (word === "lillaahi") {
    arabicWord = "لِلّٰهِ";
  } else if (word === "Rabbil") {
    arabicWord = "رَبِّ";
  } else if (word === "aalameen") {
    arabicWord = "الْعٰلَمِیْنَ";
  } else if (word === "Ar-Rahmaan") {
    arabicWord = "الرَّحْمٰنِ";
  } else if (word === "Ar-Raheem") {
    arabicWord = "الرَّحِیْمِ";
  } else if (word === "Maaliki") {
    arabicWord = "مٰلِكِ";
  } else if (word === "Yumid") {
    arabicWord = "یَوْمِ";
  } else if (word === "Diin") {
    arabicWord = "الدِّیْنِ";
  } else if (word === "Iyyaka") {
    arabicWord = "اِیَّاكَ";
  } else if (word === "Na'abudu") {
    arabicWord = "نَعْبُدُ";
  } else if (word === "Iyyaka") {
    arabicWord = "وَ اِیَّاكَ";
  } else if (word === "Nasta'een") {
    arabicWord = "نَسْتَعِیْنُ";
  } else if (word === "Ihdinas") {
    arabicWord = "اِهْدِنَا";
  } else if (word === "Siraatal") {
    arabicWord = "الصِّرَاطَ";
  } else if (word === "Mustaqeem") {
    arabicWord = "الْمُسْتَقِیْمَ";
  } else if (word === "Siraatal") {
    arabicWord = "صِرَاطَ";
  } else if (word === "Ladheena") {
    arabicWord = "الَّذِیْنَ";
  } else if (word === "An'amta") {
    arabicWord = "اَنْعَمْتَ";
  } else if (word === "Alaihim") {
    arabicWord = "عَلَیْهِمْ";
  } else if (word === "Ghayril") {
    arabicWord = "غَیْرِ";
  } else if (word === "Maghdubi") {
    arabicWord = "الْمَغْضُوْبِ";
  } else if (word === "Alaihim") {
    arabicWord = "عَلَیْهِمْ";
  } else if (word === "Wala al-dalina") {
    arabicWord = "وَ لَا الضَّآلِّیْنَ";
  }

  return arabicWord;
};



/**
 * Generates the content for a <li> element that displays word predictions.
 * @param {string} getWord - The word to be displayed in the <span> element with color.
 * @param {string} level - The correctness level of the word prediction. Possible values are "low", "medium", or "high".
 * @param {number} predictionPer - The score of the word prediction.
 * @return {string} The HTML content for the <li> element.
 */
const spanLiContent = (getWord, level, predictionPer) => {
  let color = "green";
  if (level == "low") {
    color = "red";
  } else if (level == "medium") {
    color = "#d8d80d";
  } else if (level == "high") {
    color = "green";
  }

  return `<li id="prediction-li">
  <span
    class="arabic-font mb-0 variable_font surah-ayat"
  >
    <span style="color: ${color}">
      ${getWord}
    </span>
    <br />
    
    <span> Correctness level :</span>

    <span class="correctness-level"
      >${level}</span
    >
    <br/>
    <span>Score :</span>

    <span class="correctness-level"
      >${predictionPer}</span
    >
  </span>
</li>`;
};

/**
 * Calculates the result based on the given data.
 * @param {object} data - The data containing actual_ayat_words, correctness_levels, and predictions.
 * @return {undefined} This function does not return a value.
 */
const calculatedResult = (data) => {
  const { actual_ayat_words, correctness_levels, predictions } = data;
  for (let i = 0; i < actual_ayat_words.length; i++) {
    const word = actual_ayat_words[i];
    const level = correctness_levels[i];
    const predictionPer = predictions[i][1].toFixed(4);
    const getWordInArabic = wordInArabic(word);
    predictionUl.innerHTML += spanLiContent(
      getWordInArabic,
      level,
      predictionPer
    );
    console.log(`word:${word} level:${level} prediction:${predictionPer}`);
  }
};


// logic for audio player
const selected_qari = document.getElementById('qari');
const selected_ayat = document.getElementById('ayat');
const audio_player = document.getElementById('qariAudio');

selected_qari.addEventListener('change', updateAudioPlayer);
selected_ayat.addEventListener('change', updateAudioPlayer);

function updateAudioPlayer() {
  let qari = selected_qari.value;
  let ayat = selected_ayat.value;
  ayat = parseInt(ayat) + 1;
  ayat = ayat.toString();
  const audioSrc = `qari_examples/${qari}_${ayat}.wav`;
  audio_player.src = audioSrc;
  audio_player.load();
}

updateAudioPlayer();  // update audio player on page load
