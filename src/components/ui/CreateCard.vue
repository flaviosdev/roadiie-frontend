<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  title: string
  subtitle: string
  placeholder: string
}>()

const emit = defineEmits<{
  (e: 'create', value: string): void
}>()

const isCreating = ref(false)
const newValue = ref('')

function submit() {
  if (!newValue.value.trim()) return

  emit('create', newValue.value.trim())

  newValue.value = ''
  isCreating.value = false
}

function cancelIfEmpty() {
  if (!newValue.value.trim()) {
    isCreating.value = false
  }
}
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 transition-all duration-150">
    <!-- NORMAL -->
    <div
      v-if="!isCreating"
      class="cursor-pointer hover:shadow-md hover:border-gray-300"
      @click="isCreating = true"
    >
      <div class="text-lg font-bold text-gray-900 leading-tight">+ {{ title }}</div>
      <div class="text-sm text-gray-600 mt-0.5">
        {{ subtitle }}
      </div>
    </div>

    <!-- INPUT -->
    <div v-else>
      <input
        v-model="newValue"
        type="text"
        :placeholder="placeholder"
        class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
        @keyup.enter="submit"
        @blur="cancelIfEmpty"
        autofocus
      />
    </div>
  </div>
</template>
