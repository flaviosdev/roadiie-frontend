export interface Upload {
  id?: string
  musicId: string
  title: string
  platform: string
  platformId: string
  uploadUrl: string
  uploadTags: string[],
  uploadedAt: Date
}
