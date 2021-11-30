function createMaterialArray(paths = []) {
  return paths.map(image => {
    let texture = new THREE.TextureLoader().load(image);
    return new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide }); // DoubleSide
  });
}
function createFilePaths(name) {
  let collection = ["ft", "bk", "up", "dn", "rt", "lf"]
  return collection.map((position) => `./assets/${name}_${position}.png`)
}

export { createMaterialArray, createFilePaths }