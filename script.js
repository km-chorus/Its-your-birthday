const intro = document.getElementById('intro'),
  startBtn = document.getElementById('startBtn'),
  shell = document.getElementById('gameShell');

const levels = [...document.querySelectorAll('.level')],
  progress = document.getElementById('progressBar'),
  levelLabel = document.getElementById('levelLabel');

let current = 0,
  soundOn = true;

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

startBtn.addEventListener('click', () => {
  intro.classList.add('out');
  shell.classList.remove('hidden');

  setTimeout(() => intro.remove(), 850);

  showLevel(0);
  playChime();
});

function toast(msg) {
  const t = document.getElementById('toast');

  t.textContent = msg;
  t.classList.add('show');

  clearTimeout(window.toastTimer);

  window.toastTimer = setTimeout(() => {
    t.classList.remove('show');
  }, 1800);
}

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

    setTimeout(() => el.remove(), 1900);
  }
}

/* -------------------------------------------------------
   LIGHTWEIGHT ORIGINAL WEB AUDIO CHIMES
------------------------------------------------------- */

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
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();

      o.type = 'sine';
      o.frequency.value = f;

      o.connect(g);
      g.connect(audioCtx.destination);

      g.gain.setValueAtTime(
        0.0001,
        now + i * 0.12
      );

      g.gain.exponentialRampToValueAtTime(
        0.045,
        now + i * 0.12 + 0.03
      );

      g.gain.exponentialRampToValueAtTime(
        0.0001,
        now + i * 0.12 + 0.45
      );

      o.start(now + i * 0.12);
      o.stop(now + i * 0.12 + 0.5);
    });
  } catch (e) {}
}

/* -------------------------------------------------------
   LEVEL 1 — CATCH THE HEARTS
------------------------------------------------------- */

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
  const b = document.createElement('button');

  b.className = 'floating-heart';
  b.textContent = i === 2 ? '💗' : '♡';

  b.style.left = pos[0] + '%';
  b.style.top = pos[1] + '%';

  b.style.animationDelay =
    i * 0.18 + 's';

  b.addEventListener('click', () => {
    if (b.dataset.found) return;

    b.dataset.found = '1';

    found++;

    countEl.textContent = found;

    b.style.transform = 'scale(2)';
    b.style.opacity = '0';

    playChime();

    setTimeout(() => b.remove(), 250);

    if (found === 5) {
      toast('All hearts found! 💕');

      burst();

      setTimeout(() => {
        showLevel(1);
      }, 900);
    }
  });

  arena.appendChild(b);
});

/* -------------------------------------------------------
   LEVEL 2 — QUIZ
------------------------------------------------------- */

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

/* -------------------------------------------------------
   LEVEL 3 — TRUTH CARD
------------------------------------------------------- */

document.querySelectorAll('.truth-card').forEach(btn => {
  btn.addEventListener('click', () => {
    const msg =
      document.getElementById('truthMessage');

    if (btn.dataset.correct === 'true') {
      btn.classList.add('correct');

      msg.textContent =
        'Exactly. That is the kind of evening I want with you. ❤️';

      burst();
      playChime();

      setTimeout(() => {
        showLevel(3);
      }, 1000);
    } else {
      btn.classList.add('wrong');

      msg.textContent =
        'Not quite. Think about what would make the evening feel special.';

      setTimeout(() => {
        btn.classList.remove('wrong');
      }, 450);
    }
  });
});

/* -------------------------------------------------------
   LEVEL 4 — ENVELOPE
------------------------------------------------------- */

document
  .getElementById('envelope')
  .addEventListener('click', function () {
    if (this.classList.contains('open')) return;

    this.classList.add('open');

    playChime();

    setTimeout(() => {
      showLevel(4);
    }, 1100);
  });

/* -------------------------------------------------------
   SOUND BUTTON
------------------------------------------------------- */

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

/* -------------------------------------------------------
   DINNER PLANNER
------------------------------------------------------- */

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

/* Open planner */

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

/* -------------------------------------------------------
   SINGLE SELECT OPTIONS
------------------------------------------------------- */

function selectSingle(list) {
  list.forEach(btn => {
    btn.addEventListener('click', () => {
      list.forEach(x => {
        x.classList.remove('selected');
      });

      btn.classList.add('selected');

      playChime();
    });
  });
}

selectSingle(placeChoices);
selectSingle(timeChoices);

/* -------------------------------------------------------
   AFTER-DINNER ACTIVITIES
------------------------------------------------------- */

activityChoices.forEach(btn => {
  btn.addEventListener('click', () => {
    const selected = [
      ...activityChoices
    ].filter(x =>
      x.classList.contains('selected')
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

/* -------------------------------------------------------
   DATE SETUP
------------------------------------------------------- */

const today = new Date();

const minDate = new Date(today);

minDate.setDate(
  today.getDate() + 1
);

dateInput.min =
  minDate.toISOString().split('T')[0];

/*
   Esther's birthday
   October 4, 2026
*/

const birthday = '2026-10-04';

dateInput.value = birthday;

/* -------------------------------------------------------
   PRETTY DATE
------------------------------------------------------- */

function prettyDate(v) {
  return new Intl.DateTimeFormat(
    'en-US',
    {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }
  ).format(
    new Date(v + 'T12:00:00')
  );
}

/* -------------------------------------------------------
   CONFIRM DINNER PLAN
------------------------------------------------------- */

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

    const acts = [
      ...activityChoices
    ]
      .filter(x =>
        x.classList.contains('selected')
      )
      .map(x => x.dataset.value);

    const err =
      document.getElementById(
        'plannerError'
      );

    if (
      !place ||
      !dateInput.value ||
      !time ||
      acts.length < 2
    ) {
      err.textContent =
        'Pick a dinner place, date, time, and at least 2 after-dinner moments. 💗';

      return;
    }

    err.textContent = '';

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
      acts.join(' · ');

    planner.classList.add('hidden');

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

/* -------------------------------------------------------
   ESTHER SUBMITS HER DINNER PLAN
   ------------------------------------------------------- */

document
  .getElementById('finalDateBtn')
  .addEventListener('click', () => {

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

    const after =
      document.getElementById(
        'summaryActivities'
      ).textContent;

    /*
      Your WhatsApp number.
      International format:
      +233 55 655 6080
      becomes:
      233556556080
    */

    const number = '233556556080';

    /*
      This message is written as
      Esther submitting her choices.

      Nothing here speaks on your behalf.
    */

    const msg =
`ESTHER'S BIRTHDAY DINNER PLAN 💗

Dinner place:
${place}

Date:
${date}

Time:
${time}

After dinner:
${after}`;

    const url =
      `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;

    /*
      Open your WhatsApp chat with
      Esther's completed dinner plan
      already typed into the message box.
    */

    window.open(
      url,
      '_blank'
    );

    document.getElementById(
      'dateResponse'
    ).textContent =
      'Your dinner plan has been prepared. 💗 WhatsApp is opening so you can submit it.';

    burst();
    playChime();
  });