// WEDNESS — site interactions

// Contact form endpoint. Payload: { name, weddingHall, phone, email, message }
// (same shape as the current wedness.co.kr /api/contact route)
const CONTACT_ENDPOINT = '/api/contact';

(function () {
  // Header background on scroll
  const header = document.querySelector('.site-header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile nav
  const toggle = document.querySelector('.nav-toggle');
  const list = document.getElementById('nav-list');
  const setNav = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('.sr-only').textContent = open ? '메뉴 닫기' : '메뉴 열기';
    list.classList.toggle('open', open);
  };
  toggle.addEventListener('click', () => setNav(toggle.getAttribute('aria-expanded') !== 'true'));
  list.addEventListener('click', (e) => { if (e.target.closest('a')) setNav(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setNav(false); });

  // Reveal on scroll
  const revealTargets = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    // Stagger siblings inside grids
    revealTargets.forEach((el) => {
      const siblings = el.parentElement.querySelectorAll(':scope > .reveal');
      const idx = Array.prototype.indexOf.call(siblings, el);
      if (idx > 0) el.style.transitionDelay = Math.min(idx * 90, 450) + 'ms';
      io.observe(el);
    });
  } else {
    revealTargets.forEach((el) => el.classList.add('in'));
  }

  // Benefits tabs
  const tablist = document.querySelector('.tabs');
  const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
  const selectTab = (i, focus) => {
    tabs.forEach((tab, j) => {
      const selected = i === j;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      document.getElementById(tab.getAttribute('aria-controls')).hidden = !selected;
    });
    tablist.dataset.active = String(i);
    if (focus) tabs[i].focus();
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => selectTab(i));
    tab.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const dir = e.key === 'ArrowRight' ? 1 : -1;
        selectTab((i + dir + tabs.length) % tabs.length, true);
      }
    });
  });

  // QR trees (tree.icqr.com embed). Share-link format: ?q=base64url(seasonDigit + colorDigit + url)
  const SEASONS = { spring: 0, summer: 1, autumn: 2 };
  const COLORS = { pink: 1, red: 3 }; // spring palette swatches on tree.icqr.com (0 = season default)
  const QR_VIEWPORT_WIDTH = 430; // matches .qr-frame iframe width in style.css
  const fitQr = new ResizeObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.style.setProperty('--qr-scale', entry.contentRect.width / QR_VIEWPORT_WIDTH);
    });
  });
  document.querySelectorAll('.qr-frame').forEach((el) => {
    fitQr.observe(el);
    const season = SEASONS[el.dataset.season] ?? 1;
    const color = COLORS[el.dataset.color] ?? 0;
    const bytes = new TextEncoder().encode(String(season) + color + el.dataset.url);
    const q = btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    const iframe = document.createElement('iframe');
    iframe.src = 'https://tree.icqr.com/?q=' + q;
    iframe.title = 'QR 코드 나무 — 나무를 누르면 QR 코드가 나타납니다';
    iframe.loading = 'lazy';
    el.appendChild(iframe);
  });

  // Contact form
  const form = document.getElementById('contact-form');
  const submit = form.querySelector('button[type="submit"]');
  const status = form.querySelector('.form-status');
  const hall = form.elements.weddingHall;
  const TYPE_LABELS = { couple: '예비부부 촬영 문의', hall: '웨딩홀 제휴 문의' };
  const val = (name) => form.elements[name].value.trim();
  const isComplete = () =>
    Array.from(form.querySelectorAll('[required]')).every((f) =>
      f.type === 'checkbox' ? f.checked : f.value.trim() !== '');
  const setStatus = (type, msg) => {
    status.className = 'form-status' + (type ? ' ' + type : '');
    status.textContent = msg;
  };

  // 문의 유형에 따라 웨딩홀명 필수 여부와 예식일 필드 표시를 전환
  const applyType = () => {
    const type = val('inquiryType');
    form.querySelectorAll('[data-for]').forEach((el) => { el.hidden = el.dataset.for !== type; });
    hall.required = type === 'hall';
    hall.placeholder = type === 'hall' ? '' : '미정이면 비워두세요';
    submit.disabled = !isComplete();
  };
  applyType();

  form.addEventListener('input', () => { submit.disabled = !isComplete(); });
  form.addEventListener('change', (e) => {
    if (e.target.name === 'inquiryType') applyType();
    submit.disabled = !isComplete();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!isComplete()) return;

    // 백엔드 스키마는 그대로 두고, 추가 항목은 문의 내용 머리말로 전달
    const type = val('inquiryType');
    const header = [
      '[문의 유형] ' + TYPE_LABELS[type],
      type === 'couple' ? '[예식 예정일] ' + (val('weddingDate') || '미정') : null,
      '[개인정보 수집·이용 동의] 동의 (' + new Date().toLocaleString('ko-KR') + ')',
    ].filter(Boolean).join('\n');
    const payload = {
      name: val('name'),
      weddingHall: val('weddingHall') || '미정',
      phone: val('phone'),
      email: val('email'),
      message: header + '\n\n' + val('message'),
    };
    submit.disabled = true;
    submit.textContent = '전송 중...';
    setStatus(null, '');

    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus('success', '문의가 성공적으로 전송되었습니다. 담당자가 곧 연락드리겠습니다.');
        form.reset();
        applyType();
      } else {
        setStatus('error', data.error || '전송 중 오류가 발생했습니다.');
      }
    } catch (err) {
      setStatus('error', '네트워크 오류가 발생했습니다.');
    } finally {
      submit.textContent = '문의 보내기';
      submit.disabled = !isComplete();
    }
  });

  document.getElementById('year').textContent = new Date().getFullYear();
})();
