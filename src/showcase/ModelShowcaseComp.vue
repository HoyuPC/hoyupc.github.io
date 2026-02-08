<script setup lang="ts">
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { onMounted, onUnmounted, ref } from 'vue';
import type ModelShowcase from './ModelShowcase';

const props = defineProps<{
  showcase: ModelShowcase;
}>();

const modelContainer = ref<HTMLDivElement>();

let renderer: THREE.WebGLRenderer;

onMounted(() => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  renderer = new THREE.WebGLRenderer({ alpha: false });
  modelContainer.value!.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.update();

  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  scene.add(directionalLight);

  const cameraDirectionalLight = new THREE.DirectionalLight(0xffffff, 0.75);
  scene.add(cameraDirectionalLight);

  camera.position.z = 5;

  load(props.showcase.modelSrc);

  function load(modelSrc: string) {
    const loader = new GLTFLoader();
    loader.load(
      modelSrc,
      (glft) => scene.add(glft.scene),
      undefined,
      (error) => {
        console.error(error);
        load('./showcase/default_model.glb');
      },
    );
  }

  function draw() {
    camera.aspect = modelContainer.value!.clientWidth / modelContainer.value!.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(modelContainer.value!.clientWidth, modelContainer.value!.clientHeight);
    renderer.setClearColor(props.showcase.clearColor);

    cameraDirectionalLight.position.copy(camera.position);
    controls.update();
    renderer.render(scene, camera);
  }
  renderer.setAnimationLoop(draw);
});

onUnmounted(() => {
  renderer.setAnimationLoop(null);
  renderer.dispose();
});
</script>

<template>
  <div class="model-container" ref="modelContainer"></div>
</template>

<style scoped lang="css">
.model-container {
  display: grid;
  place-items: center;
  width: 100%;
  height: calc(100vh - 120px);
  max-height: calc(100vw);
}
</style>
