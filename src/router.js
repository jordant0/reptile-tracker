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
      meta: { title: 'Animals' },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/login.vue'),
      meta: { title: 'Login / Sign-up', public: true },
    },
    {
      path: '/sign-up',
      name: 'sign-up',
      component: () => import('./views/login.vue'),
      props: { login: false },
      meta: { title: 'Login / Sign-up', public: true },
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('./views/settings.vue'),
      meta: { title: 'Settings' },
    },
    {
      path: '/archive',
      name: 'archive',
      component: AnimalListing,
      meta: { title: 'Archived Animals' },
      props: { archive: true },
    },
    {
      path: '/new',
      name: 'add-animal',
      component: () => import('./views/add-animal.vue'),
      meta: { title: 'New Animal' },
    },
    {
      path: '/:animal_id/edit',
      name: 'edit-animal',
      component: () => import('./views/edit-animal.vue'),
      meta: { title: 'Edit Animal' },
    },
    {
      path: '/:animal_id/events',
      name: 'event-listing',
      component: () => import('./views/event-listing.vue'),
      meta: { title: 'Events' },
    },
    {
      path: '/:animal_id/events/new',
      name: 'add-event',
      component: () => import('./views/add-event.vue'),
      props: (route) => ({ eventType: route.query.event_type }),
      meta: { title: 'New Event' },
    },
    {
      path: '/:animal_id/:event_id/edit',
      name: 'edit-event',
      component: () => import('./views/edit-event.vue'),
      meta: { title: 'Edit Event' },
    },
    {
      path: '/:animal_id/chart',
      name: 'chart',
      component: () => import('./views/event-chart.vue'),
      meta: { title: 'Weight Chart' },
    },
    {
      path: '/:animal_id/calendar',
      name: 'calendar',
      component: () => import('./views/event-calendar.vue'),
      meta: { title: 'Calendar' },
    },
    {
      path: '/privacy-policy',
      name: 'privacy',
      component: () => import('./views/privacy.vue'),
      meta: { title: 'Privacy Policy', public: true },
    },
  ],
})
