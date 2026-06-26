import type { CSSProperties } from 'react'

import { MarkdownContent } from '@/components/common/markdown-content'
import type { BranchVenueRentalPage } from '@/payload-types'
import AnimateOnScroll from '@/components/common/animate-on-scroll'

export type BranchVenueRentalColContentSection = NonNullable<BranchVenueRentalPage['rate']>

export type BranchVenueRentalColContentColumn = {
  title: string
  cells: string[]
}

export type BranchVenueRentalColContentProps = {
  title?: string
  description?: string
  tableTitle?: string
  rows: string[]
  cols: BranchVenueRentalColContentColumn[]
  backgroundColor?: string
  textColor?: string
}

function hasColContent(section?: BranchVenueRentalColContentSection | null): boolean {
  if (!section) return false

  const rows = section.cnt?.rows?.filter((row) => row?.trim()) ?? []
  const cols = section.cnt?.cols?.filter((col) => col.title?.trim() || col.cells?.length) ?? []

  return Boolean(
    section.title?.trim() ||
    section.description?.trim() ||
    section.cnt?.title?.trim() ||
    rows.length ||
    cols.length,
  )
}

export function toBranchVenueRentalColContentProps(
  section?: BranchVenueRentalColContentSection | null,
): BranchVenueRentalColContentProps | null {
  if (!hasColContent(section)) return null

  const rows = section?.cnt?.rows?.map((row) => row?.trim() ?? '').filter(Boolean) ?? []
  const cols =
    section?.cnt?.cols?.map((col) => ({
      title: col.title?.trim() ?? '',
      cells: col.cells?.map((cell) => cell.value?.trim() ?? '') ?? [],
    })) ?? []

  return {
    title: section?.title?.trim() || undefined,
    description: section?.description?.trim() || undefined,
    tableTitle: section?.cnt?.title?.trim() || undefined,
    rows,
    cols,
    backgroundColor: section?.backgroundColor?.trim() || undefined,
    textColor: section?.textColor?.trim() || undefined,
  }
}

function VenueRentalRateTable({
  tableTitle,
  rows,
  cols,
}: Pick<BranchVenueRentalColContentProps, 'tableTitle' | 'rows' | 'cols'>) {
  if (!rows.length || !cols.length) return null

  return (
    <div className="venue-rental-rate-table">
      <table>
        <thead>
          <AnimateOnScroll as="tr" triggerClass="fadeIn" className="fadeIn">
            <th
              scope="col"
              className="type-d-body-s type-m-body-r letter-spacing-002 weight-medium"
            >
              {tableTitle}
            </th>

            {cols.map((col, index) => (
              <th
                key={`${col.title}-${index}`}
                scope="col"
                className="type-d-body-s type-m-body-r letter-spacing-002 weight-medium"
              >
                {col.title}
              </th>
            ))}
          </AnimateOnScroll>
        </thead>
        <tbody>
          {rows.map((rowLabel, rowIndex) => (
            <AnimateOnScroll
              key={`${rowLabel}-${rowIndex}`}
              as="tr"
              triggerClass="fadeIn"
              className="fadeIn"
            >
              <th scope="row" className="type-d-body-s type-m-body-s letter-spacing-002">
                {rowLabel}
              </th>
              {cols.map((col, colIndex) => (
                <td
                  key={`${rowLabel}-${colIndex}`}
                  className="type-d-body-s type-m-body-s letter-spacing-002"
                >
                  {col.cells[rowIndex] ?? ''}
                </td>
              ))}
            </AnimateOnScroll>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function BranchVenueRentalColContent({
  title,
  description,
  tableTitle,
  rows,
  cols,
  backgroundColor,
  textColor,
}: BranchVenueRentalColContentProps) {
  const sectionStyle = {
    '--col-content-bg-color': backgroundColor ?? undefined,
    '--col-content-text-color': textColor ?? undefined,
  } as CSSProperties

  return (
    <section data-section="col-content" style={sectionStyle}>
      <div className="sc-inner pc-t-100 pc-b-100 mb-t-75 mb-b-75">
        <div className="container">
          {(title || description) && (
            <div className="sc-header">
              {title && (
                <AnimateOnScroll triggerClass="fadeIn" className="sc-ttl">
                  <MarkdownContent
                    as="h2"
                    className="type-d-title type-m-headliner-m weight-medium letter-spacing-002 uppercase"
                  >
                    {title}
                  </MarkdownContent>
                </AnimateOnScroll>
              )}

              {description && (
                <AnimateOnScroll triggerClass="fadeIn" className="sc-desc">
                  <MarkdownContent
                    as="p"
                    className="type-d-body-m type-m-body-r letter-spacing-002"
                  >
                    {description}
                  </MarkdownContent>
                </AnimateOnScroll>
              )}
            </div>
          )}

          <VenueRentalRateTable tableTitle={tableTitle} rows={rows} cols={cols} />
        </div>
      </div>
    </section>
  )
}
