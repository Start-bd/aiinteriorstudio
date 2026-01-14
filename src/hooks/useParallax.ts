import { useState, useEffect } from 'react';

interface ParallaxValues {
  scrollY: number;
  slow: number;    // 0.1x speed
  medium: number;  // 0.3x speed
  fast: number;    // 0.5x speed
}

export const useParallax = (): ParallaxValues => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Use requestAnimationFrame for smooth performance
      requestAnimationFrame(() => {
        setScrollY(window.scrollY);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return {
    scrollY,
    slow: scrollY * 0.1,
    medium: scrollY * 0.3,
    fast: scrollY * 0.5,
  };
};
