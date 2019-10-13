import seedrandom from 'seedrandom'

export default {
  methods: {
    randomColor(seed) {
      let randomizer = seedrandom(seed)
      let hue = Math.floor(randomizer() * 361)
      let saturation = Math.floor((randomizer() * 51) + 50)
      let lightness = Math.floor((randomizer() * 31) + 20)

      return `hsl(${hue},${saturation}%,${lightness}%)`
    },
  },
}
