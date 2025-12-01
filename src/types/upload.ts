export interface Upload {
  id?: string
  clientId?: string
  musicId: string
  title: string
  platform: string
  platformId: string
  videoId: string
  uploadTags: string[]
  uploadedAt: Date
}
