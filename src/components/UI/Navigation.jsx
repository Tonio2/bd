import { motion, AnimatePresence } from 'framer-motion';

export function Navigation({
  currentPage,
  totalPages,
  canGoNext,
  canGoPrev,
  onNext,
  onPrev
}) {
  return (
    <>
      {/* Page counter */}
      <motion.div
        key="page-counter"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 glass-effect px-6 py-3 rounded-full"
      >
        <span className="text-white font-mono text-sm">
          {currentPage + 1} / {totalPages}
        </span>
      </motion.div>

      {/* Clickable zones for navigation */}
      <AnimatePresence>
        {/* Left zone - Previous page */}
        {canGoPrev && (
          <motion.div
            key="nav-prev"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onPrev}
            className="fixed left-0 top-0 bottom-0 w-1/3 z-40 cursor-w-resize group"
          >
            <div className="absolute left-8 top-1/2 transform -translate-y-1/2 glass-effect p-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </div>
          </motion.div>
        )}

        {/* Right zone - Next page */}
        {canGoNext && (
          <motion.div
            key="nav-next"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onNext}
            className="fixed right-0 top-0 bottom-0 w-1/3 z-40 cursor-e-resize group"
          >
            <div className="absolute right-8 top-1/2 transform -translate-y-1/2 glass-effect p-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard hints */}
      <motion.div
        key="keyboard-hints"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="fixed top-6 left-6 z-50 glass-effect px-4 py-2 rounded-lg"
      >
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <kbd className="px-2 py-1 bg-dark-700 rounded">←</kbd>
            <span>Précédent</span>
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-2 py-1 bg-dark-700 rounded">→</kbd>
            <span>Suivant</span>
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-2 py-1 bg-dark-700 rounded">Esc</kbd>
            <span>Fermer</span>
          </span>
        </div>
      </motion.div>
    </>
  );
}
