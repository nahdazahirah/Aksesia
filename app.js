/**
 * GREENSTEPS - MOBILE APP LOGIC
 * Clean & Crisp Indonesian Young Adult Copy
 * NO EMOJIS • NO GLOW • NO SHADOWS
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'greensteps_app_state_v3';

  const defaultState = {
    user: {
      name: 'rian',
      role: 'tumbler warrior',
      ecoPoints: 850,
      streakDays: 7
    },
    squad: {
      name: 'kosan barokah asri',
      code: 'KOS-BAROKAH-24',
      totalMembers: 6,
      completedToday: 5,
      members: [
        { name: 'rian', done: true, action: 'bawa tumbler' },
        { name: 'fajar', done: true, action: 'pilah kardus' },
        { name: 'dita', done: true, action: 'tolak sedotan' },
        { name: 'bima', done: true, action: 'gelas boba' },
        { name: 'siti', done: true, action: 'cabut colokan' },
        { name: 'agus', done: false, action: 'belum' }
      ]
    },
    monster: {
      name: 'kiki si kresek nakal',
      currentHp: 380,
      maxHp: 1000
    },
    impact: {
      bottlesSaved: 42,
      plasticBagsAvoided: 38,
      co2Kg: 26.5,
      cardboardKg: 14.8
    },
    a11y: {
      highContrast: false,
      largeText: false,
      cognitiveFocus: false,
      spaciousTouch: false,
      reducedMotion: false
    },
    activeScreen: 'screen-onboarding',
    currentOnboardingSlide: 1,
    selectedAdaptiveVariant: 'A',
    storyTheme: 'theme-green',
    pendingVerificationMission: null
  };

  let state = loadState();

  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return Object.assign({}, defaultState, JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Gagal memuat state dari storage', e);
    }
    return JSON.parse(JSON.stringify(defaultState));
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Gagal menyimpan state ke storage', e);
    }
  }

  // Notifikasi Toast
  function showToast(message, duration = 2500) {
    const toast = document.getElementById('visual-toast');
    const announcer = document.getElementById('a11y-announcer');
    
    if (toast) {
      toast.textContent = message;
      toast.style.display = 'flex';
      setTimeout(() => {
        toast.style.display = 'none';
      }, duration);
    }

    if (announcer) {
      announcer.textContent = message;
    }

    if ('vibrate' in navigator && !state.a11y.reducedMotion) {
      try {
        navigator.vibrate(40);
      } catch (e) {}
    }
  }

  // Text-to-Speech
  function speakText(text) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID';
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    } else {
      showToast('peramban tidak mendukung suara.');
    }
  }

  // Navigasi Layar
  function switchScreen(screenId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(s => s.classList.remove('active'));

    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
      targetScreen.classList.add('active');
      state.activeScreen = screenId;
      saveState();

      const mainScroller = document.getElementById('app-main-content');
      if (mainScroller) mainScroller.scrollTop = 0;

      // Update bilah atas
      document.querySelectorAll('.proto-screen-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-target') === screenId);
      });

      // Update bilah navigasi bawah
      document.querySelectorAll('.bottom-nav-bar .nav-item').forEach(item => {
        item.classList.toggle('active', item.getAttribute('data-screen') === screenId);
      });

      const heading = targetScreen.querySelector('h2, h3');
      if (heading) {
        showToast('layar: ' + heading.textContent, 1500);
      }
    }
  }

  // Pengaturan Aksesibilitas
  function applyA11ySettings() {
    const body = document.body;

    body.classList.toggle('high-contrast-mode', state.a11y.highContrast);
    body.classList.toggle('large-text-mode', state.a11y.largeText);
    body.classList.toggle('cognitive-focus-mode', state.a11y.cognitiveFocus);
    body.classList.toggle('spacious-touch-mode', state.a11y.spaciousTouch);

    // Sync input switches
    const toggleContrast = document.getElementById('toggle-high-contrast');
    if (toggleContrast) toggleContrast.checked = state.a11y.highContrast;

    const toggleLarge = document.getElementById('toggle-large-text');
    if (toggleLarge) toggleLarge.checked = state.a11y.largeText;

    const toggleCognitive = document.getElementById('toggle-cognitive');
    if (toggleCognitive) toggleCognitive.checked = state.a11y.cognitiveFocus;

    const toggleSpacious = document.getElementById('toggle-spacious');
    if (toggleSpacious) toggleSpacious.checked = state.a11y.spaciousTouch;

    // Sync prototype top mode buttons
    const btnNormal = document.getElementById('btn-mode-normal');
    const btnContrast = document.getElementById('btn-mode-contrast');
    const btnCognitive = document.getElementById('btn-mode-cognitive');

    if (btnNormal && btnContrast && btnCognitive) {
      btnNormal.classList.remove('active');
      btnContrast.classList.remove('active');
      btnCognitive.classList.remove('active');

      if (state.a11y.highContrast) {
        btnContrast.classList.add('active');
      } else if (state.a11y.cognitiveFocus) {
        btnCognitive.classList.add('active');
      } else {
        btnNormal.classList.add('active');
      }
    }

    saveState();
  }

  // Event Listeners DOM
  document.addEventListener('DOMContentLoaded', () => {

    applyA11ySettings();

    // Navigasi bilah atas
    document.querySelectorAll('.proto-screen-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-target');
        if (target) switchScreen(target);
      });
    });

    // Navigasi bottom bar
    document.querySelectorAll('.bottom-nav-bar .nav-item').forEach(item => {
      item.addEventListener('click', () => {
        const target = item.getAttribute('data-screen');
        if (target) switchScreen(target);
      });
    });

    // Tombol shortcut ke misi
    document.querySelectorAll('.btn-goto-missions').forEach(btn => {
      btn.addEventListener('click', () => switchScreen('screen-missions'));
    });

    // Onboarding carousel
    const slides = [
      document.getElementById('slide-1'),
      document.getElementById('slide-2'),
      document.getElementById('slide-3')
    ];
    const dots = document.querySelectorAll('.slide-dot');
    const btnNextSlide = document.getElementById('btn-next-slide');

    function showSlide(index) {
      slides.forEach((slide, i) => {
        if (slide) slide.classList.toggle('active', i === index - 1);
      });
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index - 1);
      });
      state.currentOnboardingSlide = index;
      if (btnNextSlide) {
        btnNextSlide.querySelector('span').textContent = index === 3 ? 'atur kebutuhan' : 'lanjut';
      }
    }

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const idx = parseInt(dot.getAttribute('data-slide'), 10);
        showSlide(idx);
      });
    });

    if (btnNextSlide) {
      btnNextSlide.addEventListener('click', () => {
        let next = state.currentOnboardingSlide + 1;
        if (next > 3) {
          const cardPref = document.getElementById('card-pref-netra');
          if (cardPref) cardPref.scrollIntoView({ behavior: 'smooth' });
        } else {
          showSlide(next);
        }
      });
    }

    // Toggle preferensi aksesibilitas
    const toggleCards = [
      { id: 'card-pref-netra', prop: 'highContrast', extra: 'largeText' },
      { id: 'card-pref-rungu', msg: 'mode rungu aktif: getaran & teks disiapkan.' },
      { id: 'card-pref-motorik', prop: 'spaciousTouch' },
      { id: 'card-pref-kognitif', prop: 'cognitiveFocus' }
    ];

    toggleCards.forEach(item => {
      const card = document.getElementById(item.id);
      if (card) {
        card.addEventListener('click', () => {
          card.classList.toggle('selected');
          const isSelected = card.classList.contains('selected');
          card.setAttribute('aria-checked', isSelected ? 'true' : 'false');

          if (item.prop) state.a11y[item.prop] = isSelected;
          if (item.extra) state.a11y[item.extra] = isSelected;

          applyA11ySettings();
          showToast(isSelected ? `${card.querySelector('strong').textContent} aktif.` : 'dinonaktifkan.');
        });
      }
    });

    // Squad tab onboarding
    const tabJoinBtn = document.getElementById('tab-join-btn');
    const tabCreateBtn = document.getElementById('tab-create-btn');
    const panelJoin = document.getElementById('panel-join-content');
    const panelCreate = document.getElementById('panel-create-content');

    if (tabJoinBtn && tabCreateBtn) {
      tabJoinBtn.addEventListener('click', () => {
        tabJoinBtn.classList.add('active');
        tabCreateBtn.classList.remove('active');
        if (panelJoin) panelJoin.style.display = 'block';
        if (panelCreate) panelCreate.style.display = 'none';
      });

      tabCreateBtn.addEventListener('click', () => {
        tabCreateBtn.classList.add('active');
        tabJoinBtn.classList.remove('active');
        if (panelJoin) panelJoin.style.display = 'none';
        if (panelCreate) panelCreate.style.display = 'block';
      });
    }

    const btnStartMabar = document.getElementById('btn-start-mabar');
    const btnSkipOnboarding = document.getElementById('btn-skip-onboarding');

    if (btnStartMabar) {
      btnStartMabar.addEventListener('click', () => {
        showToast('masuk ke kosan barokah.');
        switchScreen('screen-home');
      });
    }

    if (btnSkipOnboarding) {
      btnSkipOnboarding.addEventListener('click', () => {
        switchScreen('screen-home');
      });
    }

    // Colek santai
    function handleNudge() {
      showToast('agus sudah dicolek.');
      setTimeout(() => {
        showToast('agus: "siap, tumbler udah diisi galon."');
      }, 1500);
    }

    const btnNudgeHome = document.getElementById('btn-nudge-home');
    if (btnNudgeHome) btnNudgeHome.addEventListener('click', handleNudge);

    const btnNudgeSquad = document.getElementById('btn-nudge-squad');
    if (btnNudgeSquad) btnNudgeSquad.addEventListener('click', handleNudge);

    // Pemilih varian adaptif
    const variantOptions = [
      { id: 'opt-variant-a', val: 'A' },
      { id: 'opt-variant-c', val: 'C' },
      { id: 'opt-variant-b', val: 'B' }
    ];

    variantOptions.forEach(opt => {
      const el = document.getElementById(opt.id);
      if (el) {
        el.addEventListener('click', () => {
          variantOptions.forEach(o => {
            const itemEl = document.getElementById(o.id);
            if (itemEl) {
              itemEl.classList.remove('selected');
              itemEl.setAttribute('aria-checked', 'false');
            }
          });
          el.classList.add('selected');
          el.setAttribute('aria-checked', 'true');
          state.selectedAdaptiveVariant = opt.val;
          showToast(`varian ${opt.val} dipilih. dampaknya sama.`);
        });
      }
    });

    // Audio guide
    const btnPlayAudio = document.getElementById('btn-play-audio-guide');
    if (btnPlayAudio) {
      btnPlayAudio.addEventListener('click', (e) => {
        e.stopPropagation();
        speakText('petunjuk suara: periksa bagian bawah wadah plastik. cari logo segitiga panah berputar. nomor satu artinya plastik pet seperti botol minum bening. nomor dua artinya plastik hdpe seperti botol sampo. keduanya bisa dipilah.');
        showToast('memutar petunjuk suara.');
      });
    }

    // Modal verifikasi
    const modalVerify = document.getElementById('modal-verify');
    const btnCloseVerify = document.getElementById('btn-close-verify');
    const btnVerifyPhoto = document.getElementById('btn-verify-photo');
    const btnVerifySimple = document.getElementById('btn-verify-simple');
    const btnConfirmComp = document.getElementById('btn-confirm-completion');
    const verifyTitle = document.getElementById('verify-mission-name');

    function openVerificationModal(title, pts, impactText) {
      state.pendingVerificationMission = { title, pts, impactText };
      if (verifyTitle) verifyTitle.textContent = title.toLowerCase();
      if (modalVerify) modalVerify.hidden = false;
    }

    if (btnCloseVerify) {
      btnCloseVerify.addEventListener('click', () => {
        if (modalVerify) modalVerify.hidden = true;
      });
    }

    if (btnVerifyPhoto && btnVerifySimple) {
      btnVerifyPhoto.addEventListener('click', () => {
        btnVerifyPhoto.classList.add('selected');
        btnVerifySimple.classList.remove('selected');
      });
      btnVerifySimple.addEventListener('click', () => {
        btnVerifySimple.classList.add('selected');
        btnVerifyPhoto.classList.remove('selected');
      });
    }

    const btnAdaptiveTrigger = document.getElementById('btn-trigger-verify-adaptive');
    if (btnAdaptiveTrigger) {
      btnAdaptiveTrigger.addEventListener('click', () => {
        openVerificationModal('serang kiki kresek', 50, '1 kresek dibereskan');
      });
    }

    document.querySelectorAll('.btn-action-verify').forEach(btn => {
      btn.addEventListener('click', () => {
        const title = btn.getAttribute('data-mission-title') || 'misi';
        const pts = parseInt(btn.getAttribute('data-pts') || '25', 10);
        const impact = btn.getAttribute('data-impact') || '1 sampah berkurang';
        openVerificationModal(title, pts, impact);
      });
    });

    if (btnConfirmComp) {
      btnConfirmComp.addEventListener('click', () => {
        if (modalVerify) modalVerify.hidden = true;

        state.monster.currentHp = Math.max(0, state.monster.currentHp - 120);
        state.user.ecoPoints += (state.pendingVerificationMission ? state.pendingVerificationMission.pts : 50);
        state.user.streakDays = 8;
        state.squad.completedToday = 6;

        const hpFill = document.getElementById('monster-hp-fill');
        const hpLabel = document.getElementById('monster-hp-label');
        if (hpFill) hpFill.style.width = Math.round((state.monster.currentHp / state.monster.maxHp) * 100) + '%';
        if (hpLabel) hpLabel.textContent = `${state.monster.currentHp} / ${state.monster.maxHp} hp`;

        const homeSquadProg = document.getElementById('home-squad-progress');
        if (homeSquadProg) homeSquadProg.style.width = '100%';

        saveState();

        showToast('misi selesai. hp monster berkurang 120.');
        
        setTimeout(() => {
          switchScreen('screen-share');
        }, 1000);
      });
    }

    // Switch tema story
    document.querySelectorAll('.btn-theme-switch').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.btn-theme-switch').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const theme = btn.getAttribute('data-theme');
        const card = document.getElementById('strava-share-card');
        if (card && theme) {
          card.className = `strava-story-card ${theme}`;
          state.storyTheme = theme;
          saveState();
        }
      });
    });

    // Share & Save
    const btnShareStory = document.getElementById('btn-share-story');
    const btnSaveStory = document.getElementById('btn-save-story');

    if (btnShareStory) {
      btnShareStory.addEventListener('click', () => {
        const text = `GreenSteps: hari ini 1 botol plastik diselamatkan bareng anak kosan. streak 8 hari. kode squad: #BAROKAH-ECO`;
        if (navigator.clipboard) {
          navigator.clipboard.writeText(text).then(() => {
            showToast('teks ringkasan disalin.');
          });
        } else {
          showToast('siap dibagikan.');
        }
      });
    }

    if (btnSaveStory) {
      btnSaveStory.addEventListener('click', () => {
        showToast('kartu disimpan.');
      });
    }

    // Tab switcher dampak
    const tabImpPersonal = document.getElementById('tab-impact-personal-btn');
    const tabImpSquad = document.getElementById('tab-impact-squad-btn');
    const pnlImpPersonal = document.getElementById('panel-impact-personal');
    const pnlImpSquad = document.getElementById('panel-impact-squad');

    if (tabImpPersonal && tabImpSquad) {
      tabImpPersonal.addEventListener('click', () => {
        tabImpPersonal.classList.add('active');
        tabImpSquad.classList.remove('active');
        if (pnlImpPersonal) pnlImpPersonal.style.display = 'block';
        if (pnlImpSquad) pnlImpSquad.style.display = 'none';
      });

      tabImpSquad.addEventListener('click', () => {
        tabImpSquad.classList.add('active');
        tabImpPersonal.classList.remove('active');
        if (pnlImpPersonal) pnlImpPersonal.style.display = 'none';
        if (pnlImpSquad) pnlImpSquad.style.display = 'block';
      });
    }

    // Modal aksesibilitas
    const modalA11y = document.getElementById('modal-a11y');
    const btnOpenA11y = document.getElementById('btn-open-a11y');
    const btnCloseA11y = document.getElementById('btn-close-a11y');
    const btnSaveA11y = document.getElementById('btn-save-a11y');
    const btnProfileA11y = document.getElementById('btn-profile-open-a11y');

    function openA11yModal() {
      if (modalA11y) modalA11y.hidden = false;
    }

    if (btnOpenA11y) btnOpenA11y.addEventListener('click', openA11yModal);
    if (btnProfileA11y) btnProfileA11y.addEventListener('click', openA11yModal);

    if (btnCloseA11y) {
      btnCloseA11y.addEventListener('click', () => {
        if (modalA11y) modalA11y.hidden = true;
      });
    }

    if (btnSaveA11y) {
      btnSaveA11y.addEventListener('click', () => {
        const toggleContrast = document.getElementById('toggle-high-contrast');
        const toggleLarge = document.getElementById('toggle-large-text');
        const toggleCognitive = document.getElementById('toggle-cognitive');
        const toggleSpacious = document.getElementById('toggle-spacious');

        if (toggleContrast) state.a11y.highContrast = toggleContrast.checked;
        if (toggleLarge) state.a11y.largeText = toggleLarge.checked;
        if (toggleCognitive) state.a11y.cognitiveFocus = toggleCognitive.checked;
        if (toggleSpacious) state.a11y.spaciousTouch = toggleSpacious.checked;

        applyA11ySettings();
        if (modalA11y) modalA11y.hidden = true;
        showToast('pengaturan diterapkan.');
      });
    }

    // Quick switcher mode di atas
    const btnModeNormal = document.getElementById('btn-mode-normal');
    const btnModeContrast = document.getElementById('btn-mode-contrast');
    const btnModeCognitive = document.getElementById('btn-mode-cognitive');

    if (btnModeNormal) {
      btnModeNormal.addEventListener('click', () => {
        state.a11y.highContrast = false;
        state.a11y.largeText = false;
        state.a11y.cognitiveFocus = false;
        applyA11ySettings();
        showToast('mode normal.');
      });
    }

    if (btnModeContrast) {
      btnModeContrast.addEventListener('click', () => {
        state.a11y.highContrast = true;
        state.a11y.largeText = true;
        state.a11y.cognitiveFocus = false;
        applyA11ySettings();
        showToast('mode kontras tinggi.');
      });
    }

    if (btnModeCognitive) {
      btnModeCognitive.addEventListener('click', () => {
        state.a11y.highContrast = false;
        state.a11y.cognitiveFocus = true;
        applyA11ySettings();
        showToast('mode fokus.');
      });
    }

    // TTS speaker header
    const btnSpeakScreen = document.getElementById('btn-speak-screen');
    if (btnSpeakScreen) {
      btnSpeakScreen.addEventListener('click', () => {
        const activeEl = document.querySelector('.screen.active');
        if (activeEl) {
          const h = activeEl.querySelector('h2, h3');
          const title = h ? h.textContent : 'layar aktif';
          const p = activeEl.querySelector('p');
          const desc = p ? p.textContent : '';
          speakText(`layar: ${title}. ${desc}`);
        }
      });
    }

    // Salin kode squad
    const btnCopyCode = document.getElementById('btn-copy-code');
    if (btnCopyCode) {
      btnCopyCode.addEventListener('click', () => {
        if (navigator.clipboard) {
          navigator.clipboard.writeText('KOS-BAROKAH-24');
        }
        showToast('kode disalin.');
      });
    }

    // Reset data
    const btnResetData = document.getElementById('btn-reset-data');
    if (btnResetData) {
      btnResetData.addEventListener('click', () => {
        localStorage.removeItem(STORAGE_KEY);
        state = JSON.parse(JSON.stringify(defaultState));
        applyA11ySettings();
        switchScreen('screen-onboarding');
        showToast('data direset.');
      });
    }

  });

})();
