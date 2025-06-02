const maxPerLevel = 10;
const unlockThreshold = 0.75;

function getProgress(level) {
  return parseInt(localStorage.getItem(`progress_${level}`)) || 0;
}

function getProgressPercent(level) {
  return Math.round((getProgress(level) / maxPerLevel) * 100);
}

function selectDifficulty(level) {
  const progress = getProgress(level);
  if (level === "medium" && getProgressPercent("easy") < unlockThreshold * 100) return;
  if (level === "hard" && getProgressPercent("medium") < unlockThreshold * 100) return;

  localStorage.setItem("speakingDifficulty", level);
  window.location.href = "speaking.html";
}

function updateUI() {
  const easyProgress = getProgressPercent("easy");
  const mediumProgress = getProgressPercent("medium");
  const hardProgress = getProgressPercent("hard");

  document.getElementById("easyProgress").textContent = `${easyProgress}%`;
  document.getElementById("mediumProgress").textContent = `${mediumProgress}%`;
  document.getElementById("hardProgress").textContent = `${hardProgress}%`;

  document.getElementById("progress-bar-easy").style.width = `${easyProgress}%`;
  document.getElementById("progress-bar-medium").style.width = `${mediumProgress}%`;
  document.getElementById("progress-bar-hard").style.width = `${hardProgress}%`;

  if (easyProgress >= unlockThreshold * 100) {
    document.getElementById("mediumBtn").classList.remove("locked");
  }

  if (mediumProgress >= unlockThreshold * 100) {
    document.getElementById("hardBtn").classList.remove("locked");
  }
}

updateUI();
