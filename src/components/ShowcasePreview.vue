<script setup lang="ts">
import BaseShowcase from '@/showcase/BaseShowcase';
import GroupedShowcase from '@/showcase/GroupedShowcase';
import LinkShowcase from '@/showcase/LinkShowcase';
import utils from '@/showcase/util';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps<{
  id: string;
  showcase: BaseShowcase;
}>();

const groupedPopup = ref<HTMLDialogElement>();

const router = useRouter();

function onClick(showcase: BaseShowcase) {
  if (showcase instanceof LinkShowcase) {
    window.open(showcase.href, '_blank')?.focus();
  } else if (showcase instanceof GroupedShowcase) {
    groupedPopup.value!.showModal();
  } else {
    router.push(`/showcase/${showcase.metadata.id}`);
  }
}
</script>

<template>
  <div>
    <h3>{{ showcase.metadata.name }}</h3>
    <div class="container" @click="onClick(showcase)">
      <img alt="" :src="showcase.metadata.thumbnailSrc" fetchpriority="low" loading="lazy" />

      <!-- Type (top-left) -->
      <span id="type" class="overlay material-symbols-outlined">{{
        utils.getMaterialIcon(showcase.metadata.icon)
      }}</span>

      <!-- Flags (top-right) -->
      <div v-if="showcase.metadata.flags.length > 0" id="flags" class="overlay">
        <span v-for="flag in showcase.metadata.flags" class="material-symbols-outlined">{{
          utils.getIconForFlag(flag)
        }}</span>
      </div>

      <!-- Tags (bottom-left) -->
      <div v-if="showcase.metadata.tags.length > 0" id="tags" class="overlay">
        <span v-for="tag in showcase.metadata.tags"># {{ utils.getTagDisplayName(tag) }}</span>
      </div>

      <!-- Version (bottom-right) -->
      <div v-if="showcase.metadata.version" id="version" class="overlay">
        <span>v{{ showcase.metadata.version }}</span>
      </div>
    </div>
  </div>

  <dialog ref="groupedPopup" class="element-border" v-if="showcase instanceof GroupedShowcase">
    <p class="parent-name">{{ showcase.metadata.name }}</p>
    <div class="child hover-effects element-border" v-for="child in showcase.children" @click="onClick(child)">
      <p>{{ child.metadata.name }}</p>
      <div v-if="child.metadata.flags.length > 0 || child.metadata.version" id="child-flags">
        <span v-for="flag in child.metadata.flags" class="material-symbols-outlined">{{
          utils.getIconForFlag(flag)
        }}</span>
        <span v-if="child.metadata.version">v{{ child.metadata.version }}</span>
      </div>
    </div>
    <button class="element-border grouped-close" @click="groupedPopup!.close()">閉じる</button>
  </dialog>
</template>

<style scoped lang="css">
.container {
  position: relative;
  margin-top: 0;

  &:hover {
    transform: scale(1.005);
  }
}

img {
  aspect-ratio: 4 / 3;
  object-fit: cover;
  margin: 0;
  padding: 0;
  cursor: pointer;
  transition: 150ms;

  &:hover {
    box-shadow: 0 0 12px var(--color-1);
  }
}

.overlay {
  pointer-events: none;
  border-radius: 4px;
}

span {
  padding: 2px;
  margin: 2px;
  user-select: none;
  pointer-events: none;
  font-size: 1.75em;
  background-color: rgba(255, 255, 255, 0.75);
  box-shadow: 0 0 2px rgba(255, 255, 255, 0.75);
  border-radius: 4px;
}

#type {
  position: absolute;
  left: 8px;
  top: 8px;
}

#flags {
  position: absolute;
  right: 8px;
  top: 8px;
}

#tags {
  position: absolute;
  left: 8px;
  bottom: 16px;

  font-size: 0.55em;
}

#version {
  position: absolute;
  right: 8px;
  bottom: 16px;

  font-size: 0.55em;
}

dialog {
  min-width: min(300px, 80vw);
}

.parent-name {
  font-size: 2em;
  margin-bottom: 8px;
}

.child {
  display: flex;
  cursor: pointer;
  user-select: none;
  padding: 8px;

  p {
    flex-grow: 1;
  }
}

#child-flags {
  margin-left: 8px;
}

#child-flags span {
  background-color: rgba(240, 240, 240, 0.75);
  box-shadow: 0 0 2px rgba(255, 255, 255, 0.75);
}

.grouped-close {
  margin: 0 !important;
}
</style>
