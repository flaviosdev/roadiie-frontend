<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue'
import type { Upload } from '@/types/upload'
import { useMusicApi } from '@/composables/useMusicApi.ts'
import MusicSelector from '@/components/MusicSelector.vue'
import type { Music } from '@/types/music.ts'

const props = defineProps<{
  modelValue: Upload | null
}>()

const { searchMusic, createMusic } = useMusicApi()

const emit = defineEmits<{
  (e: 'update:modelValue', value: Upload | null): void
  (e: 'saved'): void
  (e: 'cancelled'): void
}>()

const id = ref<string | null>(null)
const musicId = ref('')
const title = ref('')
const platform = ref('')
const platformId = ref('')
const uploadUrl = ref('')
const uploadTagsString = ref('')
const uploadedAtString = ref('') // ISO string for input type="datetime-local"

const musicQueryResults = ref<Music[]>([])
const musicLoading = ref(false)

watch(
  () => props.modelValue,
  (value) => {
    if (value) {
      id.value = value.id ?? null
      musicId.value = value.musicId ?? ''
      title.value = value.title ?? ''
      platformId.value = value.platformId ?? ''
      uploadUrl.value = value.videoId ?? ''
      uploadTagsString.value = (value.uploadTags ?? []).join(', ')
      uploadedAtString.value = value.uploadedAt ? toInputDateTime(value.uploadedAt) : ''
    } else {
      reset()
    }
  },
  { immediate: true },
)

function reset() {
  id.value = null
  musicId.value = ''
  title.value = ''
  platformId.value = ''
  uploadUrl.value = ''
  uploadTagsString.value = ''
  uploadedAtString.value = ''
}

const onSearchMusic = async (q: string) => {
  musicLoading.value = true
  const { data } = await searchMusic(q)
  musicQueryResults.value = data || []
  musicLoading.value = false
}

const onCreateMusic = async (q: string) => {
  const payload: Music = { title: q }
  const resp = await createMusic(payload)
  const newMusic = resp.data as Music

  musicId.value = newMusic.id
  musicQueryResults.value.push(newMusic)
}

function clearItems() {

}

function toInputDateTime(d: string | Date) {
  const date = typeof d === 'string' ? new Date(d) : d
  // returns "YYYY-MM-DDTHH:MM" format for datetime-local
  const pad = (n: number) => String(n).padStart(2, '0')
  const yyyy = date.getFullYear()
  const mm = pad(date.getMonth() + 1)
  const dd = pad(date.getDate())
  const hh = pad(date.getHours())
  const mi = pad(date.getMinutes())
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`
}

function fromInputDateTime(s: string) {
  if (!s) return null
  return new Date(s)
}

async function save() {
  try {
    const uploadTags = uploadTagsString.value
      .split(',')
      .map((ut) => ut.trim())
      .filter((ut) => ut.length > 0)

    const uploadedAt = fromInputDateTime(uploadedAtString.value)
    const payload: Upload = {
      id: id.value ?? undefined,
      musicId: musicId.value,
      title: title.value,
      platform: platform.value,
      platformId: platformId.value,
      videoId: uploadUrl.value,
      uploadTags,
      uploadedAt: uploadedAt ?? new Date(),
    }

    emit('update:modelValue', payload)
    emit('saved')
    reset()
  } catch (err) {
    console.error('Erro ao salvar upload:', err)
  }
}

function cancel() {
  emit('cancelled')
}
</script>

<template>
  <div class="p-4 border rounded-lg bg-white shadow-sm space-y-4">
    <h2 class="text-xl font-semibold">{{ id ? 'Edit Upload' : 'Create Upload' }}</h2>

    <div class="grid grid-cols-1 gap-3">
      <MusicSelector
        v-model="musicId"
        :items="musicQueryResults"
        :loading="musicLoading"
        @search="onSearchMusic"
        @create="onCreateMusic"
      />

      <div>
        <label class="block text-sm font-medium">Title</label>
        <input v-model="title" type="text" class="border rounded w-full p-2" />
      </div>

      <div>
        <label class="block text-sm font-medium">Platform</label>
        <input v-model="platform" type="text" class="border rounded w-full p-2" />
      </div>

      <div>
        <label class="block text-sm font-medium">Platform ID</label>
        <input v-model="platformId" type="text" class="border rounded w-full p-2" />
      </div>

      <div>
        <label class="block text-sm font-medium">Upload URL</label>
        <input v-model="uploadUrl" type="url" class="border rounded w-full p-2" />
      </div>

      <div>
        <label class="block text-sm font-medium">Upload Type</label>
        <input v-model="uploadTagsString" type="text" class="border rounded w-full p-2" />
      </div>

      <div>
        <label class="block text-sm font-medium">Uploaded At</label>
        <input v-model="uploadedAtString" type="datetime-local" class="border rounded w-full p-2" />
      </div>
    </div>

    <div class="flex gap-2 mt-2">
      <button @click="save" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        {{ id ? 'Update' : 'Create' }}
      </button>
      <button @click="cancel" class="bg-gray-300 px-4 py-2 rounded">Cancel</button>
    </div>
  </div>
</template>

<style scoped>
/* opcional */
</style>
