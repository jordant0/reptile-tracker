<script>
export default {
  props: {
    type: {
      type: String,
      default: 'card-heading, image',
    },
  },
}
</script>

<template>
  <div class="loading-skeleton">
    <v-progress-linear
      indeterminate
    />

    <slot>
      <v-skeleton-loader
        :type="type"
      />
    </slot>
  </div>
</template>
