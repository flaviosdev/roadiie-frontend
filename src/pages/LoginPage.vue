<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/auth/useAuth.ts'

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const route = useRoute()
const router = useRouter()

const { login } = useAuth()

const isValid = computed(() => {
  return email.value.length > 3 && password.value.length > 0
})

async function submit() {
  if (!isValid.value || loading.value) return

  loading.value = true
  error.value = ''

  try {
    const result = await login(email.value, password.value)

    if (!result.ok) {
      error.value = result.message || 'Invalid credentials'
      return
    }

    const redirect = (route.query.redirect as string) || '/'
    router.push(redirect)
  } catch (err) {
    error.value = 'Unexpected error. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 p-6">
    <form
      @submit.prevent="submit"
      class="w-full max-w-sm bg-white border rounded-xl shadow-sm p-6 space-y-5"
    >
      <div class="space-y-1">
        <h1 class="text-xl font-semibold">Sign in</h1>
        <p class="text-sm text-gray-500">Access your workspace</p>
      </div>

      <!-- Email -->
      <div class="space-y-1">
        <label class="text-sm font-medium">Email</label>
        <input
          v-model="email"
          type="email"
          placeholder="you@email.com"
          class="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- Password -->
      <div class="space-y-1">
        <label class="text-sm font-medium">Password</label>
        <input
          v-model="password"
          type="password"
          placeholder="••••••••"
          class="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- Error -->
      <div v-if="error" class="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
        {{ error }}
      </div>

      <!-- Button -->
      <button
        type="submit"
        :disabled="!isValid || loading"
        class="w-full py-2 rounded-md font-medium text-white transition bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ loading ? 'Signing in...' : 'Sign in' }}
      </button>

      <!-- Future links -->
      <div class="text-center text-sm text-gray-500">Forgot password?</div>
    </form>
  </div>
</template>
