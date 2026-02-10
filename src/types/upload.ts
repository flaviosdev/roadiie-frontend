import type { Summary } from '@/types/summary.ts'

export interface Upload {
  id?: string
  clientId?: string
  videoId: string
  songId: string
  title: string
  description: string
  platformId: string
  status: string
  uploadTags: string[]
  summary: Summary
  uploadedAt: Date
}
