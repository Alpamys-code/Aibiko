// Load all photos into masonry
const photosContainer = document.getElementById('photos');
const totalPhotos = 45;

// Shuffle for more organic look
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const photoNums = shuffle([...Array(totalPhotos).keys()].map(i => i + 1));

photoNums.forEach(num => {
  const img = document.createElement('img');
  const padded = String(num).padStart(2, '0');
  img.src = `photos/photo-${padded}.jpg`;
  img.alt = `photo ${num}`;
  img.loading = 'lazy';
  photosContainer.appendChild(img);
});

// Audio + lyrics sync
const audio = document.getElementById('song');
const playBtn = document.getElementById('playBtn');
const lines = document.querySelectorAll('.lyrics-container .line');

let currentLine = -1;

function updateLyrics() {
  const t = audio.currentTime;
  
  // Find the active line
  let activeIdx = -1;
  for (let i = lines.length - 1; i >= 0; i--) {
    const lineTime = parseFloat(lines[i].dataset.time);
    if (t >= lineTime) {
      activeIdx = i;
      break;
    }
  }
  
  if (activeIdx !== currentLine) {
    // Fade out previous
    if (currentLine >= 0) {
      lines[currentLine].classList.remove('active');
      lines[currentLine].classList.add('fade-out');
    }
    
    // Activate new
    if (activeIdx >= 0) {
      lines[activeIdx].classList.remove('fade-out');
      lines[activeIdx].classList.add('active');
    }
    
    currentLine = activeIdx;
  }
}

// Play button (browsers block autoplay)
playBtn.addEventListener('click', () => {
  audio.play().then(() => {
    playBtn.classList.add('hidden');
    // Start lyrics updater
    setInterval(updateLyrics, 200);
  }).catch(err => {
    console.log('Play failed:', err);
  });
});

// Also allow spacebar
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && !playBtn.classList.contains('hidden')) {
    playBtn.click();
  }
});

// Optional: restart lyrics on loop
audio.addEventListener('ended', () => {
  currentLine = -1;
  lines.forEach(l => {
    l.classList.remove('active', 'fade-out');
  });
});
