import React from 'react'

type WhatsOnCardTipProps = {
  color: string
}

export default function WhatsOnCardTip({ color = '#200000' }: WhatsOnCardTipProps) {
  return (
    <div className="whats-on-card-tip">
      <svg
        width="110"
        height="27"
        viewBox="0 0 110 27"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_194_916)">
          <g clipPath="url(#clip1_194_916)">
            <path
              d="M-364.999 630.57H145.957V-35.0019H-364.999V630.57ZM48.5798 26.8981H112.175V596.807H-216.864L-267.622 571.484H-331.217V-1.23825H-1.84018L48.5798 26.8981Z"
              fill={color}
            />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_194_916">
            <rect width="110" height="27" fill="white" />
          </clipPath>
          <clipPath id="clip1_194_916">
            <rect width="440" height="550" fill="white" transform="translate(-330)" />
          </clipPath>
        </defs>
      </svg>
    </div>
  )
}
