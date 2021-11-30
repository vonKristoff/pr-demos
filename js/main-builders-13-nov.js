import { data } from './roomdata'
import { createWall, createRoom, createBounds, intersects, pivots } from './builders'
let scene, camera, controls, renderer, clock

const walls = data.map((surface) => surface.type === 'wall' ? createWall(surface) : createBounds(surface))
const assets = createRoom(walls)

const raycaster = new THREE.Raycaster()
const info = {
  position: document.querySelector('.position'),
  rotation: document.querySelector('.rotation'),
  wall: document.querySelector('.wall')
}
function clickHandler(event) {
  raycaster.setFromCamera({
    x: (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
    y: -(event.clientY / renderer.domElement.clientHeight) * 2 + 1
  }, camera)
  let capture = raycaster.intersectObjects(intersects, false)
}
function init() {
  clock = new THREE.Clock();
  scene = new THREE.Scene();
  // FOV, ASPECT, NEAR, FAR clipping plane
  camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 45, 300000);
  document.addEventListener('mousedown', clickHandler)
  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
  })

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.domElement.id = "canvas";
  document.body.appendChild(renderer.domElement);

  scene.add(assets.room)

  console.log(assets.room)

  setTimeout(() => {
    assets.action.fold()
    setTimeout(() => {
      assets.action.panels.forEach(tw => tw())
    }, 3000)
  }, 3000)

  setTimeout(() => {
    assets.action.panels.forEach(tw => tw())
    setTimeout(() => {
      assets.action.fold()
    }, 3000)

  }, 12000)

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  camera.position.set(0, 0, 15000);
  camera.lookAt(0, 0, 0)
  // camera.lookAt(groups.e.group.position);
  // controls.minDistance = 2500
  // controls.maxDistance = 15000

  animate()
}


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

init()
