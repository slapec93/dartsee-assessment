import { forwardRef } from 'react'

const ArrowRight = forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>((props, ref) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 640 640"
    fill="currentColor"
    ref={ref}
    {...props}
  >
    <path d="M566.6 297.4C579.1 309.9 579.1 330.2 566.6 342.7L406.6 502.7C394.1 515.2 373.8 515.2 361.3 502.7C348.8 490.2 348.8 469.9 361.3 457.4L466.7 352L96 352C78.3 352 64 337.7 64 320C64 302.3 78.3 288 96 288L466.7 288L361.3 182.6C348.8 170.1 348.8 149.8 361.3 137.3C373.8 124.8 394.1 124.8 406.6 137.3L566.6 297.3z" />
  </svg>
))

ArrowRight.displayName = 'ArrowRight'

export default ArrowRight
