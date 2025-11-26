<template>
  <div class="h-screen flex bg-gray-50">
    <!-- Sidebar -->
    <aside class="w-72 border-r bg-white p-4">
      <slot name="sidebar" />
    </aside>

    <!-- Detail -->
    <main class="flex-1 p-6">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
</script>
