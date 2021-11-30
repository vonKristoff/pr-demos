export default function createTransition(c, target, ctl, isTweening) {
  // ctl.enable = false
  // set up targets
  const pull = new TWEEN.Tween({ z: c.position.z })
    .delay(1000)
    .to({ z: 5000 }, 2000)
    .easing(TWEEN.Easing.Quadratic.In)
    .onUpdate(({ z }) => {
      c.lookAt(target)
      c.position.z = z
    })

  const pan = new TWEEN.Tween({ x: c.position.x, y: c.position.y })
    .to({ x: -100 + target.position.x, y: target.position.y }, 1000)
    .easing(TWEEN.Easing.Quadratic.Out)
    .onUpdate(({ x, y }) => {
      c.position.set(x, y)
    })

  var startRotation = c.quaternion.clone();
  var endRotation = target.quaternion.clone();
  c.quaternion.copy(startRotation);

  // Tween
  var cam = new TWEEN.Tween(c.quaternion).to(endRotation, 300)

  cam.start().onComplete(() => {
    isTweening = true
    pan.start()
    pull
      .onComplete(() => {
        setTimeout(() => ctl.enabled = true, 0)
        isTweening = false
      }).start()
  })

}
