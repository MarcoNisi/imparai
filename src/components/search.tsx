import { createEffect, createSignal } from 'solid-js'
import { ImSearch } from 'solid-icons/im'
import { debounce } from '../lib/utils'

interface SearchProps {
  onSearch: (search: string) => void
}

const Search = ({ onSearch }: SearchProps) => {
  const [search, setSearch] = createSignal('')
  const debouncedOnSearch = debounce(onSearch)
  createEffect(() => {
    debouncedOnSearch(search())
  })
  return (
    <div class="py-2 px-3 mb-4 rounded bg-surface flex justify-between items-center">
      <input
        class="bg-surface w-full outline-none"
        placeholder="Search"
        value={search()}
        onKeyUp={(e) => setSearch(e.currentTarget.value)}
      />
      <ImSearch class='cursor-pointer' onClick={() => onSearch(search())} />
    </div>
  )
}

export default Search
