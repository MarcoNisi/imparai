import { createResource, createSignal, For, createMemo, Show } from 'solid-js'
import { RiSystemAddLine } from 'solid-icons/ri'
import Item from '../components/item'
import Loader from '../components/loader'
import Nothing from '../components/nothing'
import Search from '../components/search'
import Title from '../components/title'
import { getAllItems } from '../lib/storage'
import { Link } from 'solid-app-router'

const Home = () => {
  const [search, setSearch] = createSignal('')
  const [items] = createResource(search, getAllItems)
  const isLoading = createMemo(() => items.loading)

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
              <Item {...item} />
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
