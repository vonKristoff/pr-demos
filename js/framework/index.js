import EventControls from './eventControls'
const STATES = {
  VIEW: ['ROOM', 'MAP', 'TOUR'],
  CAMERA: ['INSIDE', 'OUTSIDE'],
  CONTROLS: ['LOCK', 'PAN', 'ORBIT']
}

class Room {
  constructor(assets) {
    this.model = assets
    this.currentFocus = null
    this.currentView = STATES.VIEW[0]
    this.currentCamera = STATES.CAMERA[1]
    this.currentControls = STATES.CONTROLS[2]
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 45, 300000);
    this.controls = new EventControls({ onUpdate: this.update.bind(this), state: this.state }, this.camera, this.renderer)
    this.events = {}
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.domElement.id = "canvas";

    // setTimeout(() => this.model.action.fold(), 3000)
  }

  useEvent(name, scope) {
    this.events[name] = scope
  }

  get state() {
    return {
      view: this.currentView,
      focus: this.currentFocus,
      camera: this.currentCamera,
      controls: this.currentControls,
      interactables: []
    }
  }

  // perform actions/transitions : then :
  // state controller - on resolve => enable/update controls
  update({ type, action }) {
    return new Promise((resolve) => {

      if (action.as === 'TEXTURES') {
        console.log(this.model.faces)//
        this.model.faces.filter(({ type }) => type === 'wall').forEach(wall => wall.toggleTexture())
        setTimeout(() => resolve(this.state), 400)
      }

      if (action.as === 'CALL') {
        this.model.action.panels.forEach(tw => tw())
        setTimeout(() => resolve(this.state), 2000)
      }
      // main camera position / transform room
      // be more specific now
      if (action.as === 'TRANSITION') {
        if (action.trigger) this.dispatchEvent(action)
        return this.updateTransition(action)
          .then((state) => resolve(this.applyState(state)))
          .catch(() => resolve()) // 'no command defined'
      }
      if (action.as === 'INSPECT') { //type === 'SELECT' || 
        this.dispatchEvent(action)
        return this.updateInspect(action)
          .then(() => resolve(this.state))
          .catch(() => resolve()) // 'nothing to do'
      }
    })
  }

  dispatchEvent({ view, trigger, param }) {
    let scenario = !view ? this.currentCamera : view
    console.log(this.events[scenario] && this.events[scenario][trigger], view)
    if (!this.events[scenario][trigger]) return
    const method = this.events[method][trigger]
    this.currentFocus = { method, param }
  }

  applyState({ view, camera, controls }) {
    this.currentView = view
    this.currentCamera = camera
    this.currentControls = controls
    return this.state
  }

  updateTransition(action) {
    return new Promise((resolve, reject) => {
      let promise
      const preViewState = { ...this.state }
      const newViewState = deriveState(action)

      if (!newViewState) return reject()
      // lock controls
      this.controls.useControls({ controls: 'TWEEN' })
      // position camera

      if (preViewState.view === 'MAP' && action.view === 'ROOM') {
        this.model.action.fold()
        promise = runTween.call(this, newViewState.view)
      }

      if (preViewState.view === 'ROOM' && action.view === 'MAP') {
        this.model.action.fold()
        promise = runTween.call(this, newViewState.view)
      }

      if (preViewState.view === 'ROOM' && action.view === 'TOUR') {
        const { method, param } = this.currentFocus
        const target = method(param)
        promise = runTween.call(this, 'TOUR', target)
      }

      if (preViewState.view === 'TOUR' && action.view === 'ROOM') {
        promise = runTween.call(this, newViewState.view)
      }

      if (preViewState.view === 'ROOM' && action.view === 'ROOM') {
        promise = runTween.call(this, newViewState.view)
      }

      promise.then(() => resolve(newViewState)).catch(() => resolve(newViewState))
    })
  }

  updateInspect() {
    const { method, param } = this.currentFocus
    const target = method(param)
    runTween.call(this, 'TOUR', target)
      .then(() => resolve(this.state))
      .catch(() => resolve(this.state))
  }

  updateView(action) {
    return new Promise((resolve, reject) => {
      const newViewState = deriveState(action)
      if (!newViewState) return reject()
      // apply tweens
      this.controls.useControls({ controls: 'TWEEN' })
      // position camera
      if (action.view) runTween.call(this, newViewState.camera)
      // call tween // >> method <<
      runTween.call(this, action.trigger).then(() => resolve(newViewState)).catch(() => resolve(state))
    })
  }
  // click
  triggerAction({ target, method }) {
    return new Promise((resolve) => {
      const state = deriveState(target)
      if (!state) return reject()
    })
  }

}

function deriveState({ view }) {
  if (!view) return false
  if (view === 'ROOM') return { view: 'ROOM', camera: 'OUTSIDE', controls: 'ORBIT' }
  if (view === 'MAP') return { view: 'MAP', camera: 'OUTSIDE', controls: 'PAN' }
  if (view === 'TOUR') return { view: 'ROOM', camera: 'INSIDE', controls: 'LOCK' }
}

function runTween(method, next) {
  return new Promise((resolve, reject) => {
    const action = tweenMap[method]
    if (action) action.call(this, next).start().onComplete(() => resolve())
    else reject()
  })
}

const tweenMap = {
  'ROOM': function () {
    return new TWEEN.Tween(this.camera.position)
      .to({ x: 0, y: 0, z: 15000 }, 3000)
      .easing(TWEEN.Easing.Cubic.Out)
  },
  'MAP': function () {
    return new TWEEN.Tween(this.camera.position)
      .to({ x: 0, y: 0, z: 15000 }, 3000)
      .easing(TWEEN.Easing.Cubic.Out)
  },
  'TOUR': function ({ position, rotation }) {
    new TWEEN.Tween(this.camera.position)
      .to(position, 3000)
      .easing(TWEEN.Easing.Cubic.Out)
      .start()
    return new TWEEN.Tween(this.camera.rotation)
      .to(rotation, 3000)
      .easing(TWEEN.Easing.Cubic.Out)
  },
  'GALLERY': function () {
    new TWEEN.Tween(this.camera.rotation)
      .to(this.currentFocus.target.rotation, 1500)
      .easing(TWEEN.Easing.Cubic.Out)
      .start()
    return new TWEEN.Tween(this.camera.position)
      .to(this.currentFocus.target.position, 3000)
      .easing(TWEEN.Easing.Cubic.Out)
  },
  'TOGGLE': function () {
    new TWEEN.Tween(this.camera.rotation)
      .to(compassRotations['e'], 2000)
      .easing(TWEEN.Easing.Cubic.Out)
      .start()
      .onComplete(() => {
        // this.camera.target.position.copy(compassRotations['e']);
      })
    return new TWEEN.Tween(this.camera.position)
      .to({ x: 0, y: 0, z: 0 }, 3000)
      .easing(TWEEN.Easing.Cubic.Out)
  },
  'RESET': false

}

const compassRotations = {
  n: { x: 0, y: 0, z: 0 },
  e: { x: Math.PI / 2, y: -(Math.PI / 2), z: Math.PI / 2 },
  s: { x: Math.PI, y: 0, z: Math.PI },
  w: { x: 0, y: Math.PI / 2, z: 0 }
}

export default Room

function origin() {
  new TWEEN.Tween(this.camera.rotation)
    .to({ x: 0, y: 0, z: 0 }, 1500)
    .easing(TWEEN.Easing.Cubic.Out)
    .start()
  return new TWEEN.Tween(this.camera.position)
    .to({ x: 0, y: 0, z: 15000 }, 3000)
    .easing(TWEEN.Easing.Cubic.Out)
}