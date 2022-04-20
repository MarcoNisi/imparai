import pgk from '../../package.json'

const Title = () => {
  return <div class="pt-1 pb-4 flex justify-between items-center">
    <a class="text-2xl" href='/'>Imparai</a>
    <span class="text-base">v{pgk.version}</span>
  </div>
}

export default Title