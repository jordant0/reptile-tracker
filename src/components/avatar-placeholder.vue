<script>
import seedrandom from 'seedrandom'

export default {
  props: {
    seed: {
      type: String,
      default: null,
    },

    name: {
      type: String,
      default: '?',
    },
  },

  computed: {
    animalColor() {
      let randomizer = seedrandom(this.seed)
      let hue = Math.floor(randomizer() * 361)
      let saturation = Math.floor((randomizer() * 51) + 50)
      let lightness = Math.floor((randomizer() * 31) + 20)

      return `hsl(${hue},${saturation}%,${lightness}%)`
    },

    placeholderText() {
      let names = this.name.split(' ')
      if(names.length >= 2) {
        return `${names[0].charAt(0).toUpperCase()}${names[1].charAt(0).toUpperCase()}`
      } else {
        return `${names[0].charAt(0).toUpperCase()}${names[0].charAt(1)}`
      }
    },
  },
}
</script>

<template>
  <div class="avatar-placeholder" :style="{ backgroundColor: animalColor }">
    {{ placeholderText }}
  </div>
</template>
