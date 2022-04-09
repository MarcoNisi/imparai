import { Link } from 'solid-app-router'
import { AiOutlineRight } from 'solid-icons/ai'
import { Item as ItemType } from '../lib/types'

const Item = ({ id, word, wordLang, meaning, meaningLang }: ItemType) => {
  return (
    <Link
      class="bg-surface p-2 gap-8 rounded flex justify-between cursor-pointer hover:bg-surface-hover"
      href={`/details/${id}`}
    >
      <span class='whitespace-nowrap overflow-hidden overflow-ellipsis'>
        <strong>{word}</strong>: {meaning}
      </span>
      <div class='flex flex-row items-center gap-2 whitespace-nowrap'>
        <span>
          <strong>{wordLang}</strong> -&gt; {meaningLang}
        </span>
        <AiOutlineRight />
      </div>
    </Link>
  )
}

export default Item
