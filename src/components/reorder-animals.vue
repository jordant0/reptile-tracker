<script>
import Draggable from 'vuedraggable'
import randomColor from '@/mixins/random-color'
import { mapGetters } from 'vuex'

export default {
  mixins: [
    randomColor,
  ],

  components: {
    Draggable,
  },

  props: {
    animalsList: {
      type: Array,
      default() {
        return []
      },
    },
  },

  data() {
    return {
      orderingList: [],
      submitting: false,
    }
  },

  watch: {
    animalsList: {
      immediate: true,
      handler() {
        this.resetOrdering()
      },
    },
  },

  created() {
    this.resetOrdering()
  },

  computed: {
    ...mapGetters([
      'uuid',
    ]),
  },

  methods: {
    resetOrdering() {
      this.orderingList = this.animalsList
        .filter(animal => !animal.archive)
        .sort((animalA, animalB) => {
          if(!animalB.position) {
            return -1
          } else if(!animalA.position) {
            return 1
          } else {
            return animalA.position - animalB.position
          }
        })
        .map((animal) => {
          return {
            id: animal.id,
            name: animal.name,
            color: this.randomColor(animal.id),
          }
        })
    },

    saveOrdering() {
      this.submitting = true
      var batch = this.$firebase.firestore().batch()
      let animalCollection = this.$firebase
        .firestore()
        .collection('users')
        .doc(this.uuid)
        .collection('animals')

      this.orderingList.forEach((animal, index) => {
        batch.update(animalCollection.doc(animal.id), { position: (index + 1) })
      })

      batch.commit().then(() => {
        this.submitting = false
        this.$store.commit('showNotification', {
          color: 'success',
          text: 'Animals ordering updated',
        })
      })
    },
  },
}
</script>

<template>
  <v-card class="container-card">
    <v-card-title>
      Reorder Animals

      <div class="flex-grow-1"></div>

      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            color="#b6b6b6"
            v-on="on"
            @click="resetOrdering"
          >
            <v-icon>mdi-autorenew</v-icon>
          </v-btn>
        </template>
        <span>Reset</span>
      </v-tooltip>
    </v-card-title>

    <v-card-text v-if="!animalsList.length" class="d-flex justify-center pb-9">
      No animal found
    </v-card-text>
    <v-card-text class="animal-reorder-wrapper">
      <v-list class="animal-reorder" dense>
        <v-overlay
          class="animal-reorder_overlay"
          absolute
          :value="submitting"
        >
          <v-progress-circular
            indeterminate
            size="64"
          />
        </v-overlay>

        <draggable v-model="orderingList">
          <transition-group>
            <v-list-item
              v-for="animal in orderingList"
              :key="animal.id"
              :style="{ backgroundColor: animal.color }"
            >
              <v-list-item-avatar>
                <v-icon color="#ffffff">
                  mdi-drag
                </v-icon>
              </v-list-item-avatar>

              <v-list-item-content>
                {{ animal.name }}
              </v-list-item-content>
            </v-list-item>
          </transition-group>
        </draggable>
      </v-list>

      <div class="form-actions">
        <v-btn
          text
          color="#b6b6b6"
          @click="$router.back()"
        >
          Cancel
        </v-btn>

        <div class="flex-grow-1" />

        <v-btn
          color="primary"
          type="submit"
          :disabled="submitting"
          :loading="submitting"
          @click="saveOrdering"
        >
          Save
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<style>
.animal-reorder {
  max-width: 400px;
  margin: auto;
  position: relative;
}

.animal-reorder .v-list-item {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  margin-top: -1px;
}

.animal-reorder .v-list-item__content {
  color: #ffffff;
}
</style>
