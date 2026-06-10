import RenderMedia from '@/components/common/media'

type MapPlanMediaProps = {
  src: string
  alt: string
  overlay?: boolean
}

export default function MapPlanMedia({ src, alt, overlay = false }: MapPlanMediaProps) {
  const className = ['map-plan__media', overlay && 'plan-overlay'].filter(Boolean).join(' ')

  return (
    <div className={className}>
      <RenderMedia key={src} src={src} alt={alt} />
    </div>
  )
}
