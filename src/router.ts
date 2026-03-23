import { createRouter, createWebHashHistory } from 'vue-router';
import MainTab from './tabs/MainTab.vue';
import ShowcaseTab from './tabs/ShowcaseTab.vue';
import HomeView from './views/HomeView.vue';
import ShowcaseView from './views/ShowcaseView.vue';
import CalendarTab from './tabs/CalendarTab.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: HomeView,
      children: [
        {
          path: '/',
          component: MainTab,
          meta: {
            tabIndex: 0,
          },
        },
        {
          path: '/showcase',
          component: ShowcaseTab,
          meta: {
            tabIndex: 1,
          },
        },
        {
          path: '/calendar',
          component: CalendarTab,
          meta: {
            tabIndex: 2,
          },
        },
      ],
    },
    {
      path: '/showcase/:id',
      component: ShowcaseView,
    },
    {
      path: '/home',
      redirect: '/',
    },
  ],
});

router.afterEach((to, from) => {
  if (to.meta.animation) {
    to.meta.transition = to.meta.animation;
    from.meta.transition = to.meta.animation;
    return;
  }
  if ('tabIndex' in to.meta && 'tabIndex' in from.meta) {
    const toIndex = to.meta.tabIndex!;
    const fromIndex = from.meta.tabIndex!;
    const transition = toIndex == fromIndex ? 'fade' : toIndex < fromIndex ? 'slide-right' : 'slide-left';
    from.meta.transition = transition;
    to.meta.transition = transition;
  } else {
    from.meta.transition = 'fade';
    to.meta.transition = 'fade';
  }
});

export default router;
