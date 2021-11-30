class EventControls {
  constructor({ onUpdate, state }, camera, renderer) {
    const events = (onUpdate) => (action) => onUpdate(action).then((state) => this.useControls(state))
    this.raycaster = new THREE.Raycaster()
    this.init(state, camera, renderer)
    this.useControls(state)
    this.onUpdate = events(onUpdate)
  }
  init(state, camera, renderer) {
    this.room = state
    this.camera = camera
    this.renderer = renderer
    document.addEventListener('mouseup', (e) => this.clickHandler(e))
    document.addEventListener('keydown', (e) => this.handleKeys(e))
    this.orbit = new THREE.OrbitControls(camera, renderer.domElement);
    this.pan = d3.select(renderer.domElement);
    this.zoom = d3.zoom().scaleExtent([700, 15000])

    // not strictly the place - but at least collate all listeners being added
    window.addEventListener('resize', () => {
      // TODO - unhook when view destroyed
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
    })
  }
  useControls(state) {
    // const previousControls = this.currentControls
    console.log('useControls', state)
    if (state) {
      this.room = { ...this.room, ...state }
      this.updateControls()
    }
  }
  updateControls() {
    console.log('update controls', this.room)
    switch (this.room.controls) {
      case 'PAN':
        this.lockOrbit()
        this.usePan()
        return
      case 'ORBIT':
        this.lockPan()
        this.useOrbit()
        return
      default:
        this.lockOrbit()
        this.lockPan()
    }
  }
  handleKeys(e) {
    const command = KEYMAP[e.keyCode]
    if (this.room.controls !== 'TWEEN' && command) {
      this.onUpdate({ type: 'COMMAND', action: command.action })
    }
  }
  clickHandler(event) {
    if (this.room.controls !== 'TWEEN') {
      this.raycaster.setFromCamera({
        x: (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1,
        y: -(event.clientY / this.renderer.domElement.clientHeight) * 2 + 1
      }, this.camera)
      const capture = this.raycaster.intersectObjects(this.room.interactables)
      this.onUpdate({ type: 'SELECT', action: { interactables: capture } })
    }
  }
  usePan() {
    this.zoom.on('zoom', () => this._zoom()).scaleExtent([700, 15000])
    this.zoom.scaleTo(this.pan, this.camera.position.z);
    this.pan.call(this.zoom)
  }
  lockPan() {
    this.zoom.on('zoom', null)
  }
  useOrbit() {
    this.orbit.enabled = true
    if (this.room.view === 'ROOM') {
      this.orbit.minDistance = 700;
      this.orbit.maxDistance = 25000;
    }
    // ever called?
    if (this.room.view === 'MAP') {
      this.orbit.maxPolarAngle = -Math.PI / 2
      this.orbit.minPolarAngle = Math.PI / 2
    }
  }
  lockOrbit() {
    this.orbit.enabled = false
  }
  _zoom() {
    const event = d3.event;
    if (event.sourceEvent) {
      const new_z = event.transform.k;
      if (new_z !== this.camera.position.z) {
        const { clientX, clientY } = event.sourceEvent;
        // Project a vector from current mouse position and zoom level
        // Find the x and y coordinates for where that vector intersects the new zoom level.
        // Code from WestLangley https://stackoverflow.com/questions/13055214/mouse-canvas-x-y-to-three-js-world-x-y-z/13091694#13091694
        const vector = new THREE.Vector3(clientX / window.innerWidth * 2 - 1, -(clientY / window.innerHeight) * 2 + 1, 1);
        vector.unproject(this.camera);
        const dir = vector.sub(this.camera.position).normalize();
        const distance = (new_z - this.camera.position.z) / dir.z;
        const pos = this.camera.position.clone().add(dir.multiplyScalar(distance));
        // Set the this.camera to new coordinates
        this.camera.position.set(pos.x, pos.y, new_z);
      } else {
        // Handle panning
        const { movementX, movementY } = event.sourceEvent;
        // Adjust mouse movement by current scale and set this.camera
        const current_scale = getCurrentScale(this.camera);
        this.camera.position.set(this.camera.position.x - movementX / current_scale, this.camera.position.y +
          movementY / current_scale, this.camera.position.z);
      }
    }
  }
}

function getCurrentScale(camera) {
  var vFOV = camera.fov * Math.PI / 180
  var scale_height = 2 * Math.tan(vFOV / 2) * camera.position.z
  var currentScale = window.innerHeight / scale_height
  return currentScale
}

const KEYMAP = {
  49: { key: '1', action: { as: 'TRANSITION', view: 'ROOM' } },
  50: { key: '2', action: { as: 'TRANSITION', view: 'MAP' } },
  51: { key: '3', action: { as: 'CALL', trigger: 'PANELS' } },
  52: {
    key: '4', action: { as: 'TEXTURES' }
  },
  // 53: { key: '5', action: { as: 'TRANSITION', view: 'ROOM', trigger: 'TOGGLE' } },
  54: { key: '6', action: { as: 'TRANSITION', view: 'TOUR', trigger: 'GALLERY', param: 'AD01' } },
  37: { key: 'left arrow', action: { as: 'INSPECT', trigger: 'GALLERY', param: 'BACK' } },
  39: { key: 'right arrow', action: { as: 'INSPECT', trigger: 'GALLERY', param: 'NEXT' } }
}

export default EventControls