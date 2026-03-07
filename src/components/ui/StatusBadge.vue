<script setup lang="ts">
import { ref, watch } from 'vue'

type StatusMap<T extends string> = Record<T, string>

const props = defineProps<{
  modelValue: string
  statuses: string[]
  labels: StatusMap<string>
  classes: StatusMap<string>
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const isEditing = ref(false)
const localStatus = ref(props.modelValue)

watch(
  () => props.modelValue,
  (v) => {
    localStatus.value = v
  },
)

function save() {
  isEditing.value = false
  emit('update:modelValue', localStatus.value)
}
</script>

<template>
  <div class="mt-2">
    <!-- badge -->
    <span
      v-if="!isEditing"
      @click.stop="isEditing = true"
      :class="[
        'inline-flex items-center px-2 py-1 text-xs font-medium rounded cursor-pointer transition',
        classes[modelValue],
      ]"
    >
      {{ labels[modelValue] }}
    </span>

    <!-- select -->
    <select
      v-else
      v-model="localStatus"
      @blur="save"
      @change="save"
      class="text-xs border rounded px-2 py-1"
    >
      <option v-for="status in statuses" :key="status" :value="status">
        {{ labels[status] }}
      </option>
    </select>
  </div>
</template>
