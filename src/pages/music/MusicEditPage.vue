<script setup>
import { useRoute } from 'vue-router';
import MusicForm from '@/components/MusicForm.vue'
const route = useRoute();
</script>

<template>
  <MusicForm mode="edit" :id="route.params.id"  modelValue=""/>
</template>
