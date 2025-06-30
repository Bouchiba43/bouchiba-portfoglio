'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Stars } from '@react-three/drei'
import { Suspense } from 'react'
import DockerWhale from './DockerWhale'
import KubernetesCluster from './KubernetesCluster'
import JenkinsRobot from './JenkinsRobot'

export default function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 75 }}
      style={{ height: '100vh', background: 'transparent' }}
    >
      <Suspense fallback={null}>
        <Environment preset="night" />
        <Stars radius={300} depth={60} count={20000} factor={7} />
        
        {/* Ambient lighting */}
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        {/* 3D Models */}
        <DockerWhale position={[-4, 2, 0]} />
        <KubernetesCluster position={[4, -2, 0]} />
        <JenkinsRobot position={[0, 0, -2]} />
        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Suspense>
    </Canvas>
  )
}