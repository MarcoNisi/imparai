import { ImSpinner9 } from 'solid-icons/im'

interface LoaderProps {
  size: 'large' | 'small'
}

const sizeMap: Record<LoaderProps['size'], { text: string; height: string }> = {
  large: { text: 'text-4xl', height: 'h-48' },
  small: { text: '', height: '' },
}

const Loader = ({ size }: LoaderProps) => {
  return (
    <div class={`flex justify-center items-center ${sizeMap[size].text} ${sizeMap[size].height}`}>
      <ImSpinner9 class="animate-spin" />
    </div>
  )
}

export default Loader
