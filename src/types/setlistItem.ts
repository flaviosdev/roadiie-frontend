export type SetlistItemStatus =
  | 'BACKLOG'
  | 'LEARNING'
  | 'COMPOSING'
  | 'PRACTICING'
  | 'PAUSED'
  | 'DONE'

export interface SetlistItem {
  id?: string

  setlistId: string

  songId?: string
  title?: string

  userNote?: string
  status?: SetlistItemStatus

  createdAt?: string
  lastRehearsedAt?: string
}
