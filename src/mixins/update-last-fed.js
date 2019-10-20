export default {
  methods: {
    getLastFed(animalId) {
      return this.$firebase
        .firestore()
        .collection('users')
        .doc(this.uuid)
        .collection('animals')
        .doc(animalId)
        .collection('events')
        .where('type', '==', 'Feeding')
        .orderBy('timestamp', 'desc')
        .limit(1)
    },

    updateLastFed(animalId) {
      this.getLastFed(animalId)
        .get()
        .then((querySnapshot) => {
          let lastFed
          if(querySnapshot.empty) {
            lastFed = 'none'
          } else {
            lastFed = querySnapshot.docs[0].data().timestamp
          }

          this.$firebase
            .firestore()
            .collection('users')
            .doc(this.uuid)
            .collection('animals')
            .doc(animalId)
            .update({
              lastFed: lastFed,
            })
        })
    },
  },
}
