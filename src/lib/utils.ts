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

export const formatDate = (date = new Date()) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}