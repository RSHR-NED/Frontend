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

// ===========Toggle Recitation and Memorization Btn ================

const toggleVisibility = document.querySelectorAll(".toggle-visibility");
const memorizationBtn = document.querySelector("#memorization_btn");
const recitation_btn = document.querySelector("#recitation_btn");
const toggleRecitation = (isRecite) => {
  if (isRecite === true) {
    memorizationBtn.classList.add("visible-btn-color");
    recitation_btn.classList.remove("visible-btn-color");
  } else {
    memorizationBtn.classList.remove("visible-btn-color");
    recitation_btn.classList.add("visible-btn-color");
  }
  toggleVisibility.forEach((element) => {
    if (isRecite === true) {
      element.classList.add("visible");
    } else {
      element.classList.remove("visible");
    }
  });
};

toggleRecitation(true);

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
      sendData(blob);
    }
  };
}

function sendData(data) {
  recordAudioBlob=data;
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

const surahSelect = document.querySelector("#surah");
const ayatSelect = document.querySelector("#ayat");

const fileInput = document.getElementById("file");
var file;

fileInput.addEventListener("change", (event) => {
  file = event.target.files[0];
});

const formSubmit = document.querySelector("#formSubmit");
console.log(formSubmit);

let formSubmissions = {};

formSubmit.addEventListener("click", (e) => {
  e.preventDefault(); // prevent default submit behavior

  console.log("form submitted");
  let selectedSurah = surahSelect.options[surahSelect.selectedIndex].value;
  let selectedAyat = ayatSelect.options[ayatSelect.selectedIndex].value;
  let audioData;
  if(recordAudioBlob != undefined){
    audioData = recordAudioBlob;
  } else{
    audioData = file;
  }
  console.log({
    selectedSurah,
    selectedAyat,
    audioData,
  })

  // if no audio file is selected, return
  if (audioData == undefined) {
    alert("Please select an audio file");
    return;
  }

  // store response in formResponses object for sending to server later
  let current_key = selectedSurah + "_" + selectedAyat;
  formSubmissions[current_key] = audioData;

  // mark ayat as uploaded
  let ayat_element;
  let ayat_number = parseInt(selectedAyat) - 1;
  if (ayat_number == 0) {
    ayat_element = document.querySelector("#bismillah_ayat");
  }
  else {
    let arabicAyats = document.querySelector(".arabic-ayats");
    ayat_element = arabicAyats.querySelector(`span:nth-child(${ayat_number})`).querySelector("span");
  }
  ayat_element.style.color = "#ff9822";
  ayat_element.style.backgroundColor = "black";

});



// document.getElementById("check_prediction").addEventListener("click", (e) => {
//   e.preventDefault();
  
//   let all_results = [];
//   let fetch_promises = []; // Corrected variable name
//   console.log("Starting predictions");
  
//   for (let key in formSubmissions) {
//     let surah_number = key.split("_")[0]; 
//     let ayat_number = key.split("_")[1];
//     let current_audio = formSubmissions[key];

//     let formData = new FormData();
//     formData.append("surah_number", surah_number);
//     formData.append("ayat_number", ayat_number);
//     formData.append("audio_file", current_audio);

//     console.log("Calling backend for predicting surah " + surah_number + " ayat " + ayat_number);

    
//     // Push the fetch promise into the array
//     fetch_promises.push(
//       fetch("http://127.0.0.1:5000/api/ayat_accuracy", {
//         method: "POST",
//         body: formData,
//       })
//       .then((response) => response.json())
//       .then((data) => {
//         console.log(data);
//         all_results.push(data);
//       })
//     );
//   }

//   // Use Promise.all to wait for all fetch promises to complete
//   Promise.all(fetch_promises)
//     .then(() => {
//       const encodedResults = encodeURIComponent(JSON.stringify(all_results));
//       console.log(encodedResults);

//       // Redirect to the results page with the encoded results
//       window.location.href = "/prediction-source.html?results=" + encodedResults;
//     });
// });


document.getElementById("check_prediction").addEventListener("click", async (e) => {
  e.preventDefault();
  
  // Clear previous results
  let all_results = [];

  // Loop through form submissions
  for (let key in formSubmissions) {
    let surah_number = key.split("_")[0];
    let ayat_number = key.split("_")[1];
    let current_audio = formSubmissions[key];

    let formData = new FormData();
    formData.append("surah_number", surah_number);
    formData.append("ayat_number", ayat_number);
    formData.append("audio_file", current_audio);

    console.log("Calling backend for predicting surah " + surah_number + " ayat " + ayat_number);

    try {
      const response = await fetch("http://127.0.0.1:5000/api/ayat_accuracy", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log(data);
      all_results.push(data);
    } catch (error) {
      console.error(error);
    }
  }

  // After all fetch requests are done, proceed with redirection
  const encodedResults = encodeURIComponent(JSON.stringify(all_results));
  console.log(encodedResults);

  // Redirect to the results page with the encoded results
  window.location.href = "/prediction-source.html?results=" + encodedResults;
});
