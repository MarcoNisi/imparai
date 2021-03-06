import { useNavigate } from 'solid-app-router'
import { CgTrashEmpty } from 'solid-icons/cg'
import { ImSpinner9 } from 'solid-icons/im'
import { Item as ItemType } from '../lib/types'

interface ItemProps {
  item: ItemType
  deleting: boolean
  onDelete: (e: MouseEvent, id: string) => void
}

const Item = ({ item: { id, word, wordLang, meaning, meaningLang }, onDelete, deleting }: ItemProps) => {
  const navigate = useNavigate()
  const onDetail = () => {
    navigate(`/details/${id}`)
  }
  return (
    <div
      class="bg-surface p-2 gap-8 rounded flex justify-between cursor-pointer hover:bg-surface-hover"
      onClick={onDetail}
    >
      <span class='whitespace-nowrap overflow-hidden overflow-ellipsis'>
        <strong>{word}</strong>: {meaning}
      </span>
      <div class='flex flex-row items-center gap-2 whitespace-nowrap'>
        <span class='mr-2 hidden md:block'>
          <strong class='capitalize'>{wordLang}</strong>: <span class='capitalize'>{meaningLang}</span>
        </span>
        {deleting ? <ImSpinner9 class="animate-spin" /> : <CgTrashEmpty onClick={e => onDelete(e, id)} size={24} class='text-danger-text rounded-lg cursor-pointer hover:bg-danger-text hover:text-surface'/>}
      </div>
    </div>
  )
}

export default Item
