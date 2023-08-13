// ======== Navbar color change=========
var myNav = document.getElementById("web_navbar");
const getStartedBtn = document.getElementById("getStartedBtn");

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
var recordAudioBlob;

navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
  handlerFunction(stream);
});
var isRecording = document.getElementById("isRecording");

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

function sendData(data) {
  recordAudioBlob = data;
  console.log(data);
}
record.onclick = (e) => {
  isRecording.style.visibility = "visible";
  record.disabled = true;
  record.style.backgroundColor = "red";
  stopRecord.disabled = false;
  audioChunks = [];
  rec.start();
};
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
const demoData = {
  actual_ayat_words: ["Ar-Rahmaan", "Ar-Raheem"],
  ayat_number: "3",
  correctness_levels: ["medium", "low"],
  predictions: [
    ["Ar-Rahmaan", 0.9917491674423218],
    ["Yumid", 0.7654581069946289],
  ],
  surah_number: "1",
  time_request: 1691746637,
  version: "0.1",
};

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

