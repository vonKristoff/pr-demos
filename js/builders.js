import { TweenMap } from './tweenMap'
const WALL_DIMENSION = 10000
const WALL_DIMENSION_H = 15000
const intersects = []
const pivots = []
// create wall with panels and picture inspectors
// all centered origins
function createWall(data) {
  const { name, color, pictures, texture } = data
  const group = new THREE.Object3D() // or group until origins are assigned - within create Room?
  const geometry = new THREE.PlaneGeometry(WALL_DIMENSION, WALL_DIMENSION_H);
  const material = new THREE.MeshBasicMaterial({ color, side: THREE.FrontSide });
  const wall = new THREE.Mesh(geometry, material)
  wall.name = `wall-${name}`
  intersects.push(wall)

  // add pictures to wall
  const inspectors = createPictures(pictures.wall)

  const panelLeft = createPanel({ side: 'left', color: 'pink', pictures: pictures.panel.left })
  const panelRight = createPanel({ side: 'right', color: 'pink', pictures: [] })

  group.userData.panels = toggle([panelLeft, panelRight])
  // geometry.computeBoundingBox() // call geometry.boundingBox to access it
  // rather than boundingBox => set dimension into userData
  group.add(wall, inspectors, panelLeft, panelRight)
  const toggleTexture = (wall, path, color) => {
    let texture = new THREE.TextureLoader().load(path);
    let useTexture = false
    return () => {
      useTexture = !useTexture
      wall.material.map = useTexture ? texture : null
      // wall.material.color = useTexture ? null : color
      wall.material.needsUpdate = true;
    }
  }
  const loc = `/assets/${texture}.png`
  return { ...data, face: group, geom: geometry, toggleTexture: toggleTexture(wall, loc, color) }
}
// extend for all - but using for ceiling and floor now
function createBounds(data) {
  const { name, color } = data
  const group = new THREE.Object3D()
  const geometry = new THREE.PlaneGeometry(WALL_DIMENSION, WALL_DIMENSION);
  const material = new THREE.MeshBasicMaterial({ color, side: THREE.FrontSide });
  const wall = new THREE.Mesh(geometry, material)
  wall.name = `bounds-${name}`

  group.add(wall)

  return { ...data, face: group }
}

function createPanel({ side, color, pictures }) {
  const panelObject = new THREE.Object3D();
  const panelPivot = new THREE.Object3D();
  const material = new THREE.MeshBasicMaterial({ color, side: THREE.FrontSide, transparent: true, opacity: .4, });
  const geom = new THREE.PlaneGeometry(WALL_DIMENSION / 2, WALL_DIMENSION_H);
  const panel = new THREE.Mesh(geom, material)

  panel.name = `panel-${side}`
  intersects.push(panel)
  const inspectors = createPictures(pictures)
  panelObject.add(inspectors, panel)
  if (side === 'left') panelObject.position.set(WALL_DIMENSION / 4, 0, 0)
  if (side === 'right') panelObject.position.set(-WALL_DIMENSION / 4, 0, 0)
  panelPivot.add(panelObject)
  if (side === 'left') {
    panelPivot.position.set(-WALL_DIMENSION / 2, 0, 0)
    panelPivot.rotation.y = 0
    TweenMap['panels-toggle'](panelPivot, 'left')
  }

  if (side === 'right') {
    panelPivot.position.set(WALL_DIMENSION / 2, 0, 0)
    panelPivot.rotation.y = 0
    TweenMap['panels-toggle'](panelPivot, 'right')
  }

  panelPivot.name = `pivot-panel-${side}`
  panelPivot.userData.material = material
  pivots.push(panelPivot)
  return panelPivot
}

function createPictures(pictures) {
  const picturesGroup = new THREE.Group;
  pictures.forEach(({ w, h, x, y, name }) => {
    const geometry = new THREE.PlaneGeometry(w, h);
    const material = new THREE.MeshBasicMaterial({
      color: 'blue', side: THREE.FrontSide, depthTest: false,
      // depthWrite: true,
      // sizeAttenuation: true,
    });
    const inspect = new THREE.Mesh(geometry, material)
    inspect.position.set(x, y, 1)
    inspect.name = `inspect-${name}`
    intersects.push(inspect)
    picturesGroup.add(inspect)
  })
  return picturesGroup
}

function createRoom(faces) {

  const [north, east, south, west, ceil, floor] = faces

  const ROOM = new THREE.Object3D();
  const pivot0 = new THREE.Object3D();
  const pivot1 = new THREE.Object3D();
  const pivot2 = new THREE.Object3D();
  const pivot3 = new THREE.Object3D();
  const pivotCeil = new THREE.Object3D();
  const pivotFloor = new THREE.Object3D();

  pivot0.name = 'pivot-wall-north'
  pivot1.name = 'pivot-wall-east'
  pivot2.name = 'pivot-wall-south'
  pivot3.name = 'pivot-wall-west'
  pivotCeil.name = 'pivot-wall-ceil'
  pivotFloor.name = 'pivot-wall-floor'

  TweenMap['walls-toggle'](pivot1, 'left')
  TweenMap['walls-toggle'](pivot2, 'left')
  TweenMap['walls-toggle'](pivot3, 'right')

  // pivot1.userData.tween = {
  //   open: fold('y', pivot1).chain(slide(pivot1, WALL_DIMENSION)),
  //   close: slide(pivot1, WALL_DIMENSION / 2).chain(fold('y', pivot1, -Math.PI / 2))
  // }
  // pivot2.userData.tween = {
  //   open: fold('y', pivot2).chain(slide(pivot2, WALL_DIMENSION + WALL_DIMENSION / 2)),
  //   close: slide(pivot2, WALL_DIMENSION).chain(fold('y', pivot2, -Math.PI / 2))
  // }
  // pivot3.userData.tween = {
  //   open: fold('y', pivot3).chain(slide(pivot3, -WALL_DIMENSION)),
  //   close: slide(pivot3, -WALL_DIMENSION / 2).chain(fold('y', pivot3, Math.PI / 2))
  // }

  TweenMap['ceils-toggle'](pivotCeil, 'top')
  TweenMap['ceils-toggle'](pivotFloor, 'bottom')
  // pivotCeil.userData.tween = {
  //   open: fold('x', pivotCeil),
  //   close: fold('x', pivotCeil, -Math.PI / 2)
  // }
  // pivotFloor.userData.tween = {
  //   open: fold('x', pivotFloor),
  //   close: fold('x', pivotFloor, Math.PI / 2)
  // }

  const panelTweens = [north, east, south, west].map(({ face }) => face.userData.panels)

  // Wall 1 'NORTH'
  // pivot0.add(north.face)
  // Wall 2 'EAST'
  pivot1.position.x = WALL_DIMENSION / 2
  east.face.position.x = WALL_DIMENSION / 2
  pivot1.add(east.face)
  pivot1.rotation.y = -Math.PI / 2 // Wall rotation
  pivots.push(pivot1)
  // Wall 3 'SOUTH'
  pivot2.add(south.face)
  south.face.position.x = WALL_DIMENSION / 2
  pivot2.position.x = WALL_DIMENSION
  pivot2.rotation.y = -Math.PI / 2 // Wall rotation
  // Wall 4 'WEST'
  pivot3.position.x = -WALL_DIMENSION / 2
  pivot3.add(west.face)
  west.face.position.x = -WALL_DIMENSION / 2
  pivot3.rotation.y = Math.PI / 2//0.5 // Wall rotation
  // CEIL
  pivotCeil.position.y = -WALL_DIMENSION_H / 2
  pivotCeil.add(ceil.face)
  ceil.face.position.y = -WALL_DIMENSION / 2
  pivotCeil.rotation.x = -Math.PI / 2
  // FLOOR
  pivotFloor.position.y = WALL_DIMENSION_H / 2
  pivotFloor.add(floor.face)
  floor.face.position.y = WALL_DIMENSION / 2
  pivotFloor.rotation.x = Math.PI / 2

  // create space
  pivot1.add(pivot2)
  ROOM.add(pivot3, north.face, pivot1, pivotCeil, pivotFloor)
  ROOM.position.z = -WALL_DIMENSION / 2

  return {
    faces,
    room: ROOM,
    action: {
      fold: toggle([pivot1, pivot2, pivot3, pivotCeil, pivotFloor]), // create and add tween functions via maps here?
      panels: panelTweens
    }
  }
}

function slide(p, target) {
  return new TWEEN.Tween(p.position)
    .to({ x: target }, 2000)
    .easing(TWEEN.Easing.Cubic.Out)
}

function fold(axis, p, target = 0) {
  return new TWEEN.Tween(p.rotation)
    .to({ [axis]: target }, 1500)
    .easing(TWEEN.Easing.Cubic.Out)
}

function twist(axis, p, target = 0) {
  return new TWEEN.Tween(p.rotation)
    .to({ [axis]: target }, 1500)
    .easing(TWEEN.Easing.Cubic.Out)
}

function toggle(targets) {
  let open = false
  const pivots = Object.values(targets).filter((pivot) => pivot)
  return () => {
    pivots.forEach(({ userData }) => {
      if (open) userData.tween.close.start()
      else userData.tween.open.start()
    })
    open = !open
  }
}


export { createBounds, createRoom, createWall, intersects, pivots }