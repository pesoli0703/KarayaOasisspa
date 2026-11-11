/* ==========================================================================
   KÁRÁYÁ OASIS SPA — interactions
   Vanilla JS, no dependencies. Everything degrades gracefully.
   ========================================================================== */
(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.remove("no-js");
  root.classList.add("js-enhanced");

  var motionQuery =
    typeof window.matchMedia === "function"
      ? window.matchMedia("(prefers-reduced-motion: reduce)")
      : { matches: false };
  var reduceMotion = motionQuery.matches;

  /* ---------------------------------------------------------------- */
  /* 1. WhatsApp deep links with pre-filled messages                   */
  /* ---------------------------------------------------------------- */
  var WA_NUMBER = "2348103858549";
  var MSG_GENERAL =
    "Hello KÁRÁYÁ OASIS SPA. I would like to enquire about booking a spa experience.";
  var msgTreatment = function (name) {
    return (
      "Hello KÁRÁYÁ OASIS SPA. I would like to make an appointment for " +
      name +
      ". Please provide available dates and times."
    );
  };
  var waUrl = function (message) {
    return "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(message);
  };

  document.querySelectorAll("[data-wa-general]").forEach(function (el) {
    el.setAttribute("href", waUrl(MSG_GENERAL));
  });
  document.querySelectorAll("[data-wa-treatment]").forEach(function (el) {
    var name = el.getAttribute("data-wa-treatment");
    if (name) el.setAttribute("href", waUrl(msgTreatment(name)));
  });
  document.querySelectorAll("[data-wa-package]").forEach(function (el) {
    var name = el.getAttribute("data-wa-package");
    if (name) el.setAttribute("href", waUrl(msgTreatment(name)));
  });

  /* ---------------------------------------------------------------- */
  /* 2. Header state + floating actions                                */
  /* ---------------------------------------------------------------- */
  var header = document.getElementById("site-header");
  var waFloat = document.querySelector(".wa-float");
  var mobileBar = document.getElementById("mobile-bar");
  var ticking = false;

  function onScroll() {
    var y = window.pageYOffset || window.scrollY;
    if (header) header.classList.toggle("is-scrolled", y > 40);
    if (waFloat) waFloat.classList.toggle("is-visible", y > 320);
    if (mobileBar) mobileBar.classList.toggle("is-visible", y > 260);
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(onScroll);
      }
    },
    { passive: true }
  );
  onScroll();

  /* ---------------------------------------------------------------- */
  /* 3. Mobile navigation                                              */
  /* ---------------------------------------------------------------- */
  var navToggle = document.querySelector(".nav-toggle");
  var mobileNav = document.getElementById("mobile-nav");
  var lastFocused = null;

  function setMenu(open) {
    if (!mobileNav || !navToggle) return;
    mobileNav.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    mobileNav.setAttribute("aria-hidden", open ? "false" : "true");
    if (open) {
      mobileNav.removeAttribute("inert");
    } else {
      mobileNav.setAttribute("inert", "");
    }
    document.body.style.overflow = open ? "hidden" : "";
    header && header.classList.toggle("is-menu-open", open);
    if (open) {
      lastFocused = document.activeElement;
      var first = mobileNav.querySelector("a");
      if (first) window.setTimeout(function () { first.focus(); }, 220);
    } else if (lastFocused) {
      lastFocused.focus();
      lastFocused = null;
    }
  }

  if (navToggle) {
    navToggle.addEventListener("click", function () {
      setMenu(!mobileNav.classList.contains("is-open"));
    });
  }
  if (mobileNav) {
    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { setMenu(false); });
    });
  }

  /* ---------------------------------------------------------------- */
  /* 4. Treatment category tabs                                        */
  /* ---------------------------------------------------------------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".menu-tab"));
  var panels = tabs.map(function (tab) {
    return document.getElementById(tab.getAttribute("aria-controls"));
  });

  function activateTab(index, focusTab) {
    tabs.forEach(function (tab, i) {
      var selected = i === index;
      tab.setAttribute("aria-selected", selected ? "true" : "false");
      tab.setAttribute("tabindex", selected ? "0" : "-1");
      if (panels[i]) panels[i].hidden = !selected;
    });
    if (focusTab && tabs[index]) tabs[index].focus();
    if (tabs[index] && tabs[index].scrollIntoView) {
      var box = tabs[index].parentElement;
      if (box && box.scrollWidth > box.clientWidth) {
        var left = tabs[index].offsetLeft - 16;
        box.scrollTo({ left: left, behavior: reduceMotion ? "auto" : "smooth" });
      }
    }
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener("click", function () { activateTab(i, false); });
    tab.addEventListener("keydown", function (event) {
      var next = null;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (i + 1) % tabs.length;
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (i - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = tabs.length - 1;
      if (next !== null) {
        event.preventDefault();
        activateTab(next, true);
      }
    });
  });

  if (tabs.length) activateTab(0, false);

  /* ---------------------------------------------------------------- */
  /* 5. Scroll reveal                                                  */
  /* ---------------------------------------------------------------- */
  var revealItems = document.querySelectorAll("[data-reveal]");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    revealItems.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------------------------------------------------------------- */
  /* 6. Nav scroll-spy                                                 */
  /* ---------------------------------------------------------------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav__link"));
  var spyTargets = navLinks
    .map(function (link) {
      var id = link.getAttribute("href");
      return id && id.charAt(0) === "#" ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  if (spyTargets.length && "IntersectionObserver" in window) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          navLinks.forEach(function (link) {
            link.classList.toggle("is-active", link.getAttribute("href") === "#" + entry.target.id);
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    spyTargets.forEach(function (section) { spy.observe(section); });
  }

  /* ---------------------------------------------------------------- */
  /* 7. Gallery lightbox                                               */
  /* ---------------------------------------------------------------- */
  var galleryButtons = Array.prototype.slice.call(document.querySelectorAll(".gallery__item"));
  var lightbox = document.getElementById("lightbox");
  var lbImg = document.getElementById("lightbox-img");
  var lbCaption = document.getElementById("lightbox-caption");
  var lbCount = document.getElementById("lightbox-count");
  var lbClose = document.getElementById("lightbox-close");
  var lbPrev = document.getElementById("lightbox-prev");
  var lbNext = document.getElementById("lightbox-next");
  var currentIndex = 0;
  var lbTrigger = null;

  function preload(index) {
    if (!galleryButtons[index]) return;
    var img = new Image();
    img.src = galleryButtons[index].getAttribute("data-full");
  }

  function showImage(index) {
    if (!galleryButtons.length) return;
    currentIndex = (index + galleryButtons.length) % galleryButtons.length;
    var btn = galleryButtons[currentIndex];
    var src = btn.getAttribute("data-full");
    if (lbImg) {
      lbImg.src = src;
      lbImg.alt = btn.getAttribute("data-alt") || "";
    }
    if (lbCaption) lbCaption.textContent = btn.getAttribute("data-caption") || "";
    if (lbCount) lbCount.textContent = currentIndex + 1 + " / " + galleryButtons.length;
    preload(currentIndex + 1);
  }

  function openLightbox(index, trigger) {
    if (!lightbox) return;
    lbTrigger = trigger || null;
    showImage(index);
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    if (lbClose) lbClose.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lbTrigger) lbTrigger.focus();
  }

  galleryButtons.forEach(function (btn, i) {
    btn.addEventListener("click", function () { openLightbox(i, btn); });
  });
  if (lbClose) lbClose.addEventListener("click", closeLightbox);
  if (lbPrev) lbPrev.addEventListener("click", function () { showImage(currentIndex - 1); });
  if (lbNext) lbNext.addEventListener("click", function () { showImage(currentIndex + 1); });
  if (lightbox) {
    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener("keydown", function (event) {
    if (mobileNav && mobileNav.classList.contains("is-open")) {
      if (event.key === "Escape") setMenu(false);
      return;
    }
    if (!lightbox || !lightbox.classList.contains("is-open")) return;
    if (event.key === "Escape") { closeLightbox(); }
    if (event.key === "ArrowRight") { showImage(currentIndex + 1); }
    if (event.key === "ArrowLeft") { showImage(currentIndex - 1); }
    if (event.key === "Tab") {
      var focusables = lightbox.querySelectorAll("button, [href], [tabindex]:not([tabindex='-1'])");
      if (!focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  /* ---------------------------------------------------------------- */
  /* 8. Testimonials — verified reviews only                           */
  /* ---------------------------------------------------------------- */
  /* Add verified guest reviews here. Leave empty until reviews are
     collected and confirmed: the elegant empty state will show instead.
     Example:
       { quote: "The massage was exceptional…", name: "Adaeze O.", rating: 5 }
  */
  var TESTIMONIALS = [];

  var list = document.getElementById("testimonials-list");
  var empty = document.getElementById("testimonials-empty");

  if (list && TESTIMONIALS.length) {
    TESTIMONIALS.forEach(function (item) {
      var card = document.createElement("article");
      card.className = "testimonial-card";

      var quote = document.createElement("p");
      quote.className = "testimonial-card__quote";
      quote.textContent = "“" + item.quote + "”";

      var meta = document.createElement("p");
      meta.className = "testimonial-card__meta";

      if (item.rating) {
        var stars = document.createElement("span");
        stars.className = "testimonial-card__stars";
        stars.setAttribute("aria-label", item.rating + " out of 5 stars");
        stars.textContent = "★★★★★".slice(0, item.rating);
        meta.appendChild(stars);
      }

      var name = document.createElement("span");
      name.textContent = item.name || "Verified guest";
      meta.appendChild(name);

      card.appendChild(quote);
      card.appendChild(meta);
      list.appendChild(card);
    });
    list.hidden = false;
    if (empty) empty.hidden = true;
  }

  /* ---------------------------------------------------------------- */
  /* 9. FAQ: animated disclosure                                       */
  /* ---------------------------------------------------------------- */
  document.querySelectorAll(".faq__item").forEach(function (item) {
    var summary = item.querySelector(".faq__summary");
    if (!summary) return;
    summary.addEventListener("click", function (event) {
      // Let the browser handle it, but close any other open item for a
      // tidy single-accordion experience where `name` isn't supported.
      if (!("name" in document.createElement("details"))) {
        event.preventDefault();
        var isOpen = item.open;
        document.querySelectorAll(".faq__item").forEach(function (other) {
          other.open = false;
        });
        item.open = !isOpen;
      }
    });
  });
})();
