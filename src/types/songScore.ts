export interface SongScore {
  id: string
  songId: string
  songName: string
  popularityScore: number
  growthScore: number
  engagementScore: number
  consistencyScore: number
  finalScore: number
  calculatedAt: string
}
