import { onCleanup } from 'solid-js'
import { GetPagesElement, Item } from './types'

export const debounce = <Args extends any[]>(fn: (...args: Args) => void, wait = 500) => {
  let timeoutId: ReturnType<typeof setTimeout>
  const clear = () => clearTimeout(timeoutId)
  onCleanup(clear)
  const debounced = (...args: Args) => {
    if (timeoutId !== undefined) {
      clear()
    }
    timeoutId = setTimeout(() => fn(...args), wait)
  }
  return debounced
}

export const formatDate = (date: string | Date = new Date(), conf: { format: 'it' | 'en', fullYear: boolean } = { format: 'en', fullYear: true }) => {
  const _date = typeof date === 'string' ? new Date(date) : date
  const year = conf.fullYear ? _date.getFullYear() : _date.getFullYear().toString().slice(-2)
  const month = String(_date.getMonth() + 1).padStart(2, '0')
  const day = String(_date.getDate()).padStart(2, '0')
  if (conf.format === 'it') {
    return `${day}/${month}/${year}`
  } else {
    return `${year}-${month}-${day}`
  }
}

export const getPages = (current: number, max: number): GetPagesElement[] => {
  const pages: GetPagesElement[] = []
  const start = 1
  const next = current + 1
  const prev = current - 1

  if (current !== start) {
    pages.push(start)
    if (prev - start > 1) pages.push('divider')
  }
  if (prev > start) pages.push(prev)

  pages.push(current)

  if (next < max) pages.push(next)
  if (current !== max) {
    if (max - next > 1) pages.push('divider')
    pages.push(max)
  }

  return pages
}

export const itemsToCSV = (items: Item[]): string => {
  const keys = Object.keys(items[0]).join(';')
  const content = `data:text/csv;charset=utf-8,${keys}\r\n${items
    .map((item) => Object.values(item).join(';'))
    .join('\r\n')}`
  return content
}

export const downloadCSV = (content: string) => {
  const encodedUri = encodeURI(content)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `export_${formatDate()}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}