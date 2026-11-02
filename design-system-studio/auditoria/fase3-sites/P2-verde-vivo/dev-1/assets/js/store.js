/* Estado do front-end: sacola, favoritos, buscas recentes, endereço.
   Persistência apenas por conveniência (localStorage, sempre em try/catch). */
(function () {
  'use strict';
  var VV = (window.VV = window.VV || {});
  var PREFIX = 'verde-vivo:';

  function read(key, fallback) {
    try {
      var raw = window.localStorage.getItem(PREFIX + key);
      return raw == null ? fallback : JSON.parse(raw);
    } catch (e) { return fallback; }
  }
  function write(key, value) {
    try { window.localStorage.setItem(PREFIX + key, JSON.stringify(value)); } catch (e) { /* armazenamento indisponível */ }
  }

  var listeners = {};
  var state = {
    cart: read('cart', []),
    favs: read('favs', []),
    recents: read('recents', null),
    address: read('address', { cidade: 'São Paulo', cep: '01310-100' }),
    announceClosed: read('announceClosed', false)
  };
  if (!Array.isArray(state.cart)) state.cart = [];
  if (!Array.isArray(state.favs)) state.favs = [];
  // Buscas recentes de exemplo (dados fictícios da demonstração)
  if (!Array.isArray(state.recents)) state.recents = ['jiboia', 'vaso autoirrigável'];
  // Remove itens que não existem mais no catálogo
  state.cart = state.cart.filter(function (i) { return i && VV.findProduct(i.id) && VV.findProduct(i.id).estoque > 0; });
  state.favs = state.favs.filter(function (id) { return !!VV.findProduct(id); });

  function emit(evt) { (listeners[evt] || []).forEach(function (fn) { fn(state); }); }

  VV.store = {
    state: state,
    on: function (evt, fn) { (listeners[evt] = listeners[evt] || []).push(fn); },

    cartCount: function () { return state.cart.reduce(function (n, i) { return n + i.qty; }, 0); },
    cartItems: function () {
      return state.cart.map(function (i) { return { p: VV.findProduct(i.id), qty: i.qty }; }).filter(function (x) { return x.p; });
    },
    cartTotals: function () {
      var sub = VV.store.cartItems().reduce(function (s, x) { return s + x.p.preco * x.qty; }, 0);
      var frete = sub === 0 || sub >= VV.FREE_SHIPPING ? 0 : VV.SHIPPING_FEE;
      return { sub: sub, frete: frete, total: sub + frete, falta: Math.max(0, VV.FREE_SHIPPING - sub) };
    },
    addToCart: function (id, qty) {
      var p = VV.findProduct(id);
      if (!p || p.estoque <= 0) return false;
      var item = state.cart.filter(function (i) { return i.id === id; })[0];
      if (item) item.qty = Math.min(p.estoque, item.qty + qty);
      else state.cart.push({ id: id, qty: Math.min(p.estoque, qty) });
      write('cart', state.cart); emit('cart');
      return true;
    },
    setQty: function (id, qty) {
      var p = VV.findProduct(id);
      state.cart = state.cart.map(function (i) { return i.id === id ? { id: id, qty: Math.max(1, Math.min(p ? p.estoque : 99, qty)) } : i; });
      write('cart', state.cart); emit('cart');
    },
    removeFromCart: function (id) {
      state.cart = state.cart.filter(function (i) { return i.id !== id; });
      write('cart', state.cart); emit('cart');
    },
    clearCart: function () { state.cart = []; write('cart', state.cart); emit('cart'); },

    isFav: function (id) { return state.favs.indexOf(id) > -1; },
    toggleFav: function (id) {
      var on = !VV.store.isFav(id);
      if (on) state.favs.unshift(id); else state.favs = state.favs.filter(function (f) { return f !== id; });
      write('favs', state.favs); emit('favs');
      return on;
    },

    addRecent: function (term) {
      term = String(term || '').trim();
      if (!term) return;
      var n = VV.norm(term);
      state.recents = [term].concat(state.recents.filter(function (t) { return VV.norm(t) !== n; })).slice(0, 5);
      write('recents', state.recents);
    },
    removeRecent: function (term) {
      state.recents = state.recents.filter(function (t) { return t !== term; });
      write('recents', state.recents);
    },

    setAddress: function (cep) {
      var cities = { '0': 'São Paulo', '1': 'Campinas', '2': 'Rio de Janeiro', '3': 'Belo Horizonte', '4': 'Salvador', '5': 'Recife', '6': 'Fortaleza', '7': 'Brasília', '8': 'Curitiba', '9': 'Porto Alegre' };
      state.address = { cidade: cities[cep.charAt(0)] || 'Brasil', cep: cep.slice(0, 5) + '-' + cep.slice(5) };
      write('address', state.address); emit('address');
    },

    closeAnnounce: function () { state.announceClosed = true; write('announceClosed', true); }
  };
})();
