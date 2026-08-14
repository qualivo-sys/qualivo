// Loads this design system into the template. In a consuming project, point
// base at the bound DS folder relative to this file (e.g. '_ds/<folder>' at
// the project root, '../_ds/<folder>' one level down) — one line to edit.
(() => {
  const base = 'assets/ds';
  for (const p of ["tokens/colors.css","tokens/typography.css","tokens/spacing.css","tokens/radius.css","tokens/shadows.css","tokens/base.css","styles.css"]) {
    const __dsu = (window.__resources || {})[base + '/' + p];
    const __dsb = __dsu && (window.__resourceBlobs || {})[__dsu];
    if (__dsb) {
      const __dst = document.createElement('style');
      __dsb.text().then(function (t) { __dst.textContent = t; });
      document.head.appendChild(__dst);
    } else {
      const l = document.createElement('link');
      l.href = base + '/' + p; l.rel = 'stylesheet';
      document.head.appendChild(l);
    }
  }
  const s = document.createElement('script');
  s.src = (window.__resources || {})[base + '/_ds_bundle.js'] || base + '/_ds_bundle.js';
  s.onerror = () => console.error('ds-base.js: failed to load ' + s.src + ' — if this is a consuming project, point the base line in ds-base.js at the bound _ds/<folder> tree relative to this page (e.g. _ds/<folder> at the project root, ../_ds/<folder> one level down); in a fresh design system this can just mean the bundle is not compiled yet');
  document.head.appendChild(s);
})();
