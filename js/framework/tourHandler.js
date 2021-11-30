const TOURS = {
  AD01: ['we1', 'we2', 'we3']
}
const list = [{
  id: 'we1',
  position: { x: 0, y: 0, z: 0 },
  rotation: { x: 0, y: 0, z: 0 },
},
{
  id: 'we2',
  position: { x: 0, y: 0, z: 0 },
  rotation: { x: 0, y: 0, z: 0 },
},
{
  id: 'we3',
  position: { x: 0, y: 0, z: 0 },
  rotation: { x: 0, y: 0, z: 0 },
}]

const connectAppState = () => {
  let currentTour = null
  let sequence = 0
  return {
    GALLERY: (event) => {
      if (!currentTour) currentTour = event
      if (event === 'NEXT' && currentTour) {
        sequence++
        if (sequence > TOURS[currentTour].length) return false
      }
      if (event === 'PREV' && currentTour) {
        sequence--
        if (sequence < 0) return false
      }
      const next = TOURS[currentTour][sequence]
      return list.find(({ id }) => id === next)
    }
  }
}


export default connectAppState