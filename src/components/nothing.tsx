import { BiSearchAlt } from 'solid-icons/bi'

interface NothingProps {
  text?: string
}

const Nothing = ({ text }: NothingProps) => {
  return <div class='flex justify-center items-center flex-col gap-2 text-disabled-text'>
    <BiSearchAlt class='text-6xl' />
    <span>{text || 'Nothing to show'}</span>
  </div>
}

export default Nothing