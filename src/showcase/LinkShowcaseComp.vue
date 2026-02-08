<script setup lang="ts">
import { onMounted } from 'vue';
import type LinkShowcase from './LinkShowcase';

const props = defineProps<{
  showcase: LinkShowcase;
}>();

onMounted(() => {
  window.location.href = props.showcase.href;
});
</script>
