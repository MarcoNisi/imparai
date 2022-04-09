import Nothing from '../components/nothing'
import Title from '../components/title'

const NotFound = () => {
  return (
    <main>
      <Title />
      <Nothing />
      <div class='text-center mt-6 underline underline-offset-2'>
        <a href="/">Back to home</a>
      </div>
    </main>
  )
}

export default NotFound
