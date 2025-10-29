import { motion } from 'framer-motion';

export function CloseButton({ onClick }) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.1, rotate: 90 }}
      whileTap={{ scale: 0.9 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className="fixed top-6 right-6 z-50 w-12 h-12 flex items-center justify-center rounded-full glass-effect hover:bg-dark-700 transition-colors duration-200 group"
      aria-label="Fermer"
    >
      <svg
        className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors duration-200"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </motion.button>
  );
}
