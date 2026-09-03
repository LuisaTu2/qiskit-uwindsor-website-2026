/* Qiskit Fall Fest 2026 — interactions
   Vanilla JS, no dependencies. Everything degrades gracefully if JS is off. */

(function () {
  "use strict";

  var header = document.getElementById("siteHeader");
  var nav = document.getElementById("siteNav");
  var navToggle = document.getElementById("navToggle");
  var toTop = document.getElementById("toTop");
  var yearSpan = document.getElementById("year");

  var reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  /* ---------- Footer year ---------- */
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  /* ---------- Mobile menu ---------- */
  function closeNav() {
    if (!nav) return;
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
  }

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    // Close after picking a destination.
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeNav();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 980) closeNav();
    });
  }

  /* ---------- Header shadow on scroll + back-to-top visibility ---------- */
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle("is-stuck", y > 8);
    if (toTop) toTop.classList.toggle("is-visible", y > 520);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: reducedMotion ? "auto" : "smooth",
      });
    });
  }

  /* ---------- Scrollspy: highlight the section you're reading ---------- */
  var navLinks = nav
    ? Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]'))
    : [];
  var sections = navLinks
    .map(function (link) {
      return document.querySelector(link.getAttribute("href"));
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          navLinks.forEach(function (link) {
            link.classList.toggle(
              "is-active",
              link.getAttribute("href") === "#" + entry.target.id,
            );
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );

    sections.forEach(function (section) {
      spy.observe(section);
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealTargets = document.querySelectorAll(
    ".section-head, .about-row, .card, .day, .hack-copy, .hack-panel, " +
      ".speaker, .person, .faqs-list details, .location-info, .location-map",
  );

  if (!reducedMotion && "IntersectionObserver" in window) {
    var revealer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry, i) {
          if (!entry.isIntersecting) return;
          // Small stagger so grids cascade rather than pop as one block.
          entry.target.style.transitionDelay = Math.min(i * 60, 240) + "ms";
          entry.target.classList.add("is-in");
          obs.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    revealTargets.forEach(function (el) {
      el.classList.add("reveal");
      revealer.observe(el);
    });
  }

  window.addEventListener("scroll", () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 100) {
      header.classList.add("header-hidden");
    } else {
      header.classList.remove("header-hidden");
    }
  });

  document.querySelectorAll(".has-dropdown").forEach((item) => {
    const toggle = item.querySelector(".dropdown-toggle");
    if (!toggle) return;
    toggle.addEventListener("click", (e) => {
      e.preventDefault();
      const isOpen = item.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
    item.querySelectorAll(".dropdown a").forEach((link) => {
      link.addEventListener("click", () => {
        item.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  });

  /* ---------- Mobile bird tap game ---------- */
  var STORAGE_KEY = "qff2026-bird-score";
  var scoreDisplay = document.getElementById("birdScoreDisplay");
  var birds = document.querySelectorAll(".mobile-bird");

  function getScore() {
    return parseInt(localStorage.getItem(STORAGE_KEY), 10) || 0;
  }

  function setScore(value) {
    localStorage.setItem(STORAGE_KEY, String(value));
    if (scoreDisplay)
      scoreDisplay.textContent = "Total qubits entangled: " + value;
  }

  setScore(getScore());

  birds.forEach(function (bird) {
    bird.style.pointerEvents = "auto";
    bird.style.cursor = "pointer";

    bird.addEventListener("click", function () {
      var points = parseInt(bird.getAttribute("data-points"), 10) || 0;
      var newScore = getScore() + points;
      setScore(newScore);

      var popup = document.createElement("div");
      popup.className = "bird-score-popup";
      popup.textContent = "+" + points;

      var rect = bird.getBoundingClientRect();
      var parentRect = bird.offsetParent.getBoundingClientRect();
      popup.style.left = rect.left - parentRect.left + rect.width / 2 + "px";
      popup.style.top = rect.top - parentRect.top + "px";

      bird.offsetParent.appendChild(popup);

      setTimeout(function () {
        popup.remove();
      }, 900);
    });
  });

  /* ---------- Rare bonus bird ---------- */
  var rareBird = document.getElementById("rareBird");

  if (rareBird) {
    function launchRareBird() {
      var containerWidth = rareBird.offsetParent.offsetWidth;
      rareBird.style.setProperty("--fly-distance", containerWidth + 60 + "px");

      rareBird.classList.add("is-flying");

      setTimeout(function () {
        rareBird.classList.remove("is-flying");
      }, 2200);
    }

    function scheduleRareBird() {
      var delay = 8000 + Math.random() * 1000;
      setTimeout(function () {
        launchRareBird();
        scheduleRareBird();
      }, delay);
    }

    scheduleRareBird();
  }
})();
