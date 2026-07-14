'use strict';

/* ── Storage key ── */
const STORAGE_KEY = 'birthdayChoice';

/* ── Emotion messages ── */
const EMOTION_MSGS = {
  happy: 'That smile of yours — the one that reaches your eyes — has the power to make everything feel okay. Hold onto it; it is one of the most beautiful things about you. 🌻',
  loved: 'You are more loved than words can hold. Not because of what you do, but because of who you are — completely, without condition. Happy Birthday. 🤍',
  nostalgic: 'The past is a soft, warm thing when you carry the right moments. And the best ones? They are still being made. I am so glad our story is not t over. 🌸',
  excited: 'Good — you should be! Life is about to hand you something extraordinary. This birthday is just the opening chapter of something wonderful. 🎉',
  grateful: 'Gratitude looks beautiful on you. And for the record, every single person who has you in their life is grateful too — more than they say. 🙏',
  hopeful: 'Hope is the right thing to carry into a new year. It suits you. Whatever you are wishing for — I am wishing it with you, twice as hard. ✨',
};

/* ── DOM references ── */
const landing = document.getElementById('landing');
const lockNotice = document.getElementById('lockNotice');
const choicesGrid = document.getElementById('choicesGrid');
const allCards = document.querySelectorAll('.choice-card');
const audioBtn = document.getElementById('audioBtn');
const bgAudio = document.getElementById('bgAudio');
const confettiCanvas = document.getElementById('confetti-canvas');
(function initConfetti() {
  const ctx = confettiCanvas.getContext('2d');
  let W, H, particles = [];
  
  function resize() {
    W = confettiCanvas.width = window.innerWidth;
    H = confettiCanvas.height = window.innerHeight;
  }
  
  function Particle() {
    this.x = Math.random() * W;
    this.y = -10;
    this.w = Math.random() * 10 + 4;
    this.h = Math.random() * 4 + 2;
    this.color = ['#f4c2c2', '#d4a853', '#c9a0c9', '#f0d48a', '#e8a0a0'][Math.floor(Math.random() * 5)];
    this.vy = Math.random() * 3 + 1.5;
    this.vx = (Math.random() - 0.5) * 2;
    this.rot = Math.random() * 360;
    this.drot = (Math.random() - 0.5) * 6;
    this.opacity = Math.random() * 0.7 + 0.3;
  }
  
  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p, i) => {
      p.y += p.vy;
      p.x += p.vx;
      p.rot += p.drot;
      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * Math.PI / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
      if (p.y > H + 10) particles.splice(i, 1);
    });
  }
  
  function burst(count = 180) {
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }
  
  window.addEventListener('resize', resize);
  resize();
  setInterval(loop, 16);
  
  /* Fire confetti once on first-ever load */
  if (!localStorage.getItem(STORAGE_KEY)) {
    burst(180);
    setTimeout(() => burst(80), 600);
  }
})();

/* ════════════════════════════════════════════════════════════
   FLOATING PETALS (landing)
   ════════════════════════════════════════════════════════════ */
(function initPetals() {
  const container = document.getElementById('petals');
  const symbols = [ '💖','🌸', '✿', '❀', '🌺', '✦'];
  const NUM = 16;
  
  for (let i = 0; i < NUM; i++) {
    const el = document.createElement('span');
    el.className = 'petal';
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    el.style.left = `${Math.random() * 100}%`;
    el.style.fontSize = `${Math.random() * 0.8 + 0.6}rem`;
    const dur = 8 + Math.random() * 10;
    const del = Math.random() * 12;
    el.style.animationDuration = `${dur}s`;
    el.style.animationDelay = `-${del}s`;
    container.appendChild(el);
  }
})();

/* ════════════════════════════════════════════════════════════
   AUDIO TOGGLE
   ════════════════════════════════════════════════════════════ */
audioBtn.addEventListener('click', () => {
  if (bgAudio.paused) {
    bgAudio.play().catch(() => {});
    audioBtn.classList.add('playing');
    audioBtn.querySelector('.audio-label').textContent = 'Pause';
  } else {
    bgAudio.pause();
    audioBtn.classList.remove('playing');
    audioBtn.querySelector('.audio-label').textContent = 'Music';
  }
});



/**
 * Open a content section by key.
 * This is purely visual — the lock state is not changed.
 */
function openSection(key) {
  hide(landing);
  document.querySelectorAll('.content-section').forEach(hide);
  const target = document.getElementById(`section-${key}`);
  if (target) {
    show(target);
    target.scrollTop = 0;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    /* Trigger section-specific behaviour */
    runSectionInit(key);
  }
}

/**
 * Close the current content section and return to landing.
 * The choice lock is preserved.
 */
function closeSection() {
  document.querySelectorAll('.content-section').forEach(hide);
  show(landing);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Handle a user's first-ever choice.
 */
function handleChoice(key) {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (existing) return; /* Safety guard — shouldn't happen */
  
  /* Persist immediately and irrevocably */
  localStorage.setItem(STORAGE_KEY, key);
  
  applyLock(key);
  openSection(key);
}

/* ── Back buttons ── */
document.querySelectorAll('[data-back]').forEach(btn => {
  btn.addEventListener('click', closeSection);
});

/* ── Choice card clicks ── */
allCards.forEach(card => {
  card.addEventListener('click', () => {
    const key = card.dataset.choice;
    const existing = localStorage.getItem(STORAGE_KEY);
    
    if (existing) {
      /* Already chosen — open their section (back to it) */
      openSection(existing);
    } else {
      handleChoice(key);
    }
  });
});
