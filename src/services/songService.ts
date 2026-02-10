import { songApi } from '@/api/songApi.ts'
import type { Song } from '@/types/song'

export const songService = {
  async listAll(): Promise<Song[]> {
    return songApi.getAll()
  }
}
