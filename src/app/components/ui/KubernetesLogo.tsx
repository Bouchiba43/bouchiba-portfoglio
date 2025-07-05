export default function KubernetesLogo({ className = "w-12 h-12", color = "#326ce5" }: { 
  className?: string, 
  color?: string 
}) {
  return (
    <svg 
      className={className}
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2L13.09 8.26L19 4L15.74 9.09L22 10L15.74 10.91L19 16L13.09 11.74L12 18L10.91 11.74L5 16L8.26 10.91L2 10L8.26 9.09L5 4L10.91 8.26L12 2Z"
        fill={color}
        stroke={color}
        strokeWidth="0.5"
      />
      <circle
        cx="12"
        cy="10"
        r="2.5"
        fill="white"
        stroke={color}
        strokeWidth="1"
      />
      <path
        d="M12 8.5L12.7 9.2L12 9.9L11.3 9.2L12 8.5Z"
        fill={color}
      />
    </svg>
  )
}