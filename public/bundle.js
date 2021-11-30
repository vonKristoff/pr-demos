(function () {
  'use strict';

  var scene, camera, renderer, controls, dolly;
  var loader = new THREE.GLTFLoader();
  var hasLoaded = false;
  var panels = [];
  var walls = ['NORTH_WALL', 'NORTH_WALL_TARGETS', 'EAST_WALL'];//'NB', 'NL1B', 'NR1B', 'NL1F', 'NR1F',]
  var pics = [];
  var moveCamera;
  window.addEventListener('keyup', function (e) {
    console.log(e.keyCode);
    if (e.keyCode === 32) { moveCamera(); }
    if (e.keyCode === 13) { exit(); }
    if (e.keyCode === 49) { togglePanels(); }
  });
  function loadModels(wall, i) {
    loader.load(("./model/" + wall + "/" + wall + ".gltf"), function (gltf) {
      // let car = gltf.scene.children[0]
      // const a = car.children[0]
      // // car.geometry.center(); // center here
      // let t = car.children[0]
      console.log(gltf);
      // console.log(a.children[0], gltf.scene)
      // scene.add(gltf.scene);
      gltf.scene.traverse(function (child) {
        console.log(child.name);

        var descriptors = child.name.split('_');
        if (descriptors.some(function (part) { return part === 'Slice'; })) {
          child.material.depthWrite = false;
          child.material.depthTest = false;
          child.material.depthFunc = THREE.NeverDepth;
        }
        if (child.isMesh) { child.material.transparent = true; }
        if (descriptors.some(function (part) { return part === 'TARGET'; })) {
          var EAST = child.parent.name.split('_').some(function (part) { return part === 'EAST'; });
          child.material.opacity = 0;
          if (EAST) {
            child.userData.axis = ['y', 'z'];
            child.userData.c = 'x';
          }
          else {
            child.userData.axis = ['x', 'y'];
            child.userData.c = 'z';
          }

          pics.push(child);
          // if (Math.round(Math.random())) 
        }
        if (child.name === 'PIVOT_PANEL_N_RIGHT') {
          // child.rotation.z = -Math.PI / 5
          child.userData.toggle = swing(child, 'right');
          panels.push(child);
        }
        if (child.name === 'PIVOT_PANEL_N_LEFT') {
          // child.rotation.z = -Math.PI / 5
          child.userData.toggle = swing(child, 'left');
          panels.push(child);
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
          child.position.z = 2.125;
          child.children[1];
        }
        if (child.name === 'PIVOT_EAST_WALL') {
          var d = child.children[0].children[3].material;
          d.depthWrite = false;
          d.depthTest = false;
          d.depthFunc = THREE.NeverDepth;
          // d.opacity = .25
          // console.log(d)
          child.position.x = -2.125;
        }
      });


      gltf.scene.scale.set(1, 1, 1); // scale here
      scene.add(gltf.scene);
      ready();
      hasLoaded = true;
    });
  }
  function ready() {
    if (hasLoaded) { return }
    animate();
    setTimeout(function () {
      pics.sort(function () { return (Math.random() > .5) ? 1 : -1; });
      pics.forEach(function (tgt) {
        console.log(tgt.name);
      });
      var pos = pics.map(function (p) {
        var obj;

        var ref = p.userData.axis;
        var a = ref[0];
        var b = ref[1];
        var target = p.getWorldPosition();
        return {
          dolly: target,
          camera: ( obj = {}, obj[a] = target[a], obj[b] = target[b], obj[p.userData.c] = 0, obj )
        }
      });
      // dolly.material.opacity = 0.25
      moveCamera = slide(camera, createTour(pos));//[target.position, { x: 1, y: -1 }, { x: 0, y: 0 }]))
    }, 3000);
  }

  var adjacent;

  function init() {

    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.gammaOutput = true;
    renderer.gammaFactor = 2.2;
    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 50000);
    controls = new THREE.OrbitControls(camera, renderer.domElement);

    var hlight = new THREE.AmbientLight('white');

    var boxGeom = new THREE.BoxGeometry(.25, .25, .25);
    var material = new THREE.MeshBasicMaterial({ color: 'red', side: THREE.FrontSide });
    dolly = new THREE.Object3D();//new THREE.Mesh(boxGeom, material) 

    // dolly.material.opacity = 0
    console.log(dolly);
    // dolly.visible = false
    adjacent = new THREE.Mesh(boxGeom, material);
    // adjacent.position.set(2.5, 0, -2.5)
    scene.add(dolly);
    scene.add(hlight);

    console.log('DOLLY', dolly);

    // camera.lookAt(dolly)
    camera.position.set(0, 0, -2.5);

    walls.forEach(loadModels);
  }

  function animate() {
    controls.update();
    camera.lookAt(dolly.position);
    // z += 0.05
    // target.rotation.z = z
    TWEEN.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  init();

  function createTour(sequence) {
    var index = 0;
    return {
      next: function () { return sequence[index]; },
      update: function () { return index++; }
    }
  }

  function slide(p, state) {

    return function () {
      new TWEEN.Tween(dolly.position)
        .to(state.next().dolly, 2000)
        // .delay(500)
        .easing(TWEEN.Easing.Cubic.Out)
        .start();

      new TWEEN.Tween(camera.position)
        .to(state.next().camera, 2000)
        .easing(TWEEN.Easing.Cubic.Out)
        .onComplete(function () {
          state.update();
        })
        .start();

      // new TWEEN.Tween(camera.scale)
      //   .to({ z: 2 }, 1500)
      //   .delay(1500)
      //   .easing(TWEEN.Easing.Cubic.Out)
      //   .start()
    }
  }

  function togglePanels() {
    panels.forEach(function (door) {
      door.userData.toggle();
    });
  }

  function exit() {
    new TWEEN.Tween(dolly.position)
      .to({ x: 0, y: 0, z: 0 }, 1000)
      .easing(TWEEN.Easing.Cubic.Out)
      .start();

    new TWEEN.Tween(camera.position)
      .to({ x: 0, y: 0, z: -2.50 }, 2000)
      .easing(TWEEN.Easing.Cubic.Out)
      .onComplete(function () {
        camera.position.set(0, 0, -2.5);
      })
      .start();
  }

  function swing(pivot, align) {
    var to = align === 'right' ? -Math.PI / 2.2 : Math.PI / 2.2;
    return toggler(pivot, to)
  }

  function toggler(pivot, to) {
    var open = true;
    return function () {
      if (open) { twist('z', pivot, to); }
      else { twist('z', pivot, 0); }
      open = !open;
    }
  }

  function twist(axis, p, target) {
    var obj;

    if ( target === void 0 ) target = 0;
    new TWEEN.Tween(p.rotation)
      .to(( obj = {}, obj[axis] = target, obj ), 2000)
      .easing(TWEEN.Easing.Cubic.Out)
      .onUpdate(function (ref) {
        var y = ref.y;
      })
      .start();
  }

}());
//# sourceMappingURL=bundle.js.map
