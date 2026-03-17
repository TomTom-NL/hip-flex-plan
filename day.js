// day.js — renders day content from data.js

(function () {
  const params = new URLSearchParams(window.location.search);
  const dayNum = parseInt(params.get('day'), 10) || 1;
  const data = DAYS.find(d => d.day === dayNum);

  // Update page title
  if (data) document.title = `Day ${data.day}: ${data.type} — Hip Flexibility Plan`;

  // Mark active nav link
  document.querySelectorAll('.nav-day').forEach(a => {
    const d = parseInt(a.dataset.day, 10);
    if (d === dayNum) a.classList.add('active');
  });

  const container = document.getElementById('day-content');
  if (!data) {
    container.innerHTML = '<div class="loading">Day not found.</div>';
    return;
  }

  const phaseNames = { 1: 'Phase 1 — Awaken', 2: 'Phase 2 — Open', 3: 'Phase 3 — Deepen' };
  const badgeClass = data.isRest ? 'badge-rest' : `badge-phase${data.phase}`;
  const phaseBadgeText = data.isRest ? 'Rest Day' : phaseNames[data.phase];

  // Nav links
  const prevDay = dayNum > 1 ? `<a href="day.html?day=${dayNum - 1}" class="day-nav-btn">← Day ${dayNum - 1}</a>` : `<a href="index.html" class="day-nav-btn">← Overview</a>`;
  const nextDay = dayNum < 10 ? `<a href="day.html?day=${dayNum + 1}" class="day-nav-btn next">Day ${dayNum + 1} →</a>` : `<a href="index.html" class="day-nav-btn next">Back to overview →</a>`;

  // Phase bar accent
  const phaseColors = { 1: 'var(--phase1)', 2: 'var(--phase2)', 3: 'var(--phase3)' };
  const accentColor = phaseColors[data.phase] || 'var(--sage)';

  let contentHTML = '';

  if (data.isRest) {
    // REST DAY
    contentHTML = `
      <div class="day-header">
        <div class="day-meta">
          <span class="day-badge ${badgeClass}">${phaseBadgeText}</span>
          <span class="day-number">Day ${data.day} of 10</span>
        </div>
        <h1 class="day-title">${data.type}</h1>
        <div class="day-duration">${data.mins}</div>
      </div>
      <div class="tip-box"><strong>Today's focus:</strong> ${data.tip}</div>
      <div class="exercises-list">
        ${data.restActivities.map((act, i) => `
          <div class="rest-day-card exercise-card">
            <div class="exercise-card-inner">
              <div class="ex-instructions">
                <div class="ex-num-label">Activity ${i + 1}</div>
                <div class="ex-name" style="font-size:1.25rem">${act.name}</div>
                <p class="ex-summary" style="margin-bottom:0">${act.desc}</p>
              </div>
              <div class="ex-video" style="background:var(--cream);">
                <div class="video-placeholder">
                  <div class="video-placeholder-icon">
                    ${videoIcon()}
                  </div>
                  <div class="video-placeholder-text">
                    <strong>Video goes here</strong>
                    Paste a YouTube embed below this placeholder
                  </div>
                </div>
                <a class="yt-search-link" href="https://www.youtube.com/results?search_query=${encodeURIComponent(act.ytQuery)}" target="_blank" rel="noopener">
                  ${ytIcon()} Search YouTube for a tutorial
                </a>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="day-footer-nav">${prevDay}${nextDay}</div>
    `;
  } else {
    // EXERCISE DAY
    const exCards = data.exercises.map((ex, i) => `
      <div class="exercise-card" id="ex-${i}">
        <div class="exercise-card-inner">

          <!-- LEFT: Instructions -->
          <div class="ex-instructions">
            <div class="ex-num-label">Exercise ${i + 1}</div>
            <div class="ex-name">${ex.name}</div>

            <div class="ex-quick-facts">
              ${ex.facts.map(f => `<span class="ex-fact">${f}</span>`).join('')}
            </div>

            <p class="ex-summary">${ex.summary}</p>

            <button class="ex-expand-toggle" onclick="toggleDeep(${i})" id="toggle-${i}">
              <span>More detail & why</span>
              <span class="toggle-arrow">↓</span>
            </button>

            <div class="ex-deep-dive" id="deep-${i}">
              <div class="deep-section">
                <div class="deep-label">Why this exercise</div>
                <div class="deep-text">${ex.why}</div>
              </div>
              <div class="deep-section">
                <div class="deep-label">How to do it</div>
                <ol class="steps-list">
                  ${ex.howTo.map(step => `<li>${step}</li>`).join('')}
                </ol>
              </div>
              <div class="deep-section">
                <div class="deep-label">Coaching cue</div>
                <div class="deep-text">${ex.cues}</div>
              </div>
            </div>
          </div>

          <!-- RIGHT: Video -->
          <div class="ex-video">
            <div class="video-placeholder">
              <div class="video-placeholder-icon">
                ${videoIcon()}
              </div>
              <div class="video-placeholder-text">
                <strong>Video placeholder</strong>
                Replace this with a YouTube iframe embed
              </div>
            </div>
            <a class="yt-search-link" href="https://www.youtube.com/results?search_query=${encodeURIComponent(ex.ytQuery)}" target="_blank" rel="noopener">
              ${ytIcon()} Find tutorial on YouTube
            </a>
          </div>

        </div>
      </div>
    `).join('');

    const finalBlock = data.isFinal ? `
      <div class="completion-block">
        <div class="completion-title">🎉 You made it</div>
        <p class="completion-body">Ten days of consistent work on your hip flexibility. The changes you've made aren't just in your muscles — they're encoded in your nervous system. Keep going.</p>
        <a href="index.html" class="btn-start">Return to overview →</a>
      </div>
    ` : '';

    contentHTML = `
      <div class="day-header">
        <div class="day-meta">
          <span class="day-badge ${badgeClass}">${phaseBadgeText}</span>
          <span class="day-number">Day ${data.day} of 10</span>
        </div>
        <h1 class="day-title">${data.type}</h1>
        <div class="day-duration">${data.mins}</div>
      </div>

      <div class="tip-box"><strong>Today's tip:</strong> ${data.tip}</div>

      <div class="exercises-list">
        ${exCards}
      </div>

      ${finalBlock}

      <div class="day-footer-nav">${prevDay}${nextDay}</div>
    `;
  }

  container.innerHTML = contentHTML;

  // Animate cards in with stagger
  container.querySelectorAll('.exercise-card').forEach((card, i) => {
    card.style.animationDelay = `${0.05 + i * 0.07}s`;
  });
})();

function toggleDeep(i) {
  const deep = document.getElementById(`deep-${i}`);
  const btn  = document.getElementById(`toggle-${i}`);
  const open = deep.classList.toggle('visible');
  btn.classList.toggle('open', open);
  btn.querySelector('span:first-child').textContent = open ? 'Less detail' : 'More detail & why';
}

function videoIcon() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:22px;height:22px;color:var(--ink-faint)">
    <rect x="2" y="6" width="15" height="12" rx="2"/>
    <path d="M17 9l5-3v12l-5-3"/>
  </svg>`;
}

function ytIcon() {
  return `<svg viewBox="0 0 16 16" fill="currentColor" style="width:14px;height:14px;opacity:0.5">
    <path d="M6.5 5.5l4 2.5-4 2.5V5.5z"/>
    <path fill-rule="evenodd" d="M1 8a7 7 0 1 1 14 0A7 7 0 0 1 1 8zm7-6a6 6 0 1 0 0 12A6 6 0 0 0 8 2z"/>
  </svg>`;
}
