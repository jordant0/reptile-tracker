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
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/about.vue')
    }
  ]
})
