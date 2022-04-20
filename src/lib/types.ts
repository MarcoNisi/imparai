export interface Item {
  id: string
  createdAt: string
  updatedAt: string
  word: string
  wordPronunciation: string
  wordLang: string
  meaning: string
  meaningLang: string
  pinned: boolean
  note: string
}

export type Preference = 'wordLang' | 'meaningLang'
  
export type GetPagesElement = 'divider' | number

export interface Filters {
  page: number
  search: string
}
export interface Results<T> {
  items: T[]
  total: number
  pages: number
}