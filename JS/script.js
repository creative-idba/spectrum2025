let timer;
let totalSeconds = 0;
let running = false;

function updateDisplay() {
  let hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  let mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  let secs = String(totalSeconds % 60).padStart(2, '0');
  document.getElementById("display").textContent = `${hrs}:${mins}:${secs}`;
}

document.getElementById("set").addEventListener("click", function () {
  let h = parseInt(document.getElementById("hours").value) || 0;
  let m = parseInt(document.getElementById("minutes").value) || 0;
  let s = parseInt(document.getElementById("seconds").value) || 0;
  totalSeconds = h * 3600 + m * 60 + s;
  updateDisplay();
});

document.getElementById("start").addEventListener("click", function () {
  if (!running && totalSeconds > 0) {
    running = true;
    timer = setInterval(() => {
      if (totalSeconds > 0) {
        totalSeconds--;
        updateDisplay();
      } else {
        clearInterval(timer);
        running = false;
        alert("Waktu Habis!");
      }
    }, 1000);
  }
});

document.getElementById("pause").addEventListener("click", function () {
  clearInterval(timer);
  running = false;
});

document.getElementById("reset").addEventListener("click", function () {
  clearInterval(timer);
  running = false;
  totalSeconds = 0;
  updateDisplay();
});

document.querySelectorAll(".content_tim1 input, .content_tim2 input").forEach(input => {
  input.addEventListener("input", function() {
    this.style.width = "auto";
    let newWidth = this.scrollWidth + 10;
    if (newWidth < 100) newWidth = 100;
    if (newWidth > 400) newWidth = 400;
    this.style.width = newWidth + "px";
  });
});
 
function openFullscreen() {
  let elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { 
    elem.msRequestFullscreen();
  }
}

const contentInputs = document.querySelector(".content_inputs");
document.addEventListener("fullscreenchange", () => {
  if (document.fullscreenElement) {
    contentInputs.style.display = "none";
  } else {
    contentInputs.style.display = "block";
  }
});

function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
}
