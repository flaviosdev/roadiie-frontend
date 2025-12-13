<template>
  <transition name="slide-in">
    <div v-if="show" class="fixed inset-0 z-50 flex bg-black/40">
      <div class="flex-1" @click="close"></div>
      <div class="w-full max-w-2xl bg-white h-full shadow-xl p-6 overflow-y-auto">
        <slot />
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits(['close'])

function close() {
  emit('close')
}
</script>
<style scoped>
.slide-in-enter-active, .slide-in-leave-active {
  transition: transform 0.25s ease;
}

.slide-in-enter-from, .slide-in-leave-to {
  transform: translateX(0);
}
</style>
