import ct from './tools'
import { createWalls } from './walldata-2D'
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
  camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 45, 30000);
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
  for (const [key, { group }] of Object.entries(groups)) {
    scene.add(group)
  }

  // controls = new THREE.OrbitControls(camera, renderer.domElement);

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

  // Add zoom listener
  const view = d3.select(renderer.domElement);
  view.call(zoom);

  // Disable double click to zoom because I'm not handling it in Three.js
  view.on('dblclick.zoom', null);

  // Sync d3 zoom with camera z position
  zoom.scaleTo(view, 15000);

  animate()
}
function getCurrentScale() {
  var vFOV = camera.fov * Math.PI / 180
  var scale_height = 2 * Math.tan(vFOV / 2) * camera.position.z
  var currentScale = window.innerHeight / scale_height
  return currentScale
}

// Point generator function
function phyllotaxis(radius) {
  const theta = Math.PI * (3 - Math.sqrt(5));
  return function (i) {
    const r = radius * Math.sqrt(i), a = theta * i;
    return [
      window.innerWidth / 2 + r * Math.cos(a) - window.innerWidth / 2,
      window.innerHeight / 2 + r * Math.sin(a) - window.innerHeight / 2
    ];
  };
}
const zoom = d3.zoom()
  .scaleExtent([10, 15000])
  .on('zoom', () => {
    const event = d3.event;
    if (event.sourceEvent) {

      // Get z from D3
      const new_z = event.transform.k;

      if (new_z !== camera.position.z) {

        // Handle a zoom event
        const { clientX, clientY } = event.sourceEvent;

        // Project a vector from current mouse position and zoom level
        // Find the x and y coordinates for where that vector intersects the new
        // zoom level.
        // Code from WestLangley https://stackoverflow.com/questions/13055214/mouse-canvas-x-y-to-three-js-world-x-y-z/13091694#13091694
        const vector = new THREE.Vector3(
          clientX / window.innerWidth * 2 - 1,
          - (clientY / window.innerHeight) * 2 + 1,
          1
        );
        vector.unproject(camera);
        const dir = vector.sub(camera.position).normalize();
        const distance = (new_z - camera.position.z) / dir.z;
        const pos = camera.position.clone().add(dir.multiplyScalar(distance));

        // Set the camera to new coordinates
        camera.position.set(pos.x, pos.y, new_z);

      } else {

        // Handle panning
        const { movementX, movementY } = event.sourceEvent;

        // Adjust mouse movement by current scale and set camera
        const current_scale = getCurrentScale();
        camera.position.set(camera.position.x - movementX / current_scale, camera.position.y +
          movementY / current_scale, camera.position.z);
      }
    }
  });



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
  info.wall.innerHTML = `wall position: ${Math.round(groups.w.group.position.x)} ${Math.round(groups.w.group.position.y)} ${Math.round(groups.w.group.position.z)}`
}

const DIM = 5000

init()
