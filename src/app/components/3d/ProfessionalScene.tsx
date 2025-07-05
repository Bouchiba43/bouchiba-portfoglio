'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Float, Text, Line } from '@react-three/drei'
import { Suspense, useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function DataVisualization() {
  const groupRef = useRef<THREE.Group>(null)
  const [activeNode, setActiveNode] = useState<number | null>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  const dataNodes = [
    { position: [-3, 2, 0], label: 'Docker', color: '#0db7ed', metrics: '50+ containers' },
    { position: [3, 2, 0], label: 'Kubernetes', color: '#326ce5', metrics: '99.9% uptime' },
    { position: [0, -2, 3], label: 'CI/CD', color: '#22c55e', metrics: '200+ deploys' },
    { position: [-2, -1, -2], label: 'Monitoring', color: '#f59e0b', metrics: '24/7 alerts' },
    { position: [2, 0, -3], label: 'Security', color: '#ef4444', metrics: '0 incidents' },
  ]

  return (
    <group ref={groupRef}>
      {dataNodes.map((node, index) => (
        <group key={index}>
          <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
            <mesh 
              position={node.position as [number, number, number]}
              onPointerEnter={() => setActiveNode(index)}
              onPointerLeave={() => setActiveNode(null)}
            >
              <dodecahedronGeometry args={[activeNode === index ? 0.6 : 0.4]} />
              <meshStandardMaterial 
                color={node.color}
                metalness={0.8}
                roughness={0.2}
                emissive={node.color}
                emissiveIntensity={activeNode === index ? 0.3 : 0.1}
              />
            </mesh>
          </Float>
          
          {activeNode === index && (
            <group position={[node.position[0], node.position[1] + 1, node.position[2]]}>
              <Text
                fontSize={0.3}
                color="white"
                anchorX="center"
                anchorY="bottom"
              >
                {node.label}
              </Text>
              <Text
                position={[0, -0.5, 0]}
                fontSize={0.2}
                color={node.color}
                anchorX="center"
                anchorY="top"
              >
                {node.metrics}
              </Text>
            </group>
          )}
        </group>
      ))}
      
      {/* Central Core */}
      <Float speed={0.5}>
        <mesh position={[0, 0, 0]}>
          <octahedronGeometry args={[0.8]} />
          <meshStandardMaterial 
            color="#8b5cf6"
            metalness={1}
            roughness={0}
            emissive="#8b5cf6"
            emissiveIntensity={0.2}
          />
        </mesh>
      </Float>
    </group>
  )
}

function NetworkGrid() {
  const lines = useMemo(() => {
    const gridSize = 10
    const step = 2
    const lineGeometries: THREE.Vector3[][] = []
    
    // Horizontal lines
    for (let i = -gridSize; i <= gridSize; i += step) {
      lineGeometries.push([
        new THREE.Vector3(-gridSize, 0, i),
        new THREE.Vector3(gridSize, 0, i)
      ])
    }
    
    // Vertical lines
    for (let i = -gridSize; i <= gridSize; i += step) {
      lineGeometries.push([
        new THREE.Vector3(i, 0, -gridSize),
        new THREE.Vector3(i, 0, gridSize)
      ])
    }
    
    return lineGeometries
  }, [])

  return (
    <group position={[0, -3, 0]}>
      {lines.map((points, index) => (
        <Line
          key={index}
          points={points}
          color="#1e293b"
          lineWidth={1}
          transparent
          opacity={0.3}
        />
      ))}
    </group>
  )
}

function AnimatedRings() {
  const ringsRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (ringsRef.current) {
      ringsRef.current.rotation.x = state.clock.elapsedTime * 0.1
      ringsRef.current.rotation.z = state.clock.elapsedTime * 0.05
    }
  })

  return (
    <group ref={ringsRef}>
      {[1.5, 2.5, 3.5].map((radius, index) => (
        <mesh key={index} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[radius, 0.05, 8, 32]} />
          <meshStandardMaterial 
            color="#06b6d4"
            transparent
            opacity={0.6 - index * 0.15}
            emissive="#06b6d4"
            emissiveIntensity={0.1}
          />
        </mesh>
      ))}
    </group>
  )
}

function HolographicElements() {
  const elementsRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (elementsRef.current) {
      elementsRef.current.children.forEach((child, index) => {
        child.position.y = Math.sin(state.clock.elapsedTime + index) * 0.2
      })
    }
  })

  return (
    <group ref={elementsRef}>
      {/* Floating UI Elements */}
      <mesh position={[-4, 2, 2]}>
        <planeGeometry args={[1.5, 1]} />
        <meshStandardMaterial 
          color="#1e293b"
          transparent
          opacity={0.8}
          emissive="#3b82f6"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      <mesh position={[4, -1, 1]}>
        <planeGeometry args={[1.2, 0.8]} />
        <meshStandardMaterial 
          color="#1e293b"
          transparent
          opacity={0.8}
          emissive="#10b981"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      <mesh position={[-2, -2, -1]}>
        <planeGeometry args={[1, 1.5]} />
        <meshStandardMaterial 
          color="#1e293b"
          transparent
          opacity={0.8}
          emissive="#f59e0b"
          emissiveIntensity={0.1}
        />
      </mesh>
    </group>
  )
}

export default function ProfessionalScene() {
  return (
    <Canvas
      camera={{ position: [0, 2, 8], fov: 60 }}
      style={{ height: '100vh', background: 'transparent' }}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        <Environment preset="warehouse" />
        
        {/* Professional Lighting Setup */}
        <ambientLight intensity={0.1} />
        <directionalLight 
          position={[5, 10, 5]} 
          intensity={0.8} 
          color="#ffffff"
          castShadow
        />
        <pointLight position={[-5, 5, -5]} intensity={0.6} color="#3b82f6" />
        <spotLight 
          position={[0, 8, 0]} 
          intensity={1} 
          angle={0.4} 
          penumbra={0.3} 
          color="#8b5cf6"
          castShadow
        />
        
        {/* Grid Foundation */}
        <NetworkGrid />
        
        {/* Animated Ring System */}
        <AnimatedRings />
        
        {/* Main Data Visualization */}
        <DataVisualization />
        
        {/* Holographic UI Elements */}
        <HolographicElements />
        
        {/* Performance Optimized Controls */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 1.8}
          minPolarAngle={Math.PI / 4}
          autoRotate
          autoRotateSpeed={0.2}
          dampingFactor={0.03}
          enableDamping
          rotateSpeed={0.5}
        />
      </Suspense>
    </Canvas>
  )
}