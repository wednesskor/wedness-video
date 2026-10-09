// WEDNESS — site interactions

// Contact form endpoint. Payload: { name, weddingHall, phone, email, message }
// (same shape as the current wedness.co.kr /api/contact route)
const CONTACT_ENDPOINT = '/api/contact';

// effects.js(3D 장면)와 공유하는 상태
window.WEDNESS = window.WEDNESS || { heroProgress: 0 };

(function () {
  const root = document.documentElement;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Header: 스크롤하면 떠 있는 유리 알약으로
  const header = document.querySelector('.site-header');
  const lightSections = document.querySelectorAll('.is-light');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 24);
    // 밝은 섹션 위를 지날 때는 헤더도 밝은 유리로
    const y = header.offsetHeight / 2 + 12;
    const onLight = Array.prototype.some.call(lightSections, (s) => {
      const r = s.getBoundingClientRect();
      return r.top <= y && r.bottom >= y;
    });
    header.classList.toggle('on-light', onLight);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Hero: 스크롤 진행도(--p 0→1). 구체 안 → 밖으로 빠져나오는 연출에 사용
  const hero = document.querySelector('.hero');
  if (hero) {
    let ticking = false;
    const update = () => {
      ticking = false;
      const r = hero.getBoundingClientRect();
      const span = Math.max(1, r.height - window.innerHeight);
      const p = Math.min(1, Math.max(0, -r.top / span));
      window.WEDNESS.heroProgress = p;
      hero.style.setProperty('--p', p.toFixed(4));
      hero.classList.toggle('is-out', p > 0.36);
    };
    const request = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    update();
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
  }

  // Mobile nav (전체 화면 메뉴)
  const toggle = document.querySelector('.nav-toggle');
  const list = document.getElementById('nav-list');
  const setNav = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('.sr-only').textContent = open ? '메뉴 닫기' : '메뉴 열기';
    list.classList.toggle('open', open);
    header.classList.toggle('menu-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };
  toggle.addEventListener('click', () => setNav(toggle.getAttribute('aria-expanded') !== 'true'));
  list.addEventListener('click', (e) => { if (e.target.closest('a')) setNav(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setNav(false); });
  matchMedia('(min-width: 901px)').addEventListener('change', (e) => { if (e.matches) setNav(false); });

  // Chart count-up
  const countUp = (card) => {
    card.querySelectorAll('[data-count]').forEach((el) => {
      const target = parseFloat(el.dataset.count);
      if (reduceMotion || !isFinite(target)) return;
      const start = performance.now();
      const dur = 1800;
      const tick = (now) => {
        const t = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - t, 4);
        el.textContent = (target * eased).toFixed(1);
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  };

  // Reveal on scroll. 인트로 재생 중에는 히어로 문구가 인트로가 걷힐 때 나타나도록 지연
  const revealTargets = document.querySelectorAll('.reveal');
  const introDelay = root.classList.contains('intro-play') ? 2000 : 0;
  const stagger = (el, extra) => {
    const siblings = el.parentElement.querySelectorAll(':scope > .reveal');
    const idx = Array.prototype.indexOf.call(siblings, el);
    const delay = extra + Math.min(idx * 110, 550);
    el.style.transitionDelay = delay ? delay + 'ms' : '';
    el.style.setProperty('--d', delay + 'ms');
  };
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        if (entry.target.classList.contains('chart-card')) countUp(entry.target);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealTargets.forEach((el) => {
      stagger(el, el.closest('.hero') ? introDelay : 0);
      io.observe(el);
    });
    document.addEventListener('intro:skip', () => {
      document.querySelectorAll('.hero .reveal').forEach((el) => stagger(el, 150));
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
