const w1 = {
  pivot: null,
  type: 'wall',
  name: "north",
  color: 'purple',
  w: 10000,
  h: 10000,
  texture: 'NB',
  pictures: {
    wall: [{
      src: 'path/img',
      name: "artist",
      uid: '7656',
      w: 1000,
      h: 700,
      x: -200,
      y: 800
    }],
    panel: {
      left: [{
        src: 'path/img',
        name: "artist-panel",
        uid: '7656',
        w: 1000,
        h: 700,
        x: -2000,
        y: 800
      }],
      right: []
    }
  }
}
const w2 = {
  pivot: 'root',
  type: 'wall',
  name: "east",
  color: 'red',
  w: 10000,
  h: 10000,
  texture: 'EB',
  pictures: {
    wall: [{
      src: 'path/img',
      name: "artist",
      uid: '7656',
      w: 100,
      h: 70,
      x: -200,
      y: 800
    }],
    panel: {
      left: [],
      right: []
    }
  }
}
const w3 = {
  pivot: 'east',
  type: 'wall',
  name: "south",
  color: 'green',
  w: 10000,
  h: 10000,
  texture: 'SB',
  pictures: {
    wall: [{
      src: 'path/img',
      name: "artist",
      uid: '7656',
      w: 100,
      h: 70,
      x: -200,
      y: 800
    }],
    panel: {
      left: [],
      right: []
    }
  }
}
const w4 = {
  pivot: 'root',
  align: 'right',
  type: 'wall',
  name: "west",
  color: 'yellow',
  w: 10000,
  h: 10000,
  texture: 'WB',
  pictures: {
    wall: [{
      src: 'path/img',
      name: "artist",
      uid: '7656',
      w: 1000,
      h: 700,
      x: -200,
      y: 800
    }],
    panel: {
      left: [],
      right: []
    }
  }
}

const ceil = {
  pivot: 'root',
  align: 'bottom',
  type: 'surface',
  name: "top",
  color: 'teal',
  w: 10000,
  h: 10000,
  texture: 'img/to/load',
  pictures: null
}
const floor = {
  type: 'surface',
  pivot: 'root',
  align: 'top',
  name: "floor",
  color: 'brown',
  w: 10000,
  h: 10000,
  texture: 'img/to/load',
  pictures: null
}

const data = [w1, w2, w3, w4, ceil, floor]

export { data }