import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'
import { Text } from '@react-three/drei'

export default function JenkinsRobot({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<Group>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2
      // Gentle bobbing motion
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1
    }
  })

  return (
    <group position={position} ref={groupRef}>
      {/* Robot Body */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.6, 0.8, 1.5]} />
        <meshStandardMaterial color="#d33833" />
      </mesh>
      
      {/* Robot Head */}
      <mesh position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.5]} />
        <meshStandardMaterial color="#ff6b6b" />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[-0.2, 1.3, 0.4]}>
        <sphereGeometry args={[0.1]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.2, 1.3, 0.4]}>
        <sphereGeometry args={[0.1]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      
      {/* Arms */}
      <mesh position={[-1, 0.3, 0]} rotation={[0, 0, Math.PI / 6]}>
        <cylinderGeometry args={[0.2, 0.2, 1]} />
        <meshStandardMaterial color="#d33833" />
      </mesh>
      <mesh position={[1, 0.3, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <cylinderGeometry args={[0.2, 0.2, 1]} />
        <meshStandardMaterial color="#d33833" />
      </mesh>
      
      {/* Jenkins Logo Badge */}
      <mesh position={[0, 0, 0.9]}>
        <circleGeometry args={[0.3]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      
      <Text
        position={[0, -1.5, 0]}
        fontSize={0.3}
        color="#d33833"
        anchorX="center"
        anchorY="middle"
      >
        Jenkins
      </Text>
    </group>
  )
}