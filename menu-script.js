// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
    handleResize();
});

// Handle window resize to maintain aspect ratios
window.addEventListener('resize', handleResize);

function initializeApp() {
    document.querySelector('.main-content').classList.add('loading');
    initializeProgressBars();
    addFeatureCardAnimations();
}

function handleResize() {
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.style.height = 'auto';
    });
}

function initializeProgressBars() {
    const totalPerLevel = {
        easy: 20,
        intermediate: 100,
        hard: 100
    };

    let totalCorrect = 0;
    let totalQuestions = 0;

    for (const level in totalPerLevel) {
        const saved = localStorage.getItem(`progress_${level}`);
        let correct = 0;

        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                correct = parsed.correctCount || 0;
            } catch (e) {
                console.error(`Error parsing progress for ${level}`, e);
            }
        }

        totalCorrect += correct;
        totalQuestions += totalPerLevel[level];
    }

    const vocabPercent = Math.min((totalCorrect / totalQuestions) * 100, 100).toFixed(0);
    updateProgressBar('vocabulary', vocabPercent);

    const maxPerLevel = 10;
    const levels = ['easy', 'medium', 'hard'];
    let totalSpeaking = 0;

    levels.forEach(level => {
        const progress = parseInt(localStorage.getItem(`progress_${level}`)) || 0;
        totalSpeaking += Math.min(progress, maxPerLevel);
    });

    const speakingPercent = Math.round((totalSpeaking / (maxPerLevel * levels.length)) * 100);
    updateProgressBar('speaking', speakingPercent);
}

function updateProgressBar(labelName, percentValue) {
    const progressItems = document.querySelectorAll('.progress-item');
    progressItems.forEach(item => {
        const label = item.querySelector('.progress-label').textContent.trim().toLowerCase();
        if (label === labelName.toLowerCase()) {
            const progressFill = item.querySelector('.progress-fill');
            const progressPercentage = item.querySelector('.progress-percentage');

            progressFill.style.width = percentValue + '%';
            progressFill.setAttribute('data-progress', percentValue);
            progressPercentage.textContent = percentValue + '%';
        }
    });
}

function addFeatureCardAnimations() {
    const featureCards = document.querySelectorAll('.feature-card');

    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });

        card.addEventListener('click', function () {
            this.style.transform = 'translateY(-2px) scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'translateY(-8px) scale(1.02)';
            }, 150);
        });
    });
}

function openFeature(featureType) {
    switch (featureType) {
        case 'translate':
            openTranslateFeature();
            break;
        case 'speaking':
            openSpeakingFeature();
            break;
        case 'dialogue':
            openDialogueFeature();
            break;
    }
}

function openTranslateFeature() {
    updateProgress('words', 20);
    window.location.href = 'latihan/vocabulary/difficulty.html';
}

function openSpeakingFeature() {
    updateProgress('speaking', 20);
    window.location.href = 'latihan/speaking/difficulty.html';
}

function openDialogueFeature() {
    updateProgress('AI convo', 20);
    window.location.href = 'latihan/conversation/index.html';
}

function updateProgress(category, newProgress) {
    const progressItems = document.querySelectorAll('.progress-item');

    progressItems.forEach(item => {
        const label = item.querySelector('.progress-label').textContent;
        if (label === category) {
            const progressFill = item.querySelector('.progress-fill');
            const progressPercentage = item.querySelector('.progress-percentage');

            progressFill.style.width = newProgress + '%';
            progressFill.setAttribute('data-progress', newProgress);
            progressPercentage.textContent = newProgress + '%';
        }
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Close profile menu on Esc key (redundant now but kept for consistency)
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        const profileMenu = document.querySelector('.profile-menu');
        if (profileMenu) {
            profileMenu.remove();
        }
    }
});

// Lazy load feature animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeIn 0.6s ease-out forwards';
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card').forEach(card => {
    observer.observe(card);
});

window.addEventListener('orientationchange', function () {
    setTimeout(handleResize, 100);
});
