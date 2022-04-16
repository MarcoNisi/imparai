import { useNavigate, useParams } from 'solid-app-router'
import { BsSave } from 'solid-icons/bs'
import { IoClose } from 'solid-icons/io'
import {
  createEffect,
  createMemo,
  createResource,
  Match,
  Show,
  Switch,
  For,
  createSignal,
} from 'solid-js'
import Loader from '../components/loader'
import Title from '../components/title'
import { addItem, editItem, getItem, getPreference, upsertPreference } from '../lib/storage'
import { Item } from '../lib/types'
import langs from '../../langs.json'
import { ImSpinner9 } from 'solid-icons/im'
import { formatDate } from '../lib/utils'

const Detail = () => {
  const params = useParams()
  const navigate = useNavigate()
  const [item, { mutate }] = createResource(() => params.id, getItem)
  const [success, setSuccess] = createSignal(false)
  const [error, setError] = createSignal(false)
  const [loading, setLoading] = createSignal(false)

  createEffect(() => {
    if (!item.loading && !item() && params.id !== 'new') {
      navigate('/notFound')
    }
  })

  const onSave = async () => {
    try {
      setLoading(true)
      setSuccess(false)
      setError(false)
      const itemValue = item()
      if (itemValue) {
        if (itemValue.id === 'new') {
          const id = await addItem(itemValue)
          navigate(`/details/${id}`)
        } else {
          await editItem(itemValue)
        }
        upsertPreference('meaningLang', itemValue.meaningLang)
        upsertPreference('wordLang', itemValue.wordLang)
      }
      setSuccess(true)
      setError(true)
    } catch (_) {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  const canSave = createMemo(() => {
    const itemValue = item()
    if (!itemValue) return false
    const mandatoryFields: (keyof Item)[] = ['meaning', 'meaningLang', 'word', 'wordLang']
    const keys = Object.keys(itemValue).map((key) => key as keyof Item)
    const validKeys = keys.map((key) => Boolean(itemValue[key] || !mandatoryFields.includes(key)))
    return validKeys.every(Boolean)
  })

  const resultText = createMemo(() => {
    if (success()) return { text: 'Saved', color: 'text-success-text' }
    if (error()) return { text: 'An error has occurred!', color: 'text-danger-text' }
  })

  const [storedWordLang] = createResource('wordLang', getPreference)
  const [storedMeaningLang] = createResource('meaningLang', getPreference)
  
  const defaultWordLang = createMemo(() => {
    const itemWordLang = item()?.wordLang
    const firstWordLang = Object.keys(langs).at(0)
    return itemWordLang || storedWordLang() || firstWordLang
  })

  const defaultMeaningLang = createMemo(() => {
    const itemMeaningLang = item()?.meaningLang
    const firstMeaningLang = Object.keys(langs).at(0)
    return itemMeaningLang || storedMeaningLang() || firstMeaningLang
  })

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
                <div class="flex flex-1 justify-between mb-4 flex-col md:flex-row gap-1">
                  <span>Choose word language</span>
                  <select
                    value={item.wordLang}
                    class="bg-surface p-1 capitalize"
                    onChange={(e) => mutate({ ...item, wordLang: e.currentTarget.value })}
                  >
                    <For each={Object.keys(langs)}>
                      {(lang) => (
                        <option class="capitalize" value={lang} selected={defaultWordLang() === lang}>
                          {langs[lang as keyof typeof langs]}
                        </option>
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
                <div class="flex flex-1 justify-between mb-4 flex-col md:flex-row gap-1">
                  <span>Choose meaning language</span>
                  <select
                    value={item.meaningLang}
                    class="bg-surface p-1 capitalize"
                    onChange={(e) => mutate({ ...item, meaningLang: e.currentTarget.value })}
                  >
                    <For each={Object.keys(langs)}>
                      {(lang) => (
                        <option class="capitalize" value={lang} selected={defaultMeaningLang() === lang}>
                          {langs[lang as keyof typeof langs]}
                        </option>
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
                  <div class="flex flex-1 justify-between mb-4 text-sm">
                    <span>Created at {formatDate(item.createdAt, { format: 'it', fullYear: false })}</span>
                    <Show when={item.updatedAt}>
                      <span>Updated at {formatDate(item.updatedAt, { format: 'it', fullYear: false })}</span>
                    </Show>
                  </div>
                </Show>
                <button
                  class="bg-surface py-2 flex justify-center items-center gap-2 uppercase hover:bg-surface-hover disabled:cursor-not-allowed"
                  onClick={onSave}
                  disabled={!canSave() || loading()}
                >
                  Save
                  {loading() ? <ImSpinner9 size={16} class="animate-spin text-default-text" /> : <BsSave size={16} class="text-default-text" />}
                </button>
                <span class={`mt-2 ${resultText()?.color}`}>{resultText()?.text}</span>
              </div>
            </>
          )}
        </Match>
      </Switch>
    </main>
  )
}

export default Detail
