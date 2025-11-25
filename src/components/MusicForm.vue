<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import type { Music } from '@/types/music.ts'
import { useMusicApi } from '@/composables/useMusicApi.ts'

interface Props {
  modelValue?: Music | null
  onSaved?: () => void;
}
const props = defineProps<Props>()
const emit = defineEmits(['saved', 'cancelled'])

/** Form fields **/
const id = ref<string | null>(null)
const title = ref("")
const artist = ref("")
const tagsString = ref("")
const releaseYear = ref(0)

watch(
  () => props.modelValue,
  (music) => {
    if (!music) {
      id.value = null
      title.value = ""
      artist.value = ""
      tagsString.value = ""
      return
    }

    id.value = music.id
    title.value = music.title
    artist.value = music.artist
    releaseYear.value = music.releaseYear
    tagsString.value = music.tags?.join(", ") || ""
  },
  { immediate: true }
);

const payload = computed(() => ({
  id: id.value || undefined,
  title: title.value || undefined,
  artist: artist.value || undefined,
  releaseYear: releaseYear.value || undefined,
  tags: tagsString.value
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
}));


const { create, update } = useMusicApi()

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
  <div class="music-form">
    <h2>{{ props.id ? 'Edit Music' : 'New Music' }}</h2>
    <form @submit.prevent="save">
      <label>Title: <input v-model="title" type="text" /></label>
      <label>Artist: <input v-model="artist" type="text" /></label>
      <label>Release Year: <input v-model="releaseYear" type="text" /></label>
      <label>Tags: <input v-model="tagsString" type="text" /></label>
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
.music-form {
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
