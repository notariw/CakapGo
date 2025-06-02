let currentLevel = localStorage.getItem("speakingDifficulty") || "easy";
let currentPrompts = [];
const maxPerLevel = 10;

function speech(prompts) {
  currentPrompts = prompts;

  const promptBox = document.getElementById("prompt");
  const startBtn = document.getElementById("startBtn");
  const timerDisplay = document.getElementById("timer");
  const resultDiv = document.getElementById("result");
  const nextBtn = document.getElementById("nextBtn") || createNextBtn();

  // Check if progress is already complete
  if (getProgress(currentLevel) >= maxPerLevel) {
    alert("🎉 Kamu sudah menyelesaikan semua latihan untuk level ini!");
    window.location.href = "difficulty.html";
    return;
  }

  const promptText = prompts[Math.floor(Math.random() * prompts.length)];
  promptBox.textContent = `❓ Say: "${promptText}"`;
  resultDiv.textContent = "";
  timerDisplay.textContent = "Time left: 10s";
  nextBtn.style.display = "none";

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Sorry, your browser doesn't support Speech Recognition.");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  let countdown;
  let timeLeft = 10;

  function startTimer() {
    timerDisplay.textContent = `Time left: ${timeLeft}s`;
    countdown = setInterval(() => {
      timeLeft--;
      timerDisplay.textContent = `Time left: ${timeLeft}s`;
      if (timeLeft <= 0) {
        clearInterval(countdown);
        recognition.stop();
        timerDisplay.textContent = "⏰ Time's up!";
      }
    }, 1000);
  }

  function resetTimer() {
    clearInterval(countdown);
    timeLeft = 10;
  }

  function levenshteinScore(a, b) {
    const distance = levenshtein(a, b);
    const maxLength = Math.max(a.length, b.length) || 1;
    return ((1 - distance / maxLength) * 100).toFixed(2);
  }

  function levenshtein(a, b) {
    const m = a.length, n = b.length;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + cost
        );
      }
    }
    return dp[m][n];
  }

  recognition.onstart = () => {
    resultDiv.textContent = "🎙️ Listening...";
    startTimer();
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    const score = levenshteinScore(promptText.toLowerCase(), transcript.toLowerCase());

    resultDiv.innerHTML = `
      📝 Transcript: "${transcript}"<br>
      ✅ Similarity Score: <strong>${score}%</strong>
    `;

    if (score >= 85) {
      incrementProgress(currentLevel);
      updateProgressBar(currentLevel);

      if (getProgress(currentLevel) >= maxPerLevel) {
        setTimeout(() => {
          alert("🎉 Level complete! Kembali ke halaman difficulty.");
          window.location.href = "difficulty.html";
        }, 2000);
      } else {
        setTimeout(() => speech(currentPrompts), 3000);
      }
    } else {
      nextBtn.style.display = "inline-block";
    }
  };

  recognition.onerror = (event) => {
    resultDiv.textContent = `❌ Error: ${event.error}`;
    startBtn.disabled = false;
    resetTimer();
  };

  recognition.onend = () => {
    startBtn.disabled = false;
    resetTimer();
  };

  startBtn.onclick = () => {
    startBtn.disabled = true;
    nextBtn.style.display = "none";
    resultDiv.textContent = "🔈 Playing prompt...";

    const utterance = new SpeechSynthesisUtterance(promptText);
    utterance.lang = 'en-US';
    utterance.onend = () => setTimeout(() => recognition.start(), 300);
    speechSynthesis.speak(utterance);
  };
}

// CSV loading
fetch("prompts.csv")
  .then(response => response.text())
  .then(csvText => {
    const data = Papa.parse(csvText, { header: true }).data;
    const prompts = data
      .filter(row => row.difficulty === currentLevel && row.prompt)
      .map(row => row.prompt.trim());

    if (prompts.length > 0) {
      updateProgressBar(currentLevel);
      speech(prompts);
    } else {
      alert("No prompts available for this difficulty level.");
    }
  });

// Progress logic
function getProgress(level) {
  return parseInt(localStorage.getItem(`progress_${level}`)) || 0;
}

function incrementProgress(level) {
  let current = getProgress(level);
  if (current < maxPerLevel) {
    localStorage.setItem(`progress_${level}`, current + 1);
  }
}

function updateProgressBar(level) {
  const current = getProgress(level);
  const percent = Math.min((current / maxPerLevel) * 100, 100);
  const fill = document.getElementById("progressFill");
  const label = document.getElementById("progressLabel");

  if (fill && label) {
    fill.style.width = `${percent}%`;
    label.textContent = `Progress: ${percent.toFixed(0)}%`;
  }
}

// Tombol "Next"
function createNextBtn() {
  const btn = document.createElement("button");
  btn.textContent = "🔁 Next";
  btn.className = "btn btn-next";
  btn.id = "nextBtn";
  btn.style.display = "none";
  btn.onclick = () => {
    speech(currentPrompts);
  };
  document.querySelector(".main-container").appendChild(btn);
  return btn;
}
