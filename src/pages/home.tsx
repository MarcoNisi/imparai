import { createResource, createSignal, For, createMemo, Show } from 'solid-js'
import { RiSystemAddLine } from 'solid-icons/ri'
import Item from '../components/item'
import Loader from '../components/loader'
import Nothing from '../components/nothing'
import Search from '../components/search'
import Title from '../components/title'
import { deleteItem, getAllItems } from '../lib/storage'
import { Link } from 'solid-app-router'

const Home = () => {
  const [search, setSearch] = createSignal('')
  const [deleting, setDeleting] = createSignal<null | string>(null)
  const [items, { refetch }] = createResource(search, getAllItems)
  const isLoading = createMemo(() => items.loading)
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
    <main>
      <Title />
      <Search onSearch={setSearch} />
      <Show when={isLoading()}>
        <Loader size='large'/>
      </Show>
      <Show when={!isLoading()}>
        <For each={items()} fallback={<Nothing text='No items' />}>
          {(item) => (
            <div class='mt-2'>
              <Item item={item} onDelete={onDelete} deleting={deleting() === item.id} />
            </div>
          )}
        </For>
      </Show>
      <div class='flex justify-center mt-4'>
        <Link class="bg-surface p-2 flex justify-center items-center gap-1 hover:bg-surface-hover" href="/details/new">
          Add
          <RiSystemAddLine class='text-lg' />
        </Link>
      </div>
    </main>
  )
}

export default Home
