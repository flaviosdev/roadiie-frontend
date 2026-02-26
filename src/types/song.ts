import type { SongPerformanceScore } from '@/composables/useSongScoreApi.ts'

export type SongStatus =
  | 'DRAFT'
  | 'BACKLOG'
  | 'IN_PROGRESS'
  | 'REHEARSING'
  | 'RECORDED'
  | 'PRODUCED'
  | 'READY'
  | 'PUBLISHED'

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
