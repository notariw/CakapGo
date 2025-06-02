
document.addEventListener("DOMContentLoaded", () => {
  const easy = document.getElementById("easy");
  const intermediate = document.getElementById("intermediate");
  const hard = document.getElementById("hard");

  easy.classList.remove("disabled");

  const unlockedIntermediate = localStorage.getItem("unlocked_intermediate") === "true";
  const unlockedHard = localStorage.getItem("unlocked_hard") === "true";

  if (!unlockedIntermediate) intermediate.classList.add("disabled");
  if (!unlockedHard) hard.classList.add("disabled");
});

function selectDifficulty(level) {
      localStorage.setItem("difficulty", level);
      window.location.href = "latihan.html";
}


  const totalPerLevel = {
    easy: 20,
    intermediate: 100,
    hard: 100
  };

  function loadProgressForLevel(level) {
    const saved = localStorage.getItem(`progress_${level}`);
    let correct = 0;

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        correct = parsed.correctCount || 0;
      } catch (e) {
        console.error("Error parsing progress for", level);
      }
    }

    const total = totalPerLevel[level];
    const percentRaw = (correct / total) * 100;
    const percent = Math.min(percentRaw, 100).toFixed(0); // dibulatkan ke integer

    const bar = document.getElementById(`progress-bar-${level}`);
    const label = document.getElementById(`lesson-count-${level}`);

    if (bar) bar.style.width = `${percent}%`;
    if (label) label.textContent = `${percent}%`;
  }

  ["easy", "intermediate", "hard"].forEach(loadProgressForLevel);

function selectDifficulty(level) {
    localStorage.setItem("difficulty", level);
    window.location.href = "latihan.html";
}

