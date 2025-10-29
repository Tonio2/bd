import { useRef, useEffect, useState } from 'react';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

export function Page3D({
  imageUrl,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  curlProgress = 0,
  side = 'right' // 'left' or 'right'
}) {
  const meshRef = useRef();
  const geometryRef = useRef();
  const [texture, setTexture] = useState(null);

  // Load texture with error handling
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      imageUrl,
      (loadedTexture) => {
        loadedTexture.minFilter = THREE.LinearFilter;
        loadedTexture.magFilter = THREE.LinearFilter;
        loadedTexture.anisotropy = 16;
        loadedTexture.colorSpace = THREE.SRGBColorSpace;
        loadedTexture.needsUpdate = true;
        setTexture(loadedTexture);
      },
      undefined,
      (error) => {
        console.error('Error loading texture:', imageUrl, error);
      }
    );
  }, [imageUrl]);

  // Create geometry once
  useEffect(() => {
    if (!geometryRef.current) {
      geometryRef.current = new THREE.PlaneGeometry(2.4, 3.6, 60, 60);
      // Store original positions
      geometryRef.current.userData.originalPositions =
        new Float32Array(geometryRef.current.attributes.position.array);
    }
  }, []);

  // Apply curl deformation
  useEffect(() => {
    if (!geometryRef.current) return;

    const geometry = geometryRef.current;
    const positions = geometry.attributes.position;
    const originalPositions = geometry.userData.originalPositions;

    if (!originalPositions) return;

    // Reset to original positions first
    positions.array.set(originalPositions);

    // Apply curl if in progress
    if (curlProgress > 0.01) {
      for (let i = 0; i < positions.count; i++) {
        const i3 = i * 3;
        const x = originalPositions[i3];
        const y = originalPositions[i3 + 1];

        // Normalize X position to 0-1 range
        const normalizedX = (x + 1.2) / 2.4; // 0 at left edge, 1 at right edge

        let curlAmount = 0;

        if (side === 'right') {
          // Right page curls from right edge toward viewer (left)
          // Only curl the right portion of the page
          if (normalizedX > 0.3) {
            // Progress of curl from right edge
            const edgeProgress = (normalizedX - 0.3) / 0.7;
            curlAmount = edgeProgress * curlProgress;
          }
        } else {
          // Left page curls from left edge toward viewer (right)
          // Only curl the left portion of the page
          if (normalizedX < 0.7) {
            // Progress of curl from left edge
            const edgeProgress = (0.7 - normalizedX) / 0.7;
            curlAmount = edgeProgress * curlProgress;
          }
        }

        if (curlAmount > 0) {
          // Cylindrical curl
          const curlRadius = 1.0;
          const angle = curlAmount * Math.PI * 0.6; // Max ~108 degrees

          if (side === 'right') {
            // Curl toward viewer (negative Z) and to the left
            const offsetX = -curlRadius * Math.sin(angle);
            const offsetZ = curlRadius * (1 - Math.cos(angle)); // Positive Z = toward viewer

            positions.array[i3] = x + offsetX;
            positions.array[i3 + 2] = offsetZ;
          } else {
            // Curl toward viewer (negative Z) and to the right
            const offsetX = curlRadius * Math.sin(angle);
            const offsetZ = curlRadius * (1 - Math.cos(angle)); // Positive Z = toward viewer

            positions.array[i3] = x + offsetX;
            positions.array[i3 + 2] = offsetZ;
          }
        }
      }
    }

    positions.needsUpdate = true;
    geometry.computeVertexNormals();
  }, [curlProgress, side]);

  if (!geometryRef.current || !texture) return null;

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      geometry={geometryRef.current}
      castShadow
      receiveShadow
    >
      <meshBasicMaterial
        map={texture}
        side={THREE.DoubleSide}
        toneMapped={false}
      />
    </mesh>
  );
}
