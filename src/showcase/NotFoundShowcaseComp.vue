<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

function returnToList() {
  router.push('/showcase');
}
</script>

<template>
  <h1>404 Not Found</h1>
  <button class="element-border" @click="returnToList()">一覧に戻る</button>
</template>
