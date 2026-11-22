import './styles.css';
import { STATIONS, StationData, VocabItem, StationTask } from './data/stations';
import { DioramaManager } from './scene/DioramaManager';
import { sound } from './audio';

interface GameState {
  stationIndex: number;
  stars: number;
  discoveredIds: Set<string>;
  completedStations: Set<string>;
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
  missionActive: false,
  taskIndex: 0,
  taskSolved: false,
  sentenceSelection: []
};

// DOM References
const canvas = document.getElementById('scene-canvas') as HTMLCanvasElement;
const hoverTooltip = document.getElementById('hover-tooltip') as HTMLDivElement;
const stationTabsEl = document.getElementById('station-tabs') as HTMLElement;
const starsCountEl = document.getElementById('stars-count') as HTMLElement;
const vocabBadgeEl = document.getElementById('vocab-badge') as HTMLElement;
const stampBadgeEl = document.getElementById('stamp-badge') as HTMLElement;
const btnMute = document.getElementById('btn-mute') as HTMLButtonElement;

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
const btnPassport = document.getElementById('btn-passport') as HTMLButtonElement;
const closePassportModal = document.getElementById('close-passport-modal') as HTMLButtonElement;

const stampToast = document.getElementById('stamp-toast') as HTMLElement;
const toastStampIcon = document.getElementById('toast-stamp-icon') as HTMLElement;
const toastStampTitle = document.getElementById('toast-stamp-title') as HTMLElement;
const toastStampSub = document.getElementById('toast-stamp-sub') as HTMLElement;
const toastNextBtn = document.getElementById('toast-next-btn') as HTMLButtonElement;

let activeVocabItem: VocabItem | null = null;
const diorama = new DioramaManager(canvas);

function currentStation(): StationData {
  return STATIONS[state.stationIndex];
}

function totalVocabCount(): number {
  return STATIONS.reduce((sum, s) => sum + s.items.length, 0);
}

function updateHud(): void {
  starsCountEl.textContent = String(state.stars);
  vocabBadgeEl.textContent = `${state.discoveredIds.size}/${totalVocabCount()}`;
  stampBadgeEl.textContent = `${state.completedStations.size}/${STATIONS.length}`;
  renderStationTabs();
  renderStationBanner();
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

function switchStation(idx: number): void {
  state.stationIndex = idx;
  state.missionActive = false;
  state.taskIndex = 0;
  state.taskSolved = false;
  missionPanel.classList.add('hidden');
  vocabCard.classList.add('hidden');
  stampToast.classList.add('hidden');

  diorama.loadStation(currentStation(), state.discoveredIds);
  updateHud();
}

function openVocabCard(item: VocabItem, isNew: boolean): void {
  activeVocabItem = item;
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
    sound.playDiscover();
    updateHud();
  } else {
    sound.playClick();
  }

  diorama.focusOnItem(item.id);
  openVocabCard(item, isNew);
}

// Mission Flow
function startMission(): void {
  sound.playClick();
  vocabCard.classList.add('hidden');
  stampToast.classList.add('hidden');
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
  updateHud();

  toastStampIcon.textContent = st.icon;
  toastStampTitle.textContent = `Stempel erhalten: ${st.nameEn}!`;
  const hasNext = state.stationIndex < STATIONS.length - 1;
  toastStampSub.textContent = hasNext
    ? `Auf geht’s zur nächsten Station: ${STATIONS[state.stationIndex + 1].nameDe}!`
    : 'Du hast alle Stationen abgeschlossen — schau in deinen Reisepass!';
  toastNextBtn.textContent = hasNext ? 'Nächste Station →' : 'Reisepass öffnen 🛂';
  stampToast.classList.remove('hidden');
}

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
  passportModal.classList.remove('hidden');
}

// Wire Diorama Callbacks
diorama.onItemClick = (item) => handleItemClick(item);
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
btnVocab.addEventListener('click', () => openVocabNotebook());
closeVocabModal.addEventListener('click', () => vocabModal.classList.add('hidden'));
btnPassport.addEventListener('click', () => openPassportModal());
closePassportModal.addEventListener('click', () => passportModal.classList.add('hidden'));
btnMute.addEventListener('click', () => {
  sound.muted = !sound.muted;
  btnMute.textContent = sound.muted ? '🔇' : '🔊';
});
btnBeginJourney.addEventListener('click', () => {
  sound.playDiscover();
  welcomeModal.classList.add('hidden');
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
[vocabModal, passportModal].forEach((modal) => {
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

  diorama.loadStation(currentStation(), state.discoveredIds);
  updateHud();

  loadingOverlay.classList.add('fade-out');
  setTimeout(() => {
    loadingOverlay.classList.add('hidden');
    welcomeModal.classList.remove('hidden');
  }, 420);
}

boot();
