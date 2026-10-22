// WEDNESS — 한/영 전환
// 한국어 원문은 HTML에 그대로 있고(data-i18n), 여기에는 영어 번역만 둡니다.
// 문구를 고칠 때: 한국어는 index.html, 영어는 아래 EN을 수정하세요.

(function () {
  const EN = {
    'meta.title': 'WEDNESS · Premium VR Wedding Films',
    'meta.desc': 'Your wedding day, relived whenever you wish. WEDNESS records your ceremony in meticulous 360° VR, so the emotion of the day stays as vivid as ever.',

    'a11y.home': 'WEDNESS home',
    'a11y.menu': 'Main menu',
    'a11y.lang': 'Language',
    'a11y.promise': 'The WEDNESS promise',
    'a11y.tabs': 'Choose who the benefits are for',
    'a11y.newWin': '(opens in a new window)',
    'a11y.top': 'WEDNESS — back to top',
    'nav.cta': 'Inquire',

    'hero.sub': 'Premium 360° VR Wedding Films',
    'hero.l1': 'Your wedding day —',
    'hero.l2': 'every feeling in the room,',
    'hero.l3': '<em>relived</em> whenever you wish.',
    'hero.lead': 'The air, the flutter of nerves, every smile around you — moments photos and video can’t hold. WEDNESS records your ceremony in full 360°.',
    'hero.cta': 'Book a Consultation',
    'hero.more': 'Explore the Service',

    'about.t1': 'Premium VR Wedding',
    'about.t2': 'Film Specialists',
    'about.lead': 'WEDNESS <strong>captures your ceremony in meticulous 360° VR</strong>,<br class="br-md" /> so the emotion of the day stays as vivid as ever, however much time passes.',
    'feat1.h': 'One-Stop Production',
    'feat1.p': 'From filming and editing to final delivery, every step is handled in-house.',
    'feat2.h': 'Venue-Tailored Scenarios',
    'feat2.p': 'We design VR shooting plans built around each wedding venue.',
    'feat3.h': 'Dedicated On-Site Crew',
    'feat3.p': 'A specialist VR crew is with you on site throughout the wedding day.',
    'feat4.h': 'Multi-Platform Delivery',
    'feat4.p': 'Films delivered for VR, mobile and YouTube — all at once.',

    'quote.sub': 'A once-in-a-lifetime ceremony, kept as a record you can experience for a lifetime.',

    'why.t': 'Why a VR Wedding?',
    'why.p1': 'As the global VR and AR market grows rapidly, <strong>immersive video</strong> is drawing attention as a new way to record weddings. In Korea, it is still an experience few couples have had.',
    'why.p2': 'WEDNESS sets a new standard for capturing the essence of a wedding — <strong>the emotion and atmosphere of every moment</strong> — as vividly as possible.',
    'chart.title': 'Global AR/VR/MR Market Size',
    'chart.unit': 'Unit: USD billion',
    'chart.aria': 'Global AR/VR market (total spending): USD 15.2 billion in 2024, forecast USD 39.7 billion in 2029',
    'chart.forecast': '2029 <small>forecast</small>',
    'chart.note': '<strong>~2.6×</strong> projected growth <span>CAGR 21.1% · 2024 → 2029</span>',
    'chart.source': 'Source: IDC, Worldwide Augmented and Virtual Reality Spending Guide, 2025 V1 (published May 2025). Total AR/VR spending on hardware, software and services.',

    'ben.t1': 'What Sets',
    'ben.t2': 'WEDNESS Apart',
    'ben.tabCouple': 'For Couples',
    'ben.tabHall': 'For Venues',
    'ben.coupleLead': 'What WEDNESS offers couples.<br class="br-md" /> We turn your once-in-a-lifetime ceremony into a record you can experience for a lifetime.',
    'ben.c1.h': 'Relive the Emotion, Forever',
    'ben.c1.p': 'The air, the atmosphere, the reactions of everyone around you — everything photos and video can’t capture is preserved.',
    'ben.c2.h': 'The Next Best Thing to Being There',
    'ben.c2.p': 'Family and friends abroad or unable to attend can feel as if they were right there in the room.',
    'ben.c3.h': 'A Gift for Your Future Children',
    'ben.c3.p': 'One day, they can ‘step into’ their parents’ wedding in VR — a truly special memory to pass down.',
    'ben.c4.h': 'Easy to Share, Memories That Grow',
    'ben.c4.p': 'Delivered in a YouTube-ready format. Share it safely with family and friends as ‘Unlisted’, so only people with the link can watch.',
    'ben.hallLead': 'What partner venues gain with WEDNESS.<br class="br-md" /> A premium VR wedding service that raises both your brand value and your revenue.',
    'ben.h1.h': 'A Premium Service That Elevates Your Brand',
    'ben.h1.p': 'Simply including VR wedding films sets your venue apart and sharpens its competitive edge.',
    'ben.h2.h': 'Natural Word-of-Mouth Reach',
    'ben.h2.p': 'Every time couples share their films on social media or YouTube, your venue’s name and spaces become organic marketing.',
    'ben.h3.h': 'Compelling Content That Wins Couples',
    'ben.h3.p': 'An immersive VR wedding experience sparks couples’ curiosity and becomes a key reason to choose your venue.',
    'ben.h4.h': 'Zero Operational Burden',
    'ben.h4.p': 'Filming, crew management, post-production and final delivery — WEDNESS takes care of everything.',

    'proc.t': 'How It Works',
    'proc.lead': 'WEDNESS handles everything in-house, from the first consultation to final delivery.<br class="br-md" /> A well-organized process that gives venues and couples complete peace of mind.',
    'step1.h': 'Pre-Wedding Consultation',
    'step1.p': 'An introduction to our VR wedding films and a walkthrough of the day’s flow.',
    'step2.h': 'Specialist Crew on the Day',
    'step2.p': 'We record the entire ceremony in meticulous detail with 360° VR filming.',
    'step3.h': 'Post-Production & Editing',
    'step3.p': 'Your film is crafted into a premium VR piece that follows the emotion and rhythm of the day.',
    'step4.h': 'Final Delivery',
    'step4.p': 'Your VR film is delivered in formats ready for mobile and YouTube.',

    'qr.t1': 'Tap a Tree',
    'qr.t2': 'to Reveal Its QR Code',
    'qr.site': 'WEDNESS Official Website',
    'qr.kakao': 'KakaoTalk Open Chat',
    'qr.link': 'Open the Chat',

    'ct.t1': 'A New Standard for Weddings —',
    'ct.t2': 'Begin with <em>WEDNESS</em>.',
    'ct.lead': 'For questions, partnerships or filming inquiries, leave your details and our team will get back to you shortly.',
    'f.type': 'Inquiry Type',
    'f.couple': 'Couple · Filming',
    'f.hall': 'Venue · Partnership',
    'f.name': 'Name',
    'f.venueOpt': 'Wedding Venue <small>(optional)</small>',
    'f.venue': 'Venue Name',
    'f.date': 'Wedding Date <small>(optional)</small>',
    'f.phone': 'Phone',
    'f.email': 'Email',
    'f.message': 'Message',
    'f.consent': '<b>[Required]</b> I agree to the collection and use of my personal information.',
    'f.details': 'View details',
    'f.dl': '<dt>Data collected</dt><dd>Name, phone, email, inquiry type, message (optional: venue name, wedding date)</dd><dt>Purpose</dt><dd>Reviewing and responding to filming and partnership inquiries</dd><dt>Retention</dt><dd>1 year after the inquiry is resolved (if a contract is signed, the period required by law after it ends)</dd>',
    'f.decline': 'You may decline, but we cannot accept your inquiry without consent. See our <a href="privacy.html">Privacy Policy</a> (in Korean) for details.',

    'ft.tagline': 'Premium VR Wedding Films',
    'ft.privacy': 'Privacy Policy',
    'ft.company': 'Company WEDNESS',
    'ft.email': 'Email',

    // script.js에서 쓰는 문구 (한국어도 함께)
    'ui.menuOpen': ['메뉴 열기', 'Open menu'],
    'ui.menuClose': ['메뉴 닫기', 'Close menu'],
    'ui.venuePh': ['미정이면 비워두세요', 'Leave blank if undecided'],
    'ui.send': ['문의 보내기', 'Send Inquiry'],
    'ui.sending': ['전송 중...', 'Sending...'],
    'ui.ok': ['문의가 성공적으로 전송되었습니다. 담당자가 곧 연락드리겠습니다.', 'Thank you — your inquiry has been sent. We will be in touch soon.'],
    'ui.err': ['전송 중 오류가 발생했습니다.', 'Something went wrong while sending. Please try again.'],
    'ui.net': ['네트워크 오류가 발생했습니다.', 'Network error. Please check your connection and try again.'],
    'ui.qrTitle': ['QR 코드 나무 — 나무를 누르면 QR 코드가 나타납니다', 'QR code tree — tap the tree to reveal its QR code'],
  };

  const root = document.documentElement;
  const KO = {};
  let lang = root.getAttribute('data-lang') === 'en' ? 'en' : 'ko';

  // 한국어 원문 보관
  document.querySelectorAll('[data-i18n]').forEach((el) => { KO[el.dataset.i18n] = el.innerHTML; });
  document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
    el.dataset.i18nAttr.split(';').forEach((pair) => {
      const [attr, key] = pair.split(':');
      KO[key] = el.getAttribute(attr);
    });
  });
  KO['meta.title'] = document.title;
  const metaDesc = document.querySelector('meta[name="description"]');
  KO['meta.desc'] = metaDesc ? metaDesc.content : '';

  const t = (key) => {
    const v = EN[key];
    if (Array.isArray(v)) return lang === 'en' ? v[1] : v[0];
    return lang === 'en' && v != null ? v : KO[key];
  };

  const apply = () => {
    root.lang = lang;
    root.setAttribute('data-lang', lang);
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const v = t(el.dataset.i18n);
      if (v != null && el.innerHTML !== v) el.innerHTML = v;
    });
    document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
      el.dataset.i18nAttr.split(';').forEach((pair) => {
        const [attr, key] = pair.split(':');
        const v = t(key);
        if (v != null) el.setAttribute(attr, v);
      });
    });
    document.querySelectorAll('[data-count-en]').forEach((el) => {
      el.textContent = lang === 'en' ? el.dataset.countEn : el.dataset.count;
    });
    document.title = t('meta.title');
    if (metaDesc) metaDesc.content = t('meta.desc');
    document.querySelectorAll('.lang-switch [data-lang]').forEach((b) => {
      b.setAttribute('aria-pressed', String(b.dataset.lang === lang));
    });
    document.dispatchEvent(new CustomEvent('lang:change', { detail: { lang } }));
  };

  const set = (next) => {
    if (next !== 'ko' && next !== 'en') return;
    try { localStorage.setItem('wd-lang', next); } catch (e) {}
    if (next === lang) return;
    lang = next;
    // 주소창의 ?lang= 도 맞춰 둠(공유 시 같은 언어로 열림)
    try {
      const url = new URL(location.href);
      if (url.searchParams.has('lang')) { url.searchParams.set('lang', next); history.replaceState(null, '', url); }
    } catch (e) {}
    root.classList.add('lang-switching');
    setTimeout(() => {
      apply();
      requestAnimationFrame(() => root.classList.remove('lang-switching'));
    }, 180);
  };

  document.querySelectorAll('.lang-switch [data-lang]').forEach((b) => {
    b.addEventListener('click', () => set(b.dataset.lang));
  });

  window.WEDNESS_I18N = { get lang() { return lang; }, t, set };
  if (lang === 'en') apply();
  else document.querySelectorAll('.lang-switch [data-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === 'ko')));
  root.classList.remove('i18n-pending');
})();
