import { Item, Preference } from './types'
import { formatDate } from './utils'

const STORAGE_PREFIX = 'imparai'
const ITEMS_KEY = `${STORAGE_PREFIX}_items`
const PREFERENCES_KEY = `${STORAGE_PREFIX}_preferences`

const isNotNull = (item: string | null): item is string => item !== null
const containsSearch = (item: Item, search: string) => {
  if (!search) return true
  const sameMeaning = item.meaning.toLowerCase().includes(search)
  const sameMeaningLang = item.meaningLang.toLowerCase().includes(search)
  const sameWord = item.word.toLowerCase().includes(search)
  const sameWordLang = item.wordLang.toLowerCase().includes(search)
  return sameMeaning || sameMeaningLang || sameWord || sameWordLang
}

const buildItemKey = (id: string) => `${ITEMS_KEY}_${id}`
const buildPreferenceKey = (id: string) => `${PREFERENCES_KEY}_${id}`

// All functions are made async because in future I want to move from localStorage to some other async storage system

export const getAllItems = async (search = ''): Promise<Item[]> => {
  return new Promise((resolve) => {
    const keys = Object.keys(localStorage)
    const itemsKey = keys.filter((k) => k.startsWith(ITEMS_KEY))
    const items: Item[] = itemsKey
      .map((k) => localStorage.getItem(k))
      .filter(isNotNull)
      .map((i) => JSON.parse(i))
      .filter((i) => containsSearch(i, search))
    setTimeout(() => {
      resolve(items)
    }, 500)
  })
}

export const getItem = async (id: string): Promise<Item | null> => {
  return new Promise((resolve) => {
    const storedItem = localStorage.getItem(buildItemKey(id))
    let item: Item | null = null
    if (storedItem) {
      item = JSON.parse(storedItem)
    } else if (id === 'new') {
      item = {
        createdAt: '',
        id: 'new',
        meaning: '',
        meaningLang: '',
        note: '',
        pinned: false,
        updatedAt: '',
        word: '',
        wordLang: '',
        wordPronunciation: '',
      }
    }
    setTimeout(() => {
      resolve(item)
    }, 500)
  })
}

export const addItem = (newItem: Item) => {
  return new Promise<string>((resolve) => {
    const item: Item = {
      ...newItem,
      id: String(Date.now()),
      updatedAt: formatDate(),
      createdAt: formatDate(),
    }

    localStorage.setItem(buildItemKey(item.id), JSON.stringify(item))

    setTimeout(() => {
      resolve(item.id)
    }, 500)
  })
}

export const editItem = (item: Item) => {
  return new Promise<string>((resolve) => {
    item.updatedAt = formatDate()
    localStorage.setItem(buildItemKey(item.id), JSON.stringify(item))
    setTimeout(() => {
      resolve(item.id)
    }, 500)
  })
}

export const deleteItem = (id: string) => {
  return new Promise<string>((resolve) => {
    localStorage.removeItem(buildItemKey(id))
    setTimeout(() => {
      resolve(id)
    }, 500)
  })
}

export const getPreference = (preferenceId: Preference) => {
  return new Promise<string | null>((resolve) => {
    const storedPreference = localStorage.getItem(buildPreferenceKey(preferenceId))
    setTimeout(() => {
      resolve(storedPreference)
    }, 500)
  })
}

export const upsertPreference = (preferenceId: Preference, value: string) => {
  return new Promise<boolean>((resolve) => {
    localStorage.setItem(buildPreferenceKey(preferenceId), value)
    setTimeout(() => {
      resolve(true)
    }, 500)
  })
}