<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  show: boolean
  title?: string
  width?: string // ex: max-w-xl, max-w-2xl
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

function close() {
  emit('close')
}

function onEsc(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
}

onMounted(() => window.addEventListener('keydown', onEsc))
onUnmounted(() => window.removeEventListener('keydown', onEsc))
</script>

<template>
  <transition name="fade">
    <div v-if="show" class="fixed inset-0 z-40 flex">
      <!-- overlay -->
      <div class="fixed inset-0 bg-black/40" @click="close" />

      <!-- panel -->
      <transition name="slide">
        <div
          class="relative ml-auto h-full w-full bg-white shadow-xl z-50 flex flex-col"
          :class="width ?? 'max-w-xl'"
        >
          <!-- header -->
          <div class="flex items-center justify-between border-b px-6 py-4">
            <h2 v-if="title" class="font-semibold text-lg">
              {{ title }}
            </h2>

            <button class="text-gray-500 hover:text-gray-800 text-xl" @click="close">✕</button>
          </div>

          <!-- content -->
          <div class="flex-1 overflow-y-auto p-6">
            <slot />
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active {
  transition: transform 0.2s ease;
}
.slide-leave-active {
  transition: transform 0.15s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
