// ==> src/components/BookPage.jsx
import { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';

const textureCache = new Map();

function loadTexture(url) {
  if (!url) return null;
  if (textureCache.has(url)) return textureCache.get(url);

  const loader = new THREE.TextureLoader();
  const texture = loader.load(url);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = 16;
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set(url, texture);
  return texture;
}

/**
 * BookPage : une page recto/verso qui pivote autour de la tranche centrale.
 */
export function BookPage({
  frontImageUrl,
  backImageUrl,
  position = [0, 0, 0],
  rotationY = 0,
  side = 'right',          // 'left' ou 'right'
  renderOrderBase = 0,     // verso = base, recto = base+1
}) {
  const groupRef = useRef();

  // Préchargement et mise en cache
  const frontTexture = useMemo(() => loadTexture(frontImageUrl), [frontImageUrl]);
  const backTexture  = useMemo(() => loadTexture(backImageUrl),  [backImageUrl]);

  // Mise à jour de la rotation
  useEffect(() => {
    if (groupRef.current) groupRef.current.rotation.y = rotationY;
  }, [rotationY]);

  if (!frontTexture) return null;

  const PAGE_WIDTH = 2.4;
  const PAGE_HALF = PAGE_WIDTH / 2;
  const SPINE_GAP = 0.105;
  const HALF_SPINE = SPINE_GAP / 2;
  const EPS = 0.002; // légèrement augmenté pour éviter z-fighting

  const pivotX = side === 'right'
    ? -(PAGE_HALF + HALF_SPINE)
    : (PAGE_HALF + HALF_SPINE);

  return (
    <group ref={groupRef} position={[position[0] + pivotX, position[1], position[2]]}>
      <group position={[-pivotX, 0, 0]}>
        {/* Verso */}
        <mesh
          renderOrder={renderOrderBase}
          position={[0, 0, -EPS]}
          rotation={[0, Math.PI, 0]}
        >
          <planeGeometry args={[PAGE_WIDTH, 3.6]} />
          <meshBasicMaterial
            map={backTexture}
            color={backTexture ? undefined : "#f8f8f8"}
            side={THREE.DoubleSide}  // ✅ plus de face noire
            toneMapped={false}
          />
        </mesh>

        {/* Recto */}
        <mesh renderOrder={renderOrderBase + 1} position={[0, 0, EPS]}>
          <planeGeometry args={[PAGE_WIDTH, 3.6]} />
          <meshBasicMaterial
            map={frontTexture}
            side={THREE.FrontSide}
            toneMapped={false}
          />
        </mesh>

        {/* Tranche */}
        <mesh
          renderOrder={renderOrderBase + 2}
          position={[side === 'right' ? PAGE_HALF : -PAGE_HALF, 0, 0]}
          rotation={[0, Math.PI / 2, 0]}
        >
          <planeGeometry args={[0.002, 3.6]} />
          <meshBasicMaterial color="#f8f8f8" side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
}
