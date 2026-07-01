type BranchSvgSlug = 'thonglor' | 'saladaeng' | 'cloud-11'

type BranchSvgIconProps = {
  branch: BranchSvgSlug
  color?: string
  className?: string
}

const BRANCH_PATHS: Record<BranchSvgSlug, string> = {
  thonglor:
    'M29.0593 16.5372V12.3679H21.6049V4.59766H0V14.1999H4.8011V22.4123H2.33738V24.7496H0V27.4029H31.8389V16.6004H29.0593V16.5372ZM12.1923 22.4123H8.27558V14.1999H12.1923V22.4123Z',
  saladaeng:
    'M7.5 29.8131V12.2815L11.4845 2.1875L16.0002 12.2815L20.5159 2.1875L24.5004 12.2815V29.8131H7.5Z',
  'cloud-11':
    'M12.7715 27.9057H4.96875V10.0055L27.0318 4.09375V27.9057H19.229V21.9863H12.7715V27.9057Z',
}

export function isBranchSvgSlug(slug: string): slug is BranchSvgSlug {
  return slug === 'thonglor' || slug === 'saladaeng' || slug === 'cloud-11'
}

export function BranchSvgIcon({ branch, color = 'currentColor', className }: BranchSvgIconProps) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className ?? 'branch-svg-icon'}
      aria-hidden
    >
      {branch === 'thonglor' ? (
        <g clipPath="url(#branch-svg-icon-tl-clip)">
          <path d={BRANCH_PATHS.thonglor} fill={color} />
        </g>
      ) : (
        <path d={BRANCH_PATHS[branch]} fill={color} />
      )}
      {branch === 'thonglor' && (
        <defs>
          <clipPath id="branch-svg-icon-tl-clip">
            <rect width="32" height="32" fill="white" />
          </clipPath>
        </defs>
      )}
    </svg>
  )
}
