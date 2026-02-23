<script setup lang="ts">
import ShowcasePreview from '@/components/ShowcasePreview.vue';
import type BaseShowcase from '@/showcase/BaseShowcase';
import { getShowcases } from '@/showcase/loader';
import { ref } from 'vue';

const showcaseList = ref<BaseShowcase[]>([]);
getShowcases().then(
  (loaded) =>
    (showcaseList.value = loaded.list
      .slice()
      .reverse()
      .filter((s) => s.metadata.status !== 'hidden')),
);
</script>

<template>
  <div class="showcase-container">
    <ShowcasePreview v-for="showcase in showcaseList" :id="showcase.metadata.id" :showcase="showcase" />
  </div>
</template>

<style scoped lang="css">
.info {
  text-align: left;
  margin-bottom: 24px;
}

.showcase-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

@media screen and (max-width: 600px) {
  .showcase-container {
    grid-template-columns: 1fr;
  }
}
</style>
