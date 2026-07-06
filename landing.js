/* ============================================
   MAGICAL LANDING EXPERIENCE — Controller
   3-Screen Flow: Welcome → No → Celebration → Site
   ============================================ */

(function () {
  'use strict';

  // ==============================
  // ELEMENTS
  // ==============================
  const gate = document.getElementById('landing-gate');
  if (!gate) return; // Safety: skip if landing gate doesn't exist

  const screenWelcome = document.getElementById('lg-screen-welcome');
  const screenNo = document.getElementById('lg-screen-no');
  const screenCelebrate = document.getElementById('lg-screen-celebrate');
  const btnYes = document.getElementById('lg-btn-yes');
  const btnNo = document.getElementById('lg-btn-no');
  const btnBack = document.getElementById('lg-btn-back');
  const btnContinue = document.getElementById('lg-btn-continue');
  const particlesContainer = gate.querySelector('.landing-gate__particles');
  const sadTextEl = document.getElementById('lg-sad-text');
  const celebrationTextEl = document.getElementById('lg-celebration-text');

  // Lock scroll
  document.body.classList.add('landing-active');

  // ==============================
  // LANDING MUSIC (chatarpatar.mp3)
  // ==============================
  const landingMusic = document.getElementById('landing-music');
  let landingMusicStarted = false;

  function tryPlayLandingMusic() {
    if (landingMusicStarted) return;
    landingMusic.play()
      .then(() => { landingMusicStarted = true; })
      .catch(() => {}); // Silently fail if blocked
  }

  // Attempt autoplay immediately
  tryPlayLandingMusic();

  // Fallback: play on first user interaction with the landing page
  function onFirstInteraction() {
    tryPlayLandingMusic();
    gate.removeEventListener('click', onFirstInteraction);
    gate.removeEventListener('touchstart', onFirstInteraction);
  }
  gate.addEventListener('click', onFirstInteraction);
  gate.addEventListener('touchstart', onFirstInteraction);

  function fadeOutLandingMusic(duration) {
    if (!landingMusicStarted) return;
    const steps = 20;
    const stepTime = duration / steps;
    let currentStep = 0;
    const initialVolume = landingMusic.volume;
    const fade = setInterval(() => {
      currentStep++;
      landingMusic.volume = Math.max(0, initialVolume * (1 - currentStep / steps));
      if (currentStep >= steps) {
        clearInterval(fade);
        landingMusic.pause();
        landingMusic.currentTime = 0;
      }
    }, stepTime);
  }

  // Pause/resume landing music when user switches tabs or backgrounds the app
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (landingMusicStarted) landingMusic.pause();
    } else {
      if (landingMusicStarted && !gate.classList.contains('is-dismissed')) {
        landingMusic.play().catch(() => {});
      }
    }
  });

  // ==============================
  // FLOATING PARTICLES (Hearts, Sparkles, Stars)
  // ==============================
  const particleEmojis = ['💖', '✨', '💕', '⭐', '🦋', '💗', '🌸', '💫', '🎀'];

  function spawnParticle() {
    if (!particlesContainer || gate.classList.contains('is-dismissed')) return;

    const p = document.createElement('span');
    p.className = 'lg-particle';
    p.textContent = particleEmojis[Math.floor(Math.random() * particleEmojis.length)];
    p.style.left = Math.random() * 100 + '%';
    p.style.fontSize = (0.8 + Math.random() * 1.2) + 'rem';
    p.style.animationDuration = (6 + Math.random() * 8) + 's';
    p.style.animationDelay = '0s';

    particlesContainer.appendChild(p);

    // Clean up after animation ends
    setTimeout(() => {
      if (p.parentNode) p.parentNode.removeChild(p);
    }, 16000);
  }

  // Spawn initial batch
  for (let i = 0; i < 8; i++) {
    setTimeout(spawnParticle, i * 400);
  }

  // Continue spawning
  const particleInterval = setInterval(() => {
    if (gate.classList.contains('is-dismissed')) {
      clearInterval(particleInterval);
      return;
    }
    spawnParticle();
  }, 800);

  // ==============================
  // SCREEN TRANSITIONS
  // ==============================
  function showScreen(screen) {
    [screenWelcome, screenNo, screenCelebrate].forEach(s => {
      if (s) s.classList.remove('is-active');
    });
    if (screen) {
      // Slight delay for the exit animation to finish
      setTimeout(() => screen.classList.add('is-active'), 80);
    }
  }

  // Show welcome screen on load
  setTimeout(() => showScreen(screenWelcome), 200);

  // ==============================
  // NO BUTTON — PLAYFUL DODGE LOGIC
  // ==============================
  let dodgeCount = 0;
  const maxDodges = 5;

  function dodgeNoButton() {
    if (!btnNo) return;

    dodgeCount++;

    // After enough dodges, let them click it
    if (dodgeCount > maxDodges) {
      return false; // Don't dodge, let the click through
    }

    btnNo.classList.add('is-dodging');

    // Random dodge behavior
    const behavior = Math.floor(Math.random() * 5);
    const parentRect = btnNo.parentElement.getBoundingClientRect();
    const btnRect = btnNo.getBoundingClientRect();

    switch (behavior) {
      case 0: // Move to random position
        const maxX = parentRect.width - btnRect.width;
        const maxY = parentRect.height - btnRect.height;
        btnNo.style.position = 'absolute';
        btnNo.style.left = Math.random() * maxX + 'px';
        btnNo.style.top = Math.random() * maxY + 'px';
        break;
      case 1: // Shrink
        btnNo.style.transform = 'scale(' + (0.5 + Math.random() * 0.3) + ')';
        break;
      case 2: // Rotate wildly
        btnNo.style.transform = 'rotate(' + (Math.random() * 60 - 30) + 'deg) scale(0.8)';
        break;
      case 3: // Jump to opposite side
        btnNo.style.position = 'absolute';
        btnNo.style.left = (btnNo.style.left && parseInt(btnNo.style.left) > parentRect.width / 2)
          ? '10px' : (parentRect.width - btnRect.width - 10) + 'px';
        btnNo.style.top = Math.random() * maxY + 'px';
        break;
      case 4: // Shrink and move
        btnNo.style.position = 'absolute';
        btnNo.style.left = Math.random() * (parentRect.width - 80) + 'px';
        btnNo.style.top = Math.random() * (parentRect.height - 40) + 'px';
        btnNo.style.transform = 'scale(0.7) rotate(' + (Math.random() * 20 - 10) + 'deg)';
        break;
    }

    // Update button text to be funnier each dodge
    const dodgeTexts = [
      'No 🙈',
      'Nope! 🏃‍♀️',
      'Try again 😜',
      'Can\'t catch me! 🐰',
      'Okayyyy fine 😤',
      'CLICK ME IF U CAN 🫣'
    ];
    btnNo.textContent = dodgeTexts[Math.min(dodgeCount, dodgeTexts.length - 1)];

    return true; // Dodged successfully
  }

  // ==============================
  // BUTTON EVENT HANDLERS
  // ==============================

  // YES button → Celebration
  if (btnYes) {
    btnYes.addEventListener('click', () => {
      tryPlayLandingMusic();
      showScreen(screenCelebrate);
      startCelebration('yes');
    });
  }

  // NO button → Dodge or show No screen
  if (btnNo) {
    // Intercept hover on desktop for extra playfulness
    btnNo.addEventListener('mouseenter', () => {
      if (dodgeCount < maxDodges) {
        dodgeNoButton();
      }
    });

    btnNo.addEventListener('click', (e) => {
      tryPlayLandingMusic();
      if (dodgeCount <= maxDodges) {
        // Try to dodge
        const dodged = dodgeNoButton();
        if (dodged) {
          e.preventDefault();
          return;
        }
      }
      // If past max dodges, show the no screen
      showScreen(screenNo);
      startSadTextCycle();
    });
  }

  // GO BACK button → Celebration
  if (btnBack) {
    btnBack.addEventListener('click', () => {
      tryPlayLandingMusic();
      showScreen(screenCelebrate);
      startCelebration('back');
    });
  }

  // CONTINUE button → Dismiss and reveal site
  if (btnContinue) {
    btnContinue.addEventListener('click', () => {
      dismissLandingGate();
    });
  }

  // ==============================
  // SAD TEXT CYCLE (No Screen)
  // ==============================
  const sadTexts = [
    'Really...? 🥺',
    'You\'re gonna break my tiny little heart 💔',
    'I spent forever making this...',
    'Please... just one peek? 🙏',
    'I promise it\'s cute 🥹'
  ];
  let sadTextIndex = 0;
  let sadTextInterval = null;

  function startSadTextCycle() {
    if (!sadTextEl) return;
    sadTextIndex = 0;
    updateSadText();

    if (sadTextInterval) clearInterval(sadTextInterval);
    sadTextInterval = setInterval(() => {
      sadTextIndex = (sadTextIndex + 1) % sadTexts.length;
      updateSadText();
    }, 2500);
  }

  function updateSadText() {
    if (!sadTextEl) return;
    sadTextEl.innerHTML = '<span>' + sadTexts[sadTextIndex] + '</span>';
  }

  // ==============================
  // CELEBRATION SEQUENCE
  // ==============================
  function startCelebration(source) {
    // Clear sad text interval
    if (sadTextInterval) clearInterval(sadTextInterval);

    // Fire confetti
    burstConfetti();

    // Typewriter text sequence
    const messages = source === 'yes'
      ? ['Yayyyyy!! 💖', 'I knew you\'d say yes 🥹', 'You\'re literally the cutest.']
      : ['Yayyyyy!! 💖', 'I knew you\'d come back 🥹', 'You\'re literally the cutest.'];

    typewriterSequence(messages, () => {
      // Show Continue button after text finishes
      if (btnContinue) {
        btnContinue.style.display = 'inline-block';
        btnContinue.style.opacity = '0';
        btnContinue.style.transform = 'translateY(10px) scale(0.9)';
        setTimeout(() => {
          btnContinue.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
          btnContinue.style.opacity = '1';
          btnContinue.style.transform = 'translateY(0) scale(1)';
        }, 100);
      }
    });
  }

  // ==============================
  // TYPEWRITER EFFECT
  // ==============================
  function typewriterSequence(messages, onComplete) {
    if (!celebrationTextEl) return;

    let msgIndex = 0;

    function typeMessage() {
      if (msgIndex >= messages.length) {
        // Remove cursor after all messages
        setTimeout(() => {
          const cursor = celebrationTextEl.querySelector('.lg-typewriter-cursor');
          if (cursor) cursor.style.display = 'none';
          if (onComplete) onComplete();
        }, 400);
        return;
      }

      const text = messages[msgIndex];
      let charIndex = 0;

      // Clear and add cursor
      if (msgIndex === 0) {
        celebrationTextEl.innerHTML = '<span class="lg-typewriter-cursor"></span>';
      }

      function typeChar() {
        if (charIndex < text.length) {
          // Insert character before cursor
          const cursor = celebrationTextEl.querySelector('.lg-typewriter-cursor');
          const textNode = document.createTextNode(text[charIndex]);
          if (cursor) {
            celebrationTextEl.insertBefore(textNode, cursor);
          }
          charIndex++;
          setTimeout(typeChar, 40 + Math.random() * 30);
        } else {
          // Message complete — pause, then start next
          msgIndex++;
          if (msgIndex < messages.length) {
            setTimeout(() => {
              // Add line break before next message
              const cursor = celebrationTextEl.querySelector('.lg-typewriter-cursor');
              const br = document.createElement('br');
              if (cursor) celebrationTextEl.insertBefore(br, cursor);
              setTimeout(typeMessage, 200);
            }, 800);
          } else {
            typeMessage(); // Trigger completion
          }
        }
      }

      typeChar();
    }

    typeMessage();
  }

  // ==============================
  // CONFETTI BURST
  // ==============================
  function burstConfetti() {
    const container = document.createElement('div');
    container.className = 'lg-confetti-container';
    gate.appendChild(container);

    const colors = ['#FF8FAB', '#FFD6E0', '#E0C3FC', '#C5DCFF', '#C8F7DC', '#FFE5A0', '#FF6B95'];
    const heartEmojis = ['💖', '💕', '💗', '🩷', '✨', '🎉'];

    // Square confetti
    for (let i = 0; i < 60; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'lg-confetti';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.top = '-10px';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.width = (6 + Math.random() * 8) + 'px';
      confetti.style.height = (6 + Math.random() * 8) + 'px';
      confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      confetti.style.animationDuration = (2 + Math.random() * 3) + 's';
      confetti.style.animationDelay = Math.random() * 0.8 + 's';
      container.appendChild(confetti);
    }

    // Heart emoji confetti
    for (let i = 0; i < 15; i++) {
      const heart = document.createElement('div');
      heart.className = 'lg-confetti lg-confetti--heart';
      heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
      heart.style.left = Math.random() * 100 + '%';
      heart.style.top = '-20px';
      heart.style.fontSize = (1 + Math.random() * 0.8) + 'rem';
      heart.style.animationDuration = (2.5 + Math.random() * 3) + 's';
      heart.style.animationDelay = Math.random() * 0.6 + 's';
      container.appendChild(heart);
    }

    // Clean up after animation
    setTimeout(() => {
      if (container.parentNode) container.parentNode.removeChild(container);
    }, 6000);
  }

  // ==============================
  // DISMISS LANDING GATE → REVEAL SITE
  // ==============================
  function dismissLandingGate() {
    // Stop particles
    clearInterval(particleInterval);

    // Instantly stop landing music completely
    landingMusic.pause();
    landingMusic.currentTime = 0;
    landingMusicStarted = false;

    // Animate out
    gate.classList.add('is-dismissed');
    document.body.classList.remove('landing-active');

    // Try to play main site music (uses the existing site's function)
    if (typeof window.tryPlayMusic === 'function') {
      window.tryPlayMusic();
    } else {
      // Fallback: manually try to play bg music
      const bgMusic = document.getElementById('bg-music');
      if (bgMusic) {
        bgMusic.play().catch(() => {});
      }
    }

    // Remove from DOM after transition
    setTimeout(() => {
      if (gate.parentNode) gate.parentNode.removeChild(gate);
    }, 1000);
  }
})();
