<script setup>
import { useRoute } from 'vue-router';
const route = useRoute();
</script>

<template>
  <MusicForm mode="edit" :id="route.params.id" />
</template>
