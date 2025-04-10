// valley-3d.js
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  AmbientLight,
  DirectionalLight,
  BoxGeometry,
  MeshStandardMaterial,
  Mesh,
  Vector3,
  PlaneGeometry,
  MeshPhongMaterial,
  Color
} from 'https://esm.sh/three@0.155.0';

import { OrbitControls } from 'https://esm.sh/three@0.155.0/examples/jsm/controls/OrbitControls.js';

const scene = new Scene();
scene.background = new Color(0xf0f0f0);

const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 20, 50);

const renderer = new WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("valley-3d").appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

const ambientLight = new AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 20, 10);
scene.add(directionalLight);

// Valley "floor"
const planeGeometry = new PlaneGeometry(100, 40);
const planeMaterial = new MeshPhongMaterial({ color: 0xd3d3d3, side: 2 });
const plane = new Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
scene.add(plane);

// Example: 3 readiness stages as blocks
const blockData = [
  { x: -30, height: 10, label: "Concept" },
  { x: 0, height: 20, label: "Prototype" },
  { x: 30, height: 30, label: "Deployment" }
];

blockData.forEach((data) => {
  const geometry = new BoxGeometry(10, data.height, 10);
  const material = new MeshStandardMaterial({ color: 0x2980b9 });
  const box = new Mesh(geometry, material);
  box.position.set(data.x, data.height / 2, 0);
  scene.add(box);
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();

// --- 📐 CALCULATOR INTEGRATION ---

// Create calculator container
const calculatorContainer = document.createElement('div');
calculatorContainer.id = 'readiness-calculator';
calculatorContainer.style.marginTop = '2rem';
calculatorContainer.style.padding = '1rem';
calculatorContainer.style.border = '1px solid #ccc';
calculatorContainer.style.backgroundColor = '#ffffff';
calculatorContainer.style.borderRadius = '12px';
calculatorContainer.style.maxWidth = '500px';
calculatorContainer.style.marginLeft = 'auto';
calculatorContainer.style.marginRight = 'auto';
calculatorContainer.style.fontFamily = 'sans-serif';

calculatorContainer.innerHTML = `
  <h3>Readiness Level Calculator</h3>
  <form id="calculator-form">
    <label>
      Technical Complexity:
      <input type="number" name="complexity" min="0" max="10" required />
    </label><br /><br />
    <label>
      Team Maturity:
      <input type="number" name="maturity" min="0" max="10" required />
    </label><br /><br />
    <label>
      Funding Security:
      <input type="number" name="funding" min="0" max="10" required />
    </label><br /><br />
    <button type="submit">Calculate Readiness</button>
  </form>
  <p id="readiness-result" style="margin-top:1rem; font-weight:bold;"></p>
`;

// Append below 3D canvas
document.getElementById("valley-3d").appendChild(calculatorContainer);

// Calculator logic
document.getElementById("calculator-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const complexity = parseFloat(formData.get("complexity")) || 0;
  const maturity = parseFloat(formData.get("maturity")) || 0;
  const funding = parseFloat(formData.get("funding")) || 0;

  const score = ((complexity * 0.3) + (maturity * 0.4) + (funding * 0.3)).toFixed(1);

  let level = "Low";
  if (score >= 7) level = "High";
  else if (score >= 4) level = "Moderate";

  document.getElementById("readiness-result").textContent =
    `Calculated Readiness Score: ${score} → Level: ${level}`;
});