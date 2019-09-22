import Vue from 'vue'
import Router from 'vue-router'
import AnimalListing from './views/animal-listing.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'animals',
      component: AnimalListing,
      meta: { title: 'Animals' }
    },
    {
      path: '/new-animal',
      name: 'add-animal',
      component: () => import('./views/add-animal.vue'),
      meta: { title: 'Add Animal' }
    },
    {
      path: '/events/:animal_id',
      name: 'event-listing',
      component: () => import('./views/event-listing.vue'),
      meta: { title: 'Events' }
    }
  ]
})
