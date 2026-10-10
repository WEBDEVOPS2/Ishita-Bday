/* ============================================
   PASSWORD LOCK SCREEN — Controller
   Two users: Ishita & Saksham
   Password for both: "eya"
   Unlocks → reveals the landing gate below
   ============================================ */

(function () {
  'use strict';

  // ==============================
  // ELEMENTS
  // ==============================
  const lockScreen = document.getElementById('password-lock');
  if (!lockScreen) return;

  const lockIcon = document.getElementById('pw-lock-icon');
  const userBtns = lockScreen.querySelectorAll('.pw-user');
  const inputArea = document.getElementById('pw-input-area');
  const greetingEl = document.getElementById('pw-greeting');
  const passwordInput = document.getElementById('pw-input');
  const unlockBtn = document.getElementById('pw-unlock-btn');
  const errorEl = document.getElementById('pw-error');
  const particlesContainer = lockScreen.querySelector('.pw-lock__particles');

  // State
  let selectedUser = null;
  const CORRECT_PASSWORD = 'eya';

  // Lock scroll while lock screen is active
  document.body.classList.add('pw-lock-active');

  // ==============================
  // FLOATING PARTICLES
  // ==============================
  const particleEmojis = ['💖', '✨', '💕', '🔐', '🗝️', '💗', '🌸', '⭐', '🦋', '💫'];

  function spawnParticle() {
    if (!particlesContainer || lockScreen.classList.contains('is-dismissed')) return;

    const p = document.createElement('span');
    p.className = 'pw-particle';
    p.textContent = particleEmojis[Math.floor(Math.random() * particleEmojis.length)];
    p.style.left = Math.random() * 100 + '%';
    p.style.fontSize = (0.7 + Math.random() * 1) + 'rem';
    p.style.animationDuration = (7 + Math.random() * 9) + 's';

    particlesContainer.appendChild(p);

    setTimeout(() => {
      if (p.parentNode) p.parentNode.removeChild(p);
    }, 18000);
  }

  // Initial batch
  for (let i = 0; i < 6; i++) {
    setTimeout(spawnParticle, i * 500);
  }

  const particleInterval = setInterval(() => {
    if (lockScreen.classList.contains('is-dismissed')) {
      clearInterval(particleInterval);
      return;
    }
    spawnParticle();
  }, 1000);

  // ==============================
  // USER SELECTION
  // ==============================
  userBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const user = btn.dataset.user;

      // Deselect all, select current
      userBtns.forEach(b => b.classList.remove('is-selected'));
      btn.classList.add('is-selected');

      selectedUser = user;

      // Show password input area
      inputArea.classList.add('is-visible');

      // Update greeting
      const greetings = {
        ishita: 'Hey Ishita! 🌸',
        saksham: 'Hey Saksham! 🚀'
      };
      greetingEl.textContent = greetings[user] || 'Hello!';

      // Clear previous state
      passwordInput.value = '';
      passwordInput.classList.remove('is-error', 'is-success');
      errorEl.textContent = '';

      // Focus the input
      setTimeout(() => passwordInput.focus(), 200);
    });
  });

  // ==============================
  // PASSWORD VALIDATION
  // ==============================
  function attemptUnlock() {
    if (!selectedUser) {
      errorEl.textContent = 'Pick a user first! 👆';
      return;
    }

    const entered = passwordInput.value.trim().toLowerCase();

    if (!entered) {
      passwordInput.classList.add('is-error');
      errorEl.textContent = 'Type the password, silly! 🙈';
      setTimeout(() => passwordInput.classList.remove('is-error'), 600);
      return;
    }

    if (entered === CORRECT_PASSWORD) {
      // SUCCESS!
      passwordInput.classList.remove('is-error');
      passwordInput.classList.add('is-success');
      errorEl.textContent = '';
      unlockSuccess();
    } else {
      // WRONG
      passwordInput.classList.add('is-error');
      const wrongMessages = [
        'Nope, try again! 🙊',
        'That\'s not it... 🤔',
        'Hmm, think harder! 💭',
        'Wrong password 😜',
        'Not quite! Keep trying 💪'
      ];
      errorEl.textContent = wrongMessages[Math.floor(Math.random() * wrongMessages.length)];
      setTimeout(() => passwordInput.classList.remove('is-error'), 600);
      passwordInput.value = '';
      passwordInput.focus();
    }
  }

  // Unlock button click
  unlockBtn.addEventListener('click', attemptUnlock);

  // Enter key
  passwordInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      attemptUnlock();
    }
  });

  // ==============================
  // UNLOCK SUCCESS ANIMATION
  // ==============================
  function unlockSuccess() {
    // Change lock icon to unlocked
    if (lockIcon) {
      lockIcon.classList.add('is-unlocked');
      lockIcon.querySelector('.pw-lock__emoji').textContent = '🔓';
    }

    // Burst sparkles from center
    burstSparkles();

    // Disable input
    passwordInput.disabled = true;
    unlockBtn.disabled = true;
    unlockBtn.style.opacity = '0.6';

    // Wait, then dismiss
    setTimeout(() => {
      dismissLockScreen();
    }, 1200);
  }

  // ==============================
  // SPARKLE BURST
  // ==============================
  function burstSparkles() {
    const burst = document.createElement('div');
    burst.className = 'pw-lock__success-burst';
    lockScreen.appendChild(burst);

    const sparkles = ['✨', '💖', '🌟', '💕', '⭐', '🎉', '🩷', '💫'];
    const count = 20;

    for (let i = 0; i < count; i++) {
      const s = document.createElement('span');
      s.className = 'pw-sparkle';
      s.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];

      const angle = (i / count) * Math.PI * 2;
      const distance = 60 + Math.random() * 120;
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance;

      s.style.setProperty('--dx', dx + 'px');
      s.style.setProperty('--dy', dy + 'px');
      s.style.left = '50%';
      s.style.top = '50%';
      s.style.fontSize = (0.8 + Math.random() * 1) + 'rem';
      s.style.animationDelay = (Math.random() * 0.3) + 's';

      burst.appendChild(s);
    }

    setTimeout(() => {
      if (burst.parentNode) burst.parentNode.removeChild(burst);
    }, 2000);
  }

  // ==============================
  // DISMISS LOCK SCREEN → REVEAL LANDING GATE
  // ==============================
  function dismissLockScreen() {
    clearInterval(particleInterval);

    // Animate out
    lockScreen.classList.add('is-dismissed');
    document.body.classList.remove('pw-lock-active');

    // Remove from DOM after transition
    setTimeout(() => {
      if (lockScreen.parentNode) lockScreen.parentNode.removeChild(lockScreen);
    }, 1000);
  }
})();
