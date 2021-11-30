import ct from './tools'
import { createWalls } from './walldata'
let scene, camera, controls, renderer, skyboxGeo, skybox, clock
const info = {
  position: document.querySelector('.position'),
  rotation: document.querySelector('.rotation'),
  wall: document.querySelector('.wall')
}
// WORKS REALLY WELL SO FAR!
const targets = [];
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
// const target = new THREE.Vector2();
function init() {
  clock = new THREE.Clock();
  scene = new THREE.Scene();
  // FOV, ASPECT, NEAR, FAR clipping plane
  camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 45, 30000);
  document.addEventListener('mousedown', clickHandler, false)
  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
  })

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.domElement.id = "canvas";
  document.body.appendChild(renderer.domElement);
}

let intersects
let vista = null
let isTweening = false

var scaleVector = new THREE.Vector3();
function animate(f) {
  renderer.render(scene, camera);
  // var scale = scaleVector.subVectors(camera.position, mesh1.position).length() / 10000;
  camera.lookAt(0, 0, 0)
  // mesh1.scale.set(scale, scale, 1);
  // controls.update(clock.getDelta());
  const delta = clock.getDelta();
  const step = 2 * delta;

  controls.update()

  groups.w.group.children.forEach((child) => {
    if (child.name.includes('inspect')) {
      child.lookAt(camera.position)
    }
  })

  // const wallAngle = groups.w.group.quaternion.angleTo(groups.w.group.children[3].quaternion)
  // if (wallAngle < 1.5) groups.w.group.visible = true
  // if (wallAngle > 1.5) groups.w.group.visible = false

  TWEEN.update(f)
  updateInfo()

  requestAnimationFrame(animate);
}

init();

function updateInfo() {
  info.position.innerHTML = `cam position: ${Math.round(camera.position.x)} ${Math.round(camera.position.y)} ${Math.round(camera.position.z)}`
  info.rotation.innerHTML = `cam rotation: ${Math.round(camera.rotation.x * (180 / Math.PI))} ${Math.round(camera.rotation.y * (180 / Math.PI))} ${Math.round(camera.rotation.z * (180 / Math.PI))}`
  info.wall.innerHTML = `wall position: ${Math.round(groups.w.group.position.x)} ${Math.round(groups.w.group.position.y)} ${Math.round(groups.w.group.position.z)}`
}

function createMaterialArray(paths = []) {
  return paths.map(image => {
    let texture = new THREE.TextureLoader().load(image);
    return new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide }); // DoubleSide
  });
}
function createFilePaths(name) {
  let collection = ["ft", "bk", "up", "dn", "rt", "lf"]
  return collection.map((position) => `./assets/${name}_${position}.png`)
}

const roomPaths = createFilePaths('interstellar')
const materialsArray = createMaterialArray(roomPaths);
skyboxGeo = new THREE.BoxGeometry(10000, 10000, 10000); // tODO
skybox = new THREE.Mesh(skyboxGeo, materialsArray);

const groups = createWalls(camera)
for (const [key, { group }] of Object.entries(groups)) {
  scene.add(group)
}
const t = groups.e.group
scene.add(skybox);
console.log(camera)
camera.position.set(1500, 0, 15000);
camera.lookAt(new THREE.Vector3(0, 0, 0));

controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.minDistance = 2500
controls.maxDistance = 15000
const DIM = 5000
// console.log(groups.w.group)
function getCamPos(direction, dimension) {
  return {
    x: 0 + (direction[0] * dimension),
    y: 0 + (direction[1] * dimension),
    z: 0 + (direction[2] * dimension)
  }
}
function getControlPos(target, direction, dimension) {
  return {
    x: target.x + (direction[0] * dimension),
    y: target.y + (direction[1] * dimension),
    z: target.z + (direction[2] * dimension)
  }
}
setTimeout(() => {
  new TWEEN.Tween(camera.position)
    .to(getCamPos(t.userData.direction, DIM), 500)
    .easing(TWEEN.Easing.Cubic.Out)
    .start()
  new TWEEN.Tween(controls.target)
    .to(getControlPos(t.position, t.userData.direction, DIM), 500)
    .easing(TWEEN.Easing.Cubic.Out)
    .onComplete(() => {
      // NOT WORKING ???
      // controls.enableRotate = false;
      // controls.screenSpacePanning = true;
      // controls.enableZoom = true;
      // controls.enablePan = true;
      // controls.maxPolarAngle = Math.PI / 2;
      // controls.enableDamping = true;
    })
    .start()
}, 2500)
// setTimeout(() => {

//   gsap.to(camera.position, {
//     x: 0,
//     y: 0,
//     z: 0,
//     delay: 0,
//     duration: 2,
//     onUpdate: function () {
//       controls.enabled = false
//       // camera.quaternion.slerp(groups.w.group.quaternion, this.progress() * 0.8)
//       camera.updateProjectionMatrix();
//     },
//     onComplete: function () {
//       // controls.target.set(-1, 0, 0)
//       controls.update()
//       controls.enabled = true
//     }
//   })
//   gsap.to({}, {
//     duration: 1.9,
//     onUpdate: function () {
//       const { x, y, z } = groups.w.group.rotation
//       camera.rotation.set(this.progress() * x, this.progress() * y, this.progress() * z)
//       camera.updateProjectionMatrix();
//     },
//     onComplete: function () {
//       controls.target.set(-1, 0, 0)
//       // controls.update()
//       controls.enabled = true
//     }
//   })
// }, 2000)
const ables = Object.values(groups).map(({ group }) => group)

function clickHandler(event) {

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  intersects = raycaster.intersectObjects(ables);

  if (intersects.length > 0) {
    const [inspectee] = intersects.filter(({ object }) => {
      return object.name.includes('inspect')
    })
    if (inspectee) {
      const c = { ...camera.position }
      gsap.to(c, 3, {
        x: 2500,
        y: inspectee.point.y,
        z: inspectee.point.z,
        onUpdate: function () {
          camera.position.set(c.x, c.y, c.z)
        },
        onComplete: function () { }
      });
    }
    const [panel] = intersects.filter(({ object }) => {
      // console.log(object)
      return object.name.includes('panel')
    })
    if (panel) {
      const dir = panel.object.name.includes('left') ? 1 : -1
      gsap.to({}, 1, {
        onUpdate: function () {
          const target = dir * this.progress() * 90
          panel.object.rotation.set(0, target * (Math.PI / 180), 0)
        },
        onComplete: function () { }
      });
    }
    // stop controls
    // controls.enabled = false;

    // var targetOrientation = intersects[0].object.quaternion.normalize();
    // gsap.to({}, 1, {
    //   onUpdate: function () {
    //     camera.quaternion.slerp(targetOrientation, this.progress());
    //   },
    //   onComplete: function () {
    //     // controls.lookAt(intersects[0].object.position);
    //     controls.enabled = true;
    //   }
    // });
  }
}

animate()