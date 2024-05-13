import { startAnimation } from "./main.js";

const video = document.createElement("video");

//nuestro camvas
const canvasElement = document.getElementById("qr-canvas");
const canvas = canvasElement.getContext("2d");

const input = document.getElementById("input");
const output = document.getElementById("output");
const outputSpan = document.querySelector(".outputSpan");
const buttonCopy = document.getElementById("copy");
const buttonClosed = document.getElementById("closed");
const buttonScanner = document.querySelector(".buttonScanner");
const buttonsEncrypt = document.getElementById("buttonsEncrypt");
const encryptConteiner = document.querySelector(".encryptConteiner");

let scanning = false;
var statusFlashlight = false;
function startScanning() {
  scanning = true;
  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: "environment" } })
    .then(function (stream) {
      cameraOn();
      video.srcObject = stream;
      video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
      video.play();
      tick();
    })
    .catch(function (error) {
      console.error("Error al acceder a la cámara:", error);
      alert("Error al acceder a la cámara");
      statusFlashlight = false;
    });
}

function tick() {
  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    canvasElement.height = video.videoHeight;
    canvasElement.width = video.videoWidth;
    canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
    const imageData = canvas.getImageData(
      0,
      0,
      canvasElement.width,
      canvasElement.height
    );
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: "dontInvert",
    });

    if (code) {
      stopScanning();
      handleQRResult(code.data);
    }
  }

  if (scanning) {
    requestAnimationFrame(tick);
  }
}

function stopScanning() {
  scanning = false;
  if (video && video.srcObject) {
    const tracks = video.srcObject.getTracks();
    if (tracks && tracks.length > 0) {
      tracks.forEach((track) => {
        track.stop();
      });
    }
  }

  if (statusFlashlight) {
    deactivateFlashlight();
    statusFlashlight = false;
  }
  cameraOff();
}

const decodeQRFromImage = (imageUrl) => {
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, img.width, img.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: "dontInvert",
    });

    if (code) {
      handleQRResult(code.data);
    } else {
      console.error("No se pudo decodificar ningún código QR desde la imagen.");
      alert("No se pudo decodificar ningún código QR desde la imagen.");
    }
  };
  img.onerror = (error) => {
    console.error("Error al cargar la imagen:", error);
    alert("Error al cargar la imagen o no es un archivo válido");
  };
  img.src = imageUrl;
};

const handleQRResult = (answer) => {
  turnOnSound();
  cameraOff();
  input.value = answer;
  outputSpan.textContent = answer;
  creatOpenLink(answer);
};

const handleImageChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      decodeQRFromImage(e.target.result);
    };
    reader.readAsDataURL(file);
  }
};
const customFileInputLabel = document.querySelector(".custom-file-input");
const imageInput = document.getElementById("imageInput");
imageInput.addEventListener("change", handleImageChange);

const turnOnSound = () => {
  let audio = document.getElementById("audioScaner");
  audio.play();
};

function creatOpenLink(answer) {
  let urlvalid = isURLValid(answer);
  if (urlvalid) {
    outputSpan.textContent = answer;
    const openLink = document.createElement("a");
    openLink.setAttribute("href", answer);
    openLink.setAttribute("target", "_blank");
    openLink.setAttribute("class", "openLink");
    openLink.textContent = "Ir al sitio";
    output.appendChild(openLink);
    openLink.addEventListener("click", (event) => {
      urlvalid = false;
      openLink.remove();
    });
  }
}

function isURLValid(url) {
  const expresionRegularURL = /^(ftp|http|https):\/\/[^ "]+$/;
  return expresionRegularURL.test(url);
}

function cameraOn() {
  startAnimation(50);
  showFlashlightButton();
  //buttonsEncrypt.setAttribute("hidden", "");
  customFileInputLabel.classList.add("none");
  buttonScanner.classList.add("none");
  input.style.display = "none";
  encryptConteiner.style.display = "block";
  output.style.display = "none";
  buttonsEncrypt.style.display = "none";
  canvasElement.style.display = "block";
  buttonCopy.classList.add("none");
  buttonClosed.classList.remove("none");
}

function cameraOff() {
  hideFlashlightButton();
  //buttonsEncrypt.removeAttribute("hidden");
  customFileInputLabel.classList.remove("none");
  buttonScanner.classList.remove("none");
  input.style.display = "inline-block";
  imageInput.style.display = "none";
  encryptConteiner.style.display = "flex";
  output.style.display = "flex";
  buttonsEncrypt.style.display = "block";
  canvasElement.style.display = "none";
  buttonCopy.classList.remove("none");
  buttonClosed.classList.add("none");
}

buttonScanner.addEventListener("click", startScanning);
buttonClosed.addEventListener("click", stopScanning);

const activateFlashlight = () => {
  if (
    navigator.mediaDevices &&
    navigator.mediaDevices.getUserMedia &&
    MediaStreamTrack.prototype.applyConstraints
  ) {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then(function (stream) {
        const track = stream.getVideoTracks()[0];
        if (track && typeof track.applyConstraints === "function") {
          statusFlashlight = true;
          track
            .applyConstraints({ advanced: [{ torch: true }] })

            .catch(function (error) {
              console.error(
                "Error al aplicar constraints para activar la linterna:",
                error
              );
              statusFlashlight = false;
              alert("No se pudo acceder a la linterna");
            });
        } else {
          console.error(
            "El track de video no admite la aplicación de constraints"
          );
          statusFlashlight = false;
        }
      })
      .catch(function (error) {
        console.error("Error al acceder a la cámara:", error);
      });
  } else {
    console.error(
      "El navegador no soporta la API de getUserMedia o MediaStreamTrack.prototype.applyConstraints"
    );
  }
};

const deactivateFlashlight = () => {
  if (
    navigator.mediaDevices &&
    navigator.mediaDevices.getUserMedia &&
    MediaStreamTrack.prototype.applyConstraints
  ) {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then(function (stream) {
        const track = stream.getVideoTracks()[0];
        if (track && typeof track.applyConstraints === "function") {
          statusFlashlight = false;
          track
            .applyConstraints({ advanced: [{ torch: false }] })
            .catch(function (error) {
              console.error(
                "Error al aplicar constraints para desactivar la linterna:",
                error
              );
              alert("No se pudo apagar la linterna");
            });
        } else {
          console.warn("La linterna no está disponible en este dispositivo.");
        }
      })
      .catch(function (error) {
        console.error("Error al acceder a la cámara:", error);
      });
  } else {
    console.error(
      "El navegador no soporta la API de getUserMedia o MediaStreamTrack.prototype.applyConstraints"
    );
  }
};
const floatingButtonImg = document.querySelector(".floating-button-img");
function toggleFlashlight() {
  if (statusFlashlight) {
    deactivateFlashlight();
    floatingButtonImg.src = "./img/linternaOn.png";
    console.log("Luz off");
  } else {
    activateFlashlight();
    floatingButtonImg.src = "./img/linternaOff.png";
    console.log("Luz on");
  }
}

function updateFloatingButtonVisibility(showButton) {
  const flashlightButton = document.getElementById("flashlightButton");
  flashlightButton.addEventListener("click", toggleFlashlight);
  if (showButton) {
    flashlightButton.style.display = "block";
  } else {
    flashlightButton.style.display = "none";
    floatingButtonImg.src = "./img/linternaOn.png";
  }
}

// Llama a esta función al abrir y cerrar el canvas del video
function showFlashlightButton() {
  updateFloatingButtonVisibility(true);
}

function hideFlashlightButton() {
  updateFloatingButtonVisibility(false);
}

// Asigna clases para mostrar y ocultar el botón flotante según el estado del canvas del video
canvasElement.classList.add("show-flashlight-button"); // Cuando se abre el canvas
canvasElement.classList.remove("show-flashlight-button");
