import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh } from 'three'
import { Text } from '@react-three/drei'

export default function DockerWhale({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.2
    }
  })

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        {/* Simplified whale body */}
        <boxGeometry args={[2, 1, 3]} />
        <meshStandardMaterial color="#0db7ed" />
      </mesh>
      
      {/* Docker containers on top */}
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[0.5, 0.3, 0.5]} />
        <meshStandardMaterial color="#2496ed" />
      </mesh>
      
      <Text
        position={[0, -1.5, 0]}
        fontSize={0.3}
        color="#0db7ed"
        anchorX="center"
        anchorY="middle"
      >
        Docker
      </Text>
    </group>
  )
}