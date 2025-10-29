// ==> src/components/Book.jsx
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { BookPage } from './BookPage';

export function Book({
  pages,              // tableau { image: string }
  currentSpread,      // index du spread courant (0,1,2, …)
  turnProgress,       // 0 → 1
  isTurningForward,   // true : on tourne la page de droite, false : la gauche
}) {
  // Pour le spread N : page gauche = 2N, page droite = 2N+1
  const leftPageIndex  = currentSpread * 2;
  const rightPageIndex = leftPageIndex + 1;

  // Spread suivant (utilisé pour le verso quand on tourne en avant)
  const nextLeftPageIndex  = leftPageIndex + 2;
  const nextRightPageIndex = rightPageIndex + 2;

  // Spread précédent (utilisé pour le verso quand on tourne en arrière)
  const prevLeftPageIndex  = leftPageIndex - 2;
  const prevRightPageIndex = rightPageIndex - 2;

  // Rotation de la page en cours de tournage
  const turningPageRotation = isTurningForward
    ? -turnProgress * Math.PI  // page droite tourne vers la droite
    :  turnProgress * Math.PI; // page gauche tourne vers la gauche

  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 45, near: 0.1, far: 1000 }}
      gl={{
        antialias: true,
        toneMapping: THREE.NoToneMapping,
        outputColorSpace: THREE.SRGBColorSpace,
      }}
    >
      <ambientLight intensity={2} />

      <Suspense fallback={null}>
        {/* --- ANIMATION AVANT (tourne la page de droite) --- */}
        {isTurningForward && turnProgress > 0 ? (
          <>
            {/* Spread suivant (déjà visible en-dessous) */}
            {pages[nextLeftPageIndex] && (
              <BookPage
                frontImageUrl={pages[nextLeftPageIndex].image}
                backImageUrl={null}
                position={[-1.25, 0, 0]}
                rotationY={0}
                side="left"
                zIndex={1}
              />
            )}
            {pages[nextRightPageIndex] && (
              <BookPage
                frontImageUrl={pages[nextRightPageIndex].image}
                backImageUrl={null}
                position={[1.25, 0, 0]}
                rotationY={0}
                side="right"
                zIndex={1}
              />
            )}

            {/* Page gauche courante (reste posée) */}
            {pages[leftPageIndex] && (
              <BookPage
                frontImageUrl={pages[leftPageIndex].image}
                backImageUrl={null}
                position={[-1.25, 0, 0]}
                rotationY={0}
                side="left"
                zIndex={5}
              />
            )}

            {/* Page droite en train de tourner : son verso = page gauche du spread suivant */}
            {pages[rightPageIndex] && (
              <BookPage
                frontImageUrl={pages[rightPageIndex].image}
                backImageUrl={pages[nextLeftPageIndex]?.image || null}
                position={[1.25, 0, 0]}
                rotationY={turningPageRotation}
                side="right"
                zIndex={10}
              />
            )}
          </>
        ) : /* --- ANIMATION ARRIÈRE (tourne la page de gauche) --- */
        !isTurningForward && turnProgress > 0 ? (
          <>
            {/* Spread précédent (déjà visible en-dessous) */}
            {pages[prevLeftPageIndex] && (
              <BookPage
                frontImageUrl={pages[prevLeftPageIndex].image}
                backImageUrl={null}
                position={[-1.25, 0, 0]}
                rotationY={0}
                side="left"
                zIndex={1}
              />
            )}
            {pages[prevRightPageIndex] && (
              <BookPage
                frontImageUrl={pages[prevRightPageIndex].image}
                backImageUrl={null}
                position={[1.25, 0, 0]}
                rotationY={0}
                side="right"
                zIndex={1}
              />
            )}

            {/* Page droite courante (reste posée) */}
            {pages[rightPageIndex] && (
              <BookPage
                frontImageUrl={pages[rightPageIndex].image}
                backImageUrl={null}
                position={[1.25, 0, 0]}
                rotationY={0}
                side="right"
                zIndex={5}
              />
            )}

            {/* Page gauche en train de tourner : son verso = page droite du spread précédent */}
            {pages[leftPageIndex] && (
              <BookPage
                frontImageUrl={pages[leftPageIndex].image}
                backImageUrl={pages[prevRightPageIndex]?.image || null}
                position={[-1.25, 0, 0]}
                rotationY={turningPageRotation}
                side="left"
                zIndex={10}
              />
            )}
          </>
        ) : (
          /* --- PAS D'ANIMATION : afficher simplement le spread courant --- */
          <>
            {pages[leftPageIndex] && (
              <BookPage
                frontImageUrl={pages[leftPageIndex].image}
                backImageUrl={null}
                position={[-1.25, 0, 0]}
                rotationY={0}
                side="left"
                zIndex={5}
              />
            )}
            {pages[rightPageIndex] && (
              <BookPage
                frontImageUrl={pages[rightPageIndex].image}
                backImageUrl={null}
                position={[1.25, 0, 0]}
                rotationY={0}
                side="right"
                zIndex={5}
              />
            )}
          </>
        )}
      </Suspense>

      {/* Relieur */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.12, 3.6, 0.15]} />
        <meshBasicMaterial color="#0a0a0a" />
      </mesh>
    </Canvas>
  );
}
