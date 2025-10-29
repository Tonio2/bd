// ==> src/components/Book.jsx
import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { BookPage } from './BookPage';

/**
 * Book : rend le livre complet avec ses pages et les transitions entre spreads.
 */
export function Book({
  pages,              // [{ image: string }, ...]
  currentSpread,      // index du spread affiché
  turnProgress,       // 0..1
  isTurningForward,   // true = tourne la page de droite
}) {
  // Indices des pages du spread courant
  const leftPageIndex  = currentSpread * 2;
  const rightPageIndex = leftPageIndex + 1;

  // Spreads adjacent
  const nextLeftPageIndex  = leftPageIndex + 2;
  const nextRightPageIndex = rightPageIndex + 2;
  const prevLeftPageIndex  = leftPageIndex - 2;
  const prevRightPageIndex = rightPageIndex - 2;

  // Rotation dynamique de la page en train de tourner
  const turningPageRotation = useMemo(() => (
    isTurningForward ? -turnProgress * Math.PI : turnProgress * Math.PI
  ), [isTurningForward, turnProgress]);

  // Positions des pages (largeur 2.4 → demi 1.2 + marge)
  const LEFT_X  = -1.25;
  const RIGHT_X =  1.25;

  // Ordres de rendu (plus grand = au-dessus)
  const UNDER_ORDER  = 1;
  const STATIC_ORDER = 5;
  const TURN_ORDER   = 10;

  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 45, near: 0.1, far: 1000 }}
      gl={{
        antialias: true,
        toneMapping: THREE.NoToneMapping,
        outputColorSpace: THREE.SRGBColorSpace,
        preserveDrawingBuffer: true, // ✅ empêche certains clignotements
      }}
    >
      <ambientLight intensity={2} />

      <Suspense fallback={null}>
        {/* === PAGE TOURNEE EN AVANT === */}
        {isTurningForward && turnProgress > 0 ? (
          <>
            {/* Spread suivant sous la page qui tourne */}
            {pages[nextLeftPageIndex] && (
              <BookPage
                frontImageUrl={pages[nextLeftPageIndex].image}
                position={[LEFT_X, 0, 0]}
                rotationY={0}
                side="left"
                renderOrderBase={UNDER_ORDER}
              />
            )}
            {pages[nextRightPageIndex] && (
              <BookPage
                frontImageUrl={pages[nextRightPageIndex].image}
                position={[RIGHT_X, 0, 0]}
                rotationY={0}
                side="right"
                renderOrderBase={UNDER_ORDER}
              />
            )}

            {/* Page gauche courante (immobile) */}
            {pages[leftPageIndex] && (
              <BookPage
                frontImageUrl={pages[leftPageIndex].image}
                position={[LEFT_X, 0, 0]}
                side="left"
                renderOrderBase={STATIC_ORDER}
              />
            )}

            {/* Page droite qui tourne */}
            {pages[rightPageIndex] && (
              <BookPage
                frontImageUrl={pages[rightPageIndex].image}
                backImageUrl={pages[nextLeftPageIndex]?.image}
                position={[RIGHT_X, 0, 0]}
                rotationY={turningPageRotation}
                side="right"
                renderOrderBase={TURN_ORDER}
              />
            )}
          </>
        ) : /* === PAGE TOURNEE EN ARRIÈRE === */ !isTurningForward && turnProgress > 0 ? (
          <>
            {/* Spread précédent sous la page qui tourne */}
            {pages[prevLeftPageIndex] && (
              <BookPage
                frontImageUrl={pages[prevLeftPageIndex].image}
                position={[LEFT_X, 0, 0]}
                side="left"
                renderOrderBase={UNDER_ORDER}
              />
            )}
            {pages[prevRightPageIndex] && (
              <BookPage
                frontImageUrl={pages[prevRightPageIndex].image}
                position={[RIGHT_X, 0, 0]}
                side="right"
                renderOrderBase={UNDER_ORDER}
              />
            )}

            {/* Page droite courante (immobile) */}
            {pages[rightPageIndex] && (
              <BookPage
                frontImageUrl={pages[rightPageIndex].image}
                position={[RIGHT_X, 0, 0]}
                side="right"
                renderOrderBase={STATIC_ORDER}
              />
            )}

            {/* Page gauche qui tourne */}
            {pages[leftPageIndex] && (
              <BookPage
                frontImageUrl={pages[leftPageIndex].image}
                backImageUrl={pages[prevRightPageIndex]?.image}
                position={[LEFT_X, 0, 0]}
                rotationY={turningPageRotation}
                side="left"
                renderOrderBase={TURN_ORDER}
              />
            )}
          </>
        ) : /* === AUCUNE PAGE EN ROTATION === */ (
          <>
            {pages[leftPageIndex] && (
              <BookPage
                frontImageUrl={pages[leftPageIndex].image}
                position={[LEFT_X, 0, 0]}
                side="left"
                renderOrderBase={STATIC_ORDER}
              />
            )}
            {pages[rightPageIndex] && (
              <BookPage
                frontImageUrl={pages[rightPageIndex].image}
                position={[RIGHT_X, 0, 0]}
                side="right"
                renderOrderBase={STATIC_ORDER}
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
