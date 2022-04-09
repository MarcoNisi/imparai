import { useNavigate, useParams } from 'solid-app-router'
import { BsSave } from 'solid-icons/bs'
import { createEffect, createMemo, createResource, Match, Show, Switch, For } from 'solid-js'
import Loader from '../components/loader'
import Title from '../components/title'
import { addItem, editItem, getItem } from '../lib/storage'
import { Item } from '../lib/types'
import langs from '../../langs.json'

const Detail = () => {
  const params = useParams()
  const navigate = useNavigate()
  const [item, { mutate }] = createResource(() => params.id, getItem)
  createEffect(() => {
    if (!item.loading && !item() && params.id !== 'new') {
      navigate('/notFound')
    }
  })

  const onSave = async () => {
    const itemValue = item()
    if (itemValue) {
      if (itemValue.id === 'new') {
        const id = await addItem(itemValue)
        navigate(`/details/${id}`)
      } else {
        editItem(itemValue)
      }
    }
  }

  const canSave = createMemo(() => {
    const itemValue = item()
    if (!itemValue) return false
    const mandatoryFields: (keyof Item)[] = ['meaning', 'meaningLang', 'word', 'wordLang']
    const keys = Object.keys(itemValue).map(key => key as keyof Item)
    const validKeys = keys.map(key => Boolean(itemValue[key] || !mandatoryFields.includes(key)))
    return validKeys.every(Boolean)
  })

  createEffect(() => console.log(item()))

  return (
    <main>
      <Title />
      <Switch>
        <Match when={item.loading}>
          <Loader size="large" />
        </Match>
        <Match when={item()}>
          {(item) => (
            <>
              <div class="flex flex-col">
                <div class="flex flex-1 justify-between mb-4">
                  <span>Choose word language</span>
                  <select
                    value={item.wordLang}
                    class="bg-surface px-2 capitalize"
                    onChange={(e) => mutate({ ...item, wordLang: e.currentTarget.value })}
                  >
                    <For each={Object.keys(langs)}>
                      {(lang) => (
                        <option class='capitalize' value={lang}>{langs[lang as keyof typeof langs]}</option>
                      )}
                    </For>
                  </select>
                </div>
                <div class="flex flex-1 flex-col mb-4">
                  <span class="mb-1">Insert word</span>
                  <textarea
                    class="p-1 bg-surface"
                    value={item.word}
                    onChange={(e) => mutate({ ...item, word: e.currentTarget.value })}
                  />
                </div>
                <div class="flex flex-1 justify-between mb-4">
                  <span>Choose meaning language</span>
                  <select
                    value={item.meaningLang}
                    class="bg-surface px-2 capitalize"
                    onChange={(e) => mutate({ ...item, meaningLang: e.currentTarget.value })}
                  >
                  <For each={Object.keys(langs)}>
                    {(lang) => (
                      <option class='capitalize' value={lang}>{langs[lang as keyof typeof langs]}</option>
                    )}
                  </For>
                  </select>
                </div>
                <div class="flex flex-1 flex-col mb-4">
                  <span class="mb-1">Insert meaning</span>
                  <textarea
                    class="p-1 bg-surface"
                    value={item.meaning}
                    onChange={(e) => mutate({ ...item, meaning: e.currentTarget.value })}
                  />
                </div>
                <div class="flex flex-1 flex-col mb-4">
                  <span class="mb-1">Insert word pronunciation (optional)</span>
                  <textarea
                    class="p-1 bg-surface"
                    value={item.wordPronunciation}
                    onChange={(e) => mutate({ ...item, wordPronunciation: e.currentTarget.value })}
                  />
                </div>
                <div class="flex flex-1 flex-col mb-4">
                  <span class="mb-1">Insert note (optional)</span>
                  <textarea
                    class="p-1 bg-surface"
                    value={item.note}
                    onChange={(e) => mutate({ ...item, note: e.currentTarget.value })}
                  />
                </div>
                <Show when={item.createdAt}>
                  <div class="flex flex-1 justify-between mb-4">
                    <span>Created at {item.createdAt}</span>
                    <Show when={item.updatedAt}>
                      <span>Updated at {item.updatedAt}</span>
                    </Show>
                  </div>
                </Show>
                <button
                  class="bg-surface py-2 flex justify-center items-center gap-2 uppercase hover:bg-surface-hover disabled:cursor-not-allowed"
                  onClick={onSave}
                  disabled={!canSave()}
                >
                  Save
                  <BsSave size={16} class="text-default-text" />
                </button>
              </div>
            </>
          )}
        </Match>
      </Switch>
    </main>
  )
}

export default Detail
