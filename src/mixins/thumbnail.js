export default {
  methods: {
    getThumbnailFromImage(imageUrl) {
      try {
        let matches = imageUrl.match(/([^.]*)(.*)/)

        if(matches && matches.length >= 3) {
          return `${matches[1]}_40x40${matches[2]}`
        }
      } catch(e) {}
      return null
    },
  },
}
