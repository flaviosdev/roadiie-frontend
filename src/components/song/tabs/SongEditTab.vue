<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Song, SongStatus } from '@/types/song'

const props = defineProps<{
  song: Song
}>()

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
</script>

<template>
  <div class="space-y-6">

    <!-- TÍTULO -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        Título
      </label>
      <input
        v-model="song.title"
        class="w-full border rounded px-3 py-2 text-sm"
      />
    </div>

    <!-- ARTISTA + ANO -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Artista
        </label>
        <input
          v-model="song.artist"
          class="w-full border rounded px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Ano
        </label>
        <input
          type="number"
          v-model.number="song.releaseYear"
          class="w-full border rounded px-3 py-2 text-sm"
        />
      </div>
    </div>

    <!-- GÊNERO + STATUS -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Gênero
        </label>
        <input
          v-model="song.genre"
          class="w-full border rounded px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          v-model="song.status"
          class="w-full border rounded px-3 py-2 text-sm"
        >
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
      <input
        v-model="tagsString"
        class="w-full border rounded px-3 py-2 text-sm"
      />
    </div>

    <!-- LETRAS -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        Letra
      </label>
      <textarea
        v-model="song.lyrics"
        rows="5"
        class="w-full border rounded px-3 py-2 text-sm"
      />
    </div>

    <!-- HISTÓRIA -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        História
      </label>
      <textarea
        v-model="song.history"
        rows="4"
        class="w-full border rounded px-3 py-2 text-sm"
      />
    </div>

    <!-- BOTÃO -->
    <div class="pt-4 border-t">
      <button
        @click="emit('updatedSong', song)"
        class="bg-blue-600 text-white px-5 py-2 rounded text-sm hover:bg-blue-700 transition"
      >
        Salvar alterações
      </button>
    </div>

  </div>
</template>
