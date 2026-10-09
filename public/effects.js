// WEDNESS — visual effects
//  1) liquid logo intro + liquid hover on wordmarks
//  2) hero 3D: 360° 구체 '안'에서 시작해 스크롤하면 밖으로 빠져나와 진주 구체가 드러남 (three.js)
//  3) dark silk shader gradient (quote band)
//  4) liquid glass refraction (Chromium) + cursor ring
// 모든 효과는 기본 화면 위에 덧입히는 방식이라, 실패하거나 지원되지 않아도 내용은 그대로 보입니다.

const root = document.documentElement;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarse = matchMedia('(pointer: coarse)').matches;
const lowPower = (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 4;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const onVisible = (el, cb, rootMargin = '0px') => {
  new IntersectionObserver(([e]) => cb(e.isIntersecting), { rootMargin }).observe(el);
};
const afterLoad = (fn) => {
  const run = () => ('requestIdleCallback' in window ? requestIdleCallback(fn, { timeout: 800 }) : setTimeout(fn, 100));
  if (document.readyState === 'complete') run();
  else addEventListener('load', run, { once: true });
};

/* =========================================================
   1. Liquid logo
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

function liquidHover() {
  const disp = document.querySelector('#liquid-logo feDisplacementMap');
  const turb = document.querySelector('#liquid-logo feTurbulence');
  if (!disp || !turb || reduceMotion) return;
  let raf = 0;
  document.querySelectorAll('[data-liquid]').forEach((word) => {
    const host = word.closest('a') || word;
    host.addEventListener('pointerenter', () => {
      if (raf) return;
      const size = parseFloat(getComputedStyle(word).fontSize) || 18;
      const amp = clamp(size * 0.45, 8, 60);
      const freq = clamp(0.36 / size, 0.0015, 0.02);
      const start = performance.now();
      word.classList.add('is-liquid');
      const tick = (now) => {
        const p = (now - start) / 1300;
        if (p >= 1) {
          disp.setAttribute('scale', '0');
          word.classList.remove('is-liquid');
          raf = 0;
          return;
        }
        disp.setAttribute('scale', (Math.sin(p * Math.PI) * amp).toFixed(2));
        turb.setAttribute('baseFrequency', `${(freq * (1 + p * 0.6)).toFixed(5)} ${(freq * 3.5 * (1 - p * 0.3)).toFixed(5)}`);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });
  });
}

/* =========================================================
   2. Hero 3D scene
   ========================================================= */
const NOISE3 = `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0); const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.0-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857; vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z); vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0; vec4 s1=floor(b1)*2.0+1.0; vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0); m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

const SPHERE_VERT = `
varying vec3 vPos;
varying vec3 vNormalW;
varying vec3 vWorld;
void main() {
  vPos = position;
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  vNormalW = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * w;
}`;

// 경위선(위도·경도 30° 간격) — 화면 픽셀 기준으로 안티에일리어싱
const GRID = `
#define PI 3.141592653589793
float gridLines(vec3 p, float px) {
  vec3 d = normalize(p);
  float lon = atan(d.z, d.x);
  float lat = asin(clamp(d.y, -1.0, 1.0));
  float lonN = lon / (PI / 6.0);
  float lonN2 = fract(lon / (2.0 * PI)) * 12.0;
  float fwLon = max(min(fwidth(lonN), fwidth(lonN2)), 1e-5);
  float dLon = abs(fract(lonN - 0.5) - 0.5) / fwLon;
  float latN = lat / (PI / 6.0);
  float dLat = abs(fract(latN - 0.5) - 0.5) / max(fwidth(latN), 1e-5);
  float poleFade = smoothstep(0.04, 0.35, cos(lat));
  float mer = (1.0 - smoothstep(px * 0.5, px * 0.5 + 1.0, dLon)) * poleFade;
  float par = 1.0 - smoothstep(px * 0.5, px * 0.5 + 1.0, dLat);
  return clamp(max(mer, par), 0.0, 1.0);
}`;

const INNER_FRAG = `
uniform float uTime;
varying vec3 vPos;
${NOISE3}
${GRID}
void main() {
  vec3 dir = normalize(vPos);
  float t = uTime;
  float n = snoise(dir * 1.4 + vec3(0.0, 0.0, t * 0.025)) * 0.5 + 0.5;
  float n2 = snoise(dir * 3.1 - vec3(t * 0.02, 0.0, 0.0)) * 0.5 + 0.5;
  vec3 col = mix(vec3(0.045, 0.032, 0.032), vec3(0.19, 0.095, 0.095), n);
  col = mix(col, vec3(0.56, 0.33, 0.28), pow(n2, 3.0) * 0.55);
  float horizon = exp(-pow(dir.y * 3.0, 2.0));
  col += vec3(0.9, 0.64, 0.42) * horizon * 0.16;
  col += vec3(1.0, 0.86, 0.76) * pow(max(dir.y, 0.0), 7.0) * 0.22;
  float g = gridLines(vPos, 1.0);
  vec3 gold = vec3(0.92, 0.78, 0.55);
  col += gold * g * (0.22 + 0.38 * horizon);
  // 반짝임
  float sp = snoise(dir * 60.0 + t * 0.4);
  col += vec3(1.0, 0.9, 0.78) * smoothstep(0.82, 1.0, sp) * 0.5;
  gl_FragColor = vec4(col, 1.0);
}`;

const OUTER_FRAG = `
uniform float uTime;
uniform float uReveal;
uniform vec3 uCam;
varying vec3 vPos;
varying vec3 vNormalW;
varying vec3 vWorld;
${NOISE3}
${GRID}
void main() {
  vec3 N = normalize(vNormalW);
  vec3 V = normalize(uCam - vWorld);
  float ndv = max(dot(N, V), 0.0);
  float fres = pow(1.0 - ndv, 2.2);
  vec3 L = normalize(vec3(-0.55, 0.75, 0.65));
  float diff = max(dot(N, L), 0.0) * 0.55 + 0.45;
  float n = snoise(normalize(vPos) * 2.2 + uTime * 0.03) * 0.5 + 0.5;
  vec3 pearl = mix(vec3(0.98, 0.93, 0.9), vec3(0.93, 0.7, 0.64), fres * 0.85);
  vec3 irid = 0.5 + 0.5 * cos(6.2831 * (vec3(0.0, 0.33, 0.67) + fres * 1.3 + n * 0.35));
  pearl = mix(pearl, pearl * (0.75 + irid * 0.5), 0.18 + fres * 0.3);
  pearl *= diff;
  float spec = pow(max(dot(reflect(-L, N), V), 0.0), 60.0);
  pearl += spec * 0.75;
  pearl += vec3(1.0, 0.76, 0.68) * fres * 0.4;
  float g = gridLines(vPos, 1.15);
  vec3 gold = vec3(0.86, 0.7, 0.45) * (0.85 + spec * 2.0 + diff * 0.2);
  vec3 col = mix(pearl, gold, g * 0.92);
  // 바깥에 막 나왔을 땐 유리처럼 투명 → 점점 진주로
  float a = mix(0.18 + fres * 0.7, 1.0, uReveal);
  a = max(a, g * 0.9);
  gl_FragColor = vec4(col, a);
}`;

const DUST_VERT = `
uniform float uTime;
uniform float uPx;
uniform float uMax;
attribute float aSeed;
varying float vTw;
void main() {
  vec3 p = position;
  p.y += sin(uTime * 0.3 + aSeed * 6.28) * 0.05;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vTw = 0.45 + 0.55 * sin(uTime * (1.2 + aSeed * 2.0) + aSeed * 40.0);
  gl_PointSize = clamp(uPx * (0.6 + aSeed) / -mv.z, 1.5, uMax);
  gl_Position = projectionMatrix * mv;
}`;
const DUST_FRAG = `
varying float vTw;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  float a = smoothstep(0.5, 0.0, d);
  a = a * a * vTw;
  gl_FragColor = vec4(vec3(1.0, 0.86, 0.62) * a, a);
}`;

const HALO_FRAG = `
uniform float uAlpha;
varying vec2 vUv;
void main() {
  float d = length(vUv - 0.5) * 2.0;
  float a = smoothstep(1.0, 0.0, d);
  a = pow(a, 2.4) * uAlpha;
  gl_FragColor = vec4(vec3(0.95, 0.66, 0.58) * a, a);
}`;

function petalTexture() {
  const c = document.createElement('canvas');
  c.width = 128; c.height = 160;
  const x = c.getContext('2d');
  const g = x.createLinearGradient(0, 0, 0, 160);
  g.addColorStop(0, '#fff6f2');
  g.addColorStop(0.55, '#f6cfc6');
  g.addColorStop(1, '#e09c92');
  x.fillStyle = g;
  x.beginPath();
  x.moveTo(64, 156);
  x.bezierCurveTo(10, 120, 2, 50, 40, 12);
  x.bezierCurveTo(52, 2, 60, 14, 64, 20);
  x.bezierCurveTo(68, 14, 76, 2, 88, 12);
  x.bezierCurveTo(126, 50, 118, 120, 64, 156);
  x.fill();
  x.globalCompositeOperation = 'source-atop';
  const v = x.createRadialGradient(64, 150, 0, 64, 150, 70);
  v.addColorStop(0, 'rgba(190,110,100,0.35)');
  v.addColorStop(1, 'rgba(190,110,100,0)');
  x.fillStyle = v;
  x.fillRect(0, 0, 128, 160);
  return c;
}

async function heroScene(stage) {
  const THREE = await import('three');
  const { RoomEnvironment } = await import('three/addons/environments/RoomEnvironment.js');

  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setClearColor(0x0d0a0a, 1);
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, coarse || lowPower ? 1.5 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  stage.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();
  scene.fog = new THREE.FogExp2(0x0d0a0a, 0.035);

  const camera = new THREE.PerspectiveCamera(72, 1, 0.01, 100);
  const key = new THREE.DirectionalLight(0xfff0dc, 2.2);
  key.position.set(-2, 3, 4);
  const warm = new THREE.PointLight(0xffc7a8, 3, 6, 1.6);
  warm.position.set(0, 0.2, 0);
  scene.add(key, warm, new THREE.AmbientLight(0xffe2d6, 0.35));

  const world = new THREE.Group();
  scene.add(world);

  // Sphere: inner (360° room) + outer (pearl shell)
  const uniforms = { uTime: { value: 0 }, uReveal: { value: 0 }, uCam: { value: new THREE.Vector3() } };
  const seg = coarse ? [96, 64] : [160, 112];
  const geo = new THREE.SphereGeometry(1, seg[0], seg[1]);
  const inner = new THREE.Mesh(geo, new THREE.ShaderMaterial({
    uniforms, vertexShader: SPHERE_VERT, fragmentShader: INNER_FRAG, side: THREE.BackSide, fog: false,
  }));
  const outer = new THREE.Mesh(geo, new THREE.ShaderMaterial({
    uniforms, vertexShader: SPHERE_VERT, fragmentShader: OUTER_FRAG, side: THREE.FrontSide,
    transparent: true, depthWrite: false, fog: false,
  }));
  outer.renderOrder = 2;
  const globe = new THREE.Group();
  globe.add(inner, outer);
  world.add(globe);

  // Halo behind the pearl
  const haloMat = new THREE.ShaderMaterial({
    uniforms: { uAlpha: { value: 0 } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: HALO_FRAG,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false,
  });
  const halo = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 4.4), haloMat);
  halo.renderOrder = -1;
  scene.add(halo);

  // Orbit ring + pearl moon (로고의 궤도 모티프)
  const orbit = new THREE.Group();
  orbit.rotation.set(1.22, 0.1, 0.38);
  world.add(orbit);
  const ORBIT_R = 1.36;
  orbit.add(new THREE.Mesh(
    new THREE.TorusGeometry(ORBIT_R, 0.0055, 10, 260),
    new THREE.MeshStandardMaterial({ color: 0xe4c88f, metalness: 1, roughness: 0.18 }),
  ));
  const moon = new THREE.Mesh(
    new THREE.SphereGeometry(0.06, 32, 16),
    new THREE.MeshPhysicalMaterial({ color: 0xf6d2c8, roughness: 0.2, clearcoat: 1, iridescence: 0.8 }),
  );
  orbit.add(moon);

  // Petals (instanced)
  const PETALS = coarse || lowPower ? 70 : 150;
  const petalTex = new THREE.CanvasTexture(petalTexture());
  petalTex.colorSpace = THREE.SRGBColorSpace;
  const petalGeo = new THREE.PlaneGeometry(1, 1.25, 4, 4);
  const pp = petalGeo.attributes.position;
  for (let i = 0; i < pp.count; i++) {
    const x = pp.getX(i), y = pp.getY(i);
    pp.setZ(i, -x * x * 0.55 + y * y * 0.12);
  }
  petalGeo.computeVertexNormals();
  const petals = new THREE.InstancedMesh(petalGeo, new THREE.MeshStandardMaterial({
    map: petalTex, transparent: true, alphaTest: 0.35, side: THREE.DoubleSide,
    roughness: 0.55, metalness: 0, emissive: 0xb0706a, emissiveIntensity: 0.45,
  }), PETALS);
  const P = [];
  const spawn = (o, inside, anywhere) => {
    if (inside) {
      const r = 0.45 + Math.random() * 0.45;
      const th = Math.random() * Math.PI * 2;
      o.x = Math.cos(th) * r; o.z = Math.sin(th) * r;
      o.y = anywhere ? (Math.random() * 1.4 - 0.7) : 0.75;
    } else {
      o.x = (Math.random() * 2 - 1) * 3.2; o.z = (Math.random() * 2 - 1) * 3.2;
      o.y = anywhere ? (Math.random() * 2 - 1) * 2.6 : 2.6;
      if (Math.hypot(o.x, o.z) < 1.25) o.x += Math.sign(o.x || 1) * 1.3;
    }
  };
  for (let i = 0; i < PETALS; i++) {
    const o = {
      inside: i < PETALS * 0.45,
      s: (0.045 + Math.random() * 0.05) * (i < PETALS * 0.45 ? 1 : 1.4),
      fall: 0.04 + Math.random() * 0.07,
      sway: Math.random() * Math.PI * 2,
      rot: new THREE.Euler(Math.random() * 6, Math.random() * 6, Math.random() * 6),
      spin: new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).multiplyScalar(1.4),
      x: 0, y: 0, z: 0,
    };
    spawn(o, o.inside, true);
    P.push(o);
  }
  world.add(petals);
  const dummy = new THREE.Object3D();

  // Gold dust
  const DUST = coarse || lowPower ? 260 : 600;
  const dpos = new Float32Array(DUST * 3), dseed = new Float32Array(DUST);
  for (let i = 0; i < DUST; i++) {
    const inside = i < DUST * 0.4;
    const r = inside ? 0.25 + Math.random() * 0.7 : 1.15 + Math.random() * 2.6;
    const th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
    dpos.set([r * Math.sin(ph) * Math.cos(th), r * Math.cos(ph), r * Math.sin(ph) * Math.sin(th)], i * 3);
    dseed[i] = Math.random();
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dpos, 3));
  dustGeo.setAttribute('aSeed', new THREE.BufferAttribute(dseed, 1));
  const dustUniforms = { uTime: uniforms.uTime, uPx: { value: 20 }, uMax: { value: 16 } };
  const dust = new THREE.Points(dustGeo, new THREE.ShaderMaterial({
    uniforms: dustUniforms, vertexShader: DUST_VERT, fragmentShader: DUST_FRAG,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false,
  }));
  world.add(dust);

  // Interaction: 드래그로 둘러보기(안) / 돌려보기(밖)
  let yaw = 0, pitch = 0, yawVel = 0, dragging = false, lx = 0, ly = 0, lt = 0, hx = 0, hy = 0, hxT = 0, hyT = 0;
  stage.addEventListener('pointerdown', (e) => {
    dragging = true; lx = e.clientX; ly = e.clientY; lt = performance.now();
    stage.setPointerCapture(e.pointerId);
  });
  stage.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const now = performance.now();
    const dx = e.clientX - lx, dy = e.clientY - ly;
    const k = 0.0045;
    yaw += dx * k;
    pitch = clamp(pitch + dy * k * 0.7, -0.6, 0.6);
    yawVel = clamp((dx * k) / (Math.max(8, now - lt) / 1000), -5, 5);
    lx = e.clientX; ly = e.clientY; lt = now;
  });
  const release = () => { dragging = false; };
  stage.addEventListener('pointerup', release);
  stage.addEventListener('pointercancel', release);
  if (!coarse) {
    addEventListener('pointermove', (e) => {
      hxT = (e.clientX / innerWidth - 0.5) * 2;
      hyT = (e.clientY / innerHeight - 0.5) * 2;
    }, { passive: true });
  }

  let w = 1, h = 1, dEnd = 6;
  const resize = () => {
    w = stage.clientWidth; h = stage.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // 마지막 장면에서 구체 지름이 화면 짧은 변의 약 62%가 되도록 거리 계산
    dEnd = (1 * h) / (0.62 * Math.min(w, h) * Math.tan(THREE.MathUtils.degToRad(15)));
    const dpr = renderer.getPixelRatio();
    dustUniforms.uPx.value = 11 * dpr * (h / 900);
    dustUniforms.uMax.value = 9 * dpr;
  };
  resize();
  new ResizeObserver(resize).observe(stage);

  let raf = 0, running = false, visible = false, prev = 0, sp = window.WEDNESS?.heroProgress || 0, t = 0;
  const step = (now) => {
    const dt = Math.min(0.05, Math.max(0, (now - prev) / 1000));
    prev = now;
    if (!reduceMotion) t += dt;
    uniforms.uTime.value = t;

    const target = window.WEDNESS?.heroProgress || 0;
    sp += (target - sp) * Math.min(1, dt * 4);
    const e = ease(clamp(sp / 0.92, 0, 1));

    // camera: 구체 중심 → 바깥으로 후퇴하며 화각이 좁아짐(돌리 줌)
    camera.fov = lerp(74, 30, e);
    camera.position.set(lerp(0, 0.05, e), lerp(0, 0.12, e), lerp(0.0, dEnd, e));
    camera.lookAt(0, lerp(-0.05, 0, e), lerp(-1, 0, e) - 0.0001);
    camera.updateProjectionMatrix();
    uniforms.uCam.value.copy(camera.position);
    const dist = camera.position.length();
    uniforms.uReveal.value = clamp((dist - 1.0) / 2.2, 0, 1);
    haloMat.uniforms.uAlpha.value = clamp((dist - 1.3) / 2.5, 0, 1) * 0.85;
    halo.position.set(0, 0, -0.6);
    halo.lookAt(camera.position);

    if (!dragging) {
      const base = reduceMotion ? 0 : lerp(0.035, 0.16, e);
      yawVel += (base - yawVel) * Math.min(1, dt * 1.2);
      yaw += yawVel * dt;
      pitch *= 1 - Math.min(1, dt * 0.6);
    }
    hx += (hxT - hx) * Math.min(1, dt * 2);
    hy += (hyT - hy) * Math.min(1, dt * 2);
    // 안에서는 살짝 올려다보는 시선(경위선이 곡선으로 보이도록), 밖에서는 약간 내려다봄
    world.rotation.set(lerp(-0.42, 0.18, e) + pitch + hy * 0.06, yaw + hx * 0.1, lerp(0.12, -0.08, e));

    if (!reduceMotion) orbit.rotation.z += dt * 0.12;
    moon.position.set(Math.cos(t * 0.5) * ORBIT_R, Math.sin(t * 0.5) * ORBIT_R, 0);
    warm.intensity = lerp(3, 0.4, e);

    for (let i = 0; i < PETALS; i++) {
      const o = P[i];
      if (!reduceMotion) {
        o.y -= o.fall * dt;
        o.sway += dt * 0.8;
        o.x += Math.sin(o.sway) * 0.02 * dt;
        o.rot.x += o.spin.x * dt; o.rot.y += o.spin.y * dt; o.rot.z += o.spin.z * dt;
        if (o.inside && (o.y < -0.75 || Math.hypot(o.x, o.y, o.z) > 0.95)) spawn(o, true, false);
        if (!o.inside && o.y < -2.6) spawn(o, false, false);
      }
      dummy.position.set(o.x, o.y, o.z);
      dummy.rotation.copy(o.rot);
      dummy.scale.setScalar(o.s);
      dummy.updateMatrix();
      petals.setMatrixAt(i, dummy.matrix);
    }
    petals.instanceMatrix.needsUpdate = true;

    renderer.render(scene, camera);
  };
  const frame = (now) => { raf = requestAnimationFrame(frame); step(now); };
  const sync = () => {
    const should = visible && !document.hidden;
    if (should && !running) { running = true; prev = performance.now(); raf = requestAnimationFrame(frame); }
    else if (!should && running) { running = false; cancelAnimationFrame(raf); }
  };
  onVisible(stage.closest('.hero'), (v) => { visible = v; sync(); });
  document.addEventListener('visibilitychange', sync);
  prev = performance.now();
  step(prev);
  requestAnimationFrame(() => { stage.classList.add('is-ready'); root.classList.add('has-3d'); });
}

/* =========================================================
   3. Dark silk shader gradient
   ========================================================= */
const SILK_VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.0,1.0);}';
const SILK_FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 u_res;
uniform float u_time;
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
  float t = u_time * 0.07;
  vec2 q = vec2(snoise(p * 0.5 + vec2(0.0, t)), snoise(p * 0.5 + vec2(5.2, -t)));
  float n = snoise(p * 0.7 + 1.2 * q + vec2(t * 0.6, 0.0));
  // 실크 주름: 노이즈의 줄무늬
  float fold = sin((p.x * 0.9 + n * 1.1 + q.y * 0.8) * 2.2 + t * 1.2) * 0.5 + 0.5;
  fold = smoothstep(0.35, 1.0, fold);
  vec3 col = mix(u_c0, u_c1, smoothstep(-0.7, 0.9, n));
  col = mix(col, u_c2, fold * 0.32);
  col += u_c3 * pow(fold, 4.0) * 0.08;
  // 문구가 놓이는 가운데는 어둡게 눌러 가독성 확보
  float center = smoothstep(0.55, 0.0, length((uv - 0.5) * vec2(1.1, 1.6)));
  col *= 1.0 - center * 0.45;
  float grain = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
  col += (grain - 0.5) * (3.0 / 255.0);
  gl_FragColor = vec4(col, 1.0);
}`;
const hexToRgb = (hx) => [1, 3, 5].map((i) => parseInt(hx.slice(i, i + 2), 16) / 255);

function silk(host, colors) {
  const canvas = document.createElement('canvas');
  canvas.className = 'shader-bg';
  canvas.setAttribute('aria-hidden', 'true');
  Object.assign(canvas.style, { position: 'absolute', inset: '0', width: '100%', height: '100%', zIndex: '0', opacity: '0', transition: 'opacity 1.6s ease' });
  const gl = canvas.getContext('webgl', { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: 'low-power' });
  if (!gl) return;
  const sh = (type, src) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  };
  const prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, SILK_VERT));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, SILK_FRAG));
  gl.linkProgram(prog);
  gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const u = (n) => gl.getUniformLocation(prog, n);
  colors.forEach((c, i) => gl.uniform3fv(u('u_c' + i), hexToRgb(c)));
  const uRes = u('u_res'), uTime = u('u_time');
  const scale = coarse ? 0.35 : 0.5;
  let w = 1, h = 1, t = Math.random() * 50, last = 0, raf = 0, running = false, visible = false;
  const draw = () => { gl.uniform2f(uRes, w, h); gl.uniform1f(uTime, t); gl.drawArrays(gl.TRIANGLES, 0, 3); };
  const resize = (cw, ch) => {
    w = Math.max(1, Math.round(cw * scale)); h = Math.max(1, Math.round(ch * scale));
    canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); draw();
  };
  const frame = (now) => {
    raf = requestAnimationFrame(frame);
    if (coarse && now - last < 33) return;
    t += Math.min(0.05, (now - last) / 1000);
    last = now;
    draw();
  };
  const sync = () => {
    const should = visible && !document.hidden && !reduceMotion;
    if (should && !running) { running = true; last = performance.now(); raf = requestAnimationFrame(frame); }
    else if (!should && running) { running = false; cancelAnimationFrame(raf); }
  };
  host.prepend(canvas);
  const r = host.getBoundingClientRect();
  resize(r.width, r.height);
  new ResizeObserver(([e]) => resize(e.contentRect.width, e.contentRect.height)).observe(host);
  onVisible(host, (v) => { visible = v; sync(); });
  document.addEventListener('visibilitychange', sync);
  requestAnimationFrame(() => { canvas.style.opacity = '1'; });
}

/* =========================================================
   4. Liquid glass + cursor
   ========================================================= */
function displacementMap(w, h, radius, band) {
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(w, h);
  const d = img.data;
  const hw = w / 2, hh = h / 2, r = Math.min(radius, hw, hh);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const px = x + 0.5 - hw, py = y + 0.5 - hh;
      const qx = Math.abs(px) - (hw - r), qy = Math.abs(py) - (hh - r);
      let nx, ny, dist;
      if (qx > 0 && qy > 0) {
        const len = Math.hypot(qx, qy) || 1;
        nx = (qx / len) * Math.sign(px); ny = (qy / len) * Math.sign(py); dist = r - len;
      } else if (qx > qy) { nx = Math.sign(px); ny = 0; dist = r - qx; }
      else { nx = 0; ny = Math.sign(py); dist = r - qy; }
      let k = 0;
      if (dist < band) { const t = 1 - Math.max(0, dist) / band; k = t * t * (3 - 2 * t); }
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
  document.addEventListener('pointermove', (e) => {
    const el = e.target.closest && e.target.closest('.btn, .lg, .tabs');
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  }, { passive: true });

  const chromium = navigator.userAgentData?.brands?.some((b) => /Chromium/.test(b.brand));
  const defs = document.querySelector('#fx-defs defs');
  if (!chromium || !defs) return;
  root.classList.add('lg-refract');
  const NS = 'http://www.w3.org/2000/svg';
  const targets = [document.querySelector('.header-inner'), ...document.querySelectorAll('.lg')].filter(Boolean);
  targets.forEach((el, i) => {
    const filter = document.createElementNS(NS, 'filter');
    filter.id = `lg-${i}`;
    ['x', 'y'].forEach((a) => filter.setAttribute(a, '0'));
    ['width', 'height'].forEach((a) => filter.setAttribute(a, '100%'));
    filter.setAttribute('color-interpolation-filters', 'sRGB');
    const map = document.createElementNS(NS, 'feImage');
    map.setAttribute('x', '0'); map.setAttribute('y', '0');
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
      el.style.setProperty('--lg-filter', `url(#lg-${i}) blur(6px) saturate(170%)`);
    };
    let timer = 0;
    new ResizeObserver(() => { clearTimeout(timer); timer = setTimeout(update, 120); }).observe(el);
  });
}

function cursor() {
  if (coarse || reduceMotion || !matchMedia('(pointer: fine)').matches) return;
  const c = document.createElement('div');
  c.className = 'cursor';
  c.setAttribute('aria-hidden', 'true');
  document.body.appendChild(c);
  let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y, raf = 0;
  const loop = () => {
    cx += (x - cx) * 0.2; cy += (y - cy) * 0.2;
    c.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
    raf = Math.abs(x - cx) + Math.abs(y - cy) > 0.1 ? requestAnimationFrame(loop) : 0;
  };
  addEventListener('pointermove', (e) => {
    x = e.clientX; y = e.clientY;
    c.classList.add('is-on');
    const t = e.target;
    c.classList.toggle('is-hover', !!(t.closest && t.closest('a, button, label, summary, [role="tab"], .hero-stage')));
    c.classList.toggle('is-light', !!(t.closest && t.closest('.is-light')));
    if (!raf) raf = requestAnimationFrame(loop);
  }, { passive: true });
  document.addEventListener('pointerleave', () => c.classList.remove('is-on'));
}

/* =========================================================
   Init
   ========================================================= */
intro();
liquidHover();
liquidGlass();
cursor();

const band = document.querySelector('.quote-band');
if (band) {
  try { silk(band, ['#120d0d', '#2a1817', '#7a5340', '#f0c9a8']); } catch (err) { console.warn('[WEDNESS] silk disabled:', err); }
}

const stage = document.querySelector('.hero-stage');
if (stage) {
  afterLoad(() => heroScene(stage).catch((err) => console.warn('[WEDNESS] 3D scene disabled:', err)));
}
