<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Music } from '@/types/music.ts'
import { useMusicApi } from '@/composables/useMusicApi.ts'

interface Props {
  id?: string
}

const props = defineProps<Props>()
const emit = defineEmits(['saved', 'cancelled'])

const { findById, create, update } = useMusicApi()
const form = ref<Music>({
  title: '',
  artist: '',
})

/**
 * Loads data if editing
 */
onMounted(async () => {
  if (props.id) {
    const { data } = await findById(props.id)
    form.value = data
  }
})

/**
 * Save data
 */
const save = async () => {
  if (props.id) {
    await update(props.id, form.value)
  } else {
    await create(form.value)
  }
  emit('saved')
}

const cancel = () => emit('cancelled')
</script>

<template>
  <div class="music-form">
    <h2>{{ props.id ? 'Edit Music' : 'New Music' }}</h2>
    <form @submit.prevent="save">
      <label>Artist: <input v-model="form.artist" type="text" /></label>
      <label>Title: <input v-model="form.title" type="text" /></label>
      <div class="buttons">
        <button type="submit">
          {{ props.id ? 'Update' : 'Save' }}
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
