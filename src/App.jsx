import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ComicGallery } from './components/ComicGallery';
import { ComicBook } from './components/ComicBook';

function App() {
  const [selectedComic, setSelectedComic] = useState(null);

  return (
    <div className="min-h-screen bg-dark-900">
      <AnimatePresence mode="wait">
        {!selectedComic ? (
          <ComicGallery
            key="gallery"
            onSelectComic={setSelectedComic}
          />
        ) : (
          <ComicBook
            key="book"
            comic={selectedComic}
            onClose={() => setSelectedComic(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
