/* Qamar Theme - Main JavaScript */

(function () {
  'use strict';

  // ===== Config =====
  const config = window.__QUMRA_CONFIG__ || {};
  const QumraConfig = {
    api: {
      cart: {
        get: '/ajax/cart',
        add: '/ajax/cart/add',
        change: '/ajax/cart/change',
        remove: '/ajax/cart/remove',
        clear: '/ajax/cart/clear'
      },
      search: {
        products: '/ajax/search/products',
        suggest: '/ajax/search/suggest'
      },
      product: {
        get: '/ajax/product',
        variant: '/ajax/product/resolve-variant-by-options'
      }
    },
    defaults: {
      currency: config.currency || 'SAR',
      currencySymbol: config.currencySymbol || 'ر.س',
      language: config.language || 'ar',
      exchangeRate: config.exchangeRate || 1
    },
    selectors: {
      cart: {
        count: '[data-cart-count]',
        itemsCount: '[data-cart-items-count]',
        total: '[data-cart-total]',
        container: '[data-cart-container]'
      }
    },
    messages: {
      addedToCart: (config.messages && config.messages.addedToCart) || 'Added to cart',
      addError: (config.messages && config.messages.addError) || 'Error, please try again'
    }
  };

  // ===== EventBus =====
  const EventBus = {
    _listeners: {},
    on(event, callback) {
      if (!this._listeners[event]) this._listeners[event] = [];
      this._listeners[event].push(callback);
      return () => {
        this._listeners[event] = this._listeners[event].filter(cb => cb !== callback);
      };
    },
    emit(event, data) {
      (this._listeners[event] || []).forEach(cb => cb(data));
      window.dispatchEvent(new CustomEvent(event, { detail: data }));
    }
  };

  // ===== ApiClient =====
  const ApiClient = {
    async get(url, params) {
      const query = params ? '?' + new URLSearchParams(params).toString() : '';
      const res = await fetch(url + query);
      if (!res.ok) throw new Error('Request failed: ' + res.status);
      return res.json();
    },
    async post(url, body) {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error('Request failed: ' + res.status);
      return res.json();
    }
  };

  // ===== Utils =====
  const _moneyFormat = (function() {
    var sample = (config.moneyFormatSample || '').trim();
    var symbol = config.currencySymbol || '';
    if (!sample || !symbol) return { useComma: true, space: ' ' };
    var idx = sample.indexOf(symbol);
    var hasSpace = idx > 0 && sample[idx - 1] === ' ';
    var numPart = sample.substring(0, hasSpace ? idx - 1 : idx);
    return { useComma: numPart.indexOf(',') !== -1, space: hasSpace ? ' ' : '' };
  })();

  const Utils = {
    formatMoney(amount) {
      if (amount == null) return '';
      var num = Number(amount);
      var formatted;
      if (_moneyFormat.useComma) {
        formatted = num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      } else {
        formatted = num.toFixed(2);
      }
      return formatted + _moneyFormat.space + QumraConfig.defaults.currencySymbol;
    },

    calcDiscount(price, compareAtPrice) {
      if (!compareAtPrice || compareAtPrice <= price) return 0;
      return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
    },

    debounce(fn, delay) {
      let timer;
      return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
      };
    },

    throttle(fn, limit) {
      let inThrottle;
      return function (...args) {
        if (!inThrottle) {
          fn.apply(this, args);
          inThrottle = true;
          setTimeout(() => (inThrottle = false), limit);
        }
      };
    }
  };

  // ===== Toast =====
  const Toast = {
    _show(message, type, duration) {
      const container = document.getElementById('toast-container');
      if (!container) return;
      const el = document.createElement('div');
      el.className = 'toast toast-' + type;
      el.textContent = message;
      container.appendChild(el);
      setTimeout(() => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(-10px)';
        el.style.transition = 'all 0.3s ease';
        setTimeout(() => el.remove(), 300);
      }, duration || 3000);
    },
    success(msg, duration) { this._show(msg, 'success', duration); },
    error(msg, duration) { this._show(msg, 'error', duration); },
    warning(msg, duration) { this._show(msg, 'warning', duration); },
    info(msg, duration) { this._show(msg, 'info', duration); }
  };

  // ===== Helper: Update DOM selectors =====
  function updateSelectors(selectors, values) {
    Object.entries(selectors).forEach(([key, selector]) => {
      if (typeof selector === 'string' && values[key] !== undefined) {
        document.querySelectorAll(selector).forEach(el => {
          el.textContent = values[key];
        });
      }
    });
  }

  // ===== CartManager =====
  const CartManager = {
    async get() {
      return ApiClient.get(QumraConfig.api.cart.get);
    },

    async add(productId, quantity, options) {
      const body = { productId, quantity: quantity || 1 };
      if (Array.isArray(options) && options.length) {
        body.options = options;
      } else if (options) {
        body.variantId = options;
      }

      try {
        const data = await ApiClient.post(QumraConfig.api.cart.add, body);

        if (data.success === false) {
          throw new Error(data.message || 'Failed');
        }

        this._updateUI(data);
        this._refreshDrawer(data);
        EventBus.emit('cart:updated', data);
        EventBus.emit('cart:item-added', { productId, data });

        Toast.success(QumraConfig.messages.addedToCart);

        // Open cart drawer after short delay
        setTimeout(() => { ModalController.open('cart'); }, 300);

        return data;
      } catch (error) {
        Toast.error(QumraConfig.messages.addError);
        throw error;
      }
    },

    async update(itemId, quantity) {
      const data = await ApiClient.post(QumraConfig.api.cart.change, { itemId, quantity });
      if (data.success !== false) {
        this._updateUI(data);
        this._refreshDrawer(data);
        EventBus.emit('cart:updated', data);
      }
      return data;
    },

    async remove(itemId) {
      const itemEl = document.querySelector('[data-cart-item="' + itemId + '"]');
      if (itemEl) itemEl.classList.add('removing');
      const data = await ApiClient.post(QumraConfig.api.cart.remove, { itemId });
      if (data.success !== false) {
        this._updateUI(data);
        EventBus.emit('cart:updated', data);
        setTimeout(() => {
          if (itemEl) itemEl.remove();
          this._refreshDrawer(data);
        }, 300);
      }
      return data;
    },

    async clear() {
      const data = await ApiClient.post(QumraConfig.api.cart.clear, {});
      if (data.success !== false) {
        this._updateUI(data);
        this._refreshDrawer(data);
        EventBus.emit('cart:updated', data);
      }
      return data;
    },

    _updateUI(data) {
      updateSelectors(QumraConfig.selectors.cart, {
        count: data.totalQuantity || 0,
        itemsCount: (data.items || []).length,
        total: Utils.formatMoney(data.totalPrice)
      });
    },

    _refreshDrawer(data) {
      var container = document.querySelector('[data-cart-container]');
      var footer = document.querySelector('[data-cart-footer]');
      var empty = document.querySelector('[data-cart-empty]');
      var countBar = document.querySelector('[data-cart-count-bar]');
      var items = data.items || [];

      if (items.length > 0) {
        var itemIds = items.map(function(i) { return i._id; });

        // Update item totals
        items.forEach(function (item) {
          document.querySelectorAll('[data-item-total="' + item._id + '"]').forEach(function(el) {
            el.textContent = Utils.formatMoney(item.totalPrice);
          });
        });

        // Add new items that don't exist in DOM yet
        if (container) {
          var listEl = container.querySelector('.space-y-4');
          if (listEl) {
            items.forEach(function(item) {
              if (!container.querySelector('[data-cart-item="' + item._id + '"]')) {
                var html = CartManager._buildItemHTML(item);
                var temp = document.createElement('div');
                temp.innerHTML = html;
                while (temp.firstChild) {
                  var node = temp.firstChild;
                  listEl.appendChild(node);
                  if (window.Alpine && node.nodeType === 1) {
                    Alpine.initTree(node);
                  }
                }
              }
            });
          }
        }

        // Remove items from DOM that no longer exist in cart
        if (container) {
          container.querySelectorAll('[data-cart-item]').forEach(function (el) {
            var id = el.getAttribute('data-cart-item');
            if (itemIds.indexOf(id) === -1) {
              el.style.transition = 'all 0.3s ease';
              el.style.opacity = '0';
              el.style.transform = 'scale(0.95)';
              setTimeout(function () { el.remove(); }, 300);
            }
          });
          container.style.display = '';
        }

        // Update footer total
        if (footer) {
          footer.style.display = '';
          var totalEl = footer.querySelector('[data-cart-total]');
          if (totalEl) totalEl.textContent = Utils.formatMoney(data.totalPrice);
        }

        // Show count bar
        if (countBar) countBar.style.display = '';

        // Hide empty state
        if (empty) empty.style.display = 'none';
      } else {
        // No items - show empty state
        if (container) container.style.display = 'none';
        if (footer) footer.style.display = 'none';
        if (countBar) countBar.style.display = 'none';
        if (empty) empty.style.display = '';
      }
    },

    _buildItemHTML(item) {
      var id = item._id;
      var slug = (item.productData && item.productData.slug) || '';
      var title = (item.productData && item.productData.title) || '';
      var imageUrl = (item.productData && item.productData.image && item.productData.image.fileUrl) || '';
      var totalPrice = Utils.formatMoney(item.totalPrice);

      var imageHtml = imageUrl
        ? '<div class="w-20 h-20 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">' +
          '<img src="' + imageUrl + '" alt="' + title + '" class="w-full h-full object-cover" loading="lazy"></div>'
        : '<div class="w-20 h-20 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">' +
          '<svg class="w-7 h-7 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg></div>';

      var variantHtml = '';
      if (item.variantData && item.variantData.options && item.variantData.options.length) {
        variantHtml = '<div class="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 mt-1">';
        item.variantData.options.forEach(function(opt) {
          var optName = (opt.option && opt.option.name) || '';
          var optType = (opt.option && opt.option.type) || 'text';
          var colorDot = optType === 'color'
            ? '<span class="inline-block w-3 h-3 rounded-full border border-gray-200 align-middle" style="background-color: ' + (opt.value || '#fff') + '"></span>'
            : '';
          variantHtml += '<span class="text-[11px] text-gray-400 flex items-center gap-1">' +
            optName + ': ' + colorDot +
            '<span class="text-gray-500">' + opt.label + '</span></span>';
        });
        variantHtml += '</div>';
      }

      return '<div class="transition-all duration-300" data-cart-item="' + id + '" ' +
        'x-show="activeItems.includes(\'' + id + '\')" ' +
        'x-transition:enter="transition ease-out duration-300" ' +
        'x-transition:enter-start="opacity-0 translate-y-2" ' +
        'x-transition:enter-end="opacity-100 translate-y-0" ' +
        'x-transition:leave="transition ease-in duration-200" ' +
        'x-transition:leave-start="opacity-100" ' +
        'x-transition:leave-end="opacity-0" ' +
        ':class="{ \'opacity-20 scale-95 pointer-events-none\': removingId === \'' + id + '\' }">' +
        '<div class="flex gap-3.5">' +
          '<a href="/product/' + slug + '" @click="$store.modal.close()" class="shrink-0">' + imageHtml + '</a>' +
          '<div class="flex-1 min-w-0">' +
            '<div class="flex items-start justify-between gap-2">' +
              '<a href="/product/' + slug + '" @click="$store.modal.close()" class="text-[13px] font-semibold text-gray-800 hover:text-primary transition-colors line-clamp-2 leading-snug">' + title + '</a>' +
              '<button @click="removeItem(\'' + id + '\')" class="shrink-0 mt-0.5 text-gray-300 hover:text-red-400 transition-colors p-0.5">' +
                '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>' +
              '</button>' +
            '</div>' +
            variantHtml +
            '<div class="flex items-center justify-between mt-2.5">' +
              '<div class="inline-flex items-center bg-gray-50 rounded-full h-8">' +
                '<button @click="decrement(\'' + id + '\')" class="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-primary hover:bg-white transition-all">' +
                  '<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M20 12H4"/></svg>' +
                '</button>' +
                '<span class="w-7 text-center text-xs font-bold text-gray-800">' +
                  '<span x-show="updating !== \'' + id + '\'" x-text="quantities[\'' + id + '\']">' + item.quantity + '</span>' +
                  '<svg x-show="updating === \'' + id + '\'" x-cloak class="w-3.5 h-3.5 animate-spin mx-auto text-primary" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>' +
                '</span>' +
                '<button @click="increment(\'' + id + '\')" class="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-primary hover:bg-white transition-all">' +
                  '<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>' +
                '</button>' +
              '</div>' +
              '<div class="text-end">' +
                '<span class="text-sm font-bold text-gray-900 transition-all" data-item-total="' + id + '" :class="{ \'animate-pulse text-primary\': updating === \'' + id + '\' }">' + totalPrice + '</span>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
    }
  };

  // ===== SearchManager =====
  const SearchManager = {
    async search(query, filters) {
      const params = { q: query, ...filters };
      return ApiClient.get(QumraConfig.api.search.products, params);
    },

    suggest: Utils.debounce(async function (query, callback, limit) {
      if (!query || query.length < 2) return;
      const data = await ApiClient.get(QumraConfig.api.search.suggest, {
        q: query,
        limit: limit || 5
      });
      if (callback) callback(data);
      return data;
    }, 300),

    debounce: Utils.debounce
  };

  // ===== WishlistManager =====
  const WishlistManager = {
    async add(productId) {
      const data = await ApiClient.post('/ajax/wishlist/add', { productId });
      this._emit(data);
      return data;
    },

    async remove(productId) {
      const data = await ApiClient.post('/ajax/wishlist/remove', { productId });
      this._emit(data);
      return data;
    },

    async toggle(productId, isInWishlist) {
      return isInWishlist ? this.remove(productId) : this.add(productId);
    },

    _emit(data) {
      document.querySelectorAll('[data-wishlist-count]').forEach(el => {
        el.textContent = data.count || 0;
      });
      EventBus.emit('wishlist:updated', data);
    }
  };

  // ===== ProductManager =====
  const ProductManager = {
    async get(handle) {
      return ApiClient.get(QumraConfig.api.product.get, { handle });
    },

    async getVariant(productId, selectedOptions, quantity) {
      return ApiClient.post(QumraConfig.api.product.variant, {
        productId,
        options: selectedOptions,
        quantity: quantity || 1
      });
    },

    calculatePrice(variant, quantity) {
      return {
        price: variant.price * (quantity || 1),
        compareAtPrice: (variant.compareAtPrice || 0) * (quantity || 1)
      };
    }
  };

  // ===== ModalController =====
  const ModalController = {
    current: null,

    open(name) {
      this.current = name;
      document.body.style.overflow = 'hidden';
      EventBus.emit('modal:open', { name });
    },

    close() {
      const name = this.current;
      this.current = null;
      document.body.style.overflow = '';
      EventBus.emit('modal:close', { name });
    },

    toggle(name) {
      if (this.current === name) {
        this.close();
      } else {
        this.close();
        this.open(name);
      }
    }
  };

  // ===== Qumra Namespace =====
  const Qumra = {
    config: QumraConfig,
    events: EventBus,
    api: ApiClient,
    cart: CartManager,
    wishlist: WishlistManager,
    search: SearchManager,
    product: ProductManager,
    modal: ModalController,
    utils: Utils,
    toast: Toast
  };

  // ===== Global Exports =====
  window.Qumra = Qumra;

  // Backward compatibility
  window.CartManager = CartManager;
  window.WishlistManager = WishlistManager;
  window.SearchManager = SearchManager;
  window.ProductManager = ProductManager;
  window.EventBus = EventBus;
  window.formatMoney = Utils.formatMoney;
  window.toggleModal = function (name) { ModalController.toggle(name); };

  // ===== Alpine.js Stores + Components =====
  document.addEventListener('alpine:init', () => {
    // --- Stores ---
    Alpine.store('modal', {
      current: null,
      open(name) { Qumra.modal.open(name); this.current = name; },
      close() { Qumra.modal.close(); this.current = null; },
      toggle(name) {
        if (this.current === name) { this.close(); }
        else { this.close(); this.open(name); }
      }
    });

    Alpine.store('wishlist', {
      ids: (config.wishlistIds || []),
      has(productId) { return this.ids.indexOf(productId) !== -1; },
      update(data) {
        if (data && data.products) {
          this.ids = data.products.map(p => p._id || p);
        }
      }
    });

    Alpine.store('cart', {
      totalQuantity: 0,
      totalPrice: 0,
      items: [],
      update(data) {
        this.totalQuantity = data.totalQuantity || 0;
        this.totalPrice = data.totalPrice || 0;
        this.items = data.items || [];
      }
    });

    // --- Cart Interaction Component ---
    Alpine.data('cartInteraction', (config) => ({
      quantities: {},
      updateTimers: {},
      updating: null,
      removingId: null,
      confirmRemoveId: null,
      activeItems: [],

      init() {
        (config.items || []).forEach(i => {
          this.quantities[i.id] = i.qty;
          this.activeItems.push(i.id);
        });

        window.addEventListener('cart:updated', (e) => {
          this.updating = null;
          this.removingId = null;
          this.confirmRemoveId = null;
          if (e.detail && e.detail.items) {
            this.activeItems = e.detail.items.map(i => i._id);
            e.detail.items.forEach(item => {
              this.quantities[item._id] = item.quantity;
            });
          } else {
            this.activeItems = [];
          }
        });
      },

      increment(id) {
        this.quantities[id] = (this.quantities[id] || 1) + 1;
        this._scheduleUpdate(id);
      },

      decrement(id) {
        var c = this.quantities[id] || 1;
        if (c <= 1) {
          if (config.confirmRemove) {
            this.confirmRemoveId = id;
          } else {
            this.removeItem(id);
          }
          return;
        }
        this.quantities[id] = c - 1;
        this._scheduleUpdate(id);
      },

      _scheduleUpdate(id) {
        if (this.updateTimers[id]) clearTimeout(this.updateTimers[id]);
        this.updateTimers[id] = setTimeout(() => {
          this.updating = id;
          delete this.updateTimers[id];
          Qumra.cart.update(id, this.quantities[id]);
        }, 500);
      },

      removeItem(id) {
        this.removingId = id;
        this.confirmRemoveId = null;
        Qumra.cart.remove(id);
      }
    }));

    // --- Collection/Search Filter Component (AJAX) ---
    Alpine.data('collectionFilter', (cfg) => {
    cfg = cfg || {};
    var _sortMap = { newest: 'created-desc', price_asc: 'price-asc', price_desc: 'price-desc' };
    var _reverseSortMap = { 'created-desc': 'newest', 'price-asc': 'price_asc', 'price-desc': 'price_desc' };
    var _rh = cfg.rangeHandle || 'price';
    var _p = new URLSearchParams(window.location.search);
    var _s = _p.get('sort') || '';
    var _initSort = _reverseSortMap[_s] || _s;
    var _initPriceMin = _p.get('filters[' + _rh + '][min]') || '';
    var _initPriceMax = _p.get('filters[' + _rh + '][max]') || '';
    return {
      searchQuery: cfg.query || '',
      collectionId: cfg.collectionId || '',
      cardSettings: cfg.cardSettings || {},
      translations: cfg.translations || {},
      rangeHandle: _rh,
      loading: false,
      currentSort: _initSort,
      priceMin: _initPriceMin,
      priceMax: _initPriceMax,
      filtersOpen: false,
      sortOpen: false,
      _abortCtrl: null,
      _priceTimer: null,

      isActive(handle, value) {
        return new URLSearchParams(window.location.search).getAll('filters[' + handle + '][]').includes(value);
      },

      get activeCount() {
        var c = 0;
        new URLSearchParams(window.location.search).forEach(function(v, k) { if (k.startsWith('filters[')) c++; });
        return c;
      },

      sortBy(value) {
        var url = new URL(window.location);
        var mapped = _sortMap[value] || value;
        if (mapped) url.searchParams.set('sort', mapped);
        else url.searchParams.delete('sort');
        url.searchParams.delete('page');
        this.currentSort = value;
        this.sortOpen = false;
        this._fetch(url);
      },

      toggleFilter(handle, value) {
        var url = new URL(window.location);
        var key = 'filters[' + handle + '][]';
        var existing = url.searchParams.getAll(key);
        url.searchParams.delete(key);
        var idx = existing.indexOf(value);
        if (idx >= 0) existing.splice(idx, 1);
        else existing.push(value);
        existing.forEach(function(v) { url.searchParams.append(key, v); });
        url.searchParams.delete('page');
        this._fetch(url);
      },

      _debouncedApplyPrice() {
        clearTimeout(this._priceTimer);
        this._priceTimer = setTimeout(() => {
          this.applyPrice();
        }, 500);
      },

      applyPrice() {
        var url = new URL(window.location);
        var rh = this.rangeHandle;
        if (this.priceMin) url.searchParams.set('filters[' + rh + '][min]', this.priceMin);
        else url.searchParams.delete('filters[' + rh + '][min]');
        if (this.priceMax) url.searchParams.set('filters[' + rh + '][max]', this.priceMax);
        else url.searchParams.delete('filters[' + rh + '][max]');
        url.searchParams.delete('page');
        this._fetch(url);
      },

      clearFilters() {
        var url = new URL(window.location);
        url.searchParams.delete('page');
        var keysToRemove = [];
        url.searchParams.forEach(function(v, k) { if (k.startsWith('filters[')) keysToRemove.push(k); });
        var unique = [];
        keysToRemove.forEach(function(k) { if (unique.indexOf(k) === -1) unique.push(k); });
        unique.forEach(function(k) { url.searchParams.delete(k); });
        this.priceMin = '';
        this.priceMax = '';
        this._fetch(url);
      },

      goToPage(page) {
        var url = new URL(window.location);
        if (page > 1) url.searchParams.set('page', page);
        else url.searchParams.delete('page');
        this._fetch(url);
      },

      async _fetch(url) {
        if (this._abortCtrl) this._abortCtrl.abort();
        this._abortCtrl = new AbortController();
        this.loading = true;
        this.filtersOpen = false;

        try {
          var apiUrl = new URL('/ajax/search/products', window.location.origin);
          url.searchParams.forEach(function(v, k) {
            apiUrl.searchParams.append(k, v);
          });
          if (!apiUrl.searchParams.has('q') && this.searchQuery) {
            apiUrl.searchParams.set('q', this.searchQuery);
          }
          if (this.collectionId && !apiUrl.searchParams.has('collectionId')) {
            apiUrl.searchParams.set('collectionId', this.collectionId);
          }

          var res = await fetch(apiUrl.toString(), { signal: this._abortCtrl.signal });
          if (!res.ok) throw new Error(res.status);
          var data = await res.json();

          this._renderResults(data);
          history.pushState(null, '', url.toString());
        } catch (e) {
          if (e.name !== 'AbortError') {
            console.error('Filter fetch error:', e);
            window.location = url.toString();
          }
        } finally {
          this.loading = false;
          this._abortCtrl = null;
        }
      },

      _renderResults(data) {
        var wrapper = document.querySelector('#products-grid-wrapper');
        var countEl = document.querySelector('#products-count');
        if (!wrapper) return;

        var products = data.products || data.results || [];
        var pagination = data.pagination || null;
        var totalItems = pagination ? pagination.totalItems : products.length;
        var cs = this.cardSettings;
        var tr = this.translations;
        var self = this;

        // Update count
        if (countEl) {
          var countHtml;
          if (self.searchQuery) {
            countHtml = '<p class="text-sm text-gray-600">' + (tr.resultsFor || '') +
              ' <span class="font-bold text-primary">&quot;' + self.searchQuery + '&quot;</span></p>';
            if (totalItems !== undefined) {
              countHtml += '<p class="text-xs text-gray-400 mt-1">' + totalItems + ' ' + (tr.products || '') + '</p>';
            }
          } else {
            countHtml = '<p class="text-sm text-gray-600"><span class="font-bold text-gray-800">' + totalItems + '</span> ' + (tr.products || '') + '</p>';
          }
          countEl.innerHTML = countHtml;
        }

        if (products.length > 0) {
          var gridClass = cs.gridClass || 'md:grid-cols-2 lg:grid-cols-3';
          var html = '<div class="grid grid-cols-2 gap-3 md:gap-5 ' + gridClass + '">';
          products.forEach(function(product) {
            html += self._buildProductCard(product);
          });
          html += '</div>';

          if (pagination && pagination.totalPages > 1) {
            html += self._buildPagination(pagination);
          }

          wrapper.innerHTML = html;

          wrapper.querySelectorAll('[x-data]').forEach(function(el) {
            Alpine.initTree(el);
          });

          wrapper.querySelectorAll('.product-card').forEach(function(card, i) {
            card.style.opacity = '0';
            card.style.transform = 'translateY(12px)';
            setTimeout(function() {
              card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, i * 50);
          });
        } else {
          var emptyIcon, emptyTitle, emptyText;
          if (self.searchQuery) {
            emptyIcon = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>';
            emptyTitle = (tr.noResults || '') + ' &quot;' + self.searchQuery + '&quot;';
            emptyText = tr.tryDifferent || '';
          } else {
            emptyIcon = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>';
            emptyTitle = tr.noProducts || '';
            emptyText = tr.noResults || '';
          }
          wrapper.innerHTML =
            '<div class="flex flex-col items-center justify-center py-20 text-center">' +
              '<div class="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center mb-5">' +
                '<svg class="w-12 h-12 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">' + emptyIcon + '</svg>' +
              '</div>' +
              '<h3 class="text-lg font-bold text-gray-800 mb-2">' + emptyTitle + '</h3>' +
              '<p class="text-gray-500 text-sm mb-6 max-w-md mx-auto">' + emptyText + '</p>' +
              '<a href="/" class="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:opacity-80 transition-colors">' +
                (tr.home || '') +
                '<svg class="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">' +
                  '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>' +
                '</svg>' +
              '</a>' +
            '</div>';
        }
      },

      _buildProductCard(product) {
        var cs = this.cardSettings;
        var tr = this.translations;
        var pricing = product.pricing || {};
        var price = pricing.price || 0;
        var compareAtPrice = pricing.compareAtPrice || 0;
        var hasDiscount = compareAtPrice && compareAtPrice > price;
        var canPurchase = product.quantity > 0 || !product.trackQuantity || product.allowBackorder;
        var title = (product.title || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        var titleAttr = title.replace(/"/g, '&quot;');

        var radiusMap = { none: '0', sm: '8px', md: '12px', lg: '16px' };
        var radius = radiusMap[cs.borderRadius] || '16px';
        var ratioClass = cs.imageRatio === 'portrait' ? 'aspect-[3/4]' : cs.imageRatio === 'landscape' ? 'aspect-[4/3]' : 'aspect-square';
        var fitPad = cs.imageFit === 'contain' ? ' p-4' : '';
        var imgClass = cs.imageFit === 'contain' ? 'max-w-full max-h-full object-contain' : 'w-full h-full object-cover';
        var imageUrl = (product.images && product.images.length) ? product.images[0].fileUrl : '';
        var lineClamp = cs.titleLines === '1' ? 'line-clamp-1' : 'line-clamp-2';

        var h = '<div class="product-card group flex flex-col h-full ' + (cs.hoverEffect === 'zoom' ? 'hover-zoom' : '') + '" style="border-radius: ' + radius + ';" x-data="productCard(\'' + product._id + '\')">';

        // Image
        h += '<a href="/product/' + product.slug + '" class="block relative overflow-hidden card-img">';
        h += '<div class="' + ratioClass + ' bg-white flex items-center justify-center' + fitPad + '">';
        if (imageUrl) {
          h += '<img src="' + imageUrl + '" alt="' + titleAttr + '" class="' + imgClass + '" loading="lazy">';
        } else {
          h += '<svg class="w-16 h-16 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>';
        }
        h += '</div>';

        // Badge
        if (cs.showBadge && hasDiscount) {
          var disc = Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
          h += '<span class="absolute top-2.5 start-2.5 bg-red-500 text-white text-[11px] font-semibold px-2 py-0.5 rounded">-' + disc + '%</span>';
        }

        // Wishlist
        if (cs.showWishlist) {
          h += '<button @click.prevent="toggleWishlist()" :disabled="wishlistLoading" class="wishlist-btn absolute top-2.5 end-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm transition-all hover:scale-110" :class="inWishlist ? \'text-red-500\' : \'text-gray-400 hover:text-red-400\'">';
          h += '<svg class="w-4 h-4" :fill="inWishlist ? \'currentColor\' : \'none\'" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>';
          h += '</button>';
        }

        h += '</a>';

        // Content
        h += '<div class="p-3 pt-2 flex flex-col flex-1">';
        h += '<a href="/product/' + product.slug + '" class="block text-sm font-medium text-gray-900 ' + lineClamp + ' leading-snug mb-2 hover:text-primary transition-colors">' + title + '</a>';

        // Rating
        if (cs.showRating && product.averageRating > 0) {
          h += '<div class="flex items-center gap-0.5 mb-2">';
          for (var i = 0; i < 5; i++) {
            h += '<svg class="w-3.5 h-3.5 ' + (i < product.averageRating ? 'text-amber-400' : 'text-gray-200') + '" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>';
          }
          h += '<span class="text-[11px] text-gray-400 ms-1">(' + (product.reviewsCount || 0) + ')</span></div>';
        }

        // Color swatches
        if (cs.showOptions && product.options) {
          product.options.forEach(function(opt) {
            if (opt.type === 'color' && opt.values && opt.values.length) {
              h += '<div class="flex items-center gap-1.5 mb-2">';
              opt.values.forEach(function(v) {
                h += '<span class="w-4 h-4 rounded-full border border-gray-300 shrink-0" style="background-color: ' + (v.value || '#fff') + ';" title="' + (v.label || '') + '"></span>';
              });
              h += '</div>';
            }
          });
        }

        // Price
        h += '<div class="mt-auto"><div class="flex items-baseline gap-2' + (cs.showButton ? ' mb-2.5' : '') + '">';
        h += '<span class="text-base font-bold text-gray-900">' + Utils.formatMoney(price) + '</span>';
        if (cs.showComparePrice && hasDiscount) {
          h += '<span class="text-xs text-gray-400 line-through">' + Utils.formatMoney(compareAtPrice) + '</span>';
        }
        h += '</div>';

        // Button
        if (cs.showButton) {
          if (canPurchase) {
            if (product.variantsCount > 0) {
              h += '<a href="/product/' + product.slug + '" class="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-lg text-xs font-semibold border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all">';
              h += '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>';
              h += (tr.chooseOptions || '') + '</a>';
            } else {
              h += '<button @click="addToCart()" :disabled="cartLoading || cartSuccess" class="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-lg text-xs font-semibold transition-all" :class="cartSuccess ? \'bg-green-500 text-white border-2 border-green-500\' : \'bg-primary text-white border-2 border-primary hover:bg-primary-dark hover:border-primary-dark\'">';
              h += '<template x-if="cartLoading"><svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg></template>';
              h += '<template x-if="cartSuccess"><svg class="w-4 h-4 animate-check" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg></template>';
              h += '<template x-if="!cartLoading && !cartSuccess"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg></template>';
              h += '<span x-show="!cartLoading && !cartSuccess">' + (tr.addToCart || '') + '</span>';
              h += '<span x-show="cartSuccess" x-cloak>' + (tr.added || '') + '</span>';
              h += '</button>';
            }
          } else {
            h += '<div class="text-center py-2 text-xs text-gray-400 font-medium">' + (tr.outOfStock || '') + '</div>';
          }
        }

        h += '</div></div></div>';
        return h;
      },

      _buildPagination(pagination) {
        var h = '<nav class="flex items-center justify-center gap-1.5 mt-10" aria-label="pagination">';
        if (pagination.currentPage > 1) {
          h += '<button @click.prevent="goToPage(' + (pagination.currentPage - 1) + ')" class="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-primary transition-colors"><svg class="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg></button>';
        } else {
          h += '<span class="w-10 h-10 rounded-xl flex items-center justify-center text-gray-200"><svg class="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg></span>';
        }
        for (var i = 1; i <= pagination.totalPages; i++) {
          if (i === pagination.currentPage) {
            h += '<span class="w-10 h-10 rounded-xl flex items-center justify-center bg-primary text-white font-semibold text-sm">' + i + '</span>';
          } else if (i === 1 || i === pagination.totalPages || (i >= pagination.currentPage - 1 && i <= pagination.currentPage + 1)) {
            h += '<button @click.prevent="goToPage(' + i + ')" class="w-10 h-10 rounded-xl flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:text-primary transition-colors text-sm font-medium">' + i + '</button>';
          } else if (i === pagination.currentPage - 2 || i === pagination.currentPage + 2) {
            h += '<span class="w-6 flex items-center justify-center text-gray-300 text-sm">...</span>';
          }
        }
        if (pagination.hasNextPage) {
          h += '<button @click.prevent="goToPage(' + (pagination.currentPage + 1) + ')" class="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-primary transition-colors"><svg class="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg></button>';
        } else {
          h += '<span class="w-10 h-10 rounded-xl flex items-center justify-center text-gray-200"><svg class="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg></span>';
        }
        h += '</nav>';
        return h;
      },

      init() {
        var self = this;
        window.addEventListener('popstate', function() {
          var params = new URLSearchParams(window.location.search);
          var sort = params.get('sort') || '';
          self.currentSort = _reverseSortMap[sort] || sort;
          self.priceMin = params.get('filters[' + self.rangeHandle + '][min]') || '';
          self.priceMax = params.get('filters[' + self.rangeHandle + '][max]') || '';
          self._fetch(new URL(window.location));
        });
      }
    };
    });

    // --- Product Card Component ---
    Alpine.data('productCard', (productId) => ({
      productId: productId,
      cartLoading: false,
      cartSuccess: false,
      wishlistLoading: false,

      get inWishlist() {
        return Alpine.store('wishlist').has(this.productId);
      },

      async addToCart() {
        if (this.cartLoading) return;
        this.cartLoading = true;
        try {
          await Qumra.cart.add(this.productId);
          this.cartSuccess = true;
          setTimeout(() => { this.cartSuccess = false; }, 2000);
        } catch (e) {
          // Error already handled in CartManager
        } finally {
          this.cartLoading = false;
        }
      },

      async toggleWishlist() {
        if (this.wishlistLoading) return;
        this.wishlistLoading = true;
        try {
          await Qumra.wishlist.toggle(this.productId, this.inWishlist);
        } catch (e) {
          // silent
        } finally {
          this.wishlistLoading = false;
        }
      }
    }));
  });

  // ===== Sync Alpine Stores with Events =====
  EventBus.on('cart:updated', (data) => {
    if (window.Alpine && Alpine.store('cart')) {
      Alpine.store('cart').update(data);
    }
  });

  EventBus.on('wishlist:updated', (data) => {
    if (window.Alpine && Alpine.store('wishlist')) {
      Alpine.store('wishlist').update(data);
    }
  });

  EventBus.on('modal:open', ({ name }) => {
    if (window.Alpine && Alpine.store('modal')) {
      Alpine.store('modal').current = name;
    }
  });

  EventBus.on('modal:close', () => {
    if (window.Alpine && Alpine.store('modal')) {
      Alpine.store('modal').current = null;
    }
  });

})();
