import ct from './tools'
import { createWalls } from './room-object-pivots'
let scene, camera, controls, renderer, groups, clock
const info = {
  position: document.querySelector('.position'),
  rotation: document.querySelector('.rotation'),
  wall: document.querySelector('.wall')
}

function init() {
  clock = new THREE.Clock();
  scene = new THREE.Scene();
  // FOV, ASPECT, NEAR, FAR clipping plane
  camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 45, 300000);
  // document.addEventListener('mousedown', clickHandler, false)
  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
  })

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.domElement.id = "canvas";
  document.body.appendChild(renderer.domElement);


  groups = createWalls(camera)
  scene.add(groups)
  // for (const [key, { group }] of Object.entries(groups)) {
  //   scene.add(group)
  // }

  controls = new THREE.OrbitControls(camera, renderer.domElement);

  // controls.target.set(-1250, 0, 0)
  camera.position.set(-2050, 0, 15000);
  camera.lookAt(-1250, 0, 0)
  // camera.lookAt(groups.e.group.position);

  // console.log(camera, controls)

  // controls.minDistance = 2500
  // controls.maxDistance = 15000

  // controls.enableZoom = true;
  // controls.enablePan = true;
  // controls.enableRotate = false
  // controls.maxPolarAngle = -Math.PI / 2
  // controls.minPolarAngle = Math.PI / 2
  // controls.enableDamping = true;
  animate()
}



let intersects
let vista = null
let isTweening = false

var scaleVector = new THREE.Vector3();
function animate(f) {

  const delta = clock.getDelta();
  const step = 2 * delta;

  TWEEN.update(f)
  updateInfo()

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

function updateInfo() {
  info.position.innerHTML = `cam position: ${Math.round(camera.position.x)} ${Math.round(camera.position.y)} ${Math.round(camera.position.z)}`
  info.rotation.innerHTML = `cam rotation: ${Math.round(camera.rotation.x * (180 / Math.PI))} ${Math.round(camera.rotation.y * (180 / Math.PI))} ${Math.round(camera.rotation.z * (180 / Math.PI))}`
  // info.wall.innerHTML = `wall position: ${Math.round(groups.w.group.position.x)} ${Math.round(groups.w.group.position.y)} ${Math.round(groups.w.group.position.z)}`
}

const DIM = 5000

init()
