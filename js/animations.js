// Small helpers: hero entrance, remove shimmer when images load, manage chip toggle animation
document.addEventListener('DOMContentLoaded', () => {
  // Hero entrance: add .hero-entrance to hero container
  const hero = document.querySelector('.hero') || document.querySelector('.billboard');
  if (hero) hero.classList.add('hero-entrance');

  // Shimmer: remove shimmer when images inside cards load
  document.querySelectorAll('.shimmer img, .card img.artwork, .card img').forEach(img => {
    const parentShimmer = img.closest('.shimmer');
    const parentCard = img.closest('.card');
    const markLoaded = () => {
      if (parentShimmer) parentShimmer.classList.add('loaded');
      if (parentCard) parentCard.classList.add('loaded');
    };

    if (img.complete && img.naturalWidth !== 0) {
      markLoaded();
    } else {
      img.addEventListener('load', markLoaded, { once: true });
      img.addEventListener('error', markLoaded, { once: true });
    }
  });

  // Vibe chips: add quick active class, remove after animation to allow re-toggling
  document.querySelectorAll('.vibe-chip').forEach(chip => {
    chip.addEventListener('click', (e) => {
      chip.classList.add('active');
      setTimeout(() => chip.classList.remove('active'), 460);
      // If your app toggles selection with .selected, leave that logic to existing code
      chip.classList.toggle('selected');
    });
  });

  // Optional: small focus-visible tweak to make keyboard focus more visible on cards
  document.querySelectorAll('.card').forEach(c => {
    c.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') c.click?.();
    });
  });
});
