import { Link } from 'solid-app-router'
import { FiSettings } from 'solid-icons/fi'
import pgk from '../../package.json'

const Title = () => {
  return (
    <div class="pt-1 pb-4 flex justify-between items-center">
      <a class="text-2xl" href="/">
        Imparai
      </a>
      <div class="flex items-center justify-center gap-2">
        <span class="text-base">v{pgk.version}</span>
        <Link href='/settings'>
          <FiSettings class="cursor-pointer" />
        </Link>
      </div>
    </div>
  )
}

export default Title
