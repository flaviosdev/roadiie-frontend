<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import type { Upload } from '@/types/upload.ts'
import { useUploadApi } from '@/composables/useUploadApi.ts'

interface Props {
  modelValue?: Upload | null
  onSaved?: () => void;
}
const props = defineProps<Props>()
const emit = defineEmits(['saved', 'cancelled'])

/** Form fields **/
const id = ref<string | null>(null)
const clientId = ref("")
const musicId = ref("")
const title = ref("")
const platform = ref("")
const platformId = ref("")
const uploadUrl = ref("")
const uploadType = ref("")
const uploadedAt = ref("")

watch(
  () => props.modelValue,
  (upload) => {
    if (!upload) {
      id.value = null
      clientId.value = ""
      musicId.value = ""
      title.value = ""
      platform.value = ""
      platformId.value = ""
      uploadUrl.value = ""
      uploadType.value = ""
      uploadedAt.value = ""
      return
    }

    id.value = upload.id || null
    clientId.value = upload.clientId
    musicId.value = upload.musicId
    title.value = upload.title
    platform.value = upload.platform
    platformId.value = upload.platformId
    uploadUrl.value = upload.uploadUrl
    uploadType.value = upload.uploadType
    uploadedAt.value = upload.uploadedAt ? new Date(upload.uploadedAt).toISOString().split('T')[0] : ""
  },
  { immediate: true }
);

const payload = computed(() => ({
  id: id.value || undefined,
  clientId: clientId.value || undefined,
  musicId: musicId.value || undefined,
  title: title.value || undefined,
  platform: platform.value || undefined,
  platformId: platformId.value || undefined,
  uploadUrl: uploadUrl.value || undefined,
  uploadType: uploadType.value || undefined,
  uploadedAt: uploadedAt.value ? new Date(uploadedAt.value) : new Date()
}));


const { create, update } = useUploadApi()

/**
 * Save data
 */
const save = async () => {
  if (id.value) {
    await update(id.value, payload.value);
  } else {
    await create(payload.value);
  }

  emit("saved");
};

const cancel = () => emit('cancelled')
</script>

<template>
  <div class="upload-form">
    <h2>{{ id ? 'Edit Upload' : 'New Upload' }}</h2>
    <form @submit.prevent="save">
      <label>Client ID: <input v-model="clientId" type="text" /></label>
      <label>Music ID: <input v-model="musicId" type="text" /></label>
      <label>Title: <input v-model="title" type="text" /></label>
      <label>Platform: <input v-model="platform" type="text" /></label>
      <label>Platform ID: <input v-model="platformId" type="text" /></label>
      <label>Upload URL: <input v-model="uploadUrl" type="text" /></label>
      <label>Upload Type: <input v-model="uploadType" type="text" /></label>
      <label>Uploaded At: <input v-model="uploadedAt" type="date" /></label>
      <div class="buttons">
        <button type="submit">
          {{ id ? 'Update' : 'Save' }}
        </button>
        <button type="button" @click="cancel">Cancel</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.upload-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 350px;
}
label {
  display: flex;
  flex-direction: column;
  font-weight: 600;
}
input {
  padding: 6px;
}

.buttons {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}
</style>
