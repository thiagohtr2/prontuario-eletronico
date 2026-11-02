/* Conecta — ilustrações planas (sem imagens externas): formas sólidas nas cores da paleta */
(function (C) {
  'use strict';

  var scenes = {
    hills: function () {
      return '<rect class="bg" width="640" height="360"/>' +
        '<circle class="c3" cx="470" cy="108" r="46"/>' +
        '<path class="c2" d="M0 250 Q120 150 260 230 T520 210 T640 240 V360 H0Z"/>' +
        '<path class="c1" d="M0 300 Q160 220 320 290 T640 270 V360 H0Z"/>';
    },
    city: function () {
      return '<rect class="bg" width="640" height="360"/>' +
        '<circle class="c3" cx="150" cy="96" r="40"/>' +
        '<rect class="c2" x="40" y="170" width="90" height="190"/>' +
        '<rect class="c1" x="140" y="110" width="110" height="250"/>' +
        '<rect class="c2" x="260" y="190" width="80" height="170"/>' +
        '<rect class="c1" x="350" y="140" width="100" height="220"/>' +
        '<rect class="c2" x="460" y="200" width="70" height="160"/>' +
        '<rect class="c1" x="540" y="160" width="80" height="200"/>' +
        '<rect class="bg" x="160" y="140" width="20" height="20"/><rect class="bg" x="200" y="140" width="20" height="20"/>' +
        '<rect class="bg" x="160" y="190" width="20" height="20"/><rect class="bg" x="200" y="190" width="20" height="20"/>' +
        '<rect class="bg" x="370" y="170" width="20" height="20"/><rect class="bg" x="410" y="170" width="20" height="20"/>' +
        '<rect class="bg" x="370" y="220" width="20" height="20"/><rect class="bg" x="410" y="220" width="20" height="20"/>';
    },
    sea: function () {
      return '<rect class="bg" width="640" height="360"/>' +
        '<circle class="c3" cx="320" cy="190" r="70"/>' +
        '<rect class="c2" y="190" width="640" height="170"/>' +
        '<path class="c1" d="M0 250 Q40 230 80 250 T160 250 T240 250 T320 250 T400 250 T480 250 T560 250 T640 250 V360 H0Z"/>' +
        '<path class="c3" d="M430 190 L500 190 L465 120Z"/><rect class="c1" x="440" y="190" width="50" height="14"/>';
    },
    cup: function () {
      return '<rect class="bg" width="640" height="360"/>' +
        '<circle class="c2" cx="320" cy="210" r="130"/>' +
        '<rect class="c1" x="250" y="170" width="130" height="110" rx="14"/>' +
        '<path class="s3" d="M380 190 h16 a26 26 0 0 1 0 52 h-16"/>' +
        '<path class="s3" d="M285 140 q-12 -22 0 -40 M320 140 q-12 -22 0 -40 M355 140 q-12 -22 0 -40"/>';
    },
    notes: function () {
      return '<rect class="bg" width="640" height="360"/>' +
        '<circle class="c1" cx="320" cy="180" r="150"/>' +
        '<circle class="c2" cx="320" cy="180" r="100"/>' +
        '<circle class="c3" cx="320" cy="180" r="44"/>' +
        '<circle class="bg" cx="320" cy="180" r="12"/>';
    },
    shapes: function () {
      return '<rect class="bg" width="640" height="360"/>' +
        '<circle class="c1" cx="220" cy="190" r="110"/>' +
        '<rect class="c3" x="260" y="90" width="190" height="190" rx="12"/>' +
        '<path class="c2" d="M400 320 L520 130 L610 320Z"/>';
    }
  };

  /**
   * Retorna um <svg> inline (formas planas).
   * @param {string} scene hills|city|sea|cup|notes|shapes
   * @param {number} scheme 1..6 (combinação de cores)
   * @param {string} label descrição acessível ('' = decorativa)
   */
  C.art = function (scene, scheme, label) {
    var draw = scenes[scene] || scenes.hills;
    var a11y = label ? ' role="img" aria-label="' + C.esc(label) + '"' : ' aria-hidden="true"';
    return '<svg class="art art--' + (scheme || 1) + '" viewBox="0 0 640 360" preserveAspectRatio="xMidYMid slice"' + a11y + ' focusable="false">' + draw() + '</svg>';
  };
})(window.Conecta);
