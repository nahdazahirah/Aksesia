/**
 * GREENSTEPS - PROTOTIPE REFERENSI UI/UX
 * Logika Interaksi, Navigasi 5 Layar, Preferensi Aksesibilitas,
 * Misi Adaptif, Boss Raid, dan Kartu Cerita
 */

(function () {
  'use strict';

  // ==========================================
  // STATE APLIKASI (Disimpan di localStorage)
  // ==========================================
  const STORAGE_KEY = 'greensteps_state_v1';

  const defaultState = {
    // Profil & Squad
    userName: 'Rian',
    squadName: 'Kosan Barokah Asri',
    squadCode: 'KOS-BAROKAH-24',
    squadEnvironment: 'kos',
    squadMembers: [
      { id: 'm1', name: 'Rian (Kamu)', avatar: '🧑‍🌾', done: true, role: 'Tumbler Warrior', action: 'Bawa Tumbler Sendiri' },
      { id: 'm2', name: 'Fajar', avatar: '⚡', done: true, role: 'Trash Hunter', action: 'Sortir Meja Kosan' },
      { id: 'm3', name: 'Dita', avatar: '🌻', done: true, role: 'Zero Waste', action: 'Tolak Sedotan Es Teh' },
      { id: 'm4', name: 'Bima', avatar: '🚲', done: true, role: 'Eco Patrol', action: 'Amankan Gelas Boba' },
      { id: 'm5', name: 'Siti', avatar: '✨', done: true, role: 'Energy Saver', action: 'Cabut Colokan Kamar' },
      { id: 'm6', name: 'Agus', avatar: '🧤', done: false, role: 'Pending Mabar', action: 'Belum ada misi hari ini' }
    ],

    // Boss Raid State
    bossMaxHp: 1000,
    bossCurrentHp: 380,
    bossDefeated: false,

    // Misi Adaptif
    adaptiveVariantSelected: 'A',
    adaptiveCompleted: false,

    // Misi Harian Rutin (id -> boolean)
    missionsDone: {
      1: true,   // Bawa Tumbler
      2: false,  // Tolak Sedotan
      3: false   // Cabut Colokan
    },

    // Item Sampah Sekitar (id -> boolean)
    itemsCaptured: {
      1: false, // Gelas Boba
      2: false, // Kardus Paket
      3: false  // Kresek Mini
    },

    // Statistik Dampak Nyata
    impact: {
      bottlesSaved: 5,
      plasticBagsAvoided: 3,
      co2GramsPrevented: 250,
      streakDays: 7,
      totalMissionsDone: 14
    },

    // Tema Story Card
    storyTheme: 'theme-story-green',

    // Preferensi Aksesibilitas
    a11y: {
      fontScale: 1.0,          // 1.0, 1.25, 1.5
      highContrast: false,
      colorblindMode: false,
      focusMode: false,
      reducedMotion: false,
      spaciousTouch: false,
      ttsAuto: false,
      hapticVisual: true
    }
  };

  let state = loadState();

  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return Object.assign({}, defaultState, JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Gagal membaca localStorage, gunakan state default', e);
    }
    return JSON.parse(JSON.stringify(defaultState));
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Gagal menyimpan ke localStorage', e);
    }
  }

  // ==========================================
  // ELEMEN DOM UTAMA
  // ==========================================
  const DOM = {
    announcer: document.getElementById('a11y-announcer'),
    visualToast: document.getElementById('visual-toast'),
    screens: document.querySelectorAll('.screen'),
    navItems: document.querySelectorAll('.bottom-nav-bar .nav-item'),
    protoBtns: document.querySelectorAll('.proto-screen-btn'),
    headerSquadName: document.getElementById('header-squad-name'),
    btnOpenA11y: document.getElementById('btn-open-a11y'),
    btnCloseA11y: document.getElementById('btn-close-a11y'),
    modalA11y: document.getElementById('modal-a11y-settings'),
    btnSpeakScreen: document.getElementById('btn-speak-screen'),

    // Onboarding Elements
    obLargerText: document.getElementById('ob-larger-text'),
    obHighContrast: document.getElementById('ob-high-contrast'),
    obColorblind: document.getElementById('ob-colorblind'),
    obFocusMode: document.getElementById('ob-focus-mode'),
    obReducedMotion: document.getElementById('ob-reduced-motion'),
    obLargeTouch: document.getElementById('ob-large-touch'),
    tabJoinSquad: document.getElementById('tab-join-squad'),
    tabCreateSquad: document.getElementById('tab-create-squad'),
    panelJoinSquad: document.getElementById('panel-join-squad'),
    panelCreateSquad: document.getElementById('panel-create-squad'),
    inputSquadCode: document.getElementById('input-squad-code'),
    btnPasteCode: document.getElementById('btn-paste-code'),
    inputNewSquadName: document.getElementById('input-new-squad-name'),
    inputSquadEnv: document.getElementById('input-squad-env'),
    btnSubmitOnboarding: document.getElementById('btn-submit-onboarding'),
    btnSkipOnboarding: document.getElementById('btn-skip-onboarding'),

    // Beranda Elements
    squadCompletionPill: document.getElementById('squad-completion-pill'),
    squadRatioText: document.getElementById('squad-ratio-text'),
    squadProgressFill: document.getElementById('squad-progress-fill'),
    squadProgressPct: document.getElementById('squad-progress-pct'),
    squadMemberList: document.getElementById('squad-member-list'),
    btnNudgeMember: document.getElementById('btn-nudge-member'),
    homeBossHpText: document.getElementById('home-boss-hp-text'),
    homeBossHpFill: document.getElementById('home-boss-hp-fill'),

    // Misi Elements
    bossEmojiState: document.getElementById('boss-emoji-state'),
    battleBossHpText: document.getElementById('battle-boss-hp-text'),
    battleBossHpFill: document.getElementById('battle-boss-hp-fill'),
    btnCompleteAdaptive: document.getElementById('btn-complete-adaptive'),
    adaptiveSuccessMsg: document.getElementById('adaptive-success-msg'),
    btnPlayVariantAudio: document.getElementById('btn-play-variant-audio'),
    dailyItemsList: document.getElementById('daily-items-list'),

    // Story Elements
    storyCardPreview: document.getElementById('story-card-preview'),
    storyHeadlineText: document.getElementById('story-headline-text'),
    storyStatBottles: document.getElementById('story-stat-bottles'),
    storyStatDamage: document.getElementById('story-stat-damage'),
    themeSwatches: document.querySelectorAll('.btn-theme-swatch'),
    btnShareInstagram: document.getElementById('btn-share-instagram'),
    btnCopyStoryText: document.getElementById('btn-copy-story-text'),
    btnDownloadStoryMock: document.getElementById('btn-download-story-mock'),
    shareFeedback: document.getElementById('share-feedback'),

    // Dampak Elements
    tabImpactPersonal: document.getElementById('tab-impact-personal'),
    tabImpactSquad: document.getElementById('tab-impact-squad'),
    panelImpactPersonal: document.getElementById('panel-impact-personal'),
    panelImpactSquad: document.getElementById('panel-impact-squad'),

    // Modal A11y Elements
    btnFontNormal: document.getElementById('btn-font-normal'),
    btnFontLarge: document.getElementById('btn-font-large'),
    btnFontXlarge: document.getElementById('btn-font-xlarge'),
    toggleHighContrast: document.getElementById('toggle-high-contrast'),
    toggleColorblind: document.getElementById('toggle-colorblind'),
    toggleLargeTouch: document.getElementById('toggle-large-touch'),
    toggleFocusMode: document.getElementById('toggle-focus-mode'),
    toggleReducedMotion: document.getElementById('toggle-reduced-motion'),
    toggleTtsAuto: document.getElementById('toggle-tts-auto'),
    toggleHapticVisual: document.getElementById('toggle-haptic-visual'),
    btnResetA11y: document.getElementById('btn-reset-a11y'),
    btnSaveA11y: document.getElementById('btn-save-a11y')
  };

  // ==========================================
  // SISTEM PENGUMUMAN AKSESIBILITAS & MULTI-SALURAN
  // ==========================================

  /**
   * Mengumumkan teks untuk Screen Reader (aria-live)
   */
  function announce(text) {
    if (DOM.announcer) {
      DOM.announcer.textContent = '';
      setTimeout(() => {
        DOM.announcer.textContent = text;
      }, 50);
    }
  }

  /**
   * Menampilkan toast visual + getaran (haptic feedback) untuk rungu/tuli
   */
  function notifyMultiChannel(message, duration = 3000) {
    // 1. Getar haptic bila didukung
    if (state.a11y.hapticVisual && 'vibrate' in navigator) {
      try {
        navigator.vibrate([60, 40, 60]);
      } catch (e) {
        // Abaikan jika tidak diizinkan browser
      }
    }

    // 2. Banner toast visual
    if (DOM.visualToast) {
      DOM.visualToast.textContent = message;
      DOM.visualToast.classList.add('show');
      DOM.visualToast.setAttribute('aria-hidden', 'false');

      setTimeout(() => {
        DOM.visualToast.classList.remove('show');
        DOM.visualToast.setAttribute('aria-hidden', 'true');
      }, duration);
    }

    // 3. Screen reader announcement
    announce(message);
  }

  /**
   * Web Speech Text-to-Speech (TTS)
   */
  function speakText(text) {
    if (!('speechSynthesis' in window)) {
      notifyMultiChannel('Perangkat tidak mendukung suara Web Speech API.');
      return;
    }

    window.speechSynthesis.cancel(); // Hentikan yang sedang berjalan
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  }

  // ==========================================
  // MANAJEMEN NAVIGASI 5 LAYAR
  // ==========================================
  let currentScreenId = 'screen-onboarding';

  function navigateTo(targetScreenId) {
    const target = document.getElementById(targetScreenId);
    if (!target) return;

    currentScreenId = targetScreenId;

    // Sembunyikan semua layar
    DOM.screens.forEach(s => {
      s.classList.remove('active');
      s.hidden = true;
      s.setAttribute('aria-hidden', 'true');
    });

    // Tampilkan layar target
    target.classList.remove('active');
    void target.offsetWidth; // Trigger reflow untuk animasi
    target.classList.add('active');
    target.hidden = false;
    target.removeAttribute('aria-hidden');

    // Update bottom navigation bar
    DOM.navItems.forEach(item => {
      const isCurrent = item.getAttribute('data-screen') === targetScreenId;
      item.classList.toggle('active', isCurrent);
      if (isCurrent) {
        item.setAttribute('aria-current', 'page');
      } else {
        item.removeAttribute('aria-current');
      }
    });

    // Update proto top buttons
    DOM.protoBtns.forEach(btn => {
      const isCurrent = btn.getAttribute('data-target') === targetScreenId;
      btn.style.backgroundColor = isCurrent ? '#52b788' : '';
      btn.style.color = isCurrent ? '#14281d' : '';
      btn.style.fontWeight = isCurrent ? '800' : '';
    });

    // Scroll ke atas
    const main = document.getElementById('app-main-content');
    if (main) main.scrollTop = 0;

    // Dapatkan judul layar untuk screen reader
    const titleEl = target.querySelector('h1, h2');
    const screenTitle = titleEl ? titleEl.textContent : targetScreenId;
    announce(`Beralih ke ${screenTitle}`);

    // Jika TTS Auto aktif, bacakan ringkasan layar
    if (state.a11y.ttsAuto) {
      setTimeout(() => {
        speakScreenSummary(targetScreenId);
      }, 400);
    }
  }

  function speakScreenSummary(screenId) {
    let summary = '';
    switch (screenId) {
      case 'screen-onboarding':
        summary = 'Layar Onboarding GreenSteps. Atur preferensi aksesibilitas dan gabung squad kosan.';
        break;
      case 'screen-home':
        summary = `Beranda GreenSteps. Lima dari enam anggota ${state.squadName} sudah menyelesaikan misi hari ini. Tujuh puluh dua persen anak kos di sekitarmu pakai tumbler hari ini.`;
        break;
      case 'screen-missions':
        summary = `Layar Misi dan Boss Raid. Darah Boss Raksasa Kresek tersisa ${state.bossCurrentHp} HP. Tersedia misi adaptif inklusif dengan nilai setara.`;
        break;
      case 'screen-share':
        summary = `Layar Kartu Pencapaian. Hari ini kamu menyelamatkan ${state.impact.bottlesSaved} botol plastik dan mempertahankan 7 hari streak mabar. Siap dibagikan ke media sosial.`;
        break;
      case 'screen-impact':
        summary = `Layar Laporan Dampak Nyata. Kamu telah menyelamatkan ${state.impact.bottlesSaved} botol plastik dan mencegah ${state.impact.co2GramsPrevented} gram karbon dioksida.`;
        break;
      default:
        summary = 'Aplikasi GreenSteps aksi hijau bersama.';
    }
    speakText(summary);
  }

  // ==========================================
  // SISTEM PREFERENSI AKSESIBILITAS TERAPKAN LANGSUNG
  // ==========================================
  function applyAccessibilitySettings() {
    const { fontScale, highContrast, colorblindMode, focusMode, reducedMotion, spaciousTouch } = state.a11y;

    // 1. Skala Font
    document.documentElement.style.setProperty('--font-scale', fontScale);

    // Update active state tombol skala font di modal
    if (DOM.btnFontNormal && DOM.btnFontLarge && DOM.btnFontXlarge) {
      DOM.btnFontNormal.classList.toggle('active', fontScale === 1.0);
      DOM.btnFontLarge.classList.toggle('active', fontScale === 1.25);
      DOM.btnFontXlarge.classList.toggle('active', fontScale === 1.5);
    }

    // 2. High Contrast
    document.body.classList.toggle('high-contrast-mode', !!highContrast);
    if (DOM.toggleHighContrast) DOM.toggleHighContrast.checked = !!highContrast;
    if (DOM.obHighContrast) DOM.obHighContrast.checked = !!highContrast;

    // 3. Colorblind Safe Mode
    document.body.classList.toggle('colorblind-mode', !!colorblindMode);
    if (DOM.toggleColorblind) DOM.toggleColorblind.checked = !!colorblindMode;
    if (DOM.obColorblind) DOM.obColorblind.checked = !!colorblindMode;

    // 4. Focus Mode (ADHD / Cognitive)
    document.body.classList.toggle('focus-mode', !!focusMode);
    if (DOM.toggleFocusMode) DOM.toggleFocusMode.checked = !!focusMode;
    if (DOM.obFocusMode) DOM.obFocusMode.checked = !!focusMode;

    // 5. Reduced Motion
    document.body.classList.toggle('reduced-motion-mode', !!reducedMotion);
    if (DOM.toggleReducedMotion) DOM.toggleReducedMotion.checked = !!reducedMotion;
    if (DOM.obReducedMotion) DOM.obReducedMotion.checked = !!reducedMotion;

    // 6. Spacious Touch (Motorik)
    document.body.classList.toggle('spacious-touch-mode', !!spaciousTouch);
    if (DOM.toggleLargeTouch) DOM.toggleLargeTouch.checked = !!spaciousTouch;
    if (DOM.obLargeTouch) DOM.obLargeTouch.checked = !!spaciousTouch;

    // 7. Checkbox teks lebih besar di onboarding
    if (DOM.obLargerText) DOM.obLargerText.checked = fontScale > 1.0;

    // 8. Toggles lainnya
    if (DOM.toggleTtsAuto) DOM.toggleTtsAuto.checked = !!state.a11y.ttsAuto;
    if (DOM.toggleHapticVisual) DOM.toggleHapticVisual.checked = !!state.a11y.hapticVisual;

    saveState();
  }

  // ==========================================
  // RENDER BERANDA & SQUAD
  // ==========================================
  function renderSquadAndHome() {
    if (DOM.headerSquadName) {
      DOM.headerSquadName.textContent = state.squadName;
    }

    // Hitung berapa yang sudah selesai
    const totalMembers = state.squadMembers.length;
    const doneMembers = state.squadMembers.filter(m => m.done).length;
    const pct = Math.round((doneMembers / totalMembers) * 100);

    if (DOM.squadRatioText) {
      DOM.squadRatioText.textContent = `${doneMembers} dari ${totalMembers} Selesai`;
    }
    if (DOM.squadProgressFill) {
      DOM.squadProgressFill.style.width = `${pct}%`;
    }
    if (DOM.squadProgressPct) {
      DOM.squadProgressPct.textContent = `${pct}%`;
    }

    // Render Squad Roster
    if (DOM.squadMemberList) {
      DOM.squadMemberList.innerHTML = '';
      state.squadMembers.forEach(m => {
        const li = document.createElement('li');
        li.className = 'roster-item';

        li.innerHTML = `
          <div class="roster-user-info">
            <span class="roster-avatar" aria-hidden="true">${m.avatar}</span>
            <div>
              <strong>${m.name}</strong>
              <small class="roster-role" style="display:block; font-size:11px; opacity:0.8;">${m.action}</small>
            </div>
          </div>
          <span class="roster-status ${m.done ? 'done' : 'pending'}" aria-label="${m.done ? 'Sudah selesai' : 'Belum selesai'}">
            ${m.done ? '✅ Selesai' : '⏳ Belum'}
          </span>
        `;
        DOM.squadMemberList.appendChild(li);
      });
    }

    // Boss Mini HP di Home
    const bossPct = Math.max(0, Math.round((state.bossCurrentHp / state.bossMaxHp) * 100));
    if (DOM.homeBossHpText) {
      DOM.homeBossHpText.textContent = `${state.bossCurrentHp} / ${state.bossMaxHp} HP`;
    }
    if (DOM.homeBossHpFill) {
      DOM.homeBossHpFill.style.width = `${bossPct}%`;
    }

    // Battle Boss HP di Misi
    if (DOM.battleBossHpText) {
      DOM.battleBossHpText.textContent = `${state.bossCurrentHp} / ${state.bossMaxHp} HP`;
    }
    if (DOM.battleBossHpFill) {
      DOM.battleBossHpFill.style.width = `${bossPct}%`;
    }

    // Boss Emoji State
    if (DOM.bossEmojiState) {
      if (state.bossCurrentHp <= 0) {
        DOM.bossEmojiState.textContent = '💀';
      } else if (state.bossCurrentHp < 300) {
        DOM.bossEmojiState.textContent = '🤕';
      } else {
        DOM.bossEmojiState.textContent = '👾';
      }
    }
  }

  // ==========================================
  // RENDER MISI HARIAN & ITEM HARIAN
  // ==========================================
  function renderMissionsAndItems() {
    // 1. Misi Rutin
    [1, 2, 3].forEach(id => {
      const card = document.getElementById(`card-mission-${id}`);
      if (!card) return;
      const btn = card.querySelector('.btn-action-mission');
      const isDone = !!state.missionsDone[id];

      if (isDone) {
        card.style.opacity = '0.75';
        if (btn) {
          btn.innerHTML = '<span>Tuntas ✅</span>';
          btn.disabled = true;
          btn.style.backgroundColor = 'var(--c-success-soft)';
          btn.style.color = 'var(--c-success)';
          btn.style.borderColor = 'var(--c-accent-mint)';
        }
      } else {
        card.style.opacity = '1';
        if (btn) {
          btn.innerHTML = '<span>Tandai Selesai ✅</span>';
          btn.disabled = false;
        }
      }
    });

    // 2. Misi Adaptif
    if (state.adaptiveCompleted) {
      if (DOM.btnCompleteAdaptive) {
        DOM.btnCompleteAdaptive.disabled = true;
        DOM.btnCompleteAdaptive.innerHTML = '<span>Misi Adaptif Sudah Tuntas! ⭐</span>';
        DOM.btnCompleteAdaptive.style.backgroundColor = 'var(--c-accent-mint)';
      }
      if (DOM.adaptiveSuccessMsg) {
        DOM.adaptiveSuccessMsg.hidden = false;
      }
    } else {
      if (DOM.btnCompleteAdaptive) {
        DOM.btnCompleteAdaptive.disabled = false;
        DOM.btnCompleteAdaptive.innerHTML = '<span>Selesaikan Varian Terpilih & Serang Boss! 💥</span>';
      }
      if (DOM.adaptiveSuccessMsg) {
        DOM.adaptiveSuccessMsg.hidden = true;
      }
    }

    // 3. Item Harian (Monster Sampah Sekitar)
    [1, 2, 3].forEach(id => {
      const itemCard = document.getElementById(`item-trash-${id}`);
      if (!itemCard) return;
      const isCap = !!state.itemsCaptured[id];
      const btn = itemCard.querySelector('.btn-capture-item');

      if (isCap) {
        itemCard.classList.add('completed');
        if (btn) {
          btn.textContent = 'Terselamatkan! 🎉';
          btn.disabled = true;
          btn.style.backgroundColor = 'var(--c-success)';
        }
      } else {
        itemCard.classList.remove('completed');
        if (btn) btn.disabled = false;
      }
    });
  }

  // ==========================================
  // RENDER KARTU HASIL & DAMPAK NYATA
  // ==========================================
  function renderStoryAndImpact() {
    // 1. Story Card
    if (DOM.storyStatBottles) {
      DOM.storyStatBottles.textContent = `${state.impact.bottlesSaved} Botol`;
    }
    if (DOM.storyStatDamage) {
      DOM.storyStatDamage.textContent = `-${1000 - state.bossCurrentHp} HP`;
    }
    if (DOM.storyHeadlineText) {
      DOM.storyHeadlineText.textContent = `"Hari ini aku menyelamatkan ${state.impact.bottlesSaved} botol plastik & ${state.impact.plasticBagsAvoided} kresek bareng squad!"`;
    }
    if (DOM.storyCardPreview) {
      DOM.storyCardPreview.className = `story-card ${state.storyTheme}`;
    }

    // Update active swatch
    DOM.themeSwatches.forEach(swatch => {
      const theme = swatch.getAttribute('data-theme');
      swatch.classList.toggle('active', theme === state.storyTheme);
    });
  }

  // ==========================================
  // AKSI MISI & KERUSAKAN BOSS (BOSS DAMAGE)
  // ==========================================
  function damageBoss(damageAmount, reasonText) {
    state.bossCurrentHp = Math.max(0, state.bossCurrentHp - damageAmount);
    if (state.bossCurrentHp <= 0) {
      state.bossDefeated = true;
      notifyMultiChannel(`🎉 LUAR BIASA! Boss Raksasa Kresek Kosan berhasil dikalahkan! Squad ${state.squadName} menang telak!`);
    } else {
      notifyMultiChannel(`💥 Serangan Sukses! Boss kena -${damageAmount} HP (${reasonText}). Sisa HP: ${state.bossCurrentHp}`);
    }

    saveState();
    renderSquadAndHome();
    renderStoryAndImpact();
  }

  // ==========================================
  // EVENT LISTENERS & INTERAKSI
  // ==========================================
  function initEventListeners() {

    // 1. Bottom Nav
    DOM.navItems.forEach(item => {
      item.addEventListener('click', () => {
        const targetScreen = item.getAttribute('data-screen');
        navigateTo(targetScreen);
      });
    });

    // 2. Prototype Bar Quick Screen Switch
    DOM.protoBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-target');
        navigateTo(target);
      });
    });

    // 3. Tombol-tombol jalan pintas di kartu (btn-goto-missions, dll)
    document.querySelectorAll('.btn-goto-missions').forEach(btn => {
      btn.addEventListener('click', () => {
        navigateTo('screen-missions');
      });
    });

    document.querySelectorAll('.btn-goto-share').forEach(btn => {
      btn.addEventListener('click', () => {
        navigateTo('screen-share');
      });
    });

    // 4. Modal Pengaturan Aksesibilitas Universal
    if (DOM.btnOpenA11y && DOM.modalA11y) {
      DOM.btnOpenA11y.addEventListener('click', () => {
        DOM.modalA11y.hidden = false;
        DOM.modalA11y.removeAttribute('hidden');
        announce('Membuka panel pengaturan aksesibilitas.');
        if (DOM.btnCloseA11y) DOM.btnCloseA11y.focus();
      });
    }

    if (DOM.btnCloseA11y && DOM.modalA11y) {
      DOM.btnCloseA11y.addEventListener('click', () => {
        DOM.modalA11y.hidden = true;
        DOM.modalA11y.setAttribute('hidden', 'true');
        announce('Panel pengaturan aksesibilitas ditutup.');
        if (DOM.btnOpenA11y) DOM.btnOpenA11y.focus();
      });
    }

    // Tutup modal dengan tombol Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && DOM.modalA11y && !DOM.modalA11y.hidden) {
        DOM.modalA11y.hidden = true;
        DOM.modalA11y.setAttribute('hidden', 'true');
        if (DOM.btnOpenA11y) DOM.btnOpenA11y.focus();
      }
    });

    // 5. Tombol Bacakan Layar Cepat di Header
    if (DOM.btnSpeakScreen) {
      DOM.btnSpeakScreen.addEventListener('click', () => {
        speakScreenSummary(currentScreenId);
      });
    }

    // 6. Skala Ukuran Font
    if (DOM.btnFontNormal) {
      DOM.btnFontNormal.addEventListener('click', () => {
        state.a11y.fontScale = 1.0;
        applyAccessibilitySettings();
        notifyMultiChannel('Ukuran teks diatur ke Normal (100%).');
      });
    }
    if (DOM.btnFontLarge) {
      DOM.btnFontLarge.addEventListener('click', () => {
        state.a11y.fontScale = 1.25;
        applyAccessibilitySettings();
        notifyMultiChannel('Ukuran teks diperbesar ke 125%.');
      });
    }
    if (DOM.btnFontXlarge) {
      DOM.btnFontXlarge.addEventListener('click', () => {
        state.a11y.fontScale = 1.5;
        applyAccessibilitySettings();
        notifyMultiChannel('Ukuran teks diperbesar maksimal ke 150%.');
      });
    }

    // 7. Toggle Toggles di Modal A11y
    if (DOM.toggleHighContrast) {
      DOM.toggleHighContrast.addEventListener('change', (e) => {
        state.a11y.highContrast = e.target.checked;
        applyAccessibilitySettings();
        notifyMultiChannel(state.a11y.highContrast ? 'Mode Kontras Tinggi diaktifkan.' : 'Mode Kontras Tinggi dinonaktifkan.');
      });
    }

    if (DOM.toggleColorblind) {
      DOM.toggleColorblind.addEventListener('change', (e) => {
        state.a11y.colorblindMode = e.target.checked;
        applyAccessibilitySettings();
        notifyMultiChannel(state.a11y.colorblindMode ? 'Mode Ramah Buta Warna diaktifkan.' : 'Mode Ramah Buta Warna dinonaktifkan.');
      });
    }

    if (DOM.toggleLargeTouch) {
      DOM.toggleLargeTouch.addEventListener('change', (e) => {
        state.a11y.spaciousTouch = e.target.checked;
        applyAccessibilitySettings();
        notifyMultiChannel(state.a11y.spaciousTouch ? 'Area Sentuh Ekstra Lega (56px) diaktifkan.' : 'Area Sentuh kembali normal.');
      });
    }

    if (DOM.toggleFocusMode) {
      DOM.toggleFocusMode.addEventListener('change', (e) => {
        state.a11y.focusMode = e.target.checked;
        applyAccessibilitySettings();
        notifyMultiChannel(state.a11y.focusMode ? 'Mode Fokus Kognitif diaktifkan.' : 'Mode Fokus dinonaktifkan.');
      });
    }

    if (DOM.toggleReducedMotion) {
      DOM.toggleReducedMotion.addEventListener('change', (e) => {
        state.a11y.reducedMotion = e.target.checked;
        applyAccessibilitySettings();
        notifyMultiChannel(state.a11y.reducedMotion ? 'Pengurangan Gerakan diaktifkan.' : 'Animasi normal diaktifkan.');
      });
    }

    if (DOM.toggleTtsAuto) {
      DOM.toggleTtsAuto.addEventListener('change', (e) => {
        state.a11y.ttsAuto = e.target.checked;
        saveState();
        notifyMultiChannel(state.a11y.ttsAuto ? 'Bacakan Layar Otomatis diaktifkan.' : 'Bacakan Layar Otomatis dimatikan.');
      });
    }

    if (DOM.toggleHapticVisual) {
      DOM.toggleHapticVisual.addEventListener('change', (e) => {
        state.a11y.hapticVisual = e.target.checked;
        saveState();
      });
    }

    if (DOM.btnResetA11y) {
      DOM.btnResetA11y.addEventListener('click', () => {
        state.a11y = JSON.parse(JSON.stringify(defaultState.a11y));
        applyAccessibilitySettings();
        notifyMultiChannel('Pengaturan aksesibilitas di-reset ke standar.');
      });
    }

    if (DOM.btnSaveA11y && DOM.modalA11y) {
      DOM.btnSaveA11y.addEventListener('click', () => {
        DOM.modalA11y.hidden = true;
        notifyMultiChannel('Pengaturan aksesibilitas berhasil disimpan.');
      });
    }

    // 8. Onboarding Checklist Sync
    if (DOM.obLargerText) {
      DOM.obLargerText.addEventListener('change', (e) => {
        state.a11y.fontScale = e.target.checked ? 1.25 : 1.0;
        applyAccessibilitySettings();
      });
    }
    if (DOM.obHighContrast) {
      DOM.obHighContrast.addEventListener('change', (e) => {
        state.a11y.highContrast = e.target.checked;
        applyAccessibilitySettings();
      });
    }
    if (DOM.obColorblind) {
      DOM.obColorblind.addEventListener('change', (e) => {
        state.a11y.colorblindMode = e.target.checked;
        applyAccessibilitySettings();
      });
    }
    if (DOM.obFocusMode) {
      DOM.obFocusMode.addEventListener('change', (e) => {
        state.a11y.focusMode = e.target.checked;
        applyAccessibilitySettings();
      });
    }
    if (DOM.obReducedMotion) {
      DOM.obReducedMotion.addEventListener('change', (e) => {
        state.a11y.reducedMotion = e.target.checked;
        applyAccessibilitySettings();
      });
    }
    if (DOM.obLargeTouch) {
      DOM.obLargeTouch.addEventListener('change', (e) => {
        state.a11y.spaciousTouch = e.target.checked;
        applyAccessibilitySettings();
      });
    }

    // 9. Onboarding Tab Squad Switch
    if (DOM.tabJoinSquad && DOM.tabCreateSquad) {
      DOM.tabJoinSquad.addEventListener('click', () => {
        DOM.tabJoinSquad.classList.add('active');
        DOM.tabJoinSquad.setAttribute('aria-selected', 'true');
        DOM.tabCreateSquad.classList.remove('active');
        DOM.tabCreateSquad.setAttribute('aria-selected', 'false');
        DOM.panelJoinSquad.hidden = false;
        DOM.panelCreateSquad.hidden = true;
      });

      DOM.tabCreateSquad.addEventListener('click', () => {
        DOM.tabCreateSquad.classList.add('active');
        DOM.tabCreateSquad.setAttribute('aria-selected', 'true');
        DOM.tabJoinSquad.classList.remove('active');
        DOM.tabJoinSquad.setAttribute('aria-selected', 'false');
        DOM.panelCreateSquad.hidden = false;
        DOM.panelJoinSquad.hidden = true;
      });
    }

    if (DOM.btnPasteCode) {
      DOM.btnPasteCode.addEventListener('click', () => {
        const val = (DOM.inputSquadCode.value || '').trim();
        if (val) {
          state.squadCode = val;
          notifyMultiChannel(`Kode squad diperbarui: ${val}`);
        }
      });
    }

    // Tombol Submit Onboarding
    if (DOM.btnSubmitOnboarding) {
      DOM.btnSubmitOnboarding.addEventListener('click', () => {
        // Cek jika membuat squad baru
        if (DOM.tabCreateSquad && DOM.tabCreateSquad.classList.contains('active')) {
          const newName = (DOM.inputNewSquadName.value || '').trim();
          if (newName) {
            state.squadName = newName;
          }
        }
        saveState();
        renderSquadAndHome();
        notifyMultiChannel(`Selamat datang di ${state.squadName}! Mabar dimulai! 🚀`);
        navigateTo('screen-home');
      });
    }

    if (DOM.btnSkipOnboarding) {
      DOM.btnSkipOnboarding.addEventListener('click', () => {
        navigateTo('screen-home');
      });
    }

    // 10. Interaksi Colek Anggota Squad di Beranda
    if (DOM.btnNudgeMember) {
      DOM.btnNudgeMember.addEventListener('click', () => {
        notifyMultiChannel('👋 Kamu mencolek santai Agus: "Yuk Gus, 5 menit mabar misi hijau bareng kita!"');
        DOM.btnNudgeMember.disabled = true;
        DOM.btnNudgeMember.innerHTML = '<span>TercColek Santai! ⏳</span>';

        // Simulasi respon Agus setelah 2.5 detik
        setTimeout(() => {
          const agus = state.squadMembers.find(m => m.name === 'Agus');
          if (agus) {
            agus.done = true;
            agus.action = 'Bawa Tumbler ke Kampus ✅';
          }
          saveState();
          renderSquadAndHome();
          damageBoss(50, 'Agus menyelesaikan misi setelah kamu colek santai');
          notifyMultiChannel('🎉 Mantap! Agus langsung menyelesaikan misi tumbler! Semua anggota squad kini 100% tuntas!');
          if (DOM.btnNudgeMember) {
            DOM.btnNudgeMember.innerHTML = '<span>Semua Anggota Tuntas! 🎉</span>';
          }
        }, 2500);
      });
    }

    // 11. Misi Adaptif Varian Radio Selection
    const variantRadios = document.querySelectorAll('input[name="adaptive-variant"]');
    variantRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        state.adaptiveVariantSelected = e.target.value;
        saveState();
        announce(`Varian terpilih: Varian ${state.adaptiveVariantSelected}`);
      });
    });

    // Audio Guide pada Varian C Misi Adaptif
    if (DOM.btnPlayVariantAudio) {
      DOM.btnPlayVariantAudio.addEventListener('click', () => {
        const audioText = 'Panduan Suara Identifikasi Sampah. ' +
          'Botol plastik bening biasanya memiliki kode daur ulang segitiga angka satu atau PETE. ' +
          'Lepaskan tutup botol dan sedotan sebelum disetor ke tempat sampah terpilah. ' +
          'Tutup botol biasanya berbahan polietilena angka dua atau HDPE.';
        speakText(audioText);
        notifyMultiChannel('🔊 Memutar panduan suara identifikasi bahan sampah daur ulang.');
      });
    }

    // Selesaikan Misi Adaptif
    if (DOM.btnCompleteAdaptive) {
      DOM.btnCompleteAdaptive.addEventListener('click', () => {
        if (state.adaptiveCompleted) return;

        state.adaptiveCompleted = true;
        state.impact.bottlesSaved += 2;
        state.impact.plasticBagsAvoided += 1;
        state.impact.co2GramsPrevented += 80;
        state.impact.totalMissionsDone += 1;

        saveState();
        renderMissionsAndItems();
        damageBoss(120, `Misi Adaptif Varian ${state.adaptiveVariantSelected} Tuntas!`);
      });
    }

    // 12. Misi Rutin Aksi
    document.querySelectorAll('.btn-action-mission').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-mission-id');
        if (state.missionsDone[id]) return;

        state.missionsDone[id] = true;
        state.impact.totalMissionsDone += 1;

        if (id === '1') {
          state.impact.bottlesSaved += 1;
          state.impact.co2GramsPrevented += 30;
          damageBoss(50, 'Misi Bawa Tumbler Selesai');
        } else if (id === '2') {
          state.impact.plasticBagsAvoided += 1;
          damageBoss(50, 'Misi Tolak Sedotan Selesai');
        } else if (id === '3') {
          state.impact.co2GramsPrevented += 50;
          damageBoss(50, 'Misi Cabut Colokan Selesai');
        }

        saveState();
        renderMissionsAndItems();
      });
    });

    // 13. Tangkap Monster Sampah Sekitar (Item Harian Pokemon)
    document.querySelectorAll('.btn-capture-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-item-id');
        if (state.itemsCaptured[id]) return;

        state.itemsCaptured[id] = true;
        state.impact.bottlesSaved += 1;
        damageBoss(30, 'Monster Sampah Sekitar Berhasil Diamankan');

        saveState();
        renderMissionsAndItems();
      });
    });

    // 14. Pemilihan Tema Story Card
    DOM.themeSwatches.forEach(swatch => {
      swatch.addEventListener('click', () => {
        const theme = swatch.getAttribute('data-theme');
        state.storyTheme = theme;
        saveState();
        renderStoryAndImpact();
        announce(`Tema kartu diubah menjadi ${swatch.textContent.trim()}`);
      });
    });

    // 15. Bagikan Story & Salin Teks
    if (DOM.btnShareInstagram) {
      DOM.btnShareInstagram.addEventListener('click', () => {
        notifyMultiChannel('📸 Membuka simulasi bagikan ke Instagram Story & Status WhatsApp!');
      });
    }

    if (DOM.btnCopyStoryText) {
      DOM.btnCopyStoryText.addEventListener('click', () => {
        const textToCopy = `Hari ini aku menyelamatkan ${state.impact.bottlesSaved} botol plastik bersama ${state.squadName} di GreenSteps! 🔥 ${state.impact.streakDays} hari streak mabar hijau. Yuk mabar bareng, masukkan kode squad: #${state.squadCode}`;
        
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(textToCopy).then(() => {
            if (DOM.shareFeedback) {
              DOM.shareFeedback.hidden = false;
              setTimeout(() => { DOM.shareFeedback.hidden = true; }, 4000);
            }
            notifyMultiChannel('📋 Teks ringkasan berhasil disalin ke clipboard!');
          }).catch(() => {
            notifyMultiChannel('📋 Ringkasan siap disalin!');
          });
        } else {
          notifyMultiChannel('📋 Ringkasan siap disalin!');
        }
      });
    }

    if (DOM.btnDownloadStoryMock) {
      DOM.btnDownloadStoryMock.addEventListener('click', () => {
        notifyMultiChannel('💾 Kartu pencapaian story berhasil diunduh (simulasi).');
      });
    }

    // 16. Tab Switcher Dampak Pribadiku vs Squad
    if (DOM.tabImpactPersonal && DOM.tabImpactSquad) {
      DOM.tabImpactPersonal.addEventListener('click', () => {
        DOM.tabImpactPersonal.classList.add('active');
        DOM.tabImpactPersonal.setAttribute('aria-selected', 'true');
        DOM.tabImpactSquad.classList.remove('active');
        DOM.tabImpactSquad.setAttribute('aria-selected', 'false');
        DOM.panelImpactPersonal.hidden = false;
        DOM.panelImpactSquad.hidden = true;
        announce('Menampilkan laporan dampak pribadiku.');
      });

      DOM.tabImpactSquad.addEventListener('click', () => {
        DOM.tabImpactSquad.classList.add('active');
        DOM.tabImpactSquad.setAttribute('aria-selected', 'true');
        DOM.tabImpactPersonal.classList.remove('active');
        DOM.tabImpactPersonal.setAttribute('aria-selected', 'false');
        DOM.panelImpactSquad.hidden = false;
        DOM.panelImpactPersonal.hidden = true;
        announce('Menampilkan laporan dampak seluruh squad kosan.');
      });
    }

  }

  // ==========================================
  // INISIALISASI SAAT HALAMAN DIMUAT
  // ==========================================
  function init() {
    applyAccessibilitySettings();
    renderSquadAndHome();
    renderMissionsAndItems();
    renderStoryAndImpact();
    initEventListeners();

    // Default layar awal
    navigateTo('screen-onboarding');
  }

  // Jalankan saat DOM siap
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
