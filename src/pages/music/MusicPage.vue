<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useMusicApi } from '@/composables/useMusicApi';
import MusicForm from '@/components/MusicForm.vue';
import type { Music } from '@/types/Music';

const { findAll } = useMusicApi();

const list = ref<Music[]>([]);
const showForm = ref(false);
const editId = ref<number | null>(null);

const load = async () => {
  const { data } = await findAll();
  list.value = data;
};

const createNew = () => {
  editId.value = null;
  showForm.value = true;
};

const edit = (id: number) => {
  editId.value = id;
  showForm.value = true;
};

const closeForm = () => {
  showForm.value = false;
};

const onSaved = async () => {
  showForm.value = false;
  await load();
};

onMounted(load);
</script>

<template>
  <div>
    <h1>Music</h1>

    <!-- CREATE BUTTON -->
    <button @click="createNew">New Music</button>

    <!-- LIST -->
    <ul>
      <li v-for="m in list" :key="m.id">
        {{ m.name }} — {{ m.artist }}
        <button @click="edit(m.id!)">Edit</button>
      </li>
    </ul>

    <!-- FORM -->
    <MusicForm
      v-if="showForm"
      :id="editId ?? undefined"
      @saved="onSaved"
      @cancelled="closeForm"
    />
  </div>
</template>
