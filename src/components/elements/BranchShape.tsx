import React from 'react'

type BranchShapeProps = {
  branch: 'thonglor' | 'saladaeng' | 'cloud-11'
  mainColor?: string
}

export const BranchShape = ({ branch, mainColor }: BranchShapeProps) => {
  return (
    <div className="branch-shape" data-shape={branch}>
      {branch === 'thonglor' && (
        <svg
          width="62"
          height="60"
          viewBox="0 0 62 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 27.1837V12H40.2V24.2449H51.9551V30.8571H56.3633V48H6V43.8367H9.67347V40.1633H13.5918V27.1837H6Z"
            fill={mainColor ?? '#15E8BF'}
          />
        </svg>
      )}
      {branch === 'saladaeng' && (
        <svg
          width="62"
          height="60"
          viewBox="0 0 62 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M15 56V23L22.5 4L31 23L39.5 4L47 23V56H15Z" fill={mainColor ?? '#F47929'} />
        </svg>
      )}
      {branch === 'cloud-11' && (
        <svg
          width="62"
          height="60"
          viewBox="0 0 62 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M25.008 52.8088H10.1543V18.7334L52.1543 7.47949V52.8088H37.3006V41.5405H25.008V52.8088Z"
            fill={mainColor ?? '#E1C3DE'}
          />
        </svg>
      )}
    </div>
  )
}
