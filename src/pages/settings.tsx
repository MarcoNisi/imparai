import { FiDownload } from 'solid-icons/fi'
import { ImSpinner9 } from 'solid-icons/im'
import { createSignal, Show } from 'solid-js'
import Title from '../components/title'
import { addItem, editItem, getAllItems } from '../lib/storage'
import { Item } from '../lib/types'
import { downloadCSV, itemsToCSV } from '../lib/utils'

const Settings = () => {
  const [recoverIsOpen, setRecoverIsOpen] = createSignal(false)
  const [fileIsValid, setFileIsValid] = createSignal<boolean | null>(null)
  const [fileContent, setFileContent] = createSignal<Item[]>([])
  const [importing, setImporting] = createSignal(false)
  const onDownload = async () => {
    const items = await getAllItems()
    const firstItem = items[0]
    if (firstItem) {
      const content = itemsToCSV(items)
      downloadCSV(content)
    }
  }
  const onImport = async () => {
    setImporting(true)
    const items = await getAllItems()
    fileContent().forEach((importedItem) => {
      if (items.some((i) => i.id === importedItem.id)) {
        editItem(importedItem)
      } else {
        addItem(importedItem)
      }
    })
    setImporting(false)
    setTimeout(() => alert('Imported with success!'), 100)
  }
  const onValidate = async (files: FileList | null) => {
    const file = files ? files[0] : null
    if (file) {
      const rawContent = await file.text()
      const content = rawContent.split('\r\n')
      const header = content[0].split(';')
      const itemsValues = content.slice(1).map((c) => c.split(';'))
      const correctHeader = [
        'createdAt',
        'id',
        'meaning',
        'meaningLang',
        'note',
        'pinned',
        'updatedAt',
        'word',
        'wordLang',
        'wordPronunciation',
      ]
      const sameHeader = header.every((h, i) => correctHeader[i] === h)
      if (sameHeader) {
        setFileIsValid(true)
        const items: Item[] = itemsValues.map((itemValues) => {
          const item: Item = correctHeader.reduce<Item>((acc, key, i) => {
            const typedKey = key as keyof Item
            // @ts-ignore
            acc[typedKey] = itemValues[i]
            return acc
          }, {} as Item)
          return item
        })
        setFileContent(items)
      } else {
        setFileIsValid(false)
      }
    }
  }
  return (
    <main>
      <Title />
      <div class="flex gap-3 flex-col">
        <div class="flex flex-col">
          <div class="flex justify-between items-center">
            <span class="text-lg">Download backup</span>
            <FiDownload size={24} class="cursor-pointer" onClick={onDownload} />
          </div>
          <span class="text-sm">Download backup CSV file for later restore</span>
        </div>
        <div class="flex flex-col">
          <div class="flex justify-between items-center">
            <span class="text-lg">Recover backup</span>
            <FiDownload size={24} class="cursor-pointer" onClick={() => setRecoverIsOpen(true)} />
          </div>
          <span class="text-sm">Download backup CSV file for later restore</span>

          <Show when={recoverIsOpen()}>
            <div class="mt-2 flex justify-between items-center">
              <input
                type="file"
                accept=".csv"
                onChange={(e) => onValidate(e.currentTarget.files)}
              />
              <button
                class="bg-surface p-2 flex justify-center items-center gap-2 uppercase hover:bg-surface-hover disabled:cursor-not-allowed"
                onClick={onImport}
                disabled={!fileIsValid()}
              >
                Import
                {importing() ? (
                  <ImSpinner9 size={16} class="animate-spin text-default-text" />
                ) : null}
              </button>
            </div>
            <Show when={fileIsValid() == false}>
              <span class="text-danger-text">Invalid file</span>
            </Show>
          </Show>
        </div>
      </div>
    </main>
  )
}

export default Settings
