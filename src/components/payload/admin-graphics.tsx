import Image from 'next/image'

const LOGO_BLACK = '/designs/logo-black.webp'
const LOGO_WHITE = '/designs/logo-white.webp'

type ThemeLogoProps = {
  className: string
  height: number
}

function ThemeLogo({ className, height }: ThemeLogoProps) {
  const imgStyle = { height, width: 'auto', maxWidth: '100%' } as const

  return (
    <span className={className}>
      <Image
        alt="The Common"
        className="admin-theme-logo__img admin-theme-logo__img--light"
        height={height}
        src={LOGO_BLACK}
        style={imgStyle}
        width={height}
      />
      <Image
        alt="The Common"
        className="admin-theme-logo__img admin-theme-logo__img--dark"
        height={height}
        src={LOGO_WHITE}
        style={imgStyle}
        width={height}
      />
    </span>
  )
}

export default function AdminLogo() {
  return <ThemeLogo className="admin-theme-logo" height={56} />
}

export function AdminIcon() {
  return <ThemeLogo className="admin-theme-icon" height={32} />
}
