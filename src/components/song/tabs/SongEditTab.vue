<script setup lang="ts">
import { computed, reactive, ref, toRaw, watch } from 'vue'
import type { Song } from '@/types/song'

const props = defineProps<{
  song: Song
}>()

const originalSong = ref<Song>()
const editableSong = reactive<Song>({ ...props.song })

watch(
  () => props.song,
  (newSong: Song) => {
    if (!newSong) return

    const clone = JSON.parse(JSON.stringify(newSong))

    originalSong.value = clone
    Object.assign(editableSong, clone)
  },
  { immediate: true },
)

const emit = defineEmits<{
  (e: 'updatedSong', value: Song): void
}>()

const tagsString = computed({
  get: () => (props.song.tags ?? []).join(', '),
  set: (value: string) => {
    props.song.tags = value
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
  },
})

function buildPatchObject<T extends Record<string, any>>(original: T, edited: T): Partial<T> {
  const patch: Partial<T> = {}
  Object.keys(edited).forEach((key) => {
    if (key === 'id') return
    const k = key as keyof T

    if (JSON.stringify(original[k]) !== JSON.stringify(edited[k])) {
      patch[k] = edited[k]
    }
  })

  return patch
}

function handleClick() {
  if (!originalSong.value) return

  const patch = buildPatchObject(originalSong.value, editableSong)

  if (Object.keys(patch).length === 0) return

  emit('updatedSong', <Song> {
    id: editableSong.id,
    ...patch
  })
}
</script>

<template>
  <div class="space-y-6">
    <!-- TÍTULO -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1"> Título </label>
      <input v-model="editableSong.title" class="w-full border rounded px-3 py-2 text-sm" />
    </div>

    <!-- ARTISTA + ANO -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1"> Artista </label>
        <input v-model="editableSong.artist" class="w-full border rounded px-3 py-2 text-sm" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1"> Ano </label>
        <input
          type="number"
          v-model.number="editableSong.releaseYear"
          class="w-full border rounded px-3 py-2 text-sm"
        />
      </div>
    </div>

    <!-- GÊNERO + STATUS -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1"> Gênero </label>
        <input v-model="editableSong.genre" class="w-full border rounded px-3 py-2 text-sm" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1"> Status </label>
        <select v-model="editableSong.status" class="w-full border rounded px-3 py-2 text-sm">
          <option value="DRAFT">DRAFT</option>
          <option value="BACKLOG">BACKLOG</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="REHEARSING">REHEARSING</option>
          <option value="RECORDED">RECORDED</option>
          <option value="PRODUCED">PRODUCED</option>
          <option value="READY">READY</option>
          <option value="PUBLISHED">PUBLISHED</option>
        </select>
      </div>
    </div>

    <!-- TAGS -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        Tags (separadas por vírgula)
      </label>
      <input v-model="tagsString" class="w-full border rounded px-3 py-2 text-sm" />
    </div>

    <!-- LETRAS -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1"> Letra </label>
      <textarea
        v-model="editableSong.lyrics"
        rows="5"
        class="w-full border rounded px-3 py-2 text-sm"
      />
    </div>

    <!-- HISTÓRIA -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1"> História </label>
      <textarea
        v-model="editableSong.history"
        rows="4"
        class="w-full border rounded px-3 py-2 text-sm"
      />
    </div>

    <!-- BOTÃO -->
    <div class="pt-4 border-t">
      <button
        @click="handleClick"
        class="bg-blue-600 text-white px-5 py-2 rounded text-sm hover:bg-blue-700 transition"
      >
        Salvar alterações
      </button>
    </div>
  </div>
</template>
