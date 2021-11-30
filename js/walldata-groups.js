const WALLS = [
  {
    col: 'purple',
    id: 'north',
    room: {
      translate: 0,
      position: { x: 10000, y: 0, z: 0 },
      rotation: 0,
      camera: { x: 0, y: 0, z: 0 },
      dir: [0, 0, 1]
    },
    pictures: [
      { x: 250, y: 100, target: 'np1' },
      { x: 550, y: 100, target: 'np2' },
      { x: 250, y: 500, target: 'np3' },
      { x: 550, y: 500, target: 'np4' }
    ]
  },
  {
    col: 'green',
    id: 'east',
    room: {
      translate: 0,
      position: { x: 5000, y: 0, z: 0 },
      rotation: -Math.PI / 2,
      camera: { x: Math.PI / 2, y: -(Math.PI / 2), z: Math.PI / 2 },
      dir: [-1, 0, 0]
    },
    panels: ['panel-1', 'panel-2'], // can automate
    pictures: [
      { x: 250, y: 100, target: 'np1' },
      { x: 550, y: 100, target: 'np2' },
      { x: 250, y: 500, target: 'np3' },
      { x: 550, y: 500, target: 'np4' }
    ]
  },
  {
    col: 'red',
    id: 'south',
    room: {
      translate: 0,
      position: { x: 0, y: 0, z: 0 },
      rotation: Math.PI,
      camera: { x: Math.PI, y: 0, z: Math.PI },
      dir: [0, 0, -1]
    },
    panels: ['panel-1', 'panel-2'], // can automate
    pictures: [
      { x: 250, y: 100, target: 'np1' },
      { x: 550, y: 100, target: 'np2' },
      { x: 250, y: 500, target: 'np3' },
      { x: 550, y: 500, target: 'np4' }
    ]
  },
  {
    col: 'yellow',
    id: 'west',
    room: {
      translate: 0,
      position: { x: -5000, y: 0, z: 0 },
      rotation: Math.PI / 2,
      camera: { x: 0, y: Math.PI / 2, z: 0 },
      dir: [1, 0, 0]
    },
    pictures: [
      { x: 1250, y: 1000, target: 'np1' },
      { x: 550, y: 100, target: 'np2' },
      { x: -250, y: -500, target: 'np3' },
      { x: -2550, y: -1000, target: 'np4' }
    ]
  }
]
const WALL_DIMENSION = 10000
const I_DIMENSION = 500
const createWalls = function (camera) {

  // const geometry = new THREE.PlaneGeometry(WALL_DIMENSION, WALL_DIMENSION);
  const panelGeom = new THREE.PlaneGeometry(WALL_DIMENSION / 2, WALL_DIMENSION);
  const panelGeom2 = new THREE.PlaneGeometry(WALL_DIMENSION / 2, WALL_DIMENSION);
  const inspectGeom = new THREE.PlaneGeometry(I_DIMENSION, I_DIMENSION);
  const inspectMaterial = new THREE.MeshBasicMaterial({
    color: 'blue', side: THREE.FrontSide, depthTest: false,
    depthWrite: false,
    sizeAttenuation: false,
  });

  // let room = { n: null, e: null, w: null, s: null }
  let faces = []
  const compass = ['n', 'e', 's', 'w']
  WALLS.forEach((w, i) => {
    const ROOM = new THREE.Object3D()
    const group = new THREE.Group;
    const geometry = new THREE.PlaneGeometry(WALL_DIMENSION, WALL_DIMENSION);
    // IMPORTANT to TRANSLATE WALL GEOMETRY ORIGINS
    // geometry.computeBoundingBox() maybe helpful for dynamics
    if (i < 3) geometry.translate(WALL_DIMENSION / 2, 0, 0)
    if (i === 3) geometry.translate(-WALL_DIMENSION / 2, 0, 0)
    group.name = compass[i]
    group.userData = { to: w.room.camera, direction: w.room.dir }
    const target = w.id.charAt(0)
    const material = new THREE.MeshBasicMaterial({ color: w.col, side: THREE.FrontSide });
    const materialPanel = new THREE.MeshBasicMaterial({ color: 'pink', side: THREE.FrontSide, transparent: true, opacity: 0.5, });
    const mesh = new THREE.Mesh(geometry, material)
    const pl = new THREE.Mesh(panelGeom, materialPanel)
    const pr = new THREE.Mesh(panelGeom2, materialPanel)
    pl.name = "panel--left"
    pr.name = "panel--right"

    // TODO - add panels to objects so that they are easier to manage

    if (i < 3) {
      pl.position.set(WALL_DIMENSION, 0, 0)
      pr.position.set(0, 0, 0)
      pl.rotation.y = 1
      pr.rotation.y = -1
      pl.geometry.translate(-WALL_DIMENSION / 16, 0, 0)
      pr.geometry.translate(WALL_DIMENSION / 16, 0, 0)
    }
    if (i === 3) {
      pl.position.set(0, 0, 0)
      pr.position.set(-WALL_DIMENSION, 0, 0)
      pl.rotation.y = 0.8
      pr.rotation.y = -1
      pl.geometry.translate(-WALL_DIMENSION / 16, 0, 0)
      pr.geometry.translate(WALL_DIMENSION / 16, 0, 0)
    }

    group.add(mesh, pl, pr)
    w.pictures.forEach(({ x, y, target }) => {
      const inspect = new THREE.Mesh(inspectGeom, inspectMaterial)
      inspect.position.set(x, y, 10)
      inspect.name = `inspect--${target}`
      group.add(inspect)
    })
    // const { x, y, z } = w.room.position
    // group.rotation.y = 0
    // group.position.set(x, y, z)
    // room[target] = { group }
    faces.push(group)
  })

  const ROOM = new THREE.Object3D(); // todo - combine parents together to enable rotation
  const pivot1 = new THREE.Object3D();
  const pivot2 = new THREE.Object3D();
  const pivot3 = new THREE.Object3D();
  const [north, east, south, west] = faces

  // Wall 1 'NORTH'

  // Wall 2 'EAST'
  pivot1.position.x = WALL_DIMENSION
  pivot1.add(east)
  pivot1.rotation.y = -Math.PI / 4 // Wall rotation
  // Wall 3 'SOUTH'
  pivot2.add(south)
  pivot2.position.x = WALL_DIMENSION
  pivot2.rotation.y = -Math.PI / 3 // Wall rotation
  // Wall 4 'WEST'
  pivot3.add(west)
  pivot3.rotation.y = 0.5 // Wall rotation

  // create space
  pivot1.add(pivot2)
  ROOM.add(pivot3, north, pivot1)

  return ROOM
}

export { createWalls }