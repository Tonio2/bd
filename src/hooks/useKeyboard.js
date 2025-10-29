import { useEffect } from 'react';

export function useKeyboard(handlers) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'ArrowLeft':
          handlers.onLeft?.();
          event.preventDefault();
          break;
        case 'ArrowRight':
          handlers.onRight?.();
          event.preventDefault();
          break;
        case 'Escape':
          handlers.onEscape?.();
          event.preventDefault();
          break;
        case ' ':
          handlers.onSpace?.();
          event.preventDefault();
          break;
        case 'f':
        case 'F':
          if (event.ctrlKey || event.metaKey) return;
          handlers.onFullscreen?.();
          event.preventDefault();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
}
