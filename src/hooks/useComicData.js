import { useState, useEffect } from 'react';
import comicsData from '../data/comics.json';

export function useComicData() {
  const [comics, setComics] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate async loading (in case we fetch from API later)
    setTimeout(() => {
      setComics(comicsData.comics);
      setSettings(comicsData.settings);
      setLoading(false);
    }, 100);
  }, []);

  return { comics, settings, loading };
}

export function useComic(comicId) {
  const { comics, loading } = useComicData();
  const comic = comics.find(c => c.id === comicId);

  return { comic, loading };
}
