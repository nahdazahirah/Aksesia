/**
 * AKSESIA - JavaScript Prototipe Alur Antrean & Layanan Inklusif Puskesmas
 * Menerapkan prinsip WCAG 2.2 AA, Web Speech API, Vibration API, dan ARIA Live Region.
 */

(function () {
  'use strict';

  // ========================================================
  // 1. STATE MANAGEMENT (Penyimpanan Lokal di Perangkat)
  // ========================================================
  const STORAGE_KEY_PREFS = 'aksesia_a11y_prefs_v1';
  const STORAGE_KEY_VISIT = 'aksesia_visit_data_v1';

  // Pengaturan default aksesibilitas (Layer opsional MATI secara default)
  const defaultSettings = {
    textSize: 100,             // 100% - 200%
    highContrast: false,       // Kontras standar sudah memenuhi WCAG AA 4.5:1
    colorBlindSafe: false,     // Pola arsir khusus
    screenReader: false,       // Text-to-speech otomatis
    simpleMode: false,         // Fokus satu langkah per layar
    vibFlash: true,            // Peringatan multi-saluran
    reduceMotion: false        // Pengurangan animasi
  };

  // Data kunjungan dummy
  const defaultVisit = {
    clinic: 'Puskesmas Sukamaju',
    service: 'Poli Umum',
    timeSlot: 'Pagi (08.00 - 10.00)',
    queueNumber: 'A-014',
    isCheckedIn: false,
    sharePreferences: false,
    needs: {
      slowTalk: true,
      writing: true,
      signLang: false,
      wheelchair: false
    },
    status: 'ready' // 'ready' | 'waiting' | 'called' | 'counter' | 'finished'
  };

  let settings = loadFromStorage(STORAGE_KEY_PREFS, defaultSettings);
  let visit = loadFromStorage(STORAGE_KEY_VISIT, defaultVisit);

  // Riwayat navigasi layar
  let currentScreenId = 'screen-onboarding';
  let previousScreenId = 'screen-home';
  let isStaffViewActive = false;

  // ========================================================
  // 2. HELPER STORAGE & UTILITAS
  // ========================================================
  function loadFromStorage(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : Object.assign({}, fallback);
    } catch (e) {
      return Object.assign({}, fallback);
    }
  }

  function saveToStorage(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      console.warn('Storage gagal:', e);
    }
  }

  // ========================================================
  // 3. PENGUMUMAN AKSESIBILITAS (ARIA Live Region & Web Speech)
  // ========================================================
  const announcerEl = document.getElementById('a11y-announcer');

  function announce(text, forceSpeech = false) {
    if (!text) return;

    // 1. Perbarui ARIA Live Region untuk pembaca layar native (NVDA, TalkBack, JAWS, VoiceOver)
    if (announcerEl) {
      announcerEl.textContent = '';
      setTimeout(() => {
        announcerEl.textContent = text;
      }, 50);
    }

    // 2. Jika fitur "Bacakan Teks" aktif atau dipaksa via tombol TTS
    if ((settings.screenReader || forceSpeech) && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel(); // Hentikan ucapan sebelumnya
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'id-ID';
        utterance.rate = 0.95; // Kecepatan sedikit ramah dan jelas
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.log('TTS tidak didukung atau dibatasi:', err);
      }
    }
  }

  // Pemicu Getar (Vibration API)
  function triggerVibration(pattern) {
    if (settings.vibFlash && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern || [300, 150, 300, 150, 500]);
      } catch (e) {
        // Abaikan jika tidak didukung oleh browser desktop
      }
    }
  }

  // ========================================================
  // 4. APLIKASI TAMPILAN & PENGATURAN AKSESIBILITAS KE DOM
  // ========================================================
  function applyAccessibilityStyles() {
    const root = document.documentElement;
    const body = document.body;

    // 1. Skala Teks
    const scale = (settings.textSize || 100) / 100;
    root.style.setProperty('--text-scale', scale.toString());

    // 2. Mode Kontras Tinggi
    if (settings.highContrast) {
      body.classList.add('high-contrast-mode');
    } else {
      body.classList.remove('high-contrast-mode');
    }

    // 3. Palet Ramah Buta Warna
    if (settings.colorBlindSafe) {
      body.classList.add('colorblind-safe-mode');
    } else {
      body.classList.remove('colorblind-safe-mode');
    }

    // 4. Mode Sederhana
    if (settings.simpleMode) {
      body.classList.add('simple-mode');
    } else {
      body.classList.remove('simple-mode');
    }

    // 5. Kurangi Gerakan
    if (settings.reduceMotion) {
      body.classList.add('reduced-motion-mode');
    } else {
      body.classList.remove('reduced-motion-mode');
    }

    // Update kontrol di modal pengaturan
    updateSettingsModalControls();
  }

  function updateSettingsModalControls() {
    const slider = document.getElementById('slider-text-size');
    const labelVal = document.getElementById('label-text-size-val');
    const hcToggle = document.getElementById('toggle-high-contrast');
    const cbToggle = document.getElementById('toggle-colorblind-safe');
    const srToggle = document.getElementById('toggle-screen-reader');
    const smToggle = document.getElementById('toggle-simple-mode');
    const vfToggle = document.getElementById('toggle-vib-flash');
    const rmToggle = document.getElementById('toggle-reduce-motion');

    if (slider) {
      slider.value = settings.textSize;
      if (labelVal) labelVal.textContent = settings.textSize + '%';
    }
    if (hcToggle) hcToggle.checked = !!settings.highContrast;
    if (cbToggle) cbToggle.checked = !!settings.colorBlindSafe;
    if (srToggle) srToggle.checked = !!settings.screenReader;
    if (smToggle) smToggle.checked = !!settings.simpleMode;
    if (vfToggle) vfToggle.checked = !!settings.vibFlash;
    if (rmToggle) rmToggle.checked = !!settings.reduceMotion;
  }

  // ========================================================
  // 5. NAVIGASI LAYAR (Screen Routing)
  // ========================================================
  const screens = document.querySelectorAll('.screen');
  const btnBack = document.getElementById('btn-header-back');
  const mainContent = document.getElementById('app-main-content');
  const settingsModal = document.getElementById('screen-settings');

  function navigateTo(targetScreenId, announceTitle = true) {
    if (!targetScreenId) return;

    const targetEl = document.getElementById(targetScreenId);
    if (!targetEl) return;

    if (currentScreenId !== targetScreenId && currentScreenId !== 'screen-staff') {
      previousScreenId = currentScreenId;
    }

    screens.forEach(s => {
      s.classList.remove('active');
    });

    targetEl.classList.add('active');
    currentScreenId = targetScreenId;

    // Kelola visibilitas tombol kembali
    if (currentScreenId === 'screen-home' || currentScreenId === 'screen-onboarding') {
      btnBack.classList.add('sr-hidden');
    } else {
      btnBack.classList.remove('sr-hidden');
    }

    // Scroll ke atas dan arahkan fokus
    if (mainContent) mainContent.scrollTop = 0;
    
    // Beri fokus ke heading pertama pada layar target
    setTimeout(() => {
      const heading = targetEl.querySelector('h1, h2');
      if (heading) {
        heading.setAttribute('tabindex', '-1');
        heading.focus();
        if (announceTitle) {
          announce('Layar ' + heading.textContent);
        }
      }
    }, 100);

    // Jalankan pemicu aksi khusus layar jika ada
    onScreenEntered(targetScreenId);
  }

  function onScreenEntered(screenId) {
    if (screenId === 'screen-home') {
      updateHomeScreen();
    } else if (screenId === 'screen-share-pref') {
      updateSharePrefScreen();
    } else if (screenId === 'screen-checkin') {
      updateCheckinScreen();
    } else if (screenId === 'screen-waiting') {
      updateWaitingScreen();
    } else if (screenId === 'screen-called') {
      triggerCalledAlert();
    } else if (screenId === 'screen-staff') {
      updateStaffViewScreen();
    }
  }

  // ========================================================
  // 6. LOGIKA SETIAP LAYAR
  // ========================================================

  // --- LAYAR 1: ONBOARDING ---
  const btnObSave = document.getElementById('btn-onboarding-save');
  const btnObSkip = document.getElementById('btn-onboarding-skip');

  if (btnObSave) {
    btnObSave.addEventListener('click', () => {
      const obLarger = document.getElementById('ob-larger-text');
      const obHc = document.getElementById('ob-high-contrast');
      const obSr = document.getElementById('ob-screen-reader');
      const obSm = document.getElementById('ob-simple-mode');
      const obVf = document.getElementById('ob-vib-flash');

      if (obLarger && obLarger.checked) settings.textSize = 130;
      if (obHc) settings.highContrast = obHc.checked;
      if (obSr) settings.screenReader = obSr.checked;
      if (obSm) settings.simpleMode = obSm.checked;
      if (obVf) settings.vibFlash = obVf.checked;

      saveToStorage(STORAGE_KEY_PREFS, settings);
      applyAccessibilityStyles();
      announce('Pengaturan tampilan berhasil disimpan.');
      navigateTo('screen-home');
    });
  }

  if (btnObSkip) {
    btnObSkip.addEventListener('click', () => {
      announce('Menggunakan pengaturan standar.');
      navigateTo('screen-home');
    });
  }

  // --- LAYAR 2: BERANDA ---
  const btnHomeRegister = document.getElementById('btn-home-register-new');
  const btnHomeContinue = document.getElementById('btn-home-continue-visit');

  if (btnHomeRegister) {
    btnHomeRegister.addEventListener('click', () => {
      navigateTo('screen-register');
    });
  }

  if (btnHomeContinue) {
    btnHomeContinue.addEventListener('click', () => {
      if (visit.isCheckedIn) {
        if (visit.status === 'called') {
          navigateTo('screen-called');
        } else if (visit.status === 'counter') {
          navigateTo('screen-counter');
        } else {
          navigateTo('screen-waiting');
        }
      } else {
        navigateTo('screen-checkin');
      }
    });
  }

  function updateHomeScreen() {
    const clinicName = document.getElementById('home-clinic-name');
    const serviceName = document.getElementById('home-service-name');
    const badge = document.getElementById('home-queue-badge');
    const subtitle = document.getElementById('home-visit-subtitle');

    if (clinicName) clinicName.textContent = visit.clinic;
    if (serviceName) serviceName.textContent = visit.service;

    if (badge) {
      if (visit.status === 'finished') {
        badge.innerHTML = '✔️ Selesai';
        subtitle.textContent = 'Kunjungan terakhir selesai.';
      } else if (visit.isCheckedIn) {
        badge.innerHTML = '🕒 Sedang Mengantre (A-014)';
        subtitle.textContent = 'Anda sudah check-in di Puskesmas.';
      } else {
        badge.innerHTML = '🎟️ Siap Berangkat';
        subtitle.textContent = 'Jadwal Hari Ini: ' + visit.timeSlot;
      }
    }
  }

  // --- LAYAR 3: PENDAFTARAN KUNJUNGAN ---
  const btnRegNext = document.getElementById('btn-register-next');
  const btnRegCancel = document.getElementById('btn-register-cancel');

  if (btnRegNext) {
    btnRegNext.addEventListener('click', () => {
      const clinicSelect = document.getElementById('select-clinic');
      const serviceSelect = document.getElementById('select-service');
      const slotRadio = document.querySelector('input[name="time-slot"]:checked');

      if (clinicSelect) visit.clinic = clinicSelect.value;
      if (serviceSelect) visit.service = serviceSelect.value;
      if (slotRadio) visit.timeSlot = slotRadio.value;

      saveToStorage(STORAGE_KEY_VISIT, visit);
      navigateTo('screen-share-pref');
    });
  }

  if (btnRegCancel) {
    btnRegCancel.addEventListener('click', () => {
      navigateTo('screen-home');
    });
  }

  // --- LAYAR 4: BAGIKAN PREFERENSI AKSES ---
  const toggleShare = document.getElementById('toggle-share-active');
  const sharePreviewBox = document.getElementById('share-preview-container');
  const btnShareConfirm = document.getElementById('btn-share-confirm');
  const btnShareBack = document.getElementById('btn-share-back');

  const prefSlowTalk = document.getElementById('pref-need-slow-talk');
  const prefWriting = document.getElementById('pref-need-writing');
  const prefSignLang = document.getElementById('pref-need-sign-lang');
  const prefWheelchair = document.getElementById('pref-need-wheelchair-access');

  if (toggleShare) {
    toggleShare.addEventListener('change', () => {
      visit.sharePreferences = toggleShare.checked;
      renderSharedTagsList();
      announce(visit.sharePreferences 
        ? 'Preferensi akses akan dibagikan ke staf puskesmas.' 
        : 'Berbagi preferensi dimatikan. Data tidak dibagikan.');
    });
  }

  [prefSlowTalk, prefWriting, prefSignLang, prefWheelchair].forEach(chk => {
    if (chk) {
      chk.addEventListener('change', () => {
        readCheckboxesToState();
        renderSharedTagsList();
      });
    }
  });

  function readCheckboxesToState() {
    visit.needs = {
      slowTalk: prefSlowTalk ? prefSlowTalk.checked : false,
      writing: prefWriting ? prefWriting.checked : false,
      signLang: prefSignLang ? prefSignLang.checked : false,
      wheelchair: prefWheelchair ? prefWheelchair.checked : false
    };
  }

  function renderSharedTagsList() {
    const list = document.getElementById('shared-tags-list');
    if (!list) return;

    if (!visit.sharePreferences) {
      list.innerHTML = '<span class="tag-item" style="font-style: italic;">(Tidak ada informasi yang dibagikan ke staf)</span>';
      return;
    }

    const tags = [];
    if (visit.needs.slowTalk) tags.push('Bicara pelan & menghadap pasien');
    if (visit.needs.writing) tags.push('Bantuan menulis / berkas');
    if (visit.needs.signLang) tags.push('Butuh juru bahasa isyarat');
    if (visit.needs.wheelchair) tags.push('Akses kursi roda');

    if (settings.textSize > 120) tags.push('Teks besar aktif');

    if (tags.length === 0) {
      list.innerHTML = '<span class="tag-item">Layanan standar tanpa catatan khusus</span>';
    } else {
      list.innerHTML = tags.map(t => `<span class="tag-item">✓ ${t}</span>`).join('');
    }
  }

  function updateSharePrefScreen() {
    if (toggleShare) toggleShare.checked = !!visit.sharePreferences;
    if (prefSlowTalk) prefSlowTalk.checked = !!visit.needs.slowTalk;
    if (prefWriting) prefWriting.checked = !!visit.needs.writing;
    if (prefSignLang) prefSignLang.checked = !!visit.needs.signLang;
    if (prefWheelchair) prefWheelchair.checked = !!visit.needs.wheelchair;
    renderSharedTagsList();
  }

  if (btnShareConfirm) {
    btnShareConfirm.addEventListener('click', () => {
      readCheckboxesToState();
      visit.sharePreferences = toggleShare ? toggleShare.checked : false;
      saveToStorage(STORAGE_KEY_VISIT, visit);
      announce('Data kunjungan dikonfirmasi. Nomor antrean Anda A-014.');
      navigateTo('screen-checkin');
    });
  }

  if (btnShareBack) {
    btnShareBack.addEventListener('click', () => {
      navigateTo('screen-register');
    });
  }

  // --- LAYAR 5: TIKET & CHECK-IN ---
  const btnDoCheckin = document.getElementById('btn-do-checkin');
  const btnCheckinCancel = document.getElementById('btn-checkin-cancel');

  if (btnDoCheckin) {
    btnDoCheckin.addEventListener('click', () => {
      visit.isCheckedIn = true;
      visit.status = 'waiting';
      saveToStorage(STORAGE_KEY_VISIT, visit);
      announce('Berhasil check-in di Puskesmas. Anda memasuki ruang tunggu antrean.');
      navigateTo('screen-waiting');
    });
  }

  if (btnCheckinCancel) {
    btnCheckinCancel.addEventListener('click', () => {
      navigateTo('screen-home');
    });
  }

  function updateCheckinScreen() {
    const clinicDisp = document.getElementById('ticket-clinic-display');
    const serviceDisp = document.getElementById('ticket-service-display');
    const timeDisp = document.getElementById('ticket-time-display');
    const statusText = document.getElementById('checkin-status-text');
    const statusSub = document.getElementById('checkin-status-subtext');

    if (clinicDisp) clinicDisp.textContent = visit.clinic;
    if (serviceDisp) serviceDisp.textContent = visit.service;
    if (timeDisp) timeDisp.textContent = 'Sesi: ' + visit.timeSlot;

    if (visit.isCheckedIn) {
      if (statusText) statusText.textContent = 'Sudah Check-In di Lokasi';
      if (statusSub) statusSub.textContent = 'Silakan duduk di ruang tunggu Poli Umum.';
      if (btnDoCheckin) {
        btnDoCheckin.innerHTML = '<span>Lanjut ke Ruang Tunggu</span>';
      }
    } else {
      if (statusText) statusText.textContent = 'Belum Check-In di Lokasi';
      if (statusSub) statusSub.textContent = 'Tekan tombol di bawah jika Anda sudah tiba di Puskesmas.';
      if (btnDoCheckin) {
        btnDoCheckin.innerHTML = `
          <svg class="btn-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <span>Saya Sudah Tiba (Check-In)</span>`;
      }
    }
  }

  // --- LAYAR 6: RUANG TUNGGU ---
  const btnSimulateCall = document.getElementById('btn-simulate-call');

  if (btnSimulateCall) {
    btnSimulateCall.addEventListener('click', () => {
      visit.status = 'called';
      saveToStorage(STORAGE_KEY_VISIT, visit);
      navigateTo('screen-called');
    });
  }

  function updateWaitingScreen() {
    // Memberikan ketenangan dengan pembaruan status
    announce('Ruang tunggu. Sisa 3 orang lagi di depan Anda. Sedang melayani A-011 di Loket 2.');
  }

  // --- LAYAR 7: PERINGATAN DIPANGGIL (Multi-Channel) ---
  const btnGoToCounter = document.getElementById('btn-go-to-counter');
  const btnReAnnounce = document.getElementById('btn-re-announce');

  function triggerCalledAlert() {
    // 1. Getaran (Vibration API)
    triggerVibration([300, 150, 300, 150, 600]);

    // 2. Audio Suara (Text-to-Speech)
    const callText = 'Giliran Anda! Nomor antrean A nol satu empat. Silakan menuju Loket 2.';
    announce(callText, true); // Paksa ucapkan untuk simulasi panggilan
  }

  if (btnGoToCounter) {
    btnGoToCounter.addEventListener('click', () => {
      visit.status = 'counter';
      saveToStorage(STORAGE_KEY_VISIT, visit);
      navigateTo('screen-counter');
    });
  }

  if (btnReAnnounce) {
    btnReAnnounce.addEventListener('click', () => {
      triggerCalledAlert();
    });
  }

  // --- LAYAR 8: DI LOKET (Kartu Komunikasi & Ketik-Ucapkan) ---
  const commCards = document.querySelectorAll('.comm-card');
  const modalZoom = document.getElementById('modal-card-zoom');
  const zoomTitle = document.getElementById('zoom-card-title');
  const zoomDesc = document.getElementById('zoom-card-desc');
  const btnCloseZoom = document.getElementById('btn-close-zoom');

  commCards.forEach(card => {
    card.addEventListener('click', () => {
      const title = card.getAttribute('data-title');
      const desc = card.getAttribute('data-desc');

      if (zoomTitle) zoomTitle.textContent = title;
      if (zoomDesc) zoomDesc.textContent = desc;

      if (modalZoom) {
        modalZoom.removeAttribute('hidden');
        if (btnCloseZoom) btnCloseZoom.focus();
        announce('Kartu komunikasi ditampilkan layar penuh: ' + title);
      }
    });
  });

  if (btnCloseZoom && modalZoom) {
    btnCloseZoom.addEventListener('click', () => {
      modalZoom.setAttribute('hidden', '');
      announce('Tampilan kartu ditutup.');
    });
  }

  // Ketik lalu Ucapkan (TTS Box)
  const inputSpeech = document.getElementById('input-speech-text');
  const btnSpeakNow = document.getElementById('btn-speak-now');
  const btnShowLargeText = document.getElementById('btn-show-large-text');
  const btnFinishCounter = document.getElementById('btn-finish-counter');

  if (btnSpeakNow) {
    btnSpeakNow.addEventListener('click', () => {
      const text = inputSpeech ? inputSpeech.value.trim() : '';
      if (!text) {
        announce('Ketikkan kalimat terlebih dahulu sebelum menekan ucapkan.');
        if (inputSpeech) inputSpeech.focus();
        return;
      }
      announce(text, true); // Paksa ucapkan via TTS
    });
  }

  if (btnShowLargeText) {
    btnShowLargeText.addEventListener('click', () => {
      const text = inputSpeech ? inputSpeech.value.trim() : '';
      if (!text) {
        announce('Ketikkan kalimat terlebih dahulu sebelum menampilkan teks besar.');
        if (inputSpeech) inputSpeech.focus();
        return;
      }

      if (zoomTitle) zoomTitle.textContent = 'Pesan untuk Petugas:';
      if (zoomDesc) zoomDesc.textContent = text;

      if (modalZoom) {
        modalZoom.removeAttribute('hidden');
        if (btnCloseZoom) btnCloseZoom.focus();
        announce('Pesan Anda ditampilkan dalam huruf besar di layar penuh.');
      }
    });
  }

  if (btnFinishCounter) {
    btnFinishCounter.addEventListener('click', () => {
      visit.status = 'finished';
      visit.isCheckedIn = false;
      saveToStorage(STORAGE_KEY_VISIT, visit);
      navigateTo('screen-after-visit');
    });
  }

  // --- LAYAR 9: SETELAH KUNJUNGAN ---
  const btnBackHome = document.getElementById('btn-back-to-home');
  const ratingBtns = document.querySelectorAll('.rating-btn');

  if (btnBackHome) {
    btnBackHome.addEventListener('click', () => {
      navigateTo('screen-home');
    });
  }

  ratingBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      ratingBtns.forEach(b => b.style.fontWeight = 'normal');
      btn.style.fontWeight = 'bold';
      btn.style.borderWidth = '2px';
      announce('Terima kasih atas penilaian Anda: ' + btn.textContent);
    });
  });

  // --- LAYAR 10: MODAL PENGATURAN AKSESIBILITAS PERSISTEN ---
  const btnOpenA11y = document.getElementById('btn-open-a11y');
  const btnCloseSettings = document.getElementById('btn-close-settings');
  const btnSaveSettings = document.getElementById('btn-save-settings');

  const sliderText = document.getElementById('slider-text-size');
  const labelTextSizeVal = document.getElementById('label-text-size-val');
  const hcToggle = document.getElementById('toggle-high-contrast');
  const cbToggle = document.getElementById('toggle-colorblind-safe');
  const srToggle = document.getElementById('toggle-screen-reader');
  const smToggle = document.getElementById('toggle-simple-mode');
  const vfToggle = document.getElementById('toggle-vib-flash');
  const rmToggle = document.getElementById('toggle-reduce-motion');

  if (btnOpenA11y && settingsModal) {
    btnOpenA11y.addEventListener('click', () => {
      updateSettingsModalControls();
      settingsModal.removeAttribute('hidden');
      if (btnCloseSettings) btnCloseSettings.focus();
      announce('Panel pengaturan aksesibilitas dibuka.');
    });
  }

  function closeA11yModal() {
    if (settingsModal) {
      settingsModal.setAttribute('hidden', '');
      if (btnOpenA11y) btnOpenA11y.focus();
      announce('Pengaturan aksesibilitas ditutup.');
    }
  }

  if (btnCloseSettings) {
    btnCloseSettings.addEventListener('click', closeA11yModal);
  }

  if (btnSaveSettings) {
    btnSaveSettings.addEventListener('click', () => {
      saveToStorage(STORAGE_KEY_PREFS, settings);
      closeA11yModal();
      announce('Perubahan aksesibilitas berhasil diterapkan.');
    });
  }

  // Interaktivitas langsung (Live Preview) saat kontrol diubah
  if (sliderText) {
    sliderText.addEventListener('input', (e) => {
      settings.textSize = parseInt(e.target.value, 10);
      if (labelTextSizeVal) labelTextSizeVal.textContent = settings.textSize + '%';
      applyAccessibilityStyles();
    });
  }

  if (hcToggle) {
    hcToggle.addEventListener('change', (e) => {
      settings.highContrast = e.target.checked;
      applyAccessibilityStyles();
    });
  }

  if (cbToggle) {
    cbToggle.addEventListener('change', (e) => {
      settings.colorBlindSafe = e.target.checked;
      applyAccessibilityStyles();
    });
  }

  if (srToggle) {
    srToggle.addEventListener('change', (e) => {
      settings.screenReader = e.target.checked;
      announce(settings.screenReader ? 'Fitur pembaca layar diaktifkan.' : 'Fitur pembaca layar dimatikan.');
    });
  }

  if (smToggle) {
    smToggle.addEventListener('change', (e) => {
      settings.simpleMode = e.target.checked;
      applyAccessibilityStyles();
    });
  }

  if (vfToggle) {
    vfToggle.addEventListener('change', (e) => {
      settings.vibFlash = e.target.checked;
    });
  }

  if (rmToggle) {
    rmToggle.addEventListener('change', (e) => {
      settings.reduceMotion = e.target.checked;
      applyAccessibilityStyles();
    });
  }

  // --- LAYAR 11: MODE PETUGAS (STAFF VIEW) ---
  const btnToggleRole = document.getElementById('btn-toggle-role');
  const roleText = document.getElementById('role-text');
  const btnStaffCall = document.getElementById('btn-staff-call-patient');
  const btnStaffReturn = document.getElementById('btn-staff-return-patient');

  if (btnToggleRole) {
    btnToggleRole.addEventListener('click', () => {
      if (isStaffViewActive) {
        exitStaffView();
      } else {
        enterStaffView();
      }
    });
  }

  function enterStaffView() {
    isStaffViewActive = true;
    if (roleText) roleText.textContent = 'Kembali ke Pasien';
    navigateTo('screen-staff');
    announce('Beralih ke tampilan petugas loket Puskesmas.');
  }

  function exitStaffView() {
    isStaffViewActive = false;
    if (roleText) roleText.textContent = 'Lihat Mode Petugas';
    navigateTo(previousScreenId || 'screen-home');
    announce('Kembali ke tampilan pasien.');
  }

  if (btnStaffReturn) {
    btnStaffReturn.addEventListener('click', exitStaffView);
  }

  if (btnStaffCall) {
    btnStaffCall.addEventListener('click', () => {
      visit.status = 'called';
      saveToStorage(STORAGE_KEY_VISIT, visit);
      exitStaffView();
      navigateTo('screen-called');
      announce('Petugas telah memanggil nomor antrean Anda!');
    });
  }

  function updateStaffViewScreen() {
    const sharedBox = document.getElementById('staff-shared-details');
    const tagList = document.getElementById('staff-pref-tag-list');
    const statusPill = document.getElementById('staff-patient-status-pill');

    if (sharedBox && tagList) {
      if (visit.sharePreferences) {
        sharedBox.style.display = 'block';
        const tags = [];
        if (visit.needs.slowTalk) tags.push('🔊 Tolong bicara pelan & menghadap ke pasien');
        if (visit.needs.writing) tags.push('✍️ Butuh bantuan mencatat / menulis');
        if (visit.needs.signLang) tags.push('🤟 Membutuhkan juru bahasa isyarat');
        if (visit.needs.wheelchair) tags.push('♿ Perlu akses kursi roda');

        if (tags.length === 0) {
          tagList.innerHTML = '<li>Layanan standar</li>';
        } else {
          tagList.innerHTML = tags.map(t => `<li>${t}</li>`).join('');
        }
      } else {
        // Jika pasien memilih TIDAK membagikan preferensi
        sharedBox.style.display = 'block';
        tagList.innerHTML = '<li><em>Pasien tidak membagikan preferensi akses khusus (Layanan Standar).</em></li>';
      }
    }

    if (statusPill) {
      if (visit.status === 'called') {
        statusPill.textContent = 'Sedang Dipanggil';
      } else if (visit.status === 'counter') {
        statusPill.textContent = 'Sedang Dilayani';
      } else if (visit.status === 'finished') {
        statusPill.textContent = 'Pemeriksaan Selesai';
      } else {
        statusPill.textContent = 'Siap Dilayani';
      }
    }
  }

  // --- TOMBOL HEADER KEMBALI & BACAKAN LAYAR ---
  if (btnBack) {
    btnBack.addEventListener('click', () => {
      if (currentScreenId === 'screen-staff') {
        exitStaffView();
      } else {
        const flowOrder = [
          'screen-onboarding',
          'screen-home',
          'screen-register',
          'screen-share-pref',
          'screen-checkin',
          'screen-waiting',
          'screen-called',
          'screen-counter',
          'screen-after-visit'
        ];
        const idx = flowOrder.indexOf(currentScreenId);
        if (idx > 1) {
          navigateTo(flowOrder[idx - 1]);
        } else {
          navigateTo('screen-home');
        }
      }
    });
  }

  const btnSpeakScreen = document.getElementById('btn-speak-screen');
  if (btnSpeakScreen) {
    btnSpeakScreen.addEventListener('click', () => {
      const activeScreen = document.querySelector('.screen.active');
      if (activeScreen) {
        const heading = activeScreen.querySelector('h1, h2');
        const paragraphs = activeScreen.querySelectorAll('p, .queue-number, .counter-name');
        let textToRead = heading ? heading.textContent + '. ' : '';
        paragraphs.forEach(p => {
          if (p.offsetWidth > 0 && p.offsetHeight > 0) { // Hanya elemen terlihat
            textToRead += p.textContent + '. ';
          }
        });
        announce(textToRead, true); // Force bacakan
      }
    });
  }

  // ========================================================
  // 7. INISIALISASI SAAT HALAMAN DIMUAT
  // ========================================================
  document.addEventListener('DOMContentLoaded', () => {
    applyAccessibilityStyles();
    // Default mulai dari onboarding
    navigateTo('screen-onboarding');
  });

})();
