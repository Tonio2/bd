import { motion } from 'framer-motion';

export function ComicCard({ comic, onClick, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      whileHover={{
        y: -15,
        scale: 1.02,
        transition: { duration: 0.3, ease: 'easeOut' }
      }}
      onClick={onClick}
      className="group relative cursor-pointer"
    >
      {/* Card container */}
      <div className="relative overflow-hidden rounded-lg shadow-2xl transition-shadow duration-300 group-hover:shadow-accent-gold/30">
        {/* Cover image */}
        <div className="aspect-[2/3] relative bg-dark-800">
          <img
            src={comic.coverImage}
            alt={`Couverture de ${comic.title}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Hover info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileHover={{ opacity: 1, y: 0 }}
            className="absolute inset-0 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <p className="text-sm text-gray-300 mb-2 line-clamp-2">
              {comic.description}
            </p>
            <p className="text-xs text-accent-gold font-medium">
              {comic.totalPages} pages • {comic.author}
            </p>
          </motion.div>
        </div>

        {/* Border effect on hover */}
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-accent-gold/30 rounded-lg transition-colors duration-300 pointer-events-none" />
      </div>

      {/* Title below */}
      <div className="mt-4 px-2">
        <h3 className="text-xl font-display font-bold text-white mb-1 group-hover:text-accent-gold transition-colors duration-300">
          {comic.title}
        </h3>
        <div className="flex flex-wrap gap-2 mt-2">
          {comic.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 rounded-full bg-dark-700 text-gray-400 group-hover:bg-dark-600 group-hover:text-accent-gold transition-colors duration-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-accent-gold/0 via-accent-gold/20 to-accent-gold/0 rounded-lg opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10" />
    </motion.div>
  );
}
