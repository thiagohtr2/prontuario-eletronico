/* ==========================================================================
   Landing: ilustrações, revelação ao rolar (fade 300 ms), parallax leve e scrollspy
   ========================================================================== */
(function () {
  'use strict';
  var VV = window.VV;
  var $ = VV.$, $$ = VV.$$;

  var makers = {
    hero: function () { return VV.art.hero(); },
    leaves: function () { return VV.art.leaves(); },
    atelier: function () { return VV.art.atelier(); },
    'care-luz': function () { return VV.art.care('luz'); },
    'care-agua': function () { return VV.art.care('agua'); },
    'care-vaso': function () { return VV.art.care('vaso'); }
  };
  $$('[data-art]').forEach(function (el) {
    var m = makers[el.getAttribute('data-art')];
    if (m) el.innerHTML = m();
  });

  /* Revelação ao rolar */
  var reveals = $$('.reveal');
  if ('IntersectionObserver' in window && !VV.reducedMotion()) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* Parallax opcional (desativado com prefers-reduced-motion) */
  var par = $$('[data-parallax]'), pTick = false;
  function parallax() {
    pTick = false;
    if (VV.reducedMotion() || $('#view-home').hidden) return;
    var vh = window.innerHeight;
    par.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom < -50 || r.top > vh + 50) return;
      var f = parseFloat(el.getAttribute('data-parallax')) || 0;
      var d = r.top + r.height / 2 - vh / 2;
      var lim = r.height * 0.055;
      var v = Math.max(-lim, Math.min(lim, -d * f));
      el.style.setProperty('--py', v.toFixed(1) + 'px');
    });
  }

  /* Scrollspy: destaca Cuidados / Ateliê enquanto a seção ocupa a tela */
  var secs = ['cuidados', 'atelie'].map(function (id) { return document.getElementById(id); });
  VV.spyPause = 0;
  function spy() {
    if ($('#view-home').hidden || Date.now() < VV.spyPause) return;
    var line = window.innerHeight * 0.4, found = null;
    secs.forEach(function (s) {
      var r = s.getBoundingClientRect();
      if (r.top <= line && r.bottom > line) found = s.id;
    });
    if (found !== VV.nav.state.section) VV.nav.set({ view: 'home', section: found });
  }

  function onScroll() {
    if (pTick) return;
    pTick = true;
    requestAnimationFrame(function () { parallax(); spy(); pTick = false; });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  VV.landingUpdate = onScroll;
})();
