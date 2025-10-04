let timer;
let totalCentiseconds = 0;
let running = false;
// Tambahkan di akhir file JS, setelah semua kode
window.addEventListener('DOMContentLoaded', () => {
  const display = document.getElementById("display");
  display.contentEditable = true;
  display.focus(); // opsional: fokus otomatis
});

function updateDisplay() {
  let totalSeconds = Math.floor(totalCentiseconds / 100);
  let mins = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  let secs = String(totalSeconds % 60).padStart(2, '0');
  let cs = String(totalCentiseconds % 100).padStart(2, '0');
  
  const display = document.getElementById("display");
  display.textContent = `${mins}:${secs}:${cs}`;
  display.contentEditable = !running; // nonaktifkan edit saat jalan
}

function parseDisplayTime() {
  const display = document.getElementById("display");
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
const display = document.getElementById("display");

// Format teks ke MM:SS:cc saat user selesai mengedit
function formatTimeInput(text) {
  // Hanya ambil digit 0-9
  let digits = text.replace(/\D/g, '').padEnd(6, '0').slice(0, 6);
  
  // Pastikan panjang 6 digit (MMSScc)
  while (digits.length < 6) digits += '0';
  
  // Ambil bagian
  let m = digits.slice(0, 2);
  let s = digits.slice(2, 4);
  let c = digits.slice(4, 6);
  
  // Batasi nilai:
  m = String(Math.min(parseInt(m) || 0, 99)).padStart(2, '0');
  s = String(Math.min(parseInt(s) || 0, 59)).padStart(2, '0');
  c = String(Math.min(parseInt(c) || 0, 99)).padStart(2, '0');
  
  return `${m}:${s}:${c}`;
}

// Terapkan format saat user blur (keluar dari edit)
display.addEventListener('blur', function () {
  if (!running) {
    this.textContent = formatTimeInput(this.textContent);
    this.contentEditable = true; // pastikan tetap bisa diedit
  }
});

// Batasi input saat mengetik (hanya angka dan :)
display.addEventListener('keydown', function (e) {
  if (running) return; // jangan izinkan edit saat timer jalan

  const allowedKeys = [
    'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'
  ];
  
  // Izinkan navigasi dan angka
  if (
    allowedKeys.includes(e.key) ||
    (e.key >= '0' && e.key <= '9')
  ) {
    // Izinkan
  } else {
    e.preventDefault(); // blokir karakter lain
  }
});

// Opsional: saat fokus, sorot semua teks
display.addEventListener('focus', function () {
  if (!running) {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(this);
    selection.removeAllRanges();
    selection.addRange(range);
  }
});

// Start
document.getElementById("start").addEventListener("click", () => {
  if (running) return;
  parseDisplayTime();
  if (totalCentiseconds > 0) {
    running = true;
    updateDisplay(); // nonaktifkan edit, tampilkan waktu
    timer = setInterval(() => {
      if (totalCentiseconds > 0) {
        totalCentiseconds--;
        updateDisplay();
      } else {
        clearInterval(timer);
        running = false;
        updateDisplay();
        alert("Waktu Habis!");
      }
    }, 10);
  }
});

// Pause
document.getElementById("pause").addEventListener("click", () => {
  if (running) {
    clearInterval(timer);
    running = false;
    updateDisplay(); // aktifkan edit
  }
});

// Reset
document.getElementById("reset").addEventListener("click", () => {
  clearInterval(timer);
  running = false;
  totalCentiseconds = 0;
  updateDisplay(); // kembali ke 00:00:00 + edit aktif
});
// Ganti kode auto-width lama dengan ini
document.querySelectorAll(".content_tim1 input, .content_tim2 input").forEach(input => {
  const container = input.closest('.content_tim1, .content_tim2');
  
  // Fungsi untuk atur lebar
  function adjustWidth() {
    // Reset dulu ke lebar minimum
    input.style.width = 'auto';
    
    // Dapatkan lebar konten sebenarnya
    const contentWidth = input.scrollWidth;
    
    // Tambahkan sedikit padding (sesuaikan dengan padding input)
    const totalWidth = Math.max(contentWidth + 20, 220); // min 220px
    
    // Atur lebar input dan container
    input.style.width = totalWidth + 'px';
    container.style.width = (totalWidth + 40) + 'px'; // +40 untuk padding container
  }

  // Jalankan saat halaman dimuat
  adjustWidth();

  // Jalankan saat input berubah
  input.addEventListener('input', adjustWidth);
  
  // Opsional: saat fokus, pastikan tidak kepotong
  input.addEventListener('focus', adjustWidth);
});