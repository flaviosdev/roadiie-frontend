import { musicApi } from '@/api/musicApi.ts'
import type { Music } from '@/types/music'

export const musicService = {
  async listAll(): Promise<Music[]> {
    return musicApi.getAll()
  }
}
