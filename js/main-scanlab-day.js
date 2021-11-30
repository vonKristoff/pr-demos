import Room from './framework/index'
import connectAppState from './framework/tourHandler'
import { data } from './roomdata'
import { createWall, createRoom, createBounds } from './builders'

const walls = data.map((surface) => surface.type === 'wall' ? createWall(surface) : createBounds(surface))
const assets = createRoom(walls)
const room = new Room(assets)

room.useEvent('TOUR', connectAppState())

function animate() {
  // if (room.state.camera === 'TWEEN') room.controls.orbit.update()
  if (room.state.view === 'ROOM') room.controls.orbit.update()

  TWEEN.update()
  room.renderer.render(room.scene, room.camera);
  requestAnimationFrame(animate);
}

function init() {
  // these two camera calls should be triggered by STATE
  room.camera.position.set(0, 0, 15000);
  // TODO - use camera.target.position.copy( camTarget ); to tween the lookAt
  room.camera.lookAt(0, 0, 0)
  document.body.appendChild(room.renderer.domElement);
  room.renderer.render(room.scene, room.camera);

  room.scene.add(assets.room)

  animate()
}

init()