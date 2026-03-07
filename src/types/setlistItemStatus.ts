export type SetlistItemStatus =
  | 'BACKLOG'
  | 'LEARNING'
  | 'COMPOSING'
  | 'PRACTICING'
  | 'PAUSED'
  | 'DONE'

export const setlistItemStatusClasses: Record<SetlistItemStatus, string> = {
  BACKLOG: 'bg-slate-200 text-slate-700',
  LEARNING: 'bg-blue-200 text-blue-700',
  COMPOSING: 'bg-purple-200 text-purple-700',
  PRACTICING: 'bg-indigo-200 text-indigo-700',
  PAUSED: 'bg-yellow-200 text-yellow-700',
  DONE: 'bg-green-200 text-green-700',
}

export const setlistItemStatusLabels: Record<SetlistItemStatus, string> = {
  BACKLOG: 'Backlog',
  LEARNING: 'Aprendendo',
  COMPOSING: 'Compondo / Adaptando',
  PRACTICING: 'Praticando',
  PAUSED: 'Pausado',
  DONE: 'Finalizado',
}

export const allSetlistItemStatuses = Object.keys(setlistItemStatusLabels) as SetlistItemStatus[]
