import { motion } from 'framer-motion';
import { ComicCard } from './ComicCard';
import { useComicData } from '../hooks/useComicData';

export function ComicGallery({ onSelectComic }) {
  const { comics, loading } = useComicData();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-accent-gold border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto mb-12"
      >
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-center text-white mb-4 text-shadow">
          Bibliothèque de BD
        </h1>
        <p className="text-center text-gray-400 text-lg">
          Découvrez nos bandes dessinées immersives
        </p>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-32 h-1 bg-gradient-to-r from-transparent via-accent-gold to-transparent mx-auto mt-6"
        />
      </motion.div>

      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {comics.map((comic, index) => (
            <ComicCard
              key={comic.id}
              comic={comic}
              index={index}
              onClick={() => onSelectComic(comic)}
            />
          ))}
        </div>
      </div>

      {/* Empty state */}
      {comics.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <p className="text-gray-500 text-xl">Aucune bande dessinée disponible</p>
        </motion.div>
      )}

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="max-w-7xl mx-auto mt-20 text-center text-gray-600 text-sm"
      >
        <p>Lecteur de BD Immersif • {new Date().getFullYear()}</p>
      </motion.footer>
    </div>
  );
}
