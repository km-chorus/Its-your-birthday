const intro = document.getElementById('intro');
const startBtn = document.getElementById('startBtn');
const shell = document.getElementById('gameShell');

const levels = [...document.querySelectorAll('.level')];
const progress = document.getElementById('progressBar');
const levelLabel = document.getElementById('levelLabel');

let current = 0;
let soundOn = true;

/* =========================================================
   LEVEL NAVIGATION
========================================================= */

function showLevel(n) {
  current = n;

  levels.forEach((el, i) => {
    el.classList.toggle('active', i === n);
  });

  progress.style.width =
    (n < 4 ? ((n + 1) / 4) * 100 : 100) + '%';

  levelLabel.textContent =
    n < 4
      ? `LEVEL ${String(n + 1).padStart(2, '0')}`
      : 'DINNER PLAN';

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

/* =========================================================
   START GAME
========================================================= */

startBtn.addEventListener('click', () => {
  intro.classList.add('out');
  shell.classList.remove('hidden');

  setTimeout(() => {
    intro.remove();
  }, 850);

  showLevel(0);
  playChime();
});

/* =========================================================
   TOAST MESSAGE
========================================================= */

function toast(msg) {
  const t = document.getElementById('toast');

  t.textContent = msg;
  t.classList.add('show');

  clearTimeout(window.toastTimer);

  window.toastTimer = setTimeout(() => {
    t.classList.remove('show');
  }, 1800);
}

/* =========================================================
   CONFETTI / HEART BURST
========================================================= */

function burst() {
  const box = document.getElementById('confetti');

  const symbols = [
    '💗',
    '💕',
    '✨',
    '♡',
    '🎀',
    '🌸',
    '⭐',
    '🎂'
  ];

  for (let i = 0; i < 34; i++) {
    const el = document.createElement('i');

    el.textContent =
      symbols[Math.floor(Math.random() * symbols.length)];

    el.style.setProperty(
      '--x',
      (Math.random() - 0.5) * innerWidth * 1.2 + 'px'
    );

    el.style.setProperty(
      '--y',
      (Math.random() - 0.5) * innerHeight * 1.2 + 'px'
    );

    el.style.animationDelay =
      Math.random() * 0.15 + 's';

    box.appendChild(el);

    setTimeout(() => {
      el.remove();
    }, 1900);
  }
}

/* =========================================================
   LIGHTWEIGHT ORIGINAL WEB AUDIO
========================================================= */

let audioCtx = null;

function playChime() {
  if (!soundOn) return;

  try {
    audioCtx =
      audioCtx ||
      new (window.AudioContext ||
        window.webkitAudioContext)();

    const now = audioCtx.currentTime;

    [523.25, 659.25, 783.99].forEach((f, i) => {
      const oscillator = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.value = f;

      oscillator.connect(gain);
      gain.connect(audioCtx.destination);

      gain.gain.setValueAtTime(
        0.0001,
        now + i * 0.12
      );

      gain.gain.exponentialRampToValueAtTime(
        0.045,
        now + i * 0.12 + 0.03
      );

      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        now + i * 0.12 + 0.45
      );

      oscillator.start(now + i * 0.12);
      oscillator.stop(now + i * 0.12 + 0.5);
    });
  } catch (e) {
    // Audio is optional.
  }
}

/* =========================================================
   LEVEL 1 — CATCH THE HEARTS
========================================================= */

const arena = document.getElementById('heartArena');
const countEl = document.getElementById('heartCount');

let found = 0;

[
  [16, 18],
  [75, 21],
  [30, 72],
  [82, 70],
  [51, 43]
].forEach((pos, i) => {
  const heart = document.createElement('button');

  heart.className = 'floating-heart';

  heart.textContent =
    i === 2 ? '💗' : '♡';

  heart.style.left = pos[0] + '%';
  heart.style.top = pos[1] + '%';

  heart.style.animationDelay =
    i * 0.18 + 's';

  heart.addEventListener('click', () => {
    if (heart.dataset.found) return;

    heart.dataset.found = '1';

    found++;

    countEl.textContent = found;

    heart.style.transform = 'scale(2)';
    heart.style.opacity = '0';

    playChime();

    setTimeout(() => {
      heart.remove();
    }, 250);

    if (found === 5) {
      toast('All hearts found! 💕');

      burst();

      setTimeout(() => {
        showLevel(1);
      }, 900);
    }
  });

  arena.appendChild(heart);
});

/* =========================================================
   LEVEL 2 — QUIZ
========================================================= */

document.querySelectorAll('.answer').forEach(btn => {
  btn.addEventListener('click', () => {
    document.getElementById('quizReply').textContent =
      btn.dataset.reply;

    document
      .querySelectorAll('.answer')
      .forEach(x => {
        x.disabled = true;
      });

    playChime();

    setTimeout(() => {
      showLevel(2);
    }, 1500);
  });
});

/* =========================================================
   LEVEL 3 — TRUTH CARD
========================================================= */

document.querySelectorAll('.truth-card').forEach(btn => {
  btn.addEventListener('click', () => {
    const message =
      document.getElementById('truthMessage');

    if (btn.dataset.correct === 'true') {
      btn.classList.add('correct');

      message.textContent =
        'Exactly. That is the kind of evening I want with you. ❤️';

      burst();
      playChime();

      setTimeout(() => {
        showLevel(3);
      }, 1000);
    } else {
      btn.classList.add('wrong');

      message.textContent =
        'Not quite. Think about what would make the evening feel special.';

      setTimeout(() => {
        btn.classList.remove('wrong');
      }, 450);
    }
  });
});

/* =========================================================
   LEVEL 4 — ENVELOPE
========================================================= */

document
  .getElementById('envelope')
  .addEventListener('click', function () {

    if (this.classList.contains('open')) {
      return;
    }

    this.classList.add('open');

    playChime();

    setTimeout(() => {
      showLevel(4);
    }, 1100);
  });

/* =========================================================
   SOUND BUTTON
========================================================= */

document
  .getElementById('soundBtn')
  .addEventListener('click', () => {

    soundOn = !soundOn;

    document.getElementById('soundBtn').textContent =
      soundOn ? '♪' : '×';

    if (soundOn) {
      playChime();
    }

    toast(
      soundOn
        ? 'Sound on'
        : 'Sound off'
    );
  });

/* =========================================================
   DINNER PLANNER
========================================================= */

const planner =
  document.getElementById('datePlanner');

const dateInput =
  document.getElementById('dateInput');

const placeChoices =
  document.querySelectorAll(
    '#placeChoices button'
  );

const timeChoices =
  document.querySelectorAll(
    '#timeChoices button'
  );

const activityChoices =
  document.querySelectorAll(
    '#activityChoices button'
  );

/* =========================================================
   OPEN DINNER PLANNER
========================================================= */

document
  .getElementById('planDateBtn')
  .addEventListener('click', () => {

    planner.classList.remove('hidden');

    document
      .getElementById('planDateBtn')
      .classList.add('hidden');

    planner.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });

    playChime();
  });

/* =========================================================
   SINGLE-SELECTION OPTIONS
========================================================= */

function selectSingle(list) {

  list.forEach(btn => {

    btn.addEventListener('click', () => {

      list.forEach(option => {
        option.classList.remove('selected');
      });

      btn.classList.add('selected');

      playChime();
    });

  });

}

selectSingle(placeChoices);
selectSingle(timeChoices);

/* =========================================================
   AFTER-DINNER ACTIVITIES
   MAXIMUM 4
========================================================= */

activityChoices.forEach(btn => {

  btn.addEventListener('click', () => {

    const selected = [
      ...activityChoices
    ].filter(option =>
      option.classList.contains('selected')
    );

    if (
      !btn.classList.contains('selected') &&
      selected.length >= 4
    ) {
      toast('Choose up to 4 activities');
      return;
    }

    btn.classList.toggle('selected');

    playChime();
  });

});

/* =========================================================
   DATE SETUP
========================================================= */

const today = new Date();

const minDate = new Date(today);

minDate.setDate(
  today.getDate() + 1
);

dateInput.min =
  minDate.toISOString().split('T')[0];

/*
   Esther's birthday:
   October 4, 2026
*/

const birthday = '2026-10-04';

dateInput.value = birthday;

/* =========================================================
   FORMAT DATE
========================================================= */

function prettyDate(value) {

  return new Intl.DateTimeFormat(
    'en-US',
    {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }
  ).format(
    new Date(value + 'T12:00:00')
  );

}

/* =========================================================
   CONFIRM DINNER PLAN
========================================================= */

document
  .getElementById('confirmDateBtn')
  .addEventListener('click', () => {

    const place =
      document.querySelector(
        '#placeChoices .selected'
      );

    const time =
      document.querySelector(
        '#timeChoices .selected'
      );

    const activities = [
      ...activityChoices
    ]
      .filter(option =>
        option.classList.contains('selected')
      )
      .map(option =>
        option.dataset.value
      );

    const error =
      document.getElementById(
        'plannerError'
      );

    /* Validation */

    if (
      !place ||
      !dateInput.value ||
      !time ||
      activities.length < 2
    ) {

      error.textContent =
        'Pick a dinner place, date, time, and at least 2 after-dinner moments. 💗';

      return;
    }

    error.textContent = '';

    /* =====================================================
       DISPLAY ESTHER'S SELECTED PLAN
    ===================================================== */

    document.getElementById(
      'summaryPlace'
    ).textContent =
      place.dataset.value;

    document.getElementById(
      'summaryDate'
    ).textContent =
      prettyDate(
        dateInput.value
      );

    document.getElementById(
      'summaryTime'
    ).textContent =
      time.dataset.value;

    document.getElementById(
      'summaryActivities'
    ).textContent =
      activities.join(' · ');

    /* Hide planner */

    planner.classList.add('hidden');

    /* Show final dinner card */

    document
      .getElementById('dateCard')
      .classList.remove('hidden');

    document
      .getElementById('dateCard')
      .scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });

    burst();
    playChime();
  });

/* =========================================================
   ESTHER SUBMITS HER DINNER PLAN TO WHATSAPP
========================================================= */

document
  .getElementById('finalDateBtn')
  .addEventListener('click', () => {

    /* -----------------------------------------------------
       GET ESTHER'S SELECTED DETAILS
    ----------------------------------------------------- */

    const place =
      document.getElementById(
        'summaryPlace'
      ).textContent;

    const date =
      document.getElementById(
        'summaryDate'
      ).textContent;

    const time =
      document.getElementById(
        'summaryTime'
      ).textContent;

    const afterDinner =
      document.getElementById(
        'summaryActivities'
      ).textContent;

    /* -----------------------------------------------------
       YOUR WHATSAPP NUMBER

       +233 55 655 6080
       International format:
       233556556080
    ----------------------------------------------------- */

    const whatsappNumber =
      '233556556080';

    /* -----------------------------------------------------
       MESSAGE SENT TO YOU

       This message contains ONLY Esther's submission.

       There is:
       - No "before I leave for school"
       - No romantic message from you
       - No message written as if you are Esther
       - No extra invitation text

       It simply submits her choices.
    ----------------------------------------------------- */

    const message =
`ESTHER'S BIRTHDAY DINNER PLAN 💗

Dinner place:
${place}

Date:
${date}

Time:
${time}

After dinner:
${afterDinner}`;

    /* -----------------------------------------------------
       CREATE WHATSAPP URL
    ----------------------------------------------------- */

    const whatsappUrl =
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    /* -----------------------------------------------------
       OPEN YOUR WHATSAPP CHAT
    ----------------------------------------------------- */

    window.open(
      whatsappUrl,
      '_blank'
    );

    /* -----------------------------------------------------
       CONFIRMATION ON THE WEBSITE
    ----------------------------------------------------- */

    document.getElementById(
      'dateResponse'
    ).textContent =
      'Your dinner plan has been submitted. 💗';

    burst();
    playChime();
  });