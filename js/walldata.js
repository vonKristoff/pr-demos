const WALLS = [
  {
    col: 'purple',
    id: 'north',
    texture: 'NB',
    room: {
      translate: 0,
      position: { x: 0, y: 0, z: -5000 },
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
    col: 'red',
    id: 'south',
    texture: 'SB',
    room: {
      translate: 0,
      position: { x: 0, y: 0, z: 5000 },
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
    col: 'green',
    id: 'east',
    texture: 'EB',
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
  }, {
    col: 'yellow',
    id: 'west',
    texture: 'WB',
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

  const geometry = new THREE.PlaneGeometry(WALL_DIMENSION, WALL_DIMENSION);
  const panelGeom = new THREE.PlaneGeometry(WALL_DIMENSION / 2, WALL_DIMENSION);
  const panelGeom2 = new THREE.PlaneGeometry(WALL_DIMENSION / 2, WALL_DIMENSION);
  const inspectGeom = new THREE.PlaneGeometry(I_DIMENSION, I_DIMENSION);
  const inspectMaterial = new THREE.MeshBasicMaterial({
    color: 'blue', side: THREE.FrontSide, depthTest: false,
    depthWrite: false,
    sizeAttenuation: false,
  });

  let room = { n: null, e: null, w: null, s: null }

  WALLS.forEach((w) => {
    const group = new THREE.Group;
    group.userData = { to: w.room.camera, direction: w.room.dir }
    const target = w.id.charAt(0)
    const material = new THREE.MeshBasicMaterial({ color: w.col, side: THREE.FrontSide });
    const materialPanel = new THREE.MeshBasicMaterial({ color: w.col, side: THREE.FrontSide, transparent: true, opacity: 0.5, });
    const mesh = new THREE.Mesh(geometry, material)
    const pl = new THREE.Mesh(panelGeom, materialPanel)
    const pr = new THREE.Mesh(panelGeom2, materialPanel)
    pl.name = "panel--left"
    pr.name = "panel--right"
    pl.position.set(WALL_DIMENSION / 2, 0, 0)
    pr.position.set(-WALL_DIMENSION / 2, 0, 0)
    pl.geometry.translate(-WALL_DIMENSION / 16, 0, 0)
    pr.geometry.translate(WALL_DIMENSION / 16, 0, 0)
    group.add(pl, pr)
    w.pictures.forEach(({ x, y, target }) => {
      const inspect = new THREE.Mesh(inspectGeom, inspectMaterial)
      inspect.position.set(x, y, 10)
      inspect.name = `inspect--${target}`
      group.add(inspect)
    })
    const { x, y, z } = w.room.position
    group.rotation.y = w.room.rotation
    group.position.set(x, y, z)
    room[target] = { group }
  })
  return room
}

export { createWalls }