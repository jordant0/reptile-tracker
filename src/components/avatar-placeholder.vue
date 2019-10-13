<script>
import randomColor from '@/mixins/random-color'

export default {
  mixins: [
    randomColor,
  ],

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
      return this.randomColor(this.seed)
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
