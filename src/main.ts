import './styles.css';
import { STATIONS, StationData, VocabItem, StationTask } from './data/stations';
import { DioramaManager, TimeOfDay } from './scene/DioramaManager';
import { sound } from './audio';

const STORAGE_KEY = 'sprachreise_save_v1';

interface SavedProgress {
  stars: number;
  discoveredIds: string[];
  completedStations: string[];
  bestQuizStreak: number;
  timeOfDay: TimeOfDay;
}

interface GameState {
  stationIndex: number;
  stars: number;
  discoveredIds: Set<string>;
  completedStations: Set<string>;
  bestQuizStreak: number;
  timeOfDay: TimeOfDay;
  missionActive: boolean;
  taskIndex: number;
  taskSolved: boolean;
  sentenceSelection: { word: string; bankIdx: number }[];
}

const state: GameState = {
  stationIndex: 0,
  stars: 0,
  discoveredIds: new Set<string>(),
  completedStations: new Set<string>(),
  bestQuizStreak: 0,
  timeOfDay: 'day',
  missionActive: false,
  taskIndex: 0,
  taskSolved: false,
  sentenceSelection: []
};

function loadProgress(): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw) as Partial<SavedProgress>;
    if (typeof data.stars === 'number') state.stars = data.stars;
    if (Array.isArray(data.discoveredIds)) state.discoveredIds = new Set(data.discoveredIds);
    if (Array.isArray(data.completedStations)) state.completedStations = new Set(data.completedStations);
    if (typeof data.bestQuizStreak === 'number') state.bestQuizStreak = data.bestQuizStreak;
    if (data.timeOfDay === 'day' || data.timeOfDay === 'sunset' || data.timeOfDay === 'night') {
      state.timeOfDay = data.timeOfDay;
    }
  } catch {
    // ignore corrupted localStorage
  }
}

function saveProgress(): void {
  try {
    const payload: SavedProgress = {
      stars: state.stars,
      discoveredIds: Array.from(state.discoveredIds),
      completedStations: Array.from(state.completedStations),
      bestQuizStreak: state.bestQuizStreak,
      timeOfDay: state.timeOfDay
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // ignore quota errors
  }
}

loadProgress();

// Barnaby the Travel Owl Tips
const OWL_TIPS: { en: string; de: string }[] = [
  { en: 'Hello traveller! Click any glowing ring to learn a new English word.', de: 'Hallo Reisender! Klicke einen leuchtenden Ring an, um ein neues englisches Wort zu lernen.' },
  { en: 'Try switching to Night mode with the sun button in the top right!', de: 'Probier mal den Nachtmodus mit dem Sonnen-Button oben rechts aus!' },
  { en: 'Practice makes perfect! Try the Vocabulary Quiz to earn extra stars.', de: 'Übung macht den Meister! Starte das Vokabel-Quiz für Extra-Sterne.' },
  { en: 'In England, people always say please and thank you!', de: 'In England sagt man fast immer „please“ (bitte) und „thank you“ (danke)!' },
  { en: 'Can you collect all five passport stamps on your journey to London?', de: 'Schaffst du alle 5 Reisepass-Stempel auf deiner Reise nach London?' },
  { en: 'Great job! Click the speaker button to hear British English pronunciation.', de: 'Super gemacht! Klicke auf das Lautsprecher-Symbol für die britische Aussprache.' }
];
let owlTipIdx = 0;

// DOM References
const canvas = document.getElementById('scene-canvas') as HTMLCanvasElement;
const hoverTooltip = document.getElementById('hover-tooltip') as HTMLDivElement;
const stationTabsEl = document.getElementById('station-tabs') as HTMLElement;
const starsCountEl = document.getElementById('stars-count') as HTMLElement;
const vocabBadgeEl = document.getElementById('vocab-badge') as HTMLElement;
const stampBadgeEl = document.getElementById('stamp-badge') as HTMLElement;
const btnMute = document.getElementById('btn-mute') as HTMLButtonElement;
const btnTime = document.getElementById('btn-time') as HTMLButtonElement;
const btnQuiz = document.getElementById('btn-quiz') as HTMLButtonElement;

const stationStepTag = document.getElementById('station-step-tag') as HTMLElement;
const stationStampPill = document.getElementById('station-stamp-pill') as HTMLElement;
const stationTitleEl = document.getElementById('station-title') as HTMLElement;
const stationSubtitleEl = document.getElementById('station-subtitle') as HTMLElement;
const discoveryDotsEl = document.getElementById('discovery-dots') as HTMLElement;
const btnStartMission = document.getElementById('btn-start-mission') as HTMLButtonElement;
const btnResetCam = document.getElementById('btn-reset-cam') as HTMLButtonElement;

const vocabCard = document.getElementById('vocab-card') as HTMLElement;
const vocabCardClose = document.getElementById('vocab-card-close') as HTMLButtonElement;
const vocabEmoji = document.getElementById('vocab-emoji') as HTMLElement;
const vocabEn = document.getElementById('vocab-en') as HTMLElement;
const vocabPhonetic = document.getElementById('vocab-phonetic') as HTMLElement;
const vocabDe = document.getElementById('vocab-de') as HTMLElement;
const vocabNewTag = document.getElementById('vocab-new-tag') as HTMLElement;
const vocabExampleEn = document.getElementById('vocab-example-en') as HTMLElement;
const vocabExampleDe = document.getElementById('vocab-example-de') as HTMLElement;
const vocabSpeakWord = document.getElementById('vocab-speak-word') as HTMLButtonElement;
const vocabSpeakSentence = document.getElementById('vocab-speak-sentence') as HTMLButtonElement;

const missionPanel = document.getElementById('mission-panel') as HTMLElement;
const missionProgress = document.getElementById('mission-progress') as HTMLElement;
const missionTitle = document.getElementById('mission-title') as HTMLElement;
const missionBody = document.getElementById('mission-body') as HTMLElement;
const missionFeedback = document.getElementById('mission-feedback') as HTMLElement;
const missionClose = document.getElementById('mission-close') as HTMLButtonElement;

const loadingOverlay = document.getElementById('loading-overlay') as HTMLElement;
const loadingStatus = document.getElementById('loading-status') as HTMLElement;
const loadingBarFill = document.getElementById('loading-bar-fill') as HTMLElement;

const welcomeModal = document.getElementById('welcome-modal') as HTMLElement;
const btnBeginJourney = document.getElementById('btn-begin-journey') as HTMLButtonElement;

const vocabModal = document.getElementById('vocab-modal') as HTMLElement;
const vocabListEl = document.getElementById('vocab-list') as HTMLElement;
const btnVocab = document.getElementById('btn-vocab') as HTMLButtonElement;
const closeVocabModal = document.getElementById('close-vocab-modal') as HTMLButtonElement;

const passportModal = document.getElementById('passport-modal') as HTMLElement;
const passportStampsEl = document.getElementById('passport-stamps') as HTMLElement;
const passportCelebration = document.getElementById('passport-celebration') as HTMLElement;
const bestStreakLabel = document.getElementById('best-streak-label') as HTMLElement;
const btnResetProgress = document.getElementById('btn-reset-progress') as HTMLButtonElement;
const btnPassport = document.getElementById('btn-passport') as HTMLButtonElement;
const closePassportModal = document.getElementById('close-passport-modal') as HTMLButtonElement;

const quizModal = document.getElementById('quiz-modal') as HTMLElement;
const closeQuizModal = document.getElementById('close-quiz-modal') as HTMLButtonElement;
const quizCounterEl = document.getElementById('quiz-counter') as HTMLElement;
const quizStreakEl = document.getElementById('quiz-streak') as HTMLElement;
const quizScoreEl = document.getElementById('quiz-score') as HTMLElement;
const quizStageEl = document.getElementById('quiz-stage') as HTMLElement;

const owlToast = document.getElementById('owl-toast') as HTMLElement;
const owlEnEl = document.getElementById('owl-en') as HTMLElement;
const owlDeEl = document.getElementById('owl-de') as HTMLElement;
const owlClose = document.getElementById('owl-close') as HTMLButtonElement;

const travelBanner = document.getElementById('travel-banner') as HTMLElement;
const travelIcon = document.getElementById('travel-icon') as HTMLElement;
const travelText = document.getElementById('travel-text') as HTMLElement;

const stampToast = document.getElementById('stamp-toast') as HTMLElement;
const toastStampIcon = document.getElementById('toast-stamp-icon') as HTMLElement;
const toastStampTitle = document.getElementById('toast-stamp-title') as HTMLElement;
const toastStampSub = document.getElementById('toast-stamp-sub') as HTMLElement;
const toastNextBtn = document.getElementById('toast-next-btn') as HTMLButtonElement;

let activeVocabItem: VocabItem | null = null;
let travelBannerTimer: number | null = null;
let owlTimer: number | null = null;

const diorama = new DioramaManager(canvas);

function allVocabItems(): VocabItem[] {
  return STATIONS.flatMap((s) => s.items);
}

function currentStation(): StationData {
  return STATIONS[state.stationIndex];
}

function totalVocabCount(): number {
  return STATIONS.reduce((sum, s) => sum + s.items.length, 0);
}

function updateTimeButton(): void {
  const icons: Record<TimeOfDay, string> = { day: '☀️', sunset: '🌇', night: '🌙' };
  const labels: Record<TimeOfDay, string> = {
    day: 'Tageszeit: Tag (klicken für Sonnenuntergang)',
    sunset: 'Tageszeit: Abendrot (klicken für Nacht)',
    night: 'Tageszeit: Sternennacht (klicken für Tag)'
  };
  btnTime.textContent = icons[state.timeOfDay];
  btnTime.title = labels[state.timeOfDay];
}

function updateHud(): void {
  starsCountEl.textContent = String(state.stars);
  vocabBadgeEl.textContent = `${state.discoveredIds.size}/${totalVocabCount()}`;
  stampBadgeEl.textContent = `${state.completedStations.size}/${STATIONS.length}`;
  updateTimeButton();
  renderStationTabs();
  renderStationBanner();
  saveProgress();
}

function renderStationTabs(): void {
  stationTabsEl.innerHTML = '';
  STATIONS.forEach((st, idx) => {
    const btn = document.createElement('button');
    btn.className = `station-tab ${idx === state.stationIndex ? 'active' : ''}`;
    const done = state.completedStations.has(st.id);
    btn.innerHTML = `<span>${st.icon}</span><span>${st.nameDe}</span>${done ? '<span class="tab-check">✓</span>' : ''}`;
    btn.addEventListener('click', () => {
      if (idx !== state.stationIndex) {
        sound.playClick();
        switchStation(idx);
      }
    });
    stationTabsEl.appendChild(btn);
  });
}

function renderStationBanner(): void {
  const st = currentStation();
  stationStepTag.textContent = `Station ${st.index + 1} von ${STATIONS.length}`;
  stationTitleEl.textContent = `${st.icon} ${st.nameEn} (${st.nameDe})`;
  stationSubtitleEl.textContent = st.descriptionDe;

  const stamped = state.completedStations.has(st.id);
  stationStampPill.classList.toggle('hidden', !stamped);
  btnStartMission.textContent = stamped ? '🔁 Aufgaben wiederholen' : '🎯 Aufgaben starten';

  discoveryDotsEl.innerHTML = '';
  st.items.forEach((item) => {
    const found = state.discoveredIds.has(item.id);
    const dot = document.createElement('button');
    dot.className = `disc-dot ${found ? 'found' : ''}`;
    dot.textContent = found ? item.emoji : '?';
    dot.title = found ? `${item.en} (${item.de})` : 'Noch nicht entdeckt — klicke das 3D-Objekt!';
    dot.addEventListener('click', () => {
      sound.playClick();
      diorama.focusOnItem(item.id);
      if (found) {
        openVocabCard(item, false);
      }
    });
    discoveryDotsEl.appendChild(dot);
  });
}

function showTravelBanner(st: StationData): void {
  if (travelBannerTimer) window.clearTimeout(travelBannerTimer);
  travelIcon.textContent = st.icon;
  travelText.textContent = `Willkommen: ${st.nameEn} (${st.nameDe})`;
  travelBanner.classList.remove('hidden');
  travelBannerTimer = window.setTimeout(() => {
    travelBanner.classList.add('hidden');
  }, 1900);
}

function switchStation(idx: number): void {
  state.stationIndex = idx;
  state.missionActive = false;
  state.taskIndex = 0;
  state.taskSolved = false;
  missionPanel.classList.add('hidden');
  vocabCard.classList.add('hidden');
  stampToast.classList.add('hidden');
  owlToast.classList.add('hidden');

  const st = currentStation();
  diorama.loadStation(st, state.discoveredIds);
  showTravelBanner(st);
  updateHud();
}

function openVocabCard(item: VocabItem, isNew: boolean): void {
  activeVocabItem = item;
  owlToast.classList.add('hidden');
  vocabEmoji.textContent = item.emoji;
  vocabEn.textContent = item.en;
  vocabPhonetic.textContent = item.phonetic;
  vocabDe.textContent = item.de;
  vocabExampleEn.textContent = item.exampleEn;
  vocabExampleDe.textContent = item.exampleDe;
  vocabNewTag.classList.toggle('hidden', !isNew);
  vocabCard.classList.remove('hidden');
  sound.speakEnglish(item.en);
}

function handleItemClick(item: VocabItem): void {
  const st = currentStation();

  // If a 'find' mission task is currently active, evaluate click as mission answer!
  if (state.missionActive && !state.taskSolved) {
    const task = st.tasks[state.taskIndex];
    if (task.type === 'find') {
      diorama.focusOnItem(item.id);
      if (!state.discoveredIds.has(item.id)) {
        state.discoveredIds.add(item.id);
        state.stars += 1;
        diorama.markDiscovered(item.id);
        updateHud();
      }
      if (item.id === task.targetItemId) {
        sound.playSuccess();
        sound.speakEnglish(item.en);
        diorama.burstConfetti(item.id);
        state.stars += 2;
        state.taskSolved = true;
        updateHud();
        showMissionFeedback(true, `Super! Das ist „${item.en}“ (${item.de}).`);
      } else {
        sound.playError();
        showMissionFeedback(false, `Das war „${item.en}“ (${item.de}). Probier noch ein anderes Objekt!`);
      }
      return;
    }
  }

  // Normal discovery mode
  const isNew = !state.discoveredIds.has(item.id);
  if (isNew) {
    state.discoveredIds.add(item.id);
    state.stars += 1;
    diorama.markDiscovered(item.id);
    diorama.burstConfetti(item.id);
    sound.playDiscover();
    updateHud();
  } else {
    sound.playClick();
  }

  diorama.focusOnItem(item.id);
  openVocabCard(item, isNew);
}

function handleGuideClick(): void {
  const tip = OWL_TIPS[owlTipIdx % OWL_TIPS.length];
  owlTipIdx++;
  sound.playDiscover();
  sound.speakEnglish(tip.en, 0.94);
  vocabCard.classList.add('hidden');
  owlEnEl.textContent = tip.en;
  owlDeEl.textContent = tip.de;
  owlToast.classList.remove('hidden');
  if (owlTimer) window.clearTimeout(owlTimer);
  owlTimer = window.setTimeout(() => {
    owlToast.classList.add('hidden');
  }, 6500);
}

// Mission Flow
function startMission(): void {
  sound.playClick();
  vocabCard.classList.add('hidden');
  stampToast.classList.add('hidden');
  owlToast.classList.add('hidden');
  state.missionActive = true;
  state.taskIndex = 0;
  state.taskSolved = false;
  diorama.resetCamera();
  renderCurrentTask();
  missionPanel.classList.remove('hidden');
}

function renderCurrentTask(): void {
  const st = currentStation();
  const task: StationTask = st.tasks[state.taskIndex];
  state.taskSolved = false;
  missionProgress.textContent = `Aufgabe ${state.taskIndex + 1} / ${st.tasks.length}`;
  missionTitle.textContent = task.title;
  missionFeedback.classList.add('hidden');
  missionBody.innerHTML = '';

  if (task.type === 'find') {
    diorama.resetCamera();
    missionBody.innerHTML = `
      <p class="mission-prompt">${task.promptDe}</p>
      <div class="mission-callout">
        <strong>„${task.promptEn}“</strong>
        <button id="btn-play-find" class="speak-btn">🔊 Anhören</button>
      </div>
      <div class="mission-actions-row">
        <button id="btn-find-hint" class="ghost-btn">💡 Tipp anzeigen</button>
      </div>
      <div id="find-hint-box" class="hint-text hidden">${task.hintDe}</div>
    `;
    document.getElementById('btn-play-find')?.addEventListener('click', () => {
      sound.speakEnglish(task.promptEn);
    });
    document.getElementById('btn-find-hint')?.addEventListener('click', () => {
      document.getElementById('find-hint-box')?.classList.remove('hidden');
    });
    sound.speakEnglish(task.promptEn);
  } else if (task.type === 'dialogue') {
    const bubble = document.createElement('div');
    bubble.className = 'npc-bubble';
    bubble.innerHTML = `
      <div class="npc-avatar">${task.speakerEmoji}</div>
      <div style="flex:1">
        <div class="npc-name">${task.speakerName}</div>
        <div class="npc-en">${task.npcLineEn}</div>
        <div class="npc-de">${task.npcLineDe}</div>
      </div>
      <button id="btn-play-npc" class="speak-btn small">🔊</button>
    `;
    missionBody.appendChild(bubble);

    const list = document.createElement('div');
    list.className = 'option-list';
    task.options.forEach((opt) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.innerHTML = `<span class="opt-en">${opt.en}</span><span class="opt-de">${opt.de}</span>`;
      btn.addEventListener('click', () => {
        if (state.taskSolved) return;
        if (opt.correct) {
          btn.classList.add('correct');
          sound.playSuccess();
          sound.speakEnglish(opt.en);
          diorama.burstConfetti();
          state.stars += 2;
          state.taskSolved = true;
          updateHud();
          showMissionFeedback(true, opt.feedbackDe);
        } else {
          btn.classList.add('wrong');
          sound.playError();
          showMissionFeedback(false, opt.feedbackDe);
        }
      });
      list.appendChild(btn);
    });
    missionBody.appendChild(list);

    document.getElementById('btn-play-npc')?.addEventListener('click', () => {
      sound.speakEnglish(task.npcLineEn);
    });
    sound.speakEnglish(task.npcLineEn);
  } else if (task.type === 'sentence') {
    state.sentenceSelection = [];
    const bankWords = [...task.targetWords, ...task.extraWords].sort(() => Math.random() - 0.5);

    const prompt = document.createElement('p');
    prompt.className = 'mission-prompt';
    prompt.textContent = task.promptDe;
    missionBody.appendChild(prompt);

    const tray = document.createElement('div');
    tray.className = 'sentence-tray';
    missionBody.appendChild(tray);

    const bank = document.createElement('div');
    bank.className = 'word-bank';
    missionBody.appendChild(bank);

    const actions = document.createElement('div');
    actions.className = 'mission-actions-row';
    const checkBtn = document.createElement('button');
    checkBtn.className = 'primary-btn';
    checkBtn.textContent = 'Prüfen ✓';
    const clearBtn = document.createElement('button');
    clearBtn.className = 'ghost-btn';
    clearBtn.textContent = 'Leeren';
    actions.appendChild(checkBtn);
    actions.appendChild(clearBtn);
    missionBody.appendChild(actions);

    const redrawSentence = () => {
      tray.innerHTML = '';
      if (state.sentenceSelection.length === 0) {
        tray.innerHTML = '<span class="tray-placeholder">Klicke unten die Wörter in der richtigen Reihenfolge an…</span>';
      } else {
        state.sentenceSelection.forEach((sel, idx) => {
          const tile = document.createElement('button');
          tile.className = 'word-tile placed';
          tile.textContent = sel.word;
          tile.addEventListener('click', () => {
            if (state.taskSolved) return;
            sound.playClick();
            state.sentenceSelection.splice(idx, 1);
            redrawSentence();
          });
          tray.appendChild(tile);
        });
      }

      bank.innerHTML = '';
      const usedSet = new Set(state.sentenceSelection.map((s) => s.bankIdx));
      bankWords.forEach((w, bankIdx) => {
        const tile = document.createElement('button');
        tile.className = `word-tile ${usedSet.has(bankIdx) ? 'used' : ''}`;
        tile.textContent = w;
        tile.addEventListener('click', () => {
          if (state.taskSolved || usedSet.has(bankIdx)) return;
          sound.playClick();
          state.sentenceSelection.push({ word: w, bankIdx });
          redrawSentence();
        });
        bank.appendChild(tile);
      });
    };

    clearBtn.addEventListener('click', () => {
      if (state.taskSolved) return;
      state.sentenceSelection = [];
      missionFeedback.classList.add('hidden');
      redrawSentence();
    });

    checkBtn.addEventListener('click', () => {
      if (state.taskSolved) return;
      const built = state.sentenceSelection.map((s) => s.word).join(' ');
      if (built === task.fullSentenceEn) {
        sound.playSuccess();
        sound.speakEnglish(task.fullSentenceEn);
        diorama.burstConfetti();
        state.stars += 3;
        state.taskSolved = true;
        updateHud();
        showMissionFeedback(true, `Klasse! „${task.fullSentenceEn}“ = ${task.fullSentenceDe}`);
      } else {
        sound.playError();
        showMissionFeedback(false, 'Noch nicht ganz richtig – prüf die Wortreihenfolge oder entferne überflüssige Wörter.');
      }
    });

    redrawSentence();
  }
}

function showMissionFeedback(ok: boolean, message: string): void {
  missionFeedback.className = `mission-feedback ${ok ? 'ok' : 'err'}`;
  missionFeedback.innerHTML = `<span>${ok ? '✅' : '💡'} ${message}</span>`;

  if (ok) {
    const nextBtn = document.createElement('button');
    nextBtn.className = 'primary-btn small';
    const isLast = state.taskIndex >= currentStation().tasks.length - 1;
    nextBtn.textContent = isLast ? 'Stempel holen 🛂' : 'Weiter →';
    nextBtn.addEventListener('click', () => {
      sound.playClick();
      if (isLast) {
        completeCurrentStation();
      } else {
        state.taskIndex++;
        renderCurrentTask();
      }
    });
    missionFeedback.appendChild(nextBtn);
  }
}

function completeCurrentStation(): void {
  const st = currentStation();
  const firstTime = !state.completedStations.has(st.id);
  state.completedStations.add(st.id);
  if (firstTime) {
    state.stars += 5;
  }
  state.missionActive = false;
  missionPanel.classList.add('hidden');
  sound.playStamp();
  diorama.burstConfetti();
  updateHud();

  toastStampIcon.textContent = st.icon;
  toastStampTitle.textContent = `Stempel erhalten: ${st.nameEn}!`;
  const hasNext = state.stationIndex < STATIONS.length - 1;
  toastStampSub.textContent = hasNext
    ? `Auf geht’s zur nächsten Station: ${STATIONS[state.stationIndex + 1].nameDe}!`
    : 'Du hast alle 5 Stationen abgeschlossen — schau in deinen Reisepass!';
  toastNextBtn.textContent = hasNext ? 'Nächste Station →' : 'Reisepass öffnen 🛂';
  stampToast.classList.remove('hidden');
}

// ==============================================================================
// VOKABEL-QUIZ MINI-GAME (Listen / Translate / Fill-in)
// ==============================================================================

interface QuizRound {
  questions: {
    mode: 'listen' | 'de2en' | 'en2de';
    target: VocabItem;
    choices: VocabItem[];
  }[];
  index: number;
  streak: number;
  earnedStars: number;
  correctCount: number;
  answered: boolean;
}

let activeQuiz: QuizRound | null = null;

function startQuiz(): void {
  sound.playClick();
  const all = allVocabItems();
  const discovered = all.filter((i) => state.discoveredIds.has(i.id));
  // Prefer discovered words if player has at least 6, otherwise mix all 30 words!
  const pool = discovered.length >= 6 ? [...discovered, ...all] : [...all];
  const uniquePicked: VocabItem[] = [];
  const shuffled = [...all].sort(() => Math.random() - 0.5);
  const discoveredShuffled = [...discovered].sort(() => Math.random() - 0.5);

  for (const item of [...discoveredShuffled, ...shuffled]) {
    if (uniquePicked.length >= 8) break;
    if (!uniquePicked.some((u) => u.id === item.id)) {
      uniquePicked.push(item);
    }
  }

  const modes: ('listen' | 'de2en' | 'en2de')[] = ['listen', 'de2en', 'en2de'];
  const questions = uniquePicked.map((target, idx) => {
    const distractors = pool
      .filter((i) => i.id !== target.id)
      .filter((v, i, arr) => arr.findIndex((a) => a.id === v.id) === i)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    const choices = [target, ...distractors].sort(() => Math.random() - 0.5);
    return {
      mode: modes[idx % modes.length],
      target,
      choices
    };
  });

  activeQuiz = {
    questions,
    index: 0,
    streak: 0,
    earnedStars: 0,
    correctCount: 0,
    answered: false
  };

  renderQuizQuestion();
  quizModal.classList.remove('hidden');
}

function renderQuizQuestion(): void {
  if (!activeQuiz) return;
  const q = activeQuiz.questions[activeQuiz.index];
  activeQuiz.answered = false;

  quizCounterEl.textContent = `Frage ${activeQuiz.index + 1} / ${activeQuiz.questions.length}`;
  quizStreakEl.textContent = `🔥 Serie: ${activeQuiz.streak}`;
  quizScoreEl.textContent = `⭐ +${activeQuiz.earnedStars}`;

  const modeMeta = {
    listen: {
      badge: '🔊 Hör-Verstehen',
      prompt: 'Welches Wort hörst du?',
      speakText: q.target.en
    },
    de2en: {
      badge: '🇩🇪 → 🇬🇧 Übersetzen',
      prompt: `${q.target.emoji} ${q.target.de}`,
      speakText: null
    },
    en2de: {
      badge: '🇬🇧 → 🇩🇪 Bedeutung finden',
      prompt: `„${q.target.en}“`,
      speakText: q.target.en
    }
  }[q.mode];

  quizStageEl.innerHTML = `
    <div class="quiz-question-box">
      <div class="quiz-mode-label">${modeMeta.badge}</div>
      <div class="quiz-prompt-big">${modeMeta.prompt}</div>
      ${modeMeta.speakText ? `<button id="quiz-replay-audio" class="speak-btn">🔊 Nochmal anhören</button>` : ''}
    </div>
    <div id="quiz-options" class="quiz-options-grid"></div>
    <div id="quiz-feedback" class="mission-feedback hidden"></div>
  `;

  if (modeMeta.speakText) {
    document.getElementById('quiz-replay-audio')?.addEventListener('click', () => {
      sound.speakEnglish(modeMeta.speakText!);
    });
    sound.speakEnglish(modeMeta.speakText);
  }

  const optGrid = document.getElementById('quiz-options') as HTMLElement;
  const fbEl = document.getElementById('quiz-feedback') as HTMLElement;

  q.choices.forEach((choice) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-opt-btn';
    btn.innerHTML =
      q.mode === 'de2en'
        ? `<span>🇬🇧</span><span>${choice.en}</span>`
        : `<span>${choice.emoji}</span><span>${choice.de}</span>`;

    btn.addEventListener('click', () => {
      if (!activeQuiz || activeQuiz.answered) return;
      activeQuiz.answered = true;
      const isRight = choice.id === q.target.id;

      if (isRight) {
        btn.classList.add('correct');
        sound.playSuccess();
        sound.speakEnglish(q.target.en);
        activeQuiz.streak += 1;
        activeQuiz.correctCount += 1;
        const bonus = activeQuiz.streak >= 3 ? 2 : 1;
        activeQuiz.earnedStars += bonus;
        state.stars += bonus;
        if (activeQuiz.streak > state.bestQuizStreak) {
          state.bestQuizStreak = activeQuiz.streak;
        }
        updateHud();
        fbEl.className = 'mission-feedback ok';
        fbEl.innerHTML = `<span>✅ Richtig! <strong>${q.target.en}</strong> = ${q.target.de}</span>`;
      } else {
        btn.classList.add('wrong');
        sound.playError();
        activeQuiz.streak = 0;
        fbEl.className = 'mission-feedback err';
        fbEl.innerHTML = `<span>💡 Gesucht war <strong>${q.target.en}</strong> (${q.target.de}).</span>`;
      }

      quizStreakEl.textContent = `🔥 Serie: ${activeQuiz.streak}`;
      quizScoreEl.textContent = `⭐ +${activeQuiz.earnedStars}`;

      const nextBtn = document.createElement('button');
      nextBtn.className = 'primary-btn small';
      const isLast = activeQuiz.index >= activeQuiz.questions.length - 1;
      nextBtn.textContent = isLast ? 'Ergebnis →' : 'Weiter →';
      nextBtn.addEventListener('click', () => {
        if (!activeQuiz) return;
        sound.playClick();
        if (isLast) {
          renderQuizSummary();
        } else {
          activeQuiz.index++;
          renderQuizQuestion();
        }
      });
      fbEl.appendChild(nextBtn);
    });

    optGrid.appendChild(btn);
  });
}

function renderQuizSummary(): void {
  if (!activeQuiz) return;
  const { correctCount, questions, earnedStars } = activeQuiz;
  const pct = Math.round((correctCount / questions.length) * 100);
  if (pct >= 70) {
    sound.playStamp();
    diorama.burstConfetti();
  }
  quizStageEl.innerHTML = `
    <div class="quiz-summary">
      <div class="quiz-summary-emoji">${pct >= 80 ? '🏆' : pct >= 50 ? '🎉' : '💪'}</div>
      <h3>${correctCount} von ${questions.length} richtig (${pct}%)!</h3>
      <p>Du hast <strong>+${earnedStars} Sterne ⭐</strong> gesammelt. Beste Serie bisher: <strong>🔥 ${state.bestQuizStreak}</strong>.</p>
      <div class="mission-actions-row" style="justify-content:center">
        <button id="btn-quiz-again" class="primary-btn small">Neue Runde spielen 🔁</button>
        <button id="btn-quiz-done" class="ghost-btn">Zurück zur 3D-Welt</button>
      </div>
    </div>
  `;
  document.getElementById('btn-quiz-again')?.addEventListener('click', () => startQuiz());
  document.getElementById('btn-quiz-done')?.addEventListener('click', () => {
    quizModal.classList.add('hidden');
  });
}

// ==============================================================================
// MODALS (WÖRTERBUCH & REISEPASS)
// ==============================================================================

function openVocabNotebook(): void {
  sound.playClick();
  vocabListEl.innerHTML = '';
  STATIONS.forEach((st) => {
    st.items.forEach((item) => {
      const unlocked = state.discoveredIds.has(item.id);
      const card = document.createElement('div');
      card.className = `vocab-entry ${unlocked ? '' : 'locked'}`;
      card.innerHTML = `
        <div class="vocab-entry-top">
          <span class="vocab-entry-emoji">${unlocked ? item.emoji : '🔒'}</span>
          ${unlocked ? `<button class="speak-btn small">🔊</button>` : ''}
        </div>
        <div class="vocab-entry-en">${unlocked ? item.en : '???'}</div>
        <div class="vocab-entry-de">${unlocked ? item.de : 'Noch nicht entdeckt'}</div>
        <div class="vocab-entry-station">${st.icon} ${st.nameDe}</div>
      `;
      if (unlocked) {
        card.querySelector('button')?.addEventListener('click', () => {
          sound.speakEnglish(item.en);
        });
      }
      vocabListEl.appendChild(card);
    });
  });
  vocabModal.classList.remove('hidden');
}

function openPassportModal(): void {
  sound.playClick();
  passportStampsEl.innerHTML = '';
  STATIONS.forEach((st) => {
    const earned = state.completedStations.has(st.id);
    const slot = document.createElement('div');
    slot.className = `passport-slot ${earned ? 'earned' : ''}`;
    slot.style.setProperty('--slot-color', st.stampColor);
    slot.innerHTML = `
      <div class="stamp-ring">${earned ? st.icon : '?'}</div>
      <div class="stamp-title">${st.nameEn}</div>
      <div class="stamp-code">${earned ? st.stampLabel : 'NOCH OFFEN'}</div>
    `;
    passportStampsEl.appendChild(slot);
  });
  passportCelebration.classList.toggle('hidden', state.completedStations.size < STATIONS.length);
  bestStreakLabel.textContent = `🔥 Beste Quiz-Serie: ${state.bestQuizStreak}`;
  passportModal.classList.remove('hidden');
}

// Wire Diorama Callbacks
diorama.onItemClick = (item) => handleItemClick(item);
diorama.onGuideClick = () => handleGuideClick();
diorama.onGuideHover = (hovering, x, y) => {
  if (!hovering) return;
  hoverTooltip.textContent = '🦉 Barnaby — Klick für einen Tipp!';
  hoverTooltip.style.left = `${x}px`;
  hoverTooltip.style.top = `${y}px`;
  hoverTooltip.classList.remove('hidden');
};
diorama.onItemHover = (item, x, y) => {
  if (!item) {
    hoverTooltip.classList.add('hidden');
    return;
  }
  const found = state.discoveredIds.has(item.id);
  hoverTooltip.textContent = found ? `${item.emoji} ${item.en} (${item.de})` : `${item.emoji} Klick zum Entdecken!`;
  hoverTooltip.style.left = `${x}px`;
  hoverTooltip.style.top = `${y}px`;
  hoverTooltip.classList.remove('hidden');
};

// Wire UI Buttons
btnStartMission.addEventListener('click', () => startMission());
btnResetCam.addEventListener('click', () => {
  sound.playClick();
  diorama.resetCamera();
});
vocabCardClose.addEventListener('click', () => {
  vocabCard.classList.add('hidden');
  diorama.resetCamera();
});
vocabSpeakWord.addEventListener('click', () => {
  if (activeVocabItem) sound.speakEnglish(activeVocabItem.en);
});
vocabSpeakSentence.addEventListener('click', () => {
  if (activeVocabItem) sound.speakEnglish(activeVocabItem.exampleEn, 0.88);
});
missionClose.addEventListener('click', () => {
  state.missionActive = false;
  missionPanel.classList.add('hidden');
});
owlClose.addEventListener('click', () => owlToast.classList.add('hidden'));
btnQuiz.addEventListener('click', () => startQuiz());
closeQuizModal.addEventListener('click', () => quizModal.classList.add('hidden'));
btnVocab.addEventListener('click', () => openVocabNotebook());
closeVocabModal.addEventListener('click', () => vocabModal.classList.add('hidden'));
btnPassport.addEventListener('click', () => openPassportModal());
closePassportModal.addEventListener('click', () => passportModal.classList.add('hidden'));

btnTime.addEventListener('click', () => {
  sound.playClick();
  const order: TimeOfDay[] = ['day', 'sunset', 'night'];
  const next = order[(order.indexOf(state.timeOfDay) + 1) % order.length];
  state.timeOfDay = next;
  diorama.setTimeOfDay(next);
  updateHud();
});

btnMute.addEventListener('click', () => {
  sound.muted = !sound.muted;
  btnMute.textContent = sound.muted ? '🔇' : '🔊';
});

btnBeginJourney.addEventListener('click', () => {
  sound.playDiscover();
  welcomeModal.classList.add('hidden');
});

btnResetProgress.addEventListener('click', () => {
  if (!window.confirm('Möchtest du deinen gespeicherten Fortschritt (Sterne, Wörter & Stempel) wirklich zurücksetzen?')) {
    return;
  }
  state.stars = 0;
  state.discoveredIds.clear();
  state.completedStations.clear();
  state.bestQuizStreak = 0;
  localStorage.removeItem(STORAGE_KEY);
  passportModal.classList.add('hidden');
  diorama.loadStation(currentStation(), state.discoveredIds);
  updateHud();
});

toastNextBtn.addEventListener('click', () => {
  sound.playClick();
  stampToast.classList.add('hidden');
  if (state.stationIndex < STATIONS.length - 1) {
    switchStation(state.stationIndex + 1);
  } else {
    openPassportModal();
  }
});

// Close modals on backdrop click
[vocabModal, passportModal, quizModal].forEach((modal) => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.add('hidden');
  });
});

// Boot Application
async function boot(): Promise<void> {
  await diorama.preloadAllModels((loaded, total, label) => {
    const pct = Math.round((loaded / total) * 100);
    loadingBarFill.style.width = `${pct}%`;
    loadingStatus.textContent = `Lade Sand3D-Modell (${loaded}/${total}): ${label}…`;
  });

  diorama.setTimeOfDay(state.timeOfDay);
  diorama.loadStation(currentStation(), state.discoveredIds);
  updateHud();

  loadingOverlay.classList.add('fade-out');
  setTimeout(() => {
    loadingOverlay.classList.add('hidden');
    if (state.discoveredIds.size === 0 && state.completedStations.size === 0) {
      welcomeModal.classList.remove('hidden');
    }
  }, 420);
}

boot();
