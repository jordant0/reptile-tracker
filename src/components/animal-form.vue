<script>
import DateTimeInput from '@/components/date-time-input'
import VueCropper from 'vue-cropperjs'
import { mapGetters } from 'vuex'

export default {
  components: {
    VueCropper,
    DateTimeInput,
  },

  props: {
    animal: {
      type: Object,
      default() {
        return {}
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
      animalData: {
        name: this.animal.name || '',
        species: this.animal.species || '',
        feedingDuration: this.animal.feedingDuration || null,
        birthdate: this.animal.birthdate ? this.animal.birthdate.toDate() : new Date(),
        arrival: this.animal.arrival ? this.animal.arrival.toDate() : new Date(),
        sex: this.animal.sex || 'unknown',
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
  },

  methods: {
    submit() {
      this.submitting = true
      if(this.$refs.form.validate() && this.uuid) {
        if(this.imageChanged && this.animalImage) {
          let avatarName = `user/${this.uuid}/${encodeURI(this.animalData.name)}.png`
          let storageRef = this.$firebase.storage().ref().child(avatarName)

          this.animalData.image = avatarName

          this.animalImage.toBlob((blob) => {
            storageRef.put(blob).then(() => {
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

      let action = (this.animal && this.animal.id)
        ? collection.doc(this.animal.id).update(this.animalData)
        : collection.add(this.animalData)

      action.then(() => this.submitDone())
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
  },
}
</script>

<template>
  <v-form
    class="animal-form general-form"
    ref="form"
    @sbmit.prevent="submit"
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
        v => (v && v.length <= 50) || 'Name must be less than 50 characters',
      ]"
      counter="50"
      required
    />

    <v-input class="special-input">
      <template v-slot:label>
        <div class="special-input_label">
          Sex
        </div>
        <div  class="v-messages theme--light">
          <div class="v-messages__message">
            The animal's sex
          </div>
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
      </div>
    </v-input>

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
      exclude-time
      label="Birthdate"
      hint="Date the animal was born/hatched"
    />

    <date-time-input
      v-model="animalData.arrival"
      exclude-time
      label="Arrival Date"
      hint="Date the animal was obtained"
    />

    <div class="form-actions">
      <v-btn
        text
        color="#b6b6b6"
        @click.prevent="$router.back()"
      >
        Cancel
      </v-btn>

      <div class="flex-grow-1" />

      <v-btn
        color="primary"
        type="submit"
        :disabled="submitting"
        :loading="submitting"
        @click.prevent="submit"
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
</style>
