import { createResource, createSignal, For, createMemo, Show } from 'solid-js'
import { RiSystemAddLine } from 'solid-icons/ri'
import Item from '../components/item'
import Loader from '../components/loader'
import Nothing from '../components/nothing'
import Search from '../components/search'
import Title from '../components/title'
import { deleteItem, getFilteredItems } from '../lib/storage'
import { Link } from 'solid-app-router'
import Pagination from '../components/pagination'
import { Filters } from '../lib/types'

const Home = () => {
  const [filters, setFilters] = createSignal<Filters>({ page: 1, search: '' })
  const [deleting, setDeleting] = createSignal<null | string>(null)
  const [result, { refetch }] = createResource(filters, getFilteredItems)
  const isLoading = createMemo(() => result.loading)
  const onDelete = async (e: MouseEvent, id: string) => {
    e.stopPropagation()
    const result = confirm('Are you sure to delete this item? This action cannot be undone.')
    if (result) {
      try {
        setDeleting(id)
        await deleteItem(id)
        alert('Deleted!')
        refetch()
      } catch (_) {
        alert('An error has occurred!')
      } finally {
        setDeleting(null)
      }
    }
  }

  return (
    <main class="flex flex-col">
      <Title />
      <Search onSearch={search => setFilters(prev => ({ ...prev, search }))} />
      <Show when={isLoading()}>
        <Loader size="large" />
      </Show>
      <Show when={!isLoading()}>
        <div class="flex-1 overflow-y-scroll overflow-auto scrollbar">
          <For each={result()?.items} fallback={<Nothing text="No items" />}>
            {(item) => (
              <div class="mb-2">
                <Item item={item} onDelete={onDelete} deleting={deleting() === item.id} />
              </div>
            )}
          </For>
        </div>
      </Show>
      <Show when={result()?.items.length}>
        <Pagination current={filters().page} max={result()?.pages || 1} onChange={(page) => {
          setFilters(p => ({ ...p, page }))
          refetch()
        }} />
      </Show>
      <div class="flex justify-center mt-4">
        <Link
          class="bg-surface p-2 flex justify-center items-center gap-1 hover:bg-surface-hover"
          href="/details/new"
        >
          Add
          <RiSystemAddLine class="text-lg" />
        </Link>
      </div>
    </main>
  )
}

export default Home
