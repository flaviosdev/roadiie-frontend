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
  releaseYear: number
  lyrics?: string
  genre?: string
  history?: string
  status: SongStatus
  tags: string[]
}
