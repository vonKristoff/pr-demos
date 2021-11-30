import ct from './tools'
import { createMaterialArray, createFilePaths } from './loaders'
let scene, camera, controls, renderer, raycaster;
let skyboxGeo, skybox
let intersects
let vista = null
let isTweening = false
let scaleVector = new THREE.Vector3();

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 45, 30000);
  raycaster = new THREE.Raycaster()
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(devicePixelRatio)
  renderer.domElement.id = "canvas";
  // FOV, ASPECT, NEAR, FAR clipping plane
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.minDistance = 700;
  controls.maxDistance = 15000;

  document.body.appendChild(renderer.domElement);
  document.addEventListener('mousedown', clickHandler, false)
  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
  })

  createScene()
  camera.position.set(500, 0, 10000);
  animate()
}
function createScene() {
  const roomPaths = createFilePaths('interstellar')
  const materialsArray = createMaterialArray(roomPaths);
  skyboxGeo = new THREE.BoxGeometry(10000, 10000, 10000);
  skybox = new THREE.Mesh(skyboxGeo, materialsArray);

  const box = new THREE.BoxGeometry(500, 500, 100)
  const mesh1 = new THREE.Mesh(box, new THREE.MeshBasicMaterial({ color: 'red', depthTest: false }))

  mesh1.position.set(5000, 1000, 1000)
  scene.add(skybox);
  scene.add(mesh1)
}

function clickHandler(event) {
  raycaster.setFromCamera({
    x: (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
    y: -(event.clientY / renderer.domElement.clientHeight) * 2 + 1
  }, camera)
  intersects = raycaster.intersectObjects([mesh1], false)
  if (intersects.length > 0) console.log(intersects[0], event)
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render(f) {
  camera.updateProjectionMatrix();
  controls.update()
  TWEEN.update(f)
  renderer.render(scene, camera);
}

init()
