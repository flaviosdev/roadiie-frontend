<script setup lang="ts">
import BaseCard from '@/components/ui/BaseCard.vue'
import type { Setlist } from '@/types/setlist.ts'
import { ref } from 'vue'

const props = defineProps<{
  setlist: Setlist
}>()

const emit = defineEmits<{
  (e: 'setlistUpdated', value: Setlist): void
  (e: 'selectSetlist', value: string): void
}>()

const isEditingSetlist = ref(false)
</script>
<template>
  <BaseCard clickable @click="$emit('selectSetlist', setlist.id)">
    <!-- body -->

    <template #meta>
      <div class="text-lg font-bold text-gray-900 leading-tight">
        {{ setlist.title }}
      </div>
    </template>

    <div class="mt-2">
      <div class="text-sm text-gray-600 mt-0.5">
        {{ setlist.purpose ?? '' }}
      </div>
    </div>

    <template #footer>
      <div class="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600"></div>
    </template>
  </BaseCard>
</template>
