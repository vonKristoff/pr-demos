import ct from './tools'
let scene, camera, controls, renderer, skyboxGeo, skybox, clock
const targets = [];
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
// const target = new THREE.Vector2();
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
    var s1 = new THREE.Vector3().subVectors(camera.position, mesh1.position).length()
    var s2 = new THREE.Vector3().subVectors(camera.position, mesh2.position).length()
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
  // camera.lookAt(0,0,0)
  // mesh1.scale.set(scale, scale, 1);
  controls.update(clock.getDelta());
  camera.updateProjectionMatrix();
  // var s1 = new THREE.Vector3().subVectors(camera.position, mesh1.position).length()
  // var s2 = new THREE.Vector3().subVectors(camera.position, mesh2.position).length()
  // if (s1 > 10000) mesh1.visible = false
  // if (s1 < 10000) mesh1.visible = true
  // if (s2 < 10000) mesh2.visible = false
  // if (s2 > 10000) mesh2.visible = true
  // controls.update()
  TWEEN.update(f)

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
const box2 = new THREE.BoxGeometry(500, 500, 500)
const mesh1 = new THREE.Mesh(box, new THREE.MeshBasicMaterial({ color: 'red', depthTest: false })) // allow transparency
const mesh2 = new THREE.Mesh(box2, new THREE.MeshBasicMaterial({ color: 'yellow' }))
// mesh2.geometry.translate(-5000, 0, 0);
// x, y, z
mesh1.position.set(5000, 1000, 1000)
mesh2.position.set(500, 0, -5000)


// mesh1.scale.multiplyScalar(100)
// mesh2.size(10000, 10000, 1)

scene.add(mesh2)
scene.add(skybox);
scene.add(mesh1)

camera.position.set(1500, 0, 15000);
camera.lookAt(new THREE.Vector3(0, 0, 0));

controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.minDistance = 0
controls.maxDistance = 15000

function clickHandler(event) {

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  intersects = raycaster.intersectObjects([mesh1, mesh2]);

  if (intersects.length > 0) {
    // stop controls
    controls.enabled = false;

    var targetOrientation = intersects[0].object.quaternion.normalize();
    gsap.to({}, 1, {
      onUpdate: function () {
        camera.quaternion.slerp(targetOrientation, this.progress());
      },
      onComplete: function () {
        // controls.lookAt(intersects[0].object.position);
        controls.enabled = true;
      }
    });
  }
}


animate()