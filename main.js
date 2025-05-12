// Main JavaScript for bunion.info
document.addEventListener('DOMContentLoaded', () => {
  // Runs after HTML is loaded.

  // --- Body Scrollability ---
  // Enable body scroll.
  document.body.style.overflowY = 'auto';

  // --- Mobile Menu ---
  const burger = document.getElementById('burger');
  const navList = document.getElementById('navList');

  if (burger && navList) {
    // Burger click: toggle menu.
    burger.addEventListener('click', (e) => {
      e.stopPropagation(); // Stop click bubbling.
      navList.classList.toggle('open'); // Toggle menu visibility.

      // Toggle body scroll with menu.
      if (navList.classList.contains('open')) {
        document.body.style.overflow = 'hidden'; // Disable scroll.
      } else {
        document.body.style.overflow = 'auto';   // Enable scroll.
      }

      // Toggle burger icon.
      const burgerIcon = burger.querySelector('i');
      if (burgerIcon) {
        burgerIcon.classList.toggle('fa-bars');
        burgerIcon.classList.toggle('fa-x');
      }
    });

    // Nav link click: close menu.
    const navLinks = navList.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navList.classList.remove('open');      // Close menu.
        document.body.style.overflow = 'auto'; // Restore scroll.

        // Reset burger icon.
        const burgerIcon = burger.querySelector('i');
        if (burgerIcon) {
          burgerIcon.classList.remove('fa-x');
          burgerIcon.classList.add('fa-bars');
        }
      });
    });

    // Click outside menu: close menu.
    document.addEventListener('click', (event) => {
      if (navList.classList.contains('open') &&
          !navList.contains(event.target) &&
          !burger.contains(event.target)) {
        navList.classList.remove('open');      // Close menu.
        document.body.style.overflow = 'auto'; // Restore scroll.

        // Reset burger icon.
        const burgerIcon = burger.querySelector('i');
        if (burgerIcon) {
          burgerIcon.classList.remove('fa-x');
          burgerIcon.classList.add('fa-bars');
        }
      }
    });
  } // End mobile menu

  // --- Section Reveal Animations ---
  // Check for reduced motion preference.
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    // Reveal elements on scroll.
    const revealElements = document.querySelectorAll('.reveal');

    if (revealElements.length > 0) {
      const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
      };

      // Observe elements entering viewport.
      const intersectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show'); // Show element.
            observer.unobserve(entry.target);   // Stop observing.
          }
        });
      }, observerOptions);

      // Observe all '.reveal' elements.
      revealElements.forEach(element => {
        intersectionObserver.observe(element);
      });
    }
  } else {
    // Reduced motion: show elements immediately.
    document.querySelectorAll('.reveal').forEach(el => {
      el.classList.add('show');
    });
  } // End reveal animations

  // --- Video Autoplay ---
  // Attempt video autoplay.
  const videos = document.querySelectorAll('video');
  videos.forEach(video => {
    video.play().catch(err => {
      // Log autoplay prevention.
      console.log('Video auto-play prevented.');
    });
  }); // End video autoplay

});
