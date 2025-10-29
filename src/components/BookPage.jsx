// ==> src/components/BookPage.jsx
import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

/**
 * BookPage : une page avec recto/verso.
 * Le verso est rendu sur le BackSide du même plan + flip UV pour éviter l'image miroir.
 */
export function BookPage({
  frontImageUrl,
  backImageUrl,
  position = [0, 0, 0],
  rotationY = 0,          // rotation actuelle sur Y
  side = 'right',         // 'left' ou 'right'
  zIndex = 0,
}) {
  const groupRef = useRef();
  const [frontTexture, setFrontTexture] = useState(null);
  const [backTexture, setBackTexture] = useState(null);

  // Front
  useEffect(() => {
    if (!frontImageUrl) return;
    const loader = new THREE.TextureLoader();
    const t = loader.load(
      frontImageUrl,
      (tex) => {
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.anisotropy = 16;
        tex.colorSpace = THREE.SRGBColorSpace;
        setFrontTexture(tex);
      },
      undefined,
      (err) => console.error('Error loading front texture:', err)
    );
    return () => t?.dispose?.();
  }, [frontImageUrl]);

  // Back
  useEffect(() => {
    if (!backImageUrl) {
      setBackTexture(null);
      return;
    }
    const loader = new THREE.TextureLoader();
    const t = loader.load(
      backImageUrl,
      (tex) => {
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.anisotropy = 16;
        tex.colorSpace = THREE.SRGBColorSpace;
        // Flip horizontal pour compenser le rendu BackSide
        tex.wrapS = THREE.RepeatWrapping;
        tex.repeat.x = -1;
        tex.offset.x = 1;
        setBackTexture(tex);
      },
      undefined,
      (err) => console.error('Error loading back texture:', err)
    );
    return () => t?.dispose?.();
  }, [backImageUrl]);

  // Appliquer la rotation
  useEffect(() => {
    if (groupRef.current) groupRef.current.rotation.y = rotationY;
  }, [rotationY]);

  if (!frontTexture) return null;

  // Pivot : page droite pivote autour du bord gauche, page gauche autour du bord droit
  const pivotX = side === 'right' ? -1.2 : 1.2;

  return (
    <group
      ref={groupRef}
      position={[position[0] + pivotX, position[1], position[2] + zIndex * 0.001]}
    >
      {/* Décaler le mesh pour pivoter autour du bord */}
      <group position={[-pivotX, 0, 0]}>
        {/* Recto */}
        <mesh>
          <planeGeometry args={[2.4, 3.6]} />
          <meshBasicMaterial map={frontTexture} side={THREE.FrontSide} toneMapped={false} />
        </mesh>

        {/* Verso (rendu sur le BackSide du même plan) */}
        <mesh>
          <planeGeometry args={[2.4, 3.6]} />
          {backTexture ? (
            <meshBasicMaterial
              map={backTexture}
              side={THREE.BackSide}
              toneMapped={false}
              polygonOffset
              polygonOffsetFactor={-1}
              polygonOffsetUnits={1}
            />
          ) : (
            <meshBasicMaterial
              color="#f8f8f8"
              side={THREE.BackSide}
              toneMapped={false}
              polygonOffset
              polygonOffsetFactor={-1}
              polygonOffsetUnits={1}
            />
          )}
        </mesh>

        {/* Tranche de la page */}
        <mesh
          position={[side === 'right' ? 1.2 : -1.2, 0, 0]}
          rotation={[0, Math.PI / 2, 0]}
        >
          <planeGeometry args={[0.002, 3.6]} />
          <meshBasicMaterial color="#f8f8f8" side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
}
