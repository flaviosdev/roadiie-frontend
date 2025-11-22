import { http } from './http'
import type { Music } from '@/types/music.ts'

export const musicApi = {
  async getAll(): Promise<Music[]> {
    const response = await http.get('/music')
    return response.data
  }
}
