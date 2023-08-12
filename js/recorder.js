// https://medium.com/jeremy-gottfrieds-tech-blog/javascript-tutorial-record-audio-and-encode-it-to-mp3-2eedcd466e78


// const ffmpeg = createFFmpeg({
//   log: true,
//   corePath: 'https://cdnjs.cloudflare.com/ajax/libs/ffmpeg/0.11.6/ffmpeg.min.js',
// });


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
  const downloadLink = document.getElementById("downloadLink");

  console.log(data);
  downloadLink.href = URL.createObjectURL(data);
  downloadLink.style.display = "block";
  try {
    var process = new ffmpeg(data);
    process.then(function (audio) {
      // Callback mode
      audio.fnExtractSoundToMP3('../your_audio_file.mp3', function (error, file) {
        if (!error)
          console.log('Audio file: ' + file);
      });
    }, function (err) {
      console.log('Error: ' + err);
    });
  } catch (e) {
    console.log(e);
    console.log(e.msg);
  }
}


record.onclick = (e) => {
  console.log("I was clicked");
  isRecording.style.visibility = "visible";
  record.disabled = true;
  record.style.backgroundColor = "red";
  stopRecord.disabled = false;
  audioChunks = [];
  rec.start();
};
stopRecord.onclick = (e) => {
  isRecording.style.visibility = "hidden";
  console.log("I was clicked");
  record.disabled = false;
  stop.disabled = true;
  record.style.backgroundColor = "red";
  rec.stop();
};
