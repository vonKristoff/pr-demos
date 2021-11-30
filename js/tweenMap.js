const WALL_DIMENSION = 10000
const TweenMap = {
  'panels-toggle': (pivot, align) => {
    const to = align === 'right' ? Math.PI : -Math.PI
    pivot.userData.tween = {
      open: twist('y', pivot, to),
      close: twist('y', pivot, 0)
    }
  },
  'walls-toggle': (pivot, align) => {
    let dir = align === 'left' ? -1 : 1
    const slideMap = {
      'pivot-wall-east': [WALL_DIMENSION, WALL_DIMENSION / 2],
      'pivot-wall-south': [WALL_DIMENSION + WALL_DIMENSION / 2, WALL_DIMENSION],
      'pivot-wall-west': [-WALL_DIMENSION, -WALL_DIMENSION / 2]
    }
    const [slideOpen, slideClose] = slideMap[pivot.name]
    pivot.userData.tween = {
      open: fold('y', pivot).chain(slide(pivot, slideOpen)),
      close: slide(pivot, slideClose).chain(fold('y', pivot, dir * Math.PI / 2))
    }
  },
  'ceils-toggle': (pivot, align) => {
    let dir = align === 'top' ? -1 : 1
    pivot.userData.tween = {
      open: fold('x', pivot),
      close: fold('x', pivot, dir * Math.PI / 2)
    }
  }
}

function slide(p, target) {
  return new TWEEN.Tween(p.position)
    .to({ x: target }, 2000)
    .easing(TWEEN.Easing.Cubic.Out)
}

function translate(p, from, to) {
  return new TWEEN.Tween({ val: from })
    .to({ val: to }, 1500)
    .easing(TWEEN.Easing.Cubic.Out)
    .onUpdate(({ val }) => {
      // not affected by easing
      p.translateX(Math.round(val / 100))
    })
}

function fold(axis, p, target = 0) {
  return new TWEEN.Tween(p.rotation)
    .to({ [axis]: target }, 1500)
    .easing(TWEEN.Easing.Cubic.Out)
}

function twist(axis, p, target = 0) {
  return new TWEEN.Tween(p.rotation)
    .to({ [axis]: target }, 2000)
    .easing(TWEEN.Easing.Cubic.Out)
    .onUpdate(({ y }) => {
      if (target !== 0) {
        // close
        if (y >= Math.PI) {
          p.userData.material.visible = false
          p.userData.material.needsUpdate = true;
        }
        if (y <= -Math.PI) {
          p.userData.material.visible = false
          p.userData.material.needsUpdate = true;
        }
      } else {
        p.userData.material.visible = true
        p.userData.material.needsUpdate = true;
      }
    })
}

// slide(panelPivot, WALL_DIMENSION / 2)
// .onComplete(() => {
//   panelPivot.rotation.y = 0
//   panelPivot.translateX(WALL_DIMENSION / 2)
//   panel.material.opacity = 0.25
// }),


export { TweenMap }