import type { SongPerformanceScore } from '@/composables/useSongScoreApi.ts'
import type { SongStatus } from '@/types/songStatus.ts'

export interface Song {
  id?: string
  title: string
  artist: string
  album: string
  releaseYear: number
  status: SongStatus
  score: SongPerformanceScore
  tags: string[]
}
