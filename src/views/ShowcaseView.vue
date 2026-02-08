<script setup lang="ts">
import type BaseShowcase from '@/showcase/BaseShowcase';
import type GroupedShowcase from '@/showcase/GroupedShowcase';
import { getShowcases } from '@/showcase/loader';
import NotFoundShowcase from '@/showcase/NotFoundShowcase';
import { computed, defineAsyncComponent, onMounted, onUnmounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const showcaseList = ref<Map<string, BaseShowcase>>();
getShowcases().then((loaded) => (showcaseList.value = loaded.map));

const showcaseId = computed(() => route.params.id as string);

const current = computed(() => {
  return showcaseList.value?.get(showcaseId.value);
});

function onKeyDown(e: KeyboardEvent) {
  if (e.key == 'Escape') {
    router.back();
  }
}

onMounted(() => document.addEventListener('keydown', onKeyDown));
onUnmounted(() => document.removeEventListener('keydown', onKeyDown));
</script>

<template>
  <div class="container" v-if="current ?? NotFoundShowcase" :key="showcaseId">
    <nav>
      <h1>{{ (current ?? NotFoundShowcase).metadata.name }}</h1>
      <button id="close-button"><span @click="router.back()" class="material-symbols-outlined"> close </span></button>
    </nav>
    <div class="showcase-view">
      <component
        :is="defineAsyncComponent((current ?? NotFoundShowcase).getComponent())"
        :showcase="current ?? NotFoundShowcase"
      />
    </div>
  </div>
</template>

<style scoped lang="css">
.container {
  position: absolute;
  display: grid;
  justify-content: center;
  grid-template-rows: repeat(2, 1fr);
  width: 100vw;
  height: 100vh;
}

nav {
  display: flex;
  align-items: center;
  gap: 24px;
  font-size: 1.5em;
}

nav h1 {
  flex-grow: 1;
}

#close-button {
  font-size: 0.75em;
}

a,
button {
  background-color: var(--color-5);
  border-radius: 8px;
  padding: 0;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1 / 1;
  color: var(--black-2);
  transition: 100ms ease-out;

  &:hover {
    transform: scale(1.02);
    background-color: var(--color-4);
    color: var(--black-1);
  }
}

span {
  font-size: 3em;
  user-select: none;
}

.showcase-view {
  width: min(80vw, 800px);
}
</style>
