<script>
import DateTimeInput from '@/components/date-time-input'
import TagsInput from '@johmun/vue-tags-input'
import VueCropper from 'vue-cropperjs'
import thumbnailMixin from '@/mixins/thumbnail'
import randomColor from '@/mixins/random-color'
import { mapGetters } from 'vuex'
import moment from 'moment'

export default {
  mixins: [
    thumbnailMixin,
    randomColor,
  ],

  components: {
    VueCropper,
    DateTimeInput,
    TagsInput,
  },

  props: {
    animal: {
      type: Object,
      default() {
        return {}
      },
    },
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
          )
        }
      },
    },
  },

  data() {
    return {
      submitting: false,
      tempImage: '',
      animalImage: '',
      animalImageUrl: '',
      cropDialog: false,
      imageChanged: false,
      today: moment().startOf('day'),
      tagValue: '',
      animalsList: [],
      animalData: {
        name: this.animal.name || '',
        species: this.animal.species || '',
        morph: this.animal.morph || '',
        feedingDuration: this.animal.feedingDuration || null,
        birthdate: this.animal.birthdate ? this.animal.birthdate.toDate() : new Date(),
        arrival: this.animal.arrival ? this.animal.arrival.toDate() : new Date(),
        sex: this.animal.sex || 'unknown',
        sexConfirmed: this.animal.sexConfirmed || false,
        tags: this.animal.tags || [],
      },
    }
  },

  created() {
    this.sexOptions = {
      'unknown': {
        index: 0,
        icon: 'mdi-help',
        size: '20px',
      },
      'male': {
        index: 1,
        icon: 'mdi-gender-male',
        color: '#468bff',
      },
      'female': {
        index: 2,
        icon: 'mdi-gender-female',
        color: '#f886fe',
      },
    }

    if(this.animal.image && this.animal.image.length) {
      this.$firebase.storage().ref(this.animal.image).getDownloadURL().then((url) => {
        this.animalImageUrl = url
      })
    }
  },

  computed: {
    ...mapGetters([
      'uuid',
    ]),

    sexValue: {
      get() {
        return this.sexOptions[this.animalData.sex].index
      },

      set(value) {
        this.animalData.sex = Object.keys(this.sexOptions).find((key) => this.sexOptions[key].index === value)
      },
    },

    confirmSex() {
      return this.animalData.sex === 'male' || this.animalData.sex === 'female'
    },

    startOfBirthdate() {
      return moment(this.animalData.birthdate).startOf('day')
    },

    existingTags() {
      let tagList = this.animalsList.flatMap(animal => animal.tags || [])
      const result = []
      const map = new Map()

      for(const item of tagList) {
        if(!map.has(item)) {
          map.set(item, true)
          result.push({ text: item })
        }
      }

      return result
    },

    tags() {
      return this.animalData.tags.map((tag) => {
        return {
          text: tag,
          style: `background-color: ${this.randomColor(tag)}`,
        }
      })
    },
  },

  methods: {
    allowedBirthdates(val) {
      return moment(val, 'YYYY-MM-DD') <= this.today
    },

    allowedArrivals(val) {
      return moment(val, 'YYYY-MM-DD') >= this.startOfBirthdate
    },

    submit() {
      this.submitting = true
      if(this.$refs.form.validate() && this.uuid) {
        if(this.imageChanged && this.animalImage) {
          let fileName = `${this.animalData.name}${moment().format('DDMMYYYYkkmmss')}`
          let avatarName = `user/${this.uuid}/${encodeURI(fileName)}.png`
          let storageRef = this.$firebase.storage().ref().child(avatarName)

          this.animalData.image = avatarName
          this.animalData.thumbnail = ''
          this.animalData.thumbnailFetchAttempts = 0

          this.animalImage.toBlob((blob) => {
            storageRef.put(blob).then(() => {
              this.cleanUpOldImages()
              this.saveAnimalData()
            })
          })
        } else {
          this.saveAnimalData()
        }
      } else {
        this.submitting = false
      }
    },

    saveAnimalData() {
      let collection = this.$firebase
        .firestore()
        .collection('users')
        .doc(this.uuid)
        .collection('animals')

      if(!this.confirmSex) {
        this.animalData.sexConfirmed = false
      }

      let action = (this.animal && this.animal.id)
        ? collection.doc(this.animal.id).update(this.animalData)
        : collection.add(this.animalData)

      action.then(() => this.submitDone())
    },

    cleanUpOldImages() {
      if(this.animal && this.animal.image) {
        try {
          let thumbnail = this.getThumbnailFromImage(this.animal.image)

          this.$firebase.storage().ref(this.animal.image).delete()
          if(thumbnail) {
            this.$firebase.storage().ref(thumbnail).delete()
          }
        } catch(e) {}
      }
    },

    submitDone() {
      this.submitting = false
      this.$router.back()
    },

    uploadImage() {
      this.$refs.input.click()
    },

    setImage(e) {
      const file = e.target.files[0]
      if(file.type.indexOf('image/') === -1) {
        alert('Please select an image file')
        return
      }
      if(typeof FileReader === 'function') {
        const reader = new FileReader()
        reader.onload = (event) => {
          this.tempImage = event.target.result
          // rebuild cropperjs with the updated source
          this.$refs.cropper.replace(event.target.result)
        }
        reader.readAsDataURL(file)
        this.cropDialog = true
      } else {
        alert('Sorry, FileReader API not supported')
      }
    },

    cropImage() {
      this.animalImage = this.$refs.cropper.getCroppedCanvas({
        width: 300,
        height: 300,
      })
      this.animalImageUrl = this.animalImage.toDataURL()
      this.imageChanged = true
      this.cropDialog = false
    },

    updateTags(newTags) {
      this.animalData.tags = newTags.map(tag => tag.text)
    },
  },
}
</script>

<template>
  <v-form
    class="animal-form general-form"
    ref="form"
    @submit.prevent="submit"
  >
    <v-dialog
      :value="cropDialog"
      light
      content-class="image-croppper-dialog"
      @input="cropDialog = $event"
    >
      <v-card>
        <v-card-text>
          <div class="img-cropper">
            <vue-cropper
              ref="cropper"
              :aspect-ratio="1"
              :src="tempImage"
              :center="false"
              :auto-crop-area="1"
            />
          </div>
        </v-card-text>

        <v-card-actions>
          <v-btn
            text
            color="#b6b6b6"
            @click="cropDialog = false"
          >
            Cancel
          </v-btn>

          <div class="flex-grow-1"></div>

          <v-btn
            text
            color="primary"
            @click="cropImage"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <div class="animal-avatar-select" @click="uploadImage">
      <img
        v-if="animalImageUrl && animalImageUrl.length"
        :src="animalImageUrl"
        alt="Cropped Image"
      />
      <div v-else class="animal-avatar_holder">
        <span class="animal-avatar_holder--text">
          No Image
        </span>
      </div>

      <div class="animal-avatar-select--hover">
        Upload Image
      </div>

      <input
        ref="input"
        class="image-file-input"
        type="file"
        name="image"
        accept="image/*"
        @change="setImage"
      />
    </div>

    <v-text-field
      v-model="animalData.name"
      label="Name"
      hint="Name of the animal"
      :rules="[
        v => !!v || 'Name is required',
        v => (v && v.length <= 30) || 'Name must be less than 30 characters',
      ]"
      counter="30"
      required
    />

    <v-text-field
      v-model="animalData.species"
      label="Species"
      hint="The animal's species"
      :rules="[
        v => !!v || 'Species is required',
        v => (v && v.length <= 50) || 'Species must be less than 50 characters',
      ]"
      counter="50"
      required
    />

    <v-input class="special-input">
      <template v-slot:label>
        <div class="special-input_label">
          Sex
        </div>
      </template>

      <div class="selection-display">
        <v-item-group
          v-model="sexValue"
          class="sex-selection"
          mandatory
        >
          <v-item
            v-for="(options, key) in sexOptions"
            :key="key"
            v-slot:default="{ active, toggle }"
          >
            <v-btn
              icon
              large
              :color="options.color"
              :class="{ active }"
              :value="key"
              @click="toggle"
            >
              <v-icon
                :size="options.size"
              >
                {{ options.icon }}
              </v-icon>
            </v-btn>
          </v-item>
        </v-item-group>

        <v-switch
          v-if="confirmSex"
          v-model="animalData.sexConfirmed"
          class="sex-confirmed-switch"
          label="Confirmed"
          hide-details
          dense
        />
      </div>
    </v-input>

    <v-text-field
      v-model="animalData.morph"
      label="Morph"
      hint="The animal's morph"
    />

    <v-text-field
      v-model="animalData.feedingDuration"
      type="number"
      min="1"
      label="Feeding Duration"
      hint="How often the animal should be fed (optional)"
      :rules="[
        v => (!v || v >= 1) || 'Feeding duration must be at least 1'
      ]"
    />

    <date-time-input
      v-model="animalData.birthdate"
      :allowed-dates="allowedBirthdates"
      exclude-time
      label="Birthdate"
      hint="Date the animal was born/hatched"
    />

    <date-time-input
      v-model="animalData.arrival"
      :allowed-dates="allowedArrivals"
      exclude-time
      label="Arrival Date"
      hint="Date the animal was obtained"
    />

    <v-input class="special-input">
      <template v-slot:label>
        <div class="special-input_label">
          Tags
        </div>
        <div class="v-messages theme--light">
          <div class="v-messages__message">
            Add custom tags for this animal
          </div>
        </div>
      </template>

      <tags-input
        v-model="tagValue"
        :tags="tags"
        :autocomplete-items="existingTags"
        @tags-changed="updateTags"
      />
    </v-input>

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
        @click="submit"
      >
        Submit
      </v-btn>
    </div>
  </v-form>
</template>

<style scoped>
  .sex-selection button {
    margin-left: 12px;
  }

  .sex-selection button.active:before {
    opacity: 1 !important;
  }

  .sex-selection button.active i {
    color: #ffffff;
  }

  .sex-selection button:first-child.active i.theme--dark {
    color: #333333;
  }

  .sex-confirmed-switch {
    margin: 0;
    padding: 0;
    margin-left: 32px;
  }

  .vue-tags-input {
    background-color: inherit;
  }
</style>
