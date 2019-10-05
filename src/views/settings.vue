<script>
import Loading from '@/components/loading'
import Draggable from 'vuedraggable'
import { mapState, mapGetters } from 'vuex'

export default {
  components: {
    Loading,
    Draggable,
  },

  data() {
    return {
      loading: true,
      animalsList: [],
      orderingList: [],
      submitting: false,
    }
  },

  watch: {
    uuid: {
      immediate: true,
      handler() {
        if(this.uuid) {
          this.$bind(
            'animalsList',
            this.$firebase
              .firestore()
              .collection('users')
              .doc(this.uuid)
              .collection('animals')
          ).then(() => {
            this.loading = false
          })
        }
      },
    },

    animalsList() {
      this.resetOrdering()
    },
  },

  created() {
    this.colorPalette = [
      [ '#FFEBEE', '#B71C1C' ],
      [ '#FCE4EC', '#880E4F' ],
      [ '#F3E5F5', '#4A148C' ],
      [ '#EDE7F6', '#311B92' ],
      [ '#E8EAF6', '#1A237E' ],
      [ '#E3F2FD', '#0D47A1' ],
      [ '#E1F5FE', '#01579B' ],
      [ '#E0F7FA', '#006064' ],
      [ '#E0F2F1', '#004D40' ],
      [ '#E8F5E9', '#1B5E20' ],
      [ '#F1F8E9', '#33691E' ],
      [ '#F9FBE7', '#827717' ],
      [ '#FFFDE7', '#F57F17' ],
      [ '#FFF8E1', '#FF6F00' ],
      [ '#FFF3E0', '#E65100' ],
      [ '#FBE9E7', '#BF360C' ],
      [ '#EFEBE9', '#3E2723' ],
    ]
  },

  computed: {
    ...mapState([
      'darkTheme',
    ]),

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
            return 1
          } else if(!animalA.position) {
            return -1
          } else {
            return animalA.position - animalB.position
          }
        })
        .map((animal, index) => {
          return {
            id: animal.id,
            name: animal.name,
            color: this.colorPalette[index % this.colorPalette.length],
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
        batch.update(animalCollection.doc(animal.id), { position: index })
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
  <div class="container-wrapper">
    <loading v-if="loading" />
    <template v-else>
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
                  :style="{ backgroundColor: animal.color[darkTheme ? 1 : 0] }"
                >
                  <v-list-item-avatar>
                    <v-icon>
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
  </div>
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

.animal-reorder .theme--dark.v-list-item {
  border-color: #595959;
}
</style>
