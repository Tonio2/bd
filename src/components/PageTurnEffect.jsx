import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Page3D } from './Page3D';
import * as THREE from 'three';

export function PageTurnEffect({
  leftPage,
  rightPage,
  curlProgress,
  isTurningLeft
}) {
  return (
    <Canvas
      camera={{
        position: [0, 0, 7],
        fov: 45,
        near: 0.1,
        far: 1000
      }}
      gl={{
        antialias: true,
        toneMapping: THREE.NoToneMapping,
        outputColorSpace: THREE.SRGBColorSpace,
      }}
    >
      {/* Strong lighting for clear visibility */}
      <ambientLight intensity={2.0} />

      <Suspense fallback={null}>
        {/* Left page - slightly rotated */}
        {leftPage && (
          <Page3D
            imageUrl={leftPage.image}
            position={[-1.25, 0, 0]}
            rotation={[0, Math.PI * 0.015, 0]}
            curlProgress={isTurningLeft ? curlProgress : 0}
            side="left"
          />
        )}

        {/* Right page - slightly rotated */}
        {rightPage && (
          <Page3D
            imageUrl={rightPage.image}
            position={[1.25, 0, 0]}
            rotation={[0, -Math.PI * 0.015, 0]}
            curlProgress={!isTurningLeft ? curlProgress : 0}
            side="right"
          />
        )}
      </Suspense>

      {/* Book spine/binding */}
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[0.12, 3.6, 0.15]} />
        <meshBasicMaterial color="#0a0a0a" />
      </mesh>
    </Canvas>
  );
}
