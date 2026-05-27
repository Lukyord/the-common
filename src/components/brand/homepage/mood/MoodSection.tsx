import type { HomeLifestyle } from '@/payload/queries/home'

import { MoodSelector } from '@/components/brand/homepage/mood/MoodSelector'
import { MoodCard } from '@/components/brand/homepage/mood/MoodCard'

type MoodSectionProps = {
  lifestyles: HomeLifestyle[]
}

export const MoodSection = ({ lifestyles }: MoodSectionProps) => {
  return (
    <section data-section="mood">
      <div className="sc-inner pc-t-100 pc-b-100 mb-t-100 mb-b-100">
        <div className="container">
          <div className="sc-header">
            <h2 className="type-d-header type-m-headliner-m letter-spacing-002 weight-medium">
              WHAT ARE YOU IN THE
            </h2>

            <div className="mood-selector">
              <p className="type-d-header type-m-headliner-m letter-spacing-002 weight-medium">
                MOOD FOR?
              </p>
              <p className="mood-selector__label type-d-title type-m-title letter-spacing-003 weight-medium">
                FEELING LIKE...
              </p>
              <MoodSelector lifestyles={lifestyles} />
            </div>
          </div>

          <div className="content">
            <MoodCard
              media={{
                src: '/designs/roots.webp',
                alt: 'Roots',
              }}
              title="Roots"
            />
            <MoodCard
              media={{
                src: '/designs/all-kinds.webp',
                alt: 'All Kinds',
              }}
              title="All Kinds"
            />
            <MoodCard
              media={{
                src: '/designs/montys-by-roast.webp',
                alt: "Monty's by Roast",
              }}
              title="Monty's by Roast"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
