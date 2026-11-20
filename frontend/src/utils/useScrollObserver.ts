import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Global Scroll Observer hook:
 * Automatically monitors all elements with .fly-in, .fly-in-left, .fly-in-right classes.
 * When they enter the viewport during scrolling, it triggers their fluid flying entrance.
 */
export const useScrollObserver = () => {
  const location = useLocation();

  useEffect(() => {
    // Small timeout to allow DOM to render after route transition
    const timeoutId = setTimeout(() => {
      const elements = document.querySelectorAll<HTMLElement>(
        '.fly-in, .fly-in-left, .fly-in-right'
      );

      if (!elements || elements.length === 0) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-revealed');
              // We can unobserve so it remains revealed once flown in
              observer.unobserve(entry.target);
            }
          });
        },
        {
          root: null,
          rootMargin: '0px 0px -40px 0px', // triggers slightly before scrolling fully into view
          threshold: 0.1,
        }
      );

      elements.forEach((el) => {
        // If element is already in viewport, reveal immediately with a tiny cascade
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 50 && rect.bottom > 0) {
          el.classList.add('is-revealed');
        } else {
          observer.observe(el);
        }
      });

      return () => {
        observer.disconnect();
      };
    }, 60);

    return () => clearTimeout(timeoutId);
  }, [location.pathname]);
};
