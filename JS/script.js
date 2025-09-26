let timer;
let totalSeconds = 0;
let running = false;

function updateDisplay() {
  let hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  let mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  let secs = String(totalSeconds % 60).padStart(2, '0');
  document.getElementById("display").textContent = `${hrs}:${mins}:${secs}`;
}

// Tombol Set waktu
document.getElementById("set").addEventListener("click", function () {
  let h = parseInt(document.getElementById("hours").value) || 0;
  let m = parseInt(document.getElementById("minutes").value) || 0;
  let s = parseInt(document.getElementById("seconds").value) || 0;
  totalSeconds = h * 3600 + m * 60 + s;
  updateDisplay();
});

// Start timer
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

// Pause timer
document.getElementById("pause").addEventListener("click", function () {
  clearInterval(timer);
  running = false;
});

// Reset timer
document.getElementById("reset").addEventListener("click", function () {
  clearInterval(timer);
  running = false;
  totalSeconds = 0;
  updateDisplay();
});
