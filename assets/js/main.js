/* «Гавань» — interactions */
(function () {
  "use strict";
  var root = document.documentElement;
  var header = document.querySelector(".header");
  var progress = document.getElementById("progress");
  var heroImg = document.querySelector(".hero__bg img");

  /* ---- Scroll: header state, progress bar, hero parallax ---- */
  var ticking = false;
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle("scrolled", y > 24);
    if (progress) {
      var h = document.body.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    }
    if (heroImg && y < window.innerHeight) {
      heroImg.style.transform = "translateY(" + y * 0.18 + "px) scale(1.02)";
    }
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  /* ---- Mobile nav ---- */
  var burger = document.querySelector(".burger");
  if (burger) {
    burger.addEventListener("click", function () {
      root.classList.toggle("nav-open");
    });
    document.querySelectorAll(".nav a").forEach(function (a) {
      a.addEventListener("click", function () { root.classList.remove("nav-open"); });
    });
  }

  /* ---- Reveal on scroll (staggered) ---- */
  var revealEls = [].slice.call(document.querySelectorAll(".reveal"));
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- FAQ: smooth height accordion (single-open) ---- */
  var accItems = [].slice.call(document.querySelectorAll(".acc__item"));
  function closeItem(item) {
    var ans = item.querySelector(".answer");
    var q = item.querySelector(".acc__q");
    ans.style.height = ans.scrollHeight + "px";
    requestAnimationFrame(function () { ans.style.height = "0px"; });
    q.setAttribute("aria-expanded", "false");
  }
  function openItem(item) {
    var ans = item.querySelector(".answer");
    var q = item.querySelector(".acc__q");
    ans.style.height = ans.scrollHeight + "px";
    q.setAttribute("aria-expanded", "true");
    ans.addEventListener("transitionend", function te() {
      if (q.getAttribute("aria-expanded") === "true") ans.style.height = "auto";
      ans.removeEventListener("transitionend", te);
    });
  }
  accItems.forEach(function (item) {
    var q = item.querySelector(".acc__q");
    q.addEventListener("click", function () {
      var expanded = q.getAttribute("aria-expanded") === "true";
      accItems.forEach(function (o) {
        if (o !== item && o.querySelector(".acc__q").getAttribute("aria-expanded") === "true") closeItem(o);
      });
      if (expanded) closeItem(item); else openItem(item);
    });
  });

  /* ---- Contact form -> mailto ---- */
  var form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = form.elements;
      var subject = encodeURIComponent("Звернення з сайту — " + (f.name.value || "мешканець"));
      var body = encodeURIComponent(
        "Ім'я: " + f.name.value + "\n" +
        "Email/телефон: " + f.contact.value + "\n\n" +
        f.message.value
      );
      window.location.href = "mailto:gavan@pochtamp.kiev.ua?subject=" + subject + "&body=" + body;
    });
  }

  /* ---- Hero intro (after fonts ready) ---- */
  function playHero() { document.body.classList.add("hero-ready"); }
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(playHero);
    setTimeout(playHero, 1200); // fallback
  } else { playHero(); }

  /* ---- Footer year ---- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
