import Vue from 'vue'
import VueRouter from 'vue-router'
import Welcome from "../views/Welcome";
import ImageView from "../views/ImageView";

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Welcome',
    component: Welcome
  },
  {
    path: '/editor',
    name: 'ImageView',
    component: ImageView
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router
