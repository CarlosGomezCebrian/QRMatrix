const canvas = document.getElementById("canvasEfect");
const ctx = canvas.getContext("2d");
const w = (canvas.width = document.body.offsetWidth);
const h = (canvas.height = document.body.offsetHeight);

function resizeCanvas() {
  canvas.width = document.body.offsetWidth;
  canvas.height = document.body.offsetHeight;
}

function resizeCanvasPlus() {
  canvas.width = document.body.offsetWidth;
  canvas.height = document.body.offsetHeight;
  //startAnimation(50);
}

window.addEventListener("load", resizeCanvas);
window.addEventListener("resize", resizeCanvasPlus);

const cols = Math.floor(w / 20) + 1;
const ypos = Array(cols).fill(0);

const colors = [
  "#0f0",
  "#0f0",
  "#0f0",
  "#0ff",
  "#0f0",
  "#0f0",
  "#0f0",
  "#800080",
  "#0f0",
  "#0f0",
  "#0f0",
  "#ff0",
  "#0f0",
  "#0f0",
  "#0f0",
];
let colorIndex = 0;

let intervalCount = 0;
let totalIntervals = 100;
let isRunning = true;
const stopButton = document.getElementById("stopButton");

function matrix() {
  ctx.fillStyle = "#0001";
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = colors[colorIndex];
  ctx.font = "25pt monospace";

  ypos.forEach((y, ind) => {
    const text = String.fromCharCode(Math.random() * 128);
    const x = ind * 20;
    ctx.fillText(text, x, y);
    if (y > 100 + Math.random() * 10000) ypos[ind] = 0;
    else ypos[ind] = y + 20;
  });

  colorIndex = (colorIndex + 1) % colors.length;

  if (isRunning) {
    intervalCount++;
    if (intervalCount >= totalIntervals) {
      stopAnimation();
    }
  }
}

let animationInterval;

export function startAnimation(customTotalIntervals) {
  intervalCount = 0;
  totalIntervals = customTotalIntervals;
  animationInterval = setInterval(matrix, 50);
  stopButton.textContent = "Detener";
  isRunning = true;
}

function stopAnimation() {
  clearInterval(animationInterval);
  stopButton.textContent = "Reanudar";
  isRunning = false;
}

startAnimation(50);

stopButton.addEventListener("click", () => {
  if (isRunning) {
    stopAnimation();
  } else {
    startAnimation();
  }
});

const goEncrypt = document.getElementById("goEncrypt");
const encryptConteiner = document.querySelector(".encryptConteiner");
const QRConteiner = document.querySelector(".QRConteiner");
let buttonstatus = false;
goEncrypt.addEventListener("click", () => {
  startAnimation(20);
  if (buttonstatus) {
    encryptConteiner.style.display = "flex";
    QRConteiner.style.display = "none";
    goEncrypt.textContent = "Generar QR";
    buttonstatus = false;
  } else {
    encryptConteiner.style.display = "none";
    QRConteiner.style.display = "flex";
    goEncrypt.textContent = "Encriptador";
    buttonstatus = true;
  }
});

//logica encriptador
const input = document.getElementById("input");
const output = document.getElementById("output");
const outputSpan = document.querySelector(".outputSpan");

input.addEventListener("keydown", function (event) {
  if (
    event.key.match(/[^a-zA-Z\s()&.:,;{}[\]¡!¿?"#$%/_-]/) &&
    event.key !== "Backspace" &&
    event.key !== "Delete" &&
    event.key !== "ArrowLeft" &&
    event.key !== "ArrowRight"
  ) {
    event.preventDefault();
    alert("Por favor, no ingrese números ni caracteres con acento.");
  }
});

const buttonEncrypt = document.querySelector(".encrypt");
const buttonDecrypt = document.querySelector(".decrypt");
const buttonCopy = document.querySelector("#copy");

buttonEncrypt.addEventListener("click", () => {
  stopAnimation();
  encryptConteiner.style.backgroundColor = "transparent";
  if (input.value) {
    startAnimation(20);
    encryptConteiner.style.backgroundColor = "transparent";
    setTimeout(() => {
      const inputEncrypt = encrypt(input.value);
      outputSpan.textContent = inputEncrypt;
      input.value = "";
      encryptConteiner.style.backgroundColor = "rgba(255, 255, 255, 0.4)";
      output.style.borderColor = "yellow";
    }, 1000);
  } else {
    alert("Nada que encriptar.");
    encryptConteiner.style.backgroundColor = "rgba(255, 255, 255, 0.4)";
  }
});

buttonDecrypt.addEventListener("click", () => {
  stopAnimation();
  if (input.value) {
    startAnimation(20);
    encryptConteiner.style.backgroundColor = "transparent";
    setTimeout(() => {
      const inputDecrypt = decrypt(input.value);
      outputSpan.textContent = inputDecrypt;
      input.value = "";
      encryptConteiner.style.backgroundColor = "rgba(255, 255, 255, 0.4)";
      output.style.borderColor = "yellow";
    }, 1000);
  } else {
    alert("Nada que desencriptar.");
    encryptConteiner.style.backgroundColor = "rgba(255, 255, 255, 0.4)";
  }
});

buttonCopy.addEventListener("click", () => {
  const textToCopy = outputSpan.textContent;
  navigator.clipboard
    .writeText(textToCopy)
    .then(() => {
      stopAnimation();
      startAnimation(20);
      encryptConteiner.style.backgroundColor = "transparent";
      setTimeout(() => {
        input.value = textToCopy;
        input.focus();
        output.style.borderColor = "#32ff32";
        outputSpan.textContent = "";
        delateOpenLink();
        encryptConteiner.style.backgroundColor = "rgba(255, 255, 255, 0.4)";
      }, 1000);
    })
    .catch((err) => {
      console.error("Error al copiar texto:", err);
    });
});

function encrypt(ciphertext) {
  let matrizCodigo = [
    ["e", "emter"],
    ["i", "imes"],
    ["a", "ai"],
    ["o", "ober"],
    ["u", "ufat"],
  ];
  ciphertext = ciphertext.toLowerCase();
  for (let i = 0; i < matrizCodigo.length; i++) {
    if (ciphertext.includes(matrizCodigo[i][0])) {
      ciphertext = ciphertext.replaceAll(
        matrizCodigo[i][0],
        matrizCodigo[i][1]
      );
    }
  }
  return ciphertext;
}

function decrypt(decryptedText) {
  let matrizCodigo = [
    ["e", "emter"],
    ["i", "imes"],
    ["a", "ai"],
    ["o", "ober"],
    ["u", "ufat"],
  ];
  decryptedText = decryptedText.toLowerCase();
  for (let i = 0; i < matrizCodigo.length; i++) {
    if (decryptedText.includes(matrizCodigo[i][0])) {
      decryptedText = decryptedText.replaceAll(
        matrizCodigo[i][1],
        matrizCodigo[i][0]
      );
    }
  }
  return decryptedText;
}

input.addEventListener("keydown", function (event) {
  if (
    event.key.match(/[^a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]/) &&
    event.key !== "Backspace" &&
    event.key !== "Delete" &&
    event.key !== "ArrowLeft" &&
    event.key !== "ArrowRight"
  ) {
    event.preventDefault();
  }
});

input.addEventListener("focus", function () {
  output.style.borderColor = "#32ff32";
  outputSpan.textContent = "";
  delateOpenLink();
});

function delateOpenLink() {
  let OpenLinkA = output.querySelectorAll("a");

  OpenLinkA.forEach(function (a) {
    a.remove();
  });
}

// generar qr

const containerQr = document.getElementById("containerQr");
const inputQr = document.getElementById("inputQr");
const buttonGenerateQr = document.getElementById("buttonGenerateQr");
const selectQr = document.getElementById("selectQr");
const outputQr = document.getElementById("outputQrSpan");
const linkQr = document.getElementById("linkQr");
const buttondownload = document.getElementById("buttondownload");

var makeCode;
let theCodeWasGenerated = false;

buttonGenerateQr.addEventListener("click", showCodeQR);

function showCodeQR() {
  stopAnimation();
  startAnimation(20);
  setTimeout(() => {
    if (makeCode) {
      const QR = new QRCode(containerQr);
      QR.makeCode(makeCode);
      theCodeWasGenerated = true;
      makeCode = "";
      setTimeout(() => {
        const canvas = containerQr.querySelector("canvas");
        const qrImageContainer = document.getElementById("qrImageContainer");
        const img = document.createElement("img");
        img.src = canvas.toDataURL("image/png");
        qrImageContainer.appendChild(img);
        inputQr.value = "";
        outputQr.textContent = "";
        linkQr.style.display = "none";
        QRConteiner.style.backgroundColor = "rgba(255, 255, 255, 0.4)";
        qrImageContainer.style.borderColor = "yellow";
      }, 100);
    } else {
      deleteImg();
      alert("Datos incorrectos o faltan datos");
    }
  }, 1000);
}

function generateMakeCode() {
  let inputValue = inputQr.value;

  // Validación de caracteres no admitidos /[^a-zA-Z0-9\s.,:;!?áéíóúÁÉÍÓÚ]/  [^a-zA-Z0-9\s.,:;!?/]
  let invalidCharacter = inputValue.match(/[^a-zA-Z0-9\s.,:;!?/]/);
  if (invalidCharacter) {
    alert(
      `El texto ingresado contiene el carácter no admitido: '${invalidCharacter[0]}'. Por favor, elimínelo y vuelva a intentarlo.`
    );
    return;
  }

  if (inputValue.length > 280) {
    alert("Ingrese un texto de máximo 280 caracteres.");
    return;
  }

  if (selectQr.value === "text") {
    makeCode = inputValue;
  } else {
    makeCode = selectQr.value + inputValue;
  }
  outputQr.textContent = makeCode;
  outputQr.style.color = "cyan";
  linkQr.href = makeCode;
  linkQr.target = "_blank";
  updateTextQRLink(makeCode);
}

/*
function generateMakeCode() {
  if (selectQr.value === "text") {
    makeCode = inputQr.value;
  } else {
    makeCode = selectQr.value + inputQr.value;
  }
  outputQr.textContent = makeCode;
  outputQr.style.color = "cyan";
  linkQr.href = makeCode;
  linkQr.target = "_blank";
  updateTextQRLink(makeCode);
}*/

function updateTextQRLink(url) {
  let validateLink = esURLValida(url);
  if (validateLink) {
    linkQr.textContent = "Ir a URL";
    linkQr.style.display = "block";
  } else {
    linkQr.style.display = "none";
    linkQr.textContent = "QR txt";
    linkQr.href = "#";
    linkQr.target = "";
  }
}

selectQr.addEventListener("click", generateMakeCode);

inputQr.addEventListener("input", generateMakeCode);

inputQr.addEventListener("focusin", () => {
  selectQr.classList.add("focused");
  qrImageContainer.style.borderColor = "#32ff32";
  deleteImg();
});
inputQr.addEventListener("blur", () => {
  selectQr.classList.remove("focused");
});

function esURLValida(url) {
  const expresionRegularURL = /^(ftp|http|https):\/\/[^ "]+$/;
  return expresionRegularURL.test(url);
}

function downloadQRCode() {
  var canvas = containerQr.querySelector("canvas");
  var ctx = canvas.getContext("2d");
  var padding = 8;
  var newCanvas = document.createElement("canvas");
  newCanvas.width = canvas.width + 2 * padding;
  newCanvas.height = canvas.height + 2 * padding;
  var newCtx = newCanvas.getContext("2d");

  newCtx.fillStyle = "#FFFFFF";
  newCtx.fillRect(0, 0, newCanvas.width, newCanvas.height);

  newCtx.drawImage(canvas, padding, padding);

  var image = newCanvas
    .toDataURL("image/png")
    .replace("image/png", "image/octet-stream");

  var link = document.createElement("a");
  link.setAttribute("href", image);
  link.setAttribute("download", "codigo_qr.png");
  link.click();

  // Eliminar el canvas temporal
  newCanvas.remove();
  deleteImg();
}

function deleteImg() {
  theCodeWasGenerated = false;
  qrImageContainer.style.borderColor = "#32ff32";
  QRConteiner.style.backgroundColor = "rgba(255, 255, 255, 0.4)";
  let qrImages = containerQr.querySelectorAll("img");
  let qrCanvas = containerQr.querySelectorAll("canvas");
  let qrImageLear = qrImageContainer.querySelectorAll("img");

  qrCanvas.forEach(function (canvas) {
    canvas.remove();
  });

  qrImages.forEach(function (img) {
    img.remove();
  });

  qrImageLear.forEach(function (img) {
    img.remove();
  });
}

buttondownload.addEventListener("click", () => {
  startAnimation(20);
  if (theCodeWasGenerated) {
    downloadQRCode();
    theCodeWasGenerated = false;
  } else {
    alert("No has generado el código QR");
  }
});
