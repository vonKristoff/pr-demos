import Room from './framework/index'
import connectAppState from './framework/tourHandler'

const room = new Room()

room.useEvent('TOUR', connectAppState())

function animate() {
  if (room.state.camera === 'TWEEN') room.controls.orbit.update()
  // room.controls.orbit.update()

  TWEEN.update()
  room.renderer.render(room.scene, room.camera);
  requestAnimationFrame(animate);
}

function init() {
  // these two camera calls should be triggered by STATE
  room.camera.position.set(-5000, 0, 15000);
  // TODO - use camera.target.position.copy( camTarget ); to tween the lookAt
  room.camera.lookAt(0, 1, 0)
  document.body.appendChild(room.renderer.domElement);
  room.renderer.render(room.scene, room.camera);

  const roomPaths = createFilePaths('interstellar')
  const materialsArray = createMaterialArray(roomPaths);
  const skyboxGeo = new THREE.BoxGeometry(10000, 10000, 10000);
  const skybox = new THREE.Mesh(skyboxGeo, materialsArray);

  const box = new THREE.BoxGeometry(500, 500, 100)
  const mesh = new THREE.Mesh(box, new THREE.MeshBasicMaterial({ color: 'red', depthTest: false })) // allow transparency

  mesh.position.set(5000, 1000, 1000)
  // console.log(skybox)
  room.scene.add(skybox, mesh)

  animate()
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




init()