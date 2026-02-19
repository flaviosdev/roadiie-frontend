<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/auth/useAuth.ts'

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const route = useRoute()
const router = useRouter()

const { login } = useAuth()

onMounted(() => {
  if ((route.query.error = 'server-down')) {
    error.value = 'server-down'
  }
})

async function submit() {
  loading.value = true
  error.value = ''

  try {
    const result = await login(email.value, password.value)

    if (!result.ok) {
      error.value = result.message
      return
    }

    const redirect = (route.query.redirect as string) || '/'
    router.push(redirect)
  } catch {
    error.value = 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="p-6 max-w-sm mx-auto border rounded space-y-4">
    <h1 class="text-xl font-semibold">Login</h1>

    <div>
      <label>Email</label>
      <input v-model="email" type="email" class="border w-full p-2 rounded" />
    </div>

    <div>
      <label>Password</label>
      <input v-model="password" type="password" class="border w-full p-2 rounded" />
    </div>

    <div v-if="error" class="text-red-600 text-sm">{{ error }}</div>

    <button
      @click="submit"
      class="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
      :disabled="loading"
    >
      {{ loading ? 'Signing in...' : 'Sign in' }}
    </button>
  </div>
</template>
