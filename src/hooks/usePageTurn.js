import { useState, useCallback } from 'react';

// Hook for managing page spreads (2 pages at a time like a real book)
export function usePageTurn(totalPages, onPageChange = null) {
  const [currentSpread, setCurrentSpread] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState(null); // 'next' or 'prev'

  // Calculate total spreads (pairs of pages)
  const totalSpreads = Math.ceil(totalPages / 2);

  const goToNextPage = useCallback(() => {
    if (isAnimating || currentSpread >= totalSpreads - 1) return;

    setIsAnimating(true);
    setDirection('next');

    // Change spread AFTER animation completes
    setTimeout(() => {
      setCurrentSpread(prev => prev + 1);
      if (onPageChange) onPageChange(currentSpread + 1);
      setIsAnimating(false);
      setDirection(null);
    }, 1000); // Match animation duration in ComicBook.jsx
  }, [currentSpread, totalSpreads, isAnimating, onPageChange]);

  const goToPrevPage = useCallback(() => {
    if (isAnimating || currentSpread <= 0) return;

    setIsAnimating(true);
    setDirection('prev');

    // Change spread AFTER animation completes
    setTimeout(() => {
      setCurrentSpread(prev => prev - 1);
      if (onPageChange) onPageChange(currentSpread - 1);
      setIsAnimating(false);
      setDirection(null);
    }, 1000); // Match animation duration in ComicBook.jsx
  }, [currentSpread, isAnimating, onPageChange]);

  const goToPage = useCallback((spreadNumber) => {
    if (isAnimating || spreadNumber < 0 || spreadNumber >= totalSpreads) return;

    setIsAnimating(true);
    setDirection(spreadNumber > currentSpread ? 'next' : 'prev');

    setTimeout(() => {
      setCurrentSpread(spreadNumber);
      if (onPageChange) onPageChange(spreadNumber);
      setIsAnimating(false);
      setDirection(null);
    }, 1000);
  }, [currentSpread, totalSpreads, isAnimating, onPageChange]);

  return {
    currentPage: currentSpread, // Keep same name for compatibility
    currentSpread,
    isAnimating,
    direction,
    goToNextPage,
    goToPrevPage,
    goToPage,
    canGoNext: currentSpread < totalSpreads - 1,
    canGoPrev: currentSpread > 0,
    totalSpreads,
  };
}
