import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Universal Site-Wide Scroll Observer:
 * Automatically monitors elements with explicit animation classes (.fly-in, .fly-in-left, .fly-in-right, .scroll-reveal)
 * as well as major UI landmarks (.floating-action-card, .glass-card-hover, .lodge-card-frame, .print-card).
 * When scrolled into view, smoothly triggers their fluid entrance.
 */
export const useScrollObserver = () => {
  const location = useLocation();

  useEffect(() => {
    let observer: IntersectionObserver | null = null;

    const setupObserver = () => {
      // Collect all elements with explicit animation classes
      const explicitElements = Array.from(
        document.querySelectorAll<HTMLElement>(
          '.fly-in, .fly-in-left, .fly-in-right, .scroll-reveal'
        )
      );

      // Auto-tag major cards and containers across the entire site
      const autoCards = Array.from(
        document.querySelectorAll<HTMLElement>(
          '.floating-action-card:not(.fly-in):not(.scroll-reveal), .glass-card-hover:not(.fly-in):not(.scroll-reveal), .print-card:not(.fly-in):not(.scroll-reveal)'
        )
      );

      autoCards.forEach((card, idx) => {
        card.classList.add('scroll-reveal');
        // Add subtle staggered delay if grouped
        if (idx % 3 === 1) card.classList.add('delay-100');
        if (idx % 3 === 2) card.classList.add('delay-200');
      });

      const allElements = [...explicitElements, ...autoCards];
      if (allElements.length === 0) return;

      if (observer) {
        observer.disconnect();
      }

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-revealed');
              observer?.unobserve(entry.target);
            }
          });
        },
        {
          root: null,
          rootMargin: '0px 0px -50px 0px',
          threshold: 0.08,
        }
      );

      allElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        // If element is already in the viewport upon landing, reveal cleanly
        if (rect.top < window.innerHeight - 40 && rect.bottom > 0) {
          el.classList.add('is-revealed');
        } else {
          observer?.observe(el);
        }
      });
    };

    // Run initially after DOM settles
    const timeoutId = setTimeout(setupObserver, 80);

    // Watch for DOM additions (e.g. dynamic verification results or docket updates)
    const mutationObserver = new MutationObserver(() => {
      setupObserver();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      clearTimeout(timeoutId);
      observer?.disconnect();
      mutationObserver.disconnect();
    };
  }, [location.pathname]);
};
