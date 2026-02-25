/**
 * Shop page helpers
 *
 * Pagination is not handled by the FiltersModule, so we update the
 * URL manually then call qumra.filters.rerender() to refresh sections.
 */
(function () {
  'use strict';

  /**
   * Navigate to a specific page.
   * Updates the URL param and tells the FiltersModule to re-render.
   */
  window.shopGoToPage = function (page) {
    var url = new URL(window.location);
    if (page > 1) url.searchParams.set('page', String(page));
    else url.searchParams.delete('page');

    history.replaceState(null, '', url.toString());
    qumra.filters.rerender();
  };

  // Scroll to grid after section re-render
  qumra.on(qumra.EVENTS.SECTION.RENDERED, function (payload) {
    if (payload.data.widgetKey === 'products-grid') {
      var el = document.querySelector('[data-qumra-section="products-grid"]');
      if (el) {
        var top = el.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    }
  });
})();
