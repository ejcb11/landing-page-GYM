/**
 * Ferreira Fitness GYM – Sistema de Recepción y Control de Acceso
 * Gestión de asistencias, verificación de membresías, escaneo QR y aforo en sala.
 */

(function () {
  'use strict';

  // ==========================================
  // BASE DE DATOS INICIAL DE SOCIOS (Mock & LocalStorage)
  // ==========================================
  const INITIAL_MEMBERS = [
    {
      id: 'FF-COLON-00842',
      cedula: '28.412.983',
      name: 'Eduardo Ferreira',
      plan: 'Plan VIP Trimestral',
      status: 'active',
      trainer: 'Carlos Méndez (Fuerza)',
      avatar: 'assets/img/trainer_carlos.jpg',
      daysLeft: 24,
      expiration: '07 Nov 2026',
      goal: 'Hipertrofia & Fuerza Explosiva',
      phone: '+58 412 8492019',
      notes: 'Miembro VIP Fundador. Rutina A (Piernas/Hombros).'
    },
    {
      id: 'FF-COLON-01492',
      cedula: '26.118.490',
      name: 'José Ramírez',
      plan: 'Plan Musculación Mensual',
      status: 'active',
      trainer: 'Carlos Méndez (Fuerza)',
      avatar: 'assets/img/before_after_jose.jpg',
      daysLeft: 12,
      expiration: '26 Oct 2026',
      goal: 'Fuerza Máxima & Aumento Magro',
      phone: '+58 414 7829103',
      notes: 'Superó su récord en Press Banca ayer (+5kg).'
    },
    {
      id: 'FF-COLON-02381',
      cedula: '29.301.218',
      name: 'María Gómez',
      plan: 'Plan Pérdida de Grasa & HIIT',
      status: 'active',
      trainer: 'Andrea Rivas (Pérdida)',
      avatar: 'assets/img/before_after_maria.jpg',
      daysLeft: 18,
      expiration: '02 Nov 2026',
      goal: 'Definición & Tonificación',
      phone: '+58 424 5519283',
      notes: 'Fija en clase funcional matutina.'
    },
    {
      id: 'FF-COLON-03910',
      cedula: '24.918.239',
      name: 'Carlos Mendoza',
      plan: 'Plan Mensual Clásico',
      status: 'expired',
      trainer: 'Luis Morales (Funcional)',
      avatar: '',
      daysLeft: -3,
      expiration: '11 Oct 2026',
      goal: 'Resistencia Cardiovascular',
      phone: '+58 412 3918291',
      dueAmount: 35.0,
      notes: 'Pendiente pago mes de Octubre.'
    },
    {
      id: 'FF-COLON-04182',
      cedula: '27.481.902',
      name: 'Andrea Rivas',
      plan: 'Pase Anual Ferreira Black',
      status: 'active',
      trainer: 'Staff Ferreira Team',
      avatar: 'assets/img/trainer_andrea.jpg',
      daysLeft: 194,
      expiration: '26 Abr 2027',
      goal: 'Acondicionamiento General',
      phone: '+58 416 8829102',
      notes: 'Acceso total barra de suplementos y toalla.'
    },
    {
      id: 'FF-COLON-05291',
      cedula: '30.192.482',
      name: 'Pedro Silva',
      plan: 'Pase de Día',
      status: 'active',
      trainer: 'Sin entrenador asignado',
      avatar: '',
      daysLeft: 0,
      expiration: 'Hoy (22:00)',
      goal: 'Entrenamiento de Pierna Libre',
      phone: '+58 414 1182910',
      notes: 'Visitante recurrente.'
    },
    {
      id: 'FF-COLON-06183',
      cedula: '25.829.102',
      name: 'Marcos Peña',
      plan: 'Plan Mensual Clásico',
      status: 'expired',
      trainer: 'Carlos Méndez (Fuerza)',
      avatar: '',
      daysLeft: -8,
      expiration: '06 Oct 2026',
      goal: 'Masa Muscular',
      phone: '+58 412 8829104',
      dueAmount: 35.0,
      notes: 'Notificado vía WhatsApp hace 2 días.'
    },
    {
      id: 'FF-COLON-07291',
      cedula: '28.991.029',
      name: 'Sofia Benítez',
      plan: 'Plan VIP Trimestral',
      status: 'active',
      trainer: 'Andrea Rivas (Pérdida)',
      avatar: '',
      daysLeft: 45,
      expiration: '28 Nov 2026',
      goal: 'Glúteos & Core',
      phone: '+58 424 9918291',
      notes: 'Al día en recepción.'
    }
  ];

  // Storage Keys
  const STORAGE_MEMBERS = 'ff_gym_members_v1';
  const STORAGE_ATTENDANCE = 'ff_gym_attendance_v1';
  const MAX_CAPACITY = 60; // Aforo máximo del gimnasio

  // State
  let members = [];
  let attendance = [];
  let currentFilter = 'all'; // 'all', 'inside', 'checked-out'
  let audioCtx = null;
  let cameraStream = null;

  // ==========================================
  // SINTETIZADOR DE SONIDO (Web Audio API)
  // Sin archivos externos: suena nativo en cualquier navegador
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

      // Primer tono suave (880 Hz - La5)
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

      // Segundo tono agudo y armónico (1318.5 Hz - Mi6)
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

      // Tono de advertencia doble (330 Hz -> 261 Hz)
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.setValueAtTime(240, now + 0.12);
      gain.gain.setValueAtTime(0.15, now);
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
        // Inicializar con 3 ingresos simulados del día
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
  // ACTUALIZACIÓN DE INDICADORES (KPIS)
  // ==========================================
  function updateKPIs() {
    const insideCount = attendance.filter((a) => a.status === 'inside').length;
    const totalToday = attendance.length;
    const expiredCount = members.filter((m) => m.status === 'expired').length;
    const activeCount = members.filter((m) => m.status === 'active').length;
    const solvencyRate = members.length > 0 ? Math.round((activeCount / members.length) * 100) : 100;

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
  }

  // ==========================================
  // BUSCADOR INTELIGENTE EN VIVO
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

      // Filtrar por nombre, cédula limpia o código de socio
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

      renderResults(matches);
    });

    // Atajos de teclado: Enter para seleccionar el primer resultado
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

    // Cerrar resultados al hacer clic fuera
    document.addEventListener('click', (e) => {
      if (!input.contains(e.target) && !resultsBox.contains(e.target)) {
        resultsBox.classList.remove('is-open');
      }
    });
  }

  function renderResults(matches) {
    const resultsBox = document.getElementById('recSearchResults');
    if (!resultsBox) return;

    if (matches.length === 0) {
      resultsBox.innerHTML = `
        <div style="padding: 1.25rem; text-align: center; color: var(--muted); font-size: 0.85rem;">
          No se encontró ningún socio con esos datos.<br>
          <button type="button" class="rec-btn-ghost" id="btnQuickRegisterFromSearch" style="margin-top: 0.75rem; font-size: 0.78rem;">
            + Registrar como Nuevo Socio / Pase
          </button>
        </div>
      `;
      resultsBox.classList.add('is-open');

      const btnNew = document.getElementById('btnQuickRegisterFromSearch');
      if (btnNew) {
        btnNew.addEventListener('click', () => openNewMemberModal());
      }
      return;
    }

    resultsBox.innerHTML = matches
      .map((m) => {
        const isExpired = m.status === 'expired';
        const badge = isExpired
          ? '<span class="rec-badge-expired">Vencida</span>'
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
  // PROCESAMIENTO DE CHECK-IN Y FEEDBACK EN PANTALLA
  // ==========================================
  function handleCheckIn(member, method = 'Manual') {
    const cardEl = document.getElementById('recValidationCard');
    const idleEl = document.getElementById('recValIdle');
    const resultEl = document.getElementById('recValResult');
    if (!cardEl || !idleEl || !resultEl) return;

    const isExpired = member.status === 'expired';

    // Disparar sonido correspondiente
    if (isExpired) {
      playAlertSound();
    } else {
      playSuccessSound();
    }

    // Configurar clases visuales de la tarjeta gigante
    cardEl.classList.remove('is-success', 'is-expired');
    cardEl.classList.add(isExpired ? 'is-expired' : 'is-success');

    idleEl.style.display = 'none';
    resultEl.classList.add('is-visible');

    // Avatar o inicial
    const avatarHtml = member.avatar
      ? `<img src="${member.avatar}" class="rec-val-avatar" alt="${member.name}">`
      : `<div class="rec-val-avatar">${member.name.charAt(0)}</div>`;

    // Banner de estado
    const bannerHtml = isExpired
      ? `<div class="rec-val-banner is-expired">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
           ACCESO DENEGADO · MEMBRESÍA VENCIDA
         </div>`
      : `<div class="rec-val-banner is-success">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
           ACCESO AUTORIZADO · PLAN VIP ACTIVO
         </div>`;

    // Botones de acción dinámicos
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

    // Si está al día, registrar asistencia automáticamente
    if (!isExpired) {
      registerAttendance(member, method);
    }

    // Bindings de botones en la tarjeta de resultado
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
      // Ya estaba dentro, avisar
      showToast(`${member.name} ya se encontraba dentro de la sala.`);
      return;
    }

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
    renderTable();
    updateKPIs();
    showToast(`✅ Acceso concedido: ${member.name}`);
  }

  function checkOutMemberById(memberId) {
    const record = attendance.find((a) => a.memberId === memberId && a.status === 'inside');
    if (record) {
      record.status = 'checked-out';
      record.timeOut = formatHour(new Date());
      saveAttendance();
      renderTable();
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
  // TABLA EN VIVO DE ASISTENCIAS DEL DÍA
  // ==========================================
  function renderTable() {
    const tbody = document.getElementById('recTableBody');
    if (!tbody) return;

    let filtered = attendance;
    if (currentFilter === 'inside') {
      filtered = attendance.filter((a) => a.status === 'inside');
    } else if (currentFilter === 'checked-out') {
      filtered = attendance.filter((a) => a.status === 'checked-out');
    }

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 2rem; color: var(--muted);">
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
          renderTable();
          updateKPIs();
          showToast(`Salida registrada para ${record.memberName}`);
        }
      });
    });
  }

  function setupFilters() {
    const filterBtns = document.querySelectorAll('.rec-pill-btn[data-filter]');
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        currentFilter = btn.dataset.filter;
        renderTable();
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
  // Las pistolas USB leen el código y terminan con Enter
  // ==========================================
  function setupUsbBarcodeListener() {
    let barcodeBuffer = '';
    let lastKeyTime = Date.now();

    window.addEventListener('keydown', (e) => {
      const activeTag = document.activeElement ? document.activeElement.tagName : '';
      if (activeTag === 'INPUT' || activeTag === 'TEXTAREA') {
        return; // No interferir cuando se escribe en un input
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
    // Si viene en formato FERREIRA_FITNESS_MEMBER:ID:NOMBRE:STATUS
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

  // ==========================================
  // DEMO CHIPS (Prueba en 1 clic para el cliente)
  // ==========================================
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
  // MODALES (Renovación de Pago & Nuevo Socio)
  // ==========================================
  function openRenewModal(member) {
    const modal = document.getElementById('recModalRenew');
    if (!modal) return;

    document.getElementById('renewMemberName').textContent = member.name;
    document.getElementById('renewMemberId').textContent = `${member.id} · C.I. ${member.cedula}`;
    document.getElementById('renewAmount').textContent = `$${(member.dueAmount || 35.0).toFixed(2)} USD`;

    modal.classList.add('is-open');

    const form = document.getElementById('renewForm');
    const handleForm = (e) => {
      e.preventDefault();
      const method = document.getElementById('renewMethod').value;

      // Actualizar miembro a activo y extender 30 días
      member.status = 'active';
      member.daysLeft = 30;
      const d = new Date();
      d.setDate(d.getDate() + 30);
      member.expiration = d.toLocaleDateString('es-VE', { day: '2-digit', month: 'short', year: 'numeric' });
      saveMembers();

      modal.classList.remove('is-open');
      form.removeEventListener('submit', handleForm);

      playSuccessSound();
      showToast(`Membresía renovada con éxito (${method}).`);
      handleCheckIn(member, 'Recepción (Pago Renovado)');
      updateKPIs();
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
      const plan = document.getElementById('newMemberPlan').value;
      const trainer = document.getElementById('newMemberTrainer').value;

      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const newMember = {
        id: `FF-COLON-${randomSuffix}`,
        cedula: cedula,
        name: name,
        plan: plan,
        status: 'active',
        trainer: trainer,
        avatar: '',
        daysLeft: 30,
        expiration: new Date(Date.now() + 30 * 86400000).toLocaleDateString('es-VE', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }),
        goal: 'Entrenamiento Integral',
        phone: '+58 412 0000000',
        notes: 'Inscripción rápida en recepción.'
      };

      members.unshift(newMember);
      saveMembers();

      modal.classList.remove('is-open');
      form.reset();

      playSuccessSound();
      showToast(`Nuevo socio registrado: ${newMember.name}`);
      handleCheckIn(newMember, 'Inscripción en Recepción');
      updateKPIs();
    };
  }

  function setupModals() {
    const closeBtns = document.querySelectorAll('[data-close-modal]');
    closeBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.modal').forEach((m) => m.classList.remove('is-open'));
      });
    });

    const btnNewMember = document.getElementById('btnOpenNewMember');
    if (btnNewMember) {
      btnNewMember.addEventListener('click', () => openNewMemberModal());
    }

    // Botón simular escáner
    const btnSimulateScan = document.getElementById('btnSimulateScan');
    if (btnSimulateScan) {
      btnSimulateScan.addEventListener('click', () => {
        const eduardo = members.find((m) => m.id === 'FF-COLON-00842') || members[0];
        handleCheckIn(eduardo, '📱 QR Móvil');
      });
    }

    // Botón exportar CSV
    const btnExport = document.getElementById('btnExportCsv');
    if (btnExport) {
      btnExport.addEventListener('click', () => exportAttendanceCsv());
    }

    // Botón pantalla completa
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

    // Botón reiniciar datos
    const btnReset = document.getElementById('btnResetDemoData');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        if (confirm('¿Restablecer datos de prueba a valores iniciales?')) {
          localStorage.removeItem(STORAGE_MEMBERS);
          localStorage.removeItem(STORAGE_ATTENDANCE);
          loadData();
          renderTable();
          updateKPIs();
          showToast('Datos demo restaurados.');
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

  // ==========================================
  // TOAST NOTIFICATIONS
  // ==========================================
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
  // INICIALIZACIÓN
  // ==========================================
  document.addEventListener('DOMContentLoaded', () => {
    loadData();
    startClock();
    updateKPIs();
    renderTable();
    setupSearch();
    setupFilters();
    setupTabs();
    setupUsbBarcodeListener();
    setupDemoChips();
    setupModals();

    // Autofocus en el campo de búsqueda para operación rápida
    const searchInput = document.getElementById('recSearchInput');
    if (searchInput) searchInput.focus();
  });
})();
