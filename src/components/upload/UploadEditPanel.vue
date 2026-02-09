<template>
  <transition name="slide-in">
    <div v-if="show" class="fixed inset-0 z-50 flex bg-black/40">
      <div class="flex-1" @click="close"></div>

      <div class="relative w-full max-w-2xl bg-white h-full shadow-xl overflow-y-auto">
              <div class="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
          <h2 class="font-semibold text-gray-700">Upload</h2>

                <button
                  @click="close"
                  class="rounded-md p-2 hover:bg-gray-100 transition"
                  aria-label="Close panel"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5"
                       fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round"
                          stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
        </div>
        <div class="p-6">
        <slot />
        </div>

      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'


const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits(['close'])

onMounted(() => window.addEventListener('keydown', handleEsc))
onUnmounted(() => window.removeEventListener('keydown', handleEsc))

function handleEsc(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
}

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
