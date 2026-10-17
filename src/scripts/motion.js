import { r as reducedMotionQuery } from './media.js';

export function initDividers() {
  const dividers = document.querySelectorAll('[data-expand-divider]');
  if (!dividers.length) return;

  const reducedMotion = window.matchMedia(reducedMotionQuery).matches;
  if (reducedMotion) {
    dividers.forEach((d) => {
      d.classList.remove('scale-x-0');
      d.classList.add('scale-x-100');
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.remove('scale-x-0');
          entry.target.classList.add('scale-x-100');
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.1 }
  );

  dividers.forEach((d) => observer.observe(d));
}

export function initTextScramble() {
  const elements = document.querySelectorAll('[data-scramble]');
  if (!elements.length) return;

  const reducedMotion = window.matchMedia(reducedMotionQuery).matches;
  if (reducedMotion) return;

  const chars = '0123456789ABCDEF_//[]><#$*!';

  const scramble = (el) => {
    if (el.dataset.scrambled === 'true') return;
    el.dataset.scrambled = 'true';

    const target = (el.textContent || '').trim();
    if (!target) return;

    el.setAttribute('aria-label', target);
    const length = target.length;
    const duration = 350;
    const startTime = performance.now();

    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // High-damping progress curve: fast initial decode, smooth settle
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const settledCount = Math.floor(easeProgress * length);

      let output = '';
      for (let i = 0; i < length; i++) {
        const char = target[i];
        if (char === ' ' || char === '\n' || char === '\t') {
          output += char;
        } else if (i < settledCount) {
          output += char;
        } else {
          output += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      el.textContent = output;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    };

    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          scramble(entry.target);
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.15 }
  );

  elements.forEach((el) => observer.observe(el));
}

export function initMotion() {
  initDividers();
  initTextScramble();
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMotion);
  } else {
    initMotion();
  }
}

