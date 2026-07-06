/* ============================================
   ISHITA'S BIRTHDAY — ANIMATION ENGINE v2
   Color Block Reveals · Number Stamps · Arc Fly-ins
   3D Card Recede · Photo Develop · Word Reveals
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  gsap.registerPlugin(ScrollTrigger);

  // ==============================
  // 1. HERO ENTRANCE
  // ==============================
  const heroTL = gsap.timeline({ defaults: { ease: 'power3.out' } });

  heroTL
    .to('.hero__eyebrow', { opacity: 1, duration: 0.8, delay: 0.3 })
    .to('.hero__title', { opacity: 1, duration: 1 }, '-=0.4')
    .to('.hero__sub', { opacity: 1, duration: 0.8 }, '-=0.5')
    .to('.hero__scroll-cue', { opacity: 1, duration: 0.6 }, '-=0.3')
    .fromTo('.hero__deco',
      { opacity: 0, scale: 0.3, y: 50 },
      { opacity: 1, scale: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'back.out(1.5)' },
      '-=0.5'
    );

  // Hero contents and decorations parallax on scroll
  gsap.to('.hero__inner', {
    opacity: 0,
    yPercent: -20,
    scale: 0.95,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  });

  gsap.to('.hero__deco--polaroid', {
    yPercent: -45,
    rotate: '15deg',
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    }
  });

  gsap.to('.hero__deco--sticker-pizza', {
    yPercent: -20,
    rotate: '-30deg',
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    }
  });

  gsap.to('.hero__deco--sticker-dosa', {
    yPercent: -30,
    rotate: '30deg',
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    }
  });

  gsap.to('.hero__deco--stamp', {
    yPercent: -25,
    rotate: '-15deg',
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    }
  });

  // ==============================
  // 2. STICKY CARD STACK + 3D RECEDE
  // ==============================
  const cards = gsap.utils.toArray('.card');
  const totalCards = cards.length;

  cards.forEach((card, index) => {
    const inner = card.querySelector('.card__inner');

    if (index < totalCards - 1) {
      ScrollTrigger.create({
        trigger: card,
        start: 'top top',
        endTrigger: cards[index + 1],
        end: 'top top',
        pin: inner,
        pinSpacing: false,
      });

      // 3D recede: scale + blur + desaturate + perspective tilt + rounded corners
      gsap.to(inner, {
        transformPerspective: 1200,
        scale: 0.92,
        filter: 'blur(8px) saturate(0.25)',
        borderRadius: '28px',
        rotateX: 3,
        y: -20,
        ease: 'power1.in',
        scrollTrigger: {
          trigger: cards[index + 1],
          start: 'top 60%', // Delayed start: only transitions when next card is 40% up the screen
          end: 'top top',   // Finishes exactly when the next card fully covers the screen
          scrub: 0.5,
        },
      });
    }

    // Determine background color of the active card
    let cardBgColor = '#F9F6F0'; // Default cream
    if (inner) {
      if (inner.classList.contains('card__inner--warm')) {
        cardBgColor = '#F3E0DC'; // Warm light pink/red
      } else if (inner.classList.contains('card__inner--sage')) {
        cardBgColor = '#DDE8DE'; // Sage light green
      } else if (inner.classList.contains('card__inner--blush')) {
        cardBgColor = '#F0DEDE'; // Blush light pink
      }
    }

    // ScrollTrigger to dynamically shift html/body background to match the active card
    ScrollTrigger.create({
      trigger: card,
      start: 'top 50%', // Trigger when the top of the card passes the middle of the viewport
      end: 'bottom 50%',
      onToggle: (self) => {
        if (self.isActive) {
          gsap.to('html, body', {
            backgroundColor: cardBgColor,
            duration: 0.5,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        }
      }
    });
  });

  // Reset body/html background to default cream in the Hero section
  ScrollTrigger.create({
    trigger: '.hero',
    start: 'top top',
    end: 'bottom 50%',
    onToggle: (self) => {
      if (self.isActive) {
        gsap.to('html, body', {
          backgroundColor: '#F9F6F0',
          duration: 0.5,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      }
    }
  });

  // Reset body/html background to default cream in the Closing / Moments section
  ScrollTrigger.create({
    trigger: '#closing',
    start: 'top 80%',
    onToggle: (self) => {
      if (self.isActive) {
        gsap.to('html, body', {
          backgroundColor: '#F9F6F0',
          duration: 0.5,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      }
    }
  });

  // ==============================
  // 3. INTERNAL PHOTO PARALLAX
  // ==============================
  cards.forEach((card) => {
    const photo = card.querySelector('.card__photo');
    if (photo) {
      gsap.fromTo(photo,
        { yPercent: -10 },
        {
          yPercent: 2,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    }
  });

  // ==============================
  // 4. ACCENT LINE SWEEP
  // ==============================
  cards.forEach((card) => {
    const accent = card.querySelector('.card__accent');
    if (accent) {
      gsap.fromTo(accent,
        { width: '0%' },
        {
          width: '60%',
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }
  });

  // ==============================
  // 5. COLOR BLOCK REVEAL + PHOTO DEVELOP
  // ==============================
  // A solid accent-colored "curtain" sweeps across the photo frame
  // from left to right, then slides away revealing the image.
  // The photo starts desaturated and "develops" into full color.

  const revealColors = {
    'card__inner--warm': '#C8553D',
    'card__inner--sage': '#6B8F71',
    'card__inner--blush': '#C17E7E',
  };

  cards.forEach((card) => {
    const inner = card.querySelector('.card__inner');
    const photoWrap = card.querySelector('.card__photo-wrap');
    const photo = card.querySelector('.card__photo');
    if (!photoWrap || !photo) return;

    // Create the reveal block element
    const revealBlock = document.createElement('div');
    revealBlock.className = 'reveal-block';

    let color = '#B0A89F';
    for (const [cls, c] of Object.entries(revealColors)) {
      if (inner.classList.contains(cls)) { color = c; break; }
    }
    revealBlock.style.background = color;
    photoWrap.appendChild(revealBlock);

    // Initial state: photo hidden and desaturated
    gsap.set(photo, { opacity: 0, filter: 'saturate(0) brightness(1.3)' });

    const revealTL = gsap.timeline({
      scrollTrigger: {
        trigger: card,
        start: 'top 72%',
        toggleActions: 'play none none reverse',
      },
    });

    // Step 1: Curtain sweeps in from left (0 → 1)
    revealTL.fromTo(revealBlock,
      { scaleX: 0, transformOrigin: 'left center' },
      { scaleX: 1, duration: 0.45, ease: 'power3.inOut' }
    );

    // Step 2: Photo appears behind the curtain (while curtain is covering)
    revealTL.set(photo, { opacity: 1 }, 0.3);

    // Step 3: Curtain sweeps out to right (1 → 0, origin flipped)
    revealTL.to(revealBlock, {
      scaleX: 0,
      transformOrigin: 'right center',
      duration: 0.45,
      ease: 'power3.inOut',
    });

    // Step 4: Photo "develops" — desaturated → full color
    revealTL.to(photo, {
      filter: 'saturate(0.92) contrast(1.02)',
      duration: 1.4,
      ease: 'power2.out',
    }, '-=0.4');

    // Special 3D swing-in transition for Card 4 (bouncy hang effect)
    if (card.id === 'card-4') {
      revealTL.fromTo(photoWrap,
        { rotation: -12, scale: 0.88, transformPerspective: 1200, transformOrigin: 'top center' },
        { rotation: 0, scale: 1, duration: 1.1, ease: 'back.out(2.2)' },
        '-=1.2'
      );
    }
  });

  // ==============================
  // 6. NUMBER STAMP ANIMATION
  // ==============================
  // The card number (01, 02, 03) slams down from 5× scale with a bounce

  cards.forEach((card) => {
    const number = card.querySelector('.card__number');
    if (!number) return;

    gsap.fromTo(number,
      { scale: 6, opacity: 0, rotation: -20, y: -30 },
      {
        scale: 1,
        opacity: 1,
        rotation: 0,
        y: 0,
        duration: 0.7,
        ease: 'back.out(2.5)',
        scrollTrigger: {
          trigger: card,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  });

  // ==============================
  // 7. TAG SLIDE-IN
  // ==============================
  cards.forEach((card) => {
    const tag = card.querySelector('.card__tag');
    if (!tag) return;

    gsap.fromTo(tag,
      { x: 50, opacity: 0, scale: 0.8 },
      {
        x: 0,
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 73%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  });

  // ==============================
  // 8. STICKER ARC FLY-IN
  // ==============================
  // Each sticker flies in from a different off-screen direction with an arc

  const stickerEntries = [
    { x: 140, y: 100, rot: -45 },  // Card 1: from bottom-right
    { x: -120, y: 80, rot: 40 },   // Card 2: from bottom-left
    { x: 100, y: -120, rot: -35 }, // Card 3: from top-right
  ];

  cards.forEach((card, index) => {
    const sticker = card.querySelector('.card__sticker');
    if (!sticker) return;

    const entry = stickerEntries[index % stickerEntries.length];

    gsap.fromTo(sticker,
      {
        x: entry.x,
        y: entry.y,
        rotation: entry.rot,
        opacity: 0,
        scale: 0.2,
      },
      {
        x: 0,
        y: 0,
        rotation: 0,
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: 'elastic.out(1, 0.3)',
        scrollTrigger: {
          trigger: card,
          start: 'top 58%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  });

  // ==============================
  // 8.5 QUOTE TAG FLY-IN
  // ==============================
  cards.forEach((card) => {
    const quote = card.querySelector('.card__quote-tag');
    if (!quote) return;

    gsap.from(quote, {
      y: 40,
      rotation: -10,
      opacity: 0,
      scale: 0.5,
      duration: 0.9,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: card,
        start: 'top 55%',
        toggleActions: 'play none none reverse',
      },
    });
  });

  // ==============================
  // 9. WORD-BY-WORD TITLE REVEAL
  // ==============================
  function splitIntoWords(el) {
    const html = el.innerHTML;
    const lines = html.split(/<br\s*\/?>/gi);
    const rebuilt = lines.map(line => {
      const words = line.trim().split(/\s+/).filter(w => w.length > 0);
      return words.map(word =>
        `<span class="word"><span class="word-inner">${word}</span></span>`
      ).join(' ');
    }).join('<br />');
    el.innerHTML = rebuilt;
    return el.querySelectorAll('.word-inner');
  }

  cards.forEach((card) => {
    const title = card.querySelector('.card__title');
    if (!title) return;

    const wordInners = splitIntoWords(title);

    gsap.to(wordInners, {
      y: 0,
      duration: 0.8,
      stagger: 0.07,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 58%',
        toggleActions: 'play none none reverse',
      },
    });
  });

  // Also split the closing title
  const closingTitle = document.querySelector('.closing__title');
  if (closingTitle) {
    const closingWords = splitIntoWords(closingTitle);
    gsap.to(closingWords, {
      y: 0,
      duration: 0.8,
      stagger: 0.07,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: '.closing',
        start: 'top 65%',
        toggleActions: 'play none none reverse',
      },
    });
  }

  // ==============================
  // 10. BODY TEXT CLIP REVEAL
  // ==============================
  // Text reveals through a bottom-to-top clip-path mask wipe

  cards.forEach((card) => {
    const body = card.querySelector('.card__body');
    if (!body) return;

    gsap.fromTo(body,
      {
        opacity: 0,
        y: 25,
        clipPath: 'inset(0% 0% 100% 0%)',
      },
      {
        opacity: 1,
        y: 0,
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 52%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  });

  // ==============================
  // 11. FLOATING PARTICLES
  // ==============================
  const accentColors = {
    'card__inner--warm': '#C8553D',
    'card__inner--sage': '#6B8F71',
    'card__inner--blush': '#C17E7E',
  };

  cards.forEach((card) => {
    const inner = card.querySelector('.card__inner');
    if (!inner) return;

    let color = '#B0A89F';
    for (const [cls, c] of Object.entries(accentColors)) {
      if (inner.classList.contains(cls)) { color = c; break; }
    }

    for (let i = 0; i < 7; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = 3 + Math.random() * 5;
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      p.style.background = color;
      p.style.left = (8 + Math.random() * 84) + '%';
      p.style.top = (60 + Math.random() * 35) + '%';
      inner.appendChild(p);

      gsap.to(p, {
        y: -(150 + Math.random() * 300),
        opacity: 0.12 + Math.random() * 0.15,
        duration: 5 + Math.random() * 5,
        delay: Math.random() * 4,
        repeat: -1,
        ease: 'none',
      });
    }
  });

  // ==============================
  // 12. CLOSING SECTION
  // ==============================
  const closingContents = document.querySelectorAll('.closing .anim-content');
  const closingEmoji = document.querySelector('.closing__emoji');
  const closingFooter = document.querySelector('.closing__footer');

  const closingTL = gsap.timeline({
    scrollTrigger: {
      trigger: '.closing',
      start: 'top 70%',
      end: 'top 20%',
      toggleActions: 'play none none reverse',
    },
  });

  if (closingEmoji) {
    closingTL.fromTo(closingEmoji,
      { opacity: 0, scale: 0.3, y: 40, rotation: -20 },
      { opacity: 1, scale: 1, y: 0, rotation: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)' },
      0
    );
  }

  closingContents.forEach((el, i) => {
    closingTL.fromTo(el,
      { opacity: 0, y: 30, clipPath: 'inset(0% 0% 100% 0%)' },
      {
        opacity: 1,
        y: 0,
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 0.8,
        ease: 'power3.out',
      },
      0.3 + i * 0.15
    );
  });

  if (closingFooter) {
    closingTL.fromTo(closingFooter,
      { opacity: 0 },
      { opacity: 0.6, duration: 0.8, ease: 'power2.out' },
      0.9
    );
  }

  // ==============================
  // 13. SCROLL PROGRESS INDICATOR
  // ==============================
  const progressNav = document.getElementById('progress-nav');
  const progressDots = document.querySelectorAll('.progress-dot');
  const progressFill = document.getElementById('progress-fill');

  ScrollTrigger.create({
    trigger: '.cards-container',
    start: 'top 80%',
    endTrigger: '.closing',
    end: 'top top',
    onEnter: () => progressNav?.classList.add('is-visible'),
    onLeave: () => progressNav?.classList.remove('is-visible'),
    onEnterBack: () => progressNav?.classList.add('is-visible'),
    onLeaveBack: () => progressNav?.classList.remove('is-visible'),
  });

  cards.forEach((card, index) => {
    ScrollTrigger.create({
      trigger: card,
      start: 'top center',
      end: 'bottom center',
      onEnter: () => setActiveDot(index),
      onEnterBack: () => setActiveDot(index),
    });
  });

  function setActiveDot(index) {
    progressDots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === index);
    });
    if (progressFill) {
      progressFill.style.height = ((index + 1) / totalCards) * 100 + '%';
    }
  }

  progressDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const targetEl = document.getElementById(dot.dataset.target);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ==============================
  // 14. STICKER & QUOTE IDLE WOBBLE
  // ==============================
  document.querySelectorAll('.card__sticker, .card__quote-tag, .hero__deco').forEach((el, i) => {
    let baseRotation = 5;
    if (el.classList.contains('hero__deco--polaroid')) baseRotation = 4;
    else if (el.classList.contains('hero__deco--sticker-pizza')) baseRotation = 6;
    else if (el.classList.contains('hero__deco--sticker-dosa')) baseRotation = -6;
    else if (el.classList.contains('hero__deco--stamp')) baseRotation = -4;

    gsap.to(el, {
      rotation: `+=${i % 2 === 0 ? baseRotation : -baseRotation}`,
      yoyo: true,
      repeat: -1,
      duration: 2.5 + i * 0.5,
      ease: 'sine.inOut',
      delay: 1,
    });
  });

  // ==============================
  // 14.2 BACKGROUND MUSIC CONTROLLER (AUTO-PLAY ON SCROLL)
  // ==============================
  const bgMusic = document.getElementById('bg-music');
  const cakeMusic = document.getElementById('cake-music');
  if (bgMusic) {
    bgMusic.volume = 0.35; // Set a soft 35% background volume on supported devices
    bgMusic.muted = false;
  }
  if (cakeMusic) {
    cakeMusic.volume = 0; // Initialize cake music at 0 volume
    cakeMusic.muted = true; // Mute initially to prevent simultaneous playback on iOS
  }
  let musicStarted = false;

  const tryPlayMusic = () => {
    if (musicStarted) return;

    // Don't start site music while the landing gate is still active
    const landingGate = document.getElementById('landing-gate');
    if (landingGate && !landingGate.classList.contains('is-dismissed')) return;

    // Check if the user is already scrolled to the closing/cake section
    const closingSection = document.getElementById('closing');
    const isPastClosing = closingSection && closingSection.getBoundingClientRect().top < window.innerHeight * 0.95;

    // Play both audios in parallel to unlock both elements immediately on mobile browsers.
    // This allows volume crossfading to work on scroll triggers without browser blockages.
    let bgPlay = bgMusic ? bgMusic.play() : Promise.resolve();
    let cakePlay = cakeMusic ? cakeMusic.play().catch(err => {
      console.warn("cakeMusic play failed (probably missing cake.mp3), resolving to allow bgMusic to play", err);
      return null;
    }) : Promise.resolve();

    Promise.all([bgPlay, cakePlay])
      .then(() => {
        musicStarted = true;
        removeBackupListeners();

        // Adjust volumes/muted status based on current scroll position
        if (isPastClosing) {
          if (bgMusic) {
            bgMusic.volume = 0;
            bgMusic.muted = true;
          }
          if (cakeMusic) {
            cakeMusic.volume = 0.4;
            cakeMusic.muted = false;
          }
        } else {
          if (bgMusic) {
            bgMusic.volume = 0.35;
            bgMusic.muted = false;
          }
          if (cakeMusic) {
            cakeMusic.volume = 0;
            cakeMusic.muted = true;
          }
        }
      })
      .catch((err) => {
        console.log("Main background music blocked. Adding backup listeners.", err);
        addBackupListeners();
      });
  };
  window.tryPlayMusic = tryPlayMusic;

  const handleBackupPlay = () => {
    tryPlayMusic();
  };

  const addBackupListeners = () => {
    document.addEventListener('click', handleBackupPlay);
    document.addEventListener('touchstart', handleBackupPlay);
    document.addEventListener('touchend', handleBackupPlay);
    document.addEventListener('mousedown', handleBackupPlay);
  };

  const removeBackupListeners = () => {
    document.removeEventListener('click', handleBackupPlay);
    document.removeEventListener('touchstart', handleBackupPlay);
    document.removeEventListener('touchend', handleBackupPlay);
    document.removeEventListener('mousedown', handleBackupPlay);
  };

  // Trigger music automatically when the first card enters the screen
  ScrollTrigger.create({
    trigger: '#card-1',
    start: 'top bottom', // Play when Card 1 starts rising from the bottom of the screen
    onEnter: () => {
      tryPlayMusic();
    }
  });

  // Smooth Crossfade to Cake Music on scrolling into the closing/cake section
  if (bgMusic && cakeMusic) {
    ScrollTrigger.create({
      trigger: '#closing',
      start: 'top 95%', // Trigger when the cake section is 95% down the viewport (just entering the bottom)
      onEnter: () => {
        // Ensure both elements are playing in case one got paused/stopped
        bgMusic.play().catch(() => {});
        cakeMusic.play().catch(() => {});

        // Silence the first music immediately to prevent simultaneous playback
        bgMusic.volume = 0;
        bgMusic.muted = true;

        // Unmute and smoothly fade in the cake music
        cakeMusic.muted = false;
        gsap.to(cakeMusic, { volume: 0.4, duration: 1.5 });
      },
      onLeaveBack: () => {
        // Silence the cake music immediately
        cakeMusic.volume = 0;
        cakeMusic.muted = true;

        // Unmute and smoothly fade in the main background music
        bgMusic.muted = false;
        gsap.to(bgMusic, { volume: 0.35, duration: 1.5 });
      }
    });
  }

  // Handle tab switching / backgrounding (Page Visibility API) to pause/resume music automatically
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (bgMusic) bgMusic.pause();
      if (cakeMusic) cakeMusic.pause();
    } else {
      // Resume only if music had already started playing
      if (musicStarted) {
        const closingSection = document.getElementById('closing');
        const isPastClosing = closingSection && closingSection.getBoundingClientRect().top < window.innerHeight * 0.95;
        if (isPastClosing) {
          if (cakeMusic) {
            cakeMusic.play().catch(() => {});
          }
        } else {
          if (bgMusic) {
            bgMusic.play().catch(() => {});
          }
        }
      }
    }
  });

  // ==============================
  // 14.5 VIDEO ROBUST AUTOMATIC PLAYBACK (GIF STYLE)
  // ==============================
  const videos = document.querySelectorAll('.card__photo');

  const playAllVideos = () => {
    videos.forEach((video) => {
      if (video.tagName.toLowerCase() !== 'video') return;
      if (video.paused) {
        video.play().catch((err) => {
          console.log("Silent play block active for video. Will retry on scroll/touch.", err);
        });
      }
    });
  };

  // Attempt autoplay immediately
  playAllVideos();

  // Force play on first touch, scroll, or click to bypass browser blocks
  document.addEventListener('touchstart', playAllVideos, { passive: true });
  document.addEventListener('touchend', playAllVideos, { passive: true });
  document.addEventListener('scroll', playAllVideos, { passive: true });
  document.addEventListener('click', playAllVideos, { passive: true });

  // Re-trigger play when card comes into view to ensure loop is active
  videos.forEach((video) => {
    if (video.tagName.toLowerCase() !== 'video') return;
    const cardParent = video.closest('.card');
    if (cardParent) {
      ScrollTrigger.create({
        trigger: cardParent,
        start: 'top bottom',
        onEnter: () => {
          if (video.paused) {
            video.play().catch(() => { });
          }
        }
      });
    }
  });

  // ==============================
  // 14.65 MOMENTS SECTION ENTRANCE ANIMATION
  // ==============================
  const momentsTL = gsap.timeline({
    scrollTrigger: {
      trigger: '.moments',
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    }
  });

  momentsTL
    .fromTo('.moments__title', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
    .fromTo('.moments__sub', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
    .fromTo('.moments__carousel', { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' }, '-=0.4');

  // ==============================
  // 14.7 STATS SECTION NEO-BRUTALISM ANIMATION
  // ==============================
  const statsTL = gsap.timeline({
    scrollTrigger: {
      trigger: '.stats',
      start: 'top 75%', // triggers when the top of the stats section enters 75% of viewport height
      toggleActions: 'play none none none',
    }
  });

  statsTL
    .to('.stats__title', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' })
    .to('.stats__sub', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
    .to('.stats-card--yellow', { opacity: 1, scale: 1, y: 0, rotation: -1.5, duration: 0.5, ease: 'back.out(1.5)' }, '-=0.3')
    .to('.stats-card--pink', { opacity: 1, scale: 1, y: 0, rotation: 1.8, duration: 0.5, ease: 'back.out(1.5)' }, '-=0.35')
    .to('.stats-card--white', { opacity: 1, scale: 1, y: 0, rotation: -1.2, duration: 0.5, ease: 'back.out(1.5)' }, '-=0.35')
    .to('.stats-card--green', { opacity: 1, scale: 1, y: 0, rotation: 1.4, duration: 0.5, ease: 'back.out(1.5)' }, '-=0.35')
    .to('.stats-card--purple', { opacity: 1, scale: 1, y: 0, rotation: -1.5, duration: 0.5, ease: 'back.out(1.5)' }, '-=0.35');

  // ==============================
  // 14.6 CARD PHOTO SLIDESHOWS SHUFFLE (DECK SHUFFLER)
  // ==============================
  const slideshows = document.querySelectorAll('.card__photo-wrap--slideshow');
  slideshows.forEach((slideshow) => {
    const slideshowImages = slideshow.querySelectorAll('.slideshow-img');
    if (slideshowImages.length > 0) {
      let currentIndex = 0;

      // Set initial layout
      slideshowImages.forEach((img, i) => {
        gsap.set(img, {
          zIndex: slideshowImages.length - i,
          xPercent: 0,
          yPercent: 0,
          rotation: 0
        });
      });

      const shuffleSlideshow = () => {
        const topImg = slideshowImages[currentIndex];
        const nextIndex = (currentIndex + 1) % slideshowImages.length;

        // Dynamic directions for an organic card-shuffling experience
        let animProps = {};
        const dirIndex = currentIndex % 4;

        if (dirIndex === 0) {
          // Slide right
          animProps = { xPercent: 115, yPercent: 0, rotation: 12 };
        } else if (dirIndex === 1) {
          // Slide left
          animProps = { xPercent: -115, yPercent: 0, rotation: -12 };
        } else if (dirIndex === 2) {
          // Slide top
          animProps = { xPercent: 0, yPercent: -115, rotation: 6 };
        } else {
          // Slide 4: Diagonal bottom-right discard effect
          animProps = { xPercent: 110, yPercent: 110, rotation: -15 };
        }

        const tl = gsap.timeline();
        tl.to(topImg, {
          ...animProps,
          duration: 0.45,
          ease: 'power2.inOut'
        })
          .call(() => {
            // Re-arrange z-indices
            slideshowImages.forEach((img, i) => {
              let logicalIndex = (i - nextIndex + slideshowImages.length) % slideshowImages.length;
              gsap.set(img, { zIndex: slideshowImages.length - logicalIndex });
            });
          })
          .to(topImg, {
            xPercent: 0,
            yPercent: 0,
            rotation: 0,
            duration: 0.45,
            ease: 'power2.out'
          });

        currentIndex = nextIndex;
      };

      // Run slideshow every 2.2 seconds for a snappier feel
      setInterval(shuffleSlideshow, 2200);
    }
  });

  // ==============================
  // 14.8 DRAGGABLE SCRAPBOOK STICKERS (INTERACTIVE CANVAS)
  // ==============================
  const makeDraggable = (el) => {
    let startX = 0, startY = 0, currentX = 0, currentY = 0;

    el.style.cursor = 'grab';
    el.style.pointerEvents = 'auto'; // ensure interactions are enabled

    // Store original transformation rotation if set by style or GSAP
    let baseRotate = 0;
    const style = window.getComputedStyle(el);
    const matrix = new DOMMatrixReadOnly(style.transform);
    if (matrix.b !== 0 || matrix.a !== 0) {
      baseRotate = Math.round(Math.atan2(matrix.b, matrix.a) * (180 / Math.PI));
    }

    const dragStart = (e) => {
      // Don't drag if clicking nested buttons, links, etc.
      if (e.target.tagName.toLowerCase() === 'button' || e.target.tagName.toLowerCase() === 'a') return;
      el.style.cursor = 'grabbing';

      // Visual feedback when grabbing
      gsap.to(el, {
        scale: 1.12,
        boxShadow: '0 15px 30px rgba(60, 50, 40, 0.15)',
        duration: 0.2
      });

      const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
      const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;

      startX = clientX - currentX;
      startY = clientY - currentY;

      if (e.type === 'touchstart') {
        document.addEventListener('touchmove', dragMove, { passive: false });
        document.addEventListener('touchend', dragEnd);
      } else {
        document.addEventListener('mousemove', dragMove);
        document.addEventListener('mouseup', dragEnd);
      }
    };

    const dragMove = (e) => {
      // Prevent default page scroll on mobile only while dragging a sticker
      if (e.cancelable) e.preventDefault();

      const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
      const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

      currentX = clientX - startX;
      currentY = clientY - startY;

      // Update element position while preserving the original rotation
      gsap.set(el, {
        x: currentX,
        y: currentY,
        rotation: baseRotate
      });
    };

    const dragEnd = () => {
      el.style.cursor = 'grab';

      // Spring back style
      gsap.to(el, {
        scale: 1,
        boxShadow: 'none',
        duration: 0.3,
        ease: 'back.out(1.8)'
      });

      document.removeEventListener('mousemove', dragMove);
      document.removeEventListener('mouseup', dragEnd);
      document.removeEventListener('touchmove', dragMove);
      document.removeEventListener('touchend', dragEnd);
    };

    el.addEventListener('mousedown', dragStart);
    el.addEventListener('touchstart', dragStart, { passive: true });
  };

  // Enable dragging for all interactive decorations
  document.querySelectorAll('.card__sticker, .card__quote-tag, .hero__deco, .sticker-item').forEach(makeDraggable);

  // ==============================
  // 14.9 INTERACTIVE CAKE CUTTING & WISH MODAL
  // ==============================
  const knife = document.getElementById('interactive-knife');
  const cake = document.getElementById('interactive-cake');
  const flames = document.querySelectorAll('.candle-flame');
  const celebrationModal = document.getElementById('celebration-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const keepCelebBtn = document.getElementById('keep-celebrating-btn');

  let cakeIsCut = false;

  const triggerConfetti = () => {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.inset = 0;
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '3000';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#FFE234', '#EC4899', '#1DFF80', '#18DDFF', '#B16BFF', '#FF5C00'];
    const particles = [];

    // Shoot 180 colorful confetti pieces
    for (let i = 0; i < 180; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height * 0.65,
        radius: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 20,
        vy: -Math.random() * 18 - 8,
        gravity: 0.4,
        opacity: 1,
        fade: Math.random() * 0.012 + 0.008
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      particles.forEach((p) => {
        if (p.opacity > 0) {
          alive = true;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.opacity;
          ctx.fill();
          p.x += p.vx;
          p.y += p.vy;
          p.vy += p.gravity;
          p.opacity -= p.fade;
        }
      });
      if (alive) {
        requestAnimationFrame(animate);
      } else {
        canvas.remove();
      }
    };
    animate();
  };

  const cutCakeAction = () => {
    if (cakeIsCut) return;
    cakeIsCut = true;

    // Transition immediately to cake music if interactive action is clicked
    if (bgMusic && cakeMusic) {
      bgMusic.play().catch(() => {});
      cakeMusic.play().catch(() => {});
      
      // Silence first music immediately to prevent simultaneous playback
      bgMusic.volume = 0;
      bgMusic.muted = true;

      // Play cake music
      cakeMusic.muted = false;
      gsap.to(cakeMusic, { volume: 0.4, duration: 1.0 });
    }

    // Stop bobbing animation and hover scale
    knife.style.animation = 'none';
    knife.style.pointerEvents = 'none';

    // GSAP slice animation: knife swings down to center of the cake, then slices down
    const tl = gsap.timeline();
    tl.to(knife, {
      x: 180,
      y: -45,
      rotation: -45,
      duration: 0.5,
      ease: 'power2.out'
    })
      .to(knife, {
        y: 35,
        duration: 0.35,
        ease: 'power2.in'
      })
      .to(flames, {
        scale: 0,
        opacity: 0,
        duration: 0.2
      }, '-=0.2')
      .call(() => {
        triggerConfetti();
      })
      .to(celebrationModal, {
        onStart: () => {
          celebrationModal.classList.add('is-active');
          celebrationModal.setAttribute('aria-hidden', 'false');
        }
      }, '+=0.6');
  };

  if (knife && cake) {
    knife.addEventListener('click', cutCakeAction);
    cake.addEventListener('click', cutCakeAction);
    knife.addEventListener('touchstart', (e) => {
      e.preventDefault();
      cutCakeAction();
    });
    cake.addEventListener('touchstart', (e) => {
      e.preventDefault();
      cutCakeAction();
    });
  }

  // Modal controls
  const closeModal = () => {
    if (celebrationModal) {
      celebrationModal.classList.remove('is-active');
      celebrationModal.setAttribute('aria-hidden', 'true');
    }
  };

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (keepCelebBtn) keepCelebBtn.addEventListener('click', closeModal);

  // ==============================
  // 14.95 ASSET DOWNLOAD PREVENTION
  // ==============================
  // Disable context menu (right-click) globally on images and videos
  document.addEventListener('contextmenu', (e) => {
    if (e.target.tagName === 'IMG' || e.target.tagName === 'VIDEO' || e.target.closest('.card__media')) {
      e.preventDefault();
    }
  });

  // Disable dragging of images/videos globally
  document.addEventListener('dragstart', (e) => {
    if (e.target.tagName === 'IMG' || e.target.tagName === 'VIDEO') {
      e.preventDefault();
    }
  });

  // ==============================
  // 15. REFRESH SCROLLTRIGGER
  // ==============================
  window.addEventListener('load', () => ScrollTrigger.refresh());
  window.addEventListener('orientationchange', () => {
    setTimeout(() => ScrollTrigger.refresh(), 200);
  });

});
