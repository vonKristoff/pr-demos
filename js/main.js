let scene, camera, renderer, controls, dolly
let loader = new THREE.GLTFLoader();
let hasLoaded = false
let panels = []
const walls = ['NORTH_WALL', 'NORTH_WALL_TARGETS', 'EAST_WALL']//'NB', 'NL1B', 'NR1B', 'NL1F', 'NR1F',]
// const walls = ['PIVOT_WALL_NB', 'PIVOT_PANEL_N_LEFT', 'PIVOT_PANEL_N_RIGHT']
let target = { position: { x: 0, y: 0, z: 0 } }
let t2 = { position: { x: 0, y: 0, z: 0 } }
let pics = []
let moveCamera
window.addEventListener('keyup', (e) => {
  console.log(e.keyCode)
  if (e.keyCode === 32) moveCamera()
  if (e.keyCode === 13) exit()
  if (e.keyCode === 49) togglePanels()
})
function loadModels(wall, i) {
  loader.load(`./model/${wall}/${wall}.gltf`, function (gltf) {
    // let car = gltf.scene.children[0]
    // const a = car.children[0]
    // // car.geometry.center(); // center here
    // let t = car.children[0]
    console.log(gltf)
    // console.log(a.children[0], gltf.scene)
    // scene.add(gltf.scene);
    gltf.scene.traverse(function (child) {
      console.log(child.name)

      const descriptors = child.name.split('_')
      if (descriptors.some((part) => part === 'Slice')) {
        child.material.depthWrite = false
        child.material.depthTest = false
        child.material.depthFunc = THREE.NeverDepth
      }
      if (child.isMesh) child.material.transparent = true
      if (descriptors.some((part) => part === 'TARGET')) {
        const EAST = child.parent.name.split('_').some(part => part === 'EAST')
        child.material.opacity = 0
        if (EAST) {
          child.userData.axis = ['y', 'z']
          child.userData.c = 'x'
        }
        else {
          child.userData.axis = ['x', 'y']
          child.userData.c = 'z'
        }

        pics.push(child)
        // if (Math.round(Math.random())) 
      }
      if (child.name === 'PIVOT_PANEL_N_RIGHT') {
        // child.rotation.z = -Math.PI / 5
        child.userData.toggle = swing(child, 'right')
        panels.push(child)
      }
      if (child.name === 'PIVOT_PANEL_N_LEFT') {
        // child.rotation.z = -Math.PI / 5
        child.userData.toggle = swing(child, 'left')
        panels.push(child)
      }
      // if (child.name === 'TARGET_P51') {
      //   console.log(' PICTURE TARGET', child)
      //   target = { position: child.getWorldPosition() }
      // }
      // if (child.name === 'TARGET_P53') {
      //   console.log(' PICTURE TARGET', child)
      //   t2 = { position: child.getWorldPosition() }
      // }

      if (child.name === 'PIVOT_NORTH_WALL') {
        child.position.z = 2.125
        child.children[1]
      }
      if (child.name === 'PIVOT_EAST_WALL') {
        const d = child.children[0].children[3].material
        d.depthWrite = false
        d.depthTest = false
        d.depthFunc = THREE.NeverDepth
        // d.opacity = .25
        // console.log(d)
        child.position.x = -2.125
      }
    });


    gltf.scene.scale.set(1, 1, 1) // scale here
    scene.add(gltf.scene)
    ready()
    hasLoaded = true
  });
}
function ready() {
  if (hasLoaded) return
  animate()
  setTimeout(() => {
    pics.sort(() => (Math.random() > .5) ? 1 : -1)
    pics.forEach(tgt => {
      console.log(tgt.name)
    })
    let pos = pics.map(p => {
      const [a, b] = p.userData.axis
      const target = p.getWorldPosition()
      return {
        dolly: target,
        camera: { [a]: target[a], [b]: target[b], [p.userData.c]: 0 }
      }
    })
    // dolly.material.opacity = 0.25
    moveCamera = slide(camera, createTour(pos))//[target.position, { x: 1, y: -1 }, { x: 0, y: 0 }]))
  }, 3000)
}

let adjacent

function init() {

  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.gammaOutput = true;
  renderer.gammaFactor = 2.2;
  document.body.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 50000);
  controls = new THREE.OrbitControls(camera, renderer.domElement)

  let hlight = new THREE.AmbientLight('white');

  const boxGeom = new THREE.BoxGeometry(.25, .25, .25);
  const material = new THREE.MeshBasicMaterial({ color: 'red', side: THREE.FrontSide });
  dolly = new THREE.Object3D()//new THREE.Mesh(boxGeom, material) 

  // dolly.material.opacity = 0
  console.log(dolly)
  // dolly.visible = false
  adjacent = new THREE.Mesh(boxGeom, material)
  // adjacent.position.set(2.5, 0, -2.5)
  scene.add(dolly)
  scene.add(hlight);

  console.log('DOLLY', dolly)

  // camera.lookAt(dolly)
  camera.position.set(0, 0, -2.5);

  walls.forEach(loadModels)
}

let z = 0

function animate() {
  controls.update()
  camera.lookAt(dolly.position)
  // z += 0.05
  // target.rotation.z = z
  TWEEN.update()
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
init();

function createTour(sequence) {
  let index = 0
  return {
    next: () => sequence[index],
    update: () => index++
  }
}

function slide(p, state) {

  return () => {
    new TWEEN.Tween(dolly.position)
      .to(state.next().dolly, 2000)
      // .delay(500)
      .easing(TWEEN.Easing.Cubic.Out)
      .start()

    new TWEEN.Tween(camera.position)
      .to(state.next().camera, 2000)
      .easing(TWEEN.Easing.Cubic.Out)
      .onComplete(() => {
        state.update()
      })
      .start()

    // new TWEEN.Tween(camera.scale)
    //   .to({ z: 2 }, 1500)
    //   .delay(1500)
    //   .easing(TWEEN.Easing.Cubic.Out)
    //   .start()
  }
}

function togglePanels() {
  panels.forEach(door => {
    door.userData.toggle()
  })
}

function exit() {
  new TWEEN.Tween(dolly.position)
    .to({ x: 0, y: 0, z: 0 }, 1000)
    .easing(TWEEN.Easing.Cubic.Out)
    .start()

  new TWEEN.Tween(camera.position)
    .to({ x: 0, y: 0, z: -2.50 }, 2000)
    .easing(TWEEN.Easing.Cubic.Out)
    .onComplete(() => {
      camera.position.set(0, 0, -2.5);
    })
    .start()
}

function swing(pivot, align) {
  const to = align === 'right' ? -Math.PI / 2.2 : Math.PI / 2.2
  return toggler(pivot, to)
}

function toggler(pivot, to) {
  let open = true
  return () => {
    if (open) twist('z', pivot, to)
    else twist('z', pivot, 0)
    open = !open
  }
}

function twist(axis, p, target = 0) {
  new TWEEN.Tween(p.rotation)
    .to({ [axis]: target }, 2000)
    .easing(TWEEN.Easing.Cubic.Out)
    .onUpdate(({ y }) => {
      if (target !== 0) {
        // close
        // if (y >= Math.PI) {
        //   p.userData.material.visible = false
        //   p.userData.material.needsUpdate = true;
        // }
        // if (y <= -Math.PI) {
        //   p.userData.material.visible = false
        //   p.userData.material.needsUpdate = true;
        // }
      } else {
        // p.userData.material.visible = true
        // p.userData.material.needsUpdate = true;
      }
    })
    .start()
}