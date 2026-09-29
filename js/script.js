/* =========================================================
   PORTFOLIO SCRIPT
   Vanilla JavaScript only — no libraries or frameworks.

   Note: Smooth scrolling for the nav links is already handled
   in style.css with `html { scroll-behavior: smooth; }`, so it
   is not duplicated here. The initial dark-mode preference is
   applied by a tiny script in index.html's <head> (before this
   file even loads), so the page never flashes light-then-dark.
========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------------------------------------------------------
     1. Close the mobile menu after a nav link is clicked
     The menu itself opens/closes via the #nav-toggle checkbox
     in your CSS. This just unchecks it once a link is used.
  --------------------------------------------------------- */
  var navToggle = document.getElementById('nav-toggle');
  var navLinks = document.querySelectorAll('.nav-link');

  if (navToggle && navLinks.length > 0) {
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.checked = false;
      });
    });
  }

  /* ---------------------------------------------------------
     2. Dark mode toggle button
     A small button in the navbar that switches between the
     light and dark palettes defined in style.css, and
     remembers the choice for next time.
  --------------------------------------------------------- */
  var themeToggle = document.createElement('button');
  themeToggle.type = 'button';
  themeToggle.className = 'theme-toggle';
  themeToggle.setAttribute('aria-label', 'Toggle dark mode');

  function isDarkMode() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }

  function updateThemeIcon() {
    themeToggle.textContent = isDarkMode() ? '☀️' : '🌙';
  }

  updateThemeIcon();

  themeToggle.addEventListener('click', function () {
    if (isDarkMode()) {
      document.documentElement.removeAttribute('data-theme');
      try { localStorage.setItem('theme', 'light'); } catch (e) { /* ignore */ }
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      try { localStorage.setItem('theme', 'dark'); } catch (e) { /* ignore */ }
    }
    updateThemeIcon();
  });

  var navRight = document.querySelector('.nav-right');
  if (navRight) {
    navRight.prepend(themeToggle);
  } else {
    document.body.appendChild(themeToggle);
  }

  /* ---------------------------------------------------------
     3. Back-to-top button
     Appears once you scroll down a bit; clicking it scrolls
     smoothly back to the top of the page.
  --------------------------------------------------------- */
  var backToTop = document.createElement('button');
  backToTop.type = 'button';
  backToTop.className = 'back-to-top';
  backToTop.setAttribute('aria-label', 'Back to top');
  backToTop.textContent = '↑';

  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  document.body.appendChild(backToTop);

  /* ---------------------------------------------------------
     4. Scroll progress bar
     A thin bar across the very top that fills up as you
     scroll down the page.
  --------------------------------------------------------- */
  var progressBar = document.createElement('div');
  progressBar.id = 'scroll-progress';
  document.body.appendChild(progressBar);

  /* ---------------------------------------------------------
     5. Navbar shadow + back-to-top visibility + progress bar
     All three depend on scroll position, so they share one
     scroll listener to keep things efficient.
  --------------------------------------------------------- */
  var navbar = document.querySelector('.navbar');

  function handleScroll() {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var scrolledPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (navbar) {
      navbar.style.boxShadow = scrollTop > 20 ? '0 4px 10px rgba(23, 57, 77, 0.12)' : 'none';
    }

    backToTop.classList.toggle('is-visible', scrollTop > 400);
    progressBar.style.width = scrolledPercent + '%';
  }

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // run once in case the page loads already scrolled

  /* ---------------------------------------------------------
     6. Scroll-reveal animation
     Sections and cards gently fade + slide into view as you
     scroll down to them. Skipped entirely for anyone who has
     "reduce motion" turned on in their system settings.
  --------------------------------------------------------- */
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var revealTargets = document.querySelectorAll(
    '.section-title, .about-image, .about-text, ' +
    '.project-card, .skills-group, ' +
    '.contact-list, .hero-text, .hero-visual'
  );

  if (!prefersReducedMotion && revealTargets.length > 0 && 'IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -5% 0px' });

    revealTargets.forEach(function (target) {
      target.classList.add('reveal');
      revealObserver.observe(target);
    });
  }

  /* ---------------------------------------------------------
     7. Highlight the current section's nav link while scrolling
  --------------------------------------------------------- */
  var sections = document.querySelectorAll('main section[id], footer[id]');

  if (sections.length > 0 && 'IntersectionObserver' in window) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var matchingLink = document.querySelector('.nav-link[href="#' + entry.target.id + '"]');
        if (!matchingLink) return;

        if (entry.isIntersecting) {
          navLinks.forEach(function (link) { link.classList.remove('active'); });
          matchingLink.classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -45% 0px' });

    sections.forEach(function (section) {
      navObserver.observe(section);
    });
  }

  /* ---------------------------------------------------------
     8. Make project cards fully clickable (once they have a
     real link). The "[PROJECT LINK]" text always works on its
     own — this just lets you click anywhere on the card too.
     Cards still using the "#" placeholder link stay inert, so
     nothing happens until you add a real URL.
  --------------------------------------------------------- */
  document.querySelectorAll('.project-card').forEach(function (card) {
    var link = card.querySelector('.project-link');
    if (!link) return;

    var href = link.getAttribute('href');
    if (!href || href === '#') return;

    card.addEventListener('click', function (e) {
      if (e.target.closest('.project-link')) return; // the link already handles its own click
      if (link.target === '_blank') {
        window.open(href, '_blank', 'noopener');
      } else {
        window.location.href = href;
      }
    });
  });

  /* ---------------------------------------------------------
     9. Typewriter effect for the hero role line
     Cycles through the roles listed in the data-roles attribute
     on #hero-role-text (edit that list in index.html to change
     them). Skipped for anyone with "reduce motion" on — they
     just see the first role, held in place.
  --------------------------------------------------------- */
  var heroRoleText = document.getElementById('hero-role-text');

  if (heroRoleText && !prefersReducedMotion) {
    var roles = heroRoleText.getAttribute('data-roles')
      .split(',')
      .map(function (role) { return role.trim(); })
      .filter(Boolean);

    if (roles.length > 1) {
      var roleIndex = 0;
      var charIndex = roles[0].length; // the first role is already shown in the HTML
      var isDeleting = false;

      var typeRole = function () {
        var currentRole = roles[roleIndex];
        charIndex += isDeleting ? -1 : 1;
        heroRoleText.textContent = currentRole.slice(0, charIndex);

        var typingSpeed = isDeleting ? 35 : 70;

        if (!isDeleting && charIndex === currentRole.length) {
          typingSpeed = 1800; // pause once fully typed
          isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
          isDeleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          typingSpeed = 300; // brief pause before typing the next role
        }

        setTimeout(typeRole, typingSpeed);
      };

      setTimeout(typeRole, 1800); // hold the first role before cycling starts
    }
  }

});