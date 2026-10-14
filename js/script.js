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
    '.section-title, .hero-name, .about-photo-wrap, .about-bio, ' +
    '.about-actions, .about-socials, ' +
    '.project-card, .skills-group, ' +
    '.contact-list, .hero-visual'
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

    // Stagger the project cards specifically so they cascade in one after
    // another instead of all fading in at once (a plain CSS nth-child rule
    // only covers a fixed number of cards — this works for however many
    // project cards the grid actually has).
    document.querySelectorAll('.projects-grid > .project-card').forEach(function (card, index) {
      card.style.transitionDelay = (index * 0.08) + 's';
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
     8. Project detail modal
     Each project card has a "View Details" button. Clicking it
     opens one shared modal, filled in from that card's own
     content (category, title, image, description, team-project
     note, highlights, tags, links) — nothing is duplicated or
     invented, it's all read straight from the card. The card's
     own links (e.g. "View on GitHub") keep working exactly as
     before; the modal is just an extra way to preview a project
     before clicking through.
  --------------------------------------------------------- */
  var projectModal = document.getElementById('project-modal');
  var detailButtons = document.querySelectorAll('.project-view-details');

  if (projectModal && detailButtons.length > 0) {
    var modalPanel = projectModal.querySelector('.project-modal-panel');
    var modalCategory = document.getElementById('project-modal-category');
    var modalTitle = document.getElementById('project-modal-title');
    var modalImage = document.getElementById('project-modal-image');
    var modalDesc = document.getElementById('project-modal-desc');
    var modalMeta = document.getElementById('project-modal-meta');
    var modalHighlights = document.getElementById('project-modal-highlights');
    var modalTags = document.getElementById('project-modal-tags');
    var modalLinks = document.getElementById('project-modal-links');
    var modalCloseEls = projectModal.querySelectorAll('[data-modal-close]');
    var lastFocusedEl = null;

    var openModalFromCard = function (card, triggerEl) {
      var category = card.querySelector('.project-category');
      var title = card.querySelector('.project-name');
      var image = card.querySelector('.project-image');
      var desc = card.querySelector('.project-desc');
      var meta = card.querySelector('.project-meta');
      var highlights = card.querySelector('.project-highlights');
      var tags = card.querySelectorAll('.project-tags .tag');
      var links = card.querySelectorAll('.project-link');

      modalCategory.textContent = category ? category.textContent : '';
      modalTitle.textContent = title ? title.textContent : '';

      if (image) {
        modalImage.src = image.getAttribute('src');
        modalImage.alt = image.getAttribute('alt') || '';
        modalImage.style.display = 'block';
      } else {
        modalImage.removeAttribute('src');
        modalImage.style.display = 'none';
      }

      modalDesc.textContent = desc ? desc.textContent : '';

      if (meta) {
        modalMeta.textContent = meta.textContent;
        modalMeta.style.display = 'block';
      } else {
        modalMeta.textContent = '';
        modalMeta.style.display = 'none';
      }

      modalHighlights.innerHTML = '';
      if (highlights) {
        highlights.querySelectorAll('li').forEach(function (li) {
          var item = document.createElement('li');
          item.textContent = li.textContent;
          modalHighlights.appendChild(item);
        });
        modalHighlights.style.display = 'block';
      } else {
        modalHighlights.style.display = 'none';
      }

      modalTags.innerHTML = '';
      tags.forEach(function (tagEl) {
        var li = document.createElement('li');
        li.className = 'tag';
        li.textContent = tagEl.textContent;
        modalTags.appendChild(li);
      });

      modalLinks.innerHTML = '';
      links.forEach(function (linkEl) {
        var a = document.createElement('a');
        a.href = linkEl.getAttribute('href');
        a.textContent = linkEl.textContent;
        a.className = 'btn';
        var targetAttr = linkEl.getAttribute('target');
        var relAttr = linkEl.getAttribute('rel');
        if (targetAttr) a.target = targetAttr;
        if (relAttr) a.rel = relAttr;
        modalLinks.appendChild(a);
      });

      lastFocusedEl = triggerEl;
      projectModal.classList.add('is-open');
      projectModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      /* The panel is "visibility: hidden" until the .is-open class
         above takes effect, so focusing it in this same tick can
         silently fail in some browsers (it still looks "not
         displayed" at the moment focus() runs). Waiting one frame
         lets the browser apply the new style first. */
      window.requestAnimationFrame(function () {
        modalPanel.focus();
      });
    };

    var closeModal = function () {
      projectModal.classList.remove('is-open');
      projectModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lastFocusedEl) {
        lastFocusedEl.focus();
      }
    };

    // The whole card opens the modal now — except a click that lands on
    // a real <a> (the project's own links), which is left alone so it
    // navigates normally instead of being swallowed by the card.
    var projectCards = document.querySelectorAll('.project-card');
    var pointerIsFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    projectCards.forEach(function (card) {
      card.addEventListener('click', function (e) {
        if (e.target.closest('a')) return;
        // Whatever was actually clicked (the pill, or empty card space)
        // is remembered as "where to return focus to" on close — falling
        // back to the card's own button rather than the <article> itself,
        // which can't receive focus.
        var trigger = e.target.closest('.project-view-details') || card.querySelector('.project-view-details') || card;
        openModalFromCard(card, trigger);
      });

      // Desktop/mouse only: the "View Details" tag eases toward the
      // cursor as it moves inside the card. It's animated in JS frame
      // by frame (instead of jumping straight to the pointer position
      // via CSS) so it genuinely glides behind the cursor rather than
      // snapping to it on every mousemove event.
      if (pointerIsFine) {
        var hint = card.querySelector('.project-view-details');
        if (hint) {
          var target = { x: 0, y: 0 };
          var current = null; // null until the cursor has entered once
          var raf = null;
          var ease = 0.22;

          var glide = function () {
            current.x += (target.x - current.x) * ease;
            current.y += (target.y - current.y) * ease;
            hint.style.left = current.x + 'px';
            hint.style.top = current.y + 'px';

            var closeEnough = Math.abs(target.x - current.x) < 0.5 && Math.abs(target.y - current.y) < 0.5;
            raf = closeEnough ? null : requestAnimationFrame(glide);
          };

          card.addEventListener('mousemove', function (e) {
            var rect = card.getBoundingClientRect();
            // Keep the tag fully inside the card (which clips its own
            // overflow) so it never gets cut off near an edge — measured
            // off its untransformed layout size, with a little extra
            // room for the rotated corners and the offset shadow.
            var halfW = hint.offsetWidth / 2 + 10;
            var halfH = hint.offsetHeight / 2 + 10;
            var rawX = e.clientX - rect.left;
            var rawY = e.clientY - rect.top;
            target.x = Math.min(Math.max(rawX, halfW), rect.width - halfW);
            target.y = Math.min(Math.max(rawY, halfH), rect.height - halfH);

            if (!current) {
              // First move inside this card: place it right at the
              // cursor instead of gliding in from a stale corner.
              current = { x: target.x, y: target.y };
              hint.style.left = current.x + 'px';
              hint.style.top = current.y + 'px';
            } else if (!raf) {
              raf = requestAnimationFrame(glide);
            }
          });

          // Keyboard focus uses a fixed corner position (see the
          // :focus-visible rule in CSS), not the cursor-follow position.
          // An inline left/top left over from an earlier mouse hover has
          // higher priority than that stylesheet rule, so it's cleared
          // here to let the fixed corner position apply cleanly.
          hint.addEventListener('focus', function () {
            hint.style.left = '';
            hint.style.top = '';
          });
        }
      }
    });

    modalCloseEls.forEach(function (el) {
      el.addEventListener('click', closeModal);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && projectModal.classList.contains('is-open')) {
        closeModal();
      }
    });

    // Simple focus trap: while the modal is open, Tab cycles through its
    // own focusable elements instead of escaping out to the page behind it.
    projectModal.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab' || !projectModal.classList.contains('is-open')) return;
      var focusable = projectModal.querySelectorAll('a[href], button:not([disabled])');
      if (focusable.length === 0) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  /* ---------------------------------------------------------
     9. Footer year
     Keeps the "© <year> Silva Yunisa" line current automatically,
     instead of a hardcoded year that goes stale every January.
  --------------------------------------------------------- */
  var currentYearEl = document.getElementById('current-year');
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }

});