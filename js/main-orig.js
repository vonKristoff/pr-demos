import ct from './tools'
let scene, camera, controls, renderer, skyboxGeo, skybox;

function init() {
  scene = new THREE.Scene();
  // FOV, ASPECT, NEAR, FAR clipping plane
  camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 45, 30000);
  // camera.position.set(1200, -250, 15000);



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

const raycaster = new THREE.Raycaster()
let intersects
let vista = null
let isTweening = false
document.addEventListener('mousedown', clickHandler, false)
function clickHandler(event) {
  raycaster.setFromCamera({
    x: (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
    y: -(event.clientY / renderer.domElement.clientHeight) * 2 + 1
  }, camera)
  intersects = raycaster.intersectObjects([mesh1, mesh2], false)
  // if (intersects.length > 0) {
  // if (intersects[0].object.position.x !== 0) {
  console.log(intersects[0], event)
  vista = intersects[0]
  // controls.enabled = false
  camera.target.set(vista.object.position.x, vista.object.position.y, vista.object.position.z)
  // ct(camera, vista.object, controls)
  // }
  // }
}
// setInterval(() => {
//   console.log(camera.position)
// }, 2500)
var scaleVector = new THREE.Vector3();
function animate(f) {
  renderer.render(scene, camera);
  var scale = scaleVector.subVectors(camera.position, mesh1.position).length() / 10000;
  mesh1.lookAt(camera.position)
  mesh1.scale.set(scale, scale, 1);
  if (vista) {
    // console.log(vista)

  }
  //   const a = new THREE.Vector3(vista.point.x, vista.point.y, vista.point.z)
  //   console.log(a)
  //   camera.lookAt(a)
  // }
  camera.updateProjectionMatrix();
  controls.update()
  TWEEN.update(f)
  // console.log(camera.position)
  requestAnimationFrame(animate);
}

init();


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

const box = new THREE.BoxGeometry(500, 500, 100)
const box2 = new THREE.BoxGeometry(10000, 10000, 10)
const mesh1 = new THREE.Mesh(box, new THREE.MeshBasicMaterial({ color: 'red', depthTest: false })) // allow transparency
const mesh2 = new THREE.Mesh(box2, new THREE.MeshBasicMaterial({ color: 'green', opacity: .5, transparent: true }))
mesh2.geometry.translate(-5000, 0, 0);
// x, y, z
mesh1.position.set(5000, 1000, 1000)
mesh2.position.set(0, 0, -5000)


// mesh1.scale.multiplyScalar(100)
// mesh2.size(10000, 10000, 1)

// scene.add(mesh2)
scene.add(skybox);
scene.add(mesh1)

camera.position.set(500, 0, 10000);

controls = new THREE.OrbitControls(camera, renderer.domElement);

// controls.enabled = true;
controls.minDistance = 700;
controls.maxDistance = 15000;

// createjs.Tween.get(camera.position).wait(1000).to({ x: 0, y: 0, z: 0 }, 1000)
// createjs.Tween.get(mesh2.rotation).wait(2500).to({ y: Math.PI / 2 }, 1000)
const tween = new TWEEN.Tween(mesh2.rotation) // Create a new tween that modifies 'coords'.
  .delay(2000)
  .to({ y: Math.PI / 2 }, 3000) // Move to (300, 200) in 1 second.
  .easing(TWEEN.Easing.Quadratic.Out)
  .start()

// TODO - example camera - updating controls
// controls.enabled = false;
// gsap.to( camera.position, { duration: 1,y: 10,onUpdate: () =>controls.update(), onComplete: ()=> controls.enabled = true})

animate()