/* from https://j11y.io/javascript/javascript-bad-practices/ */
function applyCSS(el, styles) {
  for (var prop in styles) {
      if (!styles.hasOwnProperty || styles.hasOwnProperty(prop)) {
          el.style[prop] = styles[prop];
      }
  }
  return el;
}