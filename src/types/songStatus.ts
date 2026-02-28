export type SongStatus =
  | 'DRAFT'
  | 'BACKLOG'
  | 'IN_PROGRESS'
  | 'REHEARSING'
  | 'RECORDED'
  | 'PRODUCED'
  | 'READY'
  | 'PUBLISHED'

export const statusClasses: Record<string, string> = {
  DRAFT: 'bg-gray-200 text-gray-700',
  BACKLOG: 'bg-slate-200 text-slate-700',
  IN_PROGRESS: 'bg-blue-200 text-blue-700',
  REHEARSING: 'bg-indigo-200 text-indigo-700',
  RECORDED: 'bg-orange-200 text-orange-700',
  PRODUCED: 'bg-purple-200 text-purple-700',
  READY: 'bg-teal-200 text-teal-700',
  PUBLISHED: 'bg-green-200 text-green-700',
}

export const statusLabels: Record<SongStatus, string> = {
  DRAFT: 'Rascunho',
  BACKLOG: 'Backlog',
  IN_PROGRESS: 'Em Progresso',
  REHEARSING: 'Ensaiando',
  RECORDED: 'Gravada',
  PRODUCED: 'Produzida',
  READY: 'Pronta',
  PUBLISHED: 'Publicada',
}

export const allStatuses = Object.keys(statusLabels) as SongStatus[]
