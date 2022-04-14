import { onCleanup } from 'solid-js'

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
