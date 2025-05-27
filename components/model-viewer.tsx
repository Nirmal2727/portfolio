"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera, Environment } from "@react-three/drei"
import { Suspense } from "react"

function Model() {
  // This would normally load a real model
  // For placeholder purposes, we'll create a simple cube
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#9333ea" />
    </mesh>
  )
}

function LoadingFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center text-white">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-t-purple-500 border-r-transparent border-b-pink-500 border-l-transparent rounded-full animate-spin mb-4"></div>
        <p>Loading 3D Model...</p>
      </div>
    </div>
  )
}

export default function ModelViewer() {
  return (
    <div className="w-full h-full bg-gray-900">
      <Canvas>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} />
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
          <Model />
          <Environment preset="night" />
          <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
        </Suspense>
      </Canvas>
      <div className="absolute bottom-4 left-4 text-xs text-gray-400">Click and drag to rotate • Scroll to zoom</div>
    </div>
  )
}
