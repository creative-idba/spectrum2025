let totalCentiseconds = 0;
let running = false;
let history = [];
let tempWaktuTim1 = null;
let tempWaktuTim2 = null;
let tempTim1Name = null;
let tempTim2Name = null;
let dataSudahDikirim = false;

let startTime = 0;
let endTime = 0;
let animationFrameId = 0;

const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbwtwaeBQ6IJ1gwtliz9buJV95rEf06Nsb10XAbnzY6IRa0N3o79NxvwOd-V8sD_YRvkMA/exec";

window.addEventListener('DOMContentLoaded', () => {
  const display = document.getElementById("display");
  if (!display) return;
  display.contentEditable = true;

  // Ambil elemen
  const contentTimNormal = document.querySelector('.content_tim');
  const contentTimStart = document.querySelector('.content_tim_start');
  const h3i = document.querySelector('.h3i');
  const h5i = document.querySelector('.h5i');
  const h4i = document.querySelector('.h4');
  const timer = document.querySelector('.timer');
  const content_button = document.querySelector('.content_button');


  function updateDisplay() {
    let totalSeconds = Math.floor(totalCentiseconds / 100);
    let mins = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    let secs = String(totalSeconds % 60).padStart(2, '0');
    let cs = String(totalCentiseconds % 100).padStart(2, '0');
    display.textContent = `${mins}:${secs}:${cs}`;
    display.contentEditable = !running;

    if (running && totalSeconds <= 30) {
      display.classList.add('pulse');
    } else {
      display.classList.remove('pulse');
    }
    if (running && totalSeconds == 179) {
      display.classList.add('blang');
    } else {
      display.classList.remove('blang');
    }
  }

  function parseDisplayTime() {
    const parts = display.textContent.trim().split(':');
    if (parts.length === 3) {
      let [m, s, cs] = parts.map(Number);
      m = isNaN(m) ? 0 : m;
      s = isNaN(s) ? 0 : s;
      cs = isNaN(cs) ? 0 : cs;
      cs = Math.min(Math.max(cs, 0), 99);
      totalCentiseconds = (m * 60 + s) * 100 + cs;
    } else {
      totalCentiseconds = 0;
    }
  }

  function formatTimeInput(text) {
    let digits = text.replace(/\D/g, '').padEnd(6, '0').slice(0, 6);
    while (digits.length < 6) digits += '0';
    let m = digits.slice(0, 2);
    let s = digits.slice(2, 4);
    let c = digits.slice(4, 6);
    m = String(Math.min(parseInt(m) || 0, 99)).padStart(2, '0');
    s = String(Math.min(parseInt(s) || 0, 59)).padStart(2, '0');
    c = String(Math.min(parseInt(c) || 0, 99)).padStart(2, '0');
    return `${m}:${s}:${c}`;
  }

  function checkAndSaveMatch(akhir = false) { 
    const tim1Name = document.querySelector(".content_tim1 input")?.value.trim() || "Tim Biru";
    const tim2Name = document.querySelector(".content_tim2 input")?.value.trim() || "Tim Merah";

    const waktu1 = tempWaktuTim1 !== null ? tempWaktuTim1 : "00:00:00";
    const waktu2 = tempWaktuTim2 !== null ? tempWaktuTim2 : "00:00:00";

    if (!akhir && dataSudahDikirim) {
      alert("Data sudah dikirim sebelumnya.");
      return;
    }

    if (akhir && dataSudahDikirim) {
      return; 
    }

    const matchData = {
      tim1: tim1Name,
      waktu1: waktu1,
      tim2: tim2Name,
      waktu2: waktu2
    };

    history.push(matchData);

    const formData = new URLSearchParams();
    formData.append('tim1', matchData.tim1);
    formData.append('waktu1', matchData.waktu1);
    formData.append('tim2', matchData.tim2);
    formData.append('waktu2', matchData.waktu2);

    fetch(GOOGLE_SHEETS_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData
    }).catch(() => {});

    if (!akhir) {
      dataSudahDikirim = true;
    }
  }

  display.addEventListener('blur', () => {
    if (!running) {
      display.textContent = formatTimeInput(display.textContent);
      display.contentEditable = true;
    }
  });

  display.addEventListener('keydown', (e) => {
    if (running) return;
    const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'];
    if (!allowed.includes(e.key) && !(e.key >= '0' && e.key <= '9')) {
      e.preventDefault();
    }
  });

  display.addEventListener('focus', () => {
    if (!running) {
      const sel = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(display);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  });

  function startTimer() {
    tempWaktuTim1 = null;
    tempWaktuTim2 = null;
    tempTim1Name = null;
    tempTim2Name = null;
    dataSudahDikirim = false;

    parseDisplayTime();
    if (totalCentiseconds > 0) {
      running = true;
      updateDisplay();

      startTime = Date.now();
      endTime = startTime + totalCentiseconds * 10; 

      function updateTimer() {
        if (!running) return;

        const now = Date.now();
        const remainingTime = Math.max(0, endTime - now);

        totalCentiseconds = Math.floor(remainingTime / 10);

        updateDisplay();

        if (totalCentiseconds > 0) {
          animationFrameId = requestAnimationFrame(updateTimer);
        } else { 
          cancelAnimationFrame(animationFrameId);
          running = false;
          updateDisplay();
          checkAndSaveMatch(true); 
        }
      }

      animationFrameId = requestAnimationFrame(updateTimer);
    }
  }

  function pauseTimer() {
    if (running) {
      cancelAnimationFrame(animationFrameId);
      running = false;
      updateDisplay();
    }
  }

  function resetTimer() {
    cancelAnimationFrame(animationFrameId);
    running = false;
    totalCentiseconds = 0;
    tempWaktuTim1 = null;
    tempWaktuTim2 = null;
    tempTim1Name = null;
    tempTim2Name = null;
    dataSudahDikirim = false; 
    updateDisplay();
  }

  document.getElementById("start")?.addEventListener("click", startTimer);
  document.getElementById("pause")?.addEventListener("click", pauseTimer);
  document.getElementById("reset")?.addEventListener("click", resetTimer);

  document.getElementById("export")?.addEventListener("click", () => {
    if (history.length === 0) {
      alert("Belum ada data!");
      return;
    }

    let csvLines = [];
    history.forEach(match => {
      csvLines.push('Tim1,Tim2');
      csvLines.push(`"${match.tim1}","${match.tim2}"`);
      csvLines.push(`"${match.waktu1}","${match.waktu2}"`);
      csvLines.push('');
    });

    if (csvLines[csvLines.length - 1] === '') csvLines.pop();

    const blob = new Blob([csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hasil_linefollower.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  document.querySelectorAll(".content_tim1 input, .content_tim2 input").forEach(input => {
    const container = input.closest('.content_tim1, .content_tim2');
    function adjustWidth() {
      input.style.width = 'auto';
      const w = Math.max(input.scrollWidth + 20, 220);
      input.style.width = w + 'px';
      container.style.width = (w + 40) + 'px';
    }
    adjustWidth();
    input.addEventListener('input', adjustWidth);
    input.addEventListener('focus', adjustWidth);
  });

  // Shortcut Keyboard
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return;
    const displayTime = display.textContent;

    if (e.code === 'Space') {
      e.preventDefault();
      if (!running) document.getElementById("start")?.click();
      else document.getElementById("pause")?.click();
    }

    if (e.code === 'KeyB' || e.code === 'Numpad1') {
      e.preventDefault();
      tempWaktuTim1 = displayTime;
      const name = document.querySelector(".content_tim1 input")?.value.trim() || "Tim Biru"; 
    }

    if (e.code === 'KeyA' || e.code === 'Numpad2') {
      e.preventDefault();
      tempWaktuTim2 = displayTime;
      const name = document.querySelector(".content_tim2 input")?.value.trim() || "Tim Merah";
    }

    if (e.code === 'KeyP') {
      e.preventDefault();
      checkAndSaveMatch();
    }
 
    if (e.code === 'KeyI') { // I = Input Start
      e.preventDefault();
      contentTimNormal.classList.add('d-none');
      timer.classList.add('d-none');
      contentTimStart.classList.remove('d-none');
      h3i.classList.add('h3ii');
      h5i.classList.add('d-none');
      h4i.classList.remove('d-none');
    }
    
    if (e.code === 'KeyO') { // O = Output Back
      e.preventDefault();
      contentTimStart.classList.add('d-none');
      contentTimNormal.classList.remove('d-none');
      timer.classList.remove('d-none');
      h3i.classList.remove('h3ii');
      h5i.classList.remove('d-none');
      h4i.classList.add('d-none');
    }
  });

  updateDisplay();
});