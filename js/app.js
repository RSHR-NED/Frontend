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

// --------------- Get user input --------------
const qariSelect = document.querySelector("#qari");
const ayatSelect = document.querySelector("#ayat");

const fileInput = document.getElementById("file");
var file;
fileInput.addEventListener("change", (event) => {
  file = event.target.files[0];
});

const formSubmit = document.querySelector("#formSubmit");
formSubmit.addEventListener("click", (e) => {
  e.preventDefault(); // prevent default submit behavior

  const selectedQari = qariSelect.options[qariSelect.selectedIndex].value;
  const selectedAyat = ayatSelect.options[ayatSelect.selectedIndex].value;
  console.log(selectedQari, selectedAyat);
  console.log(file);
});
