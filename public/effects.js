// WEDNESS — visual effects: liquid logo intro, shader gradient, 3D sphere, liquid glass.
// 모든 효과는 기본 화면 위에 '덧입히는' 방식입니다. 브라우저가 지원하지 않거나
// 불러오기에 실패해도 기존 디자인(CSS 그라데이션, SVG 지구본, 반투명 버튼)이 그대로 보입니다.

const root = document.documentElement;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarse = matchMedia('(pointer: coarse)').matches;
const lowPower = (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 4;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

const onVisible = (el, cb, rootMargin = '0px') => {
  new IntersectionObserver(([e]) => cb(e.isIntersecting), { rootMargin }).observe(el);
};
const afterLoad = (fn) => {
  const run = () => ('requestIdleCallback' in window ? requestIdleCallback(fn, { timeout: 1200 }) : setTimeout(fn, 150));
  if (document.readyState === 'complete') run();
  else addEventListener('load', run, { once: true });
};

/* =========================================================
   1. Liquid logo intro — 첫 방문 시 1회 (head의 인라인 스크립트가 재생 여부 결정)
   ========================================================= */
function intro() {
  const el = document.querySelector('.intro');
  if (!el) return;
  if (!root.classList.contains('intro-play')) { el.remove(); return; }

  const end = () => {
    if (!el.isConnected) return;
    el.remove();
    root.classList.remove('intro-play');
  };
  const skip = () => {
    if (!el.isConnected || el.classList.contains('is-skipping')) return;
    el.classList.add('is-skipping');
    document.dispatchEvent(new Event('intro:skip'));
  };
  el.addEventListener('animationend', (e) => {
    if (e.target === el && (e.animationName === 'intro-out' || e.animationName === 'intro-skip')) end();
  });
  ['pointerdown', 'keydown', 'wheel', 'touchmove'].forEach((type) => addEventListener(type, skip, { once: true, passive: true }));
}

/* Header logo: hover 시 글자가 잠깐 물결치듯 일렁임 */
function liquidLogo() {
  const word = document.querySelector('.logo-word');
  const disp = document.querySelector('#liquid-logo feDisplacementMap');
  const turb = document.querySelector('#liquid-logo feTurbulence');
  if (!word || !disp || !turb || reduceMotion) return;
  let raf = 0;
  const play = () => {
    if (raf) return;
    const start = performance.now();
    word.classList.add('is-liquid');
    const tick = (now) => {
      const p = (now - start) / 1100;
      if (p >= 1) {
        disp.setAttribute('scale', '0');
        word.classList.remove('is-liquid');
        raf = 0;
        return;
      }
      disp.setAttribute('scale', (Math.sin(p * Math.PI) * 10).toFixed(2));
      turb.setAttribute('baseFrequency', `${(0.018 + p * 0.012).toFixed(4)} ${(0.07 - p * 0.02).toFixed(4)}`);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  };
  word.closest('a').addEventListener('pointerenter', play);
  word.closest('a').addEventListener('focus', play);
}

/* =========================================================
   2. Shader gradient — 히어로·인용문 배경이 노을처럼 천천히 흐름
   ========================================================= */
const VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.0,1.0);}';
const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_ptr;
uniform vec2 u_bloom;
uniform vec3 u_c0, u_c1, u_c2, u_c3;

vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m; m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  vec2 p = uv * vec2(u_res.x / u_res.y, 1.0);
  float t = u_time * 0.06;
  vec2 drift = (u_ptr - 0.5) * 0.18;

  // domain warping: 노이즈로 좌표를 두 번 비틀어 부드럽게 흐르는 물감 느낌
  vec2 q = vec2(snoise(p * 0.32 + vec2(0.0, t)), snoise(p * 0.32 + vec2(5.2, -t)));
  vec2 r = vec2(snoise(p * 0.45 + 0.7 * q + vec2(1.7, 9.2) + t * 0.5 + drift),
                snoise(p * 0.45 + 0.7 * q + vec2(8.3, 2.8) - t * 0.4));
  float n = snoise(p * 0.3 + 0.6 * r);

  vec3 col = mix(u_c0, u_c1, smoothstep(-0.8, 0.9, n));
  col = mix(col, u_c2, smoothstep(-0.5, 0.9, r.x) * 0.55);
  col = mix(col, u_c3, smoothstep(0.2, 1.0, r.y) * 0.32);

  // 텍스트 영역을 밝게 유지하는 은은한 빛
  float glow = smoothstep(0.85, 0.0, length((uv - u_bloom) * vec2(u_res.x / u_res.y, 1.0) * 0.9));
  col = mix(col, vec3(1.0, 0.992, 0.98), glow * 0.55);

  // 미세한 노이즈로 색 띠(banding) 방지
  float grain = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
  col += (grain - 0.5) * (2.5 / 255.0);
  gl_FragColor = vec4(col, 1.0);
}`;

const hexToRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);

function shaderGradient(host, { colors, bloom, scale, speed = 1 }) {
  const canvas = document.createElement('canvas');
  canvas.className = 'shader-bg';
  canvas.setAttribute('aria-hidden', 'true');
  const gl = canvas.getContext('webgl', {
    alpha: false, antialias: false, depth: false, stencil: false, powerPreference: 'low-power',
  });
  if (!gl) return;

  const compile = (type, src) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  };
  const prog = gl.createProgram();
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
  gl.useProgram(prog);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const u = (name) => gl.getUniformLocation(prog, name);
  colors.forEach((c, i) => gl.uniform3fv(u('u_c' + i), hexToRgb(c)));
  gl.uniform2fv(u('u_bloom'), bloom);
  const uRes = u('u_res'), uTime = u('u_time'), uPtr = u('u_ptr');

  let w = 1, h = 1, t = Math.random() * 60, last = 0, raf = 0, running = false, visible = false;
  const ptr = [0.5, 0.5], target = [0.5, 0.5];
  const minFrame = coarse || lowPower ? 1000 / 30 : 0;

  const draw = () => {
    gl.uniform2f(uRes, w, h);
    gl.uniform1f(uTime, t);
    gl.uniform2fv(uPtr, ptr);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };
  const resize = (width, height) => {
    w = Math.max(1, Math.round(width * scale));
    h = Math.max(1, Math.round(height * scale));
    canvas.width = w;
    canvas.height = h;
    gl.viewport(0, 0, w, h);
    draw();
  };
  const frame = (now) => {
    raf = requestAnimationFrame(frame);
    if (now - last < minFrame) return;
    t += Math.min(0.05, (now - last) / 1000) * speed;
    last = now;
    ptr[0] += (target[0] - ptr[0]) * 0.03;
    ptr[1] += (target[1] - ptr[1]) * 0.03;
    draw();
  };
  const sync = () => {
    const should = visible && !document.hidden && !reduceMotion;
    if (should && !running) { running = true; last = performance.now(); raf = requestAnimationFrame(frame); }
    else if (!should && running) { running = false; cancelAnimationFrame(raf); }
  };

  host.prepend(canvas);
  const rect = host.getBoundingClientRect();
  resize(rect.width, rect.height);
  new ResizeObserver(([e]) => resize(e.contentRect.width, e.contentRect.height)).observe(host);
  if (!coarse) {
    addEventListener('pointermove', (e) => {
      const r = host.getBoundingClientRect();
      target[0] = (e.clientX - r.left) / r.width;
      target[1] = 1 - (e.clientY - r.top) / r.height;
    }, { passive: true });
  }
  onVisible(host, (v) => { visible = v; sync(); });
  document.addEventListener('visibilitychange', sync);
  requestAnimationFrame(() => canvas.classList.add('is-ready'));
}

/* =========================================================
   3. 3D sphere — 진주빛 구체 + 금빛 경위선 + 로고의 궤도 링 (three.js)
   ========================================================= */
async function sphere(orb) {
  const THREE = await import('three');
  const { RoomEnvironment } = await import('three/addons/environments/RoomEnvironment.js');

  const holder = document.createElement('div');
  holder.className = 'orb-canvas';
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, coarse || lowPower ? 1.5 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.05;
  holder.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
  camera.position.set(0, 0, 6.6);

  const key = new THREE.DirectionalLight(0xfff1e0, 1.4);
  key.position.set(-3, 4, 5);
  const rim = new THREE.DirectionalLight(0xffc4ba, 1.6);
  rim.position.set(3, -1.5, -4);
  const fill = new THREE.DirectionalLight(0xffdcd4, 0.9);
  fill.position.set(0.5, -3, 4);
  scene.add(key, rim, fill);

  const world = new THREE.Group();   // 기울기·마우스 반응
  const globe = new THREE.Group();   // 자전
  world.rotation.set(0.32, 0, -0.16);
  world.add(globe);
  scene.add(world);

  // Pearl
  globe.add(new THREE.Mesh(
    new THREE.SphereGeometry(1, 96, 64),
    new THREE.MeshPhysicalMaterial({
      color: 0xfbe8e2, roughness: 0.28, metalness: 0,
      emissive: 0xf3cfc6, emissiveIntensity: 0.22,
      clearcoat: 1, clearcoatRoughness: 0.12,
      sheen: 1, sheenColor: new THREE.Color(0xf5c2b8), sheenRoughness: 0.4,
      iridescence: 0.9, iridescenceIOR: 1.35, iridescenceThicknessRange: [220, 600],
    }),
  ));

  // Gold graticule
  const gold = new THREE.MeshStandardMaterial({ color: 0xd9bf91, metalness: 1, roughness: 0.24 });
  const R = 1.012, TUBE = 0.0068;
  for (let i = 0; i < 6; i++) {
    const meridian = new THREE.Mesh(new THREE.TorusGeometry(R, TUBE, 8, 160), gold);
    meridian.rotation.y = (i * Math.PI) / 6;
    globe.add(meridian);
  }
  [-60, -30, 0, 30, 60].forEach((lat) => {
    const phi = (lat * Math.PI) / 180;
    const ring = new THREE.Mesh(new THREE.TorusGeometry(R * Math.cos(phi), lat === 0 ? TUBE * 1.6 : TUBE, 8, 160), gold);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = R * Math.sin(phi);
    globe.add(ring);
  });

  // Orbit ring with a small pearl moon (WEDNESS 로고의 궤도 모티프)
  const orbit = new THREE.Group();
  orbit.rotation.set(1.2, 0.1, 0.42);
  world.add(orbit);
  const ORBIT_R = 1.42;
  orbit.add(new THREE.Mesh(
    new THREE.TorusGeometry(ORBIT_R, 0.0048, 8, 240),
    new THREE.MeshStandardMaterial({ color: 0xead09a, metalness: 1, roughness: 0.2 }),
  ));
  const moon = new THREE.Mesh(
    new THREE.SphereGeometry(0.06, 32, 16),
    new THREE.MeshPhysicalMaterial({ color: 0xf2bfb6, roughness: 0.2, clearcoat: 1, iridescence: 0.7 }),
  );
  orbit.add(moon);

  // Gold dust
  const dot = document.createElement('canvas');
  dot.width = dot.height = 64;
  const dctx = dot.getContext('2d');
  const grad = dctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.35, 'rgba(255,255,255,0.8)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  dctx.fillStyle = grad;
  dctx.fillRect(0, 0, 64, 64);
  const COUNT = coarse ? 90 : 160;
  const pos = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    const r = 1.25 + Math.random() * 0.75;
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    pos.set([r * Math.sin(ph) * Math.cos(th), r * Math.cos(ph) * 0.8, r * Math.sin(ph) * Math.sin(th)], i * 3);
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({
    color: 0xc29a58, size: 0.07, map: new THREE.CanvasTexture(dot),
    transparent: true, opacity: 0.85, depthWrite: false,
  }));
  world.add(dust);

  // Interaction: 드래그(터치는 좌우)로 회전, 놓으면 관성 후 천천히 자전
  const BASE = reduceMotion ? 0 : 0.22;
  let vel = BASE, dragging = false, lastX = 0, lastY = 0, lastT = 0;
  let tilt = 0, tiltTarget = 0, hx = 0, hy = 0, hxT = 0, hyT = 0, moonA = 0.6;

  holder.addEventListener('pointerdown', (e) => {
    dragging = true;
    lastX = e.clientX; lastY = e.clientY; lastT = performance.now();
    holder.setPointerCapture(e.pointerId);
    orb.classList.add('is-touched');
  });
  holder.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const now = performance.now();
    const dx = e.clientX - lastX, dy = e.clientY - lastY;
    const dt = Math.max(8, now - lastT) / 1000;
    globe.rotation.y += dx * 0.01;
    vel = clamp((dx * 0.01) / dt, -7, 7);
    tiltTarget = clamp(tiltTarget + dy * 0.004, -0.45, 0.45);
    lastX = e.clientX; lastY = e.clientY; lastT = now;
  });
  const release = () => { dragging = false; };
  holder.addEventListener('pointerup', release);
  holder.addEventListener('pointercancel', release);
  if (!coarse) {
    addEventListener('pointermove', (e) => {
      const r = orb.getBoundingClientRect();
      hxT = clamp(((e.clientX - r.left) / r.width - 0.5) * 2, -1, 1);
      hyT = clamp(((e.clientY - r.top) / r.height - 0.5) * 2, -1, 1);
    }, { passive: true });
  }

  const resize = () => {
    const s = holder.clientWidth;
    if (s) renderer.setSize(s, s, false);
  };

  let raf = 0, running = false, visible = false, prev = 0;
  const frame = (now) => {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - prev) / 1000);
    prev = now;
    if (!dragging) {
      vel += (BASE - vel) * Math.min(1, dt * 1.4);
      globe.rotation.y += vel * dt;
      tiltTarget *= 1 - Math.min(1, dt * 0.9);
    }
    tilt += (tiltTarget - tilt) * Math.min(1, dt * 6);
    hx += (hxT - hx) * Math.min(1, dt * 2.5);
    hy += (hyT - hy) * Math.min(1, dt * 2.5);
    world.rotation.x = 0.32 + tilt + hy * 0.1;
    world.rotation.y = hx * 0.18;
    if (!reduceMotion) {
      moonA += dt * 0.55;
      dust.rotation.y -= dt * 0.035;
    }
    moon.position.set(Math.cos(moonA) * ORBIT_R, Math.sin(moonA) * ORBIT_R, 0);
    renderer.render(scene, camera);
  };
  const sync = () => {
    const should = visible && !document.hidden;
    if (should && !running) { running = true; prev = performance.now(); raf = requestAnimationFrame(frame); }
    else if (!should && running) { running = false; cancelAnimationFrame(raf); }
  };

  orb.prepend(holder);
  resize();
  new ResizeObserver(resize).observe(holder);
  renderer.render(scene, camera);
  onVisible(orb, (v) => { visible = v; sync(); });
  document.addEventListener('visibilitychange', sync);

  const hint = orb.parentElement.querySelector('.orb-hint');
  if (hint) hint.textContent = coarse ? '좌우로 밀어 돌려보세요' : '드래그해서 돌려보세요';
  requestAnimationFrame(() => orb.classList.add('is-3d'));
}

/* =========================================================
   4. Liquid glass — 유리 굴절(크롬 계열) + 빛 반사 하이라이트(모든 브라우저)
   ========================================================= */
function displacementMap(w, h, radius, band) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(w, h);
  const d = img.data;
  const hw = w / 2, hh = h / 2, r = Math.min(radius, hw, hh);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const px = x + 0.5 - hw, py = y + 0.5 - hh;
      const qx = Math.abs(px) - (hw - r), qy = Math.abs(py) - (hh - r);
      // 둥근 사각형 가장자리까지의 거리(안쪽 양수)와 바깥 방향 법선
      let nx, ny, dist;
      if (qx > 0 && qy > 0) {
        const len = Math.hypot(qx, qy) || 1;
        nx = (qx / len) * Math.sign(px); ny = (qy / len) * Math.sign(py);
        dist = r - len;
      } else if (qx > qy) {
        nx = Math.sign(px); ny = 0; dist = r - qx;
      } else {
        nx = 0; ny = Math.sign(py); dist = r - qy;
      }
      let k = 0;
      if (dist < band) {
        const t = 1 - Math.max(0, dist) / band;
        k = t * t * (3 - 2 * t);
      }
      const i = (y * w + x) * 4;
      d[i] = 128 - nx * k * 127;
      d[i + 1] = 128 - ny * k * 127;
      d[i + 2] = 128;
      d[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas.toDataURL();
}

function liquidGlass() {
  // 포인터를 따라 움직이는 빛 반사 (모든 브라우저)
  document.addEventListener('pointermove', (e) => {
    const el = e.target.closest && e.target.closest('.btn, .lg, .tabs');
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  }, { passive: true });

  // 굴절은 backdrop-filter에 SVG 필터를 쓸 수 있는 크롬 계열에서만 적용
  const chromium = navigator.userAgentData?.brands?.some((b) => /Chromium/.test(b.brand));
  const defs = document.querySelector('#fx-defs defs');
  if (!chromium || !defs) return;
  root.classList.add('lg-refract');

  const NS = 'http://www.w3.org/2000/svg';
  const targets = [document.querySelector('.header-inner'), ...document.querySelectorAll('.lg')].filter(Boolean);
  targets.forEach((el, i) => {
    const filter = document.createElementNS(NS, 'filter');
    filter.id = `lg-${i}`;
    filter.setAttribute('x', '0');
    filter.setAttribute('y', '0');
    filter.setAttribute('width', '100%');
    filter.setAttribute('height', '100%');
    filter.setAttribute('color-interpolation-filters', 'sRGB');
    const map = document.createElementNS(NS, 'feImage');
    map.setAttribute('x', '0');
    map.setAttribute('y', '0');
    map.setAttribute('result', 'map');
    map.setAttribute('preserveAspectRatio', 'none');
    const disp = document.createElementNS(NS, 'feDisplacementMap');
    disp.setAttribute('in', 'SourceGraphic');
    disp.setAttribute('in2', 'map');
    disp.setAttribute('xChannelSelector', 'R');
    disp.setAttribute('yChannelSelector', 'G');
    filter.append(map, disp);
    defs.appendChild(filter);

    let size = '';
    const update = () => {
      const w = Math.round(el.offsetWidth), h = Math.round(el.offsetHeight);
      if (w < 4 || h < 4 || size === `${w}x${h}`) return;
      size = `${w}x${h}`;
      const band = Math.min(22, h * 0.42);
      const url = displacementMap(w, h, h / 2, band);
      map.setAttribute('href', url);
      map.setAttributeNS('http://www.w3.org/1999/xlink', 'href', url);
      map.setAttribute('width', w);
      map.setAttribute('height', h);
      disp.setAttribute('scale', String(Math.round(Math.min(48, band * 1.9))));
      el.style.setProperty('--lg-filter', `url(#lg-${i}) blur(5px) saturate(180%)`);
    };
    let timer = 0;
    new ResizeObserver(() => { clearTimeout(timer); timer = setTimeout(update, 120); }).observe(el);
  });
}

/* =========================================================
   Init
   ========================================================= */
intro();
liquidLogo();
liquidGlass();

const SHADERS = [
  ['.hero', { colors: ['#fbf7f2', '#f6dbd4', '#efdfc4', '#e5ada4'], bloom: [0.28, 0.62], scale: coarse ? 0.35 : 0.5 }],
  ['.quote-band', { colors: ['#f8e4de', '#f3e4d4', '#ecc3ba', '#fffaf6'], bloom: [0.5, 0.5], scale: 0.4, speed: 1.3 }],
];
SHADERS.forEach(([sel, opts]) => {
  const host = document.querySelector(sel);
  if (!host) return;
  try { shaderGradient(host, opts); } catch (err) { console.warn('[WEDNESS] shader gradient disabled:', err); }
});

const orb = document.querySelector('.orb');
if (orb) {
  let started = false;
  onVisible(orb, (v) => {
    if (!v || started) return;
    started = true;
    afterLoad(() => sphere(orb).catch((err) => console.warn('[WEDNESS] 3D sphere disabled:', err)));
  }, '200px');
}
