console.clear();

/* =========================
   SCENE SETUP
========================= */

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  5000
);
camera.position.z = 500;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);

/* =========================
   HEART PARTICLES
========================= */

const tl = gsap.timeline({ repeat: -1, yoyo: true });

const path = document.querySelector("path");
const length = path.getTotalLength();
const vertices = [];

for (let i = 0; i < length; i += 0.1) {
  const point = path.getPointAtLength(i);
  const vector = new THREE.Vector3(point.x, -point.y, 0);

  vector.x += (Math.random() - 0.5) * 30;
  vector.y += (Math.random() - 0.5) * 30;
  vector.z += (Math.random() - 0.5) * 70;

  vertices.push(vector);

  tl.from(
    vector,
    {
      x: 600 / 2,
      y: -552 / 2,
      z: 0,
      ease: "power2.inOut",
      duration: "random(2, 5)"
    },
    i * 0.002
  );
}

const geometry = new THREE.BufferGeometry().setFromPoints(vertices);

const material = new THREE.PointsMaterial({
  color: 0xee5282,
  blending: THREE.AdditiveBlending,
  size: 3
});

const particles = new THREE.Points(geometry, material);
particles.position.x -= 600 / 2;
particles.position.y += 552 / 2;
scene.add(particles);

/* =========================
   ROMANTIC GLOW TEXT
========================= */

function createRomanticText(message) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  canvas.width = 1600;
  canvas.height = 400;

  context.clearRect(0, 0, canvas.width, canvas.height);

  context.font = "120px 'Great Vibes'"; // Romantic font
  context.textAlign = "center";
  context.textBaseline = "middle";

  // Soft golden glow
  context.shadowColor = "#ff69b4";
  context.shadowBlur = 50;

  context.fillStyle = "#ffffff";
  context.fillText(message, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);

  const textMaterial = new THREE.SpriteMaterial({
    map: texture,
    transparent: true
  });

  const sprite = new THREE.Sprite(textMaterial);
  sprite.scale.set(750, 180, 1); // Reduced size
  sprite.position.set(0, 0, 50);

  return sprite;
}

const romanticText = createRomanticText("Happy Valentines Day Honey❤️");
scene.add(romanticText);

/* Floating animation */
gsap.to(romanticText.position, {
  y: 19,
  duration: 2,
  repeat: -1,
  yoyo: true,
  ease: "power1.inOut"
});

/* Gentle shimmer effect */
gsap.to(romanticText.material, {
  opacity: 0.8,
  duration: 1.5,
  repeat: -1,
  yoyo: true
});

/* =========================
   FALLING ROSE PETALS
========================= */

const petalCount = 150;
const petalPositions = [];

for (let i = 0; i < petalCount; i++) {
  petalPositions.push(
    (Math.random() - 0.5) * 900,
    Math.random() * 800,
    (Math.random() - 0.5) * 300
  );
}

const petalGeometry = new THREE.BufferGeometry();
petalGeometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(petalPositions, 3)
);

const petalMaterial = new THREE.PointsMaterial({
  color: 0xff3366,
  size: 6
});

const petals = new THREE.Points(petalGeometry, petalMaterial);
scene.add(petals);

function animatePetals() {
  const positions = petalGeometry.attributes.position.array;

  for (let i = 1; i < positions.length; i += 3) {
    positions[i] -= 1.8;

    if (positions[i] < -400) {
      positions[i] = 400;
    }
  }

  petalGeometry.attributes.position.needsUpdate = true;
}

/* =========================
   HEART ROTATION
========================= */

gsap.fromTo(
  scene.rotation,
  { y: -0.2 },
  {
    y: 0.2,
    repeat: -1,
    yoyo: true,
    ease: "power2.inOut",
    duration: 3
  }
);

/* =========================
   RENDER LOOP
========================= */

function render() {
  requestAnimationFrame(render);
  geometry.setFromPoints(vertices);
  animatePetals();
  renderer.render(scene, camera);
}

render();

/* RESPONSIVE */

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
