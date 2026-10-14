/**
 * Ferreira Fitness GYM – Sistema de Recepción y Control de Acceso
 * Módulos:
 * 1. Check-In en Vivo & Torno (Doble vía: Manual + QR / Escáner USB)
 * 2. Cartera de Socios, Control de Deudores & Cobranzas por WhatsApp
 * 3. Gestión y Alta Rápida de Clientes del Gimnasio
 * 4. Control de Aforo en Sala & Reportes CSV
 */

(function () {
  'use strict';

  // ==========================================
  // BASE DE DATOS INICIAL DE SOCIOS
  // ==========================================
  const INITIAL_MEMBERS = [
    {
      id: 'FF-COLON-00842',
      cedula: '28.412.983',
      name: 'Eduardo Ferreira',
      plan: 'Plan VIP Trimestral',
      price: 90.0,
      status: 'active',
      trainer: 'Carlos Méndez (Fuerza)',
      avatar: 'assets/img/trainer_carlos.jpg',
      daysLeft: 24,
      expiration: '07 Nov 2026',
      goal: 'Hipertrofia & Fuerza Explosiva',
      phone: '+58 412 8492019',
      notes: 'Miembro VIP Fundador. Rutina A (Piernas/Hombros).',
      attendancesCount: 42,
      dueAmount: 0.0
    },
    {
      id: 'FF-COLON-01492',
      cedula: '26.118.490',
      name: 'José Ramírez',
      plan: 'Plan Musculación Mensual',
      price: 35.0,
      status: 'active',
      trainer: 'Carlos Méndez (Fuerza)',
      avatar: 'assets/img/before_after_jose.jpg',
      daysLeft: 12,
      expiration: '26 Oct 2026',
      goal: 'Fuerza Máxima & Aumento Magro',
      phone: '+58 414 7829103',
      notes: 'Superó su récord en Press Banca ayer (+5kg).',
      attendancesCount: 28,
      dueAmount: 0.0
    },
    {
      id: 'FF-COLON-02381',
      cedula: '29.301.218',
      name: 'María Gómez',
      plan: 'Plan Pérdida de Grasa & HIIT',
      price: 40.0,
      status: 'active',
      trainer: 'Andrea Rivas (Pérdida)',
      avatar: 'assets/img/before_after_maria.jpg',
      daysLeft: 18,
      expiration: '02 Nov 2026',
      goal: 'Definición & Tonificación',
      phone: '+58 424 5519283',
      notes: 'Fija en clase funcional matutina.',
      attendancesCount: 35,
      dueAmount: 0.0
    },
    {
      id: 'FF-COLON-03910',
      cedula: '24.918.239',
      name: 'Carlos Mendoza',
      plan: 'Plan Mensual Clásico',
      price: 35.0,
      status: 'expired',
      trainer: 'Luis Morales (Funcional)',
      avatar: '',
      daysLeft: -3,
      expiration: '11 Oct 2026',
      goal: 'Resistencia Cardiovascular',
      phone: '+58 412 3918291',
      dueAmount: 35.0,
      notes: 'Pendiente pago del mes de Octubre.',
      attendancesCount: 19
    },
    {
      id: 'FF-COLON-04182',
      cedula: '27.481.902',
      name: 'Andrea Rivas',
      plan: 'Pase Anual Ferreira Black',
      price: 320.0,
      status: 'active',
      trainer: 'Staff Ferreira Team',
      avatar: 'assets/img/trainer_andrea.jpg',
      daysLeft: 194,
      expiration: '26 Abr 2027',
      goal: 'Acondicionamiento General',
      phone: '+58 416 8829102',
      notes: 'Acceso total barra de suplementos y toalla.',
      attendancesCount: 110,
      dueAmount: 0.0
    },
    {
      id: 'FF-COLON-05291',
      cedula: '30.192.482',
      name: 'Pedro Silva',
      plan: 'Pase de Día',
      price: 3.0,
      status: 'active',
      trainer: 'Sin entrenador asignado',
      avatar: '',
      daysLeft: 0,
      expiration: 'Hoy (22:00)',
      goal: 'Entrenamiento de Pierna Libre',
      phone: '+58 414 1182910',
      notes: 'Visitante recurrente de fin de semana.',
      attendancesCount: 4,
      dueAmount: 0.0
    },
    {
      id: 'FF-COLON-06183',
      cedula: '25.829.102',
      name: 'Marcos Peña',
      plan: 'Plan Mensual Clásico',
      price: 35.0,
      status: 'expired',
      trainer: 'Carlos Méndez (Fuerza)',
      avatar: '',
      daysLeft: -8,
      expiration: '06 Oct 2026',
      goal: 'Masa Muscular',
      phone: '+58 412 8829104',
      dueAmount: 35.0,
      notes: 'Notificado vía WhatsApp hace 2 días.',
      attendancesCount: 14
    },
    {
      id: 'FF-COLON-07291',
      cedula: '28.991.029',
      name: 'Sofia Benítez',
      plan: 'Plan VIP Trimestral',
      price: 90.0,
      status: 'active',
      trainer: 'Andrea Rivas (Pérdida)',
      avatar: '',
      daysLeft: 45,
      expiration: '28 Nov 2026',
      goal: 'Glúteos & Core',
      phone: '+58 424 9918291',
      notes: 'Al día en recepción.',
      attendancesCount: 22,
      dueAmount: 0.0
    },
    {
      id: 'FF-COLON-08102',
      cedula: '23.491.021',
      name: 'Daniela Colmenares',
      plan: 'Plan Pérdida de Grasa & HIIT',
      price: 40.0,
      status: 'expired',
      trainer: 'Andrea Rivas (Pérdida)',
      avatar: '',
      daysLeft: -5,
      expiration: '09 Oct 2026',
      goal: 'Reducción de Medidas',
      phone: '+58 414 6629102',
      dueAmount: 40.0,
      notes: 'Entrena en horario vespertino.',
      attendancesCount: 31
    },
    {
      id: 'FF-COLON-09412',
      cedula: '27.102.948',
      name: 'Javier Morales',
      plan: 'Plan Musculación Mensual',
      price: 35.0,
      status: 'active',
      trainer: 'Luis Morales (Funcional)',
      avatar: '',
      daysLeft: 4,
      expiration: '18 Oct 2026',
      goal: 'Fuerza Básica',
      phone: '+58 424 8819203',
      notes: 'Próximo a vencer en 4 días.',
      attendancesCount: 16,
      dueAmount: 0.0
    },
    {
      id: 'FF-COLON-10293',
      cedula: '29.849.201',
      name: 'Valentina Castillo',
      plan: 'Plan VIP Trimestral',
      price: 90.0,
      status: 'active',
      trainer: 'Carlos Méndez (Fuerza)',
      avatar: '',
      daysLeft: 6,
      expiration: '20 Oct 2026',
      goal: 'Tonificación Completa',
      phone: '+58 412 5591023',
      notes: 'Avisar renovación al salir.',
      attendancesCount: 39,
      dueAmount: 0.0
    },
    {
      id: 'FF-COLON-11482',
      cedula: '22.391.042',
      name: 'Roberto Torres',
      plan: 'Plan Mensual Clásico',
      price: 35.0,
      status: 'expired',
      trainer: 'Staff Ferreira Team',
      avatar: '',
      daysLeft: -12,
      expiration: '02 Oct 2026',
      goal: 'Salud y Movilidad',
      phone: '+58 416 3391028',
      dueAmount: 35.0,
      notes: 'Solicitó congelamiento pero no entregó justificativo.',
      attendancesCount: 8
    }
  ];

  // Storage Keys & Constants
  const STORAGE_MEMBERS = 'ff_gym_members_v2';
  const STORAGE_ATTENDANCE = 'ff_gym_attendance_v2';
  const MAX_CAPACITY = 60;

  // State
  let members = [];
  let attendance = [];
  let currentAttendanceFilter = 'all'; // 'all', 'inside', 'checked-out'
  let currentDirFilter = 'all'; // 'all', 'debtors', 'active', 'expiring'
  let selectedMemberId = null;
  let audioCtx = null;
  let cameraStream = null;

  // ==========================================
  // SINTETIZADOR DE AUDIO NATIVO (Web Audio API)
  // ==========================================
  function initAudio() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) audioCtx = new AudioContextClass();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playSuccessSound() {
    try {
      initAudio();
      if (!audioCtx) return;
      const now = audioCtx.currentTime;

      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, now);
      gain1.gain.setValueAtTime(0, now);
      gain1.gain.linearRampToValueAtTime(0.18, now + 0.04);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      osc1.start(now);
      osc1.stop(now + 0.22);

      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1318.5, now + 0.08);
      gain2.gain.setValueAtTime(0, now + 0.08);
      gain2.gain.linearRampToValueAtTime(0.22, now + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.38);
    } catch (_) {}
  }

  function playAlertSound() {
    try {
      initAudio();
      if (!audioCtx) return;
      const now = audioCtx.currentTime;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.setValueAtTime(240, now + 0.12);
      gain.gain.setValueAtTime(0.16, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    } catch (_) {}
  }

  // ==========================================
  // CARGA Y PERSISTENCIA DE DATOS
  // ==========================================
  function loadData() {
    try {
      const storedMembers = localStorage.getItem(STORAGE_MEMBERS);
      members = storedMembers ? JSON.parse(storedMembers) : [...INITIAL_MEMBERS];

      const storedAttendance = localStorage.getItem(STORAGE_ATTENDANCE);
      if (storedAttendance) {
        attendance = JSON.parse(storedAttendance);
      } else {
        const now = new Date();
        attendance = [
          {
            id: 'ATT-1',
            memberId: 'FF-COLON-01492',
            memberName: 'José Ramírez',
            cedula: '26.118.490',
            plan: 'Plan Musculación Mensual',
            status: 'inside',
            timeIn: formatHour(new Date(now.getTime() - 48 * 60000)),
            timeOut: null,
            method: 'QR Móvil'
          },
          {
            id: 'ATT-2',
            memberId: 'FF-COLON-02381',
            memberName: 'María Gómez',
            cedula: '29.301.218',
            plan: 'Plan Pérdida de Grasa & HIIT',
            status: 'inside',
            timeIn: formatHour(new Date(now.getTime() - 26 * 60000)),
            timeOut: null,
            method: 'Manual'
          },
          {
            id: 'ATT-3',
            memberId: 'FF-COLON-04182',
            memberName: 'Andrea Rivas',
            cedula: '27.481.902',
            plan: 'Pase Anual Ferreira Black',
            status: 'inside',
            timeIn: formatHour(new Date(now.getTime() - 15 * 60000)),
            timeOut: null,
            method: 'QR Móvil'
          }
        ];
        saveAttendance();
      }
    } catch (e) {
      members = [...INITIAL_MEMBERS];
      attendance = [];
    }

    if (!selectedMemberId && members.length > 0) {
      selectedMemberId = members[0].id;
    }
  }

  function saveMembers() {
    try {
      localStorage.setItem(STORAGE_MEMBERS, JSON.stringify(members));
    } catch (_) {}
  }

  function saveAttendance() {
    try {
      localStorage.setItem(STORAGE_ATTENDANCE, JSON.stringify(attendance));
    } catch (_) {}
  }

  // ==========================================
  // RELOJ DIGITAL EN VIVO
  // ==========================================
  function startClock() {
    const timeEl = document.getElementById('recClockTime');
    const dateEl = document.getElementById('recClockDate');
    if (!timeEl || !dateEl) return;

    function update() {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      timeEl.textContent = `${h}:${m}:${s}`;

      const options = { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' };
      const dateStr = now.toLocaleDateString('es-VE', options);
      dateEl.textContent = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
    }
    update();
    setInterval(update, 1000);
  }

  function formatHour(date) {
    const h = String(date.getHours()).padStart(2, '0');
    const m = String(date.getMinutes()).padStart(2, '0');
    const s = String(date.getSeconds()).padStart(2, '0');
    return `${h}:${m}:${s}`;
  }

  // ==========================================
  // NAVEGACIÓN ENTRE VISTAS (Check-in vs Cartera)
  // ==========================================
  function switchView(viewName) {
    const tabCheckin = document.getElementById('tabViewCheckin');
    const tabDirectory = document.getElementById('tabViewDirectory');
    const sectionCheckin = document.getElementById('viewCheckinSection');
    const sectionDirectory = document.getElementById('viewDirectorySection');

    if (!tabCheckin || !tabDirectory || !sectionCheckin || !sectionDirectory) return;

    if (viewName === 'checkin') {
      tabCheckin.classList.add('is-active');
      tabDirectory.classList.remove('is-active');
      sectionCheckin.classList.add('is-active');
      sectionDirectory.classList.remove('is-active');
      const searchInput = document.getElementById('recSearchInput');
      if (searchInput) searchInput.focus();
    } else {
      tabDirectory.classList.add('is-active');
      tabCheckin.classList.remove('is-active');
      sectionDirectory.classList.add('is-active');
      sectionCheckin.classList.remove('is-active');
      renderDirectory();
    }
  }

  function setupViewSwitcher() {
    const tabCheckin = document.getElementById('tabViewCheckin');
    const tabDirectory = document.getElementById('tabViewDirectory');

    if (tabCheckin) {
      tabCheckin.addEventListener('click', () => switchView('checkin'));
    }
    if (tabDirectory) {
      tabDirectory.addEventListener('click', () => switchView('directory'));
    }

    // Clics interactivos en las tarjetas KPI superiores
    const cardKpiAforo = document.getElementById('cardKpiAforo');
    if (cardKpiAforo) {
      cardKpiAforo.addEventListener('click', () => {
        switchView('checkin');
        const filterInsideBtn = document.querySelector('.rec-pill-btn[data-filter="inside"]');
        if (filterInsideBtn) filterInsideBtn.click();
        const tableCard = document.querySelector('.rec-table-card');
        if (tableCard) tableCard.scrollIntoView({ behavior: 'smooth' });
      });
    }

    const cardKpiSolvency = document.getElementById('cardKpiSolvency');
    if (cardKpiSolvency) {
      cardKpiSolvency.addEventListener('click', () => {
        switchView('directory');
        setDirectoryFilter('active');
      });
    }

    const cardKpiExpired = document.getElementById('cardKpiExpired');
    if (cardKpiExpired) {
      cardKpiExpired.addEventListener('click', () => {
        switchView('directory');
        setDirectoryFilter('debtors');
      });
    }
  }

  // ==========================================
  // KPIS GENERALES & RESUMEN DE CARTERA
  // ==========================================
  function updateKPIs() {
    const insideCount = attendance.filter((a) => a.status === 'inside').length;
    const totalToday = attendance.length;
    const debtorsList = members.filter((m) => m.status === 'expired');
    const expiredCount = debtorsList.length;
    const activeCount = members.filter((m) => m.status === 'active').length;
    const solvencyRate = members.length > 0 ? Math.round((activeCount / members.length) * 100) : 100;

    // Calcular deuda acumulada en USD
    const totalDebt = debtorsList.reduce((acc, m) => acc + (m.dueAmount || 35.0), 0);

    // KPIs Superiores
    const aforoNumEl = document.getElementById('kpiAforoNum');
    const aforoFillEl = document.getElementById('kpiAforoFill');
    const aforoSubEl = document.getElementById('kpiAforoSub');
    const todayNumEl = document.getElementById('kpiTodayNum');
    const solvencyNumEl = document.getElementById('kpiSolvencyNum');
    const expiredNumEl = document.getElementById('kpiExpiredNum');

    if (aforoNumEl) aforoNumEl.textContent = `${insideCount} / ${MAX_CAPACITY}`;
    if (todayNumEl) todayNumEl.textContent = String(totalToday);
    if (solvencyNumEl) solvencyNumEl.textContent = `${solvencyRate}%`;
    if (expiredNumEl) expiredNumEl.textContent = String(expiredCount);

    if (aforoFillEl) {
      const pct = Math.min(100, Math.round((insideCount / MAX_CAPACITY) * 100));
      aforoFillEl.style.width = `${pct}%`;
      aforoFillEl.classList.remove('is-moderate', 'is-peak');
      if (pct >= 85) {
        aforoFillEl.classList.add('is-peak');
        if (aforoSubEl) aforoSubEl.innerHTML = '<span style="color:#ef4444;font-weight:700;">🔴 Hora Pico</span> · Aforo al ' + pct + '%';
      } else if (pct >= 55) {
        aforoFillEl.classList.add('is-moderate');
        if (aforoSubEl) aforoSubEl.innerHTML = '<span style="color:#f59e0b;font-weight:700;">🟡 Ocupación Moderada</span> · Aforo al ' + pct + '%';
      } else {
        if (aforoSubEl) aforoSubEl.innerHTML = '<span style="color:#10b981;font-weight:700;">🟢 Espacio Óptimo</span> · Aforo al ' + pct + '%';
      }
    }

    // Badges en Tabs de Subheader
    const badgeInside = document.getElementById('badgeInsideCount');
    if (badgeInside) badgeInside.textContent = `${insideCount} en sala`;

    const badgeDebt = document.getElementById('badgeDebtCount');
    if (badgeDebt) badgeDebt.textContent = `${expiredCount} deudores`;

    // Resumen en la vista de Directorio
    const sumTotalEl = document.getElementById('summaryTotalMembers');
    const sumActiveEl = document.getElementById('summaryActiveMembers');
    const sumDebtEl = document.getElementById('summaryDebtMembers');
    const sumDebtAmtEl = document.getElementById('summaryTotalDebtAmount');

    if (sumTotalEl) sumTotalEl.textContent = String(members.length);
    if (sumActiveEl) sumActiveEl.textContent = `${activeCount} (${solvencyRate}%)`;
    if (sumDebtEl) sumDebtEl.textContent = `${expiredCount} socios`;
    if (sumDebtAmtEl) sumDebtAmtEl.textContent = `$${totalDebt.toFixed(2)} USD`;

    // Pills counts en Directorio
    const pillAll = document.getElementById('countPillAll');
    const pillDebtors = document.getElementById('countPillDebtors');
    const pillActive = document.getElementById('countPillActive');
    const pillExpiring = document.getElementById('countPillExpiring');

    const expiringCount = members.filter((m) => m.status === 'active' && m.daysLeft <= 7 && m.daysLeft >= 0).length;

    if (pillAll) pillAll.textContent = String(members.length);
    if (pillDebtors) pillDebtors.textContent = String(expiredCount);
    if (pillActive) pillActive.textContent = String(activeCount);
    if (pillExpiring) pillExpiring.textContent = String(expiringCount);
  }

  // ==========================================
  // CARTERA DE SOCIOS & GESTIÓN DE DEUDORES
  // ==========================================
  function setDirectoryFilter(filterName) {
    currentDirFilter = filterName;
    const buttons = document.querySelectorAll('.rec-pill-btn[data-dir-filter]');
    buttons.forEach((b) => {
      b.classList.toggle('is-active', b.dataset.dirFilter === filterName);
    });
    renderDirectory();
  }

  function setupDirectoryControls() {
    const filterButtons = document.querySelectorAll('.rec-pill-btn[data-dir-filter]');
    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        setDirectoryFilter(btn.dataset.dirFilter);
      });
    });

    const searchInput = document.getElementById('recDirSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        renderDirectory();
      });
    }
  }

  function getFilteredMembers() {
    const searchVal = (document.getElementById('recDirSearchInput')?.value || '').trim().toLowerCase();

    return members.filter((m) => {
      // Filtro de estado
      let matchesFilter = true;
      if (currentDirFilter === 'debtors') {
        matchesFilter = m.status === 'expired';
      } else if (currentDirFilter === 'active') {
        matchesFilter = m.status === 'active';
      } else if (currentDirFilter === 'expiring') {
        matchesFilter = m.status === 'active' && m.daysLeft <= 7 && m.daysLeft >= 0;
      }

      if (!matchesFilter) return false;

      // Filtro de texto
      if (!searchVal) return true;
      const cleanCedula = m.cedula.replace(/[\.\-\s]/g, '');
      const cleanSearch = searchVal.replace(/[\.\-\s]/g, '');

      return (
        m.name.toLowerCase().includes(searchVal) ||
        m.cedula.toLowerCase().includes(searchVal) ||
        cleanCedula.includes(cleanSearch) ||
        (m.phone && m.phone.includes(searchVal)) ||
        m.id.toLowerCase().includes(searchVal)
      );
    });
  }

  function renderDirectory() {
    const container = document.getElementById('recMemberListContainer');
    if (!container) return;

    const filtered = getFilteredMembers();

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="padding: 2.5rem 1rem; text-align: center; color: var(--muted); font-size: 0.88rem;">
          No se encontraron socios con este filtro o búsqueda.<br>
          <button type="button" class="btn btn--primary btnOpenNewMember" style="margin-top: 1rem; font-size: 0.8rem;">
            + Inscribir Nuevo Socio
          </button>
        </div>
      `;
      renderMemberDetail(null);
      return;
    }

    // Si el socio seleccionado no está en la lista filtrada, seleccionar el primero
    if (!filtered.some((m) => m.id === selectedMemberId)) {
      selectedMemberId = filtered[0].id;
    }

    container.innerHTML = filtered
      .map((m) => {
        const isSelected = m.id === selectedMemberId;
        const isDebtor = m.status === 'expired';
        const isExpiring = m.status === 'active' && m.daysLeft <= 7;

        let statusClass = isDebtor ? 'is-debtor' : 'is-active-member';
        let statusBadge = '';

        if (isDebtor) {
          statusBadge = `<span class="rec-mc-debt-pill">Debe $${(m.dueAmount || 35).toFixed(2)} (${Math.abs(m.daysLeft)}d)</span>`;
        } else if (isExpiring) {
          statusBadge = `<span class="rec-mc-solvency-pill" style="background:rgba(245,158,11,0.15);color:#f59e0b;border-color:rgba(245,158,11,0.3);">Vence en ${m.daysLeft} días</span>`;
        } else {
          statusBadge = `<span class="rec-mc-solvency-pill">Al Día (${m.daysLeft}d)</span>`;
        }

        const avatarHtml = m.avatar
          ? `<img src="${m.avatar}" class="rec-mc-avatar" alt="${m.name}">`
          : `<div class="rec-mc-avatar">${m.name.charAt(0)}</div>`;

        return `
        <div class="rec-member-card ${statusClass} ${isSelected ? 'is-selected' : ''}" data-member-id="${m.id}">
          <div class="rec-mc-left">
            ${avatarHtml}
            <div>
              <div class="rec-mc-name">${m.name}</div>
              <div class="rec-mc-sub">${m.id} · C.I. ${m.cedula}</div>
              <div class="rec-mc-sub" style="color: #ffffff; font-weight: 600;">${m.plan}</div>
            </div>
          </div>
          <div class="rec-mc-right">
            ${statusBadge}
            <span style="font-size: 0.72rem; color: var(--muted);">${m.phone || 'Sin WhatsApp'}</span>
          </div>
        </div>
      `;
      })
      .join('');

    // Listener de clic para seleccionar un socio
    container.querySelectorAll('.rec-member-card').forEach((card) => {
      card.addEventListener('click', () => {
        selectedMemberId = card.dataset.memberId;
        renderDirectory();
      });
    });

    // Renderizar detalle del seleccionado
    const selectedMember = members.find((m) => m.id === selectedMemberId) || filtered[0];
    renderMemberDetail(selectedMember);
  }

  function renderMemberDetail(member) {
    const pane = document.getElementById('recMemberDetailPane');
    if (!pane) return;

    if (!member) {
      pane.innerHTML = `
        <div style="padding: 3rem 1rem; text-align: center; color: var(--muted);">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">👥</div>
          <h4 style="font-family: var(--font-display); font-size: 1.4rem; color: #fff;">SIN SOCIO SELECCIONADO</h4>
          <p style="font-size: 0.85rem;">Selecciona un socio de la lista para ver su estado financiero y cobrar.</p>
        </div>
      `;
      return;
    }

    const isDebtor = member.status === 'expired';
    const isExpiring = member.status === 'active' && member.daysLeft <= 7;
    const dueAmount = (member.dueAmount || member.price || 35.0).toFixed(2);

    const avatarHtml = member.avatar
      ? `<img src="${member.avatar}" class="rec-mp-avatar" alt="${member.name}">`
      : `<div class="rec-mp-avatar">${member.name.charAt(0)}</div>`;

    // Mensaje pre-llenado de WhatsApp profesional
    const cleanPhone = (member.phone || '').replace(/[^0-9]/g, '');
    const reminderMsg = encodeURIComponent(
      `*Recordatorio de Pago – Ferreira Fitness GYM* 🏋️\n\n` +
      `Hola ${member.name}, te escribimos de recepción de Ferreira Fitness GYM.\n` +
      `Te recordamos que tu cuota correspondiente a *${member.plan}* tiene un saldo pendiente de *$${dueAmount} USD* (venció el ${member.expiration}).\n\n` +
      `Puedes pasar renovando por recepción (Efectivo, Pago Móvil o Punto de Venta) para mantener tu carnet activo. ¡Te esperamos para seguir entrenando fuerte!`
    );

    const whatsappUrl = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${reminderMsg}`
      : `https://wa.me/?text=${reminderMsg}`;

    pane.innerHTML = `
      <div class="rec-member-profile">
        ${avatarHtml}
        <div class="rec-mp-name">${member.name}</div>
        <div class="rec-mp-meta">${member.id} · C.I. ${member.cedula}</div>
        <div style="display:inline-flex; align-items:center; gap:0.4rem; font-size:0.82rem; color:#fff; background:var(--surface-2); padding:0.3rem 0.75rem; border-radius:999px; border:1px solid var(--border);">
          <span>📱 ${member.phone || 'Teléfono no registrado'}</span>
        </div>
      </div>

      <!-- Cuadro Financiero -->
      <div class="rec-finance-box ${isDebtor ? 'is-debtor' : ''}">
        <div class="rec-finance-header">
          <span style="font-size:0.75rem; font-weight:700; color:var(--muted); text-transform:uppercase;">
            Estado de Membresía
          </span>
          <span class="${isDebtor ? 'rec-badge-expired' : 'rec-badge-active'}">
            ${isDebtor ? '🔴 PAGO VENCIDO' : (isExpiring ? '🟡 POR VENCER' : '🟢 AL DÍA / SOLVENTE')}
          </span>
        </div>

        <div class="rec-finance-grid">
          <div>
            <div style="font-size:0.7rem; color:var(--muted); font-weight:700; text-transform:uppercase;">Plan Asignado</div>
            <div style="font-size:0.95rem; font-weight:700; color:#fff;">${member.plan}</div>
          </div>
          <div>
            <div style="font-size:0.7rem; color:var(--muted); font-weight:700; text-transform:uppercase;">Costo del Plan</div>
            <div style="font-size:0.95rem; font-weight:700; color:#fff;">$${(member.price || 35).toFixed(2)} USD</div>
          </div>
          <div>
            <div style="font-size:0.7rem; color:var(--muted); font-weight:700; text-transform:uppercase;">Vencimiento</div>
            <div style="font-size:0.95rem; font-weight:700; color:${isDebtor ? '#f87171' : '#34d399'};">
              ${isDebtor ? 'Venció hace ' + Math.abs(member.daysLeft) + ' días' : member.expiration}
            </div>
          </div>
          <div>
            <div style="font-size:0.7rem; color:var(--muted); font-weight:700; text-transform:uppercase;">Total Adeudado</div>
            <div style="font-size:1.3rem; font-family:var(--font-display); color:${isDebtor ? '#f87171' : '#34d399'};">
              $${isDebtor ? dueAmount : '0.00'} USD
            </div>
          </div>
        </div>
      </div>

      <!-- Cuadro de Entrenamiento & Salud -->
      <div style="background:#0d0d0d; border:1px solid var(--border); border-radius:var(--radius-sm); padding:1rem; margin-bottom:1.5rem; text-align:left;">
        <div style="display:flex; justify-content:space-between; margin-bottom:0.6rem;">
          <div>
            <span style="font-size:0.7rem; font-weight:700; color:var(--muted); text-transform:uppercase;">Entrenador Asignado:</span>
            <div style="font-size:0.9rem; font-weight:700; color:#fff;">${member.trainer || 'Ferreira Team'}</div>
          </div>
          <div style="text-align:right;">
            <span style="font-size:0.7rem; font-weight:700; color:var(--muted); text-transform:uppercase;">Asistencias Totales:</span>
            <div style="font-size:1.1rem; font-family:var(--font-display); color:#fff;">${member.attendancesCount || 0} visitas</div>
          </div>
        </div>
        <div>
          <span style="font-size:0.7rem; font-weight:700; color:var(--muted); text-transform:uppercase;">Notas / Meta:</span>
          <p style="font-size:0.8rem; color:var(--muted); margin-top:0.2rem; line-height:1.4;">
            ${member.notes || member.goal || 'Sin observaciones registradas.'}
          </p>
        </div>
      </div>

      <!-- Acciones de Gestión de Cobro -->
      <div class="rec-profile-actions">
        <button type="button" class="btn btn--primary" id="btnDetailRenew" style="width:100%; justify-content:center;">
          💵 Cobrar en Recepción & Renovar Membresía
        </button>

        ${isDebtor || isExpiring ? `
          <a href="${whatsappUrl}" target="_blank" rel="noopener" class="rec-btn-whatsapp">
            <svg viewBox="0 0 32 32" width="20" height="20" fill="currentColor"><path d="M16 3C9 3 3.3 8.6 3.3 15.6c0 2.2.6 4.4 1.7 6.3L3 29l7.3-1.9c1.8 1 3.8 1.5 5.8 1.5 7 0 12.7-5.6 12.7-12.6S23 3 16 3zm0 23.1c-1.9 0-3.7-.5-5.3-1.4l-.4-.2-4.3 1.1 1.2-4.2-.3-.4c-1-1.6-1.5-3.5-1.5-5.4C5.4 9.9 10.2 5.2 16 5.2s10.6 4.7 10.6 10.4S21.8 26.1 16 26.1zm5.8-7.8c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.5-1.6-.9-.8-1.6-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.6c.2-.2.2-.3.3-.6.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.1 1.1-1.1 2.7s1.2 3.1 1.3 3.3c.2.2 2.3 3.5 5.5 4.9.8.3 1.4.5 1.9.7.8.2 1.5.2 2.1.1.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.7-.4z"/></svg>
            Enviar Recordatorio por WhatsApp
          </a>
        ` : ''}

        <div style="display:flex; gap:0.5rem; margin-top:0.25rem;">
          <button type="button" class="rec-btn-ghost" id="btnDetailCheckIn" style="flex:1; justify-content:center;">
            ⚡ Marcar Entrada Hoy
          </button>
          <button type="button" class="rec-btn-ghost" id="btnDetailDelete" style="color:#ef4444; border-color:rgba(239,68,68,0.3);" title="Dar de baja socio">
            🗑️ Dar de Baja
          </button>
        </div>
      </div>
    `;

    // Bindings de botones en la ficha detallada
    const btnDetailRenew = document.getElementById('btnDetailRenew');
    if (btnDetailRenew) {
      btnDetailRenew.addEventListener('click', () => openRenewModal(member));
    }

    const btnDetailCheckIn = document.getElementById('btnDetailCheckIn');
    if (btnDetailCheckIn) {
      btnDetailCheckIn.addEventListener('click', () => {
        switchView('checkin');
        handleCheckIn(member, 'Manual (Desde Ficha)');
      });
    }

    const btnDetailDelete = document.getElementById('btnDetailDelete');
    if (btnDetailDelete) {
      btnDetailDelete.addEventListener('click', () => {
        if (confirm(`¿Estás seguro de dar de baja a ${member.name} (${member.id})?`)) {
          members = members.filter((m) => m.id !== member.id);
          saveMembers();
          showToast(`Socio ${member.name} eliminado de la cartera.`);
          selectedMemberId = members.length > 0 ? members[0].id : null;
          updateKPIs();
          renderDirectory();
        }
      });
    }
  }

  // ==========================================
  // BUSCADOR RÁPIDO PARA CHECK-IN
  // ==========================================
  function setupSearch() {
    const input = document.getElementById('recSearchInput');
    const resultsBox = document.getElementById('recSearchResults');
    if (!input || !resultsBox) return;

    input.addEventListener('input', (e) => {
      const query = e.target.value.trim().toLowerCase();
      if (!query) {
        resultsBox.classList.remove('is-open');
        resultsBox.innerHTML = '';
        return;
      }

      const matches = members.filter((m) => {
        const cleanCedula = m.cedula.replace(/[\.\-\s]/g, '');
        const cleanQuery = query.replace(/[\.\-\s]/g, '');
        return (
          m.name.toLowerCase().includes(query) ||
          m.id.toLowerCase().includes(query) ||
          m.cedula.toLowerCase().includes(query) ||
          cleanCedula.includes(cleanQuery)
        );
      });

      renderSearchResults(matches);
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const firstItem = resultsBox.querySelector('.rec-result-item');
        if (firstItem) {
          const memberId = firstItem.dataset.id;
          const member = members.find((m) => m.id === memberId);
          if (member) {
            handleCheckIn(member, 'Manual');
            input.value = '';
            resultsBox.classList.remove('is-open');
          }
        }
      } else if (e.key === 'Escape') {
        input.value = '';
        resultsBox.classList.remove('is-open');
      }
    });

    document.addEventListener('click', (e) => {
      if (!input.contains(e.target) && !resultsBox.contains(e.target)) {
        resultsBox.classList.remove('is-open');
      }
    });
  }

  function renderSearchResults(matches) {
    const resultsBox = document.getElementById('recSearchResults');
    if (!resultsBox) return;

    if (matches.length === 0) {
      resultsBox.innerHTML = `
        <div style="padding: 1.25rem; text-align: center; color: var(--muted); font-size: 0.85rem;">
          No se encontró ningún socio con esos datos.<br>
          <button type="button" class="rec-btn-ghost btnOpenNewMember" style="margin-top: 0.75rem; font-size: 0.78rem;">
            + Inscribir Nuevo Socio
          </button>
        </div>
      `;
      resultsBox.classList.add('is-open');

      const btnNew = resultsBox.querySelector('.btnOpenNewMember');
      if (btnNew) {
        btnNew.addEventListener('click', () => openNewMemberModal());
      }
      return;
    }

    resultsBox.innerHTML = matches
      .map((m) => {
        const isExpired = m.status === 'expired';
        const badge = isExpired
          ? `<span class="rec-badge-expired">Debe $${(m.dueAmount || 35).toFixed(2)}</span>`
          : '<span class="rec-badge-active">Al Día</span>';
        const avatar = m.avatar
          ? `<img src="${m.avatar}" class="rec-result-avatar" alt="${m.name}">`
          : `<div class="rec-result-avatar">${m.name.charAt(0)}</div>`;

        return `
        <div class="rec-result-item" data-id="${m.id}">
          <div class="rec-result-info">
            ${avatar}
            <div>
              <div class="rec-result-name">${m.name}</div>
              <div class="rec-result-meta">${m.id} · C.I. ${m.cedula} · ${m.plan}</div>
            </div>
          </div>
          <div>${badge}</div>
        </div>
      `;
      })
      .join('');

    resultsBox.classList.add('is-open');

    resultsBox.querySelectorAll('.rec-result-item').forEach((item) => {
      item.addEventListener('click', () => {
        const memberId = item.dataset.id;
        const member = members.find((m) => m.id === memberId);
        if (member) {
          handleCheckIn(member, 'Manual');
          const input = document.getElementById('recSearchInput');
          if (input) input.value = '';
          resultsBox.classList.remove('is-open');
        }
      });
    });
  }

  // ==========================================
  // FEEDBACK EN PANTALLA GIGANTE (CHECK-IN)
  // ==========================================
  function handleCheckIn(member, method = 'Manual') {
    const cardEl = document.getElementById('recValidationCard');
    const idleEl = document.getElementById('recValIdle');
    const resultEl = document.getElementById('recValResult');
    if (!cardEl || !idleEl || !resultEl) return;

    const isExpired = member.status === 'expired';

    if (isExpired) {
      playAlertSound();
    } else {
      playSuccessSound();
    }

    cardEl.classList.remove('is-success', 'is-expired');
    cardEl.classList.add(isExpired ? 'is-expired' : 'is-success');

    idleEl.style.display = 'none';
    resultEl.classList.add('is-visible');

    const avatarHtml = member.avatar
      ? `<img src="${member.avatar}" class="rec-val-avatar" alt="${member.name}">`
      : `<div class="rec-val-avatar">${member.name.charAt(0)}</div>`;

    const bannerHtml = isExpired
      ? `<div class="rec-val-banner is-expired">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
           ACCESO DENEGADO · MEMBRESÍA VENCIDA
         </div>`
      : `<div class="rec-val-banner is-success">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
           ACCESO AUTORIZADO · PLAN VIP ACTIVO
         </div>`;

    const actionsHtml = isExpired
      ? `
        <button type="button" class="btn btn--primary" id="btnRenewPayment" style="background:#ef4444;border-color:#ef4444;color:#fff;">
          💵 Cobrar & Renovar (\$${(member.dueAmount || 35.0).toFixed(2)})
        </button>
        <button type="button" class="rec-btn-ghost" id="btnGracePass">
          ⏱️ Conceder Pase de Gracia (1 Día)
        </button>
      `
      : `
        <button type="button" class="btn btn--primary" id="btnConfirmAccess">
          ✅ Confirmar Entrada (Enter)
        </button>
        <button type="button" class="rec-btn-ghost" id="btnToggleExit">
          🚪 Marcar Salida
        </button>
      `;

    resultEl.innerHTML = `
      ${bannerHtml}
      <div class="rec-val-avatar-wrap">
        ${avatarHtml}
      </div>
      <div class="rec-val-name">${member.name}</div>
      <div class="rec-val-id">${member.id} · C.I. ${member.cedula}</div>

      <div class="rec-val-details">
        <div class="rec-detail-item">
          <span class="rec-detail-label">Plan de Entrenamiento</span>
          <span class="rec-detail-value">${member.plan}</span>
        </div>
        <div class="rec-detail-item">
          <span class="rec-detail-label">Vencimiento</span>
          <span class="rec-detail-value" style="color: ${isExpired ? '#f87171' : '#34d399'};">
            ${isExpired ? 'Venció hace ' + Math.abs(member.daysLeft) + ' días' : member.expiration}
          </span>
        </div>
        <div class="rec-detail-item">
          <span class="rec-detail-label">Entrenador Asignado</span>
          <span class="rec-detail-value">${member.trainer || 'Ferreira Team'}</span>
        </div>
        <div class="rec-detail-item">
          <span class="rec-detail-label">Método de Check-in</span>
          <span class="rec-detail-value">${method} (${formatHour(new Date())})</span>
        </div>
      </div>

      <div class="rec-val-actions">
        ${actionsHtml}
      </div>
    `;

    if (!isExpired) {
      registerAttendance(member, method);
    }

    const btnRenew = document.getElementById('btnRenewPayment');
    if (btnRenew) {
      btnRenew.addEventListener('click', () => openRenewModal(member));
    }

    const btnGrace = document.getElementById('btnGracePass');
    if (btnGrace) {
      btnGrace.addEventListener('click', () => {
        registerAttendance(member, `${method} (Pase de Gracia)`);
        showToast(`Pase de gracia concedido a ${member.name}.`);
        resetValidationCard(1500);
      });
    }

    const btnConfirm = document.getElementById('btnConfirmAccess');
    if (btnConfirm) {
      btnConfirm.addEventListener('click', () => {
        resetValidationCard(400);
      });
    }

    const btnToggleExit = document.getElementById('btnToggleExit');
    if (btnToggleExit) {
      btnToggleExit.addEventListener('click', () => {
        checkOutMemberById(member.id);
        resetValidationCard(400);
      });
    }
  }

  function registerAttendance(member, method) {
    const existingIndex = attendance.findIndex((a) => a.memberId === member.id && a.status === 'inside');

    if (existingIndex !== -1) {
      showToast(`${member.name} ya se encontraba registrado en sala.`);
      return;
    }

    member.attendancesCount = (member.attendancesCount || 0) + 1;
    saveMembers();

    const newRecord = {
      id: 'ATT-' + Date.now(),
      memberId: member.id,
      memberName: member.name,
      cedula: member.cedula,
      plan: member.plan,
      status: 'inside',
      timeIn: formatHour(new Date()),
      timeOut: null,
      method: method
    };

    attendance.unshift(newRecord);
    saveAttendance();
    renderAttendanceTable();
    updateKPIs();
    showToast(`✅ Acceso concedido: ${member.name}`);
  }

  function checkOutMemberById(memberId) {
    const record = attendance.find((a) => a.memberId === memberId && a.status === 'inside');
    if (record) {
      record.status = 'checked-out';
      record.timeOut = formatHour(new Date());
      saveAttendance();
      renderAttendanceTable();
      updateKPIs();
      showToast(`🚪 Salida registrada: ${record.memberName}`);
    } else {
      showToast(`El socio no tiene una entrada activa registrada.`);
    }
  }

  function resetValidationCard(delayMs = 0) {
    setTimeout(() => {
      const cardEl = document.getElementById('recValidationCard');
      const idleEl = document.getElementById('recValIdle');
      const resultEl = document.getElementById('recValResult');
      if (cardEl && idleEl && resultEl) {
        cardEl.classList.remove('is-success', 'is-expired');
        idleEl.style.display = 'flex';
        resultEl.classList.remove('is-visible');
        resultEl.innerHTML = '';
      }
      const searchInput = document.getElementById('recSearchInput');
      if (searchInput) searchInput.focus();
    }, delayMs);
  }

  // ==========================================
  // TABLA DE ASISTENCIAS DEL DÍA
  // ==========================================
  function renderAttendanceTable() {
    const tbody = document.getElementById('recTableBody');
    if (!tbody) return;

    let filtered = attendance;
    if (currentAttendanceFilter === 'inside') {
      filtered = attendance.filter((a) => a.status === 'inside');
    } else if (currentAttendanceFilter === 'checked-out') {
      filtered = attendance.filter((a) => a.status === 'checked-out');
    }

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 2rem; color: var(--muted);">
            No hay asistencias registradas con este filtro.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = filtered
      .map((item) => {
        const isInside = item.status === 'inside';
        const statusBadge = isInside
          ? `<span class="rec-badge-in">🟢 En Sala</span>`
          : `<span class="rec-badge-out">⚪ Salió (${item.timeOut})</span>`;

        const actionBtn = isInside
          ? `<button type="button" class="rec-action-checkout" data-checkout="${item.id}">Marcar Salida</button>`
          : `<span style="font-size: 0.75rem; color: var(--muted);">Completado</span>`;

        return `
        <tr>
          <td style="font-family: var(--font-display); font-size: 1.1rem; letter-spacing: 0.8px;">${item.timeIn}</td>
          <td>
            <div class="rec-cell-user">
              <div class="rec-table-avatar" style="display:grid;place-items:center;font-weight:700;font-size:0.8rem;">
                ${item.memberName.charAt(0)}
              </div>
              <div>
                <strong style="color: #ffffff;">${item.memberName}</strong>
                <div style="font-size: 0.72rem; color: var(--muted);">${item.cedula}</div>
              </div>
            </div>
          </td>
          <td><span style="font-size: 0.8rem; color: var(--muted);">${item.plan}</span></td>
          <td><span style="font-size: 0.78rem; font-weight: 600;">${item.method}</span></td>
          <td>${statusBadge}</td>
          <td>${actionBtn}</td>
        </tr>
      `;
      })
      .join('');

    tbody.querySelectorAll('[data-checkout]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const attId = btn.dataset.checkout;
        const record = attendance.find((a) => a.id === attId);
        if (record) {
          record.status = 'checked-out';
          record.timeOut = formatHour(new Date());
          saveAttendance();
          renderAttendanceTable();
          updateKPIs();
          showToast(`Salida registrada para ${record.memberName}`);
        }
      });
    });
  }

  function setupAttendanceFilters() {
    const filterBtns = document.querySelectorAll('.rec-pill-btn[data-filter]');
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        currentAttendanceFilter = btn.dataset.filter;
        renderAttendanceTable();
      });
    });
  }

  // ==========================================
  // ESCÁNER QR & CÁMARA WEBCAM
  // ==========================================
  function setupTabs() {
    const tabSearch = document.getElementById('tabModeSearch');
    const tabScanner = document.getElementById('tabModeScanner');
    const panelSearch = document.getElementById('panelSearch');
    const panelScanner = document.getElementById('panelScanner');

    if (!tabSearch || !tabScanner || !panelSearch || !panelScanner) return;

    tabSearch.addEventListener('click', () => {
      tabSearch.classList.add('is-active');
      tabScanner.classList.remove('is-active');
      panelSearch.style.display = 'block';
      panelScanner.classList.remove('is-active');
      stopCamera();
      const input = document.getElementById('recSearchInput');
      if (input) input.focus();
    });

    tabScanner.addEventListener('click', () => {
      tabScanner.classList.add('is-active');
      tabSearch.classList.remove('is-active');
      panelSearch.style.display = 'none';
      panelScanner.classList.add('is-active');
      startCamera();
    });
  }

  async function startCamera() {
    const video = document.getElementById('recScannerVideo');
    if (!video) return;

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        cameraStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        video.srcObject = cameraStream;
        video.play();
      }
    } catch (err) {
      console.log('Cámara no disponible o permisos denegados. Usando modo simulación.');
    }
  }

  function stopCamera() {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      cameraStream = null;
    }
  }

  // ==========================================
  // ESCÁNER DE PISTOLA USB (Lectura por Teclado)
  // ==========================================
  function setupUsbBarcodeListener() {
    let barcodeBuffer = '';
    let lastKeyTime = Date.now();

    window.addEventListener('keydown', (e) => {
      const activeTag = document.activeElement ? document.activeElement.tagName : '';
      if (activeTag === 'INPUT' || activeTag === 'TEXTAREA') {
        return;
      }

      const currentTime = Date.now();
      if (currentTime - lastKeyTime > 120) {
        barcodeBuffer = '';
      }
      lastKeyTime = currentTime;

      if (e.key === 'Enter') {
        if (barcodeBuffer.length >= 3) {
          processScannedPayload(barcodeBuffer);
        }
        barcodeBuffer = '';
      } else if (e.key.length === 1) {
        barcodeBuffer += e.key;
      }
    });
  }

  function processScannedPayload(payload) {
    let lookup = payload.trim();
    if (lookup.startsWith('FERREIRA_FITNESS_MEMBER:')) {
      const parts = lookup.split(':');
      lookup = parts[1] || parts[0];
    }

    const member = members.find((m) => {
      return (
        m.id.toLowerCase() === lookup.toLowerCase() ||
        m.id.toLowerCase().includes(lookup.toLowerCase()) ||
        m.cedula.replace(/[\.\-\s]/g, '') === lookup.replace(/[\.\-\s]/g, '')
      );
    });

    if (member) {
      handleCheckIn(member, '📱 QR Móvil');
    } else {
      playAlertSound();
      showToast(`Código escaneado no reconocido: ${lookup}`);
    }
  }

  function setupDemoChips() {
    const chips = document.querySelectorAll('.rec-demo-chip[data-demo-id]');
    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        const id = chip.dataset.demoId;
        const member = members.find((m) => m.id === id);
        if (member) {
          handleCheckIn(member, '📱 QR Móvil');
        }
      });
    });
  }

  // ==========================================
  // MODALES (COBRO Y NUEVO SOCIO)
  // ==========================================
  function openRenewModal(member) {
    const modal = document.getElementById('recModalRenew');
    if (!modal) return;

    document.getElementById('renewMemberName').textContent = member.name;
    document.getElementById('renewMemberId').textContent = `${member.id} · C.I. ${member.cedula}`;
    document.getElementById('renewAmount').textContent = `$${(member.dueAmount || member.price || 35.0).toFixed(2)} USD`;

    modal.classList.add('is-open');

    const form = document.getElementById('renewForm');
    const handleForm = (e) => {
      e.preventDefault();
      const method = document.getElementById('renewMethod').value;

      member.status = 'active';
      member.daysLeft = 30;
      member.dueAmount = 0.0;
      const d = new Date();
      d.setDate(d.getDate() + 30);
      member.expiration = d.toLocaleDateString('es-VE', { day: '2-digit', month: 'short', year: 'numeric' });
      saveMembers();

      modal.classList.remove('is-open');
      form.removeEventListener('submit', handleForm);

      playSuccessSound();
      showToast(`Membresía renovada con éxito (${method}).`);
      updateKPIs();
      renderDirectory();

      // Si estábamos en check-in, actualizar la tarjeta de validación
      const sectionCheckin = document.getElementById('viewCheckinSection');
      if (sectionCheckin && sectionCheckin.classList.contains('is-active')) {
        handleCheckIn(member, 'Recepción (Pago Renovado)');
      }
    };

    form.onsubmit = handleForm;
  }

  function openNewMemberModal() {
    const modal = document.getElementById('recModalNewMember');
    if (!modal) return;
    modal.classList.add('is-open');

    const form = document.getElementById('newMemberForm');
    form.onsubmit = (e) => {
      e.preventDefault();
      const name = document.getElementById('newMemberName').value.trim();
      const cedula = document.getElementById('newMemberCedula').value.trim();
      const phone = document.getElementById('newMemberPhone').value.trim() || '+58 412 0000000';
      const plan = document.getElementById('newMemberPlan').value;
      const trainer = document.getElementById('newMemberTrainer').value;
      const initialStatus = document.getElementById('newMemberInitialPayment').value;
      const notes = document.getElementById('newMemberNotes').value.trim();

      // Determinar precio del plan
      let planPrice = 35.0;
      if (plan.includes('VIP')) planPrice = 90.0;
      else if (plan.includes('Pérdida')) planPrice = 40.0;
      else if (plan.includes('Anual')) planPrice = 320.0;
      else if (plan.includes('Día')) planPrice = 3.0;

      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const isPaid = initialStatus === 'active';

      const newMember = {
        id: `FF-COLON-${randomSuffix}`,
        cedula: cedula,
        name: name,
        phone: phone,
        plan: plan,
        price: planPrice,
        status: initialStatus,
        trainer: trainer,
        avatar: '',
        daysLeft: isPaid ? 30 : -1,
        expiration: isPaid
          ? new Date(Date.now() + 30 * 86400000).toLocaleDateString('es-VE', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })
          : 'Pendiente de Pago',
        goal: 'Entrenamiento Integral',
        notes: notes || 'Inscripción en mostrador de recepción.',
        attendancesCount: isPaid ? 1 : 0,
        dueAmount: isPaid ? 0.0 : planPrice
      };

      members.unshift(newMember);
      saveMembers();

      modal.classList.remove('is-open');
      form.reset();

      playSuccessSound();
      showToast(`¡Socio inscrito con éxito!: ${newMember.name}`);
      selectedMemberId = newMember.id;
      updateKPIs();
      renderDirectory();

      // Si está pagado, registrar entrada directa en check-in
      if (isPaid) {
        handleCheckIn(newMember, 'Inscripción en Recepción');
      }
    };
  }

  function setupModals() {
    const closeBtns = document.querySelectorAll('[data-close-modal]');
    closeBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.modal').forEach((m) => m.classList.remove('is-open'));
      });
    });

    const newMemberButtons = document.querySelectorAll('.btnOpenNewMember');
    newMemberButtons.forEach((btn) => {
      btn.addEventListener('click', () => openNewMemberModal());
    });

    const btnSimulateScan = document.getElementById('btnSimulateScan');
    if (btnSimulateScan) {
      btnSimulateScan.addEventListener('click', () => {
        const eduardo = members.find((m) => m.id === 'FF-COLON-00842') || members[0];
        handleCheckIn(eduardo, '📱 QR Móvil');
      });
    }

    const btnExport = document.getElementById('btnExportCsv');
    if (btnExport) {
      btnExport.addEventListener('click', () => exportAttendanceCsv());
    }

    const btnFullscreen = document.getElementById('btnToggleFullscreen');
    if (btnFullscreen) {
      btnFullscreen.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
      });
    }

    const btnReset = document.getElementById('btnResetDemoData');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        if (confirm('¿Restablecer cartera de socios y asistencias a valores iniciales de demostración?')) {
          localStorage.removeItem(STORAGE_MEMBERS);
          localStorage.removeItem(STORAGE_ATTENDANCE);
          loadData();
          renderAttendanceTable();
          updateKPIs();
          renderDirectory();
          showToast('Datos demo restaurados con éxito.');
        }
      });
    }
  }

  function exportAttendanceCsv() {
    if (attendance.length === 0) {
      showToast('No hay asistencias para exportar hoy.');
      return;
    }

    const headers = ['Hora Entrada', 'Nombre', 'Cedula', 'Plan', 'Metodo', 'Estado', 'Hora Salida'];
    const rows = attendance.map((a) => [
      a.timeIn,
      `"${a.memberName}"`,
      `"${a.cedula}"`,
      `"${a.plan}"`,
      `"${a.method}"`,
      a.status === 'inside' ? 'En Sala' : 'Salida',
      a.timeOut || ''
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Ferreira_Fitness_Asistencias_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Reporte CSV descargado con éxito.');
  }

  function showToast(message) {
    const toast = document.getElementById('recToast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.classList.remove('is-show');
    }, 3200);
  }

  // ==========================================
  // INICIALIZACIÓN GENERAL
  // ==========================================
  document.addEventListener('DOMContentLoaded', () => {
    loadData();
    startClock();
    updateKPIs();
    renderAttendanceTable();
    setupSearch();
    setupAttendanceFilters();
    setupTabs();
    setupUsbBarcodeListener();
    setupDemoChips();
    setupModals();
    setupViewSwitcher();
    setupDirectoryControls();
    renderDirectory();

    const searchInput = document.getElementById('recSearchInput');
    if (searchInput) searchInput.focus();
  });
})();
