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