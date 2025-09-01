// Playlist Data
const songs = [
  { title: "Beats Chill", artist: "Artist A", src: "songs/beats chill.mp3", cover: "covers/pic.jpeg" },
  { title: "CHILL", artist: "Artist B", src: "songs/chill.mp3", cover: "covers/chill.jpeg" },
  { title: "FrEE", artist: "Artist C", src: "songs/free.mp3", cover: "covers/eye.jpeg" },
  { title: "Lofy study", artist: "Artist D", src: "songs/lofy study.mp3", cover: "covers/pup.jpeg" },
  { title: "SnOOthing", artist: "Artist E", src: "songs/snoothing.mp3", cover: "covers/i-D.jpeg" },
  { title: "Soft", artist: "Artist F", src: "songs/soft.mp3", cover: "covers/smile.jpeg" },
];

let currentSongIndex = 0;
let isPlaying = false;

const audio = new Audio();
const playlistEl = document.getElementById("playlist");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const progressBar = document.getElementById("progress");
const volumeEl = document.getElementById("volume");
const nowPlayingEl = document.getElementById("now-playing");
const coverEl = document.getElementById("cover");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");

// Build Playlist with Covers
songs.forEach((song, index) => {
  const li = document.createElement("li");

  li.innerHTML = `
    <img src="${song.cover}" alt="cover">
    <div class="song-details">
      <span class="song-title">${song.title}</span>
      <span class="song-artist">${song.artist}</span>
    </div>
  `;

  li.addEventListener("click", () => loadSong(index));
  playlistEl.appendChild(li);
});

// Load a song
function loadSong(index) {
  currentSongIndex = index;
  audio.src = songs[index].src;
  coverEl.src = songs[index].cover;
  nowPlayingEl.textContent = `Now Playing: ${songs[index].title} - ${songs[index].artist}`;
  
  // highlight active song
  document.querySelectorAll("#playlist li").forEach((li, i) => {
    li.classList.toggle("active-song", i === index);
  });

  playSong();
}

// Play song
function playSong() {
  audio.play();
  isPlaying = true;
  playBtn.textContent = "⏸";
}

// Pause song
function pauseSong() {
  audio.pause();
  isPlaying = false;
  playBtn.textContent = "▶️";
}

// Toggle Play/Pause
playBtn.addEventListener("click", () => {
  isPlaying ? pauseSong() : playSong();
});

// Next / Prev
nextBtn.addEventListener("click", () => {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  loadSong(currentSongIndex);
});

prevBtn.addEventListener("click", () => {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  loadSong(currentSongIndex);
});

// Progress Bar
audio.addEventListener("timeupdate", () => {
  if (audio.duration) {
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = `${progressPercent}%`;
    currentTimeEl.textContent = formatTime(audio.currentTime);
    durationEl.textContent = formatTime(audio.duration);
  }
});

// Format time mm:ss
function formatTime(sec) {
  const minutes = Math.floor(sec / 60);
  const seconds = Math.floor(sec % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

// Seek (click on progress bar)
document.querySelector(".progress-bar").addEventListener("click", (e) => {
  const barWidth = e.target.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  audio.currentTime = (clickX / barWidth) * duration;
});

// Volume
volumeEl.addEventListener("input", () => {
  audio.volume = volumeEl.value;
});

// Auto next
audio.addEventListener("ended", () => {
  nextBtn.click();
});

// Load first song
loadSong(currentSongIndex);


// ==== 🌈 Animated Background Visualizer ====
const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Handle resize
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Web Audio API setup
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioContext.createAnalyser();
analyser.fftSize = 256;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

const source = audioContext.createMediaElementSource(audio);
source.connect(analyser);
analyser.connect(audioContext.destination);

// Animation loop
function animateBackground() {
  requestAnimationFrame(animateBackground);

  analyser.getByteFrequencyData(dataArray);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  let avg = dataArray.reduce((a, b) => a + b) / dataArray.length;

  // Dynamic gradient colors based on average frequency
  gradient.addColorStop(0, `hsl(${avg}, 100%, 50%)`);
  gradient.addColorStop(1, `hsl(${(avg + 180) % 360}, 100%, 50%)`);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Start animation
animateBackground();
