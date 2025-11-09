document.addEventListener('DOMContentLoaded', () => {
  document.body.style.overflowY = 'auto';

  const burger = document.getElementById('burger');
  const navList = document.getElementById('navList');

  // mobile menu toggle
  if (burger && navList) {
    burger.addEventListener('click', (e) => {
      e.stopPropagation();
      navList.classList.toggle('open');
      document.body.style.overflow = navList.classList.contains('open') ? 'hidden' : 'auto';

      const burgerIcon = burger.querySelector('i');
      if (burgerIcon) {
        burgerIcon.classList.toggle('fa-bars');
        burgerIcon.classList.toggle('fa-x');
      }
    });

    const navLinks = navList.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navList.classList.remove('open');
        document.body.style.overflow = 'auto';
        const burgerIcon = burger.querySelector('i');
        if (burgerIcon) {
          burgerIcon.classList.remove('fa-x');
          burgerIcon.classList.add('fa-bars');
        }
      });
    });

    document.addEventListener('click', (event) => {
      if (navList.classList.contains('open') &&
          !navList.contains(event.target) &&
          !burger.contains(event.target)) {
        navList.classList.remove('open');
        document.body.style.overflow = 'auto';
        const burgerIcon = burger.querySelector('i');
        if (burgerIcon) {
          burgerIcon.classList.remove('fa-x');
          burgerIcon.classList.add('fa-bars');
        }
      }
    });
  }

  // reveal and autoplay
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion) {
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
      const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
      revealElements.forEach(el => observer.observe(el));
    }
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('show'));
  }

  document.querySelectorAll('video').forEach(video => {
    video.play().catch(() => console.log('autoplay blocked by browser'));
  });
});

function greet() {
  console.log('welcome');
}
