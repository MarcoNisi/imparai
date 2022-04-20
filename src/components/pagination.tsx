import { createEffect } from 'solid-js'
import { getPages } from '../lib/utils'

interface PaginationProps {
  current: number
  max: number
  onChange: (page: number) => void
}

const Pagination = (props: PaginationProps) => {
  return (
    <div class="flex flex-row justify-end gap-x-2">
      {getPages(props.current, props.max).map((page, i) => {
        return (
          <div data-testid="pagination-item">
            {typeof page === 'string' ? (
              '...'
            ) : (
              <button
                data-testid={`pagination-item-button${page === props.current ? '-primary' : ''}`}
                onClick={() => props.onChange(page)}
                class={`bg-surface cursor-pointer outline-none flex items-center justify-center rounded-md border-2 border-transparent w-5 ${page === props.current ? 'text-success-text' : ''}`}
              >
                {page}
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default Pagination