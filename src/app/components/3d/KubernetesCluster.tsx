import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'
import { Text } from '@react-three/drei'

export default function KubernetesCluster({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<Group>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3
    }
  })

  return (
    <group position={position} ref={groupRef}>
      {/* Master node */}
      <mesh position={[0, 0, 0]}>
        <octahedronGeometry args={[0.8]} />
        <meshStandardMaterial color="#326ce5" />
      </mesh>
      
      {/* Worker nodes */}
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i * Math.PI * 2) / 3) * 2,
            0,
            Math.sin((i * Math.PI * 2) / 3) * 2
          ]}
        >
          <sphereGeometry args={[0.4]} />
          <meshStandardMaterial color="#66b3ff" />
        </mesh>
      ))}
      
      <Text
        position={[0, -2, 0]}
        fontSize={0.3}
        color="#326ce5"
        anchorX="center"
        anchorY="middle"
      >
        Kubernetes
      </Text>
    </group>
  )
}