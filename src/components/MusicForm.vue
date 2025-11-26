<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from "vue";
import type { Music } from "@/types/music";

const props = defineProps<{
  modelValue: Music | null;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: Music | null): void;
  (e: "saved"): void;
}>();

const id = ref<string | null>(null);
const title = ref("");
const artist = ref("");
const releaseYear = ref<number | null>(null);
const tagsString = ref("");

// --- Sincroniza form ←→ modelValue ---
watch(
  () => props.modelValue,
  (value) => {
    if (value) {
      id.value = value.id ?? null;
      title.value = value.title;
      artist.value = value.artist;
      releaseYear.value = value.releaseYear;
      tagsString.value = (value.tags ?? []).join(", ");
    } else {
      reset();
    }
  },
  { immediate: true }
);

// --- Limpa o formulário ---
function reset() {
  id.value = null;
  title.value = "";
  artist.value = "";
  releaseYear.value = null;
  tagsString.value = "";
}

// --- Emite para o pai salvar ---
async function save() {
  try {
    const tags = tagsString.value
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload: Music = {
      id: id.value ?? undefined,
      title: title.value,
      artist: artist.value,
      releaseYear: releaseYear.value ?? 0,
      tags,
    };

    emit("update:modelValue", payload);
    emit("saved");

    reset();
  } catch (err) {
    console.error("Erro ao salvar:", err);
  }
}
</script>

<template>
  <div class="p-4 border rounded-lg bg-white shadow-sm space-y-4">
    <h2 class="text-xl font-semibold">
      {{ id ? "Edit Music" : "Create Music" }}
    </h2>

    <!-- Title -->
    <div class="space-y-1">
      <label class="block text-sm font-medium">Title</label>
      <input v-model="title" type="text" class="border rounded w-full p-2" />
    </div>

    <!-- Artist -->
    <div class="space-y-1">
      <label class="block text-sm font-medium">Artist</label>
      <input v-model="artist" type="text" class="border rounded w-full p-2" />
    </div>

    <!-- Release Year -->
    <div class="space-y-1">
      <label class="block text-sm font-medium">Release Year</label>
      <input
        v-model="releaseYear"
        type="number"
        class="border rounded w-full p-2"
      />
    </div>

    <!-- Tags -->
    <div class="space-y-1">
      <label class="block text-sm font-medium">Tags (comma separated)</label>
      <input
        v-model="tagsString"
        type="text"
        class="border rounded w-full p-2"
      />
    </div>

    <button
      @click="save"
      class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      {{ id ? "Update" : "Create" }}
    </button>
  </div>
</template>

<style scoped>
/* opcional */
</style>
