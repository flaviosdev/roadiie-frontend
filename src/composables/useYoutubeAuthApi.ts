import http from '@/api/http.ts'
import { ref } from 'vue'

const authUrl = ref<string | null>(null)

export function useYoutubeAuthApi() {
  const getAuthUrl = async () => {
      const response = await http.get('/api/oauth2/youtube/auth')
    authUrl.value = response.data
  }

  return {
    getAuthUrl,
    authUrl,
  }
}
