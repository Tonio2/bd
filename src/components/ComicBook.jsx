import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Book } from './Book';
import { CloseButton } from './UI/CloseButton';
import { FullscreenButton } from './UI/FullscreenButton';
import { Navigation } from './UI/Navigation';
import { usePageTurn } from '../hooks/usePageTurn';
import { useKeyboard } from '../hooks/useKeyboard';
import { useAudio, PAGE_TURN_SOUND } from '../hooks/useAudio';

export function ComicBook({ comic, onClose }) {
  const [isOpening, setIsOpening] = useState(true);
  const [turnProgress, setTurnProgress] = useState(0);
  const [isTurningForward, setIsTurningForward] = useState(true);

  const {
    currentSpread,
    isAnimating,
    direction,
    goToNextPage,
    goToPrevPage,
    canGoNext,
    canGoPrev,
    totalSpreads,
  } = usePageTurn(comic.pages.length);

  const { play: playPageTurn } = useAudio(PAGE_TURN_SOUND, {
    volume: 0.3,
    preload: true
  });

  // Opening animation - wait for textures to load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpening(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Page turn animation
  useEffect(() => {
    if (isAnimating) {
      playPageTurn();
      setIsTurningForward(direction === 'next');

      let progress = 0;
      const duration = 1000; // ms - slightly longer for smooth effect
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        progress = Math.min(elapsed / duration, 1);

        // Easing function (ease-in-out)
        const eased = progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        setTurnProgress(eased);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setTurnProgress(0);
        }
      };

      animate();
    }
  }, [isAnimating, direction, playPageTurn]);

  // Keyboard controls
  useKeyboard({
    onLeft: goToPrevPage,
    onRight: goToNextPage,
    onEscape: onClose,
    onSpace: goToNextPage,
    onFullscreen: () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 bg-dark-900 z-40"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-radial from-dark-800 to-dark-900" />

      {/* 3D Book */}
      <div className="absolute inset-0 flex items-center justify-center">
        {!isOpening && (
          <div className="w-full h-full">
            <Book
              pages={comic.pages}
              currentSpread={currentSpread}
              turnProgress={isAnimating ? turnProgress : 0}
              isTurningForward={isTurningForward}
            />
          </div>
        )}
      </div>

      {/* Loading state */}
      {isOpening && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 border-4 border-accent-gold border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-white text-lg font-display">{comic.title}</p>
            <p className="text-gray-400 text-sm mt-2">Chargement du livre...</p>
          </div>
        </motion.div>
      )}

      {/* UI Overlay */}
      {!isOpening && (
        <>
          <CloseButton onClick={onClose} />
          <FullscreenButton />
          <Navigation
            currentPage={currentSpread}
            totalPages={totalSpreads}
            canGoNext={canGoNext}
            canGoPrev={canGoPrev}
            onNext={goToNextPage}
            onPrev={goToPrevPage}
          />
        </>
      )}

      {/* Comic title overlay (fades out after 3 seconds) */}
      {!isOpening && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 3, duration: 1 }}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30"
        >
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white text-shadow text-center">
            {comic.title}
          </h2>
        </motion.div>
      )}
    </motion.div>
  );
}
