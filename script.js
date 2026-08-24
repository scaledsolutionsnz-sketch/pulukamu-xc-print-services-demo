/* Pulukamu XC Print Services — site script */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Opening animation ---------- */
  function revealHero() {
    document.querySelectorAll('.hero-reveal').forEach(function (el) {
      el.classList.add('is-in');
    });
  }

  function closeIntro() {
    var intro = document.getElementById('intro');
    if (!intro) { revealHero(); return; }
    intro.classList.add('is-done');
    revealHero();
    window.setTimeout(function () {
      if (intro.parentNode) intro.parentNode.removeChild(intro);
    }, 900);
  }
  // Fire off the DOM being ready (this script sits at the end of <body>), not the
  // load event — a slow image must never leave the overlay sitting over the site.
  window.setTimeout(closeIntro, reduced ? 120 : 900);
  window.addEventListener('load', closeIntro);

  /* ---------- Nav: solid on scroll ---------- */
  var nav = document.querySelector('.nav');
  function onScroll() {
    if (!nav) return;
    if (window.scrollY > 40) nav.classList.add('is-solid');
    else nav.classList.remove('is-solid');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var burger = document.querySelector('.burger');
  var menu = document.getElementById('mobile-menu');
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      burger.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        menu.classList.remove('is-open');
        burger.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- Hero slide rotation ---------- */
  var slides = document.querySelectorAll('.hero__slide');
  if (slides.length > 1 && !reduced) {
    var i = 0;
    window.setInterval(function () {
      slides[i].classList.remove('is-active');
      i = (i + 1) % slides.length;
      slides[i].classList.add('is-active');
    }, 5500);
  }

  /* ---------- Scroll reveal ----------
     Position-based rather than IntersectionObserver: it runs on load, scroll and
     resize, so content can never get stuck invisible if an observer never fires. */
  var revealables = Array.prototype.slice.call(document.querySelectorAll('.reveal:not(.hero-reveal)'));

  function checkReveals() {
    var vh = window.innerHeight || document.documentElement.clientHeight;
    for (var n = revealables.length - 1; n >= 0; n--) {
      var el = revealables[n];
      var top = el.getBoundingClientRect().top;
      if (top < vh * 0.94) {
        el.classList.add('is-in');
        revealables.splice(n, 1);
      }
    }
  }

  if (reduced) {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
    revealables = [];
  } else {
    var ticking = false;
    function queueCheck() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () { ticking = false; checkReveals(); });
    }
    window.addEventListener('scroll', queueCheck, { passive: true });
    window.addEventListener('resize', queueCheck);
    window.addEventListener('load', queueCheck);
    checkReveals();
    [80, 400, 900, 1600, 2600].forEach(function (t) { window.setTimeout(checkReveals, t); });
  }

  /* ---------- Hero review rotation ---------- */
  var rotator = document.querySelector('[data-review-rotator]');
  if (rotator) {
    var heroReviews = [
      { q: '“Got 40 hoodies done for our youth group and they were back to us inside the week.”', w: 'Sione F. · example review' },
      { q: '“Turned up with a blurry photo of our old club logo and they redrew the whole thing.”', w: 'Mel R. · example review' },
      { q: '“Only needed a dozen shirts for the family reunion. Fair price and ready when they said.”', w: 'Anaru T. · example review' },
      { q: '“Quoted the set-up and the per-shirt cost before we ordered, so no surprises at pick-up.”', w: 'Jess P. · example review' }
    ];
    var txt = rotator.querySelector('.rating__txt');
    var quote = rotator.querySelector('.rating__quote');
    var who = rotator.querySelector('.rating__who');
    if (txt && quote && who && !reduced) {
      var r = 0;
      window.setInterval(function () {
        txt.classList.add('is-fading');
        window.setTimeout(function () {
          r = (r + 1) % heroReviews.length;
          quote.textContent = heroReviews[r].q;
          who.textContent = heroReviews[r].w;
          txt.classList.remove('is-fading');
        }, 450);
      }, 6000);
    }
  }

  /* ---------- Gmail compose links (built in JS, never in the HTML) ---------- */
  document.querySelectorAll('a[data-gmail]').forEach(function (a) {
    var to = a.getAttribute('data-user') + '@' + a.getAttribute('data-domain');
    a.href = 'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(to) +
             '&su=' + (a.getAttribute('data-su') || '') +
             '&body=' + (a.getAttribute('data-body') || '');
    a.target = '_blank';
    a.rel = 'noopener';
  });

  /* ---------- Footer year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
