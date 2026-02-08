<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue'
import type { Upload } from '@/types/upload.ts'
import { useMusicApi } from '@/composables/useMusicApi.ts'
import { useUploadApi } from '@/composables/useUploadApi.ts'
import MusicSelector from '@/components/MusicSelector.vue'
import type { Music } from '@/types/music.ts'

const props = defineProps<{
  modelValue: Upload | null
}>()

const { searchMusic, createMusic, findMusicById } = useMusicApi()
const { updateUpload } = useUploadApi()

const emit = defineEmits<{
  (e: 'update:modelValue', value: Upload | null): void
  (e: 'saved'): void
  (e: 'updated'): void
  (e: 'cancelled'): void
}>()

const id = ref<string | null>(null)
const music = ref<Music | null>(null)
const title = ref('')
const description = ref('')
const platform = ref('')
const platformId = ref('')
const uploadUrl = ref('')
const status = ref('')
const uploadTagsString = ref('')
const uploadedAtString = ref('') // ISO string for input type="datetime-local"

const musicQueryResults = ref<Music[]>([])
const musicLoading = ref(false)

watch(
  () => props.modelValue,
  async (value) => {
    if (value) {
      id.value = value.id ?? null

      if (value.musicId) {
        const m = await findMusicById(value.musicId)
        music.value = m
      }
      title.value = value.title ?? ''
      description.value = value.description ?? ''
      platformId.value = value.platformId ?? ''
      uploadUrl.value = value.videoId ?? ''
      status.value = value.status ?? ''
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
  title.value = ''
  description.value = ''
  platformId.value = ''
  uploadUrl.value = ''
  uploadTagsString.value = ''
  uploadedAtString.value = ''
}

const onSearchMusic = async (q: string) => {
  if (q == '') musicQueryResults.value = []
  musicLoading.value = true
  const { data } = await searchMusic(q)
  musicQueryResults.value = data || []
  musicLoading.value = false
}

function isImported() {
  console.log(status.value)
  return status.value === 'IMPORTED'
}

const onCreateMusic = async (q: string) => {
  const payload: Music = { title: q }
  const resp = await createMusic(payload)

  music.value = resp
  musicQueryResults.value.push(resp)
}

const onGetMusicById = async (id: string) => {
  const musicResponse = await findMusicById(id)
  music.value = musicResponse
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
      musicId: music.value.id,
      title: title.value,
      platform: platform.value,
      platformId: platformId.value,
      videoId: uploadUrl.value,
      uploadTags,
      uploadedAt: uploadedAt ?? new Date(),
    }

    const updated = await updateUpload(id.value, payload)
    emit('updated', updated)
  } catch (err) {
    console.error('Erro ao salvar upload:', err)
  }
}

</script>

<template>
  <div class="space-y-4">
    <h2 class="text-xl font-semibold">
      {{ id ? 'Edit Upload' : 'Create Upload' }}
    </h2>

      <label class="block text-sm font-medium">Uploads imported via API can not be edited.</label>

    <div class="grid grid-cols-1 gap-3">
      <div>
        <label class="block text-sm font-medium">Música</label>
      </div>
      <MusicSelector
        v-model="music"
        :items="musicQueryResults"
        :loading="musicLoading"
        @search="onSearchMusic"
        @create="onCreateMusic"
        @get-by-id="onGetMusicById"
      />

      <div>
        <label class="block text-sm font-medium">Title</label>
        <input :readonly="isImported()" v-model="title" type="text" class="border rounded w-full p-2" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1"> Description </label>

        <textarea
          v-model="description"
          :readonly="isImported()"
          rows="6"
          class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-y"
          placeholder="Write a detailed description..."
        ></textarea>
      </div>

      <div>
        <label class="block text-sm font-medium">Platform ID</label>
        <input :readonly="isImported()" v-model="platformId" type="text" class="border rounded w-full p-2" />
      </div>

      <div>
        <label class="block text-sm font-medium">Upload URL</label>
        <input :readonly="isImported()" v-model="uploadUrl" type="url" class="border rounded w-full p-2" />
      </div>

      <div>
        <label class="block text-sm font-medium">Upload Tags</label>
        <input :readonly="isImported()" v-model="uploadTagsString" type="text" class="border rounded w-full p-2" />
      </div>

      <div>
        <label class="block text-sm font-medium">Uploaded At</label>
        <input :readonly="isImported()" v-model="uploadedAtString" type="datetime-local" class="border rounded w-full p-2" />
      </div>
    </div>

    <div class="flex gap-2 mt-2">
      <button :readonly="isImported()" @click="save" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        {{ id ? 'Update' : 'Create' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
/* opcional */
</style>
