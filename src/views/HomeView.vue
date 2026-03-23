<script setup lang="ts">
import Footer from '@/components/Footer.vue';
import { RouterLink, RouterView } from 'vue-router';

const routes: RouteLinks = {
  '/': 'ホーム',
  '/showcase': '作品紹介',
  '/calendar': '活動予定',
};

type RouteLinks = {
  [key: string]: string;
};
</script>

<template>
  <div class="title-container">
    <div class="title">
      <h2>朋優学院高等学校</h2>
      <h1>パソコン部</h1>
    </div>

    <nav>
      <RouterLink v-for="(name, route) of routes" :to="`${route}`" class="tablink" exact-active-class="active">
        <p>{{ name }}</p>
      </RouterLink>
    </nav>
  </div>

  <RouterView v-slot="{ Component, route }">
    <Transition :name="(route.meta.transition as string) || 'fade'" :duration="{ leave: 200, enter: 400 }">
      <main class="tab-container" :key="route.path">
        <div class="tab-view">
          <component :is="Component" />
        </div>
        <Footer></Footer>
      </main>
    </Transition>
  </RouterView>
</template>

<style lang="css">
:root {
  --title-background: rgb(210, 210, 210, 0.5);
}
</style>

<style scoped lang="css">
.title-container {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  box-shadow: 0 0 8px var(--color-2);
}

.title-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('/assets/background.webp');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  z-index: -1;
  filter: blur(1px);
}

.title {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
  background-color: var(--title-background);
  color: black;

  h1 {
    font-size: 6em;
    animation: titleFadeIn 1s;
    animation-delay: 100ms;
    animation-fill-mode: both;
  }

  h2 {
    font-size: 2.5em;
    animation: titleFadeIn 1.1s;
    animation-fill-mode: both;
  }
}

.tab-container {
  position: relative;
  min-width: 100vw;
  min-height: calc(100vh - 16px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
}

.tab-view {
  width: min(80vw, 800px);
}

nav {
  display: flex;
  justify-content: center;
  overflow: auto hidden;
  gap: 4px;
  background: linear-gradient(var(--title-background), var(--color-5));
  border-bottom: 2px solid var(--color-1);
  padding: 4px;
  padding-bottom: 0;
}

.tablink {
  flex-shrink: 0;
  border: 2px solid var(--color-3);
  border-radius: 6px;
  cursor: pointer;
  color: inherit;
  background-color: var(--color-6);
  text-decoration: none;
  font-size: 1.5em;
  padding: 8px;
  transform: translateY(-4px);
  transition: all 400ms ease-out;
  filter: opacity(75%);
  animation: fadeIn 1.5s;
  animation-fill-mode: both;

  &:hover {
    border-color: var(--color-2);
  }

  &.active {
    border-color: var(--color-1);
    filter: opacity(100%);
    transform: translateY(2px);
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  &:focus-visible {
    outline: 4px auto var(--black-1);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes titleFadeIn {
  from {
    transform: translateY(-10px);
    opacity: 0;
  }
  to {
    transform: none;
    opacity: 1;
  }
}

@media screen and (max-width: 600px) {
  .title h1 {
    font-size: 4em;
  }

  .tab a {
    font-size: 1.25em;
  }
}
</style>
