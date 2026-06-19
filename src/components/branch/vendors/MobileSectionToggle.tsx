'use client'

import {
  Children,
  isValidElement,
  useCallback,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react'

import { useIsMobile } from '@/components/branch/vendors/VendorMap/hooks/useIsMobile'
import { scrollToY } from '@/utils/functions/scrollTo'

type SectionProps = {
  label: string
  children: ReactNode
}

type SectionItem = {
  label: string
  content: ReactNode
}

const DEFAULT_LABELS = ['FLOOR PLAN', 'VENDORS']

export function MobileSectionToggleSection({ children }: SectionProps) {
  return children
}

type MobileSectionToggleProps = {
  children: ReactNode
  theme?: {
    bgColor?: string | null
    color?: string | null
  }
}

function isLabeledSection(child: ReactNode): child is ReactElement<SectionProps> {
  if (!isValidElement(child)) return false
  const props = child.props as SectionProps
  return typeof props.label === 'string'
}

function getSections(children: ReactNode): SectionItem[] {
  const childArray = Children.toArray(children)
  const labeledSections = childArray.filter(isLabeledSection)

  if (labeledSections.length > 0) {
    return labeledSections.map((section) => ({
      label: section.props.label,
      content: section.props.children,
    }))
  }

  return childArray.map((child, index) => ({
    label: DEFAULT_LABELS[index] ?? `Section ${index + 1}`,
    content: child,
  }))
}

function MobileSectionToggle({ children, theme }: MobileSectionToggleProps) {
  const sections = getSections(children)
  const isMobile = useIsMobile()
  const [activeIndex, setActiveIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const selectSection = useCallback((index: number) => {
    setActiveIndex(index)
    requestAnimationFrame(() => {
      const header = document.getElementById('header-height')
      const headerHeight = header?.offsetHeight ?? 0
      const containerTop = containerRef.current?.getBoundingClientRect().top ?? 0
      const scrollTop = Math.max(0, containerTop + window.scrollY - headerHeight)

      scrollToY(scrollTop)
    })
  }, [])

  if (!isMobile) {
    return <>{sections.map((section) => section.content)}</>
  }

  return (
    <div
      ref={containerRef}
      className="mobile-section-toggle"
      style={{ '--color': theme?.color, '--bg-color': theme?.bgColor } as React.CSSProperties}
    >
      {sections.map((section, index) => (
        <div key={section.label} hidden={activeIndex !== index}>
          {section.content}
        </div>
      ))}

      <div className="mobile-section-toggle__controls">
        {sections.map((section, index) => (
          <button
            key={section.label}
            type="button"
            data-active-section={section.label}
            className={`type-m-body-m uppercase letter-spacing-002 weight-medium mobile-section-toggle__control ${activeIndex === index ? 'is-active' : ''}`}
            onClick={() => selectSection(index)}
          >
            {section.label}
          </button>
        ))}
      </div>
    </div>
  )
}

MobileSectionToggle.Section = MobileSectionToggleSection

export default MobileSectionToggle
